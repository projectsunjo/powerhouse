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

const KST_OFFSET_MS = 9 * 3600 * 1000;

const router = express.Router();

router.use((req, res, next) => {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret || req.headers['x-internal-secret'] !== secret) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
});

// The next scheduled slot is always derived fresh from scheduleHour +
// intervalHours + the current time — never from lastRunAt directly. An
// earlier version anchored off lastRunAt (lastRunAt + intervalHours), which
// meant a single off-schedule write (e.g. a raw `workflow_dispatch` run
// triggered outside the app, which forces a generation without going
// through the 지금생성 button) permanently dragged every future "scheduled"
// run onto that odd hour — that's why an "auto" send once went out at
// 17:23 instead of the configured 08:00. lastRunAt is only consulted to
// check whether the current slot was already served (avoids double-firing
// across consecutive hourly cron ticks within the same slot window).
// Determines if the scheduled briefing should run right now.
// Rules:
// 1. Must be enabled (briefing_schedule_enabled === '1').
// 2. Window check: Only run during the configured scheduleHour (e.g. 08:00 ~ 08:59 KST).
//    If a cron tick wakes up outside this window (e.g. 10:19, 14:00, etc.), do NOT fire.
// 3. Strict 1-per-day limit: Check if a briefing has already been generated today in KST.
//    If any briefing (manual or auto) was already created today, do NOT generate another one!
// 4. Check lastRunAt to prevent double-firing across consecutive cron ticks within the same 8 AM window.
async function shouldRunScheduled() {
  const enabled = (await getSetting('briefing_schedule_enabled', '1')) === '1';
  if (!enabled) return false;

  const scheduleHour = parseInt(await getSetting('briefing_schedule_hour', '8'), 10);
  const lastRunAt = await getSetting('briefing_last_scheduled_run_at', null);

  const now = new Date();
  const kstNow = new Date(now.getTime() + KST_OFFSET_MS);
  const kstHour = kstNow.getUTCHours(); // KST wall-clock hour (0-23)

  // 1. Morning window check (08:00 ~ 10:59 KST):
  // Never fire before scheduleHour (8 AM), and never fire after 11 AM.
  // Within this morning window, allow execution so that any GitHub Actions queue
  // delays (e.g. cron waking up at 08:30 or 09:15) do NOT cause the daily briefing to be lost.
  if (kstHour < scheduleHour || kstHour >= 11) {
    console.log(`[Schedule] Current KST hour (${kstHour}) is outside morning window (${scheduleHour}~10). Skipping.`);
    return false;
  }

  // 2. Strict 1-per-day check: Check if a briefing was already created today in KST
  const { rows } = await pool.query(`
    SELECT id, created_at FROM briefings 
    WHERE (created_at + INTERVAL '9 hours')::date = (NOW() + INTERVAL '9 hours')::date 
    LIMIT 1
  `);
  if (rows.length > 0) {
    console.log(`[Schedule] Today's briefing (#${rows[0].id}) was already generated. Skipping duplicate run.`);
    return false;
  }

  // 3. Last scheduled run check within today
  if (lastRunAt) {
    const lastRunKst = new Date(new Date(lastRunAt).getTime() + KST_OFFSET_MS);
    if (
      lastRunKst.getUTCFullYear() === kstNow.getUTCFullYear() &&
      lastRunKst.getUTCMonth() === kstNow.getUTCMonth() &&
      lastRunKst.getUTCDate() === kstNow.getUTCDate()
    ) {
      console.log('[Schedule] Already completed a scheduled run today. Skipping.');
      return false;
    }
  }

  return true;
}

// POST /api/internal/briefing/start { force, runId? }
// runId is set when a specific admin-triggered run (already inserted as
// 'running' by POST /api/admin/briefings/generate) should be reused instead
// of creating a fresh row — keeps the "지금생성" button's row in sync with
// the actual Action run instead of racing a stale previous row.
router.post('/briefing/start', async (req, res, next) => {
  try {
    const { force, runId } = req.body || {};

    // Reaching here at all proves the self-hosted runner is alive and the
    // hourly cron actually fired — record it regardless of what happens
    // next, so the admin dashboard can tell "runner is offline" apart from
    // "runner checked in but decided it wasn't due yet".
    await setSetting('briefing_last_heartbeat_at', new Date().toISOString());

    if (runId) return res.json({ proceed: true, runId: Number(runId) });

    // force with no runId means the Action was dispatched directly (e.g.
    // from GitHub's own UI/CLI) rather than through the 지금생성 button —
    // treat it as manual and, critically, never write
    // briefing_last_scheduled_run_at for it: doing so used to drag every
    // future "scheduled" run onto whatever odd hour this ad-hoc dispatch
    // happened to run at.
    if (force) {
      const { rows } = await pool.query("INSERT INTO briefing_runs (status, trigger_type) VALUES ('running', 'manual') RETURNING id");
      return res.json({ proceed: true, runId: rows[0].id });
    }

    if (!(await shouldRunScheduled())) {
      return res.json({ proceed: false });
    }

    await setSetting('briefing_last_scheduled_run_at', new Date().toISOString());
    const { rows } = await pool.query("INSERT INTO briefing_runs (status, trigger_type) VALUES ('running', 'auto') RETURNING id");
    res.json({ proceed: true, runId: rows[0].id });
  } catch (e) {
    next(e);
  }
});

// POST /api/internal/briefing/complete { runId, html }
router.post('/briefing/complete', async (req, res, next) => {
  try {
    const { runId, html, skipEmail } = req.body || {};
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
      "UPDATE briefing_runs SET completed_at = NOW(), status = 'success', briefing_id = $1, email_status = $2 WHERE id = $3",
      [briefing.id, emailStatus, runId]
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
      String(error || '알 수 없는 오류').slice(0, 500),
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
