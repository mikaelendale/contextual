# Log — Site
Newest first. One entry per task.

## 2026-11-13 · claude-code · The site gains the Neon driver and .ts imports
- Changed: `site/package.json`: `@neondatabase/serverless` 1.2.0, pinned ([why](../../decisions/2026-11-13-neon-serverless-driver.md)); `tsconfig.json`: `allowImportingTsExtensions`; `README.md`: `DATABASE_URL` and `FEEDBACK_REPORTS_SECRET`.
- Tests: `npx next build` passed; `npx eslint` clean.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · site/CLAUDE.md, so Claude Code reads site/AGENTS.md
- Changed: added `site/CLAUDE.md` with `@AGENTS.md` (issue #6).
- Tests: none for the site; the CLI suite passed.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · Found at setup
- Changed: nothing in the code. Read `site/`, and wrote this feature's context from them.
- Tests: no tests; `npm run build` passed, and the page was checked in screenshots at 390px and 1440px.
- Left open: an unused screenshot, and the deploy (notes.md).
- Deslop: not verified (existing UI, not reviewed against deslop.md at setup)
