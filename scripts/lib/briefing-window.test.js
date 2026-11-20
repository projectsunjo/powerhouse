// node --test scripts/lib/
const test = require('node:test');
const assert = require('node:assert');
const { getBriefingWindow, isBadgeInWindow, filterBriefingHtml } = require('./briefing-window');

// 2026-11-19T23:49Z === 2026-11-20 08:49 KST (a Friday)
const FRIDAY = new Date('2026-11-19T23:49:00Z');
// 2026-11-22T23:49Z === 2026-11-23 08:49 KST (a Monday)
const MONDAY = new Date('2026-11-22T23:49:00Z');

test('window is 24h on weekdays and 72h on Mondays (KST)', () => {
  const fri = getBriefingWindow(FRIDAY);
  assert.strictEqual(fri.hours, 24);
  assert.deepStrictEqual(fri.allowedDates, ['11.19', '11.20']);

  const mon = getBriefingWindow(MONDAY);
  assert.strictEqual(mon.hours, 72);
  assert.deepStrictEqual(mon.allowedDates, ['11.20', '11.21', '11.22', '11.23']);
});

test('date-only badges are kept when the day overlaps the window', () => {
  const w = getBriefingWindow(FRIDAY);
  assert.ok(isBadgeInWindow('11.20', w).inWindow);
  assert.ok(isBadgeInWindow('11.19', w).inWindow);
  assert.ok(!isBadgeInWindow('11.18', w).inWindow);
  assert.ok(!isBadgeInWindow('10.29', w).inWindow);
});

test('timed badges are checked to the hour', () => {
  const w = getBriefingWindow(FRIDAY);
  assert.ok(isBadgeInWindow('11.19 23:00', w).inWindow);
  assert.ok(!isBadgeInWindow('11.19 06:00', w).inWindow, '06:00 is more than 24h before 08:49');
});

test('a badge without a year resolves across the new year', () => {
  const w = getBriefingWindow(new Date('2027-01-01T00:30:00Z')); // 09:30 KST, Jan 1
  assert.ok(isBadgeInWindow('12.31 20:00', w).inWindow);
  assert.ok(!isBadgeInWindow('12.20', w).inWindow);
});

test('an unparseable badge is left alone rather than dropped', () => {
  assert.ok(isBadgeInWindow('어제', getBriefingWindow(FRIDAY)).inWindow);
});

const card = (badge, title) => `
            <table role="presentation" width="100%" style="width:100%;background-color:#F7F8FA;border:1px solid #E2E8F0;border-radius:6px;margin-bottom:12px;border-collapse:collapse;">
              <tr><td style="padding:12px;">
                <p><span style="background-color:#EEF2F6;">📅 ${badge}</span><span>매일경제</span></p>
                <p><a href="https://example.com" target="_blank">${title}</a></p>
                <table role="presentation" width="100%" style="width:100%;background-color:#F8FAFC;border-left:3px solid #0E7C86;">
                  <tr><td><strong>💡 시사점:</strong> ...</td></tr>
                </table>
              </td></tr>
            </table>`;

const section = (title, cards) => `
      <!-- ========================= ${title} ========================= -->
      <table role="presentation" width="100%" style="width:100%;margin-bottom:24px;border-collapse:collapse;">
        <tr><td style="border-bottom:2px solid #0F172A;padding:0 0 6px 0;">
          <h2 style="color:#0F172A;font-size:16px;font-weight:bold;margin:0;">■ ${title}</h2>
        </td></tr>
        <tr><td style="padding:12px 0 0 0;">${cards}
        </td></tr>
      </table>`;

const doc = (...sections) =>
  `<!DOCTYPE html>\n<html lang="ko"><body><table><tr><td>${sections.join('\n')}\n      </td></tr></table></body>\n</html>`;

test('out-of-window cards are dropped and in-window cards survive', () => {
  const html = doc(section('A', card('11.20', 'fresh') + card('10.29', 'stale')));
  const res = filterBriefingHtml(html, getBriefingWindow(FRIDAY));

  assert.strictEqual(res.total, 2);
  assert.strictEqual(res.kept, 1);
  assert.deepStrictEqual(res.removed, ['10.29']);
  assert.ok(res.html.includes('fresh'));
  assert.ok(!res.html.includes('stale'));
  // The 시사점 box nested inside each card must not break card boundaries.
  assert.strictEqual((res.html.match(/<table\b/g) || []).length, (res.html.match(/<\/table>/g) || []).length);
});

test('a section left empty gets a 특이사항 없음 box and a muted heading', () => {
  const html = doc(section('A', card('11.20', 'fresh')), section('B', card('10.29', 'stale')));
  const res = filterBriefingHtml(html, getBriefingWindow(FRIDAY));

  assert.strictEqual(res.emptiedSections, 1);
  assert.ok(res.html.includes('특이사항 없음'));
  assert.ok(res.html.includes('color:#64748B;font-size:15px'), 'emptied section heading is muted');
  assert.ok(res.html.includes('border-bottom:2px solid #94A3B8'), 'emptied section underline is muted');
});

test('emptied sections move below sections that still have news', () => {
  const html = doc(
    section('stale-first', card('10.29', 'stale')),
    section('fresh-second', card('11.20', 'fresh'))
  );
  const res = filterBriefingHtml(html, getBriefingWindow(FRIDAY));

  const titles = [...res.html.matchAll(/■ ([a-z-]+)/g)].map((m) => m[1]);
  assert.deepStrictEqual(titles, ['fresh-second', 'stale-first']);
  // The label comment travels with its section rather than staying put.
  assert.ok(res.html.indexOf('===== fresh-second') < res.html.indexOf('===== stale-first'));
});

test('a briefing entirely inside the window is returned untouched', () => {
  const html = doc(section('A', card('11.20', 'fresh')), section('B', card('11.19', 'also fresh')));
  const res = filterBriefingHtml(html, getBriefingWindow(FRIDAY));

  assert.strictEqual(res.removed.length, 0);
  assert.strictEqual(res.emptiedSections, 0);
  assert.strictEqual(res.html, html);
});
