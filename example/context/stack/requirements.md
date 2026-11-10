# Requirements

## Runtime
- Node.js 24 LTS and pnpm 10. Run `corepack enable` once; it picks pnpm's version up from `package.json`.
- Postgres 17 on Neon. There's no local database: development uses the Neon branch `dev`.

## Accounts
- Neon: the Linkboard project. The owner grants access.
- Resend: only needed to send real email (preview and production).
- Vercel: the Linkboard project, for deploys and environment variables.

## Environment variables
| Name | What it is | Where to get it | Needed in |
|---|---|---|---|
| `DATABASE_URL` | Neon connection string | Neon → the branch → Connect | dev, preview, production |
| `BETTER_AUTH_SECRET` | Signs sessions | `openssl rand -base64 32` | dev, preview, production |
| `BETTER_AUTH_URL` | The app's base URL | `http://localhost:3000` in dev | dev, preview, production |
| `RESEND_API_KEY` | Sends email | Resend → API keys | preview, production |
| `EMAIL_FROM` | Sender address | `Linkboard <hello@linkboard.example>` | preview, production |

## First run
1. `pnpm install`
2. Copy `.env.example` to `.env.local` and fill it in.
3. `pnpm db:migrate`
4. `pnpm dev`, then open http://localhost:3000. Sign-in links print in this terminal.
