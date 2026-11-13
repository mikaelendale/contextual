# Tests — Init

## Automated
`test/init.test.js` (12 tests): `cd packages/cli && node --test test/init.test.js`, about 2 seconds.

## How a person reaches it
`npx usecontextual init` in a git repo.

## How the agent checks it
1. `git init` a temp folder and run `node <repo>/packages/cli/bin/usecontextual.js init`.
2. Look at what it added, and run `check`.
3. Repeat with a `package.json` and `--no-install`.

## What proves it works
The files are there, the hook has the marked line, `.meta.json` holds the right `cli`, and `check` reports 0 errors.

## Last result
2026-11-13 · `npm test` · 112 passed. `init` on this repo, from the working copy, added everything and left `site/AGENTS.md` alone.
