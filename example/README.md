# Example: Linkboard

A complete context folder for a small made-up project, for people and agents to imitate. Linkboard is a shared bookmarking app for small teams. Only the context is here; there's no app code.

It's a snapshot of the `feat/boards` branch on 9 November 2026, partway through Phase 2. Claude Code and Codex have been taking turns on it.

## What to look at

| Where | What it shows |
|---|---|
| `AGENTS.md` | The project's heading and one line, then the Contextual block |
| `CLAUDE.md` | The one-line import that lets Claude Code read `AGENTS.md` |
| `context/idea.md` | The original plan, in the owner's words, in the plan-file format |
| `context/status/feat-boards.md` and `main.md` | One status file per branch |
| `context/features/_index.md` | Phase 1 is finished, so it's one line |
| `context/features/boards/` | A feature in progress: all five files, a failing test written ahead of the code, an open question left for a person |
| `context/features/auth/`, `teams/`, `links/` | Shipped features |
| `context/features/link-preview/`, `search/`, `weekly-digest/` | Planned features: `README.md` only |
| `context/features/teams/log.md` | A one-line fix made straight on `main` (28 October) |
| `context/features/links/log.md` | An entry written from the boards branch, because boards changed a file links owns |
| `context/features/*/log.md` | All four deslop results. Each `pass` says how it was checked. The 5 November Codex session had no browser, so it wrote `not verified`, and the 8 November session ran the checklist it missed |
| `context/stack/drizzle.md` | Gotchas found while building one feature, recorded where the next feature will see them |
| `context/architecture.md` | The `shared:` line: code no single feature owns |
| `context/decisions/` | Three short records of real choices |
| `context/.meta.json` | The last sync (commit and date) and real hashes of `idea.md` and `deslop.md` |

A real repo also has the skills in `.agents/skills/` and `.claude/skills/`, and the pre-commit hook. Those come from the package and aren't repeated here.

## The start-of-session read

What an agent reads on this branch before starting work (section 4.1 of the spec):

| File | Lines | Tokens (about) |
|---|---|---|
| `AGENTS.md` | 41 | 670 |
| `context/status/feat-boards.md` | 21 | 280 |
| `context/features/_index.md` | 17 | 230 |
| `context/features/boards/README.md` | 14 | 150 |
| **Total** | **93** | **1,330** |

The target is under 3,000. Token counts are estimates (characters ÷ 4).

## It's the CLI's test fixture

`usecontextual check` must pass on this folder with 0 errors. The tests in `packages/cli/test/` check that, then break copies of it in 33 different ways and confirm each break is caught. Change the example and the templates together: the tests also check that this `AGENTS.md` block and `deslop.md` match the templates.
