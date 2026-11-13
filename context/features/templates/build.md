# Build — Templates

## Files
- `templates/repo/` · what `init` writes into a project: `AGENTS.md`, `CLAUDE.md`, `context/` with `.meta.json`
- `templates/feature/` · a feature's five files
- `templates/contextual-plan.md`, `decision.md`, `stack-lib.md`, `status-branch.md` · the plan file, and files the skills create later
- `templates/README.md` · what's where
- `presets/next/`, `presets/laravel-inertia-react/` · the stack files, `architecture.md` and `conventions.md` for each preset
- `presets/README.md` · how presets work
- `packages/cli/test/presets.test.js` · the presets' tests

## Data
None.

## Routes and actions
- `usecontextual init --preset next`, `--preset laravel-inertia-react`

## Components
None.

## Follows
Spec section 3; [conventions](../../conventions.md)
