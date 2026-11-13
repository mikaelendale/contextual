# Finding "since the last sync"

`context/.meta.json` stores the last sync as `"lastSync": { "commit": "<hash>", "date": "<ISO date>" }`. Try these in order, and say in your report which one you used.

0. **No sync has run yet** (`lastSync` has no commit and no date). Start from the commit that set Contextual up, `git log --diff-filter=A --format=%H -1 -- context/.meta.json`, and use it as the commit in step 1.
1. **The commit is still in this branch's history.** Check with `git merge-base --is-ancestor <commit> HEAD`, which exits 0 when it is. Then the changed files are `git diff --name-only <commit> HEAD`, and the commits are `git log --oneline <commit>..HEAD`.
2. **The commit is gone,** because a squash merge or a rebase rewrote history. Find the last commit before the stored date with `git rev-list -1 --before="<date>" HEAD`, and use that commit in step 1's commands.
3. **Neither works** (no commit or date stored, or nothing before that date). Then rescan: for every `in-progress` and `shipped` feature, compare the files its `covers:` globs match today with the Files list in its `build.md`, and treat every difference as a change.

In every case, add the uncommitted changes from `git status --porcelain`. Leave out files under `context/`, `AGENTS.md`, `CLAUDE.md` and the skill folders: they are Contextual's own files.
