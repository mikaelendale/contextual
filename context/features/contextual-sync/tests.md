# Tests — Contextual sync

## Automated
None of its own; `skills.test.js` checks its shape and copies.

## How a person reaches it
After editing code by hand or merging a branch, tell the coding agent "sync the context".

## How the agent checks it
1. Merge a feature branch and make a hand edit without touching the context.
2. Run sync in a coding agent.
3. Run `check` yourself, and read the logs it wrote.

## What proves it works
The edits are logged in the right features, the merged feature is finished, `lastSync` is updated, and `check` reports 0 errors.

## Last result
2026-11-13 · trials: the sync trial in Claude Code and both full runs (Claude Code and Codex) ended with 0 errors.
