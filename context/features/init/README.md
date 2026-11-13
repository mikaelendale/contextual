# Init
status: shipped
phase: 1
covers: packages/cli/src/init.js, packages/cli/test/init.test.js
depends-on: foundation, templates

## What it does
`usecontextual init` adds Contextual to a git repo: the `AGENTS.md` block, the `CLAUDE.md` import, the `context/` skeleton, the agent skills and the pre-commit hook. It finds the harness folders and the package manager, pins itself as an exact dev dependency when there's a `package.json`, and never overwrites a file.

## Acceptance
- [x] In an empty git repo it adds `AGENTS.md`, `CLAUDE.md`, `context/`, both skill folders and the hook, and `check` passes
- [x] With a `package.json` it pins itself as an exact dev dependency, and the hook calls the local copy
- [x] It never overwrites a file, and refuses outside a git repo
- [x] `--harness`, or the harness folders it finds, decide where the skills go
