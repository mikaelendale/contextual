/*
 * Wires for the figures: orthogonal routes with rounded elbows, in screen
 * pixels, measured from the page. No "use client": pure math, shared by any
 * figure that draws connections.
 */

export type Point = [number, number]

/** Fixed decimals and no "-0", so server and browser print the same path. */
const fixed = (v: number) => (Math.abs(v) < 0.005 ? 0 : v).toFixed(2)

/** A path through `points` with each corner rounded to at most `radius`. */
export function roundedPath(points: Point[], radius = 12): string {
  const pts = points.filter((p, i) => i === 0 || Math.hypot(p[0] - points[i - 1][0], p[1] - points[i - 1][1]) > 0.5)
  if (pts.length < 2) return ""
  let d = `M${fixed(pts[0][0])} ${fixed(pts[0][1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1]
    const [cx, cy] = pts[i]
    const [nx, ny] = pts[i + 1]
    const inLen = Math.hypot(cx - px, cy - py)
    const outLen = Math.hypot(nx - cx, ny - cy)
    const r = Math.min(radius, inLen / 2, outLen / 2)
    const ax = cx - ((cx - px) / inLen) * r
    const ay = cy - ((cy - py) / inLen) * r
    const bx = cx + ((nx - cx) / outLen) * r
    const by = cy + ((ny - cy) / outLen) * r
    d += ` L${fixed(ax)} ${fixed(ay)} Q${fixed(cx)} ${fixed(cy)} ${fixed(bx)} ${fixed(by)}`
  }
  const [lx, ly] = pts[pts.length - 1]
  return `${d} L${fixed(lx)} ${fixed(ly)}`
}

/** Ease in and out, for a pulse that starts and stops softly. */
export const smooth = (t: number) => t * t * (3 - 2 * t)
