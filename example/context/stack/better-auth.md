# Better Auth, with magic links

## How it's wired here
- `src/lib/auth.ts` · server config: `drizzleAdapter(db, { provider: "pg" })`, the `magicLink` plugin with `expiresIn: 600` (links last 10 minutes), then `nextCookies()`.
- `src/lib/auth-client.ts` · the browser client, with `magicLinkClient()`.
- `src/app/api/auth/[...all]/route.ts` · `toNextJsHandler(auth)`.
- `src/features/auth/session.ts` · `requireSession()`: calls `auth.api.getSession({ headers: await headers() })`, and redirects to `/sign-in` when there is no session.
- `src/proxy.ts` · uses `getSessionCookie()` to redirect signed-out visitors.

## Rules
- Get the user from `requireSession()` only. Never trust a user id sent from the browser.
- After changing plugins, run `pnpm auth:generate` to update `src/db/auth-schema.ts`, then `pnpm db:generate` for the migration.
- Keep `nextCookies()` last in the plugins list.

## Gotchas
- 2026-09-20 · Without `nextCookies()` last in the plugins list, signing in from a server action doesn't set the session cookie.
- 2026-09-20 · `getSessionCookie()` only shows that a cookie exists, not that the session is still valid. Pages and actions must call `requireSession()`.

## Docs
- https://www.better-auth.com/docs/integrations/next
- https://www.better-auth.com/docs/plugins/magic-link
- https://www.better-auth.com/docs/adapters/drizzle
