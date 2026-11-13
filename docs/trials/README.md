# Trials

Real runs of the skills in real harnesses, run headless on 12 and 13 November 2026 on one Linux machine. Each run started in a fresh folder. `check` was run by hand after every run, not taken from the agent's word.

How they ran:

- **Claude Code 2.1.322** (Opus 5.5): `claude -p`, with the person's own settings and personal skills left out, edits allowed in the folder, and a short list of allowed shell commands.
- **Codex CLI 0.167.2** (gpt-6.1-sol, its default): `codex exec` in its `workspace-write` sandbox, plus `--add-dir <repo>/.git` so it could branch and commit.
- **OpenCode 2.2.7** (big-pickle, its free default): `opencode run`, with a scoped permission list in `.opencode/opencode.json`: edits in the project, a short list of shell commands, no web.
- **Antigravity CLI 1.5.6**: not run. The CLI isn't signed in on the test machine, and signing in needs the owner's browser.

The sample plan is a household shopping list, "Pantry": plain HTML, CSS and JavaScript, saved in localStorage. A second plan, for a running club's sign-up sheet, came from the planning prompt.

## Results

| Run | Harness | Started with | Result | `check` |
|---|---|---|---|---|
| Setup from a plan | Claude Code | "set up contextual" | Wrote the context, `foundation` first, committed | 0 errors |
| Setup from a plan | Codex | "set up contextual" | Found a conflict in the rules (setup vs the definition of done) and asked. Fixed in the rules; a later run went straight through | 0 errors |
| Setup from a plan | OpenCode | "set up contextual" | Wrote the context, committed | 0 errors, 0 warnings |
| Setup with no plan | Claude Code | "set up contextual", then answers | Asked five questions, wrote the plan, waited for confirmation, then wrote the context | 0 errors |
| Build `foundation` | Claude Code + a browser | "build the next feature" | Screenshots at 375px and 1280px; `Deslop: fixed` two real problems. [Screenshots](2026-11-13-browser-foundation/) | 0 errors |
| Build `foundation` | Codex | `$contextual-next` | Built and committed. Its sandbox blocks sockets and Chrome, so `Deslop: not verified` and the screen checks left unticked | 0 errors |
| Build `foundation` | OpenCode | `@contextual-next` | Built and committed; `Deslop: not verified`; ticked only what it verified | 0 errors |
| Sync after a merge and hand edits | Claude Code | "sync the context" | Marked `foundation` shipped, logged the edits, moved a planned feature to in progress, flagged the file nobody owned, found a real bug in the hand-written code | 0 errors |
| Build `add-items` | Claude Code + a browser | "build the next feature" | `Deslop: pass` naming four screenshots. [Screenshots](2026-11-13-browser-add-items/) | 0 errors |
| Plan in chat: the prompt | Codex | The copy-paste prompt | A valid plan file. [Plan](2026-11-13-contextual-plan/prompt-in-codex/) | n/a |
| Plan in chat: the skill | Claude Code | "help me plan an app" | A valid plan file. [Plan](2026-11-13-contextual-plan/skill-in-claude-code/) | n/a |
| Setup from the prompt's plan | OpenCode | "set up contextual" | Accepted it unchanged as `idea.md` | 0 errors |
| Setup on existing code | Claude Code | "set up contextual", then confirmation | On [mdn/todo-react](https://github.com/mdn/todo-react): proposed `foundation` plus three features, waited, then wrote them as shipped with unverified lines marked. [Proposal, answer, context](2026-11-13-path3-todo-react/) | 0 errors, 0 warnings |
| Setup on this repo | Claude Code | `init`, then "set up contextual", then the owner's changes | Proposed `foundation` plus 12 features covering every file, waited, then wrote them with the owner's changes. [What got in the way](2026-11-13-self-setup/) | 0 errors, 0 warnings |
| Full run from zero | Claude Code and Codex | `init` from a packed 0.1.0, setup, next, a hand edit, sync | See [full-runs.md](full-runs.md) | |

## What the trials changed

- A fresh repo failed `check`: the plan parser read the sample phase inside a template comment. Fixed.
- Setup wrote a feature log, because `AGENTS.md` said every task does. The definition of done now applies to tasks on a feature.
- Setup chose a border color too faint to mark a field (1.3:1). Setup now asks for 3:1 on control edges, and so does `deslop.md`.
- The first feature put 10 of 13 files on the `shared:` line. Every project now gets a `foundation` feature, and `check` warns past a third.
- An agent suggested `npx serve`, a tool outside the stack. `conventions.md` now says a new package or tool, even a one-off `npx`, needs a decision record.
- Moving an untracked plan with `git mv -k` silently did nothing. Setup now says when to use `mv`.

## Read-order slips seen

- OpenCode (big-pickle) read every feature's README, the decision records and `idea.md` before building, which the read order says not to do by default.
- Codex skipped the branch status file and the feature index at the start of one run, going straight to the feature's README.
