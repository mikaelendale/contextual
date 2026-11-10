"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { LiveDither } from "@/components/live-dither"

import { cn } from "@/lib/utils"

/*
 * The hero sky: a rendered cloudscape turned into soft, live film grain by
 * Paper's dithering shader. It settles in on load, drifts slowly, and moves by depth
 * with scroll and the pointer. Over it, a constellation of the context files
 * draws itself left to right and ends at your agent; each star's name shows
 * on hover.
 */

type Star = { x: number; y: number; label: string; side: "right" | "below" }

// Positions in % of the constellation band.
const STARS = {
  plan: { x: 12, y: 65, label: "Build plan", side: "below" },
  features: { x: 24, y: 0, label: "Features", side: "right" },
  setup: { x: 35, y: 90, label: "Setup steps", side: "below" },
  done: { x: 59, y: 16, label: "What's done", side: "right" },
  next: { x: 70, y: 100, label: "What's next", side: "below" },
} satisfies Record<string, Star>

const AGENT = { x: 84, y: 42 }

type Point = { x: number; y: number }
const LINKS: [Point, Point][] = [
  [STARS.plan, STARS.features],
  [STARS.features, STARS.setup],
  [STARS.setup, STARS.plan],
  [STARS.setup, STARS.done],
  [STARS.done, STARS.next],
  [STARS.next, AGENT],
]

// The reveal sweeps across in 1.8s from this moment; each star lights as it passes.
const REVEAL_AT = 1150
const REVEAL_MS = 1800
const lightAt = (x: number) => REVEAL_AT + Math.round((x / 100) * REVEAL_MS * 0.92)

const vars = (v: Record<string, string | number>) => v as CSSProperties

const LABEL =
  "pointer-events-none absolute text-[12.5px] font-medium whitespace-nowrap text-white opacity-0 transition-opacity duration-300 [text-shadow:0_0_5px_rgb(150_35_0/0.9),0_0_14px_rgb(150_35_0/0.7)] group-hover:opacity-100"

function Spark({ className }: { className?: string }) {
  // A four-point star with soft, slightly concave sides.
  return (
    <svg viewBox="-50 -50 100 100" aria-hidden="true" className={className}>
      <path
        d="M0 -50C4 -14 14 -4 50 0C14 4 4 14 0 50C-4 14 -14 4 -50 0C-14 -4 -4 -14 0 -50Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Sky({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  // Pointer depth: only CSS variables change, so React never re-renders.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || still) return
    let raf = 0
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3))
        el.style.setProperty("--my", ((event.clientY / window.innerHeight) * 2 - 1).toFixed(3))
      })
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none overflow-hidden [mask-image:linear-gradient(to_bottom,black_78%,transparent_100%)]",
        className,
      )}
    >
      {/* Fallback while the shader loads, and where WebGL is off. */}
      <div className="absolute inset-0 bg-linear-to-b from-[#db3300] via-[#ff7a24] to-[#ffe2c8]" />

      {/* The sky and its clouds: settle in, then drift. */}
      <div className="sky-layer absolute inset-0" style={vars({ "--depth": 0.6, "--lift": "90px" })}>
        <div className="clouds-in absolute inset-0" style={vars({ "--from": "2%" })}>
          <div className="drift-near absolute inset-y-0 -inset-x-[4%]">
            <LiveDither
              className="absolute inset-0"
              image="/dither/sky.webp"
              colorBack="#c43000"
              colorFront="#ff6a14"
              colorHighlight="#fff4ea"
            />
          </div>
        </div>
      </div>

      {/* A deeper zenith, so the header reads on the bright sky. */}
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[rgb(140_28_0/0.34)] to-transparent" />

      {/* The constellation: a band under the header, shorter on short screens. */}
      <div
        className="sky-layer absolute inset-x-0 top-[5.5rem] h-[13svh] sm:h-[clamp(5.5rem,calc(50svh-17rem),17rem)]"
        style={vars({ "--depth": 0.25, "--lift": "60px" })}
      >
        <svg
          className="wipe-in absolute inset-0 size-full overflow-visible"
          style={vars({ "--delay": `${REVEAL_AT}ms` })}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {LINKS.map(([a, b], i) => (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="white"
              strokeOpacity={0.62}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {Object.values(STARS).map((star, i) => (
          <div key={star.label} className="absolute" style={{ left: `${star.x}%`, top: `${star.y}%` }}>
            {/* A generous hover target; the name shows only while pointing at it. */}
            <span className="group pointer-events-auto absolute size-9 -translate-1/2 cursor-default">
              <span
                className="star-in absolute top-1/2 left-1/2 size-[7px] -translate-1/2"
                style={vars({ "--delay": `${lightAt(star.x)}ms` })}
              >
                <span
                  className="twinkle absolute inset-0 rounded-full bg-white shadow-[0_0_8px_2px_rgb(255_255_255/0.85),0_0_26px_6px_rgb(255_214_170/0.6)] transition-transform duration-300 group-hover:scale-150"
                  style={{ animationDelay: `${i * 0.9}s` }}
                />
              </span>
              <span
                className={cn(
                  LABEL,
                  star.side === "right"
                    ? "top-1/2 left-[calc(50%+12px)] -translate-y-1/2"
                    : "top-[calc(50%+12px)] left-1/2 -translate-x-1/2",
                )}
              >
                {star.label}
              </span>
            </span>
          </div>
        ))}

        <div className="absolute" style={{ left: `${AGENT.x}%`, top: `${AGENT.y}%` }}>
          <span className="group pointer-events-auto absolute size-[clamp(56px,7vw,96px)] -translate-1/2 cursor-default">
            <span className="spark-in absolute top-1/2 left-1/2" style={vars({ "--delay": `${lightAt(AGENT.x)}ms` })}>
              <Spark className="absolute size-[clamp(64px,9vw,120px)] -translate-1/2 text-white opacity-70 blur-md" />
              <Spark className="absolute size-[clamp(46px,6.5vw,86px)] -translate-1/2 text-white" />
            </span>
            <span className={cn(LABEL, "top-[calc(100%+4px)] left-1/2 -translate-x-1/2")}>Your agent</span>
          </span>
        </div>
      </div>
    </div>
  )
}
