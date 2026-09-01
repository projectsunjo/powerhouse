const express = require('express');
const { pool } = require('../db');
const { hashPassword, checkPassword, randomNickname, containsBannedWord } = require('../utils/helpers');

const router = express.Router();

// GET /api/posts/:postId/comments
router.get('/posts/:postId/comments', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, content, nickname, created_at, parent_id FROM comments
       WHERE post_id = $1 AND is_hidden = false
       ORDER BY COALESCE(parent_id, id) ASC, id ASC`,
      [req.params.postId]
    );
    res.json({ comments: rows });
  } catch (e) {
    next(e);
  }
});

// POST /api/posts/:postId/comments
router.post('/posts/:postId/comments', async (req, res, next) => {
  try {
    const postResult = await pool.query('SELECT id FROM posts WHERE id = $1 AND is_hidden = false', [req.params.postId]);
    if (!postResult.rows[0]) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    let { content, nickname, password, parent_id } = req.body || {};
    content = (content || '').trim();
    nickname = (nickname || '').trim();
    password = (password || '').trim();
    parent_id = parent_id ? parseInt(parent_id, 10) : null;

    if (!content) return res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
    if (content.length > 2000) return res.status(400).json({ error: '댓글이 너무 깁니다.' });
    if (!password || password.length < 4) return res.status(400).json({ error: '비밀번호는 4자 이상이어야 합니다.' });
    if (!nickname) nickname = randomNickname();
    if (nickname.length > 30) return res.status(400).json({ error: '닉네임이 너무 깁니다.' });

    const banned = await containsBannedWord(content);
    if (banned) return res.status(400).json({ error: '금지어가 포함되어 있습니다.' });

    if (parent_id) {
      const parentResult = await pool.query(
        'SELECT id, post_id, parent_id FROM comments WHERE id = $1 AND is_hidden = false',
        [parent_id]
      );
      const parent = parentResult.rows[0];
      if (!parent || parent.post_id !== Number(req.params.postId)) {
        return res.status(404).json({ error: '원본 댓글을 찾을 수 없습니다.' });
      }
      if (parent.parent_id) {
        return res.status(400).json({ error: '대댓글에는 답글을 남길 수 없습니다.' });
      }
    }

    const { rows } = await pool.query(
      'INSERT INTO comments (post_id, content, nickname, password_hash, parent_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [req.params.postId, content, nickname, hashPassword(password), parent_id]
    );

    res.status(201).json({ id: rows[0].id });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/comments/:id
router.delete('/comments/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM comments WHERE id = $1 AND is_hidden = false', [req.params.id]);
    const comment = rows[0];
    if (!comment) return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });

    const { password } = req.body || {};
    if (!password || !checkPassword(password, comment.password_hash)) {
      return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    await pool.query('DELETE FROM comments WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// POST /api/comments/:id/report
router.post('/comments/:id/report', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id FROM comments WHERE id = $1 AND is_hidden = false', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });

    const reason = ((req.body && req.body.reason) || '').trim().slice(0, 500) || '사유 없음';
    await pool.query('INSERT INTO reports (target_type, target_id, reason) VALUES ($1, $2, $3)', ['comment', req.params.id, reason]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
