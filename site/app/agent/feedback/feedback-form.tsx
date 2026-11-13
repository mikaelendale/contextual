"use client"

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react"
import { ArrowUpRight, Check } from "@phosphor-icons/react"

import { PANEL } from "@/components/home/plate"
import { REPO } from "@/lib/links"
import { CHOICES, FILE_CAP, LABELS, MODEL_CAP, TEXT_CAP, readFragment } from "@/lib/feedback/report.ts"
import { cn } from "@/lib/utils"

type Choice = keyof typeof CHOICES
type Draft = {
  harness: string
  model: string
  skill: string
  category: string
  severity: string
  happened: string
  expected: string
  suggestion: string
  file: string
}
type Auto = {
  contextual: string
  os: string
  packageManager: string
  harnessFolders: string[]
  check: { errors: number | null; warnings: number | null }
  features: string
}

const text = (value: unknown, cap: number) => (typeof value === "string" ? value.slice(0, cap) : "")
const choice = (field: Choice, value: unknown) => ((CHOICES[field] as readonly string[]).includes(value as string) ? (value as string) : "")

/** The fields as the agent filled them, kept to what the form allows. */
function toDraft(raw: Record<string, unknown>): { draft: Draft; auto: Auto } {
  const check = (raw.check && typeof raw.check === "object" ? raw.check : {}) as Record<string, unknown>
  const num = (v: unknown) => (Number.isInteger(v) ? (v as number) : null)
  return {
    draft: {
      harness: choice("harness", raw.harness),
      model: text(raw.model, MODEL_CAP),
      skill: choice("skill", raw.skill),
      category: choice("category", raw.category),
      severity: choice("severity", raw.severity),
      happened: text(raw.happened, TEXT_CAP),
      expected: text(raw.expected, TEXT_CAP),
      suggestion: text(raw.suggestion, TEXT_CAP),
      file: text(raw.file, FILE_CAP),
    },
    auto: {
      contextual: text(raw.contextual, 32) || "unknown",
      os: text(raw.os, 16) || "other",
      packageManager: text(raw.packageManager, 8) || "none",
      harnessFolders: Array.isArray(raw.harnessFolders) ? raw.harnessFolders.filter((f): f is string => typeof f === "string").slice(0, 5) : [],
      check: { errors: num(check.errors), warnings: num(check.warnings) },
      features: text(raw.features, 8) || "none",
    },
  }
}

const subscribeToHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange)
  return () => window.removeEventListener("hashchange", onChange)
}

/** The review form. It reads the report from the link's fragment, which never reaches a server, and sends only on Send. */
export function FeedbackForm() {
  // Null on the server and while hydrating: the fragment exists only in the browser.
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash, () => null)
  if (hash === null) return <Note>Reading the report from the link…</Note>
  const raw = readFragment(hash)
  if (raw === null && !hash.includes("report=")) {
    return (
      <Note>
        This page opens from <span className="font-medium text-foreground">usecontextual feedback</span>, with a report in the link. This
        link has none, so there&rsquo;s nothing to send.
      </Note>
    )
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return <Note>The report in this link can&rsquo;t be read; it may have been cut off when it was copied. Ask your agent to run the command again.</Note>
  }
  return <Review key={hash} {...toDraft(raw as Record<string, unknown>)} />
}

function Review({ draft: initialDraft, auto }: { draft: Draft; auto: Auto }) {
  const [phase, setPhase] = useState<"editing" | "sending" | "sent">("editing")
  const [draft, setDraft] = useState<Draft>(initialDraft)
  const [error, setError] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState("")
  const sentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (phase === "sent") sentRef.current?.focus()
  }, [phase])

  if (phase === "sent") {
    return (
      <div ref={sentRef} tabIndex={-1} className={cn(PANEL, "mt-10 flex items-start gap-3 p-6 outline-none")} role="status">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-brand to-brand-deep text-white">
          <Check weight="bold" className="size-3.5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[16px] font-medium">Sent. Thank you.</p>
          <p className="mt-1 text-[15px] text-muted-foreground">The report is stored with the date, and nothing else about you. You can close this tab.</p>
        </div>
      </div>
    )
  }

  const body = {
    ...draft,
    contextual: auto.contextual,
    os: auto.os,
    packageManager: auto.packageManager,
    harnessFolders: auto.harnessFolders,
    check: auto.check,
    features: auto.features,
  }
  const set = (field: keyof Draft) => (value: string) => setDraft({ ...draft, [field]: value })
  const ready = draft.harness && draft.skill && draft.category && draft.severity && draft.happened.trim() && draft.expected.trim()

  async function send() {
    setError(null)
    setPhase("sending")
    try {
      const res = await fetch("/agent/feedback/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(honeypot ? { ...body, website: honeypot } : body),
      })
      const answer = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (res.ok && answer.ok) {
        // The draft lived in the fragment; take it out of the address bar and history now that it's sent.
        history.replaceState(null, "", window.location.pathname)
        setPhase("sent")
        return
      }
      setError(answer.error ?? "The report wasn't sent. Try again.")
    } catch {
      setError("The report couldn't reach the server, so it wasn't sent. Check the connection and try again.")
    }
    setPhase("editing")
  }

  return (
    <form
      className="mt-10"
      onSubmit={(e) => {
        e.preventDefault()
        if (ready && phase === "editing") send()
      }}
    >
      <section className={cn(PANEL, "p-5 sm:p-7")} aria-labelledby="report-heading">
        <h2 id="report-heading" className="text-[15px] font-semibold tracking-[-0.01em]">
          The report
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Select label="Agent" field="harness" value={draft.harness} onChange={set("harness")} />
          <TextInput label="Model" hint="As the agent reports it" value={draft.model} onChange={set("model")} max={MODEL_CAP} />
          <Select label="Skill in use" field="skill" value={draft.skill} onChange={set("skill")} />
          <TextInput label="Contextual file involved" hint="Optional" value={draft.file} onChange={set("file")} max={FILE_CAP} />
          <Select label="Kind of problem" field="category" value={draft.category} onChange={set("category")} />
          <Select label="How much it got in the way" field="severity" value={draft.severity} onChange={set("severity")} />
        </div>
        <div className="mt-6 grid gap-5">
          <TextArea label="What happened" value={draft.happened} onChange={set("happened")} required />
          <TextArea label="What the agent expected" value={draft.expected} onChange={set("expected")} required />
          <TextArea label="A change that would help" hint="Optional" value={draft.suggestion} onChange={set("suggestion")} />
        </div>
      </section>

      <section className={cn(PANEL, "mt-4 p-5 sm:p-7")} aria-labelledby="auto-heading">
        <h2 id="auto-heading" className="text-[15px] font-semibold tracking-[-0.01em]">
          Added by the CLI
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[14px] sm:grid-cols-3">
          <Fact term="Contextual" value={auto.contextual} />
          <Fact term="System" value={auto.os} />
          <Fact term="Package manager" value={auto.packageManager} />
          <Fact term="Agent folders" value={auto.harnessFolders.length ? auto.harnessFolders.join(", ") : "none"} />
          <Fact
            term="Check result"
            value={auto.check.errors === null ? "not run" : `${auto.check.errors} errors, ${auto.check.warnings ?? 0} warnings`}
          />
          <Fact term="Features" value={auto.features} />
        </dl>
      </section>

      <details className={cn(PANEL, "group mt-4 p-5 sm:px-7")}>
        <summary className="cursor-pointer text-[15px] font-semibold tracking-[-0.01em] outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Exactly what will be sent
        </summary>
        <pre className="mt-4 overflow-x-auto rounded-[10px] bg-foreground/[0.04] p-4 text-[13px] leading-[1.55] whitespace-pre-wrap break-words">
          {JSON.stringify(body, null, 2)}
        </pre>
      </details>

      {/* Hidden from people and assistive technology; a bot that fills it is ignored. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} name="website" />
        </label>
      </div>

      <p className="mt-6 max-w-[40rem] text-[14px] leading-[1.6] text-muted-foreground">
        Only the fields above are sent, as shown. The server stores them with the date, and no IP address or anything else about
        you. Nothing from your project is attached.{" "}
        <a
          href={`${REPO}/blob/main/docs/agent-feedback.md`}
          className="inline-flex items-center gap-1 font-medium text-foreground underline decoration-foreground/25 underline-offset-4 outline-none hover:decoration-brand focus-visible:ring-2 focus-visible:ring-ring"
          target="_blank"
          rel="noopener noreferrer"
        >
          What&rsquo;s collected
          <ArrowUpRight weight="bold" className="size-3" aria-hidden="true" />
        </a>
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="submit"
          disabled={!ready || phase === "sending"}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-linear-to-b from-[#2b2b31] to-foreground px-6 text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_14px_30px_-14px_rgb(23_23_27/0.55)] transition-[filter] outline-none hover:brightness-125 focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:brightness-100"
        >
          {phase === "sending" ? "Sending…" : "Send"}
        </button>
        <p className="text-[14px] text-muted-foreground">{ready ? "Closing this tab sends nothing." : "Choose each option and fill in the two required texts to send."}</p>
      </div>
      <p role="alert" className="mt-3 min-h-6 text-[14px] font-medium text-[#b42318]">
        {error}
      </p>
    </form>
  )
}

function Note({ children }: { children: ReactNode }) {
  return <p className={cn(PANEL, "mt-10 p-6 text-[15px] leading-[1.6] text-muted-foreground")}>{children}</p>
}

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col-reverse">
      <dd className="truncate font-medium text-foreground">{value}</dd>
      <dt className="text-[12.5px] text-muted-foreground">{term}</dt>
    </div>
  )
}

const FIELD =
  "w-full rounded-[10px] border border-[#86868e] bg-white px-3 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-faint focus-visible:border-brand-ink focus-visible:ring-3 focus-visible:ring-brand/25"

function Label({ id, label, hint }: { id: string; label: string; hint?: string }) {
  return (
    <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[14px] font-medium">
      {label}
      {hint && <span className="text-[12.5px] font-normal text-muted-foreground">{hint}</span>}
    </label>
  )
}

function Select({ label, field, value, onChange }: { label: string; field: Choice; value: string; onChange: (v: string) => void }) {
  const id = useId()
  return (
    <div className="grid gap-2">
      <Label id={id} label={label} />
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} required className={cn(FIELD, "h-11 cursor-pointer")}>
        <option value="" disabled>
          Choose…
        </option>
        {CHOICES[field].map((option) => (
          <option key={option} value={option}>
            {LABELS[option] ?? option}
          </option>
        ))}
      </select>
    </div>
  )
}

function TextInput({ label, hint, value, onChange, max }: { label: string; hint?: string; value: string; onChange: (v: string) => void; max: number }) {
  const id = useId()
  return (
    <div className="grid gap-2">
      <Label id={id} label={label} hint={hint} />
      <input id={id} value={value} maxLength={max} onChange={(e) => onChange(e.target.value)} className={cn(FIELD, "h-11")} />
    </div>
  )
}

function TextArea({ label, hint, value, onChange, required }: { label: string; hint?: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  const id = useId()
  const counter = `${id}-count`
  return (
    <div className="grid gap-2">
      <Label id={id} label={label} hint={hint} />
      <textarea
        id={id}
        value={value}
        maxLength={TEXT_CAP}
        required={required}
        rows={Math.min(12, Math.max(4, Math.ceil(value.length / 70) + 1))}
        aria-describedby={counter}
        onChange={(e) => onChange(e.target.value)}
        // Grows with its text where the browser supports it; the rows above are the fallback.
        className={cn(FIELD, "min-h-28 resize-y py-2.5 leading-[1.55] [field-sizing:content]")}
      />
      <p id={counter} className="text-right text-[12.5px] text-muted-foreground tabular-nums">
        {value.length} / {TEXT_CAP}
      </p>
    </div>
  )
}
