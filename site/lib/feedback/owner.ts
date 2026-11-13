/*
 * The owner's way into the list of reports: a secret from the
 * FEEDBACK_REPORTS_SECRET environment variable. Signing in sets a cookie
 * holding a keyed hash of the secret, never the secret itself.
 */

import { createHmac, timingSafeEqual } from "node:crypto"

export const OWNER_COOKIE = "contextual_feedback_owner"

/** The cookie's value for this secret. Changing the secret signs everyone out. */
export function ownerToken(secret: string): string {
  return createHmac("sha256", secret).update("contextual agent feedback reports").digest("base64url")
}

/** Compares without leaking, through timing, how much of the value was right. */
export function sameText(a: string, b: string): boolean {
  const x = createHmac("sha256", "compare").update(a).digest()
  const y = createHmac("sha256", "compare").update(b).digest()
  return timingSafeEqual(x, y)
}

/** Whether the cookie belongs to the owner. False when no secret is set: then nobody can see the list. */
export function isOwner(cookieValue: string | undefined, secret = process.env.FEEDBACK_REPORTS_SECRET): boolean {
  if (!secret || !cookieValue) return false
  return sameText(cookieValue, ownerToken(secret))
}
