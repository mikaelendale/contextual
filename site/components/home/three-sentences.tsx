import { ArrowUpRight } from "@phosphor-icons/react/ssr"

import { Code, Lede, Section, SectionTitle } from "@/components/home/section"
import { REPO } from "@/lib/links"

const SENTENCES = [
  {
    say: "set up contextual",
    does: "Writes your project's context: from your plan file, from five questions about your idea, or from the code that's already there. When it reads existing code, nothing is written until you confirm how it split it into features.",
  },
  {
    say: "build the next feature",
    does: "Builds one feature on its own branch. It writes the tests, looks at every screen it changed, records what it did, and stops so you can review and merge.",
  },
  {
    say: "sync the context",
    does: "After you edit code by hand or merge a branch, it brings the context back in line, and names any file no feature owns.",
  },
]

export function ThreeSentences() {
  return (
    <Section id="start">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <SectionTitle lead="Three sentences" accent="run the whole build." />
          <Lede>
            Run <Code>npx usecontextual init</Code> once in your repo. After that you talk to your coding agent in
            plain words. Each sentence starts a skill, and every skill reads the context before it works and
            writes it back after.
          </Lede>
          <p className="mt-8 max-w-[34rem] text-[15px] leading-[1.6] text-muted-foreground">
            No plan yet?{" "}
            <a
              href={`${REPO}/blob/main/skills/contextual-plan/prompt.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-1 font-medium text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors outline-none hover:decoration-brand focus-visible:ring-3 focus-visible:ring-ring"
            >
              Paste the planning prompt
              <ArrowUpRight weight="bold" className="size-3.5 self-center" />
            </a>{" "}
            into any AI chat. It gives you one file, <Code>contextual-plan.md</Code>, to start from.
          </p>
        </div>

        <ol className="flex flex-col gap-11 lg:pt-2">
          {SENTENCES.map((s, i) => (
            <li key={s.say} className="grid grid-cols-[2.25rem_1fr] gap-x-4">
              <span className="pt-2.5 text-[13.5px] font-medium text-faint tabular-nums">0{i + 1}</span>
              <div>
                <h3 className="font-serif text-[27px] leading-[1.12] font-light tracking-[-0.01em] italic">
                  <span className="text-brand">“</span>
                  {s.say}
                  <span className="text-brand">”</span>
                </h3>
                <p className="mt-2.5 max-w-[32rem] text-[15.5px] leading-[1.6] text-muted-foreground">{s.does}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
