# Architecture

## Overview
One Next.js app on Vercel. Server components read from Postgres (Neon) through Drizzle, and server actions write to it. Better Auth handles sign-in and sessions in the same database. Email goes out through Resend. There are no background workers yet.

## Parts
| Part | Where | What it does |
|---|---|---|
| Routes | `src/app/` | Pages and layouts. `/app/**` is the signed-in app |
| Features | `src/features/<feature>/` | Each feature's schema, actions, queries and components |
| Shared UI | `src/components/` | shadcn/ui components in `ui/`, plus app-wide pieces like `EmptyState` |
| Database | `src/db/`, `drizzle/` | The Drizzle client, and the numbered SQL migrations |
| Auth | `src/lib/auth.ts`, `src/proxy.ts` | Sessions, sign-in, redirects for signed-out visitors |
| Email | `src/lib/email.ts` | One `sendEmail()` for every email |

## How a request flows
Saving a link:
1. `src/app/app/links/page.tsx` renders `SaveLinkForm` from `src/features/links/components/`.
2. Submitting calls the `saveLink` server action in `src/features/links/actions.ts`.
3. `saveLink` calls `requireSession()`, validates the input with zod, normalizes the URL, and inserts into `links`.
4. On a duplicate (Postgres error `23505`) it returns the existing link; otherwise it calls `revalidatePath('/app/links')`.

## Data
Each feature keeps its tables in its own `schema.ts`; `drizzle.config.ts` collects them.
- auth: `user`, `session`, `account`, `verification` (generated, in `src/db/auth-schema.ts`)
- teams: `teams`, `members`, `invites`
- links: `links`
- boards: `boards`, `board_links`

## Outside services
| Service | Used for | Called from |
|---|---|---|
| Neon | Postgres | `src/db/index.ts` |
| Resend | Email | `src/lib/email.ts` |
| Vercel | Hosting and preview deploys | (no code) |

## Boundaries
- Features use each other only through `schema.ts` (for foreign keys) and exported components (like `LinkRow` and its `menuSlot`).
- Only `actions.ts` files write to the database.
- Every query filters by `team_id`.
- Code no single feature owns is listed on the line below: the files at the repo root (config), the app shell, UI components, the database client, migrations, test helpers and static files.

shared: *, src/app/*.tsx, src/app/globals.css, src/app/app/layout.tsx, src/app/app/error.tsx, src/components/**, src/db/index.ts, drizzle/**, e2e/helpers/**, public/**
