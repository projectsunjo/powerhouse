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

function formatKstDate(pubDateStr) {
  const d = new Date(pubDateStr);
  if (isNaN(d.getTime())) return '';
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kst.getUTCDate()).padStart(2, '0');
  const h = String(kst.getUTCHours()).padStart(2, '0');
  const min = String(kst.getUTCMinutes()).padStart(2, '0');
  return `${m}.${day} ${h}:${min}`;
}

async function fetchGoogleNews(query, lang = 'ko', max = 3) {
  const isEn = lang === 'en';
  const url = isEn
    ? `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' when:1d')}&hl=en-US&gl=US&ceid=US:en`
    : `https://news.google.com/rss/search?q=${encodeURIComponent(query + ' when:1d')}&hl=ko&gl=KR&ceid=KR:ko`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const xml = await res.text();
    const items = [];
    const matches = xml.matchAll(/<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>[\s\S]*?<source[^>]*>([\s\S]*?)<\/source>[\s\S]*?<\/item>/g);
    const EXCLUDE_KEYWORDS = [
      '압수수색', '중대재해', '음주운전', '교통사고', '부고', '인사발령', '화재사고', '사망사고',
      '고용노동부', '노동부', '검찰', '경찰 수사', '부당노동', '횡령', '배임', '주가조작', '사기'
    ];
    for (const m of matches) {
      const title = m[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
      if (EXCLUDE_KEYWORDS.some((k) => title.includes(k))) continue;

      const pubDate = m[3].trim();
      const d = new Date(pubDate);
      const hoursAgo = (Date.now() - d.getTime()) / (3600 * 1000);
      if (hoursAgo <= 24 && hoursAgo >= -1) {
        items.push({
          title,
          link: m[2].trim(),
          pubDate,
          dateKst: formatKstDate(pubDate),
          hoursAgo: `${hoursAgo.toFixed(1)}시간 전`,
          source: m[4].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim(),
        });
        if (items.length >= max) break;
      }
    }
    return items;
  } catch (e) {
    console.warn(`[News fetch warning] ${query}:`, e.message);
    return [];
  }
}

async function generateWithGemini() {
  const { dateStr } = getKstDateInfo();
  console.log(`[ESMI] Generating briefing for ${dateStr} (Strict 24h window)...`);

  const categoryDefinitions = [
    { key: 'sofc', name: 'SOFC 및 PAFC 관련 국내·해외 업체 동향', query: 'SOFC OR "연료전지" OR "Bloom Energy" OR 두산퓨얼셀 OR HD하이드로젠 OR PAFC' },
    { key: 'regulation', name: 'SOFC 관련 국내 및 해외 규제·정책 변화', query: 'CHPS OR "청정수소" OR "분산에너지" OR "수소법" OR "전력망 특별법"' },
    { key: 'semi_yongin', name: '국내 반도체 전력: 용인', query: '용인 반도체 (전력 OR 송전 OR 변전 OR LNG 발전 OR 전력망 OR 계통)' },
    { key: 'semi_pyeongtaek', name: '국내 반도체 전력: 평택', query: '평택 반도체 (전력 OR 변전소 OR 송전선로 OR 발전 OR 전기요금 OR 전력망)' },
    { key: 'semi_honam', name: '국내 반도체 전력: 호남권', query: '호남 반도체 전력 OR 광주 전남 반도체 전력 OR "신안 해상풍력" 반도체' },
    { key: 'semi_etc', name: '국내 반도체 전력: 기타', query: '전력반도체 OR "SiC" OR "GaN" OR "반도체특별법 전력"' },
    { key: 'power_gen', name: '국내 발전사(공기업·민간) 동향', query: '한국전력 OR 발전공기업 OR 한수원 OR "동서발전" OR 전기요금 OR 전력수급기본계획' },
    { key: 'datacenter_domestic', name: '국내 데이터센터 동향', query: '데이터센터 (전력 OR 변전소 OR 계통 OR 알박기 OR 수전 OR 송전 OR 분산)' },
    { key: 'datacenter_overseas', name: '해외 데이터센터 동향', query: '"data center" power (utility OR grid OR nuclear OR PPA OR financing)', lang: 'en' },
    { key: 'time_to_power', name: 'Time-to-Power 대안 발전원 동향', query: '가스터빈 데이터센터 OR 가스엔진 발전 OR 두산에너빌리티 가스터빈 OR 부유식 데이터센터' },
  ];

  console.log('[ESMI] Gathering real-time market news across categories...');
  const newsData = {};
  await Promise.all(
    categoryDefinitions.map(async (cat) => {
      const items = await fetchGoogleNews(cat.query, cat.lang || 'ko', 3);
      newsData[cat.name] = items;
      console.log(`- ${cat.name}: ${items.length} articles found`);
    })
  );

  const prompt = `You are the lead energy market research analyst for the ESMI (Energy Solution Market Info) daily briefing.
Based on the following collected real-time news articles, generate a clean, standalone, email-compatible HTML briefing document.

CRITICAL CONTENT & FILTERING RULES:
1. STRICT DEDUPLICATION (중복 기사 엄격 배제):
   - If multiple articles report on the exact same event, statement, press conference, or announcement (e.g. Mayor Lee Sang-il remarks about 1,600조, identical press release, same project), choose ONLY ONE single best article from the most prominent/authoritative media outlet (예: 한국경제, 매일경제, 연합뉴스, 조선비즈 등 주요 일간/경제지).
   - NEVER include two or more articles about the exact same event! (Do NOT include two articles about Mayor Lee Sang-il).
2. STRICT ENERGY/POWER RELEVANCE (에너지/전력 무관 기사 완전 배제):
   - This briefing is strictly dedicated to energy solutions, power grid, generation, electricity rates, data center power, and semiconductor power infrastructure.
   - Absolutely exclude any articles related to labor inspections/raids (e.g. 노동부 압수수색), criminal probes, industrial accidents (중대재해/사망), crime, unrelated auto/general manufacturing parts (HL만도 등), or general factory issues unrelated to electric power infrastructure.
   - If an article is not directly about power/energy infrastructure, DISCARD IT immediately!
3. 조사 날짜: "${dateStr}" (Must be shown in the dark header).
4. Layout: Pure <table> based layout (width="600" style="width:100%;max-width:600px;margin:0 auto;background-color:#F7F8FA;").
5. Styling: ALL styles MUST be inline style="...". NEVER use <style> tags, CSS variables, flexbox, or grid (must display perfectly in Outlook/Gmail/Naver mail). Web-safe font: Arial, Helvetica, sans-serif.
6. Header: Dark background (#0F172A), title "ESMI · Energy Solution Market Info", subtitle "조사 날짜 ${dateStr}".
7. ABSOLUTELY NO STATIC COMPARISON TABLES:
   - DO NOT generate any static comparison table or executive summary table (e.g. NEVER generate "Time-to-Power 분산전원 발전원별 특성 비교" or any table comparing SOFC vs Gas Engines vs Aeroderivative Gas Turbines).
   - Only real news articles should be presented!
8. Dynamic Section Sorting:
   - Sections WITH substantial news must appear FIRST (at the top).
   - Sections with NO news or no substantial updates must appear LAST (at the bottom) with "특이사항 없음" in a subtle #F1F3F5 box.
   - Do NOT use circle numbers or digit prefixes (no ①, ②, etc.). Use clean bold headers.
9. Semiconductor Subcategories:
   - Group under "국내 반도체 관련 전력/발전 업체 및 뉴스" with clean sub-headers for 용인, 평택, 호남권, 기타. Sort subcategories with news on top.
10. Data Centers:
    - Categorize as "국내 데이터센터 동향" and "해외 데이터센터 동향". For overseas articles, translate and explain titles, summaries, and insights clearly in Korean.
11. Time-to-Power:
    - "Time-to-Power 대안 발전원 동향" is a regular news section. Only output actual news articles collected using the standard article card layout. NO comparison tables.
12. MANDATORY ARTICLE CARD STRUCTURE (APPLIED TO EVERY SINGLE ARTICLE, NO EXCEPTIONS):
    Every single article in EVERY section and subcategory (including 용인, 평택, 호남권, 기타) MUST be rendered as an individual card with ALL of the following:
    a) 보도일시 및 언론사 (MANDATORY ON EVERY ARTICLE):
       Must display the date and source at the top of the card:
       <span style="background-color:#EEF2F6;color:#334155;font-size:11px;font-weight:bold;padding:2px 6px;border-radius:3px;">📅 {dateKst} ({hoursAgo})</span>
       <span style="color:#64748B;font-size:11px;font-weight:bold;margin-left:6px;">{source}</span>
       NEVER omit the date or source for any article under any circumstances!
    b) 기사 제목 링크:
       <a href="{link}" target="_blank" style="color:#0E7C86;text-decoration:none;font-weight:bold;font-size:14px;line-height:1.4;">{title}</a>
    c) 핵심 요약:
       1~2 clear summary sentences in Korean explaining the factual news.
    d) 💡 시사점 (MANDATORY ON EVERY SINGLE ARTICLE - NEVER OMIT):
       Every single article MUST have its own tailored insight box at the bottom:
       <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8FAFC;border-left:3px solid #0E7C86;padding:8px 10px;margin-top:8px;">
         <tr>
           <td style="font-size:11.5px;color:#1E293B;line-height:1.4;">
             <strong style="color:#0E7C86;">💡 시사점:</strong> [반도체 전력망, 데이터센터 전력 적기 공급, 분산에너지, SOFC 사업 관점의 실질적인 시사점 및 영향 분석 1~2문장]
           </td>
         </tr>
       </table>
       WARNING: Omitting "💡 시사점" on any article is strictly prohibited. Every article MUST have its own insight box.

Output ONLY valid HTML starting with <!DOCTYPE html> and ending with </html>. Do not wrap in markdown quotes.

COLLECTED NEWS ARTICLES:
${JSON.stringify(newsData, null, 2)}
`;

  const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];
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
              maxOutputTokens: 32768,
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

        const candidate = data.candidates?.[0];
        let html = (candidate?.content?.parts || []).map((p) => p.text || '').join('');
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

    const skipEmail = process.env.SKIP_EMAIL === 'true';
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
