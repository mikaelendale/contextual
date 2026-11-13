# Contextual next
status: shipped
phase: 1
covers: skills/contextual-next/**, docs/skills/contextual-next.md
depends-on: foundation, templates, check, commit-hook

## What it does
"build the next feature" builds one planned feature on its own `feat/<feature>` branch: it reads the context, builds, checks every screen it changed against the design checklist, records the work, commits and stops for review.

## Acceptance
- [x] It builds one planned feature on its own branch, records it and commits, then stops for review
- [x] A UI task ends with a `Deslop:` result in the log that says how the screens were checked
