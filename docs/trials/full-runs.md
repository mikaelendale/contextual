# Full runs from zero

13 November 2026. A new folder, the CLI from a locally packed `usecontextual-0.1.0.tgz` (not the published 0.0.1), and the Pantry plan. The same seven steps in Claude Code and in Codex. `check` was run by hand after each step. The real pre-commit hook was installed by `init` and ran on every commit, the agents' and the hand edit's.

| Step | Claude Code 2.1.322 (Opus 5.5) | Codex CLI 0.167.2 (gpt-6.1-sol) |
|---|---|---|
| 1. `git init`, `npm install -D ./usecontextual-0.1.0.tgz`, `npx usecontextual init` | Laid everything down; kept the tarball dependency; hook in `.git/hooks/pre-commit`. `check`: 0 errors | Same |
| 2. "set up contextual" | Wrote the context with `foundation` first, moved the plan to `idea.md` (`git mv`, since it was tracked), committed through the hook. 0 errors | Same, without stopping to ask (the rule conflict it found earlier is fixed). 0 errors |
| 3. Explicit call: `/contextual-next` (Claude Code), `$contextual-next` (Codex) | Loaded the skill, built `foundation` on `feat/foundation`, committed. `Deslop: not verified` because the test setup didn't allow starting Chrome. 0 errors | Built `foundation` on `feat/foundation`, committed. `Deslop: not verified` because its sandbox blocks Chrome. 0 errors |
| 4. Merge `feat/foundation` into `main` (by hand) | Merged | Merged |
| 5. Hand edit on `main`: the page title in `index.html`, committed without touching the context | The hook warned that `foundation`'s log entry and `status/main.md` weren't in the commit, and let it through: warnings only on the default branch | Same |
| 6. "sync the context" | Diffed from the setup commit, logged the merge and the title change in `foundation`'s log, stored the new last sync. Didn't mark `foundation` shipped, because three acceptance boxes were still unverified, and asked the owner instead. 0 errors | Same outcome, and ran the tests. 0 errors |
| 7. `npx usecontextual check` | 0 errors, 1 warning (`shared: src/ui/**` matches no files yet) | 0 errors, 1 warning (`shared: src/components/**` matches no files yet) |

## What this shows

- `init`, setup, a feature, a hand edit, sync and `check` work end to end from a packed 0.1.0, in both harnesses that are fully supported.
- The hook runs in a real flow, and behaves as specified on the default branch.
- Both agents refuse to mark a feature shipped while an acceptance line is unverified. With no browser, the feature stays in progress until a person decides or a session that can render the UI checks it.

## Also checked

- `pnpm --package=file:<tarball> dlx usecontextual init` in an empty repo works. With no `package.json`, it uses a pinned `npx --yes usecontextual@0.1.0`.
- Not checked: `bunx` (Bun isn't installed on the test machine), and `init` installing the dependency from npm (it needs 0.1.0 to be published).
