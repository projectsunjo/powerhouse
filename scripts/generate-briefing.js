// Generates the daily energy-solution briefing and reports back to the deployed app.
// The research itself is done by the Claude Code CLI running the project's `esmi`
// skill — see generateWithClaude() below. (An earlier Google Gemini engine, which
// scraped Google News RSS and synthesized the HTML via generativelanguage API, was
// removed once its project hit its billing cap; the Claude engine replaced it.)
require('dotenv').config();
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const APP_BASE_URL = (process.env.APP_BASE_URL || '').replace(/\/$/, '');
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;
const FORCE = process.env.FORCE === 'true';
const RUN_ID = process.env.RUN_ID || '';

async function callInternal(action, body) {
  const res = await fetch(`${APP_BASE_URL}/api/internal/briefing/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-internal-secret': INTERNAL_API_SECRET },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `internal API ${action} failed (${res.status})`);
  return data;
}

function generateWithClaude() {
  const outFile = path.join(os.tmpdir(), `briefing-claude-${Date.now()}.html`);
  const repoRoot = path.join(__dirname, '..');
  try {
    execFileSync(
      'claude',
      [
        '-p',
        `Run the esmi skill's full research methodology right now. Read BOTH .claude/skills/esmi/SKILL.md and .claude/skills/esmi/assets/template.html in this project before writing anything — SKILL.md has the methodology, watchlists and sorting rules; template.html is the exact email layout to reproduce.

The layout is NOT up to you: this briefing is emailed every morning and must look identical each day. Clone template.html's markup and inline styles verbatim and only swap in the content. Specifically: the dark #0F172A header with "ESMI · Energy Solution Market Info" and 조사 날짜; every section as an "■ 제목" h2 with the underline (#0F172A for sections with news, the tone-down #64748B/#94A3B8 variant for "특이사항 없음" sections, which go at the bottom); and EVERY article rendered as the #F7F8FA article card containing, without exception, all four parts — (1) the grey 📅 M.DD date badge plus the outlet name, (2) the bold teal title link pointing at the real publisher URL you actually found, (3) a 1~2 sentence Korean summary, (4) the 💡 시사점 box with the left teal border. Subgroups are "[용인]"-style bracketed region names. Close with the template's footer. No <style> blocks, no CSS variables, no flexbox/grid, no invented comparison tables, and do not design an alternative layout.

Use today's actual current date as the 조사 날짜 (do not use a stale or placeholder date). Perform the real web research (WebSearch/WebFetch) across all 7 categories per the skill. Write the final self-contained HTML document (starting at <!DOCTYPE html>, ending at </html>) directly to the file at ${outFile} using the Write tool. Do NOT save to /mnt/user-data/outputs and do NOT call present_files — this file is consumed by the web app's Market Info > 에너지 솔루션 탭 and sent as the briefing email, not delivered in chat.`,
        '--dangerously-skip-permissions',
      ],
      { cwd: repoRoot, stdio: ['ignore', 'pipe', 'pipe'], timeout: 30 * 60 * 1000 }
    );
    return fs.readFileSync(outFile, 'utf8');
  } finally {
    fs.rmSync(outFile, { force: true });
  }
}

async function main() {
  if (!APP_BASE_URL || !INTERNAL_API_SECRET) {
    throw new Error('APP_BASE_URL/INTERNAL_API_SECRET 환경변수가 설정되어 있지 않습니다.');
  }

  if (process.env.SET_GITHUB_TOKEN) {
    try {
      await callInternal('setting', { key: 'github_token', value: process.env.SET_GITHUB_TOKEN });
      console.log('[ESMI] Synced github_token into app DB settings.');
    } catch (err) {
      console.warn('[ESMI] Failed to persist github_token setting:', err.message);
    }
  }

  const start = await callInternal('start', { force: FORCE, runId: RUN_ID || undefined });
  if (!start.proceed) {
    console.log('Not due yet — skipping this run.');
    return;
  }
  const runId = start.runId;

  try {
    if (!process.env.CLAUDE_CODE_OAUTH_TOKEN) {
      throw new Error('CLAUDE_CODE_OAUTH_TOKEN 환경변수가 필요합니다.');
    }
    console.log('[ESMI] Using Claude CLI engine for briefing generation.');
    const html = generateWithClaude();

    const skipEmail = process.env.SKIP_EMAIL === 'true';
    const result = await callInternal('complete', { runId, html, skipEmail });
    console.log(`Briefing run ${runId} completed successfully. ${result.emailStatus || ''}`);
  } catch (e) {
    const out = (e.stdout ? e.stdout.toString() : '') + (e.stderr ? e.stderr.toString() : '');
    const detail = out.trim() || e.message;
    await callInternal('fail', { runId, error: detail.slice(0, 1500) }).catch((e2) => {
      console.error('Failed to report failure to app:', e2.message);
    });
    throw e;
  }
}

main().catch((e) => {
  console.error('generate-briefing failed:', e.message);
  process.exit(1);
});
