#!/usr/bin/env bash
# Generates a new energy-solution briefing and inserts it into the briefings table.
# Usage: run-esmi-briefing.sh [runId]
# Called by the in-app scheduler and by the admin dashboard's "지금생성" button
# (both via server/briefingGenerator.js).
set -euo pipefail
cd "$(dirname "$0")/.."

RUN_ID="${1:-}"

OUT="$(mktemp --suffix=.html)"
trap 'rm -f "$OUT"' EXIT

claude -p "Run the esmi skill's full research methodology right now. Read .claude/skills/esmi/SKILL.md and .claude/skills/esmi/assets/template.html in this project for the exact methodology, watchlists, sorting rules, and the table-based inline-style HTML structure to clone. Use today's actual current date as the 조사 날짜 (do not use a stale or placeholder date). Perform the real web research (WebSearch/WebFetch) across all 7 categories per the skill. Write the final self-contained HTML directly to the file at $OUT using the Write tool. Do NOT save to /mnt/user-data/outputs and do NOT call present_files — this file is consumed by the web app's Market Info > 에너지 솔루션 탭, not delivered in chat." \
  --dangerously-skip-permissions

node scripts/insert-briefing.js "$OUT" "$RUN_ID"
