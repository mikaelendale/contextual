---
name: contextual-sync
description: Use when the person says "sync the context", "update the context" or "the context is out of date", after code changed without a log entry, or after a feature branch was merged. Brings context/ back in line with the code, flags changes no feature owns, and marks merged features shipped.
license: MIT
---

# Sync the context with the code

If you haven't this session, do the start-of-session read in `AGENTS.md` first. `<cli>` below is the `cli` value in `context/.meta.json`.

## 1. Find what changed

Work out the starting point from `lastSync` in `context/.meta.json`, as [references/since-last-sync.md](references/since-last-sync.md) describes: the stored commit, else the last commit before the stored date, else a rescan. Then list the changed files: committed since that point, plus anything uncommitted.

## 2. Find each file's owner

Run `<cli> which <path>` for every changed file outside `context/`. Group the files by feature.

- Shared paths: mention them in the log entries of the features they serve, if that's clear. Otherwise just list them in your report.
- No owner: list them for the person with a suggested owner, either a feature's `covers:` or the `shared:` line in `context/architecture.md`. Add them only once the person agrees, unless the right owner is plain from the path.

## 3. Bring each affected feature up to date

For each feature with changes, read its `README.md` and `build.md`, then the diff of its files.

- Correct the facts in `build.md`, `tests.md` and `notes.md`.
- Add one entry at the top of its `log.md`: `## <today> · <agent> · Sync: <what changed>`, saying which commits it covers. Use `Deslop: not verified (changed outside Contextual; the UI wasn't reviewed)` when its UI changed, and `Deslop: not UI` otherwise. If the feature has no `log.md` yet, create it from [assets/feature-log.md](assets/feature-log.md).
- Don't tick an acceptance box you haven't verified. A planned feature whose code now exists becomes `in-progress`.

## 4. Finish merged features (on the default branch)

When a feature's branch has been merged, follow [references/merge.md](references/merge.md): it becomes `shipped`, the plan gets ticked, and its branch status file is deleted.

## 5. Close

1. Rewrite the status file for the current branch (`context/status/main.md` on the default branch, otherwise from [assets/status-branch.md](assets/status-branch.md) if it's missing), in 40 lines or fewer.
2. In `context/.meta.json`, set `lastSync` to `{ "commit": "<git rev-parse HEAD>", "date": "<now, ISO 8601 UTC>" }`. Change nothing else in that file.
3. Run `<cli> check --fix`, then fix what it reports until there are 0 errors.
4. Commit the context changes as `Sync context`. Then report what changed for each feature, and anything you couldn't map.
