# Saturday Runs

## Idea
A sign-up sheet for my running club's Saturday runs. Members say which run they're coming to and which pace group, so the run leaders know how many people to expect and nobody gets left behind.

## Users
- About 40 members, mixed comfort with tech, from students to retirees.
- Two run leaders.
- Everyone can see who's coming to a run.

## Platform
- Web, used mostly on phones.
- Doesn't need to work offline.
- Members sign in with their email. No payments.

## Stack
- Framework: Next.js (current version, App Router), because it's widely used and one project holds the pages and the server code
- Language: TypeScript
- Database: Supabase Postgres, because sign-ups are shared between everyone and must live on a server
- Sign-in: Supabase Auth with email magic links, because members just type their email and tap the link, with no password to forget
- Styling: Tailwind CSS
- Hosting: Vercel for the app, Supabase's free tier for the database and sign-in, both enough for a 40-person club

## Design direction
- Calm, friendly and very plain: big text, big buttons, one thing per screen, nothing to learn.
- Readable outdoors on a phone in sunlight: high contrast, light background, at least 16px text, tap targets at least 44px.
- Accent color: a bright running orange (#F26B1D), used only for the main button and "you're signed up" states.
- Plain words everywhere: "I'm coming", "Change my group", "Who's coming".
- Should feel like a Doodle poll or the RSVP page of a Meetup event, not like a sports-tracking app.

## Phases

### Phase 1 — Sign up for Saturday
- Email sign-in: members sign in with their email using a one-tap link, and stay signed in on their phone
  - acceptance: entering an email sends a sign-in link, and tapping it opens the app signed in
  - acceptance: a member who signed in last week opens the app and is still signed in
  - acceptance: the first time they sign in, a member is asked for the name others will see, and can't continue without one
- Run leaders: the two run leaders can do things members can't
  - acceptance: a leader sees a "New run" button; a member doesn't
  - acceptance: a member who opens a leader-only page is sent back to the run list
- New run: a leader adds a run with its date, start time, meeting place, route and pace groups
  - acceptance: a leader can add a run with a date, time, meeting place, a short route description and one or more pace groups (for example "9:00/mile", "10:30/mile")
  - acceptance: a run without a date, time or at least one pace group can't be saved, and the missing field is pointed out
- Run list: members see the upcoming runs, soonest first
  - acceptance: after signing in, members see upcoming runs with date, time and meeting place, soonest first
  - acceptance: runs whose date has passed no longer show in the list
  - acceptance: each run shows how many people are coming
- Sign up: a member picks a run and a pace group and says "I'm coming"
  - acceptance: from a run's page, a member picks a pace group and taps "I'm coming" in no more than two taps
  - acceptance: after signing up, the run shows "You're coming — <pace group>" in the accent color
  - acceptance: a member can be signed up to a run only once
- Who's coming: everyone sees who's coming to a run, grouped by pace group
  - acceptance: a run's page lists the names of everyone coming, under their pace group, with a count per group and a total
  - acceptance: a new sign-up appears on the list for anyone who reloads the page

### Phase 2 — Changes and the leader's view
- Change sign-up: members switch pace group or say they're no longer coming
  - acceptance: a signed-up member can move to a different pace group and the counts update
  - acceptance: a signed-up member can tap "I can't come" and their name leaves the list
- Edit run: a leader changes or cancels a run
  - acceptance: a leader can change a run's time, meeting place, route or pace groups
  - acceptance: a cancelled run shows "Cancelled" to everyone and can't be signed up to
- Leader view: a leader sees the numbers they need before the run starts
  - acceptance: a leader's view of a run shows each pace group's count and names on one phone screen, without scrolling for up to 40 people
- Leader setup: say who the run leaders are
  - acceptance: an existing leader can make another member a leader or remove leader rights, and the change shows the next time that person opens the app

## Open questions
- Who sets the pace groups: are they the same every Saturday, or chosen per run?
- Is there ever more than one run on a Saturday (for example a short and a long route)? The plan allows it.
- Should there be a sign-up cut-off, for example Friday evening?
- "Nobody gets left behind": would leaders like a check-in list on the morning, to tick off who actually turned up?
- Should members get a reminder email (for example Friday) about the run they signed up for?
- Should a pace group have a leader or a maximum number of runners?
- Who can join: anyone with the link, or only emails the leaders have added?
- A name for the app, if not "Saturday Runs".
