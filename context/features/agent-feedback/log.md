# Log — Agent feedback
Newest first. One entry per task.

## 2026-11-13 · claude-code · The xdg-open test clears every CI variable
- Changed: `packages/cli/test/feedback.test.js`: GitHub Actions sets `GITHUB_ACTIONS`, so the command rightly refused to run in that test.
- Tests: `npm test` with CI's variables set: 133 passed.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · The site: the form, Send, the list page, the table; the docs
- Changed: `site/app/agent/feedback/` (the form reads the fragment with `useSyncExternalStore`; Send at `send/route.ts`; the owner's list at `reports/`), `site/lib/feedback/` (report rules, Send, the per-visitor limit with keyed hashes, Neon, the owner cookie), `site/db/migrations/0001_agent_feedback.sql`, `docs/agent-feedback.md`.
- Tests: `cd site && node --test lib/feedback/`: 7 passed. `npm test` in `packages/cli`: 133 passed. `npx next build` passed: the form is static, the list a partial prerender, Send dynamic. A real trial in a copy of the Pantry repo produced a 1,745-character link, and the form showed every field.
- Left open: running the migration on Neon and seeing one row arrive; the list page with real reports. Both need DATABASE_URL.
- Deslop: not verified (the list page needs a database with reports to look at; the form passed: headless Chrome screenshots at 1440px, 390px and 375px of the filled form, the focus ring, a Send error, the sent state and a link with no report, with field borders 3.6:1 and errors 6.0:1)

## 2026-11-13 · claude-code · The feedback command, on and off, init and update
- Changed: `packages/cli/src/feedback.js`: the flags, the automatic fields, cleaning, the 600-character caps, the link with the report in its fragment, opening the browser; `feedback on` and `off`. The block's text is `templates/agent-feedback-block.md`.
- Tests: `npm test` in `packages/cli`: 133 passed on Node 26, and 132 on Node 20 before the opener test was added. 13 of them are in `feedback.test.js`.
- Left open: the site's form, Send, the table and the list page; the docs.
- Deslop: not UI.

## 2026-11-13 · claude-code · Started: the requirements and the plan
- Changed: the README's requirements and acceptance list, `build.md` and `tests.md` with the plan; the branch `feat/agent-feedback`.
- Tests: none yet.
- Left open: everything in the acceptance list.
- Deslop: not UI.
