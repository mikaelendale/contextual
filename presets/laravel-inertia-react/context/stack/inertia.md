# Inertia and React

## How it's wired here
- `resources/js/app.tsx` · boots Inertia and resolves pages from `resources/js/pages/`. Owned by `foundation`.
- `resources/js/pages/` · one React component per page; a controller returns `Inertia::render('<path>', $props)`.
- `resources/js/layouts/` · the app shell. Owned by `foundation`.
- `resources/js/components/ui/` · UI building blocks, on the `shared:` line.
<!-- fill: shared props (`HandleInertiaRequests`), and any generated route helpers, one line each. -->

## Rules
- Pass a page only the props it shows. Never pass whole models with hidden fields.
- Forms use Inertia's form helper, so validation errors arrive per field.
- Links between pages use Inertia's `<Link>`, so navigation keeps the app shell.

## Gotchas
<!-- fill: what broke or surprised us, newest first: date · what happened · what to do instead. -->

## Docs
- https://inertiajs.com
- https://react.dev
