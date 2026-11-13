# Tests — Foundation

## Automated
`test/cli.test.js` (3 tests) and `test/skills.test.js` (7). Only these: `cd packages/cli && node --test test/cli.test.js test/skills.test.js`, under a second. CI runs the whole suite on Node 20, 22, 24 and 26.

## How a person reaches it
`npx usecontextual --help` in any folder.

## How the agent checks it
1. `cd packages/cli && npm test`.
2. `node bin/usecontextual.js --help` and `--version`.
3. Push, and check that CI passes on every Node version.

## What proves it works
Every test passes; the help lists `init`, `check`, `check --fix`, `check --staged`, `which` and `update`; the version matches `package.json`.

## Last result
2026-11-13 · `npm test` · 112 passed on Node 26 and Node 20; CI passed on Node 20, 22, 24 and 26.
