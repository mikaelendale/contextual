"use client"

import { useEffect } from "react"

import { SESSION_MS, type CountedPath } from "@/lib/visits/visits.ts"

/*
 * Counts a visit to this page, once per session: a browser counts again only
 * after 30 minutes away. It remembers only when it was last here
 * (localStorage), sends only the page's path, and shows nothing. Automated
 * browsers don't count. If storage is blocked it counts once per page load,
 * and the server limits repeats from one address.
 */

const SEEN_KEY = "contextual:seen-at"

// One attempt per page load, even when React runs effects twice in development.
let attempted = false

export function VisitBeacon({ path }: { path: CountedPath }) {
  useEffect(() => {
    if (attempted || navigator.webdriver) return
    attempted = true
    const now = Date.now()
    try {
      const seenAt = Number(localStorage.getItem(SEEN_KEY) ?? 0)
      // Still the same session: keep it going, count nothing.
      if (now - seenAt < SESSION_MS) {
        localStorage.setItem(SEEN_KEY, String(now))
        return
      }
    } catch {}
    fetch("/api/visits", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path }),
      cache: "no-store",
      keepalive: true,
    })
      .then((res) => {
        if (!res.ok) return
        try {
          localStorage.setItem(SEEN_KEY, String(now))
        } catch {}
      })
      .catch(() => {})
  }, [path])
  return null
}
