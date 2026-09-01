// Runs inside GitHub Actions (see .github/workflows/generate-briefing.yml).
// Decides whether it's time to generate (unless forced by a manual dispatch),
// runs the esmi research via the Claude Code CLI, and records the result.
require('dotenv').config();
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { Pool } = require('pg');
const { sendBriefingEmail } = require('../server/utils/mailer');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function getSetting(key, fallback) {
  const { rows } = await pool.query('SELECT value FROM settings WHERE key = $1', [key]);
  return rows[0] ? rows[0].value : fallback;
}

async function shouldRun() {
  if (process.env.FORCE === 'true') return true;

  const enabled = (await getSetting('briefing_schedule_enabled', '1')) === '1';
  if (!enabled) return false;

  const intervalHours = parseInt(await getSetting('briefing_interval_hours', '24'), 10);
  const scheduleHour = parseInt(await getSetting('briefing_schedule_hour', '8'), 10);
  const lastRunAt = await getSetting('briefing_last_scheduled_run_at', null);

  const now = new Date();
  let nextRunAt;
  if (lastRunAt) {
    nextRunAt = new Date(lastRunAt).getTime() + intervalHours * 3600 * 1000;
  } else {
    const anchor = new Date(now);
    anchor.setUTCHours(scheduleHour, 0, 0, 0);
    if (anchor.getTime() > now.getTime()) anchor.setUTCDate(anchor.getUTCDate() - 1);
    nextRunAt = anchor.getTime();
  }

  return now.getTime() >= nextRunAt;
}

async function main() {
  if (!(await shouldRun())) {
    console.log('Not due yet — skipping this run.');
    await pool.end();
    return;
  }

  await pool.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value', [
    'briefing_last_scheduled_run_at',
    new Date().toISOString(),
  ]);

  const runResult = await pool.query("INSERT INTO briefing_runs (status) VALUES ('running') RETURNING id");
  const runId = runResult.rows[0].id;

  const outFile = path.join(os.tmpdir(), `briefing-${runId}.html`);
  const repoRoot = path.join(__dirname, '..');

  try {
    execFileSync(
      'claude',
      [
        '-p',
        `Run the esmi skill's full research methodology right now. Read .claude/skills/esmi/SKILL.md and .claude/skills/esmi/assets/template.html in this project for the exact methodology, watchlists, sorting rules, and the table-based inline-style HTML structure to clone. Use today's actual current date as the 조사 날짜 (do not use a stale or placeholder date). Perform the real web research (WebSearch/WebFetch) across all 7 categories per the skill. Write the final self-contained HTML directly to the file at ${outFile} using the Write tool. Do NOT save to /mnt/user-data/outputs and do NOT call present_files — this file is consumed by the web app's Market Info > 에너지 솔루션 탭, not delivered in chat.`,
        '--dangerously-skip-permissions',
      ],
      { cwd: repoRoot, stdio: 'inherit', timeout: 30 * 60 * 1000 }
    );

    const html = fs.readFileSync(outFile, 'utf8');
    const insertResult = await pool.query('INSERT INTO briefings (html) VALUES ($1) RETURNING id, created_at', [html]);
    const briefing = insertResult.rows[0];

    const emailRecipients = await getSetting('briefing_email_recipients', '');
    const emailSubjectTemplate = await getSetting(
      'briefing_email_subject_template',
      '[ESMI 마켓봇] 국내외 전력 및 SOFC 관련 {날짜}'
    );
    let emailStatus;
    try {
      emailStatus = await sendBriefingEmail(html, briefing.created_at.toISOString(), emailRecipients, emailSubjectTemplate);
    } catch (e) {
      emailStatus = `이메일 발송 실패: ${e.message}`;
    }

    await pool.query(
      "UPDATE briefing_runs SET completed_at = NOW(), status = 'success', briefing_id = $1, email_status = $2 WHERE id = $3",
      [briefing.id, emailStatus, runId]
    );
    console.log(`Briefing ${briefing.id} generated. ${emailStatus}`);
  } catch (e) {
    await pool.query("UPDATE briefing_runs SET completed_at = NOW(), status = 'failed', error = $1 WHERE id = $2", [
      e.message.slice(0, 500),
      runId,
    ]);
    throw e;
  } finally {
    fs.rmSync(outFile, { force: true });
    await pool.end();
  }
}

main().catch((e) => {
  console.error('generate-briefing failed:', e.message);
  process.exit(1);
});
