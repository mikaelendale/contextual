# Contextual

Continuous context engineering for coding agents. Explain your project once. Your agent remembers the rest.

Contextual is an open source context structure for codebases: a folder of plain markdown files in your repo that tells an AI coding agent what the project is, how it's built, what's done and what comes next. It works with Claude Code and Codex, and with Antigravity and OpenCode through the same shared standards (`AGENTS.md` and agent skills).

> [!WARNING]
> The npm package is **`usecontextual`**. `npx contextual` runs a different, unrelated package that has nothing to do with this project. Always type `npx usecontextual`.

**Not released yet.** This repo is being built in the open.

## Install

**Pre-release:** 0.0.1 reserves the name. `check` and `which` work; `init` and the skills are coming.

The package is [`usecontextual` on npm](https://www.npmjs.com/package/usecontextual). Run it without installing:

```bash
npx usecontextual
```

Or add it to your project as a dev dependency:

```bash
npm install --save-dev usecontextual
```

With pnpm, use `pnpm dlx usecontextual` or `pnpm add -D usecontextual`.

## How it will work

1. Plan your project in any AI chat (optional). You get one file, `contextual-plan.md`.
2. `npx usecontextual init` adds the context folder, the agent skills and a git hook.
3. Tell your agent "set up contextual". It writes the context from your plan, or from your existing code.
4. Tell it "build the next feature". It builds one feature on its own branch and keeps the context current.

## What's in this repo

| Folder | What it is | Status |
|---|---|---|
| [`docs/`](docs/) | [The spec](docs/spec.md), [the plan-file format](docs/plan-file.md), [where each harness reads skills](docs/harnesses.md) and [the rules for this repo](docs/maintaining.md) | Written |
| [`templates/`](templates/) | Every blank context file, plus `deslop.md` | Written |
| [`example/`](example/) | A finished context folder for a small app, Linkboard, to imitate | Written |
| [`skills/`](skills/) | The agent skills and the chat planning prompt | `contextual-setup` (from a plan, or from questions), `contextual-next` and `contextual-sync` written; tried in Claude Code. The chat prompt isn't started |
| [`packages/cli/`](packages/cli/) | The [`usecontextual`](https://www.npmjs.com/package/usecontextual) npm package | `check`, `which` and `check --fix`, tested. 0.0.1 on npm has `check` and `which` |
| [`hooks/`](hooks/) | The git pre-commit hook | Not started |
| [`presets/`](presets/) | Ready-made stacks: Next.js, and Laravel with Inertia and React | Not started |
| [`site/`](site/) | The website, contextual.mikaelen.site | Teaser |

Start with [the spec](docs/spec.md).

## License

[MIT](LICENSE). Copyright Mikael Endale.
