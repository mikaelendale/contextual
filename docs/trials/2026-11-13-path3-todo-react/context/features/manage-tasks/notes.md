# Notes — Manage tasks

## Gotchas
- 2026-11-13 · Renaming accepts an empty name, and the rename input starts empty rather than holding the current name. The code comment says this was left as an exercise.
- 2026-11-13 · The checkbox uses `defaultChecked` (uncontrolled), so it could drift from `completed` if a task's state changes some other way.
- 2026-11-13 · The rename input reuses the task `id` as its DOM id, the same id as the checkbox in view mode. Only one renders at a time, so this works today.

## Open questions
- 2026-11-13 · Should renaming to an empty name be blocked, and should the field start with the current name?
