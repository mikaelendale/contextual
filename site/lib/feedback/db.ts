/*
 * Agent feedback in the site's database (see ../db.ts). The table is created
 * by site/db/migrations/0001_agent_feedback.sql. Every query is parameterized
 * by the driver's tagged template.
 */

import { database } from "../db.ts"
import { CHOICES, type Report } from "./report.ts"
import type { Store } from "./send.ts"

/** The store the Send route writes to, or null when DATABASE_URL isn't set. */
export function getStore(): Store | null {
  const sql = database()
  if (!sql) return null
  return {
    async insert(r) {
      await sql`
        insert into agent_feedback
          (harness, model, skill, category, severity, happened, expected, suggestion, file,
           contextual_version, os, package_manager, harness_folders, check_errors, check_warnings, feature_count)
        values
          (${r.harness}, ${r.model}, ${r.skill}, ${r.category}, ${r.severity}, ${r.happened}, ${r.expected}, ${r.suggestion}, ${r.file},
           ${r.contextual}, ${r.os}, ${r.packageManager}, ${r.harnessFolders}, ${r.checkErrors}, ${r.checkWarnings}, ${r.features})`
    },
    async recentCount(minutes) {
      const rows = await sql`select count(*)::int as n from agent_feedback where created_at > now() - make_interval(mins => ${minutes})`
      return rows[0]?.n ?? 0
    },
  }
}

export type StoredReport = Report & { id: number; createdAt: string }
export type Filters = { harness?: string; category?: string; severity?: string }

/** The newest reports first, optionally filtered. Filter values outside the lists are ignored. */
export async function listReports(filters: Filters, limit = 200): Promise<StoredReport[] | null> {
  const sql = database()
  if (!sql) return null
  const only = (list: readonly string[], value?: string) => (value && list.includes(value) ? value : null)
  const harness = only(CHOICES.harness, filters.harness)
  const category = only(CHOICES.category, filters.category)
  const severity = only(CHOICES.severity, filters.severity)
  const rows = await sql`
    select id, created_at, harness, model, skill, category, severity, happened, expected, suggestion, file,
           contextual_version, os, package_manager, harness_folders, check_errors, check_warnings, feature_count
    from agent_feedback
    where (${harness}::text is null or harness = ${harness})
      and (${category}::text is null or category = ${category})
      and (${severity}::text is null or severity = ${severity})
    order by created_at desc
    limit ${limit}`
  return rows.map((row) => ({
    id: Number(row.id),
    createdAt: new Date(row.created_at as string).toISOString(),
    harness: row.harness,
    model: row.model,
    skill: row.skill,
    category: row.category,
    severity: row.severity,
    happened: row.happened,
    expected: row.expected,
    suggestion: row.suggestion,
    file: row.file,
    contextual: row.contextual_version,
    os: row.os,
    packageManager: row.package_manager,
    harnessFolders: row.harness_folders ?? [],
    checkErrors: row.check_errors,
    checkWarnings: row.check_warnings,
    features: row.feature_count,
  })) as StoredReport[]
}
