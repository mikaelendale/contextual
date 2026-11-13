import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"
import { Suspense } from "react"

import { signIn, signOut } from "@/app/agent/feedback/reports/actions"
import { PANEL } from "@/components/home/plate"
import { Logo } from "@/components/logo"
import { listReports, type StoredReport } from "@/lib/feedback/db.ts"
import { OWNER_COOKIE, isOwner } from "@/lib/feedback/owner.ts"
import { CHOICES, LABELS } from "@/lib/feedback/report.ts"
import { cn } from "@/lib/utils"
import { visitTotals, type VisitTotals } from "@/lib/visits/db.ts"

export const metadata: Metadata = {
  title: "Agent feedback reports",
  robots: { index: false, follow: false },
}

type Search = Record<string, string | string[] | undefined>
const one = (value: string | string[] | undefined) => (typeof value === "string" ? value : undefined)

/** The owner's list of reports, and the home page's visits. Everything in a report comes from people's forms, so it's shown as plain text. */
export default function ReportsPage({ searchParams }: { searchParams: Promise<Search> }) {
  return (
    <div className="min-h-svh bg-background">
      <header className="mx-auto flex h-18 w-full max-w-[72rem] items-center px-5 sm:px-8">
        <Link href="/" className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring">
          <Logo />
        </Link>
      </header>
      <main className="mx-auto w-full max-w-[72rem] px-5 pt-6 pb-24 sm:px-8">
        <h1 className="font-serif text-[clamp(2.2rem,1.5rem+2.3vw,3.2rem)] leading-[1.06] font-light tracking-[-0.02em]">
          Agent feedback <em className="text-brand">reports.</em>
        </h1>
        <Suspense fallback={<p className="mt-8 text-[15px] text-muted-foreground">Loading…</p>}>
          <Reports searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  )
}

async function Reports({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams
  const cookie = (await cookies()).get(OWNER_COOKIE)?.value
  if (!process.env.FEEDBACK_REPORTS_SECRET) {
    return <Panel>The list isn&rsquo;t set up: the FEEDBACK_REPORTS_SECRET environment variable is missing, so nobody can open it.</Panel>
  }
  if (!isOwner(cookie)) return <SignIn wrong={one(params.wrong) === "1"} />

  const filters = { harness: one(params.harness), category: one(params.category), severity: one(params.severity) }
  const [listed, counted] = await Promise.allSettled([listReports(filters), visitTotals()])
  const reports: StoredReport[] | null = listed.status === "fulfilled" ? listed.value : null
  const failed = listed.status === "rejected"

  return (
    <>
      {counted.status === "rejected" && <Panel>The visits couldn&rsquo;t be read from the database. Check DATABASE_URL, and that 0002_page_visits.sql has run.</Panel>}
      {counted.status === "fulfilled" && counted.value && <Visits totals={counted.value} />}

      <form method="get" className={cn(PANEL, "mt-8 flex flex-wrap items-end gap-4 p-5")}>
        <Filter name="harness" label="Agent" value={filters.harness} options={CHOICES.harness} />
        <Filter name="category" label="Kind" value={filters.category} options={CHOICES.category} />
        <Filter name="severity" label="How much" value={filters.severity} options={CHOICES.severity} />
        <button type="submit" className="h-10 rounded-full bg-linear-to-b from-[#2b2b31] to-foreground px-5 text-[14px] font-medium text-white outline-none focus-visible:ring-3 focus-visible:ring-ring">
          Filter
        </button>
        <Link href="/agent/feedback/reports" className="h-10 content-center text-[14px] font-medium underline decoration-foreground/25 underline-offset-4">
          Clear
        </Link>
      </form>

      {failed && <Panel>The reports couldn&rsquo;t be read from the database. Check DATABASE_URL and the table.</Panel>}
      {reports === null && !failed && <Panel>The database isn&rsquo;t set up: DATABASE_URL is missing.</Panel>}
      {reports && reports.length === 0 && <Panel>No reports{filters.harness || filters.category || filters.severity ? " match these filters" : " yet"}.</Panel>}
      {reports && reports.length > 0 && (
        <>
          <p className="mt-8 text-[14px] text-muted-foreground">
            {reports.length} {reports.length === 1 ? "report" : "reports"}, newest first
          </p>
          <ol className="mt-3 grid gap-4">
            {reports.map((r) => (
              <li key={r.id} className={cn(PANEL, "p-5 sm:p-6")}>
                <p className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
                  <time dateTime={r.createdAt}>{r.createdAt.slice(0, 16).replace("T", " ")} UTC</time>
                  <span>{LABELS[r.harness] ?? r.harness}</span>
                  <span>{r.model}</span>
                  <span>{LABELS[r.skill] ?? r.skill}</span>
                </p>
                <p className="mt-2 flex flex-wrap gap-2 text-[13px] font-medium">
                  <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-brand-ink">{LABELS[r.category] ?? r.category}</span>
                  <span className="rounded-full bg-foreground/[0.06] px-2.5 py-0.5">{LABELS[r.severity] ?? r.severity}</span>
                  {r.file && <span className="rounded-full bg-foreground/[0.06] px-2.5 py-0.5">{r.file}</span>}
                </p>
                <Field label="What happened" text={r.happened} />
                <Field label="What the agent expected" text={r.expected} />
                {r.suggestion && <Field label="A change that would help" text={r.suggestion} />}
                <p className="mt-4 text-[12.5px] text-muted-foreground">
                  Contextual {r.contextual} · {r.os} · {r.packageManager} · folders {r.harnessFolders.join(", ") || "none"} · check{" "}
                  {r.checkErrors ?? "?"} errors, {r.checkWarnings ?? "?"} warnings · features {r.features}
                </p>
              </li>
            ))}
          </ol>
        </>
      )}
      <form action={signOut} className="mt-10">
        <button type="submit" className="text-[14px] font-medium underline decoration-foreground/25 underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Sign out
        </button>
      </form>
    </>
  )
}

const whole = new Intl.NumberFormat("en-US")
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 })
const figure = (n: number) => (n < 10_000 ? whole.format(n) : compact.format(n))

/** Visits to the home page: a browser counts once per 30-minute session. Days are UTC. */
function Visits({ totals }: { totals: VisitTotals }) {
  const tiles = [
    { label: "Today", value: totals.today },
    { label: "Last 7 days", value: totals.week },
    { label: "Last 30 days", value: totals.month },
    { label: "All time", value: totals.all },
  ]
  const since = totals.since ? new Date(`${totals.since}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : null
  return (
    <section aria-labelledby="visits-title" className={cn(PANEL, "mt-8 p-5 sm:p-6")}>
      <h2 id="visits-title" className="text-[15px] font-medium">
        Home page visits
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label}>
            <dt className="text-[13px] text-muted-foreground">{t.label}</dt>
            <dd className="mt-1 text-[27px] leading-none font-semibold tracking-[-0.01em]">{figure(t.value)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-[13px] text-muted-foreground">
        {since ? `Counted since ${since}.` : "No visits counted yet."} A browser counts once per 30 minutes. Days are UTC.
      </p>
    </section>
  )
}

function SignIn({ wrong }: { wrong: boolean }) {
  return (
    <form action={signIn} className={cn(PANEL, "mt-8 grid max-w-[28rem] gap-3 p-6")}>
      <label htmlFor="secret" className="text-[14px] font-medium">
        The reports secret
      </label>
      <input
        id="secret"
        name="secret"
        type="password"
        autoComplete="current-password"
        required
        className="h-11 rounded-[10px] border border-[#86868e] bg-white px-3 text-[15px] outline-none focus-visible:border-brand-ink focus-visible:ring-3 focus-visible:ring-brand/25"
      />
      {wrong && (
        <p role="alert" className="text-[14px] font-medium text-[#b42318]">
          That isn&rsquo;t the secret.
        </p>
      )}
      <button type="submit" className="h-11 rounded-full bg-linear-to-b from-[#2b2b31] to-foreground px-6 text-[15px] font-medium text-white outline-none focus-visible:ring-3 focus-visible:ring-ring">
        Open the list
      </button>
    </form>
  )
}

function Filter({ name, label, value, options }: { name: string; label: string; value?: string; options: readonly string[] }) {
  return (
    <label className="grid gap-1.5 text-[13px] font-medium">
      {label}
      <select
        name={name}
        defaultValue={value && options.includes(value) ? value : ""}
        className="h-10 min-w-40 rounded-[10px] border border-[#86868e] bg-white px-3 text-[14px] outline-none focus-visible:border-brand-ink focus-visible:ring-3 focus-visible:ring-brand/25"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {LABELS[o] ?? o}
          </option>
        ))}
      </select>
    </label>
  )
}

function Field({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-4">
      <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-[15px] leading-[1.6] whitespace-pre-wrap break-words">{text}</p>
    </div>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return <p className={cn(PANEL, "mt-8 p-6 text-[15px] text-muted-foreground")}>{children}</p>
}
