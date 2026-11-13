# Log — Site
Newest first. One entry per task.

## 2026-11-13 · claude-code · Moved to a private repository
- Changed: `site/` is gone from this repo; the site's code is now at the root of a separate, private repository, so it isn't open source. Status deprecated; `covers: site/**` stays as a record. CI no longer runs the site's tests. The site's deploy and database notes moved with it.
- Tests: in the private repo: the site's tests (12 passed), `next build`, the type check and lint, and its dev server answers on `/`, `/agent/feedback` and `/agent/feedback/reports`.
- Left open: the code is still in this repo's git history; removing it from there would mean rewriting public history.
- Deslop: not UI (no change to the site itself)

## 2026-11-13 · claude-code · Page visits in the database
- Changed: the home page counts a visit once per browser per 30-minute session (`components/visit-beacon.tsx`, `POST /api/visits`, `lib/visits/`), stored as one row per page per day in a new table (`db/migrations/0002_page_visits.sql`, run on Neon). No IP address, browser details or referrer; the server allows 10 counts per address per 30 minutes, keyed by an in-memory hash. The feedback pages count nothing. The owner's reports page shows today, the last 7 and 30 days, and all time. The database connection and the rate limit moved to `lib/db.ts` and `lib/rate-limit.ts`, shared with agent-feedback (on the `shared:` line). CI runs `node --test lib/*/*.test.ts`.
- Tests: 5 new tests (12 in the site). In headless Chrome against the database: the first visit counted, a reload and the feedback form didn't, a return after 31 minutes did; curl without the browser's same-origin mark got 403. The test visits were then deleted.
- Left open: visits aren't shown on the public page; the earlier counter there was removed on request.
- Deslop: fixed the database error's next step, which named only the migration; pass otherwise (headless Chrome at 375px, 390px and 1440px: the totals with none counted, a focused filter, an empty filter, loading with scripts off, no database, a failing database)

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
