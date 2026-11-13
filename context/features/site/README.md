# Site
status: shipped
phase: 1
covers: site/**
depends-on: foundation

## What it does
The website, contextual.mikaelen.site: the hero with the install command, how it works, the folder diagram, the "Done means checked" run, the agents it works with, and the install module. It's a Next.js app with its own `AGENTS.md`; the GitHub button shows the repo's numbers, read on the server about once an hour. It counts visits to the home page, once per browser per 30 minutes, as one number per day with nothing about the visitor, and the owner sees them on the reports page.

## Acceptance
- [x] `npm run build` in `site/` succeeds, and the home page is static and refreshed hourly
- [x] The folder diagram and the "Done means checked" window play once when in view, hold while pointed at, and replay
- [x] Nothing scrolls sideways at 390px, and the page has no console errors
- [x] The GitHub button shows the stars, and its card the other numbers
- [x] The home page counts a visit once per browser per 30 minutes, storing only the day, the page and a count; the feedback pages count nothing
- [x] The owner's reports page shows the home page's visits today, in the last 7 and 30 days, and in all
