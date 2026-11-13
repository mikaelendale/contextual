# Tests — Contextual setup

## Automated
None of its own; `skills.test.js` checks its shape and copies.

## How a person reaches it
After `init`, tell the coding agent "set up contextual".

## How the agent checks it
1. Run it in a coding agent on a sample plan, on an empty repo, and on existing code.
2. Run `check` after each run yourself.

## What proves it works
The context is written, `foundation` comes first, and `check` reports 0 errors.

## Last result
2026-11-13 · path 3 on this repo, in Claude Code: the proposed split was confirmed with changes, the context was written, and `check` reported 0 errors.
