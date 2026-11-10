# Links
status: shipped
phase: 2
covers: src/features/links/**, src/app/app/links/**, e2e/links.spec.ts
depends-on: auth, teams

## What it does
Anyone on the team can save a link with a title and an optional note. The team's links show newest first, and saving a URL the team already has shows the existing link instead.

## Acceptance
- [x] Pasting a URL and pressing Save adds it to the top of the team's list.
- [x] An invalid URL shows an error under the field and nothing is saved.
- [x] People can edit or delete their own links, but not other people's.
- [x] Saving a URL the team already has shows the existing link instead.
