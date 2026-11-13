/*
 * Page visits: how many times each counted page was opened per day, and
 * nothing else. No addresses, no browser details, no referrer, nothing per
 * visitor. A browser counts at most once per 30-minute session (the beacon
 * remembers when it was last here), and the server takes only a few counts
 * from one address in that time, keyed by a hash that lives only in memory.
 * Kept apart from the route so it can be tested without a database.
 */

import type { Limiter } from "../rate-limit.ts"

/** The pages that count visits. The feedback pages aren't among them: opening the form saves nothing. */
export const COUNTED_PATHS = ["/"] as const
export type CountedPath = (typeof COUNTED_PATHS)[number]

/** A visit is a session: a browser counts again only after this long away. */
export const SESSION_MS = 30 * 60 * 1000
/** From one address, at most this many counts per session: room for a household or an office, not for a script. */
export const PER_VISITOR = { max: 10, windowMs: SESSION_MS }

const BODY_CAP = 200

export type VisitStore = { add(path: CountedPath): Promise<void> }

const reply = (status: number) => new Response(null, { status, headers: { "cache-control": "no-store" } })

export async function handleVisit(
  request: Request,
  { store, limiter, visitor }: { store: VisitStore | null; limiter: Limiter; visitor: string },
): Promise<Response> {
  // Only the site's own pages count. Browsers mark their same-origin requests;
  // a request without that mark, from another site or a script, counts nothing.
  if (request.headers.get("sec-fetch-site") !== "same-origin") return reply(403)

  if (Number(request.headers.get("content-length") ?? 0) > BODY_CAP) return reply(413)
  const text = await request.text()
  if (text.length > BODY_CAP) return reply(413)

  let path: unknown
  try {
    path = (JSON.parse(text) as { path?: unknown } | null)?.path
  } catch {
    return reply(400)
  }
  if (!COUNTED_PATHS.includes(path as CountedPath)) return reply(400)

  if (!limiter.allow(visitor)) return reply(429)
  if (!store) return reply(503)
  try {
    await store.add(path as CountedPath)
  } catch {
    return reply(500)
  }
  return reply(204)
}
