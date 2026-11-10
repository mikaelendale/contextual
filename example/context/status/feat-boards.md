# Status — feat-boards
Updated: 2026-11-08 · by: claude-code

## Current focus
boards: the board page. Acceptance 3 (links newest first, with an empty state) is half done.

## Last session
- Built the board page at `/app/boards/[boardId]`; its links show newest first.
- `setLinkBoards` now uses `db.batch`, after `db.transaction()` failed on the neon-http driver (notes.md, stack/drizzle.md).
- The board title was 28px, which isn't on the type scale; it's 20px now.

## In progress
- Empty state for a board with no links: `EmptyState` with "No links on this board yet" and a "Go to Links" action (design/layouts.md → Detail page). Its e2e test is written and failing: "shows an empty board" in `e2e/boards.spec.ts`.

## Blocked / needs a human
- Can two boards in a team have the same name? Asked 2026-11-05. Duplicates are allowed until someone decides.

## Next
1. Build the board's empty state and make the failing e2e test pass.
2. Delete a board (acceptance 4). Its `board_links` rows go by cascade; the links stay.
3. Run every check in boards/tests.md, then stop for review. Merging is the owner's call.
