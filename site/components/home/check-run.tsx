"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { ArrowCounterClockwise, Check, CheckCircle, Circle, CircleNotch, GitBranch } from "@phosphor-icons/react"

import { ClaudeCodeMark } from "@/components/brand-marks"
import { PANEL } from "@/components/home/plate"
import { LiveDither } from "@/components/live-dither"
import { cn } from "@/lib/utils"

/*
 * One task, the way contextual-next finishes it, in five steps: the tests,
 * a look at every screen it changed, the design checklist, the log entry, and
 * the commit the pre-commit hook checks. The step that's running is lit and
 * the ones still to come are dimmed. It plays once when it comes into view,
 * holds while pointed at, jumps to a step when you pick one, and replays.
 *
 * Everything shown comes from one of our test runs: a shopping list app
 * ("pantry") and its add-items feature, built by Claude Code. The test names,
 * screenshot files, log entry, commit and hook output are that run's own;
 * the screens are drawn in this site's type and colour.
 */

const STEPS = [
  { label: "Runs the tests", status: "Running tests", start: 0 },
  { label: "Looks at every screen it changed", status: "Checking screens", start: 3200 },
  { label: "Runs the design checklist", status: "Running the checklist", start: 9500 },
  { label: "Writes down what it did", status: "Writing the log", start: 12900 },
  { label: "The hook checks the commit", status: "Committing", start: 17900 },
]
const END = 20800

const TESTS = [
  "adds the item to the top of the list",
  "trims spaces around the text",
  "an empty or spaces-only entry adds nothing",
  "does not change the list it was given",
  "added items match the list model and survive a save and reload",
]
const TEST_AT = (i: number) => 300 + i * 480
const TEST_TOOK = 380
const TESTS_DONE = 2750

type Screen = "empty" | "two" | "error" | "desktop"
const CAPTURES: { file: string; screen: Screen }[] = [
  { file: "add-items-empty-375.png", screen: "empty" },
  { file: "add-items-two-375.png", screen: "two" },
  { file: "add-items-save-error-375.png", screen: "error" },
  { file: "add-items-desktop-1280.png", screen: "desktop" },
]
const CAPTURE_AT = (i: number) => 3400 + i * 1500
const FRAMED = 550
const SAVED = 1050

const CHECKLIST = [
  "Nothing from the never-ship list",
  "Colors and type from principles.md",
  "One primary action on each screen",
  "Empty, loading and error states seen",
  "Keyboard works, focus ring shows",
  "Text contrast 4.5:1 or more",
  "Field outlines 3:1 or more",
  "Nothing scrolls sideways at 375px",
  "Words specific to this app",
]
const CHECK_AT = (i: number) => 9700 + i * 330
const CHECK_TOOK = 250

type Seg = { text: string; code?: boolean }
type Block = { kind: "h2" | "li"; segs: Seg[] }
const code = (text: string): Seg => ({ text, code: true })

/** The entry this run added to features/add-items/log.md, shortened a little. */
const ENTRY: Block[] = [
  { kind: "h2", segs: [{ text: "2026-11-13 · claude-code · Build the add form and wire it in" }] },
  {
    kind: "li",
    segs: [
      { text: "Changed: " },
      code("addItem"),
      { text: " uses " },
      code("createItem"),
      { text: "; added the field, the Add button, " },
      code("add-items.css"),
      { text: " and " },
      code("add-items.test.js"),
      { text: "." },
    ],
  },
  { kind: "li", segs: [{ text: "Tests: 5 new tests; " }, code("npm test"), { text: " 16 pass, 0 fail." }] },
  { kind: "li", segs: [{ text: "Left open: nothing." }] },
  {
    kind: "li",
    segs: [
      { text: "Deslop: pass (Playwright screenshots " },
      code("add-items-empty-375.png"),
      { text: ", " },
      code("add-items-two-375.png"),
      { text: ", " },
      code("add-items-save-error-375.png"),
      { text: ", " },
      code("add-items-desktop-1280.png"),
      { text: ")" },
    ],
  },
]
/** The entry below it, from the session before. */
const EARLIER: Block[] = [
  { kind: "h2", segs: [{ text: "2026-11-13 · claude-code · Sync: hand-started " }, code("addItem")] },
  {
    kind: "li",
    segs: [{ text: "Changed: covers " }, code("e0f8446"), { text: ". " }, code("addItem(list, text)"), { text: " trims the text and puts the new item at the top." }],
  },
  { kind: "li", segs: [{ text: "Tests: none exist yet; none run (sync only)." }] },
  { kind: "li", segs: [{ text: "Deslop: not UI." }] },
]
const ENTRY_CHARS = ENTRY.reduce((n, b) => n + b.segs.reduce((m, s) => m + s.text.length, 0), 0)
const TYPE_FROM = 13100
const TYPE_TO = 17500

const TERMINAL = [
  { at: 18000, kind: "command", text: 'git commit -m "Add items to the top of the list"' },
  { at: 19000, kind: "dim", text: "usecontextual check · pantry · branch feat/add-items" },
  { at: 19600, kind: "ok", text: "0 errors, 0 warnings" },
  { at: 20100, kind: "plain", text: "[feat/add-items 11fd88f] Add items to the top of the list" },
  { at: 20300, kind: "dim", text: " 13 files changed, 181 insertions(+), 23 deletions(-)" },
] as const
const COMMAND_TYPED = 800

const FEATURES = [
  { name: "foundation", state: "Shipped" },
  { name: "add-items", state: "In progress" },
  { name: "check-off-items", state: "Planned" },
  { name: "clear-bought", state: "Planned" },
  { name: "share-list", state: "Phase 2" },
]

type State = "next" | "now" | "done"
const rowState = (t: number, start: number, took: number): State => (t >= start + took ? "done" : t >= start ? "now" : "next")

export function CheckRun() {
  const ref = useRef<HTMLDivElement>(null)
  // The server and the first render show the finished run; motion starts after hydration.
  const [t, setT] = useState(END)
  const [inView, setInView] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const [view, setView] = useState<"preview" | "source">("preview")
  const clock = useRef(END)
  const held = useRef(false)
  const reduced = useRef(false)
  const started = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!reduced.current) {
      clock.current = 0
      setT(0)
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (inView && !started.current && !reduced.current) {
      started.current = true
      setPlaying(true)
    }
  }, [inView])

  // The clock runs only while playing and on screen; pointing at the window holds it.
  useEffect(() => {
    if (!playing || !inView) return
    let raf = 0
    let last = performance.now()
    let shown = -1
    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      if (!held.current) clock.current = Math.min(END, clock.current + dt)
      // About 30 updates a second is plenty for typing and ticks.
      if (Math.abs(clock.current - shown) >= 33 || clock.current >= END) {
        shown = clock.current
        setT(clock.current)
      }
      if (clock.current >= END) {
        setPlaying(false)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, inView])

  function jump(to: number) {
    clock.current = to
    setT(to)
    setPicked(null)
    started.current = true
    if (!reduced.current) setPlaying(true)
  }

  const done = t >= END
  let step = STEPS.length
  if (!done) for (let i = 0; i < STEPS.length; i++) if (t >= STEPS[i].start) step = i
  const stateOf = (i: number): State => (done || i < step ? "done" : i === step ? "now" : "next")

  // Screens: the viewer shows the one pointed at, else the latest the run has opened.
  let latest = -1
  for (let i = 0; i < CAPTURES.length; i++) if (t >= CAPTURE_AT(i)) latest = i
  const shown = picked !== null && t >= CAPTURE_AT(picked) + SAVED ? picked : latest
  const savedCount = CAPTURES.filter((_, i) => t >= CAPTURE_AT(i) + SAVED).length
  const checkedCount = CHECKLIST.filter((_, i) => t >= CHECK_AT(i) + CHECK_TOOK).length
  const typed = Math.round(Math.min(1, Math.max(0, (t - TYPE_FROM) / (TYPE_TO - TYPE_FROM))) * ENTRY_CHARS)
  const hook = stateOf(4)

  return (
    <figure aria-label="An agent finishing one feature: the tests, a look at each screen, the design checklist, the log entry and the commit check">
      <div
        ref={ref}
        onPointerEnter={(e) => e.pointerType === "mouse" && (held.current = true)}
        onPointerLeave={() => (held.current = false)}
        className="relative overflow-hidden rounded-[22px] bg-linear-to-b from-[#c43000] via-[#db3300] to-[#ff9b45] p-3 shadow-[0_28px_50px_-30px_rgb(219_51_0/0.55)] ring-1 ring-black/5 sm:p-6"
      >
        <LiveDither
          className="absolute inset-0"
          image="/dither/plate.webp"
          colorBack="#c43000"
          colorFront="#ff6a14"
          colorHighlight="#fff4ea"
          originY={0.5}
        />

        <div className={cn(PANEL, "relative overflow-hidden")}>
          {/* Title bar */}
          <div className="flex h-11 items-center gap-3 border-b border-foreground/[0.07] px-4">
            <span aria-hidden="true" className="flex w-16 gap-1.5 max-sm:hidden">
              <span className="size-2.5 rounded-full bg-foreground/12" />
              <span className="size-2.5 rounded-full bg-foreground/12" />
              <span className="size-2.5 rounded-full bg-foreground/12" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground sm:text-center">
              pantry <span className="text-faint">·</span> feat/add-items
            </span>
            <span
              className={cn(
                "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium ring-1 transition-colors duration-300",
                done ? "bg-linear-to-b from-brand-soft to-white text-brand-ink ring-brand/25" : "text-foreground ring-foreground/12",
              )}
            >
              {done ? <Check weight="bold" className="size-3" aria-hidden="true" /> : <Busy />}
              {done ? "Ready for review" : STEPS[step].status}
            </span>
          </div>

          <div className="grid lg:grid-cols-[200px_minmax(0,1fr)]">
            {/* Sidebar: the feature index, and who's working */}
            <aside className="hidden border-r border-foreground/[0.07] p-3 lg:flex lg:flex-col">
              <p className="px-2 pt-1 pb-2 text-[12px] font-medium text-muted-foreground">Features</p>
              <ul className="flex flex-col gap-0.5">
                {FEATURES.map((f) => {
                  const current = f.name === "add-items"
                  return (
                    <li
                      key={f.name}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-[8px] px-2 py-1.5 text-[13px]",
                        current ? "bg-linear-to-r from-brand-soft to-transparent text-foreground" : "text-foreground/75",
                      )}
                    >
                      <span className="truncate">{f.name}</span>
                      <span className={cn("shrink-0 text-[11.5px]", current ? "text-brand-ink" : "text-muted-foreground")}>
                        {f.state}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <div className="mt-auto space-y-1.5 px-2 pt-8">
                <p className="flex items-center gap-2 text-[13px] font-medium text-foreground">
                  <ClaudeCodeMark className="size-3.5 text-[#d97757]" />
                  Claude Code
                </p>
                <p className="text-[12px] text-muted-foreground">/contextual-next</p>
                <p className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                  <GitBranch className="size-3.5" aria-hidden="true" /> feat/add-items
                </p>
              </div>
            </aside>

            <div className="grid gap-px bg-foreground/[0.06] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
              {/* 1. Tests */}
              <Pane n={1} title="Tests" note="add-items.test.js" state={stateOf(0)}>
                <ul className="space-y-1">
                  {TESTS.map((name, i) => {
                    const s = rowState(t, TEST_AT(i), TEST_TOOK)
                    return (
                      <li key={name} className="flex items-start gap-2 text-[13px] leading-[1.45]">
                        <Mark state={s} />
                        <span className={s === "next" ? "text-muted-foreground" : "text-foreground"}>{name}</span>
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-auto flex items-center justify-between gap-3 border-t border-foreground/[0.07] pt-2.5 text-[13px] max-lg:mt-3">
                  <span className="text-muted-foreground">npm test</span>
                  <span className={t >= TESTS_DONE ? "font-medium text-brand-ink" : "text-muted-foreground"}>
                    {t >= TESTS_DONE ? "16 passed · 0 failed" : t >= TEST_AT(0) ? "Running" : "Waiting"}
                  </span>
                </p>
              </Pane>

              {/* 2. Screens */}
              <Pane n={2} title="Screens" note="Playwright · 375px and 1280px" state={stateOf(1)}>
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,14.25rem)]">
                  <Viewer index={shown} t={t} />
                  <ul className="flex flex-col gap-1 self-center" aria-label="Screenshots">
                    {CAPTURES.map((cap, i) => {
                      const s = rowState(t, CAPTURE_AT(i), SAVED)
                      return (
                        <li key={cap.file}>
                          <button
                            type="button"
                            disabled={s !== "done"}
                            onPointerEnter={() => setPicked(i)}
                            onFocus={() => setPicked(i)}
                            onClick={() => setPicked(i)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-[12px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              shown === i && s !== "next" ? "bg-foreground/[0.05] text-foreground" : s === "next" ? "text-muted-foreground" : "text-foreground/85",
                            )}
                          >
                            <Mark state={s} />
                            <span className="min-w-0 truncate">{cap.file}</span>
                          </button>
                        </li>
                      )
                    })}
                    <li className="px-2 pt-1 text-[12px] text-muted-foreground">
                      {savedCount === CAPTURES.length ? "Point at a file to see it" : `${savedCount} of ${CAPTURES.length} saved`}
                    </li>
                  </ul>
                </div>
              </Pane>

              {/* 3. Design checklist */}
              <Pane n={3} title="Design checklist" note={`deslop.md · ${checkedCount} of ${CHECKLIST.length}`} state={stateOf(2)}>
                <ul className="space-y-1">
                  {CHECKLIST.map((item, i) => {
                    const s = rowState(t, CHECK_AT(i), CHECK_TOOK)
                    return (
                      <li key={item} className="flex items-start gap-2 text-[13px] leading-[1.45]">
                        <Mark state={s} />
                        <span className={s === "next" ? "text-muted-foreground" : "text-foreground"}>{item}</span>
                      </li>
                    )
                  })}
                </ul>
              </Pane>

              {/* 4. log.md, rendered, with its markdown a click away */}
              <Pane
                n={4}
                title="log.md"
                note={
                  <span role="group" aria-label="Show log.md as" className="inline-flex rounded-full bg-foreground/[0.05] p-0.5">
                    {(["preview", "source"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={view === v}
                        onClick={() => setView(v)}
                        className={cn(
                          "h-6 rounded-full px-2.5 text-[12px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          view === v ? "bg-white text-foreground shadow-[0_1px_2px_rgb(23_23_27/0.12)]" : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {v === "preview" ? "Preview" : "Markdown"}
                      </button>
                    ))}
                  </span>
                }
                state={stateOf(3)}
                className="max-lg:h-[22rem]"
              >
                <p className="-mt-1 mb-3 truncate text-[12px] text-muted-foreground">context/features/add-items/log.md</p>
                {/* Sized by the pane, not by its text, so the checklist sets the row's height. */}
                <div className="relative min-h-0 flex-1 overflow-hidden [contain:size]">
                  <div className="[mask-image:linear-gradient(to_bottom,black_70%,transparent)] absolute inset-0">
                    {typed === 0 ? (
                      <p className="text-[13px] text-muted-foreground">Waiting for the checklist</p>
                    ) : (
                      <Markdown blocks={ENTRY} upTo={typed} source={view === "source"} caret={typed < ENTRY_CHARS} />
                    )}
                    <div className="mt-4 opacity-50">
                      <Markdown blocks={EARLIER} source={view === "source"} />
                    </div>
                  </div>
                </div>
              </Pane>

              {/* 5. The commit, and the hook's check */}
              {/* Dark like a terminal, so it stays dark while it waits; only its words dim. */}
              <section className="relative bg-linear-to-b from-[#2b2b31] to-foreground px-4 pt-3 pb-3.5 text-[13px] leading-[1.6] lg:col-span-2">
                {hook === "now" && <span aria-hidden="true" className="pointer-events-none absolute inset-0 ring-2 ring-[#ff8a3d]/70 ring-inset" />}
                <header className="mb-1.5 flex items-center justify-between gap-3">
                  <p className={cn("flex items-center gap-2 text-[12.5px] font-semibold tracking-[-0.01em] transition-colors duration-500", hook === "next" ? "text-white/55" : "text-white")}>
                    <StepMark n={5} state={hook} dark />
                    Terminal
                  </p>
                  <span className="text-[12px] text-white/50">pre-commit hook</span>
                </header>
                <div className="min-h-[6.5rem] break-words">
                  {TERMINAL.map((line, i) => {
                    if (t < line.at) return null
                    if (line.kind === "command") {
                      const shownText = line.text.slice(0, Math.round(Math.min(1, (t - line.at) / COMMAND_TYPED) * line.text.length))
                      return (
                        <p key={i} className="text-white">
                          <span aria-hidden="true" className="mr-2 text-white/40">
                            $
                          </span>
                          {shownText}
                          {shownText.length < line.text.length && <Caret dark />}
                        </p>
                      )
                    }
                    return (
                      <p key={i} className={cn(line.kind === "ok" ? "font-medium text-[#ffb37a]" : line.kind === "dim" ? "text-white/55" : "text-white/85")}>
                        {line.text}
                      </p>
                    )
                  })}
                  {t >= TERMINAL[0].at + COMMAND_TYPED && t < TERMINAL[2].at && (
                    <p className="flex items-center gap-2 text-white/55">
                      <Busy /> running the hook
                    </p>
                  )}
                  {t < TERMINAL[0].at && <p className="text-white/35">Waiting for the log entry</p>}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* The steps: where the run is, and a way to jump or replay. */}
      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start">
        <ol className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((s, i) => {
            const state = stateOf(i)
            return (
              <li key={s.label}>
                <button
                  type="button"
                  onClick={() => jump(s.start)}
                  aria-current={state === "now" ? "step" : undefined}
                  className="flex w-full items-start gap-2.5 rounded-[10px] text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <StepMark n={i + 1} state={state} large />
                  <span className={cn("text-[14px] leading-[1.45] transition-colors duration-200", state === "next" ? "text-muted-foreground" : "text-foreground")}>
                    {s.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
        <div className="flex shrink-0 flex-col items-start gap-1.5 lg:items-end">
          <button
            type="button"
            onClick={() => jump(0)}
            className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-foreground ring-1 ring-foreground/12 transition-colors outline-none hover:bg-foreground/[0.04] focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowCounterClockwise weight="bold" className="size-3.5" aria-hidden="true" />
            Replay
          </button>
          <p className="text-[12.5px] text-muted-foreground">Point at the window to pause it.</p>
        </div>
      </div>
    </figure>
  )
}

/** A light pane of the window, numbered like the steps under it. */
function Pane({ n, title, note, state, className, children }: { n: number; title: string; note: ReactNode; state: State; className?: string; children: ReactNode }) {
  return (
    <section className={cn("relative flex flex-col bg-linear-to-b from-white to-[#fcfbf9] p-4 transition-opacity duration-500", state === "next" && "opacity-45", className)}>
      {state === "now" && <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 ring-2 ring-brand/45 ring-inset" />}
      <header className="mb-3 flex min-h-6 items-center justify-between gap-3">
        <p className="flex shrink-0 items-center gap-2 text-[12.5px] font-semibold tracking-[-0.01em] text-foreground">
          <StepMark n={n} state={state} />
          {title}
        </p>
        <span className="min-w-0 truncate text-[12px] text-muted-foreground">{note}</span>
      </header>
      {children}
    </section>
  )
}

/** A step's number: plain while it waits, outlined in orange while it runs, a check once done. */
function StepMark({ n, state, dark, large }: { n: number; state: State; dark?: boolean; large?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-medium tabular-nums ring-1 transition-colors duration-200",
        large ? "mt-px size-6 text-[12px]" : "size-[18px] text-[10.5px]",
        state === "done" && "bg-linear-to-b from-brand to-brand-deep text-white ring-brand",
        state === "now" && (dark ? "text-[#ffb37a] ring-[#ff8a3d]" : "text-brand-ink ring-brand"),
        state === "next" && (dark ? "text-white/60 ring-white/25" : "text-muted-foreground ring-foreground/15"),
      )}
    >
      {state === "done" ? <Check weight="bold" className={large ? "size-3" : "size-2.5"} /> : n}
    </span>
  )
}

/** A row's status: an empty circle, a turning one while it runs, then a check. */
function Mark({ state }: { state: State }) {
  if (state === "done") return <CheckCircle weight="fill" className="mt-px size-4 shrink-0 text-brand" aria-hidden="true" />
  if (state === "now") return <CircleNotch weight="bold" className="mt-px size-4 shrink-0 text-brand motion-safe:animate-spin" aria-hidden="true" />
  return <Circle className="mt-px size-4 shrink-0 text-foreground/20" aria-hidden="true" />
}

/** A quiet "working" mark: three dots that breathe in turn. */
function Busy() {
  return (
    <span aria-hidden="true" className="flex items-center gap-[3px]">
      {[0, 1, 2].map((i) => (
        <span key={i} className="busy-dot size-[4px] rounded-full bg-current" style={{ animationDelay: `${i * 160}ms` }} />
      ))}
    </span>
  )
}

/** Where the typing is. It stays solid, as a caret does while someone types. */
function Caret({ dark }: { dark?: boolean }) {
  return <span aria-hidden="true" className={cn("ml-px inline-block h-[1.05em] w-[1.5px] translate-y-[0.18em]", dark ? "bg-white/80" : "bg-brand")} />
}

/**
 * A little markdown, shown the way a markdown preview renders it, or as its
 * source. `upTo` reveals only that many characters of the text, for typing.
 */
function Markdown({ blocks, upTo = Infinity, source, caret }: { blocks: Block[]; upTo?: number; source?: boolean; caret?: boolean }) {
  let left = upTo
  let caretPlaced = false
  const out: ReactNode[] = []
  let items: ReactNode[] = []
  const flush = (key: string) => {
    if (!items.length) return
    out.push(
      <ul key={key} className={cn("space-y-1", !source && "list-disc pl-[1.1rem] marker:text-foreground/35")}>
        {items}
      </ul>,
    )
    items = []
  }

  blocks.forEach((block, b) => {
    if (left <= 0) return
    const segs: ReactNode[] = []
    for (const [s, seg] of block.segs.entries()) {
      if (left <= 0) break
      const text = seg.text.slice(0, left)
      left -= text.length
      if (seg.code && !source) {
        segs.push(
          <code key={s} className="rounded-[5px] bg-foreground/[0.06] px-1 py-px text-[0.94em] whitespace-nowrap text-foreground">
            {text}
          </code>,
        )
      } else if (seg.code) {
        segs.push(
          <span key={s}>
            <span className="text-faint">`</span>
            {text}
            {text.length === seg.text.length && <span className="text-faint">`</span>}
          </span>,
        )
      } else {
        segs.push(<span key={s}>{text}</span>)
      }
    }
    const typing = caret && !caretPlaced && left <= 0
    if (typing) caretPlaced = true

    if (block.kind === "h2") {
      flush(`ul${b}`)
      out.push(
        <p key={b} className={cn("mb-1.5 text-foreground", source ? "text-[13px]" : "text-[13.5px] font-semibold tracking-[-0.01em]")}>
          {source && <span className="font-normal text-faint">## </span>}
          {segs}
          {typing && <Caret />}
        </p>,
      )
    } else {
      items.push(
        <li key={b} className="text-[13px] leading-[1.55] break-words text-foreground/85">
          {source && <span className="text-faint">- </span>}
          {segs}
          {typing && <Caret />}
        </li>,
      )
    }
  })
  flush("ul-end")

  return <div>{out}</div>
}

/** The screen being looked at: framed while it's captured, a flash when it's saved. */
function Viewer({ index, t }: { index: number; t: number }) {
  const cap = index >= 0 ? CAPTURES[index] : null
  const at = index >= 0 ? CAPTURE_AT(index) : 0
  const framing = cap && t >= at + FRAMED && t < at + SAVED + 300
  const flash = cap && t >= at + SAVED && t < at + SAVED + 450
  const saved = cap && t >= at + SAVED

  return (
    <div className="relative flex h-[184px] items-center justify-center overflow-hidden rounded-[12px] bg-linear-to-b from-[#f3f1ed] to-[#ece9e4] ring-1 ring-foreground/[0.05]">
      {cap ? (
        <div key={index} className="relative motion-safe:animate-[appear_400ms_ease-out_both]">
          {cap.screen === "desktop" ? <DesktopScreen /> : <PhoneScreen screen={cap.screen} />}
          {flash && <span aria-hidden="true" className="shot-flash pointer-events-none absolute inset-0 rounded-[inherit] bg-white" />}
          {/* Viewfinder corners while it's captured */}
          <span aria-hidden="true" className={cn("pointer-events-none absolute -inset-2 transition-[opacity,scale] duration-300", framing ? "scale-100 opacity-100" : "scale-[1.04] opacity-0")}>
            <span className="absolute top-0 left-0 size-3.5 rounded-tl-[5px] border-t-2 border-l-2 border-brand" />
            <span className="absolute top-0 right-0 size-3.5 rounded-tr-[5px] border-t-2 border-r-2 border-brand" />
            <span className="absolute bottom-0 left-0 size-3.5 rounded-bl-[5px] border-b-2 border-l-2 border-brand" />
            <span className="absolute right-0 bottom-0 size-3.5 rounded-br-[5px] border-r-2 border-b-2 border-brand" />
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-linear-to-b from-brand to-brand-deep text-white shadow-[0_6px_14px_-6px_rgb(196_60_0/0.7)] transition-[opacity,scale] duration-300",
              saved ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
          >
            <Check weight="bold" className="size-3" />
          </span>
        </div>
      ) : (
        <p className="text-[13px] text-muted-foreground">Waiting for the tests</p>
      )}
    </div>
  )
}

/** The add form, as the app draws it. */
function AddRow({ small, focused }: { small?: boolean; focused?: boolean }) {
  return (
    <div className="flex gap-1">
      <span
        className={cn(
          "flex min-w-0 flex-1 items-center overflow-hidden rounded-[5px] bg-white whitespace-nowrap text-faint ring-1",
          small ? "h-[16px] px-1.5 text-[6.5px]" : "h-[21px] px-1.5 text-[8px]",
          focused ? "shadow-[0_0_0_2px_rgb(242_77_0/0.18)] ring-brand" : "ring-foreground/30",
        )}
      >
        Milk, eggs, bread…
      </span>
      <span className={cn("flex items-center rounded-[5px] bg-linear-to-b from-brand to-brand-deep font-semibold text-white", small ? "h-[16px] px-1.5 text-[6.5px]" : "h-[21px] px-2 text-[8px]")}>
        Add
      </span>
    </div>
  )
}

function ListRows({ items, small }: { items: string[]; small?: boolean }) {
  return (
    <ul className={small ? "mt-1.5" : "mt-2"}>
      {items.map((item) => (
        <li key={item} className={cn("border-b border-foreground/15 text-foreground", small ? "py-[3px] text-[7px]" : "py-[5px] text-[8.5px] leading-[1.3]")}>
          {item}
        </li>
      ))}
    </ul>
  )
}

/** The app at 375px wide, in this site's type and colour. */
function PhoneScreen({ screen }: { screen: Exclude<Screen, "desktop"> }) {
  return (
    <div className="h-[164px] w-[96px] overflow-hidden rounded-[13px] bg-background px-2 pt-2.5 shadow-[0_14px_28px_-18px_rgb(23_23_27/0.45)] ring-1 ring-foreground/10">
      <p className="font-serif text-[14px] leading-none font-light">Pantry</p>
      {screen === "error" && <p className="mt-2 text-[7px] leading-[1.35] text-brand-ink">Couldn&rsquo;t save the list. Free up space on your phone and try again.</p>}
      <div className="mt-2">
        <AddRow focused={screen !== "empty"} />
      </div>
      {screen === "empty" && <p className="mt-2.5 text-[7.5px] leading-[1.4] text-muted-foreground">Nothing on the list. Add something above.</p>}
      {screen === "two" && <ListRows items={["milk", "eggs"]} />}
      {screen === "error" && <ListRows items={["a very long item name like organic free-range extra large brown eggs", "bread", "milk", "eggs"]} />}
    </div>
  )
}

/** The same app at 1280px wide. */
function DesktopScreen() {
  return (
    <div className="h-[140px] w-[232px] overflow-hidden rounded-[10px] bg-background shadow-[0_14px_28px_-18px_rgb(23_23_27/0.45)] ring-1 ring-foreground/10">
      <div className="flex h-5 items-center gap-1 border-b border-foreground/[0.07] px-2">
        <span className="size-1 rounded-full bg-foreground/15" />
        <span className="size-1 rounded-full bg-foreground/15" />
        <span className="size-1 rounded-full bg-foreground/15" />
      </div>
      <div className="mx-auto w-[150px] pt-3">
        <p className="font-serif text-[13px] leading-none font-light">Pantry</p>
        <div className="mt-2">
          <AddRow small focused />
        </div>
        <ListRows small items={["milk", "eggs"]} />
      </div>
    </div>
  )
}
