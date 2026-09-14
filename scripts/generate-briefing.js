// Generates the daily energy-solution briefing and reports back to the deployed app.
// Powered by Google Gemini API and real-time news aggregation (with Claude fallback).
require('dotenv').config();
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const APP_BASE_URL = (process.env.APP_BASE_URL || '').replace(/\/$/, '');
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;
const FORCE = process.env.FORCE === 'true';
const RUN_ID = process.env.RUN_ID || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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

function getKstDateInfo() {
  const now = new Date();
  const kstOffsetMs = 9 * 60 * 60 * 1000;
  const kstDate = new Date(now.getTime() + kstOffsetMs);
  const year = kstDate.getUTCFullYear();
  const month = kstDate.getUTCMonth() + 1;
  const day = kstDate.getUTCDate();
  const dayOfWeek = kstDate.getUTCDay(); // 0: Sun, 1: Mon, ...
  const isMonday = dayOfWeek === 1;
  const dateStr = `${year}년 ${month}월 ${day}일`;
  return { dateStr, isMonday, kstDate };
}

async function fetchGoogleNews(query, max = 3) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const xml = await res.text();
    const items = [];
    const matches = xml.matchAll(/<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>[\s\S]*?<source[^>]*>([\s\S]*?)<\/source>[\s\S]*?<\/item>/g);
    for (const m of matches) {
      items.push({
        title: m[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim(),
        link: m[2].trim(),
        pubDate: m[3].trim(),
        source: m[4].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim(),
      });
      if (items.length >= max) break;
    }
    return items;
  } catch (e) {
    console.warn(`[News fetch warning] ${query}:`, e.message);
    return [];
  }
}

async function generateWithGemini() {
  const { dateStr, isMonday } = getKstDateInfo();
  console.log(`[ESMI] Generating briefing for ${dateStr} (Monday/Weekend window: ${isMonday ? '72h' : '24h'})...`);

  const categoryDefinitions = [
    { key: 'sofc', name: 'SOFC 및 PAFC 관련 국내·해외 업체 동향', query: 'SOFC OR "연료전지" OR "Bloom Energy" OR 두산퓨얼셀 OR HD하이드로젠 OR PAFC' },
    { key: 'regulation', name: 'SOFC 관련 국내 및 해외 규제·정책 변화', query: 'CHPS OR "청정수소" OR "분산에너지" OR "수소법" OR "전력망 특별법"' },
    { key: 'semi_yongin', name: '국내 반도체 전력: 용인', query: '용인 반도체 (전력 OR 송전 OR 변전 OR LNG OR 발전소 OR 인프라)' },
    { key: 'semi_pyeongtaek', name: '국내 반도체 전력: 평택', query: '평택 (삼성전자 OR 반도체) (전력 OR 변전소 OR 송전선로 OR 팹 OR 전기료)' },
    { key: 'semi_honam', name: '국내 반도체 전력: 호남권', query: '호남 반도체 전력 OR 광주 전남 반도체 OR "신안 해상풍력" 반도체' },
    { key: 'semi_etc', name: '국내 반도체 전력: 기타', query: '전력반도체 OR "SiC" OR "GaN" OR "반도체특별법" OR DB하이텍' },
    { key: 'power_gen', name: '국내 발전사(공기업·민간) 동향', query: '한국전력 OR 발전공기업 OR 한수원 OR "동서발전" OR 전기요금 OR 전력수급기본계획' },
    { key: 'datacenter_domestic', name: '국내 데이터센터 동향', query: '데이터센터 (전력 OR 변전소 OR 계통 OR 알박기 OR 수전 OR 송전 OR 분산)' },
    { key: 'datacenter_overseas', name: '해외 데이터센터 동향', query: '"data center" power (utility OR grid OR nuclear OR PPA OR financing)' },
    { key: 'time_to_power', name: 'Time-to-Power 대안 발전원 동향', query: '가스터빈 데이터센터 OR 가스엔진 발전 OR 두산에너빌리티 가스터빈 OR 부유식 데이터센터' },
  ];

  console.log('[ESMI] Gathering real-time market news across categories...');
  const newsData = {};
  await Promise.all(
    categoryDefinitions.map(async (cat) => {
      const items = await fetchGoogleNews(cat.query, 3);
      newsData[cat.name] = items;
      console.log(`- ${cat.name}: ${items.length} articles found`);
    })
  );

  const prompt = `You are the lead energy market research analyst for the ESMI (Energy Solution Market Info) daily briefing.
Based on the following collected real-time news articles, generate a clean, standalone, email-compatible HTML briefing document.

CRITICAL INSTRUCTIONS & FORMATTING RULES:
1. 조사 날짜: "${dateStr}" (Must be shown in the dark header).
2. Layout: Pure <table> based layout (width="600" style="width:100%;max-width:600px;margin:0 auto;background-color:#F7F8FA;").
3. Styling: ALL styles MUST be inline style="...". NEVER use <style> tags, CSS variables, flexbox, or grid (must display perfectly in Outlook/Gmail/Naver mail). Web-safe font: Arial, Helvetica, sans-serif.
4. Header: Dark background (#0F172A), title "ESMI · Energy Solution Market Info", subtitle "조사 날짜 ${dateStr}".
5. Dynamic Section Sorting:
   - Sections WITH substantial news must appear FIRST (at the top).
   - Sections with NO news or no substantial updates must appear LAST (at the bottom) with "특이사항 없음" in a subtle #F1F3F5 box.
   - Do NOT use circle numbers or digit prefixes (no ①, ②, etc.). Use clean bold headers.
6. Badges: Small inline table cells with badges (e.g. MW/GW capacity, fuel type LNG/SOFC, date M/D).
7. Insights: 2-column table with a colored left bar (3px width) and 1~2 lines of clear business takeaways ("시사점").
8. Source links: MUST use the real news URLs and titles provided in the input: <a href="URL" target="_blank" style="color:#0E7C86;text-decoration:none;font-weight:bold;">기사 제목</a> <span style="color:#64748B;font-size:11px;"> - 언론사명</span>.
9. Semiconductor subcategories: Group under "국내 반도체 관련 전력/발전 업체 및 뉴스" with clean sub-headers for 용인, 평택, 호남권, 기타. Sort subcategories with news on top.
10. Time-to-Power: Include comparison insight table comparing SOFC vs Gas Engines vs Aeroderivative Gas Turbines.

Output ONLY valid HTML starting with <!DOCTYPE html> and ending with </html>. Do not wrap in markdown quotes.

COLLECTED NEWS ARTICLES:
${JSON.stringify(newsData, null, 2)}
`;

  const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash'];
  let lastError = null;

  for (const model of candidateModels) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`[ESMI] Synthesizing briefing with ${model} (attempt ${attempt}/3)...`);
      try {
        const t0 = Date.now();
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 16384,
              thinkingConfig: { thinkingBudget: 512 },
            },
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          if (res.status === 503 || res.status === 429) {
            console.warn(`[ESMI] Model ${model} returned ${res.status}. Waiting 4s...`);
            lastError = new Error(`Gemini API error (${res.status}): ${errText}`);
            await new Promise((r) => setTimeout(r, 4000));
            continue;
          }
          throw new Error(`Gemini API error (${res.status}): ${errText}`);
        }

        const data = await res.json();
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        console.log(`[ESMI] ${model} generated briefing successfully in ${elapsed}s.`);

        let html = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        html = html.replace(/^```html\s*/i, '').replace(/```\s*$/, '').trim();

        if (!html.includes('</html>')) {
          throw new Error('Generated HTML was incomplete or missing </html> tag.');
        }

        return html;
      } catch (err) {
        lastError = err;
        if (attempt < 3 && (err.message.includes('503') || err.message.includes('429'))) {
          console.warn(`[ESMI] ${err.message}. Waiting 4s before next attempt...`);
          await new Promise((r) => setTimeout(r, 4000));
        } else {
          break;
        }
      }
    }
  }

  throw lastError || new Error('Failed to generate briefing with Gemini.');
}

function generateWithClaude() {
  const outFile = path.join(os.tmpdir(), `briefing-claude-${Date.now()}.html`);
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
    return fs.readFileSync(outFile, 'utf8');
  } finally {
    fs.rmSync(outFile, { force: true });
  }
}

async function main() {
  if (!APP_BASE_URL || !INTERNAL_API_SECRET) {
    throw new Error('APP_BASE_URL/INTERNAL_API_SECRET 환경변수가 설정되어 있지 않습니다.');
  }

  const start = await callInternal('start', { force: FORCE, runId: RUN_ID || undefined });
  if (!start.proceed) {
    console.log('Not due yet — skipping this run.');
    return;
  }
  const runId = start.runId;

  try {
    let html;
    if (GEMINI_API_KEY) {
      console.log('[ESMI] Using Google Gemini engine for briefing generation.');
      html = await generateWithGemini();
    } else if (process.env.CLAUDE_CODE_OAUTH_TOKEN) {
      console.log('[ESMI] GEMINI_API_KEY not found; falling back to Claude CLI engine.');
      html = generateWithClaude();
    } else {
      throw new Error('GEMINI_API_KEY 또는 CLAUDE_CODE_OAUTH_TOKEN 환경변수가 필요합니다.');
    }

    const skipEmail = process.env.SEND_EMAIL === 'true' ? false : true;
    const result = await callInternal('complete', { runId, html, skipEmail });
    console.log(`Briefing run ${runId} completed successfully. ${result.emailStatus || ''}`);
  } catch (e) {
    await callInternal('fail', { runId, error: e.message.slice(0, 500) }).catch((e2) => {
      console.error('Failed to report failure to app:', e2.message);
    });
    throw e;
  }
}

main().catch((e) => {
  console.error('generate-briefing failed:', e.message);
  process.exit(1);
});
