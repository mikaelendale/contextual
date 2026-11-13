# Contextual on its own repo

13 November 2026, in Claude Code (Opus 5.5). The CLI was this repo's working copy (0.1.0, not yet on npm), run as `node packages/cli/bin/usecontextual.js`.

## What ran

1. `init` at the repo root. It added `AGENTS.md`, `CLAUDE.md`, the `context/` skeleton and the three skills in `.agents/skills/` and `.claude/skills/`, and installed the pre-commit hook. It left `site/AGENTS.md` alone. `check`: 0 errors, 1 warning (no `idea.md` yet).
2. `contextual-setup`, path 3 (existing code): scanned the repo, proposed `foundation` plus 12 features covering all 280 files, one owner each, and stopped for the owner's answer.
3. The owner confirmed it with changes: `docs` merged into `foundation`, and a Phase 2 for 0.2.0 with one planned feature, `agent-feedback`. Setup wrote the context: 12 features shipped in Phase 1, `agent-feedback` planned. `check`: 0 errors, 0 warnings.

## What got in the way

1. **The hook blocked every commit, because its pinned version couldn't be fetched.** With no `package.json` at the root, `init` writes `npx --yes usecontextual@0.1.0 check --staged || exit 1`. 0.1.0 wasn't on npm yet, so `npx` failed and the hook exited 1, before the rule that the hook only warns until setup has run could apply. Being offline, or the registry being down, would do the same. When there is a `package.json`, a missing CLI only prints a note and the commit goes through; the `npx` line has no such fallback. Suggestion: when `npx` can't fetch the CLI, print a note and let the commit through.
2. **There's no way to run the hook with a working copy of the CLI.** This repo builds the CLI, so it should check itself with its own code, not the last published version; otherwise a rule changed on a branch gets checked by the old rule. `init` only knows a local package or a pinned `npx`. `cli` in `.meta.json` can be edited by hand, and `update` keeps it for `AGENTS.md`, but the hook line ignores it. Suggestion: `init --cli "<command>"`, used by the hook too and kept by `update`.
3. **Each skill now exists three times.** The source is in `skills/`; `init` copied it into `.agents/skills/` and `.claude/skills/`. Changing `skills/` leaves the installed copies stale until someone runs `update` with the working copy, and `check` compares the two installed copies with each other but not with `skills/`. Suggestion: in this repo, CI runs `update` and fails if the installed copies change.
4. **Nothing lists the files no feature owns.** Path 3 asks for every file with no owner, aiming for none, but `check` only reports files with two owners, and `check --staged` only warns about files in a commit. Checking the proposal took a throwaway script built on the CLI's glob matcher. Suggestion: `which --unowned`, or a `check` warning listing them once setup has run.
5. **`covers:` can't group or exclude paths.** There are no braces or negations, so `foundation` needs 24 globs on one line. And shadcn's `site/components/ui/` can't go on the `shared:` line while `site/**` covers the site, so the split leaves `shared:` empty. Suggestion: allow `!glob` in `covers:`.
6. **A file has exactly one owner, and so does a test file.** `update`'s four tests are in `packages/cli/test/staged.test.js`, so the `commit-hook` feature owns them. Moving them to their own file is a code change, which path 3 doesn't make, so it's a question for the owner.
7. **Path 3 says nothing about a nested `AGENTS.md`.** `site/` has its own, written by Next.js. It isn't Contextual's file, so a feature has to own it (`site` does). Codex reads both files when it works in `site/`; Claude Code reads the root one through `CLAUDE.md`, but not `site/AGENTS.md`, because `site/` has no `CLAUDE.md`. Whether setup should point this out, or add a `CLAUDE.md` next to it, isn't covered.
8. **`check` names the project after its folder.** It printed "usecontextual", the local folder's name, not "contextual". Minor.

## What was done about each

| # | Item | What was done |
|---|---|---|
| 1 | The hook blocked every commit when its pinned version couldn't be fetched | Fixed before 0.1.0: `check --staged` exits 65 when it finds errors, and the hook blocks only on that. Anything else prints a note and lets the commit through. Tests make real commits offline, with the version missing, with Node missing and with `set -e` |
| 2 | No way to run the hook with a working copy | Issue #2 |
| 3 | Three copies of each skill | Issue #3. Meanwhile `AGENTS.md` in this repo says to run `update` after changing `skills/` |
| 4 | Nothing lists the files no feature owns | Issue #4 |
| 5 | `covers:` can't group or exclude | The most-specific-owner rule (spec 3.8, from 0.2.0) covers a new feature inside another feature's path. Braces and exclusions are issue #5 |
| 6 | A test file had two features' tests | Fixed: `update`'s tests moved to `update.test.js`, and the hook's real-commit tests to `hook.test.js` |
| 7 | Nothing about a nested `AGENTS.md` | Issue #6 |
| 8 | The project is named after its folder | Issue #7 |
