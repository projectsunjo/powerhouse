const db = require('../db');

function getSetting(key, fallback = null) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? row.value : fallback;
}

function setSetting(key, value) {
  db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  ).run(key, String(value));
}

function getBriefingSettings() {
  return {
    scheduleEnabled: getSetting('briefing_schedule_enabled', '1') === '1',
    scheduleHour: parseInt(getSetting('briefing_schedule_hour', '8'), 10),
    intervalHours: parseInt(getSetting('briefing_interval_hours', '24'), 10),
    emailRecipients: getSetting('briefing_email_recipients', ''),
    emailSubjectTemplate: getSetting('briefing_email_subject_template', '[ESMI 마켓봇] 국내외 전력 및 SOFC 관련 {날짜}'),
  };
}

module.exports = { getSetting, setSetting, getBriefingSettings };
