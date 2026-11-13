/*
 * A per-visitor limit that stores no IP addresses. The visitor is a keyed
 * hash of their address, made with a secret that exists only in this server
 * process's memory and changes whenever it restarts. The hashes stay in
 * memory for the limit's window and are never written anywhere or logged.
 */

import { createHmac, randomBytes } from "node:crypto"

export type Limiter = { allow(key: string): boolean }

const PROCESS_SECRET = randomBytes(32)

/** A stand-in for the visitor's address that can't be turned back into it, and means nothing outside this process. */
export function visitorKey(address: string): string {
  return createHmac("sha256", PROCESS_SECRET).update(address).digest("base64url").slice(0, 22)
}

/** The address a request came from, as Vercel's proxy reports it. Used only to make the key above. */
export function addressOf(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown"
}

/** At most `max` requests from one visitor in `windowMs`. */
export function createLimiter({ max = 5, windowMs = 10 * 60 * 1000, now = Date.now }: { max?: number; windowMs?: number; now?: () => number } = {}): Limiter {
  const hits = new Map<string, number[]>()
  return {
    allow(key: string) {
      const t = now()
      const recent = (hits.get(key) ?? []).filter((at) => t - at < windowMs)
      const allowed = recent.length < max
      if (allowed) recent.push(t)
      hits.set(key, recent)
      if (hits.size > 5000) for (const [k, times] of hits) if (times.every((at) => t - at >= windowMs)) hits.delete(k)
      return allowed
    },
  }
}
