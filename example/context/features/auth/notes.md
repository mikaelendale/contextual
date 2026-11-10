# Notes — Auth

## Gotchas
- 2026-09-20 · Signing in from a server action set no cookie until `nextCookies()` went last in the plugins list. Recorded in `stack/better-auth.md`.
- 2026-09-20 · The proxy can't tell an expired session from a valid one, so pages and actions call `requireSession()`. Recorded in `stack/better-auth.md`.
- 2026-09-18 · In development, emails print to the terminal instead of being sent. Previews and production send through Resend.

## Open questions
None.
