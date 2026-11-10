# Tests — Boards

## Automated
- `src/features/boards/actions.test.ts` (Vitest): `createBoard`, `setLinkBoards`.
- `e2e/boards.spec.ts` (Playwright): create a board, add a link to two boards, the board page's order, an empty board.
- Run only these: `pnpm vitest run src/features/boards` (a few seconds) and `pnpm test:e2e e2e/boards.spec.ts` (about 30 seconds). Run the full e2e suite (about 4 minutes) only for the final check before review.

## How a person reaches it
Sidebar → Boards → New board. To add a link: the link's ⋯ menu → Add to board.

## How the agent checks it
1. `pnpm dev`, sign in, open `/app/boards`.
2. New board "Onboarding": it appears in the list and in the sidebar.
3. On `/app/links`, open a link's ⋯ menu → Add to board → tick "Onboarding" and one other board.
4. Open `/app/boards/<id>`: the link is there, and links are newest first.
5. Create an empty board and open it: the empty state says "No links on this board yet", explains that links are added from a link's ⋯ menu, and has a "Go to Links" button. (Not built yet.)

## What proves it works
- After step 2, a `boards` row with the team's id.
- After step 3, two `board_links` rows for that link.
- At step 4, the order matches `added_at`, newest first.

## Last result
2026-11-08 · vitest 9/9 pass · e2e 3/4 pass ("shows an empty board" fails: the empty state isn't built yet).
