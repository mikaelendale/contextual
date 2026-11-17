/*
 * Contrast ratios (WCAG 2): computing one, and checking the ones
 * design/principles.md claims in its Color table, so a ratio an agent wrote
 * down is a ratio someone measured.
 */

const NAMED = { white: "#ffffff", black: "#000000" }

/** "#abc" or "#aabbcc" (any case) as [r, g, b], or null. */
export function parseHex(value) {
  const m = String(value).trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!m) return null
  const hex = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1]
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
}

function luminance([r, g, b]) {
  const channel = (c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** The contrast ratio between two colors, from 1 to 21. */
export function contrast(a, b) {
  const [x, y] = [luminance(parseHex(a)), luminance(parseHex(b))].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/** The Color section's table: token name → hex, and each row's text. */
function readColorTable(text) {
  const section = (text.split(/^## Colou?r\s*$/m)[1] ?? "").split(/^## /m)[0]
  const rows = []
  for (const line of section.split("\n")) {
    if (!line.trim().startsWith("|") || /^\|[\s:|-]+\|?\s*$/.test(line)) continue
    const cells = line.split("|").slice(1, -1).map((c) => c.trim())
    const hex = line.match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/i)?.[0]
    if (!hex || cells.length < 2) continue
    rows.push({ token: cells[0].replace(/`/g, "").trim().toLowerCase(), hex, text: cells.slice(1).join(" | ") })
  }
  return rows
}

/** Text colors: their ratio must reach 4.5:1. Decoration and negations ("never text") don't count. */
function isTextRow(row) {
  const use = row.text.split("|")[0]
  if (/never|decorat|not for text/i.test(row.text)) return false
  return /(^|-)text($|-)|foreground/.test(row.token) || /^\s*(body |secondary |supporting |muted |small |link )?text\b/i.test(use)
}

/**
 * What's wrong with the contrast ratios a principles.md claims; empty when they hold.
 * Only claims whose two colors are clear get checked: "4.8:1 on background", "white text on it: 5.5:1",
 * or a bare "4.8:1", which is against the background. A claim that names some other color as its
 * subject ("`brand-ink` when focused, 5.3:1") is skipped rather than guessed at.
 */
export function contrastProblems(text) {
  const rows = readColorTable(text)
  const colors = new Map(Object.entries(NAMED))
  for (const row of rows) colors.set(row.token, row.hex)
  const background = rows.find((r) => r.token === "background" || r.token === "bg") ?? rows.find((r) => /background|^bg\b/.test(r.token))
  const problems = []
  for (const row of rows) {
    for (const segment of row.text.split(/[;()]/)) {
      const claims = [...segment.matchAll(/(\d+(?:\.\d+)?)\s*:\s*1\b/g)]
      let from = 0
      claims.forEach((claim, i) => {
        // The claim's own words: from the end of the previous claim to the start of the next one.
        const until = i + 1 < claims.length ? claims[i + 1].index : segment.length
        const before = segment.slice(from, claim.index)
        const after = segment.slice(claim.index + claim[0].length, until)
        from = claim.index + claim[0].length
        const words = before + after
        let fg = row.hex
        let bg = background?.hex
        let against = background ? `on ${background.token}` : null
        const onIt = words.match(/\b([a-z][a-z0-9-]*)\s+(?:text\s+)?on it\b/i)
        const onAfter = after.match(/^\s*on\s+(?:the\s+)?`?([a-z][a-z0-9-]*)`?/i)
        const onBefore = before.match(/\bon\s+(?:the\s+)?`?([a-z][a-z0-9-]*)`?[\s:]*$/i)
        const on = (onAfter ?? onBefore)?.[1]?.toLowerCase()
        if (onIt) {
          const name = onIt[1].toLowerCase()
          if (!colors.has(name)) return
          fg = colors.get(name)
          bg = row.hex
          against = `for ${name} on ${row.token}`
        } else if (on) {
          if (!colors.has(on)) return
          bg = colors.get(on)
          against = `on ${on}`
        }
        // Another color named as the subject makes the claim about that color: too unclear to check.
        const named = [...words.matchAll(/`([a-z][a-z0-9-]*)`/gi)].map((m) => m[1].toLowerCase())
        if (named.some((n) => colors.has(n) && n !== on && n !== row.token)) return
        if (!bg) return
        const claimed = Number(claim[1])
        const actual = contrast(fg, bg)
        if (Math.abs(actual - claimed) > 0.1) {
          problems.push(`the Color table says ${row.token} is ${claimed}:1 ${against}, but it's ${actual.toFixed(2)}:1`)
        } else if (!onIt && isTextRow(row) && actual < 4.5) {
          problems.push(`${row.token} is ${actual.toFixed(2)}:1 ${against}, under the 4.5:1 text needs`)
        }
      })
    }
  }
  return problems
}
