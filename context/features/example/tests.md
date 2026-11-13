# Tests — Example

## Automated
`fixtures.test.js` (8 tests): `cd packages/cli && node --test test/fixtures.test.js`. `check.test.js` and CI also run `check` on it.

## How a person reaches it
Open `example/` on GitHub, or copy it.

## How the agent checks it
1. `cd example && node ../packages/cli/bin/usecontextual.js check --branch main`.
2. Run `fixtures.test.js`.

## What proves it works
0 errors and 2 warnings (no skills installed, no app code); the fixture tests pass.

## Last result
2026-11-13 · `check` on `example/`: 0 errors, 2 warnings; `npm test` · 112 passed.
