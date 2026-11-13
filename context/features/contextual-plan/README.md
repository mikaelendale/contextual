# Contextual plan
status: shipped
phase: 1
covers: skills/contextual-plan/**, docs/skills/contextual-plan.md, docs/plan-file.md
depends-on: foundation, templates

## What it does
Plans a project in any AI chat, before there's a repo: it asks at most five questions, proposes a stack and a design direction, and writes `contextual-plan.md`. It's a chat skill and a plain copy-paste prompt, and `docs/plan-file.md` defines the format they write.

## Acceptance
- [x] The copy-paste prompt, pasted into a chat, gives a valid `contextual-plan.md`
- [x] The chat skill asks at most five questions and writes a valid `contextual-plan.md`
