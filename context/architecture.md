# Architecture

## Overview
One repo holds the whole product. The CLI in `packages/cli` is a set of plain modules with no dependencies; it reads and writes markdown in a project's `context/` and calls `git`. The skills, templates and presets are markdown that `init` and `update` copy into projects. The website, contextual.mikaelen.site, is in a separate, private repository (it was in `site/` until 13 November 2026); the CLI only links to its feedback form.

## Parts
| Part | Where | What it does |
|---|---|---|
| CLI | `packages/cli/` | `init`, `check`, `check --fix`, `check --staged`, `which`, `update` |
| Skills | `skills/` | `contextual-plan`, `contextual-setup`, `contextual-next`, `contextual-sync` |
| Templates and presets | `templates/`, `presets/` | The blank context files, and ready-made stacks |
| Hook docs | `hooks/` | How the pre-commit hook works, and a CI job for projects |
| Example | `example/` | Linkboard's finished context folder |
| Docs | `docs/` | The spec, harness notes, maintainers' rules, trials and release lists |

## How a request flows
`npx usecontextual init` in a git repo:
1. `packages/cli/bin/usecontextual.js` calls `runCli` in `src/cli.js`.
2. `src/init.js` finds the repo's top, the harness folders and the package manager.
3. `src/assets.js` finds the templates and skills: the repo's own folders in a checkout, `assets/` in the published package.
4. `init` writes `AGENTS.md`, `CLAUDE.md`, `context/` and both skill folders, without overwriting a file, then adds itself as a dev dependency when there's a `package.json`.
5. `src/hook.js` adds the marked line to the pre-commit hook.

## Data
The CLI has no database; its data is a project's files: `context/.meta.json` (version, default branch, the `cli` command, skill folders, last sync, hashes, caps) and the markdown in `context/`.

## Outside services
| Service | Used for | Called from |
|---|---|---|
| npm registry | Publishing the package; `npx` downloading it in projects without a `package.json` | The owner's terminal; projects' hooks |
| contextual.mikaelen.site | The agent feedback form that `usecontextual feedback` links to; nothing is sent until a person presses Send there | Only the link, opened in the person's browser |

## Boundaries
- A skill's `assets/` and references are copies of `templates/` and `docs/plan-file.md`; never edit a copy.
- The CLI reads templates and skills only through `src/assets.js`.
- A file belongs to one feature (spec 3.8). From 0.2.0 the most specific match owns a file another feature's glob also matches; until then, two matches are an error.
shared:
