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
const { sendBriefingEmail } = require('../utils/mailer');

const router = express.Router();

router.use((req, res, next) => {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret || req.headers['x-internal-secret'] !== secret) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
});

async function shouldRunScheduled() {
  const enabled = (await getSetting('briefing_schedule_enabled', '1')) === '1';
  if (!enabled) return false;

  const intervalHours = parseInt(await getSetting('briefing_interval_hours', '24'), 10);
  const scheduleHour = parseInt(await getSetting('briefing_schedule_hour', '8'), 10);
  const lastRunAt = await getSetting('briefing_last_scheduled_run_at', null);

  const now = new Date();
  let nextRunAt;
  if (lastRunAt) {
    nextRunAt = new Date(lastRunAt).getTime() + intervalHours * 3600 * 1000;
  } else {
    const anchor = new Date(now);
    anchor.setUTCHours(scheduleHour, 0, 0, 0);
    if (anchor.getTime() > now.getTime()) anchor.setUTCDate(anchor.getUTCDate() - 1);
    nextRunAt = anchor.getTime();
  }
  return now.getTime() >= nextRunAt;
}

// POST /api/internal/briefing/start { force, runId? }
// runId is set when a specific admin-triggered run (already inserted as
// 'running' by POST /api/admin/briefings/generate) should be reused instead
// of creating a fresh row — keeps the "지금생성" button's row in sync with
// the actual Action run instead of racing a stale previous row.
router.post('/briefing/start', async (req, res, next) => {
  try {
    const { force, runId } = req.body || {};
    if (runId) return res.json({ proceed: true, runId: Number(runId) });

    if (!force && !(await shouldRunScheduled())) {
      return res.json({ proceed: false });
    }

    await setSetting('briefing_last_scheduled_run_at', new Date().toISOString());
    const { rows } = await pool.query("INSERT INTO briefing_runs (status) VALUES ('running') RETURNING id");
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

    const emailRecipients = await getSetting('briefing_email_recipients', '');
    const emailSubjectTemplate = await getSetting(
      'briefing_email_subject_template',
      '[ESMI 마켓봇] 국내외 전력 및 SOFC 관련 {날짜}'
    );
    let emailStatus;
    try {
      emailStatus = await sendBriefingEmail(html, briefing.created_at.toISOString(), emailRecipients, emailSubjectTemplate);
    } catch (e) {
      emailStatus = `이메일 발송 실패: ${e.message}`;
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

module.exports = router;
