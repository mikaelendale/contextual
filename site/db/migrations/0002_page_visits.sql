-- Page visits: how many times each counted page was opened on each day (UTC).
-- Nothing about the visitor: no IP addresses, no browser details, no referrer.
-- A browser counts at most once per 30-minute session; see site/lib/visits/visits.ts.
-- Run once, after 0001: psql "$DATABASE_URL" -f site/db/migrations/0002_page_visits.sql

create table if not exists page_visits (
  day     date    not null default current_date,
  path    text    not null check (char_length(path) between 1 and 64),
  visits  integer not null default 0 check (visits >= 0),
  primary key (day, path)
);
