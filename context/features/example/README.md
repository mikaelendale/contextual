# Example
status: shipped
phase: 1
covers: example/**, packages/cli/test/fixtures.test.js
depends-on: templates, check

## What it does
Linkboard: a finished context folder for a small team's link-saving app, for people and agents to copy from. It shows every file filled in, a project part way through its build plan, and each shape the templates ask for.

## Acceptance
- [x] `check` on `example/` gives 0 errors and the two expected warnings
- [x] Its `AGENTS.md` block, `deslop.md` and hashes match the templates, and its `idea.md` is a valid plan file
