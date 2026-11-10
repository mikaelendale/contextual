# Tests — Links

## Automated
- `src/features/links/normalize.test.ts` (Vitest): 14 URL cases.
- `src/features/links/actions.test.ts` (Vitest): saving, duplicates, who can edit and delete.
- `e2e/links.spec.ts` (Playwright): save, invalid URL, duplicate, edit, delete.
- Run only these: `pnpm vitest run src/features/links` (about 5 seconds) and `pnpm test:e2e e2e/links.spec.ts` (about 40 seconds).

## How a person reaches it
After signing in, the app opens on Links. "Save link" is at the top right, or press `n`.

## How the agent checks it
1. `pnpm dev`, sign in, open `/app/links`.
2. Save `https://example.com/?utm_source=x`: it appears at the top.
3. Save `https://EXAMPLE.com`: the existing link is highlighted and nothing new is added.
4. Save `not a url`: the error shows under the field.
5. Sign in as another member of the team: the first person's link has no Edit or Delete in its menu.

## What proves it works
- After steps 2 and 3, exactly one `links` row, with `url_normalized` = `https://example.com`.
- No new row after step 4.

## Last result
2026-11-05 · e2e 5/5 pass (rerun after boards changed the links page; see log). Before that: 2026-10-21 · vitest 23/23 pass, e2e 5/5 pass, manual steps 1–5 checked.
