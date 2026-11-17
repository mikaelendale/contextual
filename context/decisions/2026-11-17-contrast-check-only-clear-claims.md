# The contrast check verifies only claims it can read for sure
Date: 2026-11-17 · Scope: check

## Context
`principles.md` states contrast ratios in free text, and agents could write numbers no one measured (agent feedback report 9). The first version of the check read this repo's own table and flagged two right claims: one about another color written in a row's text, and a row saying "never text".

## Decision
`check` recomputes a ratio only when both colors are clear: "N:1 on <token>", "<color> text on it: N:1", or a bare "N:1" against the background. A claim that names another color as its subject is skipped. The 4.5:1 minimum applies only to rows that are for text and don't say otherwise. Agents compute ratios with `usecontextual contrast`.

## Why not the alternatives
- Requiring a strict table format: older projects' tables would all fail.
- Guessing the subject: false alarms teach agents to ignore the warning.

## Revisit if
Real tables keep escaping the check.
