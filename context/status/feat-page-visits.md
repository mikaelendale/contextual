# Status — feat-page-visits
Updated: 2026-11-13 · by: claude-code

## Current focus
site: page visits in the database, shown on the owner's reports page.

## Last session
- The home page counts a visit once per browser per 30 minutes; one row per page per day, nothing about visitors. The feedback pages count nothing.
- `0002_page_visits.sql` has run on the site's Neon database.
- The reports page shows today, the last 7 and 30 days, and all time.
- The database connection and the rate limit are shared modules now.
- Reports are kept for at least 30 days (docs/agent-feedback.md, docs/maintaining.md).

## In progress
Nothing.

## Blocked / needs a human
- Review and merge.
- The live site still deploys from the old teaser repo, so visits count only once it deploys from here.

## Next
Merge, then point the live site at this repo (docs/maintaining.md).
