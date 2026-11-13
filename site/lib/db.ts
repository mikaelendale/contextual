/*
 * The site's database, on Neon. The connection string comes only from the
 * DATABASE_URL environment variable; nothing about the database is in the
 * repo. The tables come from site/db/migrations/, applied in order.
 */

import { neon } from "@neondatabase/serverless"

/** A query function for the database, or null when DATABASE_URL isn't set. */
export function database() {
  const url = process.env.DATABASE_URL
  return url ? neon(url) : null
}
