import Image from "next/image"

import { Code, Lede, Section, SectionTitle } from "@/components/home/section"
import { LiveDither } from "@/components/live-dither"

const POINTS = [
  {
    title: "It looks before it says pass.",
    body: "For anything with a screen, the agent runs a design checklist and records the result. It may write pass only when it names the screenshot or the tool it checked with.",
  },
  {
    title: "A commit carries its record.",
    body: "On a feature branch, the git hook stops a commit that changes a feature's code without its log entry and the branch's status file. On main it only warns.",
  },
  {
    title: "Free checks, no AI.",
    body: "npx usecontextual check validates the whole context, and which <path> tells you which feature owns a file. Both run in milliseconds and cost nothing.",
  },
]

export function Checked() {
  return (
    <Section id="checked">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <figure className="order-2 lg:order-none">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[27rem] overflow-hidden rounded-[22px] bg-linear-to-b from-[#db3300] to-[#ff9b45] shadow-[0_28px_50px_-30px_rgb(219_51_0/0.55)] ring-1 ring-black/5">
            <LiveDither
              className="absolute inset-0"
              image="/dither/card-work.webp"
              colorBack="#c43000"
              colorFront="#ff6a14"
              colorHighlight="#fff4ea"
              originY={0.3}
            />
            <Image
              src="/shots/pantry-add-items-375.png"
              width={375}
              height={812}
              alt="A shopping list app on a phone screen: an Add field and button, with milk and eggs on the list."
              className="absolute top-[9%] left-1/2 h-[91%] w-auto -translate-x-1/2 rounded-t-[26px] shadow-[0_24px_60px_-20px_rgb(80_20_0/0.6)] ring-1 ring-black/10"
            />
          </div>
          <figcaption className="mx-auto mt-5 max-w-[27rem] text-[14px] leading-[1.6] text-muted-foreground">
            A screen from one of our test runs. The agent built it, took this screenshot in a browser, ran the design
            checklist and wrote the result in the feature&rsquo;s log.
          </figcaption>
        </figure>

        <div className="order-1 lg:order-none">
          <SectionTitle lead="Done means" accent="checked, not claimed." />
          <Lede>A passing build isn&rsquo;t proof. The skills make your agent show its work, and a git hook keeps the record straight.</Lede>
          <div className="mt-8 flex flex-col gap-6">
            {POINTS.map((p) => (
              <div key={p.title}>
                <h3 className="font-serif text-[27px] leading-[1.12] font-light tracking-[-0.01em]">{p.title}</h3>
                <p className="mt-2 max-w-[32rem] text-[15.5px] leading-[1.6] text-muted-foreground">
                  {p.body.split(/(npx usecontextual check|which <path>)/).map((part, i) =>
                    i % 2 ? <Code key={i}>{part}</Code> : part,
                  )}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-7 max-w-[32rem] rounded-2xl border border-foreground/10 bg-linear-to-b from-white to-[#fbfaf8] px-5 py-3.5 text-[14px] leading-[1.6] text-muted-foreground">
            <span className="font-medium text-foreground">From that feature&rsquo;s log: </span>
            Deslop: pass (Playwright screenshots add-items-empty-375.png, add-items-two-375.png, …; one primary button, focus
            ring seen on field and button, no sideways scroll at 375px …)
          </p>
        </div>
      </div>
    </Section>
  )
}
