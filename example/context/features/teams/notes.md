# Notes — Teams

## Gotchas
- 2026-09-30 · `/invite/[token]` has to work signed out: it sends people to `/sign-in` with a return link, and accepts once they're back.
- 2026-09-30 · `params` is a promise in Next 16 pages (`const { token } = await params`). It applies to every dynamic route, so it's recorded in `stack/nextjs.md`.
- 2026-09-26 · Invites store only a hash of the token (`token_hash`); the plain token exists only in the email link. Look an invite up by hashing the token from the URL.

## Open questions
None.
