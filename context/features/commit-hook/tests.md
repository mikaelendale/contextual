# Tests — Commit hook

## Automated
`staged.test.js` (7 tests) and `hook.test.js` (6): `cd packages/cli && node --test test/staged.test.js test/hook.test.js`, about 2 seconds. The hook tests make real commits, including one with real `npx` and no network.

## How a person reaches it
Any commit in a project after `init`.

## How the agent checks it
1. Run the two test files.
2. In a temp repo from the example, commit a feature's code on `feat/<feature>` without its log entry: blocked.
3. Commit the same on `main`: a warning, and it goes through.
4. With `npx` failing or offline: a note, and it goes through.

## What proves it works
Blocked commits exit non-zero and name the missing files; allowed ones go through; when the CLI can't run, the note says the check was skipped.

## Last result
2026-11-13 · `npm test` · 112 passed. The fixed hook let this repo's commits through, with its note, while 0.1.0 wasn't on npm.
