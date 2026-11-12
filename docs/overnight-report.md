# Overnight report, 13–14 November 2026

Everything is on the branch `build/v0.1`, pushed, with a draft pull request into `main`. Nothing was merged, published or deployed. All 104 tests pass.

## Finished

| # | Stage | Result |
|---|---|---|
| 1 | Finish the round | Codex and OpenCode ran setup from the plan and built one feature. The rule conflict Codex found is fixed. A real sync ran on hand-edited code. A browser run ended in `Deslop: pass` with four screenshots in [docs/trials](trials/2026-11-13-browser-add-items/). The earlier decisions are in: the 3:1 line in `deslop.md`, `foundation` in setup, the warning past a third of files on `shared:`, and no tools outside the stack. Antigravity: not run (below) |
| 2 | CLI | `init`, `update`, `check --staged` and the pre-commit hook, with tests that run them in throwaway git repos, including a real commit the hook blocks |
| 3 | Presets | `next`, and `laravel-inertia-react` |
| 4 | `contextual-plan` | The chat skill and the copy-paste prompt. Both produced valid plans in trials, and OpenCode's setup accepted the prompt's plan unchanged |
| 5 | Setup path 3 | Tried on [mdn/todo-react](https://github.com/mdn/todo-react): 0 errors, 0 warnings. [Proposal, my answer, and the context it wrote](trials/2026-11-13-path3-todo-react/) |
| 6 | Full run from zero | From a packed 0.1.0, in Claude Code and in Codex: init, setup, next, a hand edit through the hook, sync, check. 0 errors in both. [full-runs.md](trials/full-runs.md) |
| 7 | Docs | README quickstart (npx, pnpm dlx, bunx), [a page per skill](skills/), a harness table showing only what was tested, [CHANGELOG](../CHANGELOG.md), [hooks/](../hooks/) with a CI job |
| 8 | 0.1.0 | Version bumped. `npm pack --dry-run`: 84 files, 47.3 kB. List in [release/0.1.0-pack-dry-run.txt](release/0.1.0-pack-dry-run.txt). Not published |

The branch's commits, oldest first: d0a5707, 32f6746, 4eeaf8f, 453e55f, 1cfd090, 8cd1146, dfa7ec2, 05d089a, plus this report.

## Failed, or not done, and why

- **Antigravity wasn't run.** Its CLI on this machine isn't signed in, and signing in opens your browser. I didn't try to get around the login.
- **`bunx` wasn't tried.** Bun isn't installed here.
- **`init` installing itself from npm wasn't tried**, because 0.1.0 isn't published yet. The full runs installed the packed tarball first, so `init` saw it in `package.json` and kept it.
- **Codex can't commit in its default sandbox.** `workspace-write` makes `.git` read-only. In the trials, `--add-dir <repo>/.git` fixed it without the blanket bypass flag. The README tells Codex users.
- **No browser in Codex's or OpenCode's runs.** Codex's sandbox blocks sockets and Chrome. OpenCode's scoped permissions didn't allow a server. Both wrote `Deslop: not verified` and left the screen-check boxes unticked, as the rules say.
- **Problems the trials found, all fixed on the branch:**
  - A fresh repo failed `check`, because the plan parser read a template comment.
  - Setup wrote a feature log.
  - A field border was too faint at 1.3:1.
  - The first feature parked 10 of 13 files on `shared:`.
  - An agent suggested a tool outside the stack.
  - `git mv -k` silently skipped an untracked plan.
  - The first sync would have missed edits to existing files.
  - `init` read the wrong default branch when `init.defaultBranch` was set globally (yours says `master`).
  - Two of my own test harness slips.

## Decisions I made for you

These are also in [progress.md](progress.md), with the reasoning.

1. Antigravity is recorded as untested rather than worked around.
2. Codex gets write access to `.git` only, not the bypass flag.
3. A plan file may have one plain sentence under a phase heading. Codex wrote one, and setup ignores it.
4. `Deslop: not UI` may carry a short reason.
5. Path 3 trial: I accepted the agent's proposed split as it was, and said the clone is local and won't be deployed.
6. When the local copy of the CLI isn't installed (a fresh clone before `npm install`), the hook prints a note and lets the commit through, instead of blocking every commit.
7. `check --staged` on the default branch reports everything as a warning, including full-check errors, so a broken context file never stops a hand edit on `main`.
8. `init` outside a git repo refuses and says to run `git init`. It doesn't run it for you.
9. `init --force` still never overwrites a file. It only lets init add its files next to a `context/` folder that isn't Contextual's.
10. When there's no `package.json`, `init` uses a pinned `npx --yes usecontextual@<version>` and doesn't create a `package.json`.
11. Detected harnesses decide the skill folders: only `.claude/skills/` when the repo has only Claude Code's files, both folders when there's no sign of any harness.
12. Default branch: the remote's HEAD, then a local `main` or `master`, then the current branch if it's called main or master, then `init.defaultBranch`, then `main`.
13. Path 3's rules:
    - A feature found in code gets all five files and a "Found at setup" log entry (paths 1 and 2 still write none).
    - An acceptance line only read in the code is ticked and ends with "(found in the code, not verified)", so a shipped feature can pass `check` without pretending.
    - `idea.md` is written from the README and the confirmed features.
14. The first sync diffs from the commit that set Contextual up.
15. Presets name no versions; versions come from the project's own manifest. The Next.js preset defaults to Vercel, Vitest and Playwright. The Laravel one defaults to Pest and Playwright, and leaves hosting as a question for setup.
16. Version 0.1.0 before the full runs, so they tested what you'd publish.
17. The CI example pins `usecontextual@0.1.0`.
18. The path 3 trial's context (written about MDN's app, no MDN code) is kept in `docs/trials/` for review. Delete it if you'd rather not keep it in the repo.
19. My earlier local commits on `main` (d0a5707, 32f6746) were moved to `build/v0.1`, and local `main` was reset to GitHub's. They were never pushed to `main`.

## Untested

- Antigravity, end to end.
- `bunx usecontextual init`.
- `init` installing from npm with each package manager (needs the published 0.1.0).
- Windows. Everything ran on Linux. The CLI normalizes line endings and paths, and the hook is a POSIX shell line, which Git for Windows runs.
- `update` across a real version change (0.1.0 to a later version). Its tests change the files by hand.
- Setup path 3 on a larger repo, and in Codex or OpenCode.
- `contextual-sync` after a squash merge (the date fallback). Only the first-sync path ran for real.

## Trial spend

$7.66 of the $20, all in Claude Code. Codex ran on your ChatGPT plan and reported no cost. OpenCode used its free default model. The breakdown is in [progress.md](progress.md).

## In the morning

1. Read [pull request #1](https://github.com/mikaelendale/contextual/pull/1) (`gh pr view 1 --web`), and this report's decisions.
2. Publish 0.1.0 from the branch, so the commit npm records is on the branch:

   ```bash
   cd ~/Projects/usecontextual
   git switch build/v0.1 && git pull
   cd packages/cli
   npm whoami || npm login
   npm pack --dry-run      # should match docs/release/0.1.0-pack-dry-run.txt (84 files)
   npm publish             # approve the 2FA prompt
   ```

3. Check it from npm:

   ```bash
   npm view usecontextual version          # 0.1.0
   cd "$(mktemp -d)" && git init -q && npx usecontextual@0.1.0 init && npx usecontextual@0.1.0 check
   ```

4. Merge with a merge commit, not a squash, so the published commit stays in `main`'s history:

   ```bash
   gh pr ready 1 && gh pr merge 1 --merge
   ```

5. To try Antigravity: run `agy` once and sign in. Then ask me to run its trial: setup from the plan, then `/contextual-next`.

The trial folders are in `~/contextual-trials/` (repos, logs, tools). Nothing in them is needed; delete them when you're done.
