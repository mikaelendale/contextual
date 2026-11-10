# Magic links over passwords
Date: 2026-09-12 · Scope: project

## Context
The plan asks for sign-in without passwords. The users are small teams who sign in rarely and mostly stay signed in.

## Decision
Email magic links only, through Better Auth's magic-link plugin. A link works once and expires after 10 minutes.

## Why not the alternatives
- Passwords: the plan rules them out, and they bring resets, strength rules and leaked-password risk.
- Google sign-in only: some teams don't use Google accounts.

## Revisit if
Teams ask for single sign-on, or sign-in emails start arriving late.
