# Log — Init
Newest first. One entry per task.

## 2026-11-13 · claude-code · init asks once about agent feedback
- Changed: `packages/cli/src/init.js` takes `--feedback on|off`, or asks once at a terminal; with nobody to answer it's off. When on, AGENTS.md gets the feedback block, and `.meta.json` records the choice.
- Tests: `npm test` in `packages/cli`: 133 passed on Node 26, and 132 on Node 20 before the opener test was added.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · Found at setup
- Changed: nothing in the code. Read `packages/cli/src/init.js` and its tests, and wrote this feature's context from them.
- Tests: `npm test` in `packages/cli`: 112 passed, on Node 26 and on Node 20. Ran `init` on this repo.
- Left open: bunx is untested (notes.md).
- Deslop: not UI.
