# Build — Manage tasks

## Files
- `src/components/Todo.jsx` · one task row: view template (checkbox, label, Edit/Delete) and editing template (rename input, Cancel/Save). Local `isEditing` and `newName` state, its own `usePrevious`, and focus handling between the edit field and the Edit button.
- `src/App.jsx` (foundation) · `toggleTaskCompleted(id)`, `editTask(id, newName)`, `deleteTask(id)`. Focuses `#list-heading` when `tasks.length` shrinks.

## Data
Updates and removes rows in `tasks` in `App` state. Nothing is saved.

## Routes and actions
None. Props: `id`, `name`, `completed`, `toggleTaskCompleted`, `editTask`, `deleteTask`.

## Components
`Todo`. It uses the shared classes `.btn`, `.btn__primary`, `.btn__danger`, `.btn-group`, `.stack-small`, `.c-cb`, `.todo`, `.todo-text`, `.todo-label` and `.visually-hidden`.

## Follows
- [design/principles.md](../../design/principles.md), [conventions.md](../../conventions.md)
