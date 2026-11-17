# Open questions get their own file
Date: 2026-11-17 · Scope: templates, contextual-setup, contextual-next

## Context
Setup put every open question in "Blocked / needs a human" in `status/main.md`. On a 27-feature plan that took 19 of the status file's 40 lines before any work began (agent feedback report 7), and some were technical choices an agent could make.

## Decision
`context/questions.md` holds every open question, one line each, under "For the owner" or "Proposed by the agent", ending with the feature it blocks. The agent makes technical choices itself, records them in `decisions/`, and lists them so the owner can overrule them. The status file lists only what blocks the next feature.

## Why not the alternatives
- Raising the status file's cap: it would stop being a quick read of where the work stands.
- Questions in each feature's `notes.md`: a question that blocks nothing yet has no feature, and the owner would have to open every folder to find them.

## Revisit if
Owners miss questions that aren't in the status file.
