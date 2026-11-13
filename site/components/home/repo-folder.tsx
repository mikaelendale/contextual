import type { CSSProperties } from "react"

import { Code, Lede, Section, SectionTitle } from "@/components/home/section"
import { Spark } from "@/components/spark"

/** What `init` and the skills put in a repo. `first` marks what the agent reads before it starts. */
const TREE: { name: string; depth: number; note?: string; first?: boolean }[] = [
  { name: "AGENTS.md", depth: 0, note: "The rules every session starts with", first: true },
  { name: "CLAUDE.md", depth: 0, note: "One line that points Claude Code at AGENTS.md" },
  { name: "context/", depth: 0 },
  { name: "idea.md", depth: 1, note: "Your plan, in your words. The agent never edits it" },
  { name: "build-plan.md", depth: 1, note: "Phases, each a list of features" },
  { name: "status/main.md", depth: 1, note: "Where the project stands, one file per branch", first: true },
  { name: "features/", depth: 1 },
  { name: "_index.md", depth: 2, note: "One line per feature", first: true },
  { name: "add-items/", depth: 2 },
  { name: "README.md", depth: 3, note: "What it does, and how you'll know it works", first: true },
  { name: "build, tests, notes, log", depth: 3, note: "How it's built and tested, and what happened" },
  { name: "stack/, design/, decisions/", depth: 1, note: "The tools, the look, and why things were chosen" },
  { name: ".agents/, .claude/", depth: 0, note: "The three skills your agent runs" },
]

const FACTS = [
  {
    title: "Read first, every time.",
    body: "The branch's status, the feature list and one feature's README. Never the whole folder, so the read stays small as the project grows.",
  },
  {
    title: "Written after every task.",
    body: "A dated log entry, ticked acceptance boxes and a fresh status file, so the next session starts where this one ended.",
  },
  {
    title: "Yours to read and change.",
    body: "It's plain markdown, next to your code. It branches and merges with the code, and you review it in pull requests like anything else.",
  },
]

export function RepoFolder() {
  return (
    <Section id="repo">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div className="lg:order-2">
          <SectionTitle lead="Your project's memory is" accent="a folder you can read." />
          <Lede>
            <Code>init</Code> lays it down and the skills fill it in. Nothing lives in a database or a vendor&rsquo;s
            cloud.
          </Lede>
          <div className="mt-10 flex flex-col gap-7">
            {FACTS.map((f) => (
              <div key={f.title}>
                <h3 className="font-serif text-[27px] leading-[1.12] font-light tracking-[-0.01em]">{f.title}</h3>
                <p className="mt-2 max-w-[30rem] text-[15.5px] leading-[1.6] text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        <figure className="lg:order-1">
          <ul aria-label="The files Contextual adds to a repo" className="flex flex-col gap-3.5">
            {TREE.map((row) => (
              <li key={`${row.depth}-${row.name}`} className="grid items-baseline gap-x-6 gap-y-0.5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                {/* The name, indented by depth, with the star when the agent reads it first. */}
                <span className="grid grid-cols-[1.25rem_1fr] items-baseline gap-x-1.5" style={{ paddingLeft: `${row.depth * 1.25}rem` }}>
                  <span className="self-center">{row.first && <Spark className="size-3.5 text-brand" />}</span>
                  <span className="text-[16.5px] font-medium text-foreground">{row.name}</span>
                </span>
                {row.note && (
                  <span className="pl-[calc(var(--d)*1.25rem+2.75rem)] text-[14.5px] leading-[1.5] text-muted-foreground sm:pl-0" style={{ "--d": row.depth } as CSSProperties}>
                    {row.note}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <figcaption className="mt-8 flex items-center gap-2.5 text-[14px] text-muted-foreground">
            <Spark className="size-3.5 shrink-0 text-brand" />
            What your agent reads before it starts. In the example project that&rsquo;s about 1,300 tokens.
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}
