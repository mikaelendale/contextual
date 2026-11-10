# Weekly digest
status: planned
phase: 3
covers: src/features/weekly-digest/**, src/app/api/cron/weekly-digest/**
depends-on: links, teams

## What it does
Every Monday, each member gets an email with the links saved the week before. Weeks with no new links send nothing.

## Acceptance
- [ ] Members get the digest on Monday morning.
- [ ] Weeks with no new links send nothing.
- [ ] Every digest has a one-click unsubscribe that works without signing in.
