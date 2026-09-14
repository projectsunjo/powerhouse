# Project notes for Claude

## Do infra/setup work yourself when technically possible

When a task needs external service configuration (API keys, env vars,
buckets, webhooks, DNS, etc.), default to doing it directly via that
service's CLI/API yourself instead of handing the user manual dashboard
steps — the same way this project's Vercel env vars, project linking,
and SSO settings were configured directly through the Vercel API/CLI
this session.

- If you're missing a credential to do this (e.g. a personal access
  token), ask the user for just that credential, explain in one line
  why it's needed, and say exactly where to generate it — then
  complete the rest of the setup yourself in one pass.
- Store any long-lived credential you need to reuse across turns in a
  local file (e.g. `~/.<service>-token` in WSL, permissions restricted
  to the user) rather than asking for it again later — see
  `~/.vercel-token` for the existing pattern.
- Only fall back to giving the user manual steps when the action is
  something Claude Code is not permitted to do itself (entering
  payment details, creating new accounts, etc.) or when no
  CLI/API path exists.

## Stack

- Node/Express app (`server/`), static frontend (`public/`, `admin/`).
- Postgres via Supabase (project ref `ywpgpsktmmdkzwisvrpa`).
- Hosted on Vercel (serverless, `api/index.js` re-exports `server/index.js`).
- `scripts/generate-briefing.js` runs the ESMI energy market briefing.
  Powered by Google Gemini API (`GEMINI_API_KEY`) and real-time news aggregation,
  running on GitHub Actions (`ubuntu-latest`). It communicates with the deployed app
  over `/api/internal/*` to record the briefing and trigger email distribution.
  (Claude Code CLI fallback is retained if `CLAUDE_CODE_OAUTH_TOKEN` is used).
- Local dev only works from WSL (Windows host has no Node toolchain),
  and this network requires `NODE_EXTRA_CA_CERTS`/`https_proxy` for
  most outbound HTTPS — see `~/corp-ca-bundle.pem` and the proxy env
  vars used throughout this session's commands.
