# Status — feat-agent-feedback
Updated: 2026-11-13 · by: claude-code

## Current focus
agent-feedback: the site's form, Send, the table and the list page.

## Last session
- The most-specific-owner rule, `which --unowned` (issue #4), nested `AGENTS.md` in setup (issue #6).
- `usecontextual feedback`, `feedback on|off`, init's question, update keeping the block in step. 133 tests pass.

## In progress
The site: `site/app/agent/feedback/`, `site/lib/feedback/`, `site/db/migrations/`.

## Blocked / needs a human
- Running the migration on Neon needs a Neon login on this machine.

## Next
1. The form at `/agent/feedback`: reads the fragment, shows what will be sent.
2. `POST /agent/feedback/send`: validation, caps, honeypot, rate limit, one row.
3. The list page behind a secret, with filters.
4. CI's check against committed connection strings; docs; CHANGELOG; a real trial.
