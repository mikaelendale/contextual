/*
 * Reading a plan file (docs/plan-file.md): the format the contextual-plan
 * skill and prompt write, and contextual-setup reads. Returns what's wrong,
 * so a plan can be checked before setup uses it.
 */

export const PLAN_HEADINGS = ["Idea", "Users", "Platform", "Stack", "Design direction", "Phases", "Open questions"]

/** @returns {{ name: string | null, phases: { number: number, name: string, features: { name: string, acceptance: string[] }[] }[], problems: string[] }} */
export function readPlanFile(text) {
  const problems = []
  const lines = text.replace(/\r\n/g, "\n").replace(/<!--[\s\S]*?-->/g, "").split("\n")
  const title = lines.find((l) => l.trim())
  const name = title?.match(/^# (\S.*)$/)?.[1] ?? null
  if (!name) problems.push('the first line should be "# <Project name>"')

  const headings = lines.filter((l) => /^## /.test(l)).map((l) => l.slice(3).trim())
  if (headings.join("|") !== PLAN_HEADINGS.join("|")) {
    problems.push(`the ## headings should be ${PLAN_HEADINGS.join(", ")}, in that order; found ${headings.join(", ") || "none"}`)
  }

  const phases = []
  let inPhases = false
  let feature = null
  for (const line of lines) {
    if (/^## /.test(line)) {
      inPhases = line.slice(3).trim() === "Phases"
      continue
    }
    if (!inPhases || !line.trim()) continue
    const phase = line.match(/^### Phase (\d+) — (\S.*)$/)
    if (phase) {
      phases.push({ number: Number(phase[1]), name: phase[2].trim(), features: [] })
      feature = null
      continue
    }
    if (/^### /.test(line)) {
      problems.push(`can't read the phase heading "${line}" (expected "### Phase 1 — Name")`)
      continue
    }
    const f = line.match(/^- ([^:]+): (\S.*)$/)
    if (f) {
      if (!phases.length) problems.push(`"${line}" comes before any phase heading`)
      else phases.at(-1).features.push((feature = { name: f[1].trim(), acceptance: [] }))
      continue
    }
    const a = line.match(/^\s+- acceptance: (\S.*)$/)
    if (a && feature) {
      feature.acceptance.push(a[1].trim())
      continue
    }
    // One plain sentence under a phase heading, saying what the phase delivers, is allowed.
    if (phases.length && !phases.at(-1).features.length && !phases.at(-1).summary && /^[A-Za-z]/.test(line)) {
      phases.at(-1).summary = line.trim()
      continue
    }
    problems.push(`can't read "${line.trim()}" under Phases (features are "- Name: one line", acceptance lines "  - acceptance: …")`)
  }
  if (!phases.length) problems.push("Phases has no \"### Phase 1 — Name\" heading")
  phases.forEach((p, i) => {
    if (p.number !== i + 1) problems.push(`phases should be numbered 1, 2, 3…; found Phase ${p.number} in place ${i + 1}`)
    if (!p.features.length) problems.push(`Phase ${p.number} has no features`)
  })
  const seen = new Set()
  for (const f of phases.flatMap((p) => p.features)) {
    const slug = f.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    if (seen.has(slug)) problems.push(`two features are named "${f.name}"; names must be unique`)
    seen.add(slug)
    if (!f.acceptance.length) problems.push(`the feature "${f.name}" has no acceptance line`)
    if (f.name.split(/\s+/).length > 4) problems.push(`the feature name "${f.name}" is long; names are one to three words`)
  }
  return { name, phases, problems }
}
