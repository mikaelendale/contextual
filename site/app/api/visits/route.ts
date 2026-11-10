import { connection } from "next/server"

import { countVisit, readVisits } from "@/lib/visits"

const noStore = { "Cache-Control": "no-store" }

/** The current total, without counting a visit. */
export async function GET() {
  await connection() // always per request, never prerendered
  return Response.json({ visits: await readVisits() }, { headers: noStore })
}

/**
 * Count a visit and return the new total. Only the page itself counts:
 * browsers mark their own same-origin requests, so a request from anywhere
 * else just reads the total.
 */
export async function POST(request: Request) {
  const fromPage = request.headers.get("sec-fetch-site") === "same-origin"
  const visits = fromPage ? await countVisit() : await readVisits()
  return Response.json({ visits }, { headers: noStore })
}
