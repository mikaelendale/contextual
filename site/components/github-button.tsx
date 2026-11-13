import type { ComponentType } from "react"
import { GitCommit, GitFork, GithubLogo, Star, Users } from "@phosphor-icons/react/ssr"

import { getRepoStats } from "@/lib/github"
import { REPO, REPO_NAME } from "@/lib/links"
import { cn } from "@/lib/utils"

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })
const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
const count = (n: number, one: string, many: string) => `${compact.format(n)} ${n === 1 ? one : many}`

/**
 * The header's GitHub link, with the repo's star count on it. Pointing at it,
 * or tabbing to it, opens a card with the rest of the repo's numbers.
 */
export async function GitHubButton({ className }: { className?: string }) {
  const stats = await getRepoStats()
  const label = stats
    ? `GitHub: ${count(stats.stars, "star", "stars")}, ${count(stats.contributors, "contributor", "contributors")}, ${count(stats.commits, "commit", "commits")}`
    : "GitHub"

  return (
    <div className={cn("group/gh relative", className)}>
      <a
        href={REPO}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="inline-flex h-9 items-center rounded-full border border-white/55 bg-white/5 text-[14px] font-medium text-white backdrop-blur-sm transition-colors outline-none hover:bg-white/15 focus-visible:ring-3 focus-visible:ring-white/50"
      >
        <span className={cn("flex items-center gap-2 pl-4", stats ? "pr-3" : "pr-4")}>
          <GithubLogo weight="fill" className="size-4" />
          GitHub
        </span>
        {stats && (
          <span className="flex h-full items-center gap-1.5 border-l border-white/35 pr-4 pl-3 tabular-nums">
            <Star weight="fill" className="size-3.5" />
            {compact.format(stats.stars)}
          </span>
        )}
      </a>

      {stats && (
        // The same numbers are in the link's label, so screen readers skip the card.
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-full right-0 z-30 w-[19.5rem] translate-y-1 pt-2.5 opacity-0 transition-[opacity,translate] duration-200 group-focus-within/gh:translate-y-0 group-focus-within/gh:opacity-100 group-hover/gh:pointer-events-auto group-hover/gh:translate-y-0 group-hover/gh:opacity-100 max-sm:hidden"
        >
          <div className="rounded-[16px] bg-linear-to-b from-white to-[#fbfaf8] p-4 text-left text-foreground shadow-[0_24px_48px_-20px_rgb(90_25_0/0.55)] ring-1 ring-black/[0.06]">
            <p className="flex items-center gap-2 text-[14px] font-semibold tracking-[-0.01em]">
              <GithubLogo weight="fill" className="size-4" />
              {REPO_NAME}
            </p>
            {stats.description && <p className="mt-1.5 line-clamp-2 text-[13px] leading-[1.5] text-muted-foreground">{stats.description}</p>}
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              <Stat Icon={Star} value={stats.stars} one="Star" many="Stars" />
              <Stat Icon={GitFork} value={stats.forks} one="Fork" many="Forks" />
              <Stat Icon={Users} value={stats.contributors} one="Contributor" many="Contributors" />
              <Stat Icon={GitCommit} value={stats.commits} one="Commit" many="Commits" />
            </dl>
            <p className="mt-4 border-t border-foreground/[0.07] pt-3 text-[12.5px] text-muted-foreground">
              {stats.license ? `${stats.license} licensed · ` : ""}Last push {day.format(new Date(stats.pushedAt))}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ Icon, value, one, many }: { Icon: ComponentType<{ className?: string }>; value: number; one: string; many: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-linear-to-b from-brand-soft to-white text-brand-ink ring-1 ring-brand/15">
        <Icon className="size-4" />
      </span>
      {/* The term comes first, as a list of terms needs; the number shows on top. */}
      <div className="flex min-w-0 flex-col-reverse">
        <dt className="text-[12px] text-muted-foreground">{value === 1 ? one : many}</dt>
        <dd className="text-[15px] leading-tight font-semibold tabular-nums">{compact.format(value)}</dd>
      </div>
    </div>
  )
}
