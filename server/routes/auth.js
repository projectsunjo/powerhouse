const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const { issueUserToken, getUserFromRequest, requireRole } = require('../utils/userAuth');

const router = express.Router();

// POST /api/auth/login { username, password } — single login for every
// role (webmaster / marketbot_keeper / board_keeper / executive).
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: '아이디와 비밀번호를 입력해주세요.' });

    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }

    const token = issueUserToken(user);
    res.cookie('user_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 12 * 60 * 60 * 1000,
    });
    res.json({ ok: true, role: user.role, displayName: user.display_name });
  } catch (e) {
    next(e);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('user_token');
  res.json({ ok: true });
});

// GET /api/auth/me — current session's own profile (any logged-in role).
router.get('/me', async (req, res, next) => {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return res.status(401).json({ error: '로그인이 필요합니다.' });
    const { rows } = await pool.query(
      'SELECT id, username, display_name, role, profile_visible FROM users WHERE id = $1',
      [payload.userId]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: '사용자를 찾을 수 없습니다.' });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// PATCH /api/auth/profile-visible { visible } — executives only: toggle
// whether their real name shows on the anonymous board or they post/comment
// exactly like a regular anonymous visitor.
router.patch('/profile-visible', requireRole('executive'), async (req, res, next) => {
  try {
    const visible = !!(req.body && req.body.visible);
    await pool.query('UPDATE users SET profile_visible = $1 WHERE id = $2', [visible, req.user.userId]);
    res.json({ ok: true, visible });
  } catch (e) {
    next(e);
  }
});

// GET /api/auth/executives — public list, used by the 건의 tab's @ target
// picker (dropdown only, per the chosen design — no free-text targeting).
router.get('/executives', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, display_name FROM users WHERE role = 'executive' ORDER BY display_name ASC"
    );
    res.json({ executives: rows });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
