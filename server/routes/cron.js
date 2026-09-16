const express = require('express');
const { pool } = require('../db');
const { triggerBriefingWorkflow } = require('../utils/github');

const router = express.Router();

// GET /api/cron/briefing - Triggered by Vercel Cron at 08:00 KST (23:00 UTC)
router.get('/briefing', async (req, res, next) => {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    // 1. Strict 1-per-day check: Check if a briefing was already created today in KST
    const { rows: todayBriefings } = await pool.query(`
      SELECT id FROM briefings 
      WHERE (created_at + INTERVAL '9 hours')::date = (NOW() + INTERVAL '9 hours')::date 
      LIMIT 1
    `);
    if (todayBriefings.length > 0) {
      console.log(`[Cron] Today's briefing (#${todayBriefings[0].id}) was already generated. Skipping.`);
      return res.json({ ok: true, skipped: true, reason: 'Already generated today', briefingId: todayBriefings[0].id });
    }

    // 2. Prevent concurrent runs if one is already running within last 30 minutes
    const { rows: runningRuns } = await pool.query(`
      SELECT id FROM briefing_runs 
      WHERE status = 'running' AND started_at > NOW() - INTERVAL '30 minutes' 
      LIMIT 1
    `);
    if (runningRuns.length > 0) {
      console.log(`[Cron] A briefing run (#${runningRuns[0].id}) is already in progress. Skipping.`);
      return res.json({ ok: true, skipped: true, reason: 'Run already in progress', runId: runningRuns[0].id });
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
