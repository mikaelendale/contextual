import type { ComponentType, SVGProps } from "react"
import { ArrowUpRight } from "@phosphor-icons/react/ssr"

import { AntigravityMark, ClaudeCodeMark, CodexMark, OpenCodeMark } from "@/components/brand-marks"
import { InstallModule } from "@/components/install-module"
import { Lede, Section, SectionTitle } from "@/components/home/section"
import { NPM, REPO } from "@/lib/links"

/** Only what was really run: setup from a plan, then one feature (docs/trials in the repo). */
const AGENTS: { name: string; Mark?: ComponentType<SVGProps<SVGSVGElement>>; tint?: string; call: string; tested: string }[] = [
  { name: "Claude Code", Mark: ClaudeCodeMark, tint: "text-[#d97757]", call: "/contextual-next", tested: "Tested" },
  { name: "Codex", Mark: CodexMark, call: "$contextual-next", tested: "Tested" },
  { name: "OpenCode", Mark: OpenCodeMark, call: "@contextual-next", tested: "Tested" },
  { name: "Antigravity", Mark: AntigravityMark, call: "/contextual-next", tested: "Not tested yet" },
]

const LINK =
  "inline-flex items-center gap-1.5 text-[15px] font-medium text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors outline-none hover:decoration-brand focus-visible:ring-3 focus-visible:ring-ring"

export function WorksWith() {
  return (
    <Section id="get" className="flex flex-col items-center text-center">
      <SectionTitle lead="Works with the agents" accent="you already use." />
      <Lede className="mx-auto">
        Contextual is built on the two standards coding agents share: AGENTS.md for the rules, and agent skills for
        the steps. Say the sentence, or call the skill by name.
      </Lede>

      <ul className="mt-12 grid w-full max-w-[60rem] grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-4">
        {AGENTS.map(({ name, Mark, tint, call, tested }) => (
          <li key={name} className="flex flex-col items-center">
            <span className="inline-flex items-center gap-2 text-[18px] font-medium text-foreground">
              {Mark && <Mark className={`size-[1.05em] ${tint ?? ""}`} />}
              {name}
            </span>
            <span className="mt-2 text-[15px] text-muted-foreground">{call}</span>
            <span className={`mt-1 text-[13.5px] font-medium ${tested === "Tested" ? "text-brand-ink" : "text-muted-foreground"}`}>{tested}</span>
          </li>
        ))}
      </ul>

      <div className="mt-16 flex w-full flex-col items-center">
        <InstallModule className="w-full max-w-[36rem]" />
        <p className="mt-4 text-[14px] text-muted-foreground">In a git repo, with Node.js 20 or newer. Free and open source, MIT licensed.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <a href={REPO} target="_blank" rel="noopener noreferrer" className={LINK}>
            Read the docs on GitHub
            <ArrowUpRight weight="bold" className="size-3.5" />
          </a>
          <a href={NPM} target="_blank" rel="noopener noreferrer" className={LINK}>
            usecontextual on npm
            <ArrowUpRight weight="bold" className="size-3.5" />
          </a>
        </div>
      </div>
    </Section>
  )
}
