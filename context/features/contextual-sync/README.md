# Contextual sync
status: shipped
phase: 1
covers: skills/contextual-sync/**, docs/skills/contextual-sync.md
depends-on: foundation, templates, check

## What it does
"sync the context" brings the context back in line after code changed without it: hand edits, merges and other agents' work. It finds what changed since the last sync, logs it in the right features, finishes merged features and stores the new last sync.

## Acceptance
- [x] After a merge and hand edits, it logs the changes, updates statuses, flags files no feature owns, stores the last sync, and `check` passes
