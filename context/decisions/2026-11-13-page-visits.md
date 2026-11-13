# Page visits: a count per page per day, once per browser session
Date: 2026-11-13 · Scope: site

## Context
The owner asked for the site's page visits in its new database, next to agent feedback. The public counter that showed a total on the home page had been removed on request a day earlier, and the site promises to store no IP addresses.

## Decision
The home page's beacon posts its path once per browser per 30-minute session, remembered in localStorage as one timestamp. The server accepts only same-origin posts for known paths, allows 10 per address per 30 minutes using the in-memory hash the feedback form already uses, and adds one to that day's row for the page. The totals show only on the owner's reports page.

## Why not the alternatives
- A row per visit, or an analytics service: more data about visitors than a count needs, and another party that sees them.
- Counting only on the server, by address: undercounts people sharing an address, and the memory is per server instance.
- Back on the public page: the owner removed the public counter; it's one component away if they want it again.

## Revisit if
The owner wants more than counts, such as which pages people come from, or the counter back on the page.
