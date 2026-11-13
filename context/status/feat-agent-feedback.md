# Status — feat-agent-feedback
Updated: 2026-11-13 · by: claude-code

## Current focus
agent-feedback: connecting Neon, then the first reports through the form.

## Last session
- The CLI: `feedback`, `feedback on|off`, init's question, update, the most-specific owner, `which --unowned`.
- The site: the form, Send, the list page, the migration; CI's connection-string check; docs, spec 6.5, CHANGELOG 0.2.0.
- A real trial: a copy of the Pantry repo pinned 0.0.1, so the block's command failed; the report about it filled the form. Recorded in `docs/trials/2026-11-13-agent-feedback/`, with four more first reports.
- A preview deployment is up; `FEEDBACK_REPORTS_SECRET` is set on Vercel.
- CI failed on this branch only: tests on temp copies read CI's branch variables, and Node 24 can't take a folder for `--test`. Both fixed. The trial's link is 1,365 characters; an earlier note said 1,745 without measuring.

## In progress
Neon: `site/db/migrations/0001_agent_feedback.sql` isn't run anywhere yet.

## Blocked / needs a human
- A Neon database for the reports, and `DATABASE_URL` and `FEEDBACK_REPORTS_SECRET` on Vercel.
- How long reports are kept.

## Next
1. Run the migration, set the two variables, deploy a preview.
2. Send the first reports through the preview's form; look at the list page.
3. Tick the last two acceptance lines and record the deslop result for the list page.
