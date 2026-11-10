# Boards
status: in-progress
phase: 2
covers: src/features/boards/**, src/app/app/boards/**, e2e/boards.spec.ts
depends-on: auth, links

## What it does
Boards group a team's links by topic, and everyone on the team can see every board. A link can be on several boards, and deleting a board never deletes links.

## Acceptance
- [x] Anyone on the team can create a board with a name.
- [x] A link can be added to more than one board, from the link's menu.
- [ ] A board page lists its links newest first, with an empty state when it has none.
- [ ] Deleting a board keeps its links in the team's list.
