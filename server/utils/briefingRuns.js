// Shared bookkeeping for briefing_runs, used by every path that can start a
// briefing: the GitHub Actions schedule (/api/internal/briefing/start), the
// Vercel cron (/api/cron/briefing) and the admin "지금생성" button.
//
// A run row is inserted as 'running' *before* its GitHub Actions job exists,
// and the job runs on a self-hosted runner that lives on an office PC. When
// that PC is off, the job waits in GitHub's queue, gets cancelled after 24
// hours, and nothing ever reports back — the row stays 'running' forever and
// the admin dashboard shows "생성 중" for days. expireStaleRuns() closes those.
const { pool } = require('../db');

// GitHub cancels a job that waited 24h for a runner; a job that did start is
// killed at the workflow's timeout-minutes. Anything older than both never
// reported back and never will.
const STALE_AFTER = '25 hours';

// Covers a job's full runtime (workflow timeout-minutes: 50), so a second
// trigger doesn't start a duplicate while a briefing is still being written.
const IN_FLIGHT_WINDOW = '60 minutes';

// Retrying is the point, but a failure that isn't transient (a bad model ID, a
// revoked token) would otherwise burn every cron tick in the morning window.
const MAX_AUTO_FAILURES_PER_DAY = 3;

const TODAY_KST = "(NOW() + INTERVAL '9 hours')::date";

async function expireStaleRuns() {
  const { rowCount } = await pool.query(
    `UPDATE briefing_runs
        SET status = 'failed',
            completed_at = NOW(),
            error = '실행되지 않음: 25시간 안에 결과 보고가 없었습니다 (러너 PC가 꺼져 있어 GitHub 대기열에서 취소된 경우 등).'
      WHERE status = 'running' AND started_at < NOW() - INTERVAL '${STALE_AFTER}'`
  );
  if (rowCount) console.log(`[briefing_runs] Expired ${rowCount} stale 'running' row(s).`);
  return rowCount;
}

async function briefingToday() {
  const { rows } = await pool.query(
    `SELECT id FROM briefings WHERE (created_at + INTERVAL '9 hours')::date = ${TODAY_KST} ORDER BY id DESC LIMIT 1`
  );
  return rows[0] || null;
}

async function runInFlight() {
  const { rows } = await pool.query(
    `SELECT id FROM briefing_runs
      WHERE status = 'running' AND started_at > NOW() - INTERVAL '${IN_FLIGHT_WINDOW}'
      ORDER BY id DESC LIMIT 1`
  );
  return rows[0] || null;
}

async function autoFailuresToday() {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS n FROM briefing_runs
      WHERE trigger_type = 'auto' AND status = 'failed'
        AND (started_at + INTERVAL '9 hours')::date = ${TODAY_KST}`
  );
  return rows[0].n;
}

module.exports = {
  expireStaleRuns,
  briefingToday,
  runInFlight,
  autoFailuresToday,
  MAX_AUTO_FAILURES_PER_DAY,
};
