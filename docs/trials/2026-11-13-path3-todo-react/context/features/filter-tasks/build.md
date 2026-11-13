# Build — Filter tasks

## Files
- `src/components/FilterButton.jsx` · one toggle button. Props: `name`, `isPressed`, `setFilter`.
- `src/App.jsx` (foundation) · `FILTER_MAP` (All / Active / Completed predicates), `FILTER_NAMES`, `filter` state (default "All"), and the "N tasks remaining" heading text.

## Data
`filter` in `App` state. Nothing is saved, so the filter resets to All on reload.

## Routes and actions
None. Click → `props.setFilter(name)`.

## Components
`FilterButton`. It uses the shared classes `.btn`, `.toggle-btn`, `.btn-group` and `.visually-hidden`.

## Follows
- [design/principles.md](../../design/principles.md), [conventions.md](../../conventions.md)
