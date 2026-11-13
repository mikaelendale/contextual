# usecontextual

The Contextual CLI: everything a script can do, with no AI. Zero runtime dependencies.

> **Warning:** The package is `usecontextual`. `npx contextual` runs a different, unrelated package.

Contextual keeps a folder of plain markdown files in your repo that tells an AI coding agent what the project is, how it's built, what's done and what comes next. This CLI lays that folder down, checks it, and keeps Contextual's own files current. The agent skills it installs do the writing. More at [github.com/mikaelendale/contextual](https://github.com/mikaelendale/contextual).

## Start

In a git repo:

```bash
npx usecontextual init          # or: pnpm dlx usecontextual init, bunx usecontextual init
```

Then tell your coding agent "set up contextual".

## Commands

| Command | What it does |
|---|---|
| `init` | Adds the `AGENTS.md` block (after any existing content), the `CLAUDE.md` import, the `context/` skeleton, the agent skills and the pre-commit hook. Pins itself as an exact dev dependency when there's a `package.json`. Never overwrites a file |
| `check` | Validates the context. Exit code 1 when there are errors |
| `check --fix` | Rebuilds the feature index, stores the `idea.md` hash, creates a missing status file, then checks |
| `check --staged` | What the pre-commit hook runs: staged feature code needs its log entry and the branch's status file. Errors on feature branches, warnings on the default branch. Exit code 65 when there are errors, so the hook can tell them from a CLI that couldn't run |
| `check --branch <name>` | Names the branch when git can't, as in CI's detached HEAD |
| `which <path>` | Who owns a file: a feature, the `shared:` line, or no one (exit code 1) |
| `update` | Refreshes only Contextual's fixed parts: the `AGENTS.md` block, the `CLAUDE.md` import, `deslop.md`, the skills, the hook line |

`init` options:

| Option | Default |
|---|---|
| `--harness claude,codex,antigravity,opencode` | Detected from the repo; both skill folders when there's no sign of any |
| `--preset next` or `--preset laravel-inertia-react` | The blank templates |
| `--force` | Refuse when a `context/` folder that isn't Contextual's exists. `--force` adds Contextual's files next to it, still overwriting nothing |
| `--no-install` | Install the pinned dev dependency with the repo's package manager. With this flag, only `package.json` is edited |

## The hook

One marked line in the folder `git rev-parse --git-path hooks` reports (worktrees included), in `.husky/pre-commit` with husky, or printed for another hook manager to add. It runs the local pinned copy, or a pinned `npx` when there's no `package.json`. Details: [hooks/](https://github.com/mikaelendale/contextual/tree/main/hooks).

## Tests

```bash
npm test
```

Node's built-in runner, Node 20 or newer. `check` must pass on [`example/`](https://github.com/mikaelendale/contextual/tree/main/example) with 0 errors; the rest break copies of it, run `init`, `update` and the hook in throwaway git repos, and check that the skills, presets and example still match the templates.
