import { getStore } from "@/lib/feedback/db.ts"
import { addressOf, createLimiter, visitorKey } from "@/lib/feedback/rate-limit.ts"
import { handleSend } from "@/lib/feedback/send.ts"

// One limiter per server process; it keeps keyed hashes, never addresses.
const limiter = createLimiter()

/** Stores one reviewed report. Opening the form never calls this; only Send does. */
export async function POST(request: Request) {
  return handleSend(request, { store: getStore(), limiter, visitor: visitorKey(addressOf(request.headers)) })
}
