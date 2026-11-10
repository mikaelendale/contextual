# Notes — Boards

## Gotchas
- 2026-11-08 · `db.transaction()` failed in `setLinkBoards`: the neon-http driver has no interactive transactions. It now uses `db.batch([...])`, which Neon runs as one transaction. Recorded in `stack/drizzle.md`.
- 2026-11-05 · "Add to board" belongs in the link's ⋯ menu, but `src/app/app/links/page.tsx` is owned by links (`which` says so). The only change there passes `AddToBoardMenu` into `LinkRow`'s `menuSlot`, and it's logged in links/log.md too.

## Open questions
- 2026-11-05 · Can two boards in a team have the same name? The plan doesn't say. Duplicates are allowed until someone decides.
