<!-- fill: replace this comment with "# <Project name>" and, on the next line, one sentence saying what the project is (from the Idea in context/idea.md). Keep both above the block below. -->

<!-- contextual:start -->
<!-- Managed by usecontextual. `update` rewrites everything between these markers; put your own notes outside them. -->
## Project memory

This repo keeps its memory in `context/`. Read it instead of guessing, and keep it current.

### At the start of every session
1. Run `git branch --show-current` and read `context/status/<branch>.md`, with `/` in the branch name turned into `-` (`feat/boards` → `feat-boards.md`). On the default branch, or when that file doesn't exist, read `context/status/main.md`.
2. Read `context/features/_index.md`.
3. Read the `README.md` of the feature you're working on.
4. Only if the task needs them: that feature's other files, and the `stack/` and `design/` files they link to.

Don't read other features' folders, `context/decisions/` or old log entries by default. Search them when a task needs the history.

### Before editing a file
Run `{{cli}} which <path>`. If it names a feature, read that feature's `README.md` first. If it says the path is shared, keep the change small and mention it in your log entry. If no feature owns the path, say so before changing it, then add the path to the right feature's `covers:` or to the `shared:` line in `context/architecture.md`.

### Definition of done (every task on a feature)
1. Add an entry at the top of the feature's `log.md`.
2. Update the feature's `README.md` (status, acceptance boxes) and any facts that changed in its `build.md`, `tests.md` or `notes.md`.
3. Rewrite `context/status/<branch>.md`, in 40 lines or fewer.
4. If the task touched UI: run the checklist in `context/design/deslop.md` and record the result in the log entry.
5. Run `{{cli}} check` and fix what it reports.

A task missing any of these isn't done. The pre-commit hook checks.

### Hard rules
- Never edit `context/idea.md`. It is the owner's own words.
- For any UI work, follow `context/design/deslop.md` and `context/design/principles.md`.
- When a product decision is unclear, ask. Don't guess.
- When you choose between real alternatives, record it in `context/decisions/`.
- Don't edit `context/features/_index.md` by hand. `{{cli}} check --fix` rebuilds it.

### Skills
- `contextual-setup`: writes this context the first time, from a plan file, from questions, or from the existing code.
- `contextual-next`: builds the next planned feature on its own branch, then stops for review.
- `contextual-sync`: brings the context back in line after code changed without it, and finishes a feature after its branch merges.
<!-- contextual:end -->
