# Log — Foundation
Newest first. One entry per task.

## 2026-11-13 · claude-code · which's new output and --unowned in the CLI
- Changed: `packages/cli/src/cli.js` prints the globs a `which` answer beat, handles ties, and adds `which --unowned` to the help.
- Tests: `npm test` in `packages/cli`: 120 passed, including 8 new in `owners.test.js`.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · Found at setup
- Changed: nothing in the code. Read the root files, `.github/`, `docs/`, `skills/README.md`, the CLI's `package.json`, `bin/`, `scripts/` and shared `src/` files, and wrote this feature's context from them.
- Tests: `npm test` in `packages/cli`: 112 passed, on Node 26 and on Node 20. CI passed on Node 20, 22, 24 and 26.
- Left open: Antigravity and Windows are untested, and private vulnerability reporting is off (notes.md).
- Deslop: not UI.
