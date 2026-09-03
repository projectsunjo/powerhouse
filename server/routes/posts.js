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
const { getUserFromRequest } = require('../utils/userAuth');

const router = express.Router();
const PAGE_SIZE = 20;

// A private 건의(suggestion) post's content — and any individually-marked
// private reply on it — is only visible to: the post's target executive
// (via login), 웹마스터/익명게시판 지킴이 (moderation oversight), or its
// anonymous author (proven by the post password elsewhere, the same
// mechanism used for edit/delete — not handled here).
function canViewPrivate(post, payload) {
  if (!payload) return false;
  if (payload.role === 'webmaster' || payload.role === 'board_keeper') return true;
  return !!(post.target_user_id && payload.userId === post.target_user_id);
}

// GET /api/posts?page=1&q=검색어&sort=all|best|general|suggestion&target=...
//
// The board is one underlying list — "최신순"(sort=all, the default) shows
// every post regardless of category, newest first. The other sort values
// are just filters on top of that same list: best (likes>=5), general
// (일반 글 only), suggestion (건의 only, optionally narrowed further by
// target: 'me' | 'general' [일반건의, no specific target] | an exec's id).
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const q = (req.query.q || '').trim();
    const sort = ['best', 'general', 'suggestion'].includes(req.query.sort) ? req.query.sort : 'all';
    const offset = (page - 1) * PAGE_SIZE;

    const viewer = getUserFromRequest(req);

    let where = 'WHERE posts.is_hidden = false';
    const params = [];
    if (q) {
      params.push(`%${q}%`, `%${q}%`);
      where += ` AND (title ILIKE $${params.length - 1} OR content ILIKE $${params.length})`;
    }
    if (sort === 'general') {
      where += " AND category = 'general'";
    } else if (sort === 'best') {
      where += ' AND likes >= 5';
    } else if (sort === 'suggestion') {
      where += " AND category = 'suggestion'";
      const target = req.query.target;
      if (target === 'me') {
        if (!viewer) return res.status(401).json({ error: '로그인이 필요합니다.' });
        params.push(viewer.userId);
        where += ` AND target_user_id = $${params.length}`;
      } else if (target === 'general') {
        where += ' AND target_user_id IS NULL';
      } else if (target) {
        const targetId = parseInt(target, 10);
        if (targetId) {
          params.push(targetId);
          where += ` AND target_user_id = $${params.length}`;
        }
      }
    }

    const totalResult = await pool.query(`SELECT COUNT(*)::int AS cnt FROM posts ${where}`, params);
    const total = totalResult.rows[0].cnt;

    const orderBy = sort === 'best' ? 'ORDER BY likes DESC, id DESC' : 'ORDER BY is_notice DESC, id DESC';

    const limitParam = params.length + 1;
    const offsetParam = params.length + 2;
    const { rows } = await pool.query(
      `SELECT posts.id, title, nickname, views, likes, is_notice, posts.created_at, category, is_private, target_user_id,
        tu.display_name AS target_name, tu.profile_image_url AS target_image_url,
        (SELECT COUNT(*)::int FROM comments c WHERE c.post_id = posts.id AND c.is_hidden = false) AS comment_count,
        EXISTS(SELECT 1 FROM comments oc WHERE oc.post_id = posts.id AND oc.is_official = true) AS has_official_reply
       FROM posts
       LEFT JOIN users tu ON tu.id = posts.target_user_id
       ${where}
       ${orderBy}
       LIMIT $${limitParam} OFFSET $${offsetParam}`,
      [...params, PAGE_SIZE, offset]
    );

    for (const row of rows) {
      if (row.category === 'suggestion' && row.is_private && !canViewPrivate(row, viewer)) {
        row.title = null;
        row.restricted = true;
      }
    }

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
      `SELECT posts.id, title, content, nickname, views, likes, is_notice, posts.created_at,
        category, is_private, target_user_id, user_id, tu.display_name AS target_name, tu.profile_image_url AS target_image_url,
        au.profile_image_url AS author_image_url
       FROM posts
       LEFT JOIN users tu ON tu.id = posts.target_user_id
       LEFT JOIN users au ON au.id = posts.user_id
       WHERE posts.id = $1 AND posts.is_hidden = false`,
      [req.params.id]
    );
    const post = rows[0];
    if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    await pool.query('UPDATE posts SET views = views + 1 WHERE id = $1', [req.params.id]);
    post.views += 1;

    if (post.category === 'suggestion' && post.is_private) {
      const payload = getUserFromRequest(req);
      if (!canViewPrivate(post, payload)) {
        post.title = null;
        post.content = null;
        post.restricted = true;
      }
    }

    res.json(post);
  } catch (e) {
    next(e);
  }
});

// POST /api/posts/:id/unlock { password } — reveals a private 건의 post's
// content for its anonymous author, proven the same way edit/delete are.
router.post('/:id/unlock', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT title, content, password_hash FROM posts WHERE id = $1 AND is_hidden = false', [
      req.params.id,
    ]);
    const post = rows[0];
    if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    const { password } = req.body || {};
    if (!password || !checkPassword(password, post.password_hash)) {
      return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
    }
    res.json({ title: post.title, content: post.content });
  } catch (e) {
    next(e);
  }
});

// POST /api/posts
router.post('/', async (req, res, next) => {
  try {
    let { title, content, nickname, password, category, targetUserId, isPrivate } = req.body || {};
    title = (title || '').trim();
    content = (content || '').trim();
    nickname = (nickname || '').trim();
    password = (password || '').trim();
    category = category === 'suggestion' ? 'suggestion' : 'general';

    if (!title || !content) return res.status(400).json({ error: '제목과 내용을 입력해주세요.' });
    if (title.length > 100) return res.status(400).json({ error: '제목이 너무 깁니다.' });
    if (content.length > 10000) return res.status(400).json({ error: '내용이 너무 깁니다.' });

    // targetUserId is optional for a suggestion: omitted means a "일반
    // 건의" (general suggestion) addressed to everyone rather than one
    // specific 임원/그룹장. Privacy only makes sense with a specific
    // target, so a general suggestion can never be private.
    let targetId = null;
    if (category === 'suggestion' && targetUserId) {
      targetId = parseInt(targetUserId, 10);
      if (!targetId) return res.status(400).json({ error: '올바르지 않은 건의 대상입니다.' });
      const targetCheck = await pool.query("SELECT id FROM users WHERE id = $1 AND role = 'executive'", [targetId]);
      if (!targetCheck.rows[0]) return res.status(400).json({ error: '올바르지 않은 건의 대상입니다.' });
    }
    const effectivePrivate = targetId ? !!isPrivate : false;

    // Any logged-in account with their profile visible posts under their
    // real name on the general board, tied to their account instead of an
    // anonymous password. 건의(suggestion) posts are always anonymous —
    // even the target's own colleagues shouldn't be able to tell who
    // submitted a suggestion just because they happen to be logged in.
    const payload = getUserFromRequest(req);
    let userId = null;
    if (category !== 'suggestion' && payload) {
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

    const banned = (await containsBannedWord(title)) || (await containsBannedWord(content));
    if (banned) return res.status(400).json({ error: '금지어가 포함되어 있습니다.' });

    const { rows } = await pool.query(
      `INSERT INTO posts (title, content, nickname, password_hash, category, target_user_id, is_private, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [title, content, nickname, userId ? hashPassword(randomNickname()) : hashPassword(password), category, targetId, effectivePrivate, userId]
    );

    res.status(201).json({ id: rows[0].id });
  } catch (e) {
    next(e);
  }
});

// POST /api/posts/:id/verify-password
router.post('/:id/verify-password', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT password_hash, user_id FROM posts WHERE id = $1 AND is_hidden = false', [
      req.params.id,
    ]);
    const post = rows[0];
    if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    if (post.user_id) return res.status(400).json({ error: '로그인 계정으로 작성된 글입니다.' });

    const { password } = req.body || {};
    if (!password || !checkPassword(password, post.password_hash)) {
      return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

function ownsPost(post, req) {
  if (post.user_id) {
    const payload = getUserFromRequest(req);
    return payload && payload.userId === post.user_id;
  }
  const { password } = req.body || {};
  return !!password && checkPassword(password, post.password_hash);
}

// PUT /api/posts/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1 AND is_hidden = false', [req.params.id]);
    const post = rows[0];
    if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    if (!ownsPost(post, req)) return res.status(403).json({ error: '수정 권한이 없습니다.' });

    let { title, content } = req.body || {};
    title = (title || '').trim();
    content = (content || '').trim();
    if (!title || !content) return res.status(400).json({ error: '제목과 내용을 입력해주세요.' });
    if (title.length > 100 || content.length > 10000) return res.status(400).json({ error: '입력값이 너무 깁니다.' });

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
    if (!ownsPost(post, req)) return res.status(403).json({ error: '삭제 권한이 없습니다.' });

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
