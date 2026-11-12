# Log — Foundation
Newest first. One entry per task.

## 2026-09-20 · codex · signInAs helper for e2e (from feat/auth)
- Changed: `e2e/helpers/auth.ts` with `signInAs(page, email)`, which creates a session directly so e2e tests skip the email. Auth's tests needed it; the helper is foundation's, so it's logged here.
- Tests: `pnpm test:e2e e2e/smoke.spec.ts` 1/1 pass.
- Left open: nothing.
- Deslop: not UI.

## 2026-09-16 · claude-code · Merged to main
- Changed: contextual-sync on main: status → shipped, ticked in build-plan.md, deleted status/feat-foundation.md, added a line to status/main.md.
- Tests: none run (merge only).
- Left open: nothing.
- Deslop: not UI.

## 2026-09-14 · claude-code · App shell, layouts and test setup
- Changed: branch `feat/foundation`; the Next.js app, the root and signed-in layouts, `globals.css` with the tokens from design/principles.md, the error screen, `src/db/index.ts`, and the Vitest and Playwright setups, with one Playwright smoke test.
- Tests: `pnpm test:e2e e2e/smoke.spec.ts` 1/1 pass.
- Left open: nothing.
- Deslop: pass (Playwright screenshots of the signed-in layout and the error screen at 375px and 1280px)
