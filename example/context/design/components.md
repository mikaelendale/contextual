# Components

Check here before building a new component, and add a row when you do.

| Component | Where | Use for | Don't use for |
|---|---|---|---|
| `Button` | `src/components/ui/button.tsx` | Actions. Variants: primary (one per screen), secondary, ghost, destructive | Navigation; use a link |
| `Input`, `Textarea` | `src/components/ui/` | Text entry, always with a label and room for an error line | |
| `Dialog` | `src/components/ui/dialog.tsx` | Short tasks, and confirming destructive actions | Long forms; use a page |
| `DropdownMenu` | `src/components/ui/dropdown-menu.tsx` | ⋯ menus, and multi-select with checkbox items | Primary actions |
| `Toast` | `src/components/ui/sonner.tsx` | Confirming a finished action ("Link saved") | Errors the person has to fix; show those next to the field |
| `EmptyState` | `src/components/empty-state.tsx` | Any list with nothing in it: a title, one sentence, one action | Errors |
| `Skeleton` | `src/components/ui/skeleton.tsx` | Loading rows, the same height as real rows | Whole-page spinners |
| `LinkRow` | `src/features/links/components/link-row.tsx` | Showing a link anywhere. Other features add menu items through its `menuSlot` prop | |
| `Avatar` | `src/components/ui/avatar.tsx` | Members, and "saved by" on a link | |
