# Linkboard

## Idea
My team keeps losing good links in Slack threads. I want one place where anyone on the team can save a link with a note, group links into boards (like "Onboarding" or "Competitors"), and find them again later. Saving a link should feel as quick as saving a bookmark.

## Users
Small teams, 3 to 30 people, mostly product and engineering folks. Everyone on a team sees everything. People who aren't very technical should find it easy too.

## Platform
Web app. Desktop first, but it has to work on a phone. Maybe a browser extension later, not now.

## Stack
- Framework: Next.js (App Router) with TypeScript
- Database: Postgres on Neon, with Drizzle
- Auth: Better Auth, magic links only, no passwords
- Email: Resend
- UI: Tailwind CSS and shadcn/ui
- Hosting: Vercel

## Design direction
Calm and dense, like Linear or a good email client. White and light grey with one teal accent. No illustrations. Keyboard shortcuts for the common stuff.

## Phases
### Phase 1 — Accounts
- Auth: sign in with a magic link sent by email
  - acceptance: entering an email sends a sign-in link that works once and expires after 10 minutes
  - acceptance: signed-out visitors to the app are sent to the sign-in page
  - acceptance: signing out ends the session on this device
- Teams: create a team and invite people by email
  - acceptance: a new user names their team before seeing the app
  - acceptance: the owner can invite people by email, and an invite expires after 7 days
  - acceptance: accepting an invite adds the person to the team
  - acceptance: only the owner can remove members

### Phase 2 — Core product
- Links: save a link with a title and an optional note
  - acceptance: pasting a URL and pressing Save adds it to the top of the team's list
  - acceptance: an invalid URL shows an error and nothing is saved
  - acceptance: people can edit or delete their own links but not other people's
  - acceptance: saving a link the team already has shows the existing one instead
- Boards: group links into boards the whole team can see
  - acceptance: anyone on the team can create a board
  - acceptance: a link can go on more than one board
  - acceptance: a board page lists its links newest first
  - acceptance: deleting a board doesn't delete its links
- Link preview: show the page title, description and image for each link
  - acceptance: a saved link shows the page's title and image within 5 seconds
  - acceptance: if the page can't be fetched, the link still shows its URL and no broken image
  - acceptance: previews never slow down saving

### Phase 3 — Finding things
- Search: search links by title, URL and note
  - acceptance: results update as you type, from the second character
  - acceptance: matching ignores upper and lower case
  - acceptance: no results shows a message with the search term
- Weekly digest: email each member the links saved last week
  - acceptance: members get the digest on Monday morning
  - acceptance: weeks with no new links send nothing
  - acceptance: every digest has a one-click unsubscribe that works without signing in

## Open questions
- Link previews: fetch them when the link is saved, or in a background job?
- Do we need private boards at some point?
