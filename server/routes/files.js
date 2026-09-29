const express = require('express');
const { pool } = require('../db');
const { downloadFileFromSupabase, createSignedDownloadUrl } = require('../utils/storage');

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
  '7z': 'application/x-7z-compressed',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  hwp: 'application/x-hwp',
  hwpx: 'application/hwp+zip',
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
    let buffer = null;

    // 1) If file is stored on Supabase Storage, stream directly through server using service-role
    // This bypasses private bucket RLS errors, corporate DLP external domain blocking, and fake JSON error downloads.
    if (file.blob_url && file.blob_url.includes('supabase.co')) {
      try {
        buffer = await downloadFileFromSupabase(file.blob_url);
      } catch (dlErr) {
        console.warn(`Supabase direct proxy download failed for file ${file.id}:`, dlErr.message);
      }

      // If direct proxy buffer failed (e.g. huge file > 50MB), fallback to Signed URL or public redirect
      if (!buffer) {
        try {
          const signedUrl = await createSignedDownloadUrl(file.blob_url);
          if (signedUrl) {
            const dlParam = `download=${encodeURIComponent(file.filename)}`;
            const targetUrl = signedUrl.includes('?') ? `${signedUrl}&${dlParam}` : `${signedUrl}?${dlParam}`;
            return res.redirect(302, targetUrl);
          }
        } catch (_) {}

        const isDangerous = /\.(html?|svg|js|xml)$/i.test(file.filename);
        const isOfficeOrArchive = /\.(docx?|xlsx?|pptx?|zip|7z|tar|gz|hwp|hwpx|csv|exe)$/i.test(file.filename);
        const isDownload = req.query.download === '1' || req.query.dl === '1' || isDangerous || isOfficeOrArchive;
        let targetUrl = file.blob_url;
        if (isDownload) {
          const dlParam = `download=${encodeURIComponent(file.filename)}`;
          targetUrl = targetUrl.includes('?') ? `${targetUrl}&${dlParam}` : `${targetUrl}?${dlParam}`;
        }
        return res.redirect(302, targetUrl);
      }
    } else if (file.blob_url) {
      // Other external storage (e.g. Vercel Blob)
      const isDangerous = /\.(html?|svg|js|xml)$/i.test(file.filename);
      const isOfficeOrArchive = /\.(docx?|xlsx?|pptx?|zip|7z|tar|gz|hwp|hwpx|csv|exe)$/i.test(file.filename);
      const isDownload = req.query.download === '1' || req.query.dl === '1' || isDangerous || isOfficeOrArchive;
      let targetUrl = file.blob_url;
      if (isDownload) {
        const dlParam = `download=${encodeURIComponent(file.filename)}`;
        targetUrl = targetUrl.includes('?') ? `${targetUrl}&${dlParam}` : `${targetUrl}?${dlParam}`;
      }
      return res.redirect(302, targetUrl);
    } else {
      // 2) Stored in DB (BYTEA)
      buffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data || '');
    }

    if (!buffer || buffer.length === 0) {
      return res.status(404).send('파일 내용이 비어 있거나 존재하지 않습니다.');
    }

    const mimeType = resolveMimeType(file.filename, file.mime_type);

    // Force attachment download for security-sensitive or office documents that browsers cannot render inline
    const isDangerous = /\.(html?|svg|js|xml)$/i.test(file.filename);
    const isOfficeOrArchive = /\.(docx?|xlsx?|pptx?|zip|7z|tar|gz|hwp|hwpx|csv|exe)$/i.test(file.filename);
    const isDownload = req.query.download === '1' || req.query.dl === '1' || isDangerous || isOfficeOrArchive;
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
