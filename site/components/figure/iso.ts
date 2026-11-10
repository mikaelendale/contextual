/**
 * A tiny isometric kit for hairline figures: one projection, rounded slabs
 * whose faces are filled with the page colour (occlusion by paint order),
 * and wire routes with rounded elbows that a pulse can travel along.
 *
 * Everything here is deterministic so the server and the first client render
 * print identical coordinates.
 */

export type Vec2 = [number, number];

export type Camera = {
  yaw: number;
  pitch: number;
  /** Pixels per world unit. */
  scale: number;
  shift: Vec2;
};

const TAU = Math.PI * 2;

/** Snap trig results so server and browser agree to the last printed digit. */
export const snap = (v: number) => Math.round(v * 1e9) / 1e9;

/** Two decimals, and never print `-0`. */
export const fixed = (v: number) => (Math.abs(v) < 0.005 ? "0" : v.toFixed(2));

const norm = (a: number) => ((a % TAU) + TAU) % TAU;

export function lens({ yaw, pitch, scale, shift: [dx, dy] }: Camera) {
  const cy = snap(Math.cos(yaw));
  const sy = snap(Math.sin(yaw));
  const cp = snap(Math.cos(pitch));
  const sp = snap(Math.sin(pitch));
  const k = scale;
  return {
    yaw,
    k,
    at: (x: number, y: number, z: number): Vec2 => [
      (x * cy - y * sy) * k + dx,
      ((x * sy + y * cy) * sp - z * cp) * k + dy,
    ],
    /** Larger is nearer the viewer. */
    depth: (x: number, y: number) => x * sy + y * cy,
    /** Screen-space height of one world unit straight up. */
    rise: cp * k,
  };
}

export type Lens = ReturnType<typeof lens>;

export function path(points: Vec2[], closed = false) {
  if (!points.length) return "";
  let d = `M${fixed(points[0][0])} ${fixed(points[0][1])}`;
  for (let i = 1; i < points.length; i++) {
    d += `L${fixed(points[i][0])} ${fixed(points[i][1])}`;
  }
  return closed ? `${d}Z` : d;
}

type Tagged = { x: number; y: number; a: number };

/**
 * Rounded rectangle outline in world x/y, tagged with the outward normal
 * angle so it can be split at the leftmost and rightmost screen points.
 */
function outline(
  cx: number,
  cy: number,
  hw: number,
  hh: number,
  r: number,
  splits: number[],
  steps = 8,
): Tagged[] {
  const centers: Vec2[] = [
    [cx + hw - r, cy + hh - r],
    [cx - hw + r, cy + hh - r],
    [cx - hw + r, cy - hh + r],
    [cx + hw - r, cy - hh + r],
  ];
  const points: Tagged[] = [];
  for (let i = 0; i < 4; i++) {
    const a0 = (i * Math.PI) / 2;
    const a1 = a0 + Math.PI / 2;
    const angles: number[] = [];
    for (let s = 0; s <= steps; s++) angles.push(a0 + ((a1 - a0) * s) / steps);
    for (const split of splits) {
      if (split > a0 + 1e-9 && split < a1 - 1e-9) angles.push(split);
    }
    angles.sort((p, q) => p - q);
    for (const a of angles) {
      points.push({
        x: centers[i][0] + r * snap(Math.cos(a)),
        y: centers[i][1] + r * snap(Math.sin(a)),
        a,
      });
    }
  }
  return points;
}

export type SlabSpec = {
  cx?: number;
  cy?: number;
  /** Half width along world x. */
  hw: number;
  /** Half depth along world y. */
  hh: number;
  r: number;
  z0: number;
  z1: number;
};

export type Slab = {
  /** Top face, filled with the page colour. */
  top: string;
  /** Near side band, filled with the page colour. */
  band: string;
  /** The solid's outline. */
  silhouette: string;
  /** The single dim crease where the top meets the side. */
  crease: string;
  /** Leftmost and rightmost screen points, halfway up the side. */
  left: Vec2;
  right: Vec2;
  /** Top and bottom of the leftmost edge. */
  leftTop: Vec2;
  leftBottom: Vec2;
  /** Screen-space bounds. */
  box: [number, number, number, number];
};

/** A rounded slab from z0 to z1, projected through the lens. */
export function slab(L: Lens, spec: SlabSpec): Slab {
  const { cx = 0, cy = 0, hw, hh, r, z0, z1 } = spec;
  const left = norm(Math.PI - L.yaw);
  const right = norm(-L.yaw);
  const points = outline(cx, cy, hw, hh, r, [left, right]);
  const eps = 1e-9;

  // Near half runs from the rightmost point, through the front, to the leftmost.
  const near = [
    ...points.filter((p) => p.a >= right - eps),
    ...points.filter((p) => p.a <= left + eps),
  ];
  // Back half runs from the leftmost point, around the back, to the rightmost.
  const back = points.filter((p) => p.a >= left - eps && p.a <= right + eps);

  const at = (p: Tagged, z: number) => L.at(p.x, p.y, z);
  const top = points.map((p) => at(p, z1));
  const nearTop = near.map((p) => at(p, z1));
  const nearBottom = near.map((p) => at(p, z0));
  const backTop = back.map((p) => at(p, z1));

  const leftmost = back[0];
  const rightmost = near[0];
  const zm = (z0 + z1) / 2;

  const xs = [...top, ...nearBottom].map((p) => p[0]);
  const ys = [...top, ...nearBottom].map((p) => p[1]);

  return {
    top: path(top, true),
    band: path([...nearTop, ...[...nearBottom].reverse()], true),
    silhouette: path([...backTop, ...nearBottom], true),
    crease: path(nearTop),
    left: at(leftmost, zm),
    right: at(rightmost, zm),
    leftTop: at(leftmost, z1),
    leftBottom: at(leftmost, z0),
    box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)],
  };
}

/** A small rounded rectangle lying flat on a plane at height z. */
export function flatRect(
  L: Lens,
  cx: number,
  cy: number,
  hw: number,
  hh: number,
  r: number,
  z: number,
) {
  const points = outline(cx, cy, hw, hh, r, [], 4);
  return path(
    points.map((p) => L.at(p.x, p.y, z)),
    true,
  );
}

/* ------------------------------------------------------------------ */
/* Routes: polylines with rounded elbows, measurable by arc length.     */
/* ------------------------------------------------------------------ */

type Segment =
  | { kind: "line"; a: Vec2; b: Vec2; length: number }
  | {
      kind: "arc";
      c: Vec2;
      r: number;
      a0: number;
      a1: number;
      length: number;
    };

export type Route = {
  d: string;
  length: number;
  at: (s: number) => Vec2;
  /** The part of the route between two arc lengths, as path data. */
  sub: (s0: number, s1: number) => string;
};

const sub2 = (a: Vec2, b: Vec2): Vec2 => [a[0] - b[0], a[1] - b[1]];
const add2 = (a: Vec2, b: Vec2): Vec2 => [a[0] + b[0], a[1] + b[1]];
const mul2 = (a: Vec2, k: number): Vec2 => [a[0] * k, a[1] * k];
const len2 = (a: Vec2) => Math.hypot(a[0], a[1]);
const unit2 = (a: Vec2): Vec2 => {
  const l = len2(a) || 1;
  return [a[0] / l, a[1] / l];
};

function arcPoint(c: Vec2, r: number, a: number): Vec2 {
  return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
}

export function route(points: Vec2[], radius: number): Route {
  const segments: Segment[] = [];
  let cursor = points[0];

  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const next = points[i + 1];
    if (!next) {
      segments.push({
        kind: "line",
        a: cursor,
        b: p,
        length: len2(sub2(p, cursor)),
      });
      break;
    }
    const u = unit2(sub2(p, points[i - 1]));
    const w = unit2(sub2(next, p));
    const r = Math.min(
      radius,
      len2(sub2(p, points[i - 1])) / 2,
      len2(sub2(next, p)) / 2,
    );
    const start = sub2(p, mul2(u, r));
    const end = add2(p, mul2(w, r));
    const c = add2(start, mul2(w, r));
    segments.push({
      kind: "line",
      a: cursor,
      b: start,
      length: len2(sub2(start, cursor)),
    });
    const a0 = Math.atan2(start[1] - c[1], start[0] - c[0]);
    let a1 = Math.atan2(end[1] - c[1], end[0] - c[0]);
    let delta = a1 - a0;
    if (delta > Math.PI) delta -= TAU;
    if (delta < -Math.PI) delta += TAU;
    a1 = a0 + delta;
    segments.push({ kind: "arc", c, r, a0, a1, length: Math.abs(delta) * r });
    cursor = end;
  }

  const length = segments.reduce((sum, s) => sum + s.length, 0);

  const pointOn = (seg: Segment, f: number): Vec2 => {
    if (seg.kind === "line") return add2(seg.a, mul2(sub2(seg.b, seg.a), f));
    return arcPoint(seg.c, seg.r, seg.a0 + (seg.a1 - seg.a0) * f);
  };

  const at = (s: number): Vec2 => {
    let rest = Math.max(0, Math.min(length, s));
    for (const seg of segments) {
      if (rest <= seg.length || seg === segments[segments.length - 1]) {
        return pointOn(seg, seg.length ? rest / seg.length : 0);
      }
      rest -= seg.length;
    }
    return points[points.length - 1];
  };

  const sub = (s0: number, s1: number) => {
    const from = Math.max(0, Math.min(length, s0));
    const to = Math.max(0, Math.min(length, s1));
    if (to - from < 0.01) return "";
    let d = "";
    let offset = 0;
    for (const seg of segments) {
      const a = Math.max(from, offset);
      const b = Math.min(to, offset + seg.length);
      if (b > a && seg.length > 0) {
        const fa = (a - offset) / seg.length;
        const fb = (b - offset) / seg.length;
        const pa = pointOn(seg, fa);
        const pb = pointOn(seg, fb);
        if (!d) d = `M${fixed(pa[0])} ${fixed(pa[1])}`;
        if (seg.kind === "line") {
          d += `L${fixed(pb[0])} ${fixed(pb[1])}`;
        } else {
          const sweep = seg.a1 > seg.a0 ? 1 : 0;
          d += `A${fixed(seg.r)} ${fixed(seg.r)} 0 0 ${sweep} ${fixed(pb[0])} ${fixed(pb[1])}`;
        }
      }
      offset += seg.length;
    }
    return d;
  };

  return { d: sub(0, length), length, at, sub };
}

/* ------------------------------------------------------------------ */
/* Timeline helpers.                                                    */
/* ------------------------------------------------------------------ */

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Soft start and stop. */
export const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

/** Ease out, for things that arrive. */
export const easeOut = (v: number) => 1 - Math.pow(1 - clamp01(v), 3);

/** 0 → 1 across [a, b]. */
export const ramp = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/** Rises across [a, a+fade], holds, falls across [b-fade, b]. */
export const span = (t: number, a: number, b: number, fade = 0.2) =>
  Math.min(smooth((t - a) / fade), smooth((b - t) / fade));
