# Hooks

The git pre-commit hook that `usecontextual init` installs. It runs `usecontextual check --staged` from the repo's own pinned dev dependency, and only falls back to a pinned `npx` in repos with no `package.json`. On feature branches it blocks a commit that changes code without the feature's log and the branch's status file; on the default branch it warns.

Not built yet: this is step 3 of the build order. The design is in sections 6.2 and 6.3 of [the spec](../docs/spec.md).
