# Stack overview

**Next.js 16, App Router.** One codebase for pages, server actions and the auth routes, and Vercel deploys it with no extra setup.

**Postgres on Neon, with Drizzle.** Teams, links and boards are relational data. Neon gives each environment its own database branch. Drizzle keeps the schema and queries in TypeScript, close to SQL. Picked over Prisma: [decisions/2026-09-15-drizzle-over-prisma.md](../decisions/2026-09-15-drizzle-over-prisma.md).

**Better Auth, with magic links.** No passwords, as the plan asks ([decisions/2026-09-12-magic-links-only.md](../decisions/2026-09-12-magic-links-only.md)). Users and sessions live in our own database, through the Drizzle adapter.

**Resend, with React Email.** Sign-in links and invites now; the weekly digest later.

**Tailwind CSS 4 and shadcn/ui.** The components are copied into the repo, so they follow `design/principles.md` rather than a library's defaults.

**Vitest and Playwright.** Vitest for actions and helpers, Playwright for the paths a person clicks through.
