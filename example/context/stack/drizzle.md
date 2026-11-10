# Drizzle ORM, with Neon over HTTP

## How it's wired here
- `src/db/index.ts` · `db`, using the `neon-http` driver and `DATABASE_URL`.
- `src/features/*/schema.ts` · each feature's tables. `src/db/auth-schema.ts` · Better Auth's tables (generated; don't edit by hand).
- `drizzle.config.ts` · collects both into one schema for drizzle-kit.
- `drizzle/` · numbered SQL migrations.

## Rules
- Change a `schema.ts`, run `pnpm db:generate` to write the migration, and commit the SQL file with the change.
- Apply migrations with `pnpm db:migrate`. Never run `drizzle-kit push` against preview or production.
- One migration per feature branch. If `main` gained a migration while you worked, merge `main` and regenerate yours; don't hand-edit `drizzle/meta/`.
- Every query filters by `team_id`. Nothing else would catch a missing filter.

## Gotchas
- 2026-11-08 · `db.transaction()` doesn't work with the neon-http driver, which has no interactive transactions. For writes that must succeed or fail together, use `db.batch([...])`; Neon runs the batch as one transaction. (Found in boards.)
- 2026-10-13 · A unique-index violation comes back as Postgres error `23505`. Catch it where a duplicate is expected, as `saveLink` does. (Found in links.)

## Docs
- https://orm.drizzle.team/docs/connect-neon
- https://orm.drizzle.team/docs/batch-api
- https://orm.drizzle.team/docs/migrations
