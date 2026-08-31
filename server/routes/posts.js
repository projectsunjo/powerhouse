const express = require('express');
const db = require('../db');
const {
  hashPassword,
  checkPassword,
  randomNickname,
  containsBannedWord,
  hashIp,
  getClientIp,
} = require('../utils/helpers');

const router = express.Router();
const PAGE_SIZE = 20;

// GET /api/posts?page=1&q=검색어&sort=latest|best
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const q = (req.query.q || '').trim();
  const sort = req.query.sort === 'best' ? 'best' : 'latest';
  const offset = (page - 1) * PAGE_SIZE;

  let where = 'WHERE is_hidden = 0';
  const params = [];
  if (q) {
    where += ' AND (title LIKE ? OR content LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }
  if (sort === 'best') {
    where += ' AND likes >= 5';
  }

  const total = db.prepare(`SELECT COUNT(*) AS cnt FROM posts ${where}`).get(...params).cnt;

  const orderBy = sort === 'best' ? 'ORDER BY likes DESC, id DESC' : 'ORDER BY is_notice DESC, id DESC';

  const rows = db
    .prepare(
      `SELECT id, title, nickname, views, likes, is_notice, created_at,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = posts.id AND c.is_hidden = 0) AS comment_count
       FROM posts ${where}
       ${orderBy}
       LIMIT ? OFFSET ?`
    )
    .all(...params, PAGE_SIZE, offset);

  res.json({
    posts: rows,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    total,
  });
});

// GET /api/posts/random-nickname
router.get('/random-nickname', (req, res) => {
  res.json({ nickname: randomNickname() });
});

// GET /api/posts/:id
router.get('/:id', (req, res) => {
  const post = db
    .prepare('SELECT id, title, content, nickname, views, likes, is_notice, created_at FROM posts WHERE id = ? AND is_hidden = 0')
    .get(req.params.id);
  if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

  db.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').run(req.params.id);
  post.views += 1;

  res.json(post);
});

// POST /api/posts
router.post('/', (req, res) => {
  let { title, content, nickname, password } = req.body || {};
  title = (title || '').trim();
  content = (content || '').trim();
  nickname = (nickname || '').trim();
  password = (password || '').trim();

  if (!title || !content) return res.status(400).json({ error: '제목과 내용을 입력해주세요.' });
  if (title.length > 200) return res.status(400).json({ error: '제목이 너무 깁니다.' });
  if (content.length > 10000) return res.status(400).json({ error: '내용이 너무 깁니다.' });
  if (!password || password.length < 4) return res.status(400).json({ error: '비밀번호는 4자 이상이어야 합니다.' });
  if (!nickname) nickname = randomNickname();
  if (nickname.length > 30) return res.status(400).json({ error: '닉네임이 너무 깁니다.' });

  const banned = containsBannedWord(title) || containsBannedWord(content);
  if (banned) return res.status(400).json({ error: '금지어가 포함되어 있습니다.' });

  const info = db
    .prepare('INSERT INTO posts (title, content, nickname, password_hash) VALUES (?, ?, ?, ?)')
    .run(title, content, nickname, hashPassword(password));

  res.status(201).json({ id: info.lastInsertRowid });
});

// POST /api/posts/:id/verify-password
router.post('/:id/verify-password', (req, res) => {
  const post = db.prepare('SELECT password_hash FROM posts WHERE id = ? AND is_hidden = 0').get(req.params.id);
  if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

  const { password } = req.body || {};
  if (!password || !checkPassword(password, post.password_hash)) {
    return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
  }
  res.json({ ok: true });
});

// PUT /api/posts/:id
router.put('/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ? AND is_hidden = 0').get(req.params.id);
  if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

  const { password } = req.body || {};
  if (!password || !checkPassword(password, post.password_hash)) {
    return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
  }

  let { title, content } = req.body || {};
  title = (title || '').trim();
  content = (content || '').trim();
  if (!title || !content) return res.status(400).json({ error: '제목과 내용을 입력해주세요.' });
  if (title.length > 200 || content.length > 10000) return res.status(400).json({ error: '입력값이 너무 깁니다.' });

  const banned = containsBannedWord(title) || containsBannedWord(content);
  if (banned) return res.status(400).json({ error: '금지어가 포함되어 있습니다.' });

  db.prepare('UPDATE posts SET title = ?, content = ? WHERE id = ?').run(title, content, req.params.id);
  res.json({ ok: true });
});

// DELETE /api/posts/:id
router.delete('/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ? AND is_hidden = 0').get(req.params.id);
  if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

  const { password } = req.body || {};
  if (!password || !checkPassword(password, post.password_hash)) {
    return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
  }

  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// POST /api/posts/:id/like
router.post('/:id/like', (req, res) => {
  const post = db.prepare('SELECT id FROM posts WHERE id = ? AND is_hidden = 0').get(req.params.id);
  if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

  const ipHash = hashIp(getClientIp(req));
  try {
    db.prepare('INSERT INTO likes (post_id, ip_hash) VALUES (?, ?)').run(req.params.id, ipHash);
    db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(req.params.id);
  } catch (e) {
    return res.status(409).json({ error: '이미 추천하셨습니다.' });
  }

  const updated = db.prepare('SELECT likes FROM posts WHERE id = ?').get(req.params.id);
  res.json({ likes: updated.likes });
});

// POST /api/posts/:id/report
router.post('/:id/report', (req, res) => {
  const post = db.prepare('SELECT id FROM posts WHERE id = ? AND is_hidden = 0').get(req.params.id);
  if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

  const reason = ((req.body && req.body.reason) || '').trim().slice(0, 500) || '사유 없음';
  db.prepare('INSERT INTO reports (target_type, target_id, reason) VALUES (?, ?, ?)').run('post', req.params.id, reason);
  res.json({ ok: true });
});

module.exports = router;
