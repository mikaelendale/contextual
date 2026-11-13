# Log — Update
Newest first. One entry per task.

## 2026-11-13 · claude-code · update keeps the feedback block in step
- Changed: `packages/cli/src/update.js` refreshes the feedback block when `.meta.json` says on, removes it when off, and adds `"feedback": "off"` to an older `.meta.json`.
- Tests: `npm test` in `packages/cli`: 133 passed on Node 26, and 132 on Node 20 before the opener test was added.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · Found at setup
- Changed: nothing in the code. Read `packages/cli/src/update.js` and its tests, and wrote this feature's context from them.
- Tests: `npm test` in `packages/cli`: 112 passed, on Node 26 and on Node 20. Ran `update` on this repo.
- Left open: update across published versions is untested (notes.md).
- Deslop: not UI.
