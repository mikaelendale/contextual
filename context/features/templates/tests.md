# Tests — Templates

## Automated
`test/presets.test.js` (7 tests): `cd packages/cli && node --test test/presets.test.js`, under a second. `init.test.js`, `skills.test.js` and `fixtures.test.js` also check the templates.

## How a person reaches it
`npx usecontextual init` in a git repo, with `--preset` for a ready-made stack.

## How the agent checks it
1. In a temp git repo, run `node <repo>/packages/cli/bin/usecontextual.js init --preset next`.
2. Run `check` there.

## What proves it works
`check` reports 0 errors; the preset's stack files are in `context/stack/`.

## Last result
2026-11-13 · `npm test` · 112 passed.
