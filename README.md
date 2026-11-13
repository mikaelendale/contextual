# Contextual

Continuous context engineering for coding agents. Explain your project once. Your agent remembers the rest.

Contextual is an open source context structure for codebases: a folder of plain markdown files in your repo that tells an AI coding agent what the project is, how it's built, what's done and what comes next. It works through the two standards coding agents share, `AGENTS.md` and agent skills.

> [!WARNING]
> The npm package is **`usecontextual`**. `npx contextual` runs a different, unrelated package that has nothing to do with this project. Always type `npx usecontextual`.

**Status:** 0.1.0 is the first release that works end to end. It needs Node.js 20 or newer. (0.0.1 on npm was a placeholder.)

## Quickstart

In a git repo (run `git init` first in a new folder):

```bash
npx usecontextual init
```

Or with pnpm or Bun:

```bash
pnpm dlx usecontextual init
bunx usecontextual init
```

`init` adds the `context/` folder, the agent skills and a git pre-commit hook, and pins `usecontextual` as a dev dependency when there's a `package.json`. It never overwrites a file. Then, in your coding agent:

1. **"set up contextual"**: it writes the context from `contextual-plan.md` if you put one at the root, asks you five questions if the repo is empty, or reads your existing code and proposes features for you to confirm.
2. **"build the next feature"**: it builds one feature on its own branch, checks it, records it, and stops for you to review and merge.
3. **"sync the context"**: after you edit code by hand or merge a branch, it brings the context back in line.

Want to plan first? Paste [the planning prompt](skills/contextual-plan/prompt.md) into any AI chat. It gives you `contextual-plan.md`.

Any time, for free: `npx usecontextual check` validates the context, and `npx usecontextual which <path>` says which feature owns a file.

## Tested with

Each harness ran setup from a plan file and then built one feature, on 13 November 2026. Details and logs: [docs/trials](docs/trials/).

| Harness | Model | Plain words ("set up contextual") | Explicit call | `check` after each run |
|---|---|---|---|---|
| Claude Code 2.1.322 | Opus 5.5 | Worked | `/contextual-next` worked | 0 errors |
| Codex CLI 0.167.2 | gpt-6.1-sol | Worked | `$contextual-next` worked | 0 errors |
| OpenCode 2.2.7 | big-pickle (its free default) | Worked | `@contextual-next` worked | 0 errors |

**Not tested:** Antigravity, which should work through the same standards ([where each harness reads skills](docs/harnesses.md)). Codex's default sandbox makes `.git` read-only, so give it that folder (`codex --add-dir .git`) or approve its git commands, or it can't branch and commit.

## The skills

| Skill | Say | What it does |
|---|---|---|
| [contextual-plan](docs/skills/contextual-plan.md) | "help me plan an app" (any chat) | Plans the project; writes `contextual-plan.md` |
| [contextual-setup](docs/skills/contextual-setup.md) | "set up contextual" | Writes the context the first time |
| [contextual-next](docs/skills/contextual-next.md) | "build the next feature" | Builds one feature on its own branch |
| [contextual-sync](docs/skills/contextual-sync.md) | "sync the context" | Brings the context in line with the code |

## What's in this repo

| Folder | What it is |
|---|---|
| [`docs/`](docs/) | [The spec](docs/spec.md), [the plan-file format](docs/plan-file.md), [the skills](docs/skills/), [where each harness reads skills](docs/harnesses.md), [trials](docs/trials/) and [the rules for this repo](docs/maintaining.md) |
| [`packages/cli/`](packages/cli/) | The `usecontextual` npm package: `init`, `check`, `which`, `update` |
| [`skills/`](skills/) | The four skills |
| [`templates/`](templates/) | Every blank context file, plus `deslop.md` |
| [`presets/`](presets/) | Ready-made stacks: Next.js, and Laravel with Inertia and React |
| [`hooks/`](hooks/) | The pre-commit hook, and a CI job that runs the same check |
| [`example/`](example/) | A finished context folder for a small app, Linkboard, to imitate |
| [`site/`](site/) | The website, contextual.mikaelen.site |

[CHANGELOG](CHANGELOG.md) · Start with [the spec](docs/spec.md).

## License

[MIT](LICENSE). Copyright Mikael Endale.
