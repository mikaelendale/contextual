# Hooks

## The pre-commit hook

`usecontextual init` installs it, and `update` refreshes it. It's one marked line, never the whole file, so an existing hook keeps working:

```sh
if [ -x node_modules/.bin/usecontextual ]; then usecontextual_exit=0; node_modules/.bin/usecontextual check --staged || usecontextual_exit=$?; if [ "$usecontextual_exit" -eq 65 ]; then exit 1; elif [ "$usecontextual_exit" -ne 0 ]; then echo "…"; fi; else echo "…"; fi # usecontextual
```

In a repo with no `package.json` it calls `npx --yes usecontextual@<exact version> check --staged` the same way instead: pinned, never a bare name.

- **Where:** the folder `git rev-parse --git-path hooks` reports, which is right in a plain repo and in a worktree. With husky it goes in `.husky/pre-commit`, never in husky's generated `.husky/_`. With another hook manager, `init` writes nothing and prints the line to add.
- **What it checks:** `check --staged`. When a commit changes a feature's code, the commit must also carry that feature's `log.md` entry and the branch's status file. It blocks on feature branches and warns on the default branch. `git commit --no-verify` is the deliberate way past it.
- **When it blocks:** only when `check --staged` ran and found errors, which it signals with exit code 65. If the CLI can't run at all (not installed yet, offline, the registry down, the pinned version not found, Node missing), the hook prints "usecontextual couldn't run (exit N), so the context check was skipped." and the commit goes through. It catches the failure with `||`, so it also works in a hook file that uses `set -e`.
- **The code:** [`packages/cli/src/hook.js`](../packages/cli/src/hook.js) and [`packages/cli/src/staged.js`](../packages/cli/src/staged.js).

## In CI

Hooks don't travel with a clone, so cloud agents and teammates who haven't run `init` skip them. [`github-actions.yml`](github-actions.yml) runs `usecontextual check` on every pull request. Copy it to `.github/workflows/contextual.yml`.
