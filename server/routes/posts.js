const express = require('express');
const { pool } = require('../db');
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
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const q = (req.query.q || '').trim();
    const sort = req.query.sort === 'best' ? 'best' : 'latest';
    const offset = (page - 1) * PAGE_SIZE;

    let where = 'WHERE is_hidden = false';
    const params = [];
    if (q) {
      params.push(`%${q}%`, `%${q}%`);
      where += ` AND (title ILIKE $${params.length - 1} OR content ILIKE $${params.length})`;
    }
    if (sort === 'best') {
      where += ' AND likes >= 5';
    }

    const totalResult = await pool.query(`SELECT COUNT(*)::int AS cnt FROM posts ${where}`, params);
    const total = totalResult.rows[0].cnt;

    const orderBy = sort === 'best' ? 'ORDER BY likes DESC, id DESC' : 'ORDER BY is_notice DESC, id DESC';

    const limitParam = params.length + 1;
    const offsetParam = params.length + 2;
    const { rows } = await pool.query(
      `SELECT id, title, nickname, views, likes, is_notice, created_at,
        (SELECT COUNT(*)::int FROM comments c WHERE c.post_id = posts.id AND c.is_hidden = false) AS comment_count
       FROM posts ${where}
       ${orderBy}
       LIMIT $${limitParam} OFFSET $${offsetParam}`,
      [...params, PAGE_SIZE, offset]
    );

    res.json({
      posts: rows,
      page,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
      total,
    });
  } catch (e) {
    next(e);
  }
});

// GET /api/posts/random-nickname
router.get('/random-nickname', (req, res) => {
  res.json({ nickname: randomNickname() });
});

// GET /api/posts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, content, nickname, views, likes, is_notice, created_at FROM posts WHERE id = $1 AND is_hidden = false',
      [req.params.id]
    );
    const post = rows[0];
    if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    await pool.query('UPDATE posts SET views = views + 1 WHERE id = $1', [req.params.id]);
    post.views += 1;

    res.json(post);
  } catch (e) {
    next(e);
  }
});

// POST /api/posts
router.post('/', async (req, res, next) => {
  try {
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

    const banned = (await containsBannedWord(title)) || (await containsBannedWord(content));
    if (banned) return res.status(400).json({ error: '금지어가 포함되어 있습니다.' });

    const { rows } = await pool.query(
      'INSERT INTO posts (title, content, nickname, password_hash) VALUES ($1, $2, $3, $4) RETURNING id',
      [title, content, nickname, hashPassword(password)]
    );

    res.status(201).json({ id: rows[0].id });
  } catch (e) {
    next(e);
  }
});

// POST /api/posts/:id/verify-password
router.post('/:id/verify-password', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT password_hash FROM posts WHERE id = $1 AND is_hidden = false', [req.params.id]);
    const post = rows[0];
    if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    const { password } = req.body || {};
    if (!password || !checkPassword(password, post.password_hash)) {
      return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// PUT /api/posts/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1 AND is_hidden = false', [req.params.id]);
    const post = rows[0];
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

    const banned = (await containsBannedWord(title)) || (await containsBannedWord(content));
    if (banned) return res.status(400).json({ error: '금지어가 포함되어 있습니다.' });

    await pool.query('UPDATE posts SET title = $1, content = $2 WHERE id = $3', [title, content, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/posts/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1 AND is_hidden = false', [req.params.id]);
    const post = rows[0];
    if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    const { password } = req.body || {};
    if (!password || !checkPassword(password, post.password_hash)) {
      return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// POST /api/posts/:id/like
router.post('/:id/like', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id FROM posts WHERE id = $1 AND is_hidden = false', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    const ipHash = hashIp(getClientIp(req));
    try {
      await pool.query('INSERT INTO likes (post_id, ip_hash) VALUES ($1, $2)', [req.params.id, ipHash]);
      await pool.query('UPDATE posts SET likes = likes + 1 WHERE id = $1', [req.params.id]);
    } catch (e) {
      return res.status(409).json({ error: '이미 추천하셨습니다.' });
    }

    const updated = await pool.query('SELECT likes FROM posts WHERE id = $1', [req.params.id]);
    res.json({ likes: updated.rows[0].likes });
  } catch (e) {
    next(e);
  }
});

// POST /api/posts/:id/report
router.post('/:id/report', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id FROM posts WHERE id = $1 AND is_hidden = false', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    const reason = ((req.body && req.body.reason) || '').trim().slice(0, 500) || '사유 없음';
    await pool.query('INSERT INTO reports (target_type, target_id, reason) VALUES ($1, $2, $3)', ['post', req.params.id, reason]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
