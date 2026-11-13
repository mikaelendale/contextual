# Log — Agent feedback
Newest first. One entry per task.

## 2026-11-13 · claude-code · The feedback command, on and off, init and update
- Changed: `packages/cli/src/feedback.js`: the flags, the automatic fields, cleaning, the 600-character caps, the link with the report in its fragment, opening the browser; `feedback on` and `off`. The block's text is `templates/agent-feedback-block.md`.
- Tests: `npm test` in `packages/cli`: 133 passed on Node 26, and 132 on Node 20 before the opener test was added. 13 of them are in `feedback.test.js`.
- Left open: the site's form, Send, the table and the list page; the docs.
- Deslop: not UI.

## 2026-11-13 · claude-code · Started: the requirements and the plan
- Changed: the README's requirements and acceptance list, `build.md` and `tests.md` with the plan; the branch `feat/agent-feedback`.
- Tests: none yet.
- Left open: everything in the acceptance list.
- Deslop: not UI.
