# A join table for board links, over a board column on links
Date: 2026-11-03 · Scope: boards

## Context
The plan says a link can go on more than one board.

## Decision
A `board_links` table (board_id, link_id), with both foreign keys `on delete cascade`.

## Why not the alternatives
- A `board_id` column on `links`: one board per link, which the plan rules out.
- An array of board ids on `links`: no foreign keys, so deleting a board would leave stale ids behind.

## Revisit if
Boards need their own order for links. Then add a `position` column to `board_links`.
