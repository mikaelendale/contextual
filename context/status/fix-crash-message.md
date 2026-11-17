# Status — fix-crash-message
Updated: 2026-11-18 · by: claude-code

## Current focus
0.3.1: a crash in the CLI says it's a bug and where to report it, and exits 70.

## Last session
- `bin/usecontextual.js` catches unexpected errors; a test makes one happen.
- Tried 0.3.0's setup for real on a Next.js scaffold: every new step worked; recorded in `docs/trials/README.md`.

## In progress
Nothing.

## Blocked / needs a human
- Publishing 0.3.1 needs the owner's go-ahead and npm 2FA.
- Issue #11 waits on the reporter's hook output; PR #10 on their answers.

## Next
Merge, publish 0.3.1, and ask the Windows reporter to try again with it.
