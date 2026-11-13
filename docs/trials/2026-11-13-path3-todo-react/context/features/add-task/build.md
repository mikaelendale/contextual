# Build — Add task

## Files
- `src/components/Form.jsx` · the add form: label, `#new-todo-input`, Add button. Keeps the typed text in local `name` state.
- `src/App.jsx` (foundation) · `addTask(name)` adds `{ id: "todo-" + nanoid(), name, completed: false }` to `tasks`

## Data
Adds a row to `tasks` in `App` state. Nothing is saved.

## Routes and actions
None. Form submit → `props.addTask(name)`.

## Components
`Form`. It uses the shared classes `.btn`, `.btn__primary`, `.btn__lg`, `.input__lg`, `.label__lg` and `.label-wrapper`.

## Follows
- [design/principles.md](../../design/principles.md), [conventions.md](../../conventions.md)
