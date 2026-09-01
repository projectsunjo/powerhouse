const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      nickname TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      is_notice BOOLEAN NOT NULL DEFAULT FALSE,
      is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      nickname TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
      parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS likes (
      id SERIAL PRIMARY KEY,
      post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      ip_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(post_id, ip_hash)
    );

    CREATE TABLE IF NOT EXISTS reports (
      id SERIAL PRIMARY KEY,
      target_type TEXT NOT NULL CHECK (target_type IN ('post','comment')),
      target_id INTEGER NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','resolved')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS banned_words (
      id SERIAL PRIMARY KEY,
      word TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS briefings (
      id SERIAL PRIMARY KEY,
      html TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS briefing_runs (
      id SERIAL PRIMARY KEY,
      started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      completed_at TIMESTAMPTZ,
      status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running','success','failed')),
      briefing_id INTEGER REFERENCES briefings(id) ON DELETE SET NULL,
      email_status TEXT,
      error TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at);
    CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
    CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
    CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
    CREATE INDEX IF NOT EXISTS idx_briefings_created ON briefings(created_at);
    CREATE INDEX IF NOT EXISTS idx_briefing_runs_started ON briefing_runs(started_at);
  `);

  const defaultSettings = {
    briefing_schedule_enabled: '1',
    briefing_schedule_hour: '8',
    briefing_interval_hours: '24',
    briefing_email_recipients: process.env.BRIEFING_EMAIL_TO || '',
    briefing_email_subject_template: '[ESMI 마켓봇] 국내외 전력 및 SOFC 관련 {날짜}',
  };
  for (const [key, value] of Object.entries(defaultSettings)) {
    await pool.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [key, value]);
  }
}

async function initWithRetry(attempts = 4) {
  for (let i = 1; i <= attempts; i++) {
    try {
      await init();
      return;
    } catch (e) {
      console.error(`DB init failed (attempt ${i}/${attempts}):`, e.message);
      if (i < attempts) await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}

const ready = initWithRetry();

module.exports = { pool, ready };
