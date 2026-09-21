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
const cronRouter = require('./routes/cron');
const filesRouter = require('./routes/files');
const { getUserFromRequest } = require('./utils/userAuth');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com', 'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com'],
        // helmet 기본값 script-src-attr 'none' 은 식당도감의 onclick 인라인 핸들러(지도 핀·건물 모아보기·룰렛 등)를 전부 차단하므로 허용
        scriptSrcAttr: ["'unsafe-inline'"],
        // api.open-meteo.com: 식당도감 날씨 자동 추천 (키 없는 무료 API, 30분 캐시)
        connectSrc: ["'self'", 'https://*.supabase.co', 'https://tile.openstreetmap.org', 'https://*.tile.openstreetmap.org', 'https://*.basemaps.cartocdn.com', 'https://api.open-meteo.com'],
        // OSM 타일은 서브도메인 없는 tile.openstreetmap.org 에서 오므로 와일드카드와 별도로 명시
        imgSrc: ["'self'", 'data:', 'blob:', 'https://*.supabase.co', 'https://tile.openstreetmap.org', 'https://*.tile.openstreetmap.org', 'https://*.pstatic.net', 'https://search.pstatic.net', 'https://*.naver.net', 'https://images.unsplash.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
        frameSrc: [
          "'self'",
          'https://deacon1876.github.io',
          'https://www.youtube.com',
          'https://player.vimeo.com',
          'https://qhisper.vercel.app',
        ],
      },
    },
    // helmet 기본값 no-referrer 면 브라우저가 Referer 를 안 보내고, OSM 타일 서버는 출처 불명 요청을 "Access blocked" 타일로 거절한다.
    // strict-origin-when-cross-origin 은 타 사이트에 오리진(도메인)만 보내므로 경로·쿼리는 여전히 새지 않는다.
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);
app.use(compression());
app.use(express.json({ limit: '6mb' }));
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));
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
  if (req.method === 'GET' && !req.path.startsWith('/internal/') && !req.path.startsWith('/cron/') && !req.path.startsWith('/files/')) return readLimiter(req, res, next);
  next();
});

app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE' || req.method === 'PATCH') {
    if (req.path === '/api/auth/login') return loginLimiter(req, res, next);
    if (req.path.startsWith('/api/admin/') || req.path.startsWith('/api/internal/') || req.path.startsWith('/api/cron/')) return next();
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
app.use('/api/cron', cronRouter);
app.use('/api/auth', authRouter);
app.use('/api/files', filesRouter);

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

app.get('/admin', (req, res) => {
  const user = getUserFromRequest(req);
  if (user) {
    if (['webmaster', 'marketbot_keeper', 'board_keeper'].includes(user.role)) {
      return res.redirect('/admin/dashboard.html');
    }
    return res.redirect('/');
  }
  res.redirect('/login.html?redirect=/admin/dashboard.html');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: '서버 오류가 발생했습니다.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`PowerHouse board running on http://localhost:${PORT}`);
  });
}

module.exports = app;
