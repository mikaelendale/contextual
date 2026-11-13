"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { ArrowCounterClockwise, FileText, Folder } from "@phosphor-icons/react"

import { PANEL } from "@/components/home/plate"
import { LiveDither } from "@/components/live-dither"
import { roundedPath, smooth, type Point } from "@/components/home/wire"
import { Spark } from "@/components/spark"
import { cn } from "@/lib/utils"

/*
 * What `npx usecontextual init` and the skills put in a repo, drawn as folder
 * cards wired together like the hero's constellation. When the figure comes
 * into view a pulse runs down the wires to the four files an agent reads
 * before it starts, then the three it writes after. Pointing at a file holds
 * the story and shows what that file holds; Replay runs it again.
 */

type Row = { id: string; name: string; note: string; folder?: boolean; opens?: string }
type Card = { id: string; title: string; path: string; rows: Row[] }

const CARDS: Card[] = [
  {
    id: "root",
    title: "your-app/",
    path: "",
    rows: [
      { id: "agents", name: "AGENTS.md", note: "The rules every session starts with" },
      { id: "claude", name: "CLAUDE.md", note: "One line that points Claude Code at AGENTS.md" },
      { id: "context", name: "context/", folder: true, opens: "ctx", note: "The project's memory: everything below" },
      { id: "skills", name: ".agents/, .claude/", folder: true, note: "The three skills, one copy for each kind of agent" },
      { id: "hook", name: ".git/hooks/pre-commit", note: "Stops a commit that changes code without its record" },
    ],
  },
  {
    id: "ctx",
    title: "context/",
    path: "context/",
    rows: [
      { id: "idea", name: "idea.md", note: "Your plan, in your words. The agent never edits it" },
      { id: "plan", name: "build-plan.md", note: "The phases, each a list of features" },
      { id: "status", name: "status/main.md", note: "Where the project stands. One file per branch" },
      { id: "features", name: "features/", folder: true, opens: "feat", note: "One folder per feature" },
      { id: "stack", name: "stack/", folder: true, note: "The tools, and how this repo wires them" },
      { id: "design", name: "design/", folder: true, note: "The look, and the design checklist every screen passes" },
      { id: "decisions", name: "decisions/", folder: true, note: "Why things were chosen, one short record each" },
    ],
  },
  {
    id: "feat",
    title: "features/",
    path: "context/features/",
    rows: [
      { id: "index", name: "_index.md", note: "One line per feature, so it can pick the next one" },
      { id: "foundation", name: "foundation/", folder: true, note: "The app shell and setup. Shipped" },
      { id: "additems", name: "add-items/", folder: true, opens: "item", note: "The feature being built" },
      { id: "planned", name: "check-off-items/ …", folder: true, note: "Planned features start with a README" },
    ],
  },
  {
    id: "item",
    title: "add-items/",
    path: "context/features/add-items/",
    rows: [
      { id: "readme", name: "README.md", note: "What it does, and the checks that prove it works" },
      { id: "build", name: "build.md", note: "Its files, data and routes" },
      { id: "tests", name: "tests.md", note: "How to prove it works, and the last result" },
      { id: "notes", name: "notes.md", note: "Gotchas, and questions for you" },
      { id: "log", name: "log.md", note: "Every task done on it, newest first" },
    ],
  },
]

const ROWS = new Map(CARDS.flatMap((c) => c.rows.map((r) => [r.id, { ...r, card: c }] as const)))
const fullPath = (id: string) => {
  const row = ROWS.get(id)!
  return `${row.card.path}${row.name}`
}

/** The wires a pulse crosses to reach each card. */
const CHAIN: Record<string, string[]> = { root: ["chip"], ctx: ["chip", "ctx"], feat: ["chip", "ctx", "feat"], item: ["chip", "ctx", "feat", "item"] }
const OPENERS = [
  { wire: "ctx", row: "context", from: "root", to: "ctx" },
  { wire: "feat", row: "features", from: "ctx", to: "feat" },
  { wire: "item", row: "additems", from: "feat", to: "item" },
]

type Beat = { kind: "read" | "write"; row: string; chain: string[]; start: number; arrive: number; end: number }
const HOP = 430
const READS = ["agents", "status", "index", "readme"]
const WRITES = ["log", "readme", "status"]
const BEATS: Beat[] = (() => {
  const beats: Beat[] = []
  let at = 300
  for (const row of READS) {
    const chain = CHAIN[ROWS.get(row)!.card.id]
    beats.push({ kind: "read", row, chain, start: at, arrive: at + chain.length * HOP, end: at + chain.length * HOP + 1050 })
    at = beats.at(-1)!.end
  }
  at += 350
  for (const row of WRITES) {
    beats.push({ kind: "write", row, chain: [], start: at, arrive: at + 220, end: at + 1000 })
    at += 1000
  }
  return beats
})()
const READ_COUNT = READS.length

type Snap = { beat: number; arrived: boolean; done: boolean }
const FINISHED: Snap = { beat: BEATS.length, arrived: true, done: true }

/* Fixed geometry, so each card can start level with the row that opens it (lg and up). */
const HEADER = 44
const LIST_TOP = 6
const ROW_H = 32
const openerOffset = (card: Card, rowId: string) => HEADER + LIST_TOP + card.rows.findIndex((r) => r.id === rowId) * ROW_H + ROW_H / 2 - HEADER / 2
const STAIR = (() => {
  const tops: Record<string, number> = { root: 0 }
  for (const o of OPENERS) tops[o.to] = tops[o.from] + openerOffset(CARDS.find((c) => c.id === o.from)!, o.row)
  return tops
})()

/** Puts the pulse where the beat's clock says, along the chain of wires it crosses. */
function placePulse(dot: SVGCircleElement | null, wires: Map<string, SVGPathElement>, beat: Beat, at: number) {
  if (!dot) return
  if (!beat.chain.length || at < beat.start || at >= beat.arrive) {
    dot.style.opacity = "0"
    return
  }
  const paths = beat.chain.map((id) => wires.get(id)).filter(Boolean) as SVGPathElement[]
  const lengths = paths.map((p) => p.getTotalLength())
  const total = lengths.reduce((a, b) => a + b, 0)
  if (!total) return
  let along = smooth((at - beat.start) / (beat.arrive - beat.start)) * total
  for (let i = 0; i < paths.length; i++) {
    if (along <= lengths[i] || i === paths.length - 1) {
      const p = paths[i].getPointAtLength(Math.min(along, lengths[i]))
      dot.setAttribute("cx", p.x.toFixed(2))
      dot.setAttribute("cy", p.y.toFixed(2))
      dot.style.opacity = "1"
      return
    }
    along -= lengths[i]
  }
}

export function RepoMap() {
  const plateRef = useRef<HTMLDivElement>(null)
  const chipRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef(new Map<string, HTMLDivElement>())
  const rowRefs = useRef(new Map<string, HTMLButtonElement>())
  const pathRefs = useRef(new Map<string, SVGPathElement>())
  const pulseRef = useRef<SVGCircleElement>(null)

  const [wires, setWires] = useState<Record<string, { d: string; start: Point }>>({})
  const [size, setSize] = useState<[number, number]>([0, 0])
  // The server and the first render show the finished picture; motion starts after hydration.
  const [snap, setSnap] = useState<Snap>(FINISHED)
  const [hovered, setHovered] = useState<string | null>(null)
  const [inView, setInView] = useState(false)
  const [playing, setPlaying] = useState(false)
  const t = useRef(0)
  const held = useRef(false)
  const reduced = useRef(false)
  const started = useRef(false)

  // Measure the wires from the cards as laid out, and again on every resize.
  useEffect(() => {
    const plate = plateRef.current
    if (!plate) return
    const measure = () => {
      const box = plate.getBoundingClientRect()
      const rel = (el: Element) => {
        const r = el.getBoundingClientRect()
        return { l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top, cy: (r.top + r.bottom) / 2 - box.top }
      }
      const next: Record<string, { d: string; start: Point }> = {}
      const chip = chipRef.current
      const root = cardRefs.current.get("root")
      if (chip && root) {
        const c = rel(chip)
        const rc = rel(root)
        const x = c.l + 22
        next.chip = { d: roundedPath([[x, c.b], [x, rc.t]]), start: [x, c.b] }
      }
      for (const o of OPENERS) {
        const row = rowRefs.current.get(o.row)
        const from = cardRefs.current.get(o.from)
        const to = cardRefs.current.get(o.to)
        if (!row || !from || !to) continue
        const rr = rel(row)
        const fc = rel(from)
        const tc = rel(to)
        const y2 = tc.t + HEADER / 2
        if (tc.l > fc.r - 4) {
          // Side by side: out of the card's right edge, across, into the next card's title.
          const mx = (fc.r + tc.l) / 2
          next[o.wire] = { d: roundedPath([[fc.r, rr.cy], [mx, rr.cy], [mx, y2], [tc.l, y2]], 10), start: [fc.r, rr.cy] }
        } else {
          // Stacked: out of the card's left edge, down the gutter, into the next card.
          const gx = Math.max(10, fc.l - 16)
          next[o.wire] = { d: roundedPath([[fc.l, rr.cy], [gx, rr.cy], [gx, y2], [tc.l, y2]], 10), start: [fc.l, rr.cy] }
        }
      }
      setSize((s) => (s[0] === Math.round(box.width) && s[1] === Math.round(box.height) ? s : [Math.round(box.width), Math.round(box.height)]))
      setWires((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(plate)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [])

  // Play once, the first time the figure is on screen. Reduced motion keeps the finished picture.
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!reduced.current) setSnap({ beat: -1, arrived: false, done: false })
    const plate = plateRef.current
    if (!plate) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 })
    io.observe(plate)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (inView && !started.current && !reduced.current) {
      started.current = true
      t.current = 0
      setPlaying(true)
    }
  }, [inView])

  // The clock: runs only while playing and on screen; pointing at the figure holds it.
  useEffect(() => {
    if (!playing || !inView) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      if (!held.current) t.current += dt
      const at = t.current
      const index = BEATS.findIndex((b) => at < b.end)
      if (index === -1) {
        setSnap(FINISHED)
        setPlaying(false)
        if (pulseRef.current) pulseRef.current.style.opacity = "0"
        return
      }
      const beat = BEATS[index]
      const arrived = at >= beat.arrive
      setSnap((s) => (s.beat === index && s.arrived === arrived && !s.done ? s : { beat: index, arrived, done: false }))
      placePulse(pulseRef.current, pathRefs.current, beat, at)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, inView])

  function replay() {
    t.current = 0
    started.current = true
    setSnap({ beat: -1, arrived: false, done: false })
    setPlaying(true)
  }

  // What each row shows, from the story's position.
  const readIndex = (id: string) => READS.indexOf(id)
  const isRead = (id: string) => {
    const i = readIndex(id)
    if (i === -1) return false
    return snap.done || i < snap.beat || (i === snap.beat && snap.arrived)
  }
  const isWritten = (id: string) => {
    const j = WRITES.indexOf(id)
    if (j === -1) return false
    const k = READ_COUNT + j
    return snap.done || k < snap.beat || (k === snap.beat && snap.arrived)
  }
  const current = !snap.done && snap.beat >= 0 ? BEATS[snap.beat] : null

  // The readout: the pointed-at file, or the story's step.
  let title = "Your agent's first read"
  let path = "Four files, before it touches code"
  let note = "In our example project, those four come to about 850 words."
  if (hovered) {
    title = READS.includes(hovered) ? "Read before every task" : WRITES.includes(hovered) ? "Written after every task" : "In the folder"
    path = fullPath(hovered)
    note = ROWS.get(hovered)!.note
  } else if (current) {
    const n = current.kind === "read" ? readIndex(current.row) + 1 : WRITES.indexOf(current.row) + 1
    title = current.kind === "read" ? `Before the task · reading ${n} of ${READS.length}` : `After the task · writing ${n} of ${WRITES.length}`
    path = fullPath(current.row)
    note = ROWS.get(current.row)!.note
  } else if (snap.done) {
    title = "One task, start to finish"
    path = "Read 4 files, then wrote 3"
    note = "The next session starts from what this one wrote."
  }

  const legend = (
    <>
      <span className="inline-flex items-center gap-2">
        <Spark className="size-3 text-brand" /> Read before every task
      </span>
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-ink" /> Written after every task
      </span>
    </>
  )

  return (
    <figure aria-label="The files Contextual keeps in a repo, and the ones an agent reads first">
      <div
        ref={plateRef}
        onPointerEnter={(e) => e.pointerType === "mouse" && (held.current = true)}
        onPointerLeave={() => {
          held.current = false
          setHovered(null)
        }}
        // overflow-clip, not hidden: it rounds the corners without stopping the readout from sticking on phones.
        className="relative overflow-clip rounded-[22px] bg-linear-to-b from-[#c43000] via-[#db3300] to-[#ff9b45] shadow-[0_28px_50px_-30px_rgb(219_51_0/0.55)] ring-1 ring-black/5"
      >
        <LiveDither
          className="absolute inset-0"
          image="/dither/plate.webp"
          colorBack="#c43000"
          colorFront="#ff6a14"
          colorHighlight="#fff4ea"
          originY={0.5}
        />

        {/* Wires, measured from the cards; a white pulse runs along them. */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-10" width={size[0]} height={size[1]}>
          {Object.entries(wires).map(([id, w]) => {
            const lit = current?.chain.includes(id) || (hovered && CHAIN[ROWS.get(hovered)!.card.id].includes(id))
            return (
              <g key={id}>
                <path
                  ref={(el) => {
                    if (el) pathRefs.current.set(id, el)
                  }}
                  d={w.d}
                  fill="none"
                  stroke="white"
                  strokeOpacity={lit ? 1 : 0.6}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  className="transition-[stroke-opacity] duration-300"
                />
                <circle cx={w.start[0]} cy={w.start[1]} r={3.25} fill="white" fillOpacity={lit ? 1 : 0.8} />
              </g>
            )
          })}
          <circle ref={pulseRef} r={4.5} fill="white" style={{ opacity: 0 }} />
        </svg>

        <div className="relative p-5 sm:p-8">
          <div className="pl-7 lg:pl-0">
            <div
              ref={chipRef}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-linear-to-b from-[#2b2b31] to-foreground px-4 text-[13.5px] font-medium text-background shadow-[0_10px_24px_-12px_rgb(23_23_27/0.6)]"
            >
              <span aria-hidden="true" className="text-white/45">
                $
              </span>
              npx usecontextual init
            </div>
          </div>

          {/* The readout: what's happening, or what the pointed-at file holds. Top right on wide
              screens, where the staircase leaves room; pinned to the top while you scroll on phones. */}
          <div
            className={cn(
              PANEL,
              "z-30 mt-5 ml-7 p-4 max-lg:sticky max-lg:top-3 lg:absolute lg:top-8 lg:right-8 lg:mt-0 lg:ml-0 lg:w-[calc(50%-56px)]",
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-[12.5px] text-muted-foreground">Pick a file to see what it holds.</p>
              <button
                type="button"
                onClick={replay}
                className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12.5px] font-medium text-foreground ring-1 ring-foreground/12 transition-colors outline-none hover:bg-foreground/[0.04] focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowCounterClockwise weight="bold" className="size-3.5" aria-hidden="true" />
                Replay
              </button>
            </div>
            <div className="mt-3 min-h-[5.25rem]" aria-live="polite">
              <p className="text-[12.5px] font-medium text-brand-ink">{title}</p>
              <p className="mt-1 truncate text-[15.5px] font-medium text-foreground">{path}</p>
              <p className="mt-0.5 text-[14px] leading-[1.5] text-muted-foreground">{note}</p>
            </div>
            <div className="mt-3 hidden flex-wrap gap-x-5 gap-y-1 border-t border-foreground/[0.07] pt-3 text-[12.5px] text-muted-foreground lg:flex">
              {legend}
            </div>
          </div>

          <div className="relative mt-6 grid gap-6 pl-7 lg:grid-cols-4 lg:gap-12 lg:pl-0">
            {CARDS.map((card) => (
              <div
                key={card.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(card.id, el)
                }}
                role="group"
                aria-label={card.title}
                className={cn(PANEL, "relative z-20 self-start lg:mt-(--stair)")}
                style={{ "--stair": `${STAIR[card.id]}px` } as CSSProperties}
              >
                <div className="flex h-11 items-center gap-2 border-b border-foreground/[0.07] px-3.5">
                  <Folder weight="fill" className="size-4 text-brand" aria-hidden="true" />
                  <span className="text-[13.5px] font-semibold tracking-[-0.01em] text-foreground">{card.title}</span>
                </div>
                <ul className="px-1.5 pt-1.5 pb-2">
                  {card.rows.map((row) => {
                    const read = isRead(row.id)
                    const written = isWritten(row.id)
                    const now = current?.row === row.id && snap.arrived
                    return (
                      <li key={row.id}>
                        <button
                          ref={(el) => {
                            if (el) rowRefs.current.set(row.id, el)
                          }}
                          type="button"
                          aria-label={`${fullPath(row.id)}: ${row.note}`}
                          onPointerEnter={() => setHovered(row.id)}
                          onFocus={() => setHovered(row.id)}
                          onBlur={() => setHovered(null)}
                          onClick={() => setHovered(row.id)}
                          className={cn(
                            "flex h-8 w-full items-center gap-2 rounded-[9px] px-2 text-left text-[14px] transition-[background-color,box-shadow] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            read || written ? "text-foreground" : "text-foreground/80",
                            hovered === row.id && "bg-foreground/[0.05]",
                            now && "bg-linear-to-r from-brand-soft to-transparent ring-1 ring-brand/30",
                          )}
                        >
                          {row.folder ? (
                            <Folder className="size-[15px] shrink-0 text-brand-ink" aria-hidden="true" />
                          ) : (
                            <FileText className="size-[15px] shrink-0 text-muted-foreground" aria-hidden="true" />
                          )}
                          <span className="min-w-0 flex-1 truncate">{row.name}</span>
                          {READS.includes(row.id) && (
                            <Spark className={cn("size-3 shrink-0 transition-colors duration-300", read ? "text-brand" : "text-foreground/15")} />
                          )}
                          {WRITES.includes(row.id) && (
                            <span
                              aria-hidden="true"
                              className={cn("size-1.5 shrink-0 rounded-full transition-colors duration-300", written ? "bg-brand-ink" : "bg-foreground/15")}
                            />
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-muted-foreground lg:sr-only">{legend}</figcaption>
    </figure>
  )
}
