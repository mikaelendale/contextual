/*
 * Drawings for generated images (share card, icons). Image generation can't
 * read CSS variables or run WebGL, so these take explicit colours.
 */

import { markLayers } from "@/components/logo"

export const ART = {
  paper: "#f7f5f2",
  ink: "#17171b",
  gray: "#6c6c74",
  faint: "#a4a4ab",
  brand: "#f24d00",
  brandDeep: "#db3300",
  brandSoft: "#ffe7d6",
  ember: "#f0541c",
  emberSoft: "#ffe8da",
  white: "#ffffff",
}

/** The solid mark. Only intrinsic SVG elements inside <svg>, as image generation requires. */
export function MarkArt({
  size,
  ink = ART.ink,
  top = ART.brand,
  knockout = ART.paper,
  stroke = 1.3,
}: {
  size: number
  ink?: string
  top?: string
  knockout?: string
  stroke?: number
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {markLayers.map((s, i) => {
        const fill = i === markLayers.length - 1 ? top : ink
        const opacity = i === 0 ? 0.55 : 1
        return (
          <g key={i}>
            <path d={s.band} fill={fill} opacity={opacity} />
            <path d={s.top} fill={fill} opacity={opacity} />
            <path d={s.silhouette} fill="none" stroke={knockout} strokeWidth={stroke} strokeLinejoin="round" />
          </g>
        )
      })}
    </svg>
  )
}
