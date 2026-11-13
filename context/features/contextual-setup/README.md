# Contextual setup
status: shipped
phase: 1
covers: skills/contextual-setup/**, docs/skills/contextual-setup.md
depends-on: foundation, templates, init, check

## What it does
"set up contextual" writes a project's context the first time: from `contextual-plan.md`, from five questions when the repo is empty, or from the existing code, always with `foundation` first. On existing code it proposes the features and waits for the owner before writing.

## Acceptance
- [x] From a plan file, it writes the context with `foundation` first, and `check` passes with 0 errors
- [x] With no plan and no code, it asks its questions, writes the plan, waits for confirmation, then writes the context
- [x] With existing code, it proposes a feature split, waits, then writes the features as shipped with unverified lines marked
