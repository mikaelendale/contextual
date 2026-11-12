# Architecture

## Overview
A single-page React app served by Vite and running entirely in the browser. `src/main.jsx` mounts `<App>` with three seeded tasks. `src/App.jsx` holds the task list and the current filter in state, and passes data and handlers down to three components. There is no backend, no storage and no router.

## Parts
| Part | Where | What it does |
|---|---|---|
| Entry | `index.html`, `src/main.jsx` | Root element, mount, seed data |
| App shell | `src/App.jsx` | Task and filter state, all task handlers, page layout, focus after delete |
| Add form | `src/components/Form.jsx` | New-task input and Add button |
| Task row | `src/components/Todo.jsx` | Checkbox, Edit/Delete, inline rename form |
| Filter button | `src/components/FilterButton.jsx` | One All/Active/Completed toggle |
| Styles | `src/index.css` | Global resets and UI classes |

## How a request flows
Adding a task:
1. The person types in "What needs to be done?" — `src/components/Form.jsx` keeps the text in its `name` state.
2. Clicking Add submits the form. `handleSubmit` calls `props.addTask(name)` and clears the field.
3. `addTask` in `src/App.jsx` adds `{ id: "todo-" + nanoid(), name, completed: false }` to `tasks`.
4. `App` re-renders: the list filters `tasks` with `FILTER_MAP[filter]` and renders a `<Todo>` for each one, and the heading shows the new count.

## Data
In memory only, in `App`'s `tasks` state (`src/App.jsx`), which `foundation` owns: `{ id, name, completed }[]`. The seed data is in `src/main.jsx`. `filter` (`"All" | "Active" | "Completed"`) is also `App` state. Nothing survives a reload.

## Outside services
None.

## Boundaries
- Components in `src/components/` take data and callbacks through props and never change task state themselves. All state changes go through handlers in `src/App.jsx`.
- A component never imports another feature's component. Only `App.jsx` composes them.
- Styles live in `src/index.css`. Keep changes there small.

shared: src/index.css, public/**
