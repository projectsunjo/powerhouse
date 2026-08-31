// Reads an HTML file, inserts it as a new row in the briefings table, emails it,
// and updates the corresponding briefing_runs log row.
// Used by run-esmi-briefing.sh after Claude writes the generated HTML to a temp file.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../server/db');
const { sendBriefingEmail } = require('../server/utils/mailer');
const { getBriefingSettings } = require('../server/utils/settings');

async function main() {
  const filePath = process.argv[2];
  const runId = process.argv[3] ? parseInt(process.argv[3], 10) : null;
  if (!filePath) {
    console.error('Usage: node insert-briefing.js <path-to-html-file> [runId]');
    process.exit(1);
  }

  const html = fs.readFileSync(path.resolve(filePath), 'utf8');
  const info = db.prepare('INSERT INTO briefings (html) VALUES (?)').run(html);
  const row = db.prepare('SELECT created_at FROM briefings WHERE id = ?').get(info.lastInsertRowid);
  console.log(`Inserted briefing id ${info.lastInsertRowid}`);

  const { emailRecipients, emailSubjectTemplate } = getBriefingSettings();
  let emailStatus;
  try {
    emailStatus = await sendBriefingEmail(html, row.created_at, emailRecipients, emailSubjectTemplate);
  } catch (e) {
    emailStatus = `이메일 발송 실패: ${e.message}`;
  }
  console.log(`[mailer] ${emailStatus}`);

  if (runId) {
    db.prepare(
      "UPDATE briefing_runs SET completed_at = datetime('now'), status = 'success', briefing_id = ?, email_status = ? WHERE id = ?"
    ).run(info.lastInsertRowid, emailStatus, runId);
  }
}

main().catch((e) => {
  console.error('insert-briefing failed:', e.message);
  const runId = process.argv[3] ? parseInt(process.argv[3], 10) : null;
  if (runId) {
    try {
      db.prepare(
        "UPDATE briefing_runs SET completed_at = datetime('now'), status = 'failed', error = ? WHERE id = ?"
      ).run(e.message, runId);
    } catch (_) {}
  }
  process.exit(1);
});
