# Notes — Links

## Gotchas
- 2026-10-13 · `normalizeUrl()` lowercases the host and drops `utm_*` parameters, the `#fragment` and a trailing slash. It decides which links count as duplicates, so add a test case before changing it.
- 2026-10-13 · Two people saving the same URL at once both pass the duplicate check; the unique index stops the second with Postgres error `23505`. `saveLink` catches it and returns the existing link. Recorded in `stack/drizzle.md`.

## Open questions
None.
