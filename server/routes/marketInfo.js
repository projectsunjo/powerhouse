const express = require('express');
const { pool } = require('../db');

const router = express.Router();
const PAGE_SIZE = 10;

// GET /api/market-info/briefings?page=1  -> compact list (no html) for the paginated index
router.get('/briefings', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const offset = (page - 1) * PAGE_SIZE;

    const totalResult = await pool.query('SELECT COUNT(*)::int AS cnt FROM briefings');
    const total = totalResult.rows[0].cnt;

    const { rows } = await pool.query(
      'SELECT id, created_at FROM briefings ORDER BY id DESC LIMIT $1 OFFSET $2',
      [PAGE_SIZE, offset]
    );

    res.json({ briefings: rows, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) });
  } catch (e) {
    next(e);
  }
});

// GET /api/market-info/briefings/latest -> full html of the most recent briefing
router.get('/briefings/latest', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, html, created_at FROM briefings ORDER BY id DESC LIMIT 1');
    if (!rows[0]) return res.status(404).json({ error: '아직 생성된 브리핑이 없습니다.' });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// GET /api/market-info/briefings/:id -> full html of one briefing
router.get('/briefings/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, html, created_at FROM briefings WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: '브리핑을 찾을 수 없습니다.' });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
