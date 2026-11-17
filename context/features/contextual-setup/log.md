# Log — Contextual setup
Newest first. One entry per task.

## 2026-11-17 · claude-code · Plans from anywhere, existing code on path 1, questions.md, references
- Changed: `SKILL.md`: a plan file the person points to, or named like `contextual-plan (1).md`, is copied to the root; undecided items go to `questions.md` (owner questions, or a proposed choice with a decision record). `fill-from-plan.md`: on a repo with code, installed tools go in `stack/_index.md` as "Already in the repo" and existing files get owners; the AGENTS.md heading goes at the top, never inside another tool's block; design references come first and values are marked given or proposed, with ratios from `contrast`; later phases may say `covers: not decided yet`; a new step for `questions.md`. `existing-code.md` writes `questions.md` too. From agent feedback reports 6, 7, 8, 10, 11 and 13.
- Tests: none in a real agent run yet; the CLI side has tests (`npm test` in `packages/cli`: 139 passed.)
- Left open: trying setup for real on a Next.js scaffold with a plan file and a guideline.
- Deslop: not UI.

## 2026-11-13 · claude-code · Path 3: nested AGENTS.md files and which --unowned
- Changed: `references/existing-code.md`: the proposal lists any `AGENTS.md` below the root and offers a `CLAUDE.md` next to it (issue #6); after writing, `which --unowned` should list nothing (issue #4).
- Tests: `skills.test.js` in the suite: 120 passed.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · Found at setup
- Changed: nothing in the code. Read the skill and its references, and the trial records, and wrote this feature's context from them.
- Tests: none of its own; the trials passed `check`.
- Left open: nothing.
- Deslop: not UI.
