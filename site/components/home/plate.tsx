import type { ReactNode } from "react"

import { LiveDither } from "@/components/live-dither"
import { cn } from "@/lib/utils"

/**
 * The surface every figure on the page sits on: the sky's orange, in the same
 * slow live grain as the hero and the cards, with paper panels floating on it.
 * The art (public/dither/plate.webp) is the hero's sky with the cards' clouds
 * along the bottom.
 */
export function Plate({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[22px] bg-linear-to-b from-[#c43000] via-[#db3300] to-[#ff9b45] shadow-[0_28px_50px_-30px_rgb(219_51_0/0.55)] ring-1 ring-black/5",
        className,
      )}
    >
      <LiveDither
        className="absolute inset-0"
        image="/dither/plate.webp"
        colorBack="#c43000"
        colorFront="#ff6a14"
        colorHighlight="#fff4ea"
        originY={0.5}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

/** A paper panel on a plate. Shadows are for things that float, and these do. */
export const PANEL =
  "rounded-[14px] bg-linear-to-b from-white to-[#fbfaf8] shadow-[0_18px_40px_-22px_rgb(90_25_0/0.55)] ring-1 ring-black/[0.06]"
