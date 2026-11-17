# Log — Check
Newest first. One entry per task.

## 2026-11-17 · claude-code · Undecided covers, one warning per feature, contrast claims checked
- Changed: `src/check.js`: a planned feature may say `covers: not decided yet` (an in-progress or shipped one may not); a feature being built gets one warning listing its paths with no files yet; `design/principles.md`'s contrast claims are recomputed by the new `src/contrast.js`, which checks only claims whose two colors are clear and warns when one is off by more than 0.1 or a text color is under 4.5:1. From agent feedback reports 8 and 9 and an earlier report about per-path warnings.
- Tests: `npm test` in `packages/cli`: 139 passed. On this repo, the first version of the contrast check flagged two right claims (a ratio about `brand-ink` written in the field border's row, and a "never text" row); it now skips claims whose subject is another color and rows that say they aren't text.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · check.js's header no longer points at the spec
- Changed: the comment at the top of `src/check.js` named `docs/spec.md`, which is gone, and said `--fix` and `--staged` weren't built. A comment only.
- Tests: `npm test` in `packages/cli`.
- Left open: nothing.
- Deslop: not UI.

## 2026-11-13 · claude-code · check: the feedback block and .meta.json agree
- Changed: `packages/cli/src/check.js` warns when feedback is on but the block is missing, or the block is there but feedback is off.
- Tests: `npm test` in `packages/cli`: 133 passed on Node 26, and 132 on Node 20 before the opener test was added.
- Left open: nothing.
- Deslop: not UI.

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
