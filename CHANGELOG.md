# Changelog

The `usecontextual` npm package. Versions follow semver; while the version is 0.x, a minor version can change behavior.

## 0.2.0 (not published)

- Agent feedback: when the owner turns it on, the agent notes problems with Contextual itself while it works, and before its final answer `usecontextual feedback` opens one prefilled form for the person to review and send. The report travels in the link's fragment, so nothing reaches a server until Send. `init` asks once (off when nobody can answer); `feedback on` and `feedback off` add and remove its block in `AGENTS.md`; `update` keeps it in step with `.meta.json`; it never runs in CI. See `docs/agent-feedback.md`.
- The most specific match owns a file: an exact path beats any glob, otherwise the glob with more folders before its first wildcard, and the `shared:` line takes part. A new feature can add files inside another feature's folder; equally specific matches are still an error. `check`, `which` and the hook all follow it.
- `which --unowned` lists the code no feature owns, and `check` counts it once setup has run.
- Setup's path 3 lists nested `AGENTS.md` files and offers a `CLAUDE.md` next to each, so Claude Code reads them.

## 0.1.0 (prepared, not published)

The first release that works end to end.

- `init`: adds the `AGENTS.md` block (after any existing content), the `CLAUDE.md` import, the `context/` skeleton and the three agent skills. Detects harnesses (or takes `--harness`), detects the package manager from the lockfile, pins itself as an exact dev dependency, takes `--preset next` or `--preset laravel-inertia-react`, installs the pre-commit hook, and never overwrites a file.
- `update`: refreshes only Contextual's fixed parts: the `AGENTS.md` block, the `CLAUDE.md` import, `deslop.md`, both skill copies, the hook line and the version.
- `check --staged` and the pre-commit hook: a feature's code needs its log entry and the branch's status file in the same commit. It blocks on feature branches and warns on the default branch.
- `check --fix`: rebuilds the feature index, stores the `idea.md` hash, and creates a missing status file for the current branch.
- `check`: validates deslop results in feature logs, and warns when more than a third of owned files are on the `shared:` line.
- The agent skills: `contextual-setup` (from a plan, from questions, or from existing code), `contextual-next` and `contextual-sync`. Plus `contextual-plan`, a chat skill and a copy-paste prompt.
- Presets for Next.js and for Laravel with Inertia and React.
- With a `package.json`, `AGENTS.md`, the feature index and the skills run the CLI as `npx --no-install usecontextual`, so a fresh clone without `node_modules` fails instead of downloading an unpinned copy. `update` moves existing repos over.
- The hook only warns until setup has run (no `context/idea.md`), on every branch.
- The hook blocks a commit only when `check --staged` ran and found errors (it exits 65 for that). When the CLI can't run (offline, the registry down, the pinned version not found, Node missing), the hook prints a note and the commit goes through.
- When a branch has no status file, the error says to run `usecontextual check --fix`, which creates it.

## 0.0.1 (11 November 2026)

A placeholder to hold the name. `check` and `which` work; the other commands print "not released yet".
