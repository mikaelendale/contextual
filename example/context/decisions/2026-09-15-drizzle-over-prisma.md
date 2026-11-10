# Drizzle over Prisma
Date: 2026-09-15 · Scope: project

## Context
We need a typed way to query Postgres on Neon from Vercel functions, and a migration tool.

## Decision
Drizzle ORM with the neon-http driver, and drizzle-kit for SQL migrations.

## Why not the alternatives
- Prisma: its own schema language and a generated client; we wanted the schema and queries in plain TypeScript, next to each feature.
- Plain SQL: no types, and every result would need mapping by hand.

## Revisit if
We often need interactive transactions. The neon-http driver has none (see stack/drizzle.md).
