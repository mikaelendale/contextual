# Build — Teams

## Files
- `src/features/teams/schema.ts` · `teams`, `members`, `invites`.
- `src/features/teams/actions.ts` · `createTeam`, `inviteMember`, `acceptInvite`, `removeMember`.
- `src/features/teams/queries.ts` · `getTeamForUser`, `getMembers`, `getPendingInvites`.
- `src/features/teams/invite-token.ts` · makes invite tokens and hashes them for storage.
- `src/features/teams/emails/invite.tsx` · the invite email (React Email).
- `src/features/teams/components/invite-form.tsx`, `member-list.tsx`
- `src/app/onboarding/page.tsx` · "Name your team", for new users.
- `src/app/invite/[token]/page.tsx` · accepts an invite.
- `src/app/app/settings/team/page.tsx` · members and pending invites.

## Data
- `teams` (id, name, created_at)
- `members` (team_id, user_id, role `owner` or `member`, joined_at). Primary key (team_id, user_id).
- `invites` (id, team_id, email, token_hash, expires_at, accepted_at)

Migration `drizzle/0002_teams.sql`.

## Routes and actions
- `/onboarding` · name the team. New users only; everyone else is sent to `/app`.
- `/invite/[token]` · accept an invite. Works signed out: sign in first, then it accepts.
- `/app/settings/team` · members, invites, and Remove (owner only).

## Components
`Input`, `Button`, `Dialog` (confirm removing a member), `Toast` ("Invite sent"), `EmptyState` (no pending invites), `Avatar`.

## Follows
- `stack/drizzle.md`
- `stack/nextjs.md` (`params` is a promise)
- `design/layouts.md` → Settings page, Auth page
