const path = require('path');
const { spawn } = require('child_process');
const db = require('./db');

let generating = false;

function isGenerating() {
  return generating;
}

// Triggers a new briefing generation run. Returns { ok, error } synchronously;
// the actual research happens in the background (see briefing_runs for progress/result).
function generateBriefingNow() {
  if (generating) {
    return { ok: false, error: '이미 생성이 진행 중입니다.' };
  }

  generating = true;
  const info = db.prepare("INSERT INTO briefing_runs (started_at, status) VALUES (datetime('now'), 'running')").run();
  const runId = info.lastInsertRowid;

  const scriptPath = path.join(__dirname, '..', 'scripts', 'run-esmi-briefing.sh');
  const child = spawn('bash', [scriptPath, String(runId)], {
    cwd: path.join(__dirname, '..'),
    detached: true,
    stdio: 'ignore',
  });
  child.unref();

  const markFailedIfStillRunning = (message) => {
    const run = db.prepare('SELECT status FROM briefing_runs WHERE id = ?').get(runId);
    if (run && run.status === 'running') {
      db.prepare(
        "UPDATE briefing_runs SET completed_at = datetime('now'), status = 'failed', error = ? WHERE id = ?"
      ).run(message, runId);
    }
  };

  child.on('error', (err) => {
    generating = false;
    markFailedIfStillRunning(err.message);
  });
  child.on('exit', (code) => {
    generating = false;
    if (code !== 0) markFailedIfStillRunning(`종료 코드 ${code}`);
  });

  return { ok: true, runId };
}

module.exports = { generateBriefingNow, isGenerating };
