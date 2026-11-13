// Fails when a tracked file holds a database connection string with a password, or when an .env file is
// committed. This repo is public: database URLs live only in environment variables (Vercel's settings).
// Run from the repo root: node .github/scripts/no-connection-strings.mjs
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean)
const CONNECTION = /\b(?:postgres(?:ql)?|mysql|mariadb|mongodb(?:\+srv)?|rediss?|amqps?|mssql|sqlserver):\/\/[^\s:/@'"`]+:[^\s@'"`]+@/i
const ENV_FILE = /(^|\/)\.env(\.[^/]+)?$/

const problems = []
for (const file of files) {
  if (ENV_FILE.test(file) && !file.endsWith(".example")) {
    problems.push(`${file}: an .env file is committed`)
    continue
  }
  let text
  try {
    text = readFileSync(file, "utf8")
  } catch {
    continue
  }
  if (text.includes("\0")) continue // binary
  text.split("\n").forEach((line, i) => {
    // Say where, never what: the line may hold a live password.
    if (CONNECTION.test(line)) problems.push(`${file}:${i + 1}: looks like a connection string with a password`)
  })
}

if (problems.length) {
  console.error(problems.join("\n"))
  console.error("Take it out, change that password, and keep the URL in an environment variable instead.")
  process.exit(1)
}
console.log(`No connection strings or .env files in ${files.length} tracked files.`)
