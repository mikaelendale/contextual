# Build — Commit hook

## Files
- `packages/cli/src/staged.js` · the `--staged` rule (spec 6.2)
- `packages/cli/src/hook.js` · the hook line, exit code 65, and where the line goes: a plain repo, a worktree, husky, other hook managers
- `packages/cli/test/staged.test.js` · the rule's tests
- `packages/cli/test/hook.test.js` · real commits through the hook
- `hooks/README.md` · how the hook works
- `hooks/github-actions.yml` · a CI job projects can copy

## Data
Reads `git diff --cached`. Writes one marked line into the pre-commit hook.

## Routes and actions
- `usecontextual check --staged`: exit 65 when it finds errors
- The hook line, installed by `init` and refreshed by `update`

## Components
None.

## Follows
Spec sections 6.2 and 6.3; [exit code 65](../../decisions/2026-11-13-hook-blocks-on-exit-65.md)
