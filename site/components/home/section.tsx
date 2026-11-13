import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** One screen tall, content centered: every section of the page uses this frame. */
export function Section({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn("mx-auto flex min-h-svh w-full max-w-[1240px] scroll-mt-0 flex-col justify-center px-5 py-[10svh] sm:px-8", className)}>
      {children}
    </section>
  )
}

/** Every section heading: one size, a light serif line and an orange italic one. */
export function SectionTitle({ lead, accent, className }: { lead: string; accent: string; className?: string }) {
  return (
    <h2 className={cn("font-serif text-[clamp(2.2rem,1.5rem+2.3vw,3.2rem)] leading-[1.06] font-light tracking-[-0.02em] text-balance", className)}>
      {lead} <em className="text-brand">{accent}</em>
    </h2>
  )
}

/** Supporting copy under a heading: short and grey. */
export function Lede({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("mt-5 max-w-[34rem] text-[16px] leading-[1.65] text-pretty text-muted-foreground sm:text-[17px]", className)}>{children}</p>
}

/** A command or file name inside copy. The site has no monospace, so it's the body font, a little heavier. */
export function Code({ children }: { children: ReactNode }) {
  return <span className="font-medium whitespace-nowrap text-foreground">{children}</span>
}
