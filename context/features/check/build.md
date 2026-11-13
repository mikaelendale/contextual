# Build — Check

## Files
- `packages/cli/src/check.js` · the checks in spec 6.1
- `packages/cli/src/fix.js` · `check --fix`
- `packages/cli/src/plan.js` · reads the plan-file format and the build plan
- `packages/cli/src/which.js` · `which`, and `which --unowned`
- `packages/cli/src/owners.js` · who owns a file: the most specific match (spec 3.8)
- `packages/cli/test/check.test.js`, `fix.test.js`, `plan.test.js`, `which.test.js`, `owners.test.js` · their tests

## Data
Reads `context/`, `.meta.json` and git's file list. Only `--fix` writes: `_index.md`, the `idea.md` hash, a missing status file.

## Routes and actions
- `usecontextual check [--branch <name>]`
- `usecontextual check --fix`
- `usecontextual which <path>`, `usecontextual which --unowned`

## Components
None.

## Follows
Spec sections 3.8 and 6.1; [the most specific owner](../../decisions/2026-11-13-most-specific-owner.md)
