# Saturday Run Sign-ups

## Idea
A sign-up sheet for our running club's Saturday runs. Members say which run they're coming to and which pace group. Run leaders can see how many people to expect and who's coming, so nobody gets left behind.

## Users
About 40 club members, from students to retirees, with mixed comfort with technology. Two run leaders need to see attendance and numbers for each pace group.

## Platform
Web, designed mainly for phones and also usable on a computer. An internet connection is required; offline use isn't needed. Members sign in with their email and can see who's coming. No payments.

## Stack
- Interface: Plain HTML, CSS, and JavaScript — this small app needs no framework or build step.
- Authentication: Supabase Auth with an emailed sign-in code — members use their email without remembering another password; see [email sign-in documentation](https://supabase.com/docs/guides/auth/auth-email-passwordless).
- Data: Supabase PostgreSQL — shared runs and attendance must stay available across members' devices.
- Access control: Supabase database access rules — signed-in members can read attendance and change their own sign-ups; see [access documentation](https://supabase.com/docs/guides/auth).
- Hosting: Cloudflare Pages — serves the plain web files with little setup; see [hosting overview](https://cf-assets.www.cloudflare.com/slt3lc6tev37/64gRXDfoKR7FBFW6ApK9D/8ef21be4a6a8e4ba9bb8352b661c682e/Pages_one-pager.pdf).
- Email delivery: Not decided — choose a sender for reliable sign-in emails before launch.

## Design direction
Friendly and uncluttered, with large readable text, clear buttons, and one accent color: forest green. Aim for the straightforward forms of Google Forms and the readable event lists of Google Calendar, because members have mixed comfort with technology.

## Phases
### Phase 1 — Sign up for Saturday
Deliver the complete sign-up flow in one phase, because members and leaders need shared attendance before the app is useful.

- Email sign-in: Let members sign in using a code sent to their email.
  - acceptance: Entering a valid emailed code opens the signed-in run list.
  - acceptance: An incorrect or expired code shows a readable error and a way to request another.
  - acceptance: After signing out, attendance is no longer visible.
- Run setup: Provide a way to enter Saturday runs and their available pace groups.
  - acceptance: A saved run appears with its date, identifying name, and available pace groups.
  - acceptance: A saved run remains available after refreshing the page.
- Run selection: Let members choose which Saturday run to join.
  - acceptance: Upcoming runs appear in date order, earliest first.
  - acceptance: Selecting a run opens its details and pace choices.
  - acceptance: When there are no upcoming runs, the page says so.
- Pace sign-up: Record a member's attendance in one pace group for a run.
  - acceptance: A member can select a listed pace group and confirm attendance.
  - acceptance: After refreshing, the member still sees their saved run and pace choice.
  - acceptance: Submitting again does not create a duplicate attendance entry.
- Attendance view: Show signed-in members who's coming and the numbers leaders need.
  - acceptance: Each run shows attendees grouped by pace, with a count for each group and a total.
  - acceptance: A second signed-in member can see a saved sign-up after refreshing.
  - acceptance: A group with no attendees shows a count of zero.

## Open questions
- Who may create or edit runs: only the two leaders, or all members?
- What information identifies each run: date and name, start time, meeting place, or something else?
- What pace groups should be offered, and are paces measured per kilometre or per mile?
- How should attendees be identified: a name they enter, their email, or something else?
- Can anyone join using their email, or should access be limited to club members?
- Which email sender and sender address should deliver sign-in codes?
- Suggested addition: let members change pace groups or withdraw when their plans change.
