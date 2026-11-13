# Log — Commit hook
Newest first. One entry per task.

## 2026-11-13 · claude-code · check --staged follows the most specific owner
- Changed: `src/staged.js` asks for the log entry of the feature that owns each staged file by the most specific match (spec 3.8); on a tie, every tied feature's.
- Tests: `npm test` in `packages/cli`: 120 passed, including 8 new in `owners.test.js`.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · Found at setup
- Changed: nothing in the code. Read `staged.js`, `hook.js`, `hooks/` and their tests, and wrote this feature's context from them.
- Tests: `npm test` in `packages/cli`: 112 passed, on Node 26 and on Node 20.
- Left open: the hook on Windows is untested (notes.md).
- Deslop: not UI.
