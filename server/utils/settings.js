const { pool } = require('../db');

async function getSetting(key, fallback = null) {
  const { rows } = await pool.query('SELECT value FROM settings WHERE key = $1', [key]);
  return rows[0] ? rows[0].value : fallback;
}

async function setSetting(key, value) {
  await pool.query(
    'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
    [key, String(value)]
  );
}

async function getBriefingSettings() {
  const [scheduleEnabled, scheduleHour, intervalHours, emailRecipients, emailSubjectTemplate] = await Promise.all([
    getSetting('briefing_schedule_enabled', '1'),
    getSetting('briefing_schedule_hour', '8'),
    getSetting('briefing_interval_hours', '24'),
    getSetting('briefing_email_recipients', ''),
    getSetting('briefing_email_subject_template', '[ESMI 마켓봇] 국내외 전력 및 SOFC 관련 {날짜}'),
  ]);
  return {
    scheduleEnabled: scheduleEnabled === '1',
    scheduleHour: parseInt(scheduleHour, 10),
    intervalHours: parseInt(intervalHours, 10),
    emailRecipients,
    emailSubjectTemplate,
  };
}

module.exports = { getSetting, setSetting, getBriefingSettings };
