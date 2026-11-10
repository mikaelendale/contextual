import { Fragment, type CSSProperties, type ComponentType, type ReactNode, type SVGProps } from "react"
import { ArrowUpRight } from "@phosphor-icons/react/ssr"

import { ClaudeCodeMark, CodexMark } from "@/components/brand-marks"
import { LiveDither } from "@/components/live-dither"
import { Logo } from "@/components/logo"
import { VisitCounter } from "@/components/visit-counter"
import { Sky } from "@/components/sky"
import { cn } from "@/lib/utils"

/** A product named inline, with its real mark. */
function Named({
  Mark,
  tint,
  children,
}: {
  Mark: ComponentType<SVGProps<SVGSVGElement>>
  tint?: string
  children: ReactNode
}) {
  return (
    <span className="inline-flex items-baseline gap-[0.3em] font-medium whitespace-nowrap text-foreground">
      <Mark className={cn("size-[0.95em] translate-y-[0.12em] self-baseline", tint)} />
      {children}
    </span>
  )
}

/** Where people follow along. Set NEXT_PUBLIC_CHANNEL_URL to turn the call to action into a link. */
const CHANNEL_URL = process.env.NEXT_PUBLIC_CHANNEL_URL ?? ""

/** A headline line whose words arrive one by one, starting `base` ms after load. */
function Words({ text, base, className }: { text: string; base: number; className?: string }) {
  const words = text.split(" ")
  return (
    <span aria-hidden="true" className={cn("block", className)}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="word-in" style={{ "--i": i, "--base": `${base}ms` } as CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  )
}

function LiveDot() {
  return (
    <span aria-hidden="true" className="relative flex size-2.5">
      <span className="live absolute inset-0 rounded-full bg-[#ff9b45]" />
      <span className="relative size-2.5 rounded-full bg-brand" />
    </span>
  )
}

/** "Stay tuned": a button to the channel when it's set, a quiet status pill until then. */
function ChannelCta() {
  if (CHANNEL_URL) {
    return (
      <a
        href={CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group/cta inline-flex h-12 items-center gap-2.5 rounded-full bg-linear-to-b from-[#2b2b31] to-foreground pr-5 pl-4 text-[15px] font-medium text-background shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_14px_30px_-14px_rgb(23_23_27/0.55)] transition-[filter] outline-none hover:brightness-125 focus-visible:ring-3 focus-visible:ring-ring"
      >
        <LiveDot />
        Stay tuned to the channel
        <ArrowUpRight weight="bold" className="size-4 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
      </a>
    )
  }
  return (
    <p className="inline-flex h-11 items-center gap-2.5 rounded-full border border-foreground/10 px-5 text-[15px] font-medium">
      <LiveDot />
      Stay tuned to the channel
    </p>
  )
}

const STEPS = [
  {
    image: "/dither/card-read.webp",
    when: "Before every task",
    title: "It reads first",
    body: "It opens the build plan, features, setup steps and live status before touching code.",
  },
  {
    image: "/dither/card-work.webp",
    when: "While it works",
    title: "It works from facts",
    body: "It answers from a reliable source, not a guess, so it hallucinates less.",
  },
  {
    image: "/dither/card-write.webp",
    when: "After every task",
    title: "It writes it down",
    body: "It records what's done and what's next, so the next session picks up there.",
  },
]

export default function Home() {
  return (
    <div className="relative min-h-svh overflow-x-clip bg-background">
      <Sky className="absolute inset-x-0 top-0 h-[46svh] min-h-[340px] sm:h-[66svh] sm:min-h-[440px]" />

      <header className="relative z-10 mx-auto flex h-18 w-full max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <Logo tone="light" className="[text-shadow:0_0_10px_rgb(140_28_0/0.45)]" />
        {CHANNEL_URL ? (
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center rounded-full border border-white/55 bg-white/5 px-4 text-[14px] font-medium text-white backdrop-blur-sm transition-colors outline-none hover:bg-white/15 focus-visible:ring-3 focus-visible:ring-white/50"
          >
            Join the channel
          </a>
        ) : (
          <span className="rise text-[14px] font-medium text-white [text-shadow:0_0_10px_rgb(140_28_0/0.55)] [--delay:200ms]">Coming soon</span>
        )}
      </header>

      <main>
        <section className="pointer-events-none relative z-10 flex flex-col items-center px-5 pt-[max(13rem,calc(46svh-7.5rem))] pb-28 text-center sm:min-h-[calc(100svh-4.5rem)] sm:justify-end sm:px-8 sm:pt-0 sm:pb-[max(4.5rem,10svh)]">
          <h1
            aria-label="Explain your project once. Your agent remembers the rest."
            className="pointer-events-auto relative font-serif text-balance before:pointer-events-none before:animate-[appear_1.4s_ease-out_both] motion-reduce:before:animate-none before:absolute before:-inset-x-[12%] before:-inset-y-[38%] before:-z-10 before:bg-[radial-gradient(closest-side,rgb(247_245_242/0.92)_30%,rgb(247_245_242/0.6)_62%,transparent)] before:blur-md text-[clamp(2.45rem,min(1.2rem+4.6vw,1rem+7.2svh),5.1rem)] leading-[1.03] font-light tracking-[-0.025em]">
            <Words text="Explain your project once." base={250} />
            <Words text="Your agent remembers the rest." base={620} className="text-brand italic" />
          </h1>
          <p className="blur-in pointer-events-auto mt-[clamp(1rem,3svh,1.75rem)] max-w-[37rem] text-[17px] leading-[1.65] text-pretty text-muted-foreground [--delay:1000ms] sm:text-[18px]">
            Contextual is an open source context structure that gives{" "}
            <Named Mark={ClaudeCodeMark} tint="text-[#d97757]">
              Claude Code
            </Named>{" "}
            and <Named Mark={CodexMark}>Codex</Named> persistent memory of your project.
            Less guessing, less prompting, and code that fits the first time.
          </p>
          <div id="stay" className="blur-in pointer-events-auto mt-[clamp(1.5rem,4svh,2.25rem)] scroll-mt-28 [--delay:1150ms]">
            <ChannelCta />
          </div>
          <VisitCounter className="blur-in mt-4 [--delay:1300ms]" />
        </section>

        <section id="how" className="mx-auto flex min-h-svh w-full max-w-[1240px] scroll-mt-0 flex-col justify-center pt-[8svh] pb-[11svh]">
          <div className="mx-auto max-w-[44rem] px-5 text-center sm:px-8">
            <h2 className="font-serif text-[clamp(2.2rem,1.5rem+2.3vw,3.2rem)] leading-[1.06] font-light tracking-[-0.02em] text-balance">
              Every session starts where <em className="text-brand">the last one ended.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-[40rem] text-[16px] leading-[1.65] text-pretty text-muted-foreground sm:text-[17px]">
              Contextual is a set of plain markdown files that live in your repo. A
              companion skill builds them from your codebase and keeps them current as
              you work.
            </p>
          </div>

          {/* One row of three; on phones, a row you swipe. */}
          <ol className="mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:scroll-px-8 sm:px-8 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-10 [&::-webkit-scrollbar]:hidden">
            {STEPS.map((step, i) => (
              <li key={step.title} className="w-[84%] shrink-0 snap-start sm:w-[58%] lg:w-auto">
                <div className="relative aspect-[16/11] max-h-[max(8rem,calc(100svh-32rem))] w-full overflow-hidden rounded-[22px] bg-linear-to-b from-[#db3300] to-[#ff9b45] shadow-[0_28px_50px_-30px_rgb(219_51_0/0.55)] ring-1 ring-black/5">
                  <LiveDither
                    className="absolute inset-0"
                    image={step.image}
                    colorBack="#c43000"
                    colorFront="#ff6a14"
                    colorHighlight="#fff4ea"
                    originY={0.3}
                  />
                </div>
                <p className="mt-6 text-[13.5px] font-medium text-brand-ink">
                  <span className="text-faint tabular-nums">0{i + 1}</span>
                  <span className="mx-2 text-faint">·</span>
                  {step.when}
                </p>
                <h3 className="mt-2.5 font-serif text-[27px] leading-[1.12] font-light tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[24rem] text-[15.5px] leading-[1.6] text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="pb-10 text-center text-[13px] text-faint sm:pb-28">
        © 2026 Contextual · Free and open source
      </footer>

      {/* Quiet navigation under a soft blur, always in reach. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-24 max-sm:hidden">
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/75 to-transparent backdrop-blur-[3px] [mask-image:linear-gradient(to_top,black_40%,transparent)]" />
        <nav
          aria-label="Page"
          className="pointer-events-auto absolute inset-x-0 bottom-5 flex justify-center gap-8 text-[13.5px] font-medium text-muted-foreground"
        >
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href={CHANNEL_URL || "#stay"} className="transition-colors hover:text-foreground">
            Stay tuned
          </a>
        </nav>
      </div>
    </div>
  )
}
