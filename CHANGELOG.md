# Changelog

The `usecontextual` npm package. Versions follow semver; while the version is 0.x, a minor version can change behavior.

## 0.1.0 (prepared, not published)

The first release that works end to end.

- `init`: adds the `AGENTS.md` block (after any existing content), the `CLAUDE.md` import, the `context/` skeleton and the three agent skills. Detects harnesses (or takes `--harness`), detects the package manager from the lockfile, pins itself as an exact dev dependency, takes `--preset next` or `--preset laravel-inertia-react`, installs the pre-commit hook, and never overwrites a file.
- `update`: refreshes only Contextual's fixed parts: the `AGENTS.md` block, the `CLAUDE.md` import, `deslop.md`, both skill copies, the hook line and the version.
- `check --staged` and the pre-commit hook: a feature's code needs its log entry and the branch's status file in the same commit. It blocks on feature branches and warns on the default branch.
- `check --fix`: rebuilds the feature index, stores the `idea.md` hash, and creates a missing status file for the current branch.
- `check`: validates deslop results in feature logs, and warns when more than a third of owned files are on the `shared:` line.
- The agent skills: `contextual-setup` (from a plan, from questions, or from existing code), `contextual-next` and `contextual-sync`. Plus `contextual-plan`, a chat skill and a copy-paste prompt.
- Presets for Next.js and for Laravel with Inertia and React.

## 0.0.1 (11 November 2026)

A placeholder to hold the name. `check` and `which` work; the other commands print "not released yet".
