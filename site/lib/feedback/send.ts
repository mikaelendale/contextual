/*
 * What happens when someone presses Send: the honeypot, the rate limits, the
 * server's own validation, then one row. Kept apart from the route so it can
 * be tested without a database or a network.
 */

import type { Limiter } from "../rate-limit.ts"
import { BODY_CAP, validateReport, type Report } from "./report.ts"

export type Store = {
  insert(report: Report): Promise<void>
  /** Reports stored in the last `minutes`, for the overall limit. */
  recentCount(minutes: number): Promise<number>
}

/** A field people never see. A bot that fills it gets a polite answer and nothing is stored. */
export const HONEYPOT = "website"
/** Across everyone: at most this many reports in this many minutes. */
export const OVERALL = { max: 100, minutes: 10 }

const reply = (status: number, body: { ok: boolean; error?: string }) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } })

export async function handleSend(
  request: Request,
  { store, limiter, visitor }: { store: Store | null; limiter: Limiter; visitor: string },
): Promise<Response> {
  // Only the form on this site sends reports; browsers mark their own same-origin requests.
  const site = request.headers.get("sec-fetch-site")
  if (site && site !== "same-origin") return reply(403, { ok: false, error: "Reports can only be sent from the feedback form." })

  const length = Number(request.headers.get("content-length") ?? 0)
  if (length > BODY_CAP) return reply(413, { ok: false, error: "That report is too long." })
  const text = await request.text()
  if (text.length > BODY_CAP) return reply(413, { ok: false, error: "That report is too long." })

  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return reply(400, { ok: false, error: "The report isn't readable." })
  }
  if (body && typeof body === "object" && typeof (body as Record<string, unknown>)[HONEYPOT] === "string" && (body as Record<string, string>)[HONEYPOT].trim()) {
    return reply(200, { ok: true })
  }

  const result = validateReport(body)
  if (!result.ok) return reply(400, { ok: false, error: result.error })
  if (!limiter.allow(visitor)) return reply(429, { ok: false, error: "That's a lot of reports from here. Try again in a few minutes." })
  if (!store) return reply(503, { ok: false, error: "Feedback can't be stored right now. Nothing was sent." })

  try {
    if ((await store.recentCount(OVERALL.minutes)) >= OVERALL.max) {
      return reply(429, { ok: false, error: "We're getting a lot of reports right now. Try again in a few minutes." })
    }
    await store.insert(result.report)
  } catch {
    return reply(500, { ok: false, error: "Something failed on our side, and the report wasn't stored. Try again." })
  }
  return reply(200, { ok: true })
}
