# Templates

Every blank file Contextual puts in a repo. `usecontextual init` copies `repo/` into the project. The skills create the other files from the single templates here when they need them, so a new repo doesn't fill up with empty files.

| Template | Becomes | Created by | When |
|---|---|---|---|
| `repo/AGENTS.md` | `AGENTS.md` | init | Added as a marked block after any existing content |
| `repo/CLAUDE.md` | `CLAUDE.md` | init | Created, or `@AGENTS.md` appended to an existing one |
| `repo/context/**` | `context/**` | init | Copied as the skeleton |
| `contextual-plan.md` | `context/idea.md` | the person, the chat skill, or setup | Before or during setup |
| `feature/README.md` | `context/features/<feature>/README.md` | setup, next | For every feature, including planned ones |
| `feature/build.md`, `tests.md`, `notes.md`, `log.md` | the rest of the feature folder | next (setup for features found in existing code) | When work on the feature starts |
| `status-branch.md` | `context/status/<branch>.md` | next | When a branch starts |
| `stack-lib.md` | `context/stack/<lib>.md` | setup, next | When a library needs notes specific to this repo |
| `decision.md` | `context/decisions/YYYY-MM-DD-<slug>.md` | any skill | When a choice between real alternatives is made |

## Two kinds of placeholder

- `{{name}}` is filled by the CLI, mechanically, at `init` or `update`:
  - `{{cli}}`: the command to run the CLI in this repo (`npx usecontextual`, or a pinned `npx --yes usecontextual@<version>` when the repo has no `package.json`)
  - `{{date}}`, `{{contextual_version}}`, `{{default_branch}}`, `{{deslop_hash}}`
- `<!-- fill: … -->` is guidance for the agent. When a skill fills a file, it replaces each comment with real content and deletes the comment. `check` warns about any `fill:` comment left after setup.

Everything outside a placeholder is fixed structure: keep the headings, in order.

## Size caps

Files read at the start of every session have caps, so the start-of-session read stays near 3,000 tokens however big the project gets.

| File | Cap |
|---|---|
| The Contextual block in `AGENTS.md` | 60 lines |
| `context/status/*.md` | 40 lines |
| `context/features/*/README.md` | 60 lines |

## How the feature index is built

`context/features/_index.md` is never written by hand. `check --fix` rebuilds it from the feature READMEs and the phase names in `build-plan.md`:

- A finished phase (every feature shipped or deprecated) is one line: `Phase 1 — Accounts: done · auth, teams`
- An open phase is a `## Phase <n> — <name>` heading and a table: Feature (linked) | Status | What it does
- "What it does" is the first sentence under that heading in the feature's README.

## Fixed files

`repo/context/design/deslop.md` is the same in every project. Change it here only; `update` delivers it to repos. Its hash is checked after LF normalization.

Templates are stored with LF line endings.
