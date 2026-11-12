# TodoMatic

## Idea
Written at setup from the existing code and README, and confirmed by the owner.
TodoMatic is the sample todo app from MDN's React tutorial ("Understanding client-side JavaScript frameworks: React tutorials"). This is a local copy for trying things out. It won't be deployed anywhere. On one page you can add tasks, tick them off, rename or delete them, and filter the list.

## Users
The owner, trying things out locally. One person, technical.

## Platform
Web, in a desktop or mobile browser. It runs locally with the Vite dev server. No offline or storage requirements.

## Stack
- Language: JavaScript with JSX
- UI: React 18
- Build: Vite 5
- IDs: nanoid
- Styling: one global CSS file
- Lint: ESLint 8
- Package manager: Yarn
- Storage: none, tasks live in memory
- Tests: none
- Hosting: none, local only

## Design direction
Keep MDN's plain, accessible look: a white card on a light grey page, Arial, thick-bordered buttons, large touch targets, and visible dashed focus outlines.

## Phases
### Phase 1 — What's built
The app as it exists at setup.
- Foundation: the app shell, seed data, state and config
  - acceptance: `yarn install && yarn dev` opens TodoMatic with three seeded tasks
- Add task: type a name and click Add to add a task
  - acceptance: a new unchecked task appears at the end of the list and the input clears
- Manage tasks: tick off, rename or delete a task
  - acceptance: ticking, renaming and deleting each update the list, and focus moves to a sensible place
- Filter tasks: show All, Active or Completed tasks
  - acceptance: each filter shows the matching tasks and only its button is pressed

## Open questions
- Should empty task names be blocked when adding or renaming?
- Should "N tasks remaining" count unfinished tasks rather than the visible ones?
- Should tasks be saved across reloads?
- Remove or change MDN's GitHub Pages deploy setup, since this copy isn't deployed?
- Fix the README's `yarn start` / Create React App instructions?
- Add automated tests?
