# Finishing a merged feature

Do this on the default branch, once for each feature whose `feat/<folder>` branch has been merged into it. Signs that it has: `context/status/feat-<folder>.md` exists on the default branch, `git branch --merged` lists `feat/<folder>`, or a merge commit names it.

1. **Check its acceptance.** Every box in the feature's `README.md` should be ticked. If one isn't, ask the person whether to ship it anyway. Never tick a box to make it fit.
2. **Mark it shipped.** Set `status: shipped` in the README.
3. **Update the plan.** In `context/build-plan.md`, tick the item (`- [x] features/<folder>`) and remove `← current`. If every feature in the phase is now shipped or deprecated, mark the phase `[done]`.
4. **Delete its branch status file,** `context/status/feat-<folder>.md`.
5. **Update `context/status/main.md`.** Add a line at the top of "Recently merged" (`YYYY-MM-DD · <folder> · what it added`), keeping the last five. Then update "Current phase" and "Next".
6. **Log it.** Add an entry at the top of the feature's `log.md`: `## <today> · <agent> · Merged to main`, listing these steps under Changed, with `Tests: none run (merge only).` and `Deslop: not UI.`

`check --fix` then rebuilds the feature index, and a finished phase collapses to one line there.
