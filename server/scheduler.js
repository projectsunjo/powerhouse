const { getSetting, setSetting } = require('./utils/settings');
const { generateBriefingNow, isGenerating } = require('./briefingGenerator');

const CHECK_INTERVAL_MS = 60 * 1000;

function computeNextRunAt() {
  const hour = parseInt(getSetting('briefing_schedule_hour', '8'), 10);
  const intervalHours = parseInt(getSetting('briefing_interval_hours', '24'), 10);
  const lastRun = getSetting('briefing_last_scheduled_run_at', null);

  if (lastRun) {
    return new Date(lastRun).getTime() + intervalHours * 3600 * 1000;
  }

  const anchor = new Date();
  anchor.setHours(hour, 0, 0, 0);
  if (anchor.getTime() <= Date.now()) anchor.setDate(anchor.getDate() + 1);
  return anchor.getTime();
}

function tick() {
  const enabled = getSetting('briefing_schedule_enabled', '1') === '1';
  if (!enabled || isGenerating()) return;

  if (Date.now() >= computeNextRunAt()) {
    setSetting('briefing_last_scheduled_run_at', new Date().toISOString());
    console.log('[scheduler] Triggering scheduled briefing generation.');
    generateBriefingNow();
  }
}

function start() {
  setInterval(tick, CHECK_INTERVAL_MS);
  console.log('[scheduler] Briefing scheduler started.');
}

module.exports = { start };
