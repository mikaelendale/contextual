# Build — Boards

## Files
- `src/features/boards/schema.ts` · `boards`, `board_links`.
- `src/features/boards/actions.ts` · `createBoard`, `setLinkBoards`. `deleteBoard` is still to come.
- `src/features/boards/queries.ts` · `getBoards(teamId)`, `getBoardWithLinks(boardId)`.
- `src/features/boards/components/create-board-dialog.tsx` · a name field and Create.
- `src/features/boards/components/add-to-board-menu.tsx` · the team's boards as checkbox items, shown in a link's ⋯ menu.
- `src/features/boards/components/board-links.tsx` · a board's links, newest first.
- `src/app/app/boards/page.tsx` · all boards.
- `src/app/app/boards/[boardId]/page.tsx` · one board.
- Outside this feature: `src/app/app/links/page.tsx` (links) passes `AddToBoardMenu` into `LinkRow`.

## Data
- `boards` (id, team_id, name, created_by, created_at)
- `board_links` (board_id, link_id, added_by, added_at). Primary key (board_id, link_id). Both foreign keys are `on delete cascade`: deleting a board or a link removes its rows here and nothing else.

Migration `drizzle/0004_boards.sql`.

## Routes and actions
- `/app/boards` · the list, with "New board" as the primary action.
- `/app/boards/[boardId]` · the board's links.
- `createBoard(name)`, `setLinkBoards(linkId, boardIds)`.

## Components
`Dialog`, `Input`, `Button`, `DropdownMenu` (checkbox items), `EmptyState`, `Skeleton`, and `LinkRow` from links, through its `menuSlot`.

## Follows
- `stack/drizzle.md` (no `db.transaction`; use `db.batch`)
- `stack/nextjs.md` (`params` is a promise)
- `design/layouts.md` → List page, Detail page
- `design/components.md` → EmptyState, LinkRow
- `decisions/2026-11-03-board-links-join-table.md`
