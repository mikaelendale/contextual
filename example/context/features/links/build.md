# Build — Links

## Files
- `src/features/links/schema.ts` · `links`.
- `src/features/links/actions.ts` · `saveLink`, `updateLink`, `deleteLink`.
- `src/features/links/queries.ts` · `getLinks(teamId)`, newest first.
- `src/features/links/normalize.ts` · `normalizeUrl()`, used for the duplicate check.
- `src/features/links/components/save-link-form.tsx` · URL, title and note.
- `src/features/links/components/link-row.tsx` · one link in any list. Other features add menu items through its `menuSlot` prop.
- `src/features/links/components/edit-link-dialog.tsx`
- `src/app/app/links/page.tsx` · the team's links. It's also the app's home: `/app` redirects here.

## Data
`links` (id, team_id, url, url_normalized, title, note, created_by, created_at), with a unique index on (team_id, url_normalized). Migration `drizzle/0003_links.sql`.

## Routes and actions
- `/app/links` · the list, with "Save link" as the primary action.
- `saveLink(url, title, note)`, `updateLink(id, title, note)`, `deleteLink(id)`. Editing and deleting check `created_by`.

## Components
`Input`, `Textarea`, `Button`, `Dialog` (edit, confirm delete), `DropdownMenu` (the ⋯ menu), `Toast` ("Link saved"), `EmptyState`, `Skeleton`, `Avatar` ("saved by").

## Follows
- `stack/drizzle.md` (catching `23505`)
- `design/layouts.md` → List page
- `design/components.md` → LinkRow
