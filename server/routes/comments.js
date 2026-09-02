const express = require('express');
const { pool } = require('../db');
const { hashPassword, checkPassword, randomNickname, containsBannedWord } = require('../utils/helpers');
const { getUserFromRequest } = require('../utils/userAuth');

const router = express.Router();

function canViewPrivate(post, payload) {
  return !!(payload && post.target_user_id && payload.userId === post.target_user_id);
}

// GET /api/posts/:postId/comments
router.get('/posts/:postId/comments', async (req, res, next) => {
  try {
    const postResult = await pool.query(
      'SELECT category, is_private, target_user_id, password_hash FROM posts WHERE id = $1',
      [req.params.postId]
    );
    const post = postResult.rows[0];
    if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    const payload = getUserFromRequest(req);
    const postPassword = req.headers['x-post-password'];
    const isPartyToThread =
      canViewPrivate(post, payload) || (postPassword && checkPassword(postPassword, post.password_hash));

    // A fully private 건의 thread hides its whole comment list from anyone
    // but the two parties; a public thread only redacts individually
    // marked-private replies (the target 임원 answering privately).
    if (post.category === 'suggestion' && post.is_private && !isPartyToThread) {
      return res.json({ comments: [], restricted: true });
    }

    const { rows } = await pool.query(
      `SELECT comments.id, content, nickname, comments.created_at, parent_id, is_private, is_official,
        comments.user_id, u.profile_image_url AS user_image_url
       FROM comments LEFT JOIN users u ON u.id = comments.user_id
       WHERE post_id = $1 AND is_hidden = false
       ORDER BY COALESCE(parent_id, id) ASC, id ASC`,
      [req.params.postId]
    );

    for (const c of rows) {
      if (c.is_private && !isPartyToThread) c.content = null;
    }

    res.json({ comments: rows });
  } catch (e) {
    next(e);
  }
});

// POST /api/posts/:postId/comments
router.post('/posts/:postId/comments', async (req, res, next) => {
  try {
    const postResult = await pool.query(
      'SELECT id, category, is_private, target_user_id, password_hash FROM posts WHERE id = $1 AND is_hidden = false',
      [req.params.postId]
    );
    const post = postResult.rows[0];
    if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    let { content, nickname, password, parent_id, is_private, is_official } = req.body || {};
    content = (content || '').trim();
    nickname = (nickname || '').trim();
    password = (password || '').trim();
    parent_id = parent_id ? parseInt(parent_id, 10) : null;

    if (!content) return res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
    if (content.length > 2000) return res.status(400).json({ error: '댓글이 너무 깁니다.' });

    // Only the post's target 임원/그룹장 (logged in) can mark a reply
    // private, or as the badge-carrying "공식답변" (official answer).
    const payload = getUserFromRequest(req);
    const isTargetExec = canViewPrivate(post, payload);
    const isPrivateComment = isTargetExec && !!is_private;

    if (post.category === 'suggestion' && post.is_private) {
      const postPassword = req.headers['x-post-password'];
      const isAuthor = postPassword && checkPassword(postPassword, post.password_hash);
      if (!isTargetExec && !isAuthor) {
        return res.status(403).json({ error: '비밀글에는 작성자와 대상자만 댓글을 남길 수 있습니다.' });
      }
    }

    // 건의 게시판은 제출자와 마찬가지로 댓글도 기본 익명 — 대상 임원이
    // "공식답변"으로 명시할 때만 실명이 드러난다. 일반 게시판은 기존처럼
    // 프로필 노출을 켠 임원이면 실명으로 남는다.
    let userId = null;
    let isOfficialComment = false;
    if (post.category === 'suggestion') {
      if (isTargetExec && is_official) {
        const { rows: urows } = await pool.query('SELECT display_name FROM users WHERE id = $1', [payload.userId]);
        userId = payload.userId;
        nickname = urows[0].display_name;
        isOfficialComment = true;
      }
    } else if (payload && payload.role === 'executive') {
      const { rows: urows } = await pool.query('SELECT display_name, profile_visible FROM users WHERE id = $1', [
        payload.userId,
      ]);
      if (urows[0] && urows[0].profile_visible) {
        userId = payload.userId;
        nickname = urows[0].display_name;
      }
    }

    if (!userId) {
      if (!password || password.length < 4) return res.status(400).json({ error: '비밀번호는 4자 이상이어야 합니다.' });
      if (!nickname) nickname = randomNickname();
      if (nickname.length > 30) return res.status(400).json({ error: '닉네임이 너무 깁니다.' });
    }

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
      `INSERT INTO comments (post_id, content, nickname, password_hash, parent_id, user_id, is_private, is_official)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        req.params.postId,
        content,
        nickname,
        userId ? hashPassword(randomNickname()) : hashPassword(password),
        parent_id,
        userId,
        isPrivateComment,
        isOfficialComment,
      ]
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

    if (comment.user_id) {
      const payload = getUserFromRequest(req);
      if (!payload || payload.userId !== comment.user_id) {
        return res.status(403).json({ error: '삭제 권한이 없습니다.' });
      }
    } else {
      const { password } = req.body || {};
      if (!password || !checkPassword(password, comment.password_hash)) {
        return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
      }
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
