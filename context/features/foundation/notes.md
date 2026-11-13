# Notes — Foundation

## Gotchas
- 2026-11-13 · Node 20's test runner doesn't expand a quoted glob, so `npm test` failed there · keep `test/*.test.js` unquoted in the test script, so the shell expands it.
- 2026-11-13 · CI's actions are pinned to commit SHAs · update them by SHA, with the version in a comment.

## Open questions
- 2026-11-13 · Antigravity: nobody has run the skills in it yet, because its CLI needs a sign-in in a browser. Does it find `.agents/skills/` and follow the skills? The answer goes in `docs/trials/`, the README's "Tested with" table and `docs/harnesses.md`.
- 2026-11-13 · Windows: nothing has run on it. Do the CLI's paths, git calls and globs behave with backslashes and `core.autocrlf`?
- 2026-11-13 · GitHub's private vulnerability reporting is off, but SECURITY.md sends people to it. Turn it on?
