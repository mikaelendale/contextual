# Filter tasks
status: shipped
phase: 1
covers: src/components/FilterButton.jsx
depends-on: foundation

## What it does
Lets a person show All, Active or Completed tasks using three toggle buttons above the list. The pressed button has `aria-pressed="true"` and is underlined. The heading above the list reads "N tasks remaining". The button is `src/components/FilterButton.jsx`. `FILTER_MAP` and the `filter` state live in `src/App.jsx`.

## Acceptance
- [x] All shows every task, Active only unticked ones, Completed only ticked ones (found in the code, not verified)
- [x] Only the selected filter button is pressed (`aria-pressed="true"`, underlined) (found in the code, not verified)
- [x] Screen readers hear "Show <filter> tasks" on each button (found in the code, not verified)
