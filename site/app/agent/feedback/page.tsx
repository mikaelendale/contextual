import type { Metadata } from "next"
import Link from "next/link"

import { FeedbackForm } from "@/app/agent/feedback/feedback-form"
import { Logo } from "@/components/logo"

export const metadata: Metadata = {
  title: "Feedback about Contextual",
  description: "Review a report your coding agent prepared about Contextual, then send it or close the tab.",
  robots: { index: false, follow: false },
}

/** Static: the report is in the link's fragment, which only the browser reads. Opening this page stores nothing. */
export default function FeedbackPage() {
  return (
    <div className="min-h-svh bg-background">
      <header className="mx-auto flex h-18 w-full max-w-[52rem] items-center px-5 sm:px-8">
        <Link href="/" className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring">
          <Logo />
        </Link>
      </header>
      <main className="mx-auto w-full max-w-[52rem] px-5 pt-6 pb-24 sm:px-8 sm:pt-10">
        <h1 className="font-serif text-[clamp(2.2rem,1.5rem+2.3vw,3.2rem)] leading-[1.06] font-light tracking-[-0.02em] text-balance">
          Feedback about <em className="text-brand">Contextual.</em>
        </h1>
        <p className="mt-5 max-w-[38rem] text-[16px] leading-[1.65] text-pretty text-muted-foreground sm:text-[17px]">
          Your coding agent prepared this report about a problem it had with Contextual itself. Read it, change anything you
          like, and press Send. If you close this tab instead, nothing is sent.
        </p>
        <FeedbackForm />
      </main>
    </div>
  )
}
