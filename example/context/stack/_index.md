# Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16, App Router | [nextjs.md](nextjs.md) |
| Language | TypeScript, strict | [../conventions.md](../conventions.md) |
| Database | Postgres on Neon | [drizzle.md](drizzle.md) |
| Data access | Drizzle ORM, drizzle-kit migrations | [drizzle.md](drizzle.md) |
| Auth | Better Auth, magic links only | [better-auth.md](better-auth.md) |
| Email | Resend, with React Email templates | `src/lib/email.ts` |
| UI | Tailwind CSS 4 and shadcn/ui | [../design/components.md](../design/components.md) |
| Icons | Lucide | [../design/principles.md](../design/principles.md) |
| Tests | Vitest and Playwright | [../conventions.md](../conventions.md) |
| Hosting | Vercel | [deploy.md](deploy.md) |
| Package manager | pnpm | [requirements.md](requirements.md) |
