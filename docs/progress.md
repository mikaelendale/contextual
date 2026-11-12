# Build progress

The overnight build of 13–14 November 2026, on the branch `build/v0.1`. Read this first when starting fresh. It is updated after every stage.

## Rules for this run (from Mikael)

- Never wait for Mikael. Pick the most conservative option, note it under "Decisions made without Mikael", and continue.
- Update this file after every stage.
- If something fails three times, write up what happened and move to the next item.
- Work on `build/v0.1`. Commit as you go, no co-author line, tests passing before every commit. Push the branch and open a draft pull request. Never merge to main.
- Don't publish to npm, deploy or change the live site, touch contextual-teaser, force push, change repo settings or visibility, or use a blanket auto-approve flag in another tool. Keep the scoped permission lists.
- Keep trial runs to about $20 in total. When that's spent, stop running trials and note what's untested.
- Don't reopen the decisions in spec section 13.

## Stages

| # | Stage | State |
|---|---|---|
| 1 | Finish the current round: Codex, OpenCode, Antigravity runs; the setup-log conflict; a real sync; a browser run ending in "Deslop: pass" | Done, except Antigravity (not signed in) |
| 2 | CLI: `init`, `update`, `check --staged`, the hook | Done (4eeaf8f) |
| 3 | Presets: Next.js; Laravel with Inertia and React | Done (453e55f) |
| 4 | `contextual-plan`: the chat skill and the copy-paste prompt | Done (1cfd090). OpenCode's setup on the prompt's plan: 0 errors |
| 5 | `contextual-setup` path 3, existing code | Done. Trial on mdn/todo-react: 0 errors, 0 warnings (docs/trials/2026-11-13-path3-todo-react) |
| 6 | Full run from zero with a packed tarball, in Claude Code and Codex | In progress: ~/contextual-trials/full-cc and full-codex, setup running |
| 7 | Docs: quickstart, a page per skill, the tested-harness table, CHANGELOG | Done (8cd1146). The README's Claude Code explicit-call cell needs stage 6 to confirm it |
| 8 | Prepare 0.1.0: version, `npm pack --dry-run`, file list. Don't publish | Version bumped (dfa7ec2); file list to do |
| 9 | `docs/overnight-report.md` | |

## Done so far

- The two changes from earlier this round are on this branch: d0a5707 (foundation, the narrower `shared:` line, the 3:1 deslop line, the packages-and-tools rule) and 32f6746 (setup writes no feature logs; `not UI` may carry a reason). That covers the decisions Mikael gave on 13 November and the conflict Codex found.

## Stage 1 results so far

| Harness | Model | Setup from plain words | Explicit call | Setup check | Feature check |
|---|---|---|---|---|---|
| Claude Code 2.1.322 | claude-opus-5-5 | Triggered | Not tried (plain words used for both runs) | 0 errors | 0 errors (foundation, with Playwright; Deslop: fixed) |
| Codex CLI 0.167.2 | gpt-6.1-sol | Triggered | `$contextual-next` worked | 0 errors after answering its question | 0 errors (foundation; Deslop: not verified, sandbox blocks sockets) |
| OpenCode 2.2.7 | opencode/big-pickle (free) | Triggered | `@contextual-next` worked | 0 errors, 0 warnings | 0 errors (foundation; Deslop: not verified) |
| Antigravity CLI 1.5.6 | – | Not run: the CLI isn't signed in, and signing in needs Mikael's browser | – | – | – |

- Codex found the conflict (setup vs the definition of done) and asked instead of guessing. Fixed in 32f6746.
- Codex's `workspace-write` sandbox makes `.git` read-only, so it can't commit. `--add-dir <repo>/.git` makes only that folder writable; with it, `contextual-next` branched and committed.
- OpenCode read every feature README, the decisions and idea.md, against the read order.
- Sync test (Claude Code, $0.56): after merging feat/foundation and hand-editing two foundation files, a new file under add-items (planned) and lib/export-csv.js (no owner). It diffed from the setup commit (no sync had run), marked foundation shipped, logged the edits as "Deslop: not verified", moved add-items to in-progress, flagged lib/export-csv.js and asked about it, found a real bug in the hand-written add-items code, set lastSync. check: 0 errors.
- Browser runs (Claude Code + Playwright MCP, headless Chrome): foundation ended "Deslop: fixed" (two real problems); add-items ended "Deslop: pass" naming four screenshots. Both sets are in docs/trials/.
- contextual-plan: the prompt in Codex and the skill in Claude Code ($0.25) both gave valid plans (docs/trials/2026-11-13-contextual-plan).

## Trial spend

Claude Code reports a cost for each headless run; Codex runs on the ChatGPT plan and OpenCode on a free model, so they report none. Every run is counted here.

| Run | Tool | Cost |
|---|---|---|
| Setup from the plan (cc-browser) | Claude Code | $0.72 |
| Build foundation with Playwright | Claude Code | $1.23 |
| Sync | Claude Code | $0.56 |
| Build add-items with Playwright | Claude Code | $0.95 |
| contextual-plan skill | Claude Code | $0.25 |
| Path 3 proposal (mdn/todo-react) | Claude Code | $0.28 |
| Path 3 write | Claude Code | $1.22 |
| contextual-plan prompt | Codex | ChatGPT plan |
| Setup from the prompt's plan | OpenCode | free model |
| Setup, then foundation | Codex | ChatGPT plan, no cost reported |
| Setup, then foundation | OpenCode | free model |

## Where things are

- Trial repos: `~/contextual-trials/<name>/`. Logs: `~/contextual-trials/logs/`. Tools: `~/contextual-trials/tools/` (stand-in-init.mjs, stand-in-update.mjs, run.sh, run-browser.sh, and summarizers for the Claude Code, Codex and OpenCode logs).
- OpenCode runs with the scoped permission list in `~/contextual-trials/opencode/.opencode/opencode.json`. Codex runs in its `workspace-write` sandbox. Claude Code runs with an allowlist (`tools/run.sh`).

## Decisions made without Mikael

1. **Antigravity left untested.** Its CLI isn't signed in, and signing in needs Mikael's browser. Conservative choice: don't try to get around the login; record it as untested.
2. **Codex gets write access to `.git` only** (`--add-dir <repo>/.git`), not the blanket bypass flag. Without it, its sandbox can't create a branch or commit, which contextual-next needs.
3. **The plan file may have one sentence under a phase heading.** Codex wrote one in the prompt trial; the plan-file rules already say detail goes under the closest heading, and setup ignores it. Loosening the format was safer than making every model avoid it.
4. **`not UI` may carry a short reason** ("Deslop: not UI (setup only)"). Codex wrote one; it hides nothing.
5. **Path 3 trial (mdn/todo-react): accepted the agent's split as proposed** (foundation, add-task, manage-tasks, filter-tasks; shared: src/index.css, public/**). Told it the clone is local and won't be deployed, and to keep the other issues as open questions.
6. **Hook when the local copy isn't installed:** it prints a note and lets the commit through rather than blocking every commit on a fresh clone.
7. **`check --staged` on the default branch downgrades every finding to a warning**, including full-check errors, so a broken context file never stops a hand edit on main (spec 4.2: warn on the default branch).
8. **`init` outside a git repo refuses** and says to run `git init`, rather than running it.
9. **`init --force` never overwrites**; it only lets init add its files next to an existing `context/` folder that isn't Contextual's.
