/*
 * Who owns a file (spec 3.8): the most specific match among the features'
 * `covers:` globs and the `shared:` line. An exact path beats any glob;
 * otherwise the glob with more folders before its first wildcard wins. Two
 * owners that match equally specifically are a tie, which `check` reports.
 */

import { matches } from "./glob.js"

/** Stands for the shared: line among owners. Feature folders are kebab-case, so no feature can have this name. */
export const SHARED = "(shared)"

/** How specific a glob is: Infinity for an exact path, otherwise the number of folders before its first wildcard. */
export function specificity(glob) {
  const segments = glob.split("/")
  const firstWild = segments.findIndex((s) => /[*?]/.test(s))
  return firstWild === -1 ? Infinity : firstWild
}

/**
 * @param {string} path a path relative to the repo root, with forward slashes
 * @param {{ name: string, covers: string[] }[]} features
 * @param {string[]} shared the globs on the shared: line
 * @returns {{ owner: string | null, glob: string | null, tied: string[], beaten: { owner: string, glob: string }[] }}
 *   `owner` is a feature name, SHARED, or null when nothing matches or two owners tie;
 *   `tied` names the owners that tie; `beaten` lists the less specific matches of other owners.
 */
export function ownerOf(path, features, shared = []) {
  const candidates = []
  for (const f of features) for (const glob of f.covers) if (matches(path, glob)) candidates.push({ owner: f.name, glob, rank: specificity(glob) })
  for (const glob of shared) if (matches(path, glob)) candidates.push({ owner: SHARED, glob, rank: specificity(glob) })
  if (candidates.length === 0) return { owner: null, glob: null, tied: [], beaten: [] }

  const top = Math.max(...candidates.map((c) => c.rank))
  const winners = [...new Set(candidates.filter((c) => c.rank === top).map((c) => c.owner))]
  const beaten = candidates.filter((c) => c.rank < top && !winners.includes(c.owner)).map(({ owner, glob }) => ({ owner, glob }))
  if (winners.length > 1) return { owner: null, glob: null, tied: winners.sort(), beaten }
  return { owner: winners[0], glob: candidates.find((c) => c.owner === winners[0] && c.rank === top).glob, tied: [], beaten }
}

/** Every path's resolution, keyed by path. */
export function ownersOf(paths, features, shared = []) {
  return new Map(paths.map((p) => [p, ownerOf(p, features, shared)]))
}

/** Code, as opposed to the root's own docs (README, LICENSE, CHANGELOG and other top-level .md or .txt files), which need no owner. */
export function isCodeFile(path) {
  return path.includes("/") || !/^(LICENSE.*|[^/]+\.(md|txt))$/i.test(path)
}
