# Manage tasks
status: shipped
phase: 1
covers: src/components/Todo.jsx
depends-on: foundation

## What it does
Lets a person mark each task done or not done, rename it inline, or delete it. Each row is a `Todo` (`src/components/Todo.jsx`). Its handlers `toggleTaskCompleted`, `editTask` and `deleteTask` live in `src/App.jsx`. Focus moves on purpose so keyboard and screen-reader users don't get lost.

## Acceptance
- [x] Clicking a task's checkbox toggles it between done and not done (found in the code, not verified)
- [x] Edit swaps the row for a rename form with focus in the input; Save renames the task, Cancel keeps the old name, and both return focus to the Edit button (found in the code, not verified)
- [x] Delete removes the task and moves focus to the "N tasks remaining" heading (found in the code, not verified)
- [x] Buttons carry visually hidden text naming the task, such as "Delete Eat" (found in the code, not verified)
