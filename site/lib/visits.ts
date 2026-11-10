/*
 * Page visit counter with no database of our own.
 *
 * The count lives on Abacus (https://jasoncameron.dev/abacus/), a free,
 * open source counter service with no account or keys. Only our server talks
 * to it, so visitors' IP addresses are never sent there. To use another
 * service, change this file; nothing else needs to know.
 *
 * Abacus allows 30 requests per IP every 10 seconds. Every call comes from our
 * server, so that's the site's budget: about 3 visits a second. Beyond that,
 * or if the service is down, calls return null and the counter hides itself.
 */

const BASE = "https://abacus.jasoncameron.dev"

// Production's counter name comes from VISITS_NAMESPACE, so this public repo
// doesn't tell anyone which counter to inflate. Without it, production shows no
// counter. Development gets its own counter so testing never touches the real one.
const NAMESPACE =
  process.env.VISITS_NAMESPACE ??
  (process.env.NODE_ENV === "production" ? null : "mikaelendale-contextual-dev")
const KEY = "visits"

async function call(action: "hit" | "get"): Promise<number | null> {
  if (!NAMESPACE) return null
  try {
    const res = await fetch(`${BASE}/${action}/${NAMESPACE}/${KEY}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    })
    // A counter that has never been hit doesn't exist yet: that's zero visits.
    if (action === "get" && res.status === 404) return 0
    if (!res.ok) return null
    const data = (await res.json()) as { value?: unknown }
    return typeof data.value === "number" ? data.value : null
  } catch {
    return null
  }
}

// Reads are cached briefly per server instance, so repeat views stay cheap.
const READ_TTL_MS = 10_000
let lastRead: { value: number; at: number } | null = null

/** Count one visit; returns the new total, or null if the counter is unavailable. */
export async function countVisit(): Promise<number | null> {
  const value = await call("hit")
  if (value !== null) lastRead = { value, at: Date.now() }
  return value
}

/** The current total without counting a visit, or null if unavailable. */
export async function readVisits(): Promise<number | null> {
  if (lastRead && Date.now() - lastRead.at < READ_TTL_MS) return lastRead.value
  const value = await call("get")
  if (value !== null) lastRead = { value, at: Date.now() }
  return value
}
