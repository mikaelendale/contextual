# Notes — Agent feedback

## Gotchas
- 2026-11-13 · `templates/repo/` must mirror a project's files exactly (the fixtures test), so the block's text lives in `templates/agent-feedback-block.md` instead.
- 2026-11-13 · `next build` type-checks `lib/feedback/feedback.test.ts` too, and Node runs it directly, so imports carry `.ts` (`allowImportingTsExtensions` in `site/tsconfig.json`).
- 2026-11-13 · A connection string written into a test trips the repo's own check; the CLI test builds its example at run time.

## Open questions
- 2026-11-13 · Which Neon database holds the reports, and who runs the migration? Nothing is connected yet.
- 2026-11-13 · How long are reports kept? Nothing deletes them yet.
