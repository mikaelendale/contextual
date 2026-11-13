/*
 * Page visits in the site's database (see ../db.ts): one row per page per
 * day (UTC) with a count. The table is created by
 * site/db/migrations/0002_page_visits.sql.
 */

import { database } from "../db.ts"
import type { CountedPath, VisitStore } from "./visits.ts"

/** The store the visits route writes to, or null when DATABASE_URL isn't set. */
export function getVisitStore(): VisitStore | null {
  const sql = database()
  if (!sql) return null
  return {
    async add(path) {
      await sql`
        insert into page_visits (day, path, visits) values (current_date, ${path}, 1)
        on conflict (day, path) do update set visits = page_visits.visits + 1`
    },
  }
}

export type VisitTotals = { today: number; week: number; month: number; all: number; since: string | null }

/** Visits to one page: today, the last 7 and 30 days (today included), and since counting began. */
export async function visitTotals(path: CountedPath = "/"): Promise<VisitTotals | null> {
  const sql = database()
  if (!sql) return null
  const rows = await sql`
    select
      coalesce(sum(visits) filter (where day = current_date), 0)::bigint as today,
      coalesce(sum(visits) filter (where day > current_date - 7), 0)::bigint as week,
      coalesce(sum(visits) filter (where day > current_date - 30), 0)::bigint as month,
      coalesce(sum(visits), 0)::bigint as all_time,
      min(day)::text as since
    from page_visits
    where path = ${path}`
  const row = rows[0] ?? {}
  return {
    today: Number(row.today ?? 0),
    week: Number(row.week ?? 0),
    month: Number(row.month ?? 0),
    all: Number(row.all_time ?? 0),
    since: typeof row.since === "string" ? row.since : null,
  }
}
