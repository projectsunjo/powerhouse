const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { requireAdmin } = require('../middleware/adminAuth');
const { generateBriefingNow, isGenerating } = require('../briefingGenerator');
const { getBriefingSettings, setSetting } = require('../utils/settings');

const router = express.Router();
const PAGE_SIZE = 20;
const RUNS_PAGE_SIZE = 20;

function timingSafeEqual(a, b) {
  const crypto = require('crypto');
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  if (!password || !adminPassword || !timingSafeEqual(password, adminPassword)) {
    return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '12h' });
  res.cookie('admin_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 12 * 60 * 60 * 1000,
  });
  res.json({ ok: true });
});

// POST /api/admin/logout
router.post('/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ ok: true });
});

// GET /api/admin/me
router.get('/me', requireAdmin, (req, res) => res.json({ ok: true }));

router.use(requireAdmin);

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  const totalPosts = db.prepare('SELECT COUNT(*) AS c FROM posts').get().c;
  const totalComments = db.prepare('SELECT COUNT(*) AS c FROM comments').get().c;
  const todayPosts = db
    .prepare("SELECT COUNT(*) AS c FROM posts WHERE date(created_at) = date('now')")
    .get().c;
  const pendingReports = db.prepare("SELECT COUNT(*) AS c FROM reports WHERE status = 'pending'").get().c;

  res.json({ totalPosts, totalComments, todayPosts, pendingReports });
});

// GET /api/admin/posts?page=&q=
router.get('/posts', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const q = (req.query.q || '').trim();
  const offset = (page - 1) * PAGE_SIZE;

  let where = 'WHERE 1=1';
  const params = [];
  if (q) {
    where += ' AND (title LIKE ? OR content LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }

  const total = db.prepare(`SELECT COUNT(*) AS cnt FROM posts ${where}`).get(...params).cnt;
  const rows = db
    .prepare(
      `SELECT id, title, nickname, views, likes, is_notice, is_hidden, created_at
       FROM posts ${where} ORDER BY id DESC LIMIT ? OFFSET ?`
    )
    .all(...params, PAGE_SIZE, offset);

  res.json({ posts: rows, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)), total });
});

// PATCH /api/admin/posts/:id  { is_notice?, is_hidden? }
router.patch('/posts/:id', (req, res) => {
  const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

  const { is_notice, is_hidden } = req.body || {};
  if (typeof is_notice === 'boolean') {
    db.prepare('UPDATE posts SET is_notice = ? WHERE id = ?').run(is_notice ? 1 : 0, req.params.id);
  }
  if (typeof is_hidden === 'boolean') {
    db.prepare('UPDATE posts SET is_hidden = ? WHERE id = ?').run(is_hidden ? 1 : 0, req.params.id);
  }
  res.json({ ok: true });
});

// DELETE /api/admin/posts/:id
router.delete('/posts/:id', (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// GET /api/admin/comments?page=&postId=
router.get('/comments', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;
  const postId = req.query.postId ? parseInt(req.query.postId, 10) : null;

  let where = 'WHERE 1=1';
  const params = [];
  if (postId) {
    where += ' AND post_id = ?';
    params.push(postId);
  }

  const total = db.prepare(`SELECT COUNT(*) AS cnt FROM comments ${where}`).get(...params).cnt;
  const rows = db
    .prepare(
      `SELECT id, post_id, content, nickname, is_hidden, created_at
       FROM comments ${where} ORDER BY id DESC LIMIT ? OFFSET ?`
    )
    .all(...params, PAGE_SIZE, offset);

  res.json({ comments: rows, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)), total });
});

// DELETE /api/admin/comments/:id
router.delete('/comments/:id', (req, res) => {
  db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// GET /api/admin/reports?status=pending
router.get('/reports', (req, res) => {
  const status = req.query.status === 'resolved' ? 'resolved' : 'pending';
  const rows = db
    .prepare('SELECT * FROM reports WHERE status = ? ORDER BY id DESC LIMIT 100')
    .all(status);
  res.json({ reports: rows });
});

// PATCH /api/admin/reports/:id { status }
router.patch('/reports/:id', (req, res) => {
  const status = req.body && req.body.status === 'resolved' ? 'resolved' : 'pending';
  db.prepare('UPDATE reports SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ ok: true });
});

// GET /api/admin/banned-words
router.get('/banned-words', (req, res) => {
  const rows = db.prepare('SELECT id, word FROM banned_words ORDER BY word ASC').all();
  res.json({ words: rows });
});

// POST /api/admin/banned-words { word }
router.post('/banned-words', (req, res) => {
  const word = ((req.body && req.body.word) || '').trim();
  if (!word) return res.status(400).json({ error: '단어를 입력해주세요.' });
  try {
    db.prepare('INSERT INTO banned_words (word) VALUES (?)').run(word);
  } catch (e) {
    return res.status(409).json({ error: '이미 등록된 단어입니다.' });
  }
  res.status(201).json({ ok: true });
});

// DELETE /api/admin/banned-words/:id
router.delete('/banned-words/:id', (req, res) => {
  db.prepare('DELETE FROM banned_words WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// GET /api/admin/briefings
router.get('/briefings', (req, res) => {
  const rows = db.prepare('SELECT id, html, created_at FROM briefings ORDER BY id DESC').all();
  res.json({ briefings: rows });
});

// GET /api/admin/briefing-runs?page=1  (run log: 시작/완료/이메일 발송 상태)
router.get('/briefing-runs', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const offset = (page - 1) * RUNS_PAGE_SIZE;
  const total = db.prepare('SELECT COUNT(*) AS cnt FROM briefing_runs').get().cnt;
  const rows = db
    .prepare(
      `SELECT id, started_at, completed_at, status, briefing_id, email_status, error
       FROM briefing_runs ORDER BY id DESC LIMIT ? OFFSET ?`
    )
    .all(RUNS_PAGE_SIZE, offset);
  res.json({ runs: rows, page, totalPages: Math.max(1, Math.ceil(total / RUNS_PAGE_SIZE)), total });
});

// DELETE /api/admin/briefing-runs/:id
router.delete('/briefing-runs/:id', (req, res) => {
  db.prepare('DELETE FROM briefing_runs WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// GET /api/admin/briefings/status
router.get('/briefings/status', (req, res) => {
  res.json({ generating: isGenerating() });
});

// POST /api/admin/briefings/generate
router.post('/briefings/generate', (req, res) => {
  const result = generateBriefingNow();
  if (!result.ok) return res.status(409).json({ error: result.error });
  res.json({ ok: true, status: 'started', runId: result.runId });
});

// PATCH /api/admin/briefings/:id  { html }
router.patch('/briefings/:id', (req, res) => {
  const briefing = db.prepare('SELECT id FROM briefings WHERE id = ?').get(req.params.id);
  if (!briefing) return res.status(404).json({ error: '브리핑을 찾을 수 없습니다.' });

  const html = (req.body && req.body.html) || '';
  if (!html.trim()) return res.status(400).json({ error: '내용을 입력해주세요.' });

  db.prepare('UPDATE briefings SET html = ? WHERE id = ?').run(html, req.params.id);
  res.json({ ok: true });
});

// DELETE /api/admin/briefings/:id
router.delete('/briefings/:id', (req, res) => {
  db.prepare('DELETE FROM briefings WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// GET /api/admin/briefing-settings
router.get('/briefing-settings', (req, res) => {
  res.json(getBriefingSettings());
});

// PATCH /api/admin/briefing-settings
router.patch('/briefing-settings', (req, res) => {
  const { scheduleEnabled, scheduleHour, intervalHours, emailRecipients, emailSubjectTemplate } = req.body || {};

  if (typeof scheduleEnabled === 'boolean') {
    setSetting('briefing_schedule_enabled', scheduleEnabled ? '1' : '0');
  }
  if (scheduleHour !== undefined) {
    const hour = parseInt(scheduleHour, 10);
    if (Number.isNaN(hour) || hour < 0 || hour > 23) {
      return res.status(400).json({ error: '시작 시각은 0~23 사이여야 합니다.' });
    }
    setSetting('briefing_schedule_hour', hour);
  }
  if (intervalHours !== undefined) {
    const interval = parseInt(intervalHours, 10);
    if (Number.isNaN(interval) || interval < 1 || interval > 168) {
      return res.status(400).json({ error: '주기는 1~168시간 사이여야 합니다.' });
    }
    setSetting('briefing_interval_hours', interval);
  }
  if (typeof emailRecipients === 'string') {
    setSetting('briefing_email_recipients', emailRecipients.trim());
  }
  if (typeof emailSubjectTemplate === 'string') {
    const tpl = emailSubjectTemplate.trim();
    if (!tpl) return res.status(400).json({ error: '메일 제목 양식을 입력해주세요.' });
    setSetting('briefing_email_subject_template', tpl);
  }

  res.json(getBriefingSettings());
});

module.exports = router;
