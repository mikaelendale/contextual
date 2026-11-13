# Add task
status: shipped
phase: 1
covers: src/components/Form.jsx
depends-on: foundation

## What it does
Lets a person type a task name under "What needs to be done?" and click Add to put it at the end of the list. The new task starts not done, gets an ID `todo-<nanoid>`, and the field clears. The form is `src/components/Form.jsx`. The handler is `addTask` in `src/App.jsx`.

## Acceptance
- [x] Typing a name and clicking Add (or pressing Enter) adds an unchecked task at the end of the list (found in the code, not verified)
- [x] The input clears after a task is added (found in the code, not verified)
- [x] The "N tasks remaining" count goes up by one (found in the code, not verified)
