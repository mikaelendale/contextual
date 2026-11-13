# Tests — Contextual next

## Automated
None of its own; `skills.test.js` checks its shape and copies.

## How a person reaches it
Tell the coding agent "build the next feature".

## How the agent checks it
1. Run it in a coding agent on a project after setup, with a browser for UI work.
2. Run `check` yourself afterwards, and read the log entry.

## What proves it works
One feature is built and committed on its branch, its log entry has a valid `Deslop:` result, and `check` reports 0 errors.

## Last result
2026-11-13 · trials: built `foundation` in Claude Code, Codex and OpenCode, and `add-items` in Claude Code, ending with "Deslop: pass" and four screenshots.
