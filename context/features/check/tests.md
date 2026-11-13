# Tests — Check

## Automated
`check.test.js` (40 tests), `fix.test.js` (4), `plan.test.js` (6), `which.test.js` (8), `owners.test.js` (8): `cd packages/cli && node --test test/check.test.js test/fix.test.js test/plan.test.js test/which.test.js test/owners.test.js`, about 3 seconds.

## How a person reaches it
`npx usecontextual check` in a project, or `which <path>`.

## How the agent checks it
1. `cd example && node ../packages/cli/bin/usecontextual.js check --branch main`.
2. Break something in a copy (a missing feature file, a doubly covered path) and run it again.
3. `which` a few paths.

## What proves it works
0 errors and 2 warnings on the example; each break gives the error spec 6.1 describes.

## Last result
2026-11-13 · `npm test` · 120 passed.
