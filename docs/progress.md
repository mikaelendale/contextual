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
| 1 | Finish the current round: Codex, OpenCode, Antigravity runs; the setup-log conflict; a real sync; a browser run ending in "Deslop: pass" | In progress |
| 2 | CLI: `init`, `update`, `check --staged`, the hook | Next |
| 3 | Presets: Next.js; Laravel with Inertia and React | |
| 4 | `contextual-plan`: the chat skill and the copy-paste prompt | |
| 5 | `contextual-setup` path 3, existing code | |
| 6 | Full run from zero with a packed tarball, in Claude Code and Codex | |
| 7 | Docs: quickstart, a page per skill, the tested-harness table, CHANGELOG | |
| 8 | Prepare 0.1.0: version, `npm pack --dry-run`, file list. Don't publish | |
| 9 | `docs/overnight-report.md` | |

## Done so far

- The two changes from earlier this round are on this branch: d0a5707 (foundation, the narrower `shared:` line, the 3:1 deslop line, the packages-and-tools rule) and 32f6746 (setup writes no feature logs; `not UI` may carry a reason). That covers the decisions Mikael gave on 13 November and the conflict Codex found.

## Trial spend

Claude Code reports a cost for each headless run; Codex runs on the ChatGPT plan and OpenCode on a free model, so they report none. Every run is counted here.

| Run | Tool | Cost |
|---|---|---|
| Setup from the plan (cc-browser) | Claude Code | $0.72 |

## Where things are

- Trial repos: `~/contextual-trials/<name>/`. Logs: `~/contextual-trials/logs/`. Tools: `~/contextual-trials/tools/` (stand-in-init.mjs, stand-in-update.mjs, run.sh, run-browser.sh, and summarizers for the Claude Code, Codex and OpenCode logs).
- OpenCode runs with the scoped permission list in `~/contextual-trials/opencode/.opencode/opencode.json`. Codex runs in its `workspace-write` sandbox. Claude Code runs with an allowlist (`tools/run.sh`).

## Decisions made without Mikael

None yet.
