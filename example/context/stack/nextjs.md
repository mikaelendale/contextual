# Next.js 16, App Router

## How it's wired here
- `src/app/` · routes. `(auth)/` holds sign-in, `app/` is the signed-in app, and `onboarding/` and `invite/` sit outside it.
- `src/proxy.ts` · sends signed-out visitors from `/app/**` to `/sign-in`. It's what Next 16 calls middleware now, and it runs on Node.js.
- Writes are server actions in each feature's `actions.ts`. Reads are in `queries.ts`, called from server components.

## Rules
- Pages and layouts are server components. Put "use client" only on the component that needs the browser.
- Every page and action that needs a user calls `requireSession()` first. The proxy only redirects.
- After a write, call `revalidatePath()` for the page that shows it.

## Gotchas
- 2026-09-30 · `params` is a promise in pages and layouts: `const { token } = await params`. (Found in teams, on `/invite/[token]`.)
- 2026-09-20 · `middleware.ts` is deprecated in Next 16 and renamed `proxy.ts`. It goes in `src/`, next to `app/`.

## Docs
- https://nextjs.org/docs/app/api-reference/file-conventions/proxy
- https://nextjs.org/docs/app/guides/upgrading/version-16
