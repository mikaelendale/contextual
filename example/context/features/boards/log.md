# Log — Boards
Newest first. One entry per task.

## 2026-11-08 · claude-code · Board page lists its links
- Changed: `src/app/app/boards/[boardId]/page.tsx` and `board-links.tsx`; links show newest first. `setLinkBoards` now uses `db.batch` (see notes.md).
- Tests: `actions.test.ts` 9/9 pass. `e2e/boards.spec.ts` 3 of 4 pass; "shows an empty board" fails because the empty state isn't built yet.
- Left open: the board's empty state; deleting a board.
- Deslop: fixed: the board title was 28px, which isn't on the type scale; now 20px, the page-title size.

## 2026-11-05 · codex · Add a link to boards from its menu
- Changed: `add-to-board-menu.tsx` and the `setLinkBoards` action; the links page passes the menu into `LinkRow` (logged in links/log.md too).
- Tests: 4 unit tests for `setLinkBoards`; e2e "adds a link to two boards" passes.
- Left open: asked whether board names must be unique (notes.md).
- Deslop: pass

## 2026-11-03 · claude-code · Start boards: tables, create a board
- Changed: branch `feat/boards` and its status file; `boards` and `board_links` tables (`drizzle/0004_boards.sql`); `createBoard`; `create-board-dialog.tsx`; the boards list at `/app/boards`; boards in the sidebar.
- Tests: `actions.test.ts` 5/5 pass; e2e "creates a board" passes.
- Left open: adding links to boards; the board page.
- Deslop: pass
