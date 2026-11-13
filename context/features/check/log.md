# Log — Check
Newest first. One entry per task.

## 2026-11-13 · claude-code · The most specific match owns a file; which --unowned
- Changed: `src/owners.js` resolves a file's owner by the most specific match (spec 3.8). `check` reports only equally specific matches, reports a glob whose files all went to more specific globs, and counts code no one owns. `which` names the broader globs it beat, and `which --unowned` lists unowned code (issue #4).
- Tests: `npm test` in `packages/cli`: 120 passed, including 8 new in `owners.test.js`.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · Found at setup
- Changed: nothing in the code. Read `check.js`, `fix.js`, `plan.js`, `which.js` and their tests, and wrote this feature's context from them.
- Tests: `npm test` in `packages/cli`: 112 passed, on Node 26 and on Node 20. `check` on this repo: 0 errors.
- Left open: the most-specific-owner rule waits for 0.2.0 (notes.md).
- Deslop: not UI.
