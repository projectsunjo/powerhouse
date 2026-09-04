require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { ready: dbReady } = require('./db');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const adminRouter = require('./routes/admin');
const marketInfoRouter = require('./routes/marketInfo');
const internalRouter = require('./routes/internal');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://*.supabase.co'],
        frameSrc: [
          "'self'",
          'https://deacon1876.github.io',
          'https://www.youtube.com',
          'https://player.vimeo.com',
        ],
      },
    },
  })
);
app.use(compression());
// Raised from 200kb: profile-photo uploads are sent as base64 JSON (not
// multipart/form-data - this corporate network's proxy silently mangles
// multipart uploads, the same issue that blocked Vercel's own upload API
// earlier), so a 4MB image needs headroom for ~33% base64 overhead.
app.use(express.json({ limit: '6mb' }));
app.use(cookieParser());

// Basic bot/scraping/flood protection. This is deliberately minimal —
// Vercel's edge network already absorbs raw volumetric DDoS before it
// reaches this function at all; these limiters are for the next layer
// down (a script hammering our own API/admin endpoints).
const readLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
});
const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
});
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.' },
});

app.use('/api', (req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/internal/')) return readLimiter(req, res, next);
  next();
});

app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE' || req.method === 'PATCH') {
    if (req.path === '/api/auth/login') return loginLimiter(req, res, next);
    if (req.path.startsWith('/api/admin/') || req.path.startsWith('/api/internal/')) return next();
    if (req.path.startsWith('/api/auth/')) return authLimiter(req, res, next);
    return writeLimiter(req, res, next);
  }
  next();
});

app.use('/api', async (req, res, next) => {
  await dbReady;
  next();
});

app.use('/api/posts', postsRouter);
app.use('/api', commentsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/market-info', marketInfoRouter);
app.use('/api/internal', internalRouter);
app.use('/api/auth', authRouter);

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

app.get('/admin', (req, res) => {
  res.redirect('/login.html');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: '서버 오류가 발생했습니다.', _debug: err.message });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`PowerHouse board running on http://localhost:${PORT}`);
  });
}

module.exports = app;
