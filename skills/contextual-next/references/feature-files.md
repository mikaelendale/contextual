# Filling the feature files

Every file starts from this skill's `assets/` template. Keep the headings, replace each `<!-- fill: … -->` comment with content, and delete the comment.

## `build.md` (write it before the code, correct it after)

- **Files:** every file the feature adds or changes, one line each: `path · what it is`. All of them must fall under the README's `covers:` globs. The exceptions are shared paths, and another feature's files you had to touch, which you log in that feature's `log.md` too.
- **Data:** what the feature stores and where (tables, keys in local storage, files), and the migration if there is one. "None" if it stores nothing.
- **Routes and actions:** pages, API routes, commands, event handlers, one line each.
- **Components:** the ones it adds, and the shared ones it uses from `design/components.md`.
- **Follows:** relative links to the `stack/` and `design/` files this feature must follow, and to any `decisions/` record about it.

## `tests.md`

- **Automated:** the test files, and the exact command that runs only this feature's tests, with how long it takes.
- **How a person reaches it:** the clicks from the home screen.
- **How the agent checks it:** numbered steps to drive the feature for real, such as starting the app, opening the page and doing the action. A passing build is not a check.
- **What proves it works:** what you can observe afterwards.
- **Last result:** `YYYY-MM-DD · what ran · result`. Replace it each time.

## `notes.md`

Gotchas as `date · what happened · what to do instead`, newest first, and Open questions with the date asked. Write "None." under a heading that has nothing.

## `log.md`

One entry per task, newest first:

```
## YYYY-MM-DD · <agent> · <what was done>
- Changed: the files and behavior, in a line or two.
- Tests: tests added or run, and the result.
- Left open: what isn't finished, or "nothing".
- Deslop: pass (<how you checked>) / fixed <what> / not verified <reason> / not UI
```

`<agent>` is `claude-code`, `codex`, `antigravity` or `opencode`.

## The status file, `context/status/feat-<folder>.md`

Rewrite it at the end of every task, in 40 lines or fewer. Current focus (the feature and the acceptance line you're on), Last session (two to five lines), In progress (with file paths), Blocked / needs a human ("Nothing." when empty), and Next (numbered steps, so the next session can start without asking).
