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
async function shouldRunScheduled() {
  const enabled = (await getSetting('briefing_schedule_enabled', '1')) === '1';
  if (!enabled) return false;

  const intervalHours = parseInt(await getSetting('briefing_interval_hours', '24'), 10);
  const scheduleHour = parseInt(await getSetting('briefing_schedule_hour', '8'), 10);
  const lastRunAt = await getSetting('briefing_last_scheduled_run_at', null);

  const now = new Date();
  const nowMs = now.getTime();
  const intervalMs = intervalHours * 3600 * 1000;

  // scheduleHour is a KST (UTC+9) wall-clock hour. Shift "now" into a Date
  // whose UTC-getters read as KST wall-clock, set the hour there, then
  // shift back to get the real UTC instant for that KST time today.
  const kstNow = new Date(nowMs + KST_OFFSET_MS);
  const anchorKst = new Date(kstNow);
  anchorKst.setUTCHours(scheduleHour, 0, 0, 0);
  const todayAnchorMs = anchorKst.getTime() - KST_OFFSET_MS;

  // Walk that anchor forward/backward by whole intervals to land on the
  // latest slot that is not in the future.
  let slotMs = todayAnchorMs;
  if (slotMs > nowMs) {
    slotMs -= Math.ceil((slotMs - nowMs) / intervalMs) * intervalMs;
  } else {
    slotMs += Math.floor((nowMs - slotMs) / intervalMs) * intervalMs;
  }

  if (lastRunAt && new Date(lastRunAt).getTime() >= slotMs) return false;
  return nowMs >= slotMs;
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
    const { runId, html } = req.body || {};
    if (!runId || !html) return res.status(400).json({ error: 'runId, html required' });

    const insertResult = await pool.query('INSERT INTO briefings (html) VALUES ($1) RETURNING id, created_at', [html]);
    const briefing = insertResult.rows[0];

    const runResult = await pool.query('SELECT trigger_type FROM briefing_runs WHERE id = $1', [runId]);
    const triggerType = runResult.rows[0] ? runResult.rows[0].trigger_type : 'auto';
    const emailStatus = await sendAndLogBriefingEmail(briefing.id, html, briefing.created_at.toISOString(), triggerType);

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

module.exports = router;
