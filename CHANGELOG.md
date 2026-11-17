# Changelog

The `usecontextual` npm package. Versions follow semver; while the version is 0.x, a minor version can change behavior.

## 0.3.1 (not published)

- When the CLI hits an unexpected error, it says so: which version, the platform and Node version, that it's a bug in usecontextual and where to report it, then the error. It exits 70, so the pre-commit hook says "couldn't run (exit 70)" with that message above it, instead of a bare exit 1. This is to find out why the hook skips its check on Windows (#11).

## 0.3.0 (17 November 2026)

From the first agent feedback reports and a tester on Windows.

- `check --staged` no longer asks a planned feature for a log entry, which `check` itself forbids: setup's own commit (with `init`'s `package.json` change) goes through cleanly. On a feature branch, changing a planned feature's code is a warning that says to set it in progress first.
- `init` puts the heading placeholder at the very top of an `AGENTS.md` another tool wrote without a heading (such as Next.js's managed block), and setup writes the project's heading there, never inside another tool's block.
- A planned feature can say `covers: not decided yet` until its paths are known; `contextual-next` decides them before building. A feature in progress or shipped still needs real paths.
- A feature being built gets one warning for all its paths with no files yet, not one per path.
- `context/questions.md`: open questions live there, split into questions for the owner and technical choices the agent proposed (each with a decision record). The status file lists only the ones blocking the next feature, so it stays about current work.
- `design/principles.md` marks each value as given (by the owner or a reference) or proposed. The plan format takes an optional `References:` line under Design direction, for a guideline or design system to follow.
- `check` recomputes the contrast ratios `principles.md` claims and warns when one is wrong, or when a text color is under 4.5:1. `usecontextual contrast <color> <color>` computes a ratio.
- Setup takes a plan file from wherever the person points, or named like `contextual-plan (1).md`, and on a repo that already has code it lists the installed tools in `stack/` and gives existing files owners.
- The CLI's own tests pass on Windows (thanks, @kilopal, #12).

## 0.2.0 (13 November 2026)

- Agent feedback: when the owner turns it on, the agent notes problems with Contextual itself while it works, and before its final answer `usecontextual feedback` opens one prefilled form for the person to review and send. The report travels in the link's fragment, so nothing reaches a server until Send. `init` asks once (off when nobody can answer); `feedback on` and `feedback off` add and remove its block in `AGENTS.md`; `update` keeps it in step with `.meta.json`; it never runs in CI. See `docs/agent-feedback.md`.
- The most specific match owns a file: an exact path beats any glob, otherwise the glob with more folders before its first wildcard, and the `shared:` line takes part. A new feature can add files inside another feature's folder; equally specific matches are still an error. `check`, `which` and the hook all follow it.
- `which --unowned` lists the code no feature owns, and `check` counts it once setup has run.
- Setup's path 3 lists nested `AGENTS.md` files and offers a `CLAUDE.md` next to each, so Claude Code reads them.

## 0.1.0 (13 November 2026)

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
