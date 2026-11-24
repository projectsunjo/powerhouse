// Endpoints called by scripts/generate-briefing.js (running on the self-hosted
// GitHub Actions runner). That runner sits on the same corporate network as
// local dev, which blocks outbound Postgres (6543) and SMTP (465/587) — so
// the script never touches the DB or sends mail directly. Instead it only
// runs the `claude` CLI research locally (the one thing that needs the
// allowlisted org IP) and reports back over plain HTTPS to this app, which
// runs on Vercel and has unrestricted network access to Supabase/Gmail.
const express = require('express');
const { pool } = require('../db');
const { getSetting, setSetting } = require('../utils/settings');
const { sendAndLogBriefingEmail } = require('../utils/mailer');
const {
  expireStaleRuns,
  briefingToday,
  runInFlight,
  autoFailuresToday,
  MAX_AUTO_FAILURES_PER_DAY,
} = require('../utils/briefingRuns');

const KST_OFFSET_MS = 9 * 3600 * 1000;

const router = express.Router();

router.use((req, res, next) => {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret || req.headers['x-internal-secret'] !== secret) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
});

// Decides whether an hourly GitHub-schedule tick should generate the briefing.
//
// 1. Scheduling must be enabled.
// 2. Only inside the morning window (scheduleHour ~ 10:59 KST). Late ticks
//    still fire inside the window, so a queued or delayed cron doesn't lose
//    the day — that is also how a failed morning run gets retried.
// 3. One briefing per KST day: if any briefing (auto or manual) already exists
//    today, stop.
// 4. Don't start a second run while one is still generating.
// 5. Give up after MAX_AUTO_FAILURES_PER_DAY failed auto runs today, so a
//    non-transient error doesn't burn every tick.
//
// This used to also write briefing_last_scheduled_run_at at the *start* of a
// run and refuse any later tick that saw today's date there. That stopped
// double-firing, but it meant one failed attempt blocked every retry for the
// rest of the day — on 2026-11-24 a single model error at 08:41 left the day
// with no briefing even though the runner was online for the remaining ticks.
// Rules 3 and 4 cover double-firing without that side effect, so the marker is
// now only written when a run actually succeeds (see /briefing/complete).
async function shouldRunScheduled() {
  const enabled = (await getSetting('briefing_schedule_enabled', '1')) === '1';
  if (!enabled) return { run: false, reason: 'schedule disabled' };

  const scheduleHour = parseInt(await getSetting('briefing_schedule_hour', '8'), 10);
  const kstHour = new Date(Date.now() + KST_OFFSET_MS).getUTCHours();
  if (kstHour < scheduleHour || kstHour >= 11) {
    return { run: false, reason: `KST ${kstHour}시는 실행 시간대(${scheduleHour}~10시) 밖` };
  }

  const existing = await briefingToday();
  if (existing) return { run: false, reason: `오늘 브리핑(#${existing.id}) 이미 생성됨` };

  const inFlight = await runInFlight();
  if (inFlight) return { run: false, reason: `실행 #${inFlight.id} 진행 중` };

  const failures = await autoFailuresToday();
  if (failures >= MAX_AUTO_FAILURES_PER_DAY) {
    return { run: false, reason: `오늘 자동 실행 ${failures}회 실패 — 재시도 중단` };
  }

  return { run: true, reason: failures ? `재시도 (오늘 ${failures}회 실패 후)` : 'scheduled' };
}

// POST /api/internal/briefing/start { force, runId? }
// runId is set when the run row was inserted before dispatch — by the
// 지금생성 button (manual) or the Vercel cron (auto) — so the Action reuses
// that row instead of creating a fresh one.
router.post('/briefing/start', async (req, res, next) => {
  try {
    const { force, runId } = req.body || {};

    // Reaching here at all proves the self-hosted runner is alive and the
    // hourly cron actually fired — record it regardless of what happens
    // next, so the admin dashboard can tell "runner is offline" apart from
    // "runner checked in but decided it wasn't due yet".
    await setSetting('briefing_last_heartbeat_at', new Date().toISOString());
    await expireStaleRuns();

    if (runId) {
      const { rows } = await pool.query('SELECT trigger_type FROM briefing_runs WHERE id = $1', [runId]);
      const triggerType = rows[0] ? rows[0].trigger_type : 'manual';

      // The Vercel cron's job can sit in GitHub's queue behind the hourly
      // schedule ticks (all of them pile up while the runner PC is off). If one
      // of those already produced today's briefing, running this one too would
      // mail a duplicate. The 지금생성 button is an explicit request, so it
      // always proceeds.
      if (triggerType === 'auto') {
        const existing = await briefingToday();
        if (existing) {
          await pool.query(
            "UPDATE briefing_runs SET status = 'success', completed_at = NOW(), briefing_id = $1, email_status = $2 WHERE id = $3",
            [existing.id, `건너뜀: 오늘 브리핑(#${existing.id})이 이미 생성됨`, runId]
          );
          return res.json({ proceed: false, reason: `오늘 브리핑(#${existing.id}) 이미 생성됨` });
        }
      }
      return res.json({ proceed: true, runId: Number(runId) });
    }

    // force with no runId means the Action was dispatched directly (e.g.
    // from GitHub's own UI/CLI) rather than through the 지금생성 button —
    // treat it as manual.
    if (force) {
      const { rows } = await pool.query("INSERT INTO briefing_runs (status, trigger_type) VALUES ('running', 'manual') RETURNING id");
      return res.json({ proceed: true, runId: rows[0].id });
    }

    const decision = await shouldRunScheduled();
    console.log(`[Schedule] ${decision.run ? 'run' : 'skip'}: ${decision.reason}`);
    if (!decision.run) return res.json({ proceed: false, reason: decision.reason });

    const { rows } = await pool.query("INSERT INTO briefing_runs (status, trigger_type) VALUES ('running', 'auto') RETURNING id");
    res.json({ proceed: true, runId: rows[0].id, reason: decision.reason });
  } catch (e) {
    next(e);
  }
});

// POST /api/internal/briefing/complete { runId, html }
router.post('/briefing/complete', async (req, res, next) => {
  try {
    const { runId, html, skipEmail, notes } = req.body || {};
    if (!runId || !html) return res.status(400).json({ error: 'runId, html required' });

    const insertResult = await pool.query('INSERT INTO briefings (html) VALUES ($1) RETURNING id, created_at', [html]);
    const briefing = insertResult.rows[0];

    const runResult = await pool.query('SELECT trigger_type FROM briefing_runs WHERE id = $1', [runId]);
    const triggerType = runResult.rows[0] ? runResult.rows[0].trigger_type : 'auto';

    let emailStatus = '이메일 발송 건너뜀 (테스트 모드)';
    if (!skipEmail) {
      emailStatus = await sendAndLogBriefingEmail(briefing.id, html, briefing.created_at.toISOString(), triggerType);
    }

    if (triggerType === 'auto') {
      await setSetting('briefing_last_scheduled_run_at', new Date().toISOString());
    }

    await pool.query(
      "UPDATE briefing_runs SET completed_at = NOW(), status = 'success', briefing_id = $1, email_status = $2, notes = $3 WHERE id = $4",
      [briefing.id, emailStatus, notes ? String(notes).slice(0, 2000) : null, runId]
    );
    res.json({ ok: true, emailStatus });
  } catch (e) {
    next(e);
  }
});

// POST /api/internal/briefing/fail { runId, error }
router.post('/briefing/fail', async (req, res, next) => {
  try {
    const { runId, error } = req.body || {};
    if (!runId) return res.status(400).json({ error: 'runId required' });
    await pool.query("UPDATE briefing_runs SET completed_at = NOW(), status = 'failed', error = $1 WHERE id = $2", [
      String(error || '알 수 없는 오류').slice(0, 1500),
      runId,
    ]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// POST /api/internal/briefing/setting or /setting { key, value }
const handleSetting = async (req, res, next) => {
  try {
    const { key, value } = req.body || {};
    if (!key) return res.status(400).json({ error: 'key required' });
    await setSetting(key, String(value));
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};
router.post('/briefing/setting', handleSetting);
router.post('/setting', handleSetting);

// POST /api/internal/briefing/update-html { id, html, resendEmail }
router.post('/briefing/update-html', async (req, res, next) => {
  try {
    const { id, html, resendEmail } = req.body || {};
    if (!id || !html) return res.status(400).json({ error: 'id and html required' });
    await pool.query('UPDATE briefings SET html = $1 WHERE id = $2', [html, id]);
    let emailStatus = null;
    if (resendEmail) {
      const { rows } = await pool.query('SELECT created_at FROM briefings WHERE id = $1', [id]);
      const createdAt = rows[0] ? rows[0].created_at.toISOString() : new Date().toISOString();
      emailStatus = await sendAndLogBriefingEmail(id, html, createdAt, 'manual');
    }
    res.json({ ok: true, emailStatus });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
