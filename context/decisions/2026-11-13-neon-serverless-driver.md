# Neon's serverless driver for agent feedback, over an ORM or node-postgres
Date: 2026-11-13 · Scope: agent-feedback

## Context
Agent feedback stores reports in Neon, which the owner chose. The site runs on Vercel's serverless functions, and it's the site's first database. It needs one insert, one count and one filtered list.

## Decision
`@neondatabase/serverless`, pinned exactly, with its tagged-template queries, which send every value as a parameter. The table is plain SQL in `site/db/migrations/`.

## Why not the alternatives
- An ORM such as Drizzle: a schema layer, a migration tool and their config for one table.
- `pg` (node-postgres): a TCP connection pool, which serverless functions handle badly; Neon's driver speaks HTTP.

## Revisit if
The site needs more than a few tables, or transactions across them.
