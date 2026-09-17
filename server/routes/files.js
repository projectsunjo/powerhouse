const express = require('express');
const { pool } = require('../db');

const router = express.Router();

const MIME_FALLBACKS = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  txt: 'text/plain; charset=utf-8',
  csv: 'text/csv; charset=utf-8',
  json: 'application/json; charset=utf-8',
  md: 'text/markdown; charset=utf-8',
  zip: 'application/zip',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  wav: 'audio/wav',
};

function resolveMimeType(filename, currentMime) {
  if (currentMime && currentMime !== 'application/octet-stream') return currentMime;
  const ext = (filename.split('.').pop() || '').toLowerCase();
  return MIME_FALLBACKS[ext] || 'application/octet-stream';
}

async function serveUploadedFile(req, res, next) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT id, filename, mime_type, size_bytes, data, blob_url FROM uploaded_files WHERE id = $1',
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).send('파일을 찾을 수 없습니다.');
    }

    const file = rows[0];

    // If file is stored on Vercel Blob (supports up to 100MB+)
    if (file.blob_url) {
      const isDangerous = /\.(html?|svg|js|xml)$/i.test(file.filename);
      const isDownload = req.query.download === '1' || req.query.dl === '1' || isDangerous;
      let targetUrl = file.blob_url;
      if (isDownload) {
        targetUrl = targetUrl.includes('?') ? `${targetUrl}&download=1` : `${targetUrl}?download=1`;
      }
      return res.redirect(302, targetUrl);
    }

    const buffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data || '');
    const mimeType = resolveMimeType(file.filename, file.mime_type);

    // Force attachment download for executable/script markup types to prevent stored XSS
    const isDangerous = /\.(html?|svg|js|xml)$/i.test(file.filename);
    const isDownload = req.query.download === '1' || req.query.dl === '1' || isDangerous;
    const dispositionType = isDownload ? 'attachment' : 'inline';

    const encodedName = encodeURIComponent(file.filename).replace(/['()]/g, escape);
    const asciiFallback = file.filename.replace(/[^\x20-\x7E]/g, '_') || 'download';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader(
      'Content-Disposition',
      `${dispositionType}; filename="${asciiFallback}"; filename*=UTF-8''${encodedName}`
    );
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    res.end(buffer);
  } catch (err) {
    next(err);
  }
}

router.get('/:id/:filename', serveUploadedFile);
router.get('/:id', serveUploadedFile);

module.exports = router;
module.exports.resolveMimeType = resolveMimeType;
