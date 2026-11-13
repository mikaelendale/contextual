# Tests — Update

## Automated
`test/update.test.js` (4 tests): `cd packages/cli && node --test test/update.test.js`, about a second.

## How a person reaches it
`npx usecontextual update` after upgrading the package.

## How the agent checks it
1. In a temp repo after `init`, change the `AGENTS.md` block, `deslop.md` and a skill copy.
2. Run `update`.
3. Compare with the templates and skills, and check the project's own files are unchanged.

## What proves it works
Contextual's files match the version's templates and skills; project content is byte for byte the same.

## Last result
2026-11-13 · `npm test` · 112 passed. `update` on this repo installed the new hook line.
