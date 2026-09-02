const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const { issueUserToken, getUserFromRequest, requireRole } = require('../utils/userAuth');
const { uploadProfileImage } = require('../utils/storage');

const router = express.Router();
const ANY_ROLE = requireRole('webmaster', 'marketbot_keeper', 'board_keeper', 'executive');
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

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
      'SELECT id, username, display_name, role, profile_visible, profile_image_url FROM users WHERE id = $1',
      [payload.userId]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: '사용자를 찾을 수 없습니다.' });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// PATCH /api/auth/profile-visible { visible } — any logged-in role: toggle
// whether their real name shows on the anonymous board or they post/comment
// exactly like a regular anonymous visitor.
router.patch('/profile-visible', ANY_ROLE, async (req, res, next) => {
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
      "SELECT id, display_name, profile_image_url FROM users WHERE role = 'executive' ORDER BY display_name ASC"
    );
    res.json({ executives: rows });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/auth/profile { username?, displayName? } — any logged-in role,
// self-service 내정보 settings save.
router.patch('/profile', ANY_ROLE, async (req, res, next) => {
  try {
    const { username, displayName } = req.body || {};
    if (username !== undefined) {
      const trimmed = username.trim();
      if (!trimmed) return res.status(400).json({ error: '아이디를 입력해주세요.' });
      try {
        await pool.query('UPDATE users SET username = $1 WHERE id = $2', [trimmed, req.user.userId]);
      } catch (e) {
        return res.status(409).json({ error: '이미 사용 중인 아이디입니다.' });
      }
    }
    if (displayName !== undefined) {
      const trimmed = displayName.trim();
      if (!trimmed) return res.status(400).json({ error: '표시 이름을 입력해주세요.' });
      await pool.query('UPDATE users SET display_name = $1 WHERE id = $2', [trimmed, req.user.userId]);
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/profile-image { imageBase64, mimeType } — any logged-in
// role. Sent as base64 JSON rather than multipart/form-data: this
// corporate network's proxy silently mangles multipart uploads (the same
// issue that blocked Vercel's own file-upload API earlier this project),
// so a plain JSON body sidesteps it entirely.
router.post('/profile-image', ANY_ROLE, async (req, res, next) => {
  try {
    const { imageBase64, mimeType } = req.body || {};
    if (!imageBase64 || !mimeType) return res.status(400).json({ error: '이미지 파일을 선택해주세요.' });
    if (!mimeType.startsWith('image/')) return res.status(400).json({ error: '이미지 파일만 업로드할 수 있습니다.' });

    const buffer = Buffer.from(imageBase64, 'base64');
    if (buffer.length > MAX_IMAGE_BYTES) return res.status(400).json({ error: '이미지 용량은 4MB 이하여야 합니다.' });

    const url = await uploadProfileImage(req.user.userId, buffer, mimeType);
    await pool.query('UPDATE users SET profile_image_url = $1 WHERE id = $2', [url, req.user.userId]);
    res.json({ ok: true, url });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/auth/profile-image
router.delete(
  '/profile-image',
  ANY_ROLE,
  async (req, res, next) => {
    try {
      await pool.query('UPDATE users SET profile_image_url = NULL WHERE id = $1', [req.user.userId]);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
