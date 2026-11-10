"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/*
 * "1,284 visits so far". A browser counts one visit, then only reads the total
 * until it has been away for 30 minutes (the usual analytics session). The
 * number counts up once the line has settled in. If the counter is
 * unavailable, the line stays empty; its space is kept, so nothing shifts.
 */

const SEEN_KEY = "contextual:seen-at"
const SESSION_MS = 30 * 60 * 1000
const format = new Intl.NumberFormat("en-US")
const noun = (n: number) => (n === 1 ? "visit" : "visits")

// One request per page load, even when React runs effects twice in development.
let request: Promise<number | null> | null = null

function loadVisits(): Promise<number | null> {
  if (request) return request
  let counted = false
  try {
    const seenAt = Number(localStorage.getItem(SEEN_KEY) ?? 0)
    counted = Date.now() - seenAt < SESSION_MS
  } catch {}
  request = fetch("/api/visits", { method: counted ? "GET" : "POST", cache: "no-store" })
    .then((res) => (res.ok ? (res.json() as Promise<{ visits?: unknown }>) : null))
    .then((data) => {
      const visits = typeof data?.visits === "number" ? data.visits : null
      // Any successful load keeps the session going.
      if (visits !== null) {
        try {
          localStorage.setItem(SEEN_KEY, String(Date.now()))
        } catch {}
      }
      return visits
    })
    .catch(() => null)
  return request
}

export function VisitCounter({
  className,
  startAfter = 1300,
}: {
  className?: string
  /** Wait this long after mount before counting up, so it lands after the entrance. */
  startAfter?: number
}) {
  const [visits, setVisits] = useState<number | null>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const mountedAt = useRef(0)

  useEffect(() => {
    mountedAt.current = performance.now()
    let alive = true
    loadVisits().then((value) => {
      if (alive) setVisits(value)
    })
    return () => {
      alive = false
    }
  }, [])

  // Count up by writing the text directly: no re-render per frame.
  useEffect(() => {
    const el = numberRef.current
    if (visits === null || !el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const duration = Math.min(1600, 700 + 300 * Math.log10(visits + 1))
    const begin = Math.max(performance.now(), mountedAt.current + startAfter)
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - begin) / duration))
      el.textContent = format.format(Math.round(visits * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    el.textContent = format.format(0)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      el.textContent = format.format(visits)
    }
  }, [visits, startAfter])

  return (
    <p className={cn("h-5 text-[13.5px] text-muted-foreground tabular-nums", className)}>
      {visits !== null && (
        <span className="animate-in duration-500 fade-in">
          <span aria-hidden="true">
            <span ref={numberRef}>{format.format(visits)}</span> {noun(visits)} so far
          </span>
          <span className="sr-only">
            {format.format(visits)} {noun(visits)} so far
          </span>
        </span>
      )}
    </p>
  )
}
