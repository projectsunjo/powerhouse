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
