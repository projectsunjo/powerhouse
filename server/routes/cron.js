const express = require('express');
const { pool } = require('../db');
const { triggerBriefingWorkflow } = require('../utils/github');
const { expireStaleRuns, briefingToday, runInFlight } = require('../utils/briefingRuns');

const router = express.Router();

// GET /api/cron/briefing - Triggered by Vercel Cron at 08:00 KST (23:00 UTC)
router.get('/briefing', async (req, res, next) => {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    // Runs daily whether or not the runner PC is on, so it's also where rows
    // orphaned by an offline runner get closed out.
    await expireStaleRuns();

    // 1. Strict 1-per-day check (KST)
    const existing = await briefingToday();
    if (existing) {
      console.log(`[Cron] Today's briefing (#${existing.id}) was already generated. Skipping.`);
      return res.json({ ok: true, skipped: true, reason: 'Already generated today', briefingId: existing.id });
    }

    // 2. Don't dispatch a second run while one is still generating
    const inFlight = await runInFlight();
    if (inFlight) {
      console.log(`[Cron] A briefing run (#${inFlight.id}) is already in progress. Skipping.`);
      return res.json({ ok: true, skipped: true, reason: 'Run already in progress', runId: inFlight.id });
    }

    console.log('[Cron] Vercel Cron triggered daily briefing dispatch');
    const { rows } = await pool.query(
      "INSERT INTO briefing_runs (status, trigger_type) VALUES ('running', 'auto') RETURNING id"
    );
    const runId = rows[0].id;
    await triggerBriefingWorkflow(runId);
    res.json({ ok: true, status: 'started', runId });
  } catch (err) {
    console.error('[Cron error]', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
