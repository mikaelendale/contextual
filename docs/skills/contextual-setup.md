# contextual-setup

Writes a project's context the first time, after `usecontextual init` has laid down the skeleton. Start it with "set up contextual", or with the explicit call: `/contextual-setup` (Claude Code, Antigravity), `$contextual-setup` (Codex), `@contextual-setup` (OpenCode).

## Three paths

| The repo has | It does |
|---|---|
| `contextual-plan.md` at the root | Fills `stack/`, `design/`, `architecture.md`, `conventions.md`, `build-plan.md` and one README per feature from the plan, then moves the plan to `context/idea.md` |
| Nothing yet, and no plan | Asks the five planning questions, writes the plan, shows it, and waits for you to confirm before writing anything else |
| Code, and no plan | Reads the code, proposes features and the paths each owns, waits for you to confirm, then writes the context, with the features it found marked shipped |

Every path adds `foundation` as the first feature of Phase 1: the app shell, layouts, config and test setup. It ends with `usecontextual check --fix`, 0 errors, and one commit, `Set up Contextual`.

## What it reads

`context/.meta.json`, the plan (or your answers, or the code), and its own [references](../../skills/contextual-setup/references/): `fill-from-plan.md` for what goes where, `questions.md` for path 2, `existing-code.md` for path 3, and `plan-file.md`.

## What it won't do

Edit Contextual's managed files (the `AGENTS.md` block, `deslop.md`, the feature index), write feature logs before any feature work (paths 1 and 2), or change code (path 3).

## Tested

Claude Code, Codex and OpenCode, all three paths in Claude Code. Results: [docs/trials](../trials/).
