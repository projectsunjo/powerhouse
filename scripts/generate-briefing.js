// Generates the daily energy-solution briefing and reports back to the deployed app.
// The research itself is done by the Claude Code CLI running the project's `esmi`
// skill — see generateWithClaude() below. (An earlier Google Gemini engine, which
// scraped Google News RSS and synthesized the HTML via generativelanguage API, was
// removed once its project hit its billing cap; the Claude engine replaced it.)
//
// That engine swap also removed the only hard guarantee that the briefing stayed
// recent: Gemini was fed a Google News feed already filtered to `when:1d`, so it
// never saw an older article. The Claude CLI researches on its own, so the same
// cutoff now lives in ./lib/briefing-window and is applied to the generated HTML
// before it is recorded and emailed.
require('dotenv').config();
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { getBriefingWindow, filterBriefingHtml } = require('./lib/briefing-window');

const APP_BASE_URL = (process.env.APP_BASE_URL || '').replace(/\/$/, '');
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;
const FORCE = process.env.FORCE === 'true';
const RUN_ID = process.env.RUN_ID || '';

// Model and effort are pinned on purpose. The workflow runs
// `npm install -g @anthropic-ai/claude-code` on every run, so the CLI floats to
// whatever is newest — and so does its default model. On 2026-11-24 that default
// became `claude-sonnet-5`, which this account cannot use, and every scheduled run
// failed in ~30s.
//
// Opus at high effort, because this job is research depth, not latency: the
// briefing used to carry 25-26 article cards from an ~8-10 minute run, and the
// first run pinned to Sonnet at the CLI's default effort came back with 9 cards
// in 3.5 minutes. It runs once a day on the subscription token, so the slower,
// more thorough model is the right trade. Sonnet is the fallback if Opus is
// overloaded or unavailable. All three can be overridden from the environment.
const CLAUDE_MODEL = process.env.BRIEFING_CLAUDE_MODEL || 'claude-opus-5-5';
const CLAUDE_FALLBACK_MODEL = process.env.BRIEFING_CLAUDE_FALLBACK_MODEL || 'claude-sonnet-5-5';
const CLAUDE_EFFORT = process.env.BRIEFING_CLAUDE_EFFORT || 'high';

// Keep below the workflow's timeout-minutes (50) so a slow run is reported to
// the app as a failure instead of being killed silently by Actions.
const GENERATION_TIMEOUT_MS = 45 * 60 * 1000;

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

// `claude -p --output-format json` prints one result object. Only a few fields
// are wanted, and its exact shape is the CLI's business, so read it defensively:
// anything missing just drops out of the notes rather than failing the run.
function summarizeCliResult(stdout) {
  try {
    const lines = String(stdout).trim().split(/\r?\n/);
    const r = JSON.parse(lines[lines.length - 1]);
    const models = r.modelUsage ? Object.keys(r.modelUsage) : [];
    return {
      models,
      turns: typeof r.num_turns === 'number' ? r.num_turns : null,
      minutes: typeof r.duration_ms === 'number' ? +(r.duration_ms / 60000).toFixed(1) : null,
    };
  } catch {
    return { models: [], turns: null, minutes: null };
  }
}

function generateWithClaude(window) {
  const outFile = path.join(os.tmpdir(), `briefing-claude-${Date.now()}.html`);
  const repoRoot = path.join(__dirname, '..');
  const allowed = window.allowedDates.join(', ');
  try {
    const stdout = execFileSync(
      'claude',
      [
        '-p',
        `Run the esmi skill's full research methodology right now. Read BOTH .claude/skills/esmi/SKILL.md and .claude/skills/esmi/assets/template.html in this project before writing anything — SKILL.md has the methodology, watchlists and sorting rules; template.html is the exact email layout to reproduce.

The layout is NOT up to you: this briefing is emailed every morning and must look identical each day. Clone template.html's markup and inline styles verbatim and only swap in the content. Specifically: the dark #0F172A header with "ESMI · Energy Solution Market Info" and 조사 날짜; every section as an "■ 제목" h2 with the underline (#0F172A for sections with news, the tone-down #64748B/#94A3B8 variant for "특이사항 없음" sections, which go at the bottom); and EVERY article rendered as the #F7F8FA article card containing, without exception, all four parts — (1) the grey 📅 M.DD date badge plus the outlet name, (2) the bold teal title link pointing at the real publisher URL you actually found, (3) a 1~2 sentence Korean summary, (4) the 💡 시사점 box with the left teal border. Subgroups are "[용인]"-style bracketed region names. Close with the template's footer. No <style> blocks, no CSS variables, no flexbox/grid, no invented comparison tables, and do not design an alternative layout.

RESEARCH DEPTH — this is the part that matters most. A good briefing carries roughly 20-30 article cards in total, typically 2-4 per section. Get there by searching harder, not by lowering the bar: follow SKILL.md's 검색 깊이 규칙 — run at least 3 distinct searches per section (more for the semiconductor subgroups 용인/평택/호남권/기타 and the watchlist companies), mix Korean and English queries, and open articles to confirm the publication date, the figures (MW/GW, 금액) and the real publisher URL before writing a card. Do not stop after the first result that fits. A section with no qualifying news after that effort is still "특이사항 없음" — never pad with off-topic or out-of-window items to reach the count.

HARD DATE CUTOFF — this is enforced in code after you finish, so anything outside it is wasted work. The window for this run is the last ${window.hours} hours, which means the ONLY acceptable 📅 badge values are: ${allowed}. Every article you cite must have been published on one of those dates. Do not reach further back to fill a thin section: widen the search topic instead, exactly as SKILL.md's "카테고리별 연관 주제 확장 규칙" describes, and if there is still nothing inside the window, write "특이사항 없음" for that section — that is the correct outcome, not a failure. Any card whose badge falls outside the window will be stripped from the briefing automatically before it is sent.

Use today's actual current date as the 조사 날짜 (do not use a stale or placeholder date). Perform the real web research (WebSearch/WebFetch) across all 7 categories per the skill. Write the final self-contained HTML document (starting at <!DOCTYPE html>, ending at </html>) directly to the file at ${outFile} using the Write tool. Do NOT save to /mnt/user-data/outputs and do NOT call present_files — this file is consumed by the web app's Market Info > 에너지 솔루션 탭 and sent as the briefing email, not delivered in chat.`,
        '--model',
        CLAUDE_MODEL,
        '--fallback-model',
        CLAUDE_FALLBACK_MODEL,
        '--effort',
        CLAUDE_EFFORT,
        '--output-format',
        'json',
        '--dangerously-skip-permissions',
      ],
      { cwd: repoRoot, stdio: ['ignore', 'pipe', 'pipe'], timeout: GENERATION_TIMEOUT_MS, maxBuffer: 64 * 1024 * 1024 }
    );
    return { html: fs.readFileSync(outFile, 'utf8'), run: summarizeCliResult(stdout) };
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
    console.log(`Skipping this run: ${start.reason || 'not due yet'}.`);
    return;
  }
  const runId = start.runId;

  try {
    if (!process.env.CLAUDE_CODE_OAUTH_TOKEN) {
      throw new Error('CLAUDE_CODE_OAUTH_TOKEN 환경변수가 필요합니다.');
    }
    const briefingWindow = getBriefingWindow();
    console.log(
      `[ESMI] Using Claude CLI engine (${CLAUDE_MODEL}, effort ${CLAUDE_EFFORT}, fallback ${CLAUDE_FALLBACK_MODEL}). Window: last ${briefingWindow.hours}h (allowed dates: ${briefingWindow.allowedDates.join(', ')}).`
    );
    const generated = generateWithClaude(briefingWindow);
    const rawHtml = generated.html;

    // The Gemini engine could only ever see articles from the last 24 hours —
    // fetchGoogleNews() filtered them out before the model was involved. The
    // Claude engine does its own research, so the same cutoff is applied here
    // instead of being left to the prompt.
    const filtered = filterBriefingHtml(rawHtml, briefingWindow);
    if (filtered.removed.length) {
      console.warn(
        `[ESMI] Dropped ${filtered.removed.length}/${filtered.total} article cards outside the ${briefingWindow.hours}h window: ${filtered.removed.join(', ')}`
      );
    }
    console.log(`[ESMI] ${filtered.kept} article cards kept, ${filtered.emptiedSections} section(s) marked 특이사항 없음.`);
    const html = filtered.html;

    // Recorded on the run row, because the Actions log can't be downloaded from
    // the office network — this is the only place a run's depth is visible.
    const { models, turns, minutes } = generated.run;
    const notes = [
      `model ${models.length ? models.join('+') : CLAUDE_MODEL} (requested ${CLAUDE_MODEL}, effort ${CLAUDE_EFFORT})`,
      turns !== null ? `${turns} turns` : null,
      minutes !== null ? `${minutes} min` : null,
      `cards ${filtered.total} generated -> ${filtered.kept} kept` +
        (filtered.removed.length ? ` (dropped outside ${briefingWindow.hours}h: ${filtered.removed.join(', ')})` : ''),
      `${filtered.emptiedSections} section(s) emptied by the window`,
    ]
      .filter(Boolean)
      .join(' | ');
    console.log(`[ESMI] ${notes}`);

    const skipEmail = process.env.SKIP_EMAIL === 'true';
    const result = await callInternal('complete', { runId, html, skipEmail, notes });
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
