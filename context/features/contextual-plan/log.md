# Log — Contextual plan
Newest first. One entry per task.

## 2026-11-17 · claude-code · An optional References line under Design direction
- Changed: `prompt.md` keeps a guideline, design system or links the person mentions, as "References: …" under Design direction; `docs/plan-file.md` and its copies describe the line and send open questions to `questions.md`. The live site reads `prompt.md` from main, so the site shows this within an hour of the merge. From agent feedback report 10.
- Tests: the plan parser ignores the line (headings unchanged); `npm test` in `packages/cli`: 139 passed.
- Left open: trying the prompt in a chat with a guideline.
- Deslop: not UI.

## 2026-11-13 · claude-code · Found at setup
- Changed: nothing in the code. Read the skill, the prompt, `docs/plan-file.md` and the trial records, and wrote this feature's context from them.
- Tests: none of its own; the trials produced valid plans.
- Left open: nothing.
- Deslop: not UI.
