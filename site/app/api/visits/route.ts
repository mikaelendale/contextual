import { addressOf, createLimiter, visitorKey } from "@/lib/rate-limit.ts"
import { getVisitStore } from "@/lib/visits/db.ts"
import { PER_VISITOR, handleVisit } from "@/lib/visits/visits.ts"

// One limiter per server process; it keeps keyed hashes, never addresses.
const limiter = createLimiter(PER_VISITOR)

/** Counts one visit to a counted page. The home page's beacon calls it at most once per session. */
export async function POST(request: Request) {
  return handleVisit(request, { store: getVisitStore(), limiter, visitor: visitorKey(addressOf(request.headers)) })
}
