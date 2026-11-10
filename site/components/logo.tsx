import { lens, slab } from "@/components/figure/iso"
import { cn } from "@/lib/utils"

/*
 * The mark: two layers of code with the layer that holds what your agent
 * knows on top. Solid shapes; a knockout outline in the surface colour keeps
 * the layers apart.
 */
const L = lens({ yaw: Math.PI / 4, pitch: Math.PI / 6, scale: 2.5, shift: [12, 15] })
const PLATE = { hw: 3, hh: 3, r: 1.2 }

/** The mark's three layers in a 24×24 box, bottom first. Also used by the generated icons. */
export const markLayers = [
  slab(L, { ...PLATE, z0: 0, z1: 0.7 }),
  slab(L, { ...PLATE, z0: 1.75, z1: 2.45 }),
  slab(L, { ...PLATE, z0: 3.5, z1: 4.2 }),
]

export function Mark({
  className,
  ink = "var(--foreground)",
  top = "var(--brand)",
  knockout = "var(--background)",
}: {
  className?: string
  ink?: string
  top?: string
  knockout?: string
}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-6", className)}>
      {markLayers.map((s, i) => {
        const fill = i === markLayers.length - 1 ? top : ink
        return (
          <g key={i}>
            <path d={s.band} fill={fill} opacity={i === 0 ? 0.55 : 1} />
            <path d={s.top} fill={fill} opacity={i === 0 ? 0.55 : 1} />
            <path d={s.silhouette} fill="none" stroke={knockout} strokeWidth={1.3} strokeLinejoin="round" />
          </g>
        )
      })}
    </svg>
  )
}

/** `light` sits on the orange sky; `dark` on paper. */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: "light" | "dark" }) {
  const light = tone === "light"
  return (
    <span className={cn("flex items-center gap-2", light ? "text-white" : "text-foreground", className)}>
      <Mark
        ink={light ? "rgb(255 255 255 / 0.72)" : undefined}
        top={light ? "#ffffff" : undefined}
        knockout={light ? "#db3300" : undefined}
      />
      <span className="text-[17px] font-semibold tracking-[-0.03em]">Contextual</span>
    </span>
  )
}
