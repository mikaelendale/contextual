"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

type State = "ready" | "copied" | "failed"

/**
 * A command you can copy in one press: the page's main call to action. It
 * says when it has copied, and shows the command in words when the clipboard
 * isn't available, so the press never does nothing.
 */
export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [state, setState] = useState<State>("ready")
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(command)
      setState("copied")
    } catch {
      setState("failed")
    }
    timer.current = window.setTimeout(() => setState("ready"), 2600)
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy the command ${command}`}
        className="group/copy inline-flex h-12 items-center gap-3 rounded-full bg-linear-to-b from-[#2b2b31] to-foreground pr-4 pl-5 text-[15px] font-medium text-background shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_14px_30px_-14px_rgb(23_23_27/0.55)] transition-[filter] outline-none hover:brightness-125 focus-visible:ring-3 focus-visible:ring-ring"
      >
        <span aria-hidden="true" className="text-white/45">
          $
        </span>
        <span>{command}</span>
        <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-full bg-white/10">
          {state === "copied" ? <Check weight="bold" className="size-3.5 text-[#ffb37a]" /> : <Copy weight="bold" className="size-3.5" />}
        </span>
      </button>
      <p role="status" aria-live="polite" className="mt-2.5 min-h-5 text-[13.5px] text-muted-foreground">
        {state === "copied" && "Copied. Run it in your repo's folder."}
        {state === "failed" && `Couldn't copy here. The command is: ${command}`}
      </p>
    </div>
  )
}
