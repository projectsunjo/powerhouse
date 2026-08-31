const express = require('express');
const db = require('../db');

const router = express.Router();
const PAGE_SIZE = 10;

// GET /api/market-info/briefings?page=1  -> compact list (no html) for the paginated index
router.get('/briefings', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const total = db.prepare('SELECT COUNT(*) AS cnt FROM briefings').get().cnt;
  const rows = db
    .prepare('SELECT id, created_at FROM briefings ORDER BY id DESC LIMIT ? OFFSET ?')
    .all(PAGE_SIZE, offset);

  res.json({ briefings: rows, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) });
});

// GET /api/market-info/briefings/latest -> full html of the most recent briefing
router.get('/briefings/latest', (req, res) => {
  const row = db.prepare('SELECT id, html, created_at FROM briefings ORDER BY id DESC LIMIT 1').get();
  if (!row) return res.status(404).json({ error: '아직 생성된 브리핑이 없습니다.' });
  res.json(row);
});

// GET /api/market-info/briefings/:id -> full html of one briefing
router.get('/briefings/:id', (req, res) => {
  const row = db.prepare('SELECT id, html, created_at FROM briefings WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: '브리핑을 찾을 수 없습니다.' });
  res.json(row);
});

module.exports = router;
