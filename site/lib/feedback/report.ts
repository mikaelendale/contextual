/*
 * The agent feedback report: what the form may send and the server may
 * store. The CLI (packages/cli/src/feedback.js) builds the same shape. Every
 * value is checked against a fixed list or capped here, on the server,
 * whatever the browser sent.
 */

export const CHOICES = {
  harness: ["claude-code", "codex", "opencode", "antigravity", "other"],
  skill: ["setup", "next", "sync", "none"],
  category: ["conflicting-rules", "unclear-skill-step", "check-false-alarm", "check-miss", "hook-friction", "template-gap", "token-cost", "structure-preference"],
  severity: ["blocked", "worked-around", "annoyance", "idea"],
} as const

export const LABELS: Record<string, string> = {
  "claude-code": "Claude Code",
  codex: "Codex",
  opencode: "OpenCode",
  antigravity: "Antigravity",
  other: "Another agent",
  setup: "contextual-setup",
  next: "contextual-next",
  sync: "contextual-sync",
  none: "No skill",
  "conflicting-rules": "Rules that conflict",
  "unclear-skill-step": "An unclear skill step",
  "check-false-alarm": "A check false alarm",
  "check-miss": "Something check missed",
  "hook-friction": "Hook friction",
  "template-gap": "A gap in the templates",
  "token-cost": "Token cost",
  "structure-preference": "A preference about the structure",
  blocked: "Blocked",
  "worked-around": "Worked around",
  annoyance: "Annoyance",
  idea: "Idea",
}

export const OS = ["linux", "macos", "windows", "other"] as const
export const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun", "none"] as const
export const HARNESS_FOLDERS = [".agents", ".agent", ".claude", ".codex", ".opencode"] as const
export const FEATURE_BUCKETS = ["none", "1-5", "6-20", "21+"] as const
export const TEXT_CAP = 600
export const MODEL_CAP = 64
export const FILE_CAP = 120
/** The most a Send request body may hold, in bytes: three capped texts with room to spare. */
export const BODY_CAP = 16 * 1024

export type Report = {
  harness: (typeof CHOICES.harness)[number]
  model: string
  skill: (typeof CHOICES.skill)[number]
  category: (typeof CHOICES.category)[number]
  severity: (typeof CHOICES.severity)[number]
  happened: string
  expected: string
  suggestion: string
  file: string
  contextual: string
  os: (typeof OS)[number]
  packageManager: (typeof PACKAGE_MANAGERS)[number]
  harnessFolders: string[]
  checkErrors: number | null
  checkWarnings: number | null
  features: (typeof FEATURE_BUCKETS)[number]
}

export type Result = { ok: true; report: Report } | { ok: false; error: string }

const pick = <T extends readonly string[]>(list: T, value: unknown): T[number] | null =>
  typeof value === "string" && (list as readonly string[]).includes(value) ? (value as T[number]) : null

/** Plain text: control characters out (newlines and tabs stay), trimmed, and cut to `cap`. */
export function cleanText(value: unknown, cap: number): string {
  if (typeof value !== "string") return ""
  const text = value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim()
  return text.length > cap ? `${text.slice(0, cap - 1).trimEnd()}…` : text
}

const count = (value: unknown): number | null => (Number.isInteger(value) && (value as number) >= 0 && (value as number) <= 100000 ? (value as number) : null)

/** A Contextual file, as the CLI names them: AGENTS.md, CLAUDE.md, context/… or a skill folder. Anything else is dropped. */
function contextualFile(value: unknown): string {
  const file = cleanText(value, FILE_CAP)
  if (!file) return ""
  return /^(AGENTS\.md|CLAUDE\.md|context\/[\w./<>-]+|\.(agents|claude)\/skills\/[\w./-]+)$/.test(file) && !file.includes("..") ? file : ""
}

/**
 * Checks a report from the form. The agent's choices must be from the lists,
 * the texts are cleaned and capped, and anything not in the shape is ignored.
 */
export function validateReport(input: unknown): Result {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, error: "The report isn't readable." }
  const r = input as Record<string, unknown>

  const harness = pick(CHOICES.harness, r.harness)
  const skill = pick(CHOICES.skill, r.skill)
  const category = pick(CHOICES.category, r.category)
  const severity = pick(CHOICES.severity, r.severity)
  if (!harness) return { ok: false, error: "Choose the agent." }
  if (!skill) return { ok: false, error: "Choose the skill that was in use." }
  if (!category) return { ok: false, error: "Choose what kind of problem it was." }
  if (!severity) return { ok: false, error: "Choose how much it got in the way." }

  const happened = cleanText(r.happened, TEXT_CAP)
  const expected = cleanText(r.expected, TEXT_CAP)
  if (!happened) return { ok: false, error: "Say what happened." }
  if (!expected) return { ok: false, error: "Say what was expected." }

  const check = (r.check && typeof r.check === "object" ? r.check : {}) as Record<string, unknown>
  const folders = Array.isArray(r.harnessFolders) ? r.harnessFolders : []
  return {
    ok: true,
    report: {
      harness,
      model: cleanText(r.model, MODEL_CAP).replace(/[^\w .:/+@-]/g, "") || "unknown",
      skill,
      category,
      severity,
      happened,
      expected,
      suggestion: cleanText(r.suggestion, TEXT_CAP),
      file: contextualFile(r.file),
      contextual: /^\d+\.\d+\.\d+(-[\w.]+)?$/.test(String(r.contextual ?? "")) ? String(r.contextual).slice(0, 32) : "unknown",
      os: pick(OS, r.os) ?? "other",
      packageManager: pick(PACKAGE_MANAGERS, r.packageManager) ?? "none",
      harnessFolders: [...new Set(folders.filter((f): f is string => typeof f === "string" && (HARNESS_FOLDERS as readonly string[]).includes(f)))].sort(),
      checkErrors: count(check.errors),
      checkWarnings: count(check.warnings),
      features: pick(FEATURE_BUCKETS, r.features) ?? "none",
    },
  }
}

/** Reads the report out of a link's fragment: `#report=<base64url JSON>`. Null when there's none or it doesn't decode. */
export function readFragment(hash: string): unknown {
  const match = /(?:^#|&)report=([A-Za-z0-9_-]+)/.exec(hash)
  if (!match) return null
  try {
    const base64 = match[1].replace(/-/g, "+").replace(/_/g, "/")
    const bytes = Uint8Array.from(atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4)), (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return null
  }
}
