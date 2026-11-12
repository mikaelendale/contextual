# contextual-sync

Brings the context back in line with the code: after hand edits, after work done without the skills, and after a feature branch is merged. Start it with "sync the context", or with `/contextual-sync` (Claude Code, Antigravity), `$contextual-sync` (Codex), `@contextual-sync` (OpenCode).

## What it does

1. Finds what changed since the last sync: from the commit stored in `.meta.json`; from the last commit before the stored date if a squash or rebase removed it; from the setup commit if no sync has run yet; or by rescanning `covers:` paths when nothing else works.
2. Runs `usecontextual which` on every changed file and groups the files by feature.
3. Adds a log entry to each affected feature and corrects its `build.md`, `tests.md` and `notes.md`. UI that nobody reviewed is logged as `Deslop: not verified`.
4. On the default branch, finishes merged features: shipped, ticked in the plan, branch status file deleted, a line in `status/main.md`.
5. Lists files nobody owns, with a suggested owner, and asks before assigning them.
6. Stores the new last sync, runs `check --fix`, and commits `Sync context`.

## Tested

Claude Code, 13 November 2026, after a merge plus hand edits to two `foundation` files, a new file under a planned feature, and a new file nobody owned. It marked `foundation` shipped, moved the planned feature to in progress, flagged the unowned file, and found a real bug in the hand-written code.
