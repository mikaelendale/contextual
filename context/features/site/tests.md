# Tests — Site

## Automated
- Counting visits: `site/lib/visits/visits.test.ts`, with `cd site && node --test lib/*/*.test.ts` (Node 22.18 or newer, which runs TypeScript directly).

## How a person reaches it
Open the site.

## How the agent checks it
1. `cd site && npm install && npm run build && npm run lint`.
2. `npm run dev`, then open http://localhost:3000 at 375px and at 1440px.
3. Watch both figures play, point at them, press Replay; open the GitHub card by hovering or tabbing to it; try reduced motion.

## What proves it works
The build passes, nothing scrolls sideways, the figures play, hold and replay, and the console is clean.

## Last result
2026-11-13 · the site's tests (12 passed), `next build`, lint and the type check. Against the database in headless Chrome: the first visit counted, a reload and the feedback form didn't, and a return after 31 minutes did; the reports page showed the totals at 375px, 390px and 1440px.
