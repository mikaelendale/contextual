# Tests — Site

## Automated
None.

## How a person reaches it
Open the site.

## How the agent checks it
1. `cd site && npm install && npm run build && npm run lint`.
2. `npm run dev`, then open http://localhost:3000 at 375px and at 1440px.
3. Watch both figures play, point at them, press Replay; open the GitHub card by hovering or tabbing to it; try reduced motion.

## What proves it works
The build passes, nothing scrolls sideways, the figures play, hold and replay, and the console is clean.

## Last result
2026-11-13 · `npm run build` passed; screenshots at 390px and 1440px: no sideways scroll, no console errors.
