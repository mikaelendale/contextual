# contextual-next

Builds the next feature. Start it with "build the next feature", or with `/contextual-next` (Claude Code, Antigravity), `$contextual-next` (Codex), `@contextual-next` (OpenCode).

## What it does

1. Picks the feature: the one on the current `feat/<name>` branch, or the first unticked one in `context/build-plan.md` whose dependencies have shipped.
2. Creates `feat/<name>` and its status file, and writes the feature's `build.md` and `tests.md` before any code.
3. Builds it: tests first where it can, `usecontextual which <path>` before editing any file, only the packages and tools in `stack/`.
4. Verifies it the way a person would: the tests, then the app itself. For UI it runs the [deslop](../../templates/repo/context/design/deslop.md) checklist and records `pass (<how it was checked>)`, `fixed <what>`, `not verified <reason>` or `not UI`.
5. Finishes: log entry, README, status file, `check --fix` with 0 errors, a commit on the branch. It stops there; merging is yours.

## What it won't do

Merge, push (unless you ask), tick an acceptance box it hasn't seen work, or write `Deslop: pass` for a screen it hasn't looked at.

## Tested

Claude Code (with and without a browser), Codex and OpenCode. With a browser, Claude Code ended a feature with `Deslop: pass` and four screenshots: [docs/trials/2026-11-13-browser-add-items](../trials/2026-11-13-browser-add-items/).
