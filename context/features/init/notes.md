# Notes — Init

## Gotchas
- 2026-11-13 · Without a `package.json`, init pins `npx --yes usecontextual@<version>` for the context files and the hook. In this repo that's the last published version, not the working copy (issue #2).

## Open questions
- 2026-11-13 · bunx: `bunx usecontextual init` has never run for real, because Bun wasn't installed on the test machine. Does it find `bun.lock` and add the dependency with `bun add --dev --exact`?
