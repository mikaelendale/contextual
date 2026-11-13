# Update
status: shipped
phase: 1
covers: packages/cli/src/update.js, packages/cli/test/update.test.js
depends-on: foundation, init

## What it does
`usecontextual update` refreshes only Contextual's own parts to the installed version: the `AGENTS.md` block, the `CLAUDE.md` import, `deslop.md` and its hash, both skill copies, the hook line, and the `cli` command and version in `.meta.json`. It never changes project content.

## Acceptance
- [x] It refreshes the `AGENTS.md` block, `deslop.md`, the skills and the hook line, and leaves project content alone
- [x] It keeps the project's own heading and notes around the `AGENTS.md` block
- [x] In a repo with a `package.json` it moves `npx usecontextual` to `npx --no-install usecontextual`
- [x] Before `init` has run, it says to run `init`
