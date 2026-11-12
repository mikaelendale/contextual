# Log — Auth
Newest first. One entry per task.

## 2026-09-23 · claude-code · Merged to main
- Changed: contextual-sync on main: status → shipped, ticked in build-plan.md, deleted status/feat-auth.md, added a line to status/main.md.
- Tests: none run (merge only).
- Left open: nothing.
- Deslop: not UI.

## 2026-09-20 · codex · Sign out and session checks
- Changed: account menu with Sign out; `requireSession()`; `src/proxy.ts` redirects signed-out visitors away from `/app`.
- Tests: e2e "redirects when signed out" and "signs out" pass.
- Left open: nothing.
- Deslop: pass (Playwright screenshots of the account menu at 375px and 1280px)

## 2026-09-18 · claude-code · Magic-link sign-in
- Changed: branch `feat/auth`; Better Auth with the Drizzle adapter and the magic-link plugin (links expire after 10 minutes); `/sign-in`; development emails print to the terminal.
- Tests: e2e "sign-in link works once" passes.
- Left open: signing out; redirecting signed-out visitors.
- Deslop: fixed the form sitting under a large illustration; it uses the plain Auth page layout now.
