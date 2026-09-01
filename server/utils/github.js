// Triggers the GitHub Actions workflow that generates a new energy-solution
// briefing. Replaces the old local-process spawn now that the server runs on
// Vercel (serverless — no persistent process, no shell to spawn into).
async function triggerBriefingWorkflow() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) {
    throw new Error('GITHUB_TOKEN/GITHUB_REPO 환경변수가 설정되어 있지 않습니다.');
  }

  const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/generate-briefing.yml/dispatches`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ref: 'main', inputs: { force: 'true' } }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub API ${res.status}: ${text}`);
  }
}

module.exports = { triggerBriefingWorkflow };
