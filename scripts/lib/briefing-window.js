// Enforces the briefing's "최근 24시간" rule in code rather than trusting the
// prompt to obey it.
//
// The Gemini engine never needed this: fetchGoogleNews() appended `when:1d` to
// every query and then dropped anything failing `hoursAgo <= 24`, so the model
// physically could not cite an older article. The Claude engine does its own
// web research, which removed that hard gate — and the first runs after the
// switch pulled articles up to three weeks old. This module restores the same
// cutoff on the other side of generation: parse the 📅 badge out of every
// article card and drop the cards that fall outside the window, turning any
// section left empty into the usual "특이사항 없음" box.
//
// Everything here works in KST wall-clock time, like the rest of the briefing.

const KST_OFFSET_MS = 9 * 3600 * 1000;

// The article card / section markup this module matches is the one defined in
// .claude/skills/esmi/assets/template.html — keep the two in sync.
const CARD_MARKER = 'background-color:#F7F8FA;border:1px solid #E2E8F0';
const SECTION_MARKER = 'width:100%;margin-bottom:24px';
const NO_NEWS_TEXT = '특이사항 없음';

function toKst(date) {
  return new Date(date.getTime() + KST_OFFSET_MS);
}

/**
 * The window a run is allowed to cite from.
 * 24 hours, except Mondays, where it widens to 72 so the weekend isn't lost
 * (that exception comes from SKILL.md; the Gemini code used a flat 24h).
 */
function getBriefingWindow(now = new Date()) {
  const kstNow = toKst(now);
  const hours = kstNow.getUTCDay() === 1 ? 72 : 24;
  const startMs = kstNow.getTime() - hours * 3600 * 1000;
  // Mirrors the old `hoursAgo >= -1` allowance for feeds that publish a
  // timestamp slightly ahead of our clock.
  const endMs = kstNow.getTime() + 3600 * 1000;

  const allowedDates = [];
  const cursor = new Date(startMs);
  cursor.setUTCHours(0, 0, 0, 0);
  while (cursor.getTime() <= endMs) {
    allowedDates.push(
      `${String(cursor.getUTCMonth() + 1).padStart(2, '0')}.${String(cursor.getUTCDate()).padStart(2, '0')}`
    );
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return { hours, kstNow, startMs, endMs, allowedDates };
}

/**
 * Resolve a badge's "M.DD" (the year is never printed) to an absolute KST
 * instant, picking the year that places it at or before now — so a 12.31 badge
 * read on 01.01 resolves to last year rather than next year.
 */
function resolveBadgeInstant(month, day, hour, minute, kstNow) {
  const candidates = [kstNow.getUTCFullYear(), kstNow.getUTCFullYear() - 1].map((year) =>
    Date.UTC(year, month - 1, day, hour, minute)
  );
  const notFuture = candidates.filter((ms) => ms <= kstNow.getTime() + 36 * 3600 * 1000);
  return notFuture.length ? Math.max(...notFuture) : Math.min(...candidates);
}

/**
 * Is this badge inside the window?
 * A badge carrying a time is checked exactly. A date-only badge is kept when
 * any part of that calendar day overlaps the window — we can't tell which hour
 * it was published, and silently dropping same-day news would be worse than
 * keeping it.
 */
function isBadgeInWindow(badgeText, window) {
  const m = String(badgeText).match(/(\d{1,2})\s*[.\-/]\s*(\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (!m) return { inWindow: true, reason: 'unparsed' };

  const [, mm, dd, hh, min] = m;
  const month = Number(mm);
  const day = Number(dd);
  const hasTime = hh !== undefined;

  if (hasTime) {
    const ms = resolveBadgeInstant(month, day, Number(hh), Number(min), window.kstNow);
    return { inWindow: ms >= window.startMs && ms <= window.endMs, reason: 'exact' };
  }

  const dayStart = resolveBadgeInstant(month, day, 0, 0, window.kstNow);
  const dayEnd = dayStart + 24 * 3600 * 1000 - 1;
  return { inWindow: dayEnd >= window.startMs && dayStart <= window.endMs, reason: 'date-only' };
}

/**
 * Index just past the `</table>` matching the `<table` that starts at `from`.
 * Article cards nest a table (the 시사점 box), so a naive search for the first
 * `</table>` would cut a card in half.
 */
function findTableEnd(html, from) {
  const re = /<\/?table\b/gi;
  re.lastIndex = from;
  let depth = 0;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (m[0][1] === '/') {
      depth -= 1;
      if (depth === 0) return html.indexOf('>', m.index) + 1;
    } else {
      depth += 1;
    }
  }
  return -1;
}

function findBlocks(html, marker) {
  const blocks = [];
  let searchFrom = 0;
  while (true) {
    const markerAt = html.indexOf(marker, searchFrom);
    if (markerAt === -1) break;
    const start = html.lastIndexOf('<table', markerAt);
    const tagEnd = html.indexOf('>', markerAt);
    if (start === -1 || tagEnd === -1) break;
    const end = findTableEnd(html, start);
    if (end === -1) break;
    blocks.push({ start, end, html: html.slice(start, end) });
    searchFrom = end;
  }
  return blocks;
}

function noNewsParagraph() {
  return (
    '<p style="background-color:#F1F3F5;border-radius:4px;color:#64748B;' +
    'font-family:Arial,Helvetica,sans-serif;font-size:12px;padding:10px 12px;margin:0;">' +
    `${NO_NEWS_TEXT}</p>`
  );
}

// A section with nothing left to show adopts the muted heading the template
// uses for "특이사항 없음" sections.
function muteSection(sectionHtml) {
  return sectionHtml
    .replace(/border-bottom:2px solid #0F172A/g, 'border-bottom:2px solid #94A3B8')
    .replace(/(<h2[^>]*?)color:#0F172A/gi, '$1color:#64748B')
    .replace(/(<h2[^>]*?)font-size:16px/gi, '$1font-size:15px');
}

/**
 * Move sections that have no article cards to the bottom, keeping the relative
 * order within each group (the "항목 정렬 규칙" from SKILL.md). A no-op when the
 * briefing is already sorted that way.
 */
function sortSections(html) {
  const found = findBlocks(html, SECTION_MARKER).filter((s) => s.html.includes('<h2'));
  if (found.length < 2) return html;

  // Generated briefings label each section with an HTML comment just above it.
  // That comment belongs to the section it introduces, so absorb it before
  // moving anything — otherwise the labels stay behind and mislabel the result.
  const sections = found.map((section, i) => {
    const lowerBound = i === 0 ? 0 : found[i - 1].end;
    let start = section.start;
    while (true) {
      const before = html.slice(lowerBound, start);
      const m = before.match(/<!--[\s\S]*?-->\s*$/);
      if (!m) break;
      start = lowerBound + m.index;
    }
    return { ...section, start, html: html.slice(start, section.end) };
  });

  // Only safe to reshuffle when the sections are plain siblings; anything else
  // between them means we leave the document alone.
  for (let i = 0; i < sections.length - 1; i++) {
    if (html.slice(sections[i].end, sections[i + 1].start).trim() !== '') return html;
  }

  const withNews = sections.filter((s) => s.html.includes(CARD_MARKER));
  const withoutNews = sections.filter((s) => !s.html.includes(CARD_MARKER));
  if (!withoutNews.length || !withNews.length) return html;

  const separator = html.slice(sections[0].end, sections[1].start);
  const reordered = [...withNews, ...withoutNews].map((s) => s.html).join(separator);
  return html.slice(0, sections[0].start) + reordered + html.slice(sections[sections.length - 1].end);
}

/**
 * Strip out-of-window article cards from a generated briefing.
 * Returns the cleaned html plus counts for logging.
 */
function filterBriefingHtml(html, window = getBriefingWindow()) {
  const cards = findBlocks(html, CARD_MARKER);

  const doomed = [];
  for (const card of cards) {
    const badge = card.html.match(/📅\s*([^<]{1,32})/);
    if (!badge) continue;
    const verdict = isBadgeInWindow(badge[1], window);
    if (!verdict.inWindow) doomed.push({ ...card, badge: badge[1].trim() });
  }

  let out = html;
  // Right to left, so earlier offsets stay valid as we splice.
  for (let i = doomed.length - 1; i >= 0; i--) {
    out = out.slice(0, doomed[i].start) + out.slice(doomed[i].end);
  }

  // Any section (and any [지역] subgroup) emptied by the cull gets the
  // "특이사항 없음" box instead of a bare heading.
  const sections = findBlocks(out, SECTION_MARKER);
  let emptied = 0;
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    let body = section.html;
    if (!body.includes('<h2')) continue;

    const subheads = [...body.matchAll(/<h3\b[^>]*>[\s\S]*?<\/h3>/gi)];
    if (subheads.length) {
      for (let j = subheads.length - 1; j >= 0; j--) {
        const headEnd = subheads[j].index + subheads[j][0].length;
        const nextStart = j + 1 < subheads.length ? subheads[j + 1].index : body.length;
        const between = body.slice(headEnd, nextStart);
        if (!between.includes(CARD_MARKER) && !between.includes(NO_NEWS_TEXT)) {
          body = body.slice(0, headEnd) + noNewsParagraph() + body.slice(headEnd);
        }
      }
    }

    if (!body.includes(CARD_MARKER) && !body.includes(NO_NEWS_TEXT)) {
      const contentCell = body.lastIndexOf('<td');
      const cellOpenEnd = contentCell === -1 ? -1 : body.indexOf('>', contentCell) + 1;
      if (cellOpenEnd > 0) {
        body = body.slice(0, cellOpenEnd) + noNewsParagraph() + body.slice(cellOpenEnd);
      }
    }

    if (!body.includes(CARD_MARKER)) {
      body = muteSection(body);
      emptied += 1;
    }

    if (body !== section.html) {
      out = out.slice(0, section.start) + body + out.slice(section.end);
    }
  }

  // Culling cards can leave the briefing interleaved (news, empty, news,
  // empty). SKILL.md's 항목 정렬 규칙 wants every "특이사항 없음" section at the
  // bottom, so re-apply that stable partition after the cull.
  out = sortSections(out);

  return {
    html: out,
    total: cards.length,
    removed: doomed.map((d) => d.badge),
    kept: cards.length - doomed.length,
    emptiedSections: emptied,
    window,
  };
}

module.exports = { getBriefingWindow, isBadgeInWindow, filterBriefingHtml, KST_OFFSET_MS };
