"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

const MANAGERS = [
  { id: "npm", command: "npx usecontextual init" },
  { id: "pnpm", command: "pnpm dlx usecontextual init" },
  { id: "bun", command: "bunx usecontextual init" },
] as const

/** What `init` prints, shortened from the real output. */
const OUTPUT = [
  ["added", "AGENTS.md and CLAUDE.md"],
  ["added", "context/: the plan, status, features, stack and design"],
  ["added", ".agents/skills/ and .claude/skills/"],
  ["hook", ".git/hooks/pre-commit"],
] as const

/**
 * The install command, for whichever package manager you use, with what it
 * prints. Copying says so for two seconds without changing the button's width.
 */
export function InstallModule({ className }: { className?: string }) {
  const [manager, setManager] = useState<(typeof MANAGERS)[number]["id"]>("npm")
  const [copied, setCopied] = useState<"no" | "yes" | "failed">("no")
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const command = MANAGERS.find((m) => m.id === manager)!.command

  async function copy() {
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(command)
      setCopied("yes")
    } catch {
      setCopied("failed")
    }
    timer.current = window.setTimeout(() => setCopied("no"), 2000)
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[18px] bg-linear-to-b from-[#2b2b31] to-foreground text-left shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_24px_50px_-24px_rgb(23_23_27/0.6)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-3 py-2.5">
        <div role="tablist" aria-label="Package manager" className="flex gap-1">
          {MANAGERS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={manager === m.id}
              onClick={() => setManager(m.id)}
              className={cn(
                "h-7 rounded-full px-3 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                manager === m.id ? "bg-white/[0.12] text-white" : "text-white/55 hover:text-white/85",
              )}
            >
              {m.id}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy the command ${command}`}
          className="inline-flex h-7 items-center gap-1.5 rounded-full bg-white/[0.08] px-3 text-[13px] font-medium text-white transition-colors outline-none hover:bg-white/[0.14] focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <span className="grid">
            {/* Both labels share one cell, so the button keeps its width. */}
            <span className={cn("col-start-1 row-start-1 flex items-center gap-1.5", copied !== "no" && "invisible")}>
              <Copy weight="bold" className="size-3.5" aria-hidden="true" /> Copy
            </span>
            <span className={cn("col-start-1 row-start-1 flex items-center gap-1.5 text-[#ffb37a]", copied !== "yes" && "invisible")}>
              <Check weight="bold" className="size-3.5" aria-hidden="true" /> Copied
            </span>
          </span>
        </button>
      </div>
      <div className="px-5 pt-4 pb-5 text-[14.5px] leading-[1.7]">
        <p className="text-white">
          <span aria-hidden="true" className="mr-2 text-white/40">
            $
          </span>
          {command}
        </p>
        <ul className="mt-2 text-white/60">
          {OUTPUT.map(([kind, what]) => (
            <li key={what} className="grid grid-cols-[3.5rem_1fr] gap-2">
              <span className="text-[#ffb37a]/80">{kind}</span>
              <span>{what}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-white/80">Next: tell your coding agent &ldquo;set up contextual&rdquo;.</p>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {copied === "yes" ? "Copied" : copied === "failed" ? `Couldn't copy. The command is ${command}` : ""}
      </p>
      {copied === "failed" && <p className="px-5 pb-4 text-[13px] text-white/70">Couldn&rsquo;t copy here. Select the command above.</p>}
    </div>
  )
}
