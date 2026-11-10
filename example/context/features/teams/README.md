# Teams
status: shipped
phase: 1
covers: src/features/teams/**, src/app/onboarding/**, src/app/invite/**, src/app/app/settings/team/**, e2e/teams.spec.ts
depends-on: auth

## What it does
Everyone belongs to one team, and everyone on a team sees the same links and boards. The first person names the team; others join through an email invite.

## Acceptance
- [x] A new user names their team before seeing the app.
- [x] The owner can invite people by email, and an invite expires after 7 days.
- [x] Accepting an invite adds the person to the team and opens `/app`.
- [x] Only the owner can remove members.
