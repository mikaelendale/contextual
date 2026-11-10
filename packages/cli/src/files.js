import { execFileSync } from "node:child_process"
import { readdirSync } from "node:fs"
import { join } from "node:path"

const SKIP_DIRS = new Set([".git", "node_modules", ".next", ".turbo", ".vercel", "dist", "build", "coverage"])

/**
 * Every file in the project, relative to `root`, with forward slashes. Uses git
 * when it can, so `.gitignore` applies; otherwise walks the folder.
 */
export function listFiles(root) {
  try {
    const out = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
    return out.split("\0").filter(Boolean)
  } catch {
    const files = []
    const walk = (dir, prefix) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          if (!SKIP_DIRS.has(entry.name)) walk(join(dir, entry.name), `${prefix}${entry.name}/`)
        } else {
          files.push(`${prefix}${entry.name}`)
        }
      }
    }
    walk(root, "")
    return files
  }
}

/** The current git branch in `root`, or null when git can't tell (not a repo, detached HEAD). */
export function currentBranch(root) {
  try {
    const out = execFileSync("git", ["branch", "--show-current"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
    if (out) return out
  } catch {
    // not a git repo
  }
  return process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || null
}
