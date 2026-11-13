# Templates
status: shipped
phase: 1
covers: templates/**, presets/**, packages/cli/test/presets.test.js
depends-on: foundation

## What it does
The blank context files every project starts from, and the stack presets that fill some of them in. `init` lays them down, `update` refreshes `deslop.md` from them, and the skills' `assets/` hold copies of the ones they create files from.

## Acceptance
- [x] `check` passes with 0 errors on what `init` lays down from them
- [x] A preset fills `stack/`, `architecture.md` and `conventions.md` without naming a framework version
- [x] Every skill asset is an exact copy of its template, and the example's `AGENTS.md` block and `deslop.md` match them
