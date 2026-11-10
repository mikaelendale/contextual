# Log — Links
Newest first. One entry per task.

## 2026-11-05 · codex · "Add to board" in the link menu (from feat/boards)
- Changed: `src/app/app/links/page.tsx` passes boards' `AddToBoardMenu` into `LinkRow`'s `menuSlot`. Nothing else in links changed.
- Tests: `pnpm test:e2e e2e/links.spec.ts` 5/5 pass.
- Left open: nothing.
- Deslop: pass

## 2026-10-21 · claude-code · Merged to main
- Changed: contextual-sync on main: status → shipped, ticked in build-plan.md, deleted status/feat-links.md, added a line to status/main.md.
- Tests: none run (merge only).
- Left open: nothing.
- Deslop: not UI.

## 2026-10-16 · codex · Edit and delete your own links
- Changed: edit dialog, and delete with a confirm, in the link's ⋯ menu. `updateLink` and `deleteLink` check `created_by`.
- Tests: 4 unit tests for who can edit and delete; e2e "edit" and "delete" pass.
- Left open: nothing.
- Deslop: fixed: the delete confirm had two primary buttons; now one destructive button and a secondary Cancel.

## 2026-10-13 · claude-code · Duplicate links
- Changed: `normalizeUrl()` and the unique index; saving a URL the team already has highlights the existing link.
- Tests: `normalize.test.ts` (14 cases); e2e "duplicate" passes.
- Left open: edit and delete.
- Deslop: pass

## 2026-10-09 · claude-code · Save a link, list the team's links
- Changed: branch `feat/links`; `links` table (`drizzle/0003_links.sql`); the save form; `/app/links` with its empty and loading states; `/app` now redirects to it.
- Tests: 5 unit tests for `saveLink`; e2e "save" and "invalid URL" pass.
- Left open: duplicates; edit and delete.
- Deslop: pass
