const { getSetting } = require('./settings');

async function triggerBriefingWorkflow(runId) {
  const repo = process.env.GITHUB_REPO || 'projectsunjo/powerhouse';
  const token = (await getSetting('github_token')) || process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN 환경변수 또는 DB 설정(settings.github_token)이 등록되어 있지 않습니다.');
  }

  const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/generate-briefing.yml/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Powerhouse-App',
    },
    body: JSON.stringify({ ref: 'main', inputs: { force: 'true', run_id: runId ? String(runId) : '' } }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub API ${res.status}: ${text}`);
  }
}

module.exports = { triggerBriefingWorkflow };
