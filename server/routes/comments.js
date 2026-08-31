const express = require('express');
const db = require('../db');
const { hashPassword, checkPassword, randomNickname, containsBannedWord } = require('../utils/helpers');

const router = express.Router();

// GET /api/posts/:postId/comments
router.get('/posts/:postId/comments', (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, content, nickname, created_at, parent_id FROM comments
       WHERE post_id = ? AND is_hidden = 0
       ORDER BY COALESCE(parent_id, id) ASC, id ASC`
    )
    .all(req.params.postId);
  res.json({ comments: rows });
});

// POST /api/posts/:postId/comments
router.post('/posts/:postId/comments', (req, res) => {
  const post = db.prepare('SELECT id FROM posts WHERE id = ? AND is_hidden = 0').get(req.params.postId);
  if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

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

  const banned = containsBannedWord(content);
  if (banned) return res.status(400).json({ error: '금지어가 포함되어 있습니다.' });

  if (parent_id) {
    const parent = db
      .prepare('SELECT id, post_id, parent_id FROM comments WHERE id = ? AND is_hidden = 0')
      .get(parent_id);
    if (!parent || parent.post_id !== Number(req.params.postId)) {
      return res.status(404).json({ error: '원본 댓글을 찾을 수 없습니다.' });
    }
    if (parent.parent_id) {
      return res.status(400).json({ error: '대댓글에는 답글을 남길 수 없습니다.' });
    }
  }

  const info = db
    .prepare('INSERT INTO comments (post_id, content, nickname, password_hash, parent_id) VALUES (?, ?, ?, ?, ?)')
    .run(req.params.postId, content, nickname, hashPassword(password), parent_id);

  res.status(201).json({ id: info.lastInsertRowid });
});

// DELETE /api/comments/:id
router.delete('/comments/:id', (req, res) => {
  const comment = db.prepare('SELECT * FROM comments WHERE id = ? AND is_hidden = 0').get(req.params.id);
  if (!comment) return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });

  const { password } = req.body || {};
  if (!password || !checkPassword(password, comment.password_hash)) {
    return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
  }

  db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// POST /api/comments/:id/report
router.post('/comments/:id/report', (req, res) => {
  const comment = db.prepare('SELECT id FROM comments WHERE id = ? AND is_hidden = 0').get(req.params.id);
  if (!comment) return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });

  const reason = ((req.body && req.body.reason) || '').trim().slice(0, 500) || '사유 없음';
  db.prepare('INSERT INTO reports (target_type, target_id, reason) VALUES (?, ?, ?)').run('comment', req.params.id, reason);
  res.json({ ok: true });
});

module.exports = router;
