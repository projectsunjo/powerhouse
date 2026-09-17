const path = require('path');
const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const { requireRole } = require('../utils/userAuth');
const { triggerBriefingWorkflow } = require('../utils/github');
const { getBriefingSettings, setSetting } = require('../utils/settings');
const { sendAndLogBriefingEmail } = require('../utils/mailer');
const { uploadProfileImage } = require('../utils/storage');
const { escapeLike } = require('../utils/helpers');
const { resolveMimeType } = require('./files');
const { del } = require('@vercel/blob');
const { handleUpload } = require('@vercel/blob/client');

const router = express.Router();
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_BLOB_FILE_BYTES = 100 * 1024 * 1024; // 100MB
const PAGE_SIZE = 20;
const RUNS_PAGE_SIZE = 20;

// 웹마스터는 모든 구역에 접근; 두 "지킴이" 역할은 각자 담당 구역만.
const boardAccess = requireRole('webmaster', 'board_keeper');
const marketAccess = requireRole('webmaster', 'marketbot_keeper');
const staffAccess = requireRole('webmaster', 'board_keeper', 'marketbot_keeper');
const webmasterOnly = requireRole('webmaster');

// GET /api/admin/stats
router.get('/stats', boardAccess, async (req, res, next) => {
  try {
    const [totalPosts, totalComments, todayPosts, pendingReports] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS c FROM posts'),
      pool.query('SELECT COUNT(*)::int AS c FROM comments'),
      pool.query("SELECT COUNT(*)::int AS c FROM posts WHERE created_at::date = NOW()::date"),
      pool.query("SELECT COUNT(*)::int AS c FROM reports WHERE status = 'pending'"),
    ]);
    res.json({
      totalPosts: totalPosts.rows[0].c,
      totalComments: totalComments.rows[0].c,
      todayPosts: todayPosts.rows[0].c,
      pendingReports: pendingReports.rows[0].c,
    });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/posts?page=&q=
router.get('/posts', boardAccess, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const q = (req.query.q || '').trim();
    const offset = (page - 1) * PAGE_SIZE;

    let where = 'WHERE 1=1';
    const params = [];
    if (q) {
      const escaped = escapeLike(q);
      params.push(`%${escaped}%`, `%${escaped}%`);
      where += ` AND (title ILIKE $${params.length - 1} ESCAPE '\\' OR content ILIKE $${params.length} ESCAPE '\\')`;
    }

    const total = (await pool.query(`SELECT COUNT(*)::int AS cnt FROM posts ${where}`, params)).rows[0].cnt;
    const { rows } = await pool.query(
      `SELECT id, title, nickname, views, likes, is_notice, is_hidden, created_at
       FROM posts ${where} ORDER BY id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, PAGE_SIZE, offset]
    );

    res.json({ posts: rows, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)), total });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/admin/posts/:id  { is_notice?, is_hidden? }
router.patch('/posts/:id', boardAccess, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id FROM posts WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });

    const { is_notice, is_hidden } = req.body || {};
    if (typeof is_notice === 'boolean') {
      await pool.query('UPDATE posts SET is_notice = $1 WHERE id = $2', [is_notice, req.params.id]);
    }
    if (typeof is_hidden === 'boolean') {
      await pool.query('UPDATE posts SET is_hidden = $1 WHERE id = $2', [is_hidden, req.params.id]);
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/admin/posts/:id
router.delete('/posts/:id', boardAccess, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/comments?page=&postId=
router.get('/comments', boardAccess, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const offset = (page - 1) * PAGE_SIZE;
    const postId = req.query.postId ? parseInt(req.query.postId, 10) : null;

    let where = 'WHERE 1=1';
    const params = [];
    if (postId) {
      params.push(postId);
      where += ` AND post_id = $${params.length}`;
    }

    const total = (await pool.query(`SELECT COUNT(*)::int AS cnt FROM comments ${where}`, params)).rows[0].cnt;
    const { rows } = await pool.query(
      `SELECT id, post_id, content, nickname, is_hidden, created_at
       FROM comments ${where} ORDER BY id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, PAGE_SIZE, offset]
    );

    res.json({ comments: rows, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)), total });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/admin/comments/:id
router.delete('/comments/:id', boardAccess, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM comments WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/reports?status=pending
router.get('/reports', boardAccess, async (req, res, next) => {
  try {
    const status = req.query.status === 'resolved' ? 'resolved' : 'pending';
    const { rows } = await pool.query('SELECT * FROM reports WHERE status = $1 ORDER BY id DESC LIMIT 100', [status]);
    res.json({ reports: rows });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/admin/reports/:id { status }
router.patch('/reports/:id', boardAccess, async (req, res, next) => {
  try {
    const status = req.body && req.body.status === 'resolved' ? 'resolved' : 'pending';
    await pool.query('UPDATE reports SET status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/banned-words
router.get('/banned-words', boardAccess, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, word FROM banned_words ORDER BY word ASC');
    res.json({ words: rows });
  } catch (e) {
    next(e);
  }
});

// POST /api/admin/banned-words { word }
router.post('/banned-words', boardAccess, async (req, res, next) => {
  try {
    const word = ((req.body && req.body.word) || '').trim();
    if (!word) return res.status(400).json({ error: '단어를 입력해주세요.' });
    try {
      await pool.query('INSERT INTO banned_words (word) VALUES ($1)', [word]);
    } catch (e) {
      return res.status(409).json({ error: '이미 등록된 단어입니다.' });
    }
    res.status(201).json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/admin/banned-words/:id
router.delete('/banned-words/:id', boardAccess, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM banned_words WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/briefings
router.get('/briefings', marketAccess, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, html, created_at FROM briefings ORDER BY id DESC');
    res.json({ briefings: rows });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/briefing-runs?page=1  (run log: 시작/완료/이메일 발송 상태)
router.get('/briefing-runs', marketAccess, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const offset = (page - 1) * RUNS_PAGE_SIZE;
    const total = (await pool.query('SELECT COUNT(*)::int AS cnt FROM briefing_runs')).rows[0].cnt;
    const { rows } = await pool.query(
      `SELECT br.id, br.started_at, br.completed_at, br.status, br.briefing_id, br.email_status, br.error, br.trigger_type,
        b.created_at AS briefing_created_at,
        (SELECT el.created_at FROM email_logs el
          WHERE el.briefing_id = br.briefing_id AND el.status = 'success'
          ORDER BY el.id DESC LIMIT 1) AS last_email_sent_at
       FROM briefing_runs br
       LEFT JOIN briefings b ON b.id = br.briefing_id
       ORDER BY br.id DESC LIMIT $1 OFFSET $2`,
      [RUNS_PAGE_SIZE, offset]
    );
    res.json({ runs: rows, page, totalPages: Math.max(1, Math.ceil(total / RUNS_PAGE_SIZE)), total });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/admin/briefing-runs/:id
router.delete('/briefing-runs/:id', marketAccess, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM briefing_runs WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/briefings/status
router.get('/briefings/status', marketAccess, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT status, error FROM briefing_runs ORDER BY id DESC LIMIT 1');
    const latest = rows[0];
    res.json({
      generating: latest ? latest.status === 'running' : false,
      lastError: latest && latest.status === 'failed' ? latest.error : null,
    });
  } catch (e) {
    next(e);
  }
});

// POST /api/admin/briefings/generate
router.post('/briefings/generate', marketAccess, async (req, res, next) => {
  try {
    // Insert the 'running' row before dispatching the Action, so the very
    // first status poll from the frontend (5s later) already sees this run
    // instead of a stale previous 'failed' row (the Action itself takes
    // 20-40s of checkout/npm install before it would create this row).
    const { rows } = await pool.query("INSERT INTO briefing_runs (status, trigger_type) VALUES ('running', 'manual') RETURNING id");
    const runId = rows[0].id;
    await triggerBriefingWorkflow(runId);
    res.json({ ok: true, status: 'started', runId });
  } catch (e) {
    res.status(500).json({ error: `실행 요청 실패: ${e.message}` });
  }
});

// POST /api/admin/briefings/send-email { briefingId? }  (defaults to latest)
router.post('/briefings/send-email', marketAccess, async (req, res, next) => {
  try {
    const { briefingId } = req.body || {};
    const { rows } = briefingId
      ? await pool.query('SELECT id, html, created_at FROM briefings WHERE id = $1', [briefingId])
      : await pool.query('SELECT id, html, created_at FROM briefings ORDER BY id DESC LIMIT 1');
    const briefing = rows[0];
    if (!briefing) return res.status(404).json({ error: '발송할 브리핑이 없습니다.' });

    const summary = await sendAndLogBriefingEmail(briefing.id, briefing.html, briefing.created_at.toISOString(), 'manual');
    res.json({ ok: true, summary });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/email-logs?page=1
router.get('/email-logs', marketAccess, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const offset = (page - 1) * PAGE_SIZE;
    const total = (await pool.query('SELECT COUNT(*)::int AS cnt FROM email_logs')).rows[0].cnt;
    const { rows } = await pool.query(
      `SELECT id, briefing_id, trigger_type, from_email, recipients, status, detail, created_at
       FROM email_logs ORDER BY id DESC LIMIT $1 OFFSET $2`,
      [PAGE_SIZE, offset]
    );
    res.json({ logs: rows, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)), total });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/admin/briefings/:id  { html }
router.patch('/briefings/:id', marketAccess, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id FROM briefings WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: '브리핑을 찾을 수 없습니다.' });

    const html = (req.body && req.body.html) || '';
    if (!html.trim()) return res.status(400).json({ error: '내용을 입력해주세요.' });

    await pool.query('UPDATE briefings SET html = $1 WHERE id = $2', [html, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/admin/briefings/:id
router.delete('/briefings/:id', marketAccess, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM briefings WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/briefing-settings
router.get('/briefing-settings', marketAccess, async (req, res, next) => {
  try {
    res.json(await getBriefingSettings());
  } catch (e) {
    next(e);
  }
});

// PATCH /api/admin/briefing-settings
router.patch('/briefing-settings', marketAccess, async (req, res, next) => {
  try {
    const { scheduleEnabled, scheduleHour, intervalHours, emailRecipients, emailSubjectTemplate } = req.body || {};

    if (typeof scheduleEnabled === 'boolean') {
      await setSetting('briefing_schedule_enabled', scheduleEnabled ? '1' : '0');
    }
    if (scheduleHour !== undefined) {
      const hour = parseInt(scheduleHour, 10);
      if (Number.isNaN(hour) || hour < 0 || hour > 23) {
        return res.status(400).json({ error: '시작 시각은 0~23 사이여야 합니다.' });
      }
      await setSetting('briefing_schedule_hour', hour);
    }
    if (intervalHours !== undefined) {
      const interval = parseInt(intervalHours, 10);
      if (Number.isNaN(interval) || interval < 1 || interval > 168) {
        return res.status(400).json({ error: '주기는 1~168시간 사이여야 합니다.' });
      }
      await setSetting('briefing_interval_hours', interval);
    }
    if (typeof emailRecipients === 'string') {
      await setSetting('briefing_email_recipients', emailRecipients.trim());
    }
    if (typeof emailSubjectTemplate === 'string') {
      const tpl = emailSubjectTemplate.trim();
      if (!tpl) return res.status(400).json({ error: '메일 제목 양식을 입력해주세요.' });
      await setSetting('briefing_email_subject_template', tpl);
    }

    res.json(await getBriefingSettings());
  } catch (e) {
    next(e);
  }
});

const VALID_ROLES = ['webmaster', 'marketbot_keeper', 'board_keeper', 'executive'];

// GET /api/admin/users  (회원관리 — 웹마스터 전용)
router.get('/users', webmasterOnly, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, username, display_name, role, profile_visible, profile_image_url, board_order, created_at FROM users ORDER BY id ASC'
    );
    res.json({ users: rows });
  } catch (e) {
    next(e);
  }
});

// POST /api/admin/users { username, password, displayName, role }
router.post('/users', webmasterOnly, async (req, res, next) => {
  try {
    const { username, password, displayName, role } = req.body || {};
    if (!username || !password || !displayName || !role) {
      return res.status(400).json({ error: '모든 항목을 입력해주세요.' });
    }
    if (!VALID_ROLES.includes(role)) return res.status(400).json({ error: '올바르지 않은 권한입니다.' });
    if (password.length < 4) return res.status(400).json({ error: '비밀번호는 4자 이상이어야 합니다.' });

    try {
      const { rows } = await pool.query(
        'INSERT INTO users (username, password_hash, display_name, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [username.trim(), bcrypt.hashSync(password, 10), displayName.trim(), role]
      );
      res.status(201).json({ id: rows[0].id });
    } catch (e) {
      return res.status(409).json({ error: '이미 존재하는 아이디입니다.' });
    }
  } catch (e) {
    next(e);
  }
});

// PATCH /api/admin/users/:id { username?, displayName?, role?, password?, profileVisible? }
router.patch('/users/:id', webmasterOnly, async (req, res, next) => {
  try {
    const { username, displayName, role, password, profileVisible, boardOrder } = req.body || {};
    if (role !== undefined && !VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: '올바르지 않은 권한입니다.' });
    }
    if (password !== undefined && password.length < 4) {
      return res.status(400).json({ error: '비밀번호는 4자 이상이어야 합니다.' });
    }

    if (username !== undefined) {
      try {
        await pool.query('UPDATE users SET username = $1 WHERE id = $2', [username.trim(), req.params.id]);
      } catch (e) {
        return res.status(409).json({ error: '이미 존재하는 아이디입니다.' });
      }
    }
    if (displayName !== undefined) await pool.query('UPDATE users SET display_name = $1 WHERE id = $2', [displayName.trim(), req.params.id]);
    if (role !== undefined) await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, req.params.id]);
    if (typeof profileVisible === 'boolean') {
      await pool.query('UPDATE users SET profile_visible = $1 WHERE id = $2', [profileVisible, req.params.id]);
    }
    if (boardOrder !== undefined) {
      const order = boardOrder === null || boardOrder === '' ? null : parseInt(boardOrder, 10);
      await pool.query('UPDATE users SET board_order = $1 WHERE id = $2', [Number.isInteger(order) ? order : null, req.params.id]);
    }
    if (password) await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [bcrypt.hashSync(password, 10), req.params.id]);

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// POST /api/admin/users/:id/profile-image { imageBase64, mimeType } —
// webmaster uploads a photo on behalf of any user. Base64 JSON, not
// multipart/form-data — see the matching note in routes/auth.js.
router.post('/users/:id/profile-image', webmasterOnly, async (req, res, next) => {
  try {
    const { imageBase64, mimeType } = req.body || {};
    if (!imageBase64 || !mimeType) return res.status(400).json({ error: '이미지 파일을 선택해주세요.' });
    if (!mimeType.startsWith('image/')) return res.status(400).json({ error: '이미지 파일만 업로드할 수 있습니다.' });

    const buffer = Buffer.from(imageBase64, 'base64');
    if (buffer.length > MAX_IMAGE_BYTES) return res.status(400).json({ error: '이미지 용량은 4MB 이하여야 합니다.' });

    const url = await uploadProfileImage(req.params.id, buffer, mimeType);
    await pool.query('UPDATE users SET profile_image_url = $1 WHERE id = $2', [url, req.params.id]);
    res.json({ ok: true, url });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/admin/users/:id/profile-image
router.delete('/users/:id/profile-image', webmasterOnly, async (req, res, next) => {
  try {
    await pool.query('UPDATE users SET profile_image_url = NULL WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', webmasterOnly, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/suggestions?page=1  (건의글 관리 — 웹마스터 + 익명게시판 지킴이)
router.get('/suggestions', boardAccess, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const offset = (page - 1) * PAGE_SIZE;

    const total = (await pool.query("SELECT COUNT(*)::int AS cnt FROM posts WHERE category = 'suggestion'")).rows[0]
      .cnt;
    const { rows } = await pool.query(
      `SELECT posts.id, title, nickname, is_private, is_hidden, posts.created_at, tu.display_name AS target_name,
        EXISTS(SELECT 1 FROM comments c WHERE c.post_id = posts.id AND c.is_official = true) AS has_official_reply
       FROM posts LEFT JOIN users tu ON tu.id = posts.target_user_id
       WHERE category = 'suggestion'
       ORDER BY posts.id DESC LIMIT $1 OFFSET $2`,
      [PAGE_SIZE, offset]
    );
    res.json({ posts: rows, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)), total });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/admin/suggestions/:id { is_hidden }
router.patch('/suggestions/:id', boardAccess, async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT id FROM posts WHERE id = $1 AND category = 'suggestion'", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: '건의글을 찾을 수 없습니다.' });

    if (typeof (req.body && req.body.is_hidden) === 'boolean') {
      await pool.query('UPDATE posts SET is_hidden = $1 WHERE id = $2', [req.body.is_hidden, req.params.id]);
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/admin/suggestions/:id
router.delete('/suggestions/:id', boardAccess, async (req, res, next) => {
  try {
    await pool.query("DELETE FROM posts WHERE id = $1 AND category = 'suggestion'", [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/files?page=&q=
router.get('/files', staffAccess, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const q = (req.query.q || '').trim();
    const offset = (page - 1) * PAGE_SIZE;

    let where = 'WHERE 1=1';
    const params = [];
    if (q) {
      const escaped = escapeLike(q);
      params.push(`%${escaped}%`);
      where += ` AND filename ILIKE $${params.length} ESCAPE '\\'`;
    }

    const total = (await pool.query(`SELECT COUNT(*)::int AS cnt FROM uploaded_files ${where}`, params)).rows[0].cnt;
    const { rows } = await pool.query(
      `SELECT id, filename, mime_type, size_bytes, uploaded_by, created_at
       FROM uploaded_files ${where}
       ORDER BY created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, PAGE_SIZE, offset]
    );

    res.json({ files: rows, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)), total });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/files/config
router.get('/files/config', staffAccess, (req, res) => {
  res.json({
    blobConfigured: !!process.env.BLOB_READ_WRITE_TOKEN,
    maxBytes: MAX_BLOB_FILE_BYTES,
    directMaxBytes: MAX_FILE_BYTES,
  });
});

// POST /api/admin/files/blob-upload  (handles token generation & callback for Vercel Blob)
router.post('/files/blob-upload', staffAccess, async (req, res, next) => {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(400).json({
        error: 'Vercel Blob 스토리지가 연결되지 않았습니다. Vercel 대시보드(Storage > Blob)에서 스토리지를 생성해주세요.',
      });
    }

    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => {
        return {
          maximumSizeInBytes: MAX_BLOB_FILE_BYTES,
          tokenPayload: JSON.stringify({
            uploaded_by: req.user ? (req.user.displayName || req.user.username) : '관리자',
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        try {
          const { uploaded_by } = JSON.parse(tokenPayload || '{}');
          const id = crypto.randomBytes(8).toString('hex');
          const cleanFilename = path.basename(blob.pathname);
          const resolvedMime = resolveMimeType(cleanFilename, blob.contentType);
          await pool.query(
            `INSERT INTO uploaded_files (id, filename, mime_type, size_bytes, blob_url, uploaded_by)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO NOTHING`,
            [id, cleanFilename, resolvedMime, blob.size || 0, blob.url, uploaded_by || '관리자']
          );
        } catch (e) {
          console.error('onUploadCompleted error:', e);
        }
      },
    });

    return res.json(jsonResponse);
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/files/register-blob { filename, mimeType, sizeBytes, blobUrl }
router.post('/files/register-blob', staffAccess, async (req, res, next) => {
  try {
    const { filename, mimeType, sizeBytes, blobUrl } = req.body || {};
    if (!filename || !blobUrl) {
      return res.status(400).json({ error: '파일명과 Blob URL을 모두 전달해주세요.' });
    }

    const cleanFilename = path.basename(filename.trim()).replace(/[\r\n\t]/g, '');
    const resolvedMime = resolveMimeType(cleanFilename, mimeType);
    const id = crypto.randomBytes(8).toString('hex');
    const uploader = req.user ? (req.user.displayName || req.user.username) : '관리자';

    const { rows } = await pool.query(
      `INSERT INTO uploaded_files (id, filename, mime_type, size_bytes, blob_url, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, filename, mime_type, size_bytes, blob_url, uploaded_by, created_at`,
      [id, cleanFilename, resolvedMime, parseInt(sizeBytes, 10) || 0, blobUrl, uploader]
    );

    res.json({ ok: true, file: rows[0] });
  } catch (e) {
    next(e);
  }
});

// POST /api/admin/files  { filename, mimeType, fileBase64 } (Direct DB upload for files <= 4MB)
router.post('/files', staffAccess, async (req, res, next) => {
  try {
    const { filename, mimeType, fileBase64 } = req.body || {};
    if (!filename || !fileBase64) {
      return res.status(400).json({ error: '파일명과 파일 데이터를 모두 전달해주세요.' });
    }

    const cleanFilename = path.basename(filename.trim()).replace(/[\r\n\t]/g, '');
    if (!cleanFilename) {
      return res.status(400).json({ error: '유효한 파일명을 입력해주세요.' });
    }

    const buffer = Buffer.from(fileBase64, 'base64');
    if (buffer.length === 0) {
      return res.status(400).json({ error: '파일 내용이 비어 있습니다.' });
    }
    if (buffer.length > MAX_FILE_BYTES) {
      return res.status(400).json({ error: '직접 업로드 용량은 4MB 이하여야 합니다. 대용량 파일(최대 100MB)은 Vercel Blob 스토리지를 연결해주세요.' });
    }

    const resolvedMime = resolveMimeType(cleanFilename, mimeType);
    const id = crypto.randomBytes(8).toString('hex');
    const uploader = req.user ? (req.user.displayName || req.user.username) : '관리자';

    const { rows } = await pool.query(
      `INSERT INTO uploaded_files (id, filename, mime_type, size_bytes, data, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, filename, mime_type, size_bytes, uploaded_by, created_at`,
      [id, cleanFilename, resolvedMime, buffer.length, buffer, uploader]
    );

    res.json({ ok: true, file: rows[0] });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/admin/files/:id
router.delete('/files/:id', staffAccess, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, blob_url FROM uploaded_files WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: '파일을 찾을 수 없습니다.' });

    if (rows[0].blob_url && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(rows[0].blob_url);
      } catch (err) {
        console.warn('Failed to delete blob from storage:', err.message);
      }
    }

    await pool.query('DELETE FROM uploaded_files WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
