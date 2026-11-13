# Commit hook
status: shipped
phase: 1
covers: packages/cli/src/staged.js, packages/cli/src/hook.js, packages/cli/test/staged.test.js, packages/cli/test/hook.test.js, hooks/**
depends-on: foundation, check

## What it does
The pre-commit hook, and the `check --staged` rule behind it: a commit that changes a feature's code must carry that feature's `log.md` entry and the branch's status file. It blocks on feature branches, warns on the default branch, and only warns until setup has run. It blocks only when the check ran and found errors; when the CLI can't run, it says so and lets the commit through.

## Acceptance
- [x] On a feature branch, a commit of a feature's code without its log entry and status file is blocked
- [x] On the default branch the same commit gets a warning and goes through
- [x] Until setup has run, the hook only warns
- [x] When the CLI can't run (offline, the version not found, Node missing), the hook prints a note and the commit goes through
