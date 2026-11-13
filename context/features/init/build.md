# Build — Init

## Files
- `packages/cli/src/init.js` · init: harnesses, the package manager, templates, skills, presets, the dependency and the hook
- `packages/cli/test/init.test.js` · its tests

## Data
Writes `context/.meta.json`: the version, the creation date, the default branch, the `cli` command, the skill folders, the hashes and the caps.

## Routes and actions
- `usecontextual init [--harness <list>] [--preset <name>] [--force] [--no-install]`

## Components
None.

## Follows
Spec sections 3.1, 6 and 6.3
