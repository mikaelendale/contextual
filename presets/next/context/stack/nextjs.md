# Next.js, App Router

## How it's wired here
- `src/app/` · routes: each folder is a URL segment; `page.tsx` renders it, `layout.tsx` wraps it.
- `src/app/layout.tsx` · the root layout. Owned by `foundation`.
- `next.config.ts` · framework config. Owned by `foundation`.
<!-- fill: the route groups and layouts this app adds, one line each. -->

## Rules
- Server components by default. Add `"use client"` only to the component that needs state or browser APIs, as low in the tree as it can go.
- Change data in server actions or route handlers, and validate every input at the top.
- Read the docs that ship with the installed version (`node_modules/next/dist/docs/` when present) before using an API you haven't used in this repo. Next.js changes between majors.
- Every route that loads data has `loading.tsx` or a skeleton, and an `error.tsx` above it.

## Gotchas
<!-- fill: what broke or surprised us, newest first: date · what happened · what to do instead. -->

## Docs
- https://nextjs.org/docs
