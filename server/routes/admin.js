const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { requireAdmin } = require('../middleware/adminAuth');
const { triggerBriefingWorkflow } = require('../utils/github');
const { getBriefingSettings, setSetting } = require('../utils/settings');
const { sendAndLogBriefingEmail } = require('../utils/mailer');

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
router.get('/stats', async (req, res, next) => {
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
router.get('/posts', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const q = (req.query.q || '').trim();
    const offset = (page - 1) * PAGE_SIZE;

    let where = 'WHERE 1=1';
    const params = [];
    if (q) {
      params.push(`%${q}%`, `%${q}%`);
      where += ` AND (title ILIKE $${params.length - 1} OR content ILIKE $${params.length})`;
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
router.patch('/posts/:id', async (req, res, next) => {
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
router.delete('/posts/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/comments?page=&postId=
router.get('/comments', async (req, res, next) => {
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
router.delete('/comments/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM comments WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/reports?status=pending
router.get('/reports', async (req, res, next) => {
  try {
    const status = req.query.status === 'resolved' ? 'resolved' : 'pending';
    const { rows } = await pool.query('SELECT * FROM reports WHERE status = $1 ORDER BY id DESC LIMIT 100', [status]);
    res.json({ reports: rows });
  } catch (e) {
    next(e);
  }
});

// PATCH /api/admin/reports/:id { status }
router.patch('/reports/:id', async (req, res, next) => {
  try {
    const status = req.body && req.body.status === 'resolved' ? 'resolved' : 'pending';
    await pool.query('UPDATE reports SET status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/banned-words
router.get('/banned-words', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, word FROM banned_words ORDER BY word ASC');
    res.json({ words: rows });
  } catch (e) {
    next(e);
  }
});

// POST /api/admin/banned-words { word }
router.post('/banned-words', async (req, res, next) => {
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
router.delete('/banned-words/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM banned_words WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/briefings
router.get('/briefings', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, html, created_at FROM briefings ORDER BY id DESC');
    res.json({ briefings: rows });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/briefing-runs?page=1  (run log: 시작/완료/이메일 발송 상태)
router.get('/briefing-runs', async (req, res, next) => {
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
router.delete('/briefing-runs/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM briefing_runs WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/briefings/status
router.get('/briefings/status', async (req, res, next) => {
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
router.post('/briefings/generate', async (req, res, next) => {
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
router.post('/briefings/send-email', async (req, res, next) => {
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
router.get('/email-logs', async (req, res, next) => {
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
router.patch('/briefings/:id', async (req, res, next) => {
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
router.delete('/briefings/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM briefings WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/briefing-settings
router.get('/briefing-settings', async (req, res, next) => {
  try {
    res.json(await getBriefingSettings());
  } catch (e) {
    next(e);
  }
});

// PATCH /api/admin/briefing-settings
router.patch('/briefing-settings', async (req, res, next) => {
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

module.exports = router;
