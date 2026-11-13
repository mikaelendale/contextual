// Agent feedback: the command, the link, the cleaning, turning it on and off, and init's question.
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

import { runCli } from "../src/cli.js"
import {
  FEEDBACK_END,
  FEEDBACK_START,
  FEEDBACK_URL,
  LINK_CAP,
  TEXT_CAP,
  buildReport,
  cleanText,
  decodeReport,
  genericFile,
  withFeedbackBlock,
} from "../src/feedback.js"
import { bin, tempRepo, write } from "./helpers.js"

/** Runs the CLI in this process, so the browser opener and the environment can be stood in for. */
function cli(args, cwd, { env = {}, open = () => true, ask = () => null } = {}) {
  const out = []
  const err = []
  const opened = []
  const status = runCli(args, {
    cwd,
    out: (l) => out.push(l),
    err: (l) => err.push(l),
    env,
    ask,
    open: (link) => {
      opened.push(link)
      return open(link)
    },
  })
  return { status, out: out.join("\n"), err: err.join("\n"), opened }
}

const meta = (dir) => JSON.parse(readFileSync(join(dir, "context", ".meta.json"), "utf8"))
const agents = (dir) => readFileSync(join(dir, "AGENTS.md"), "utf8")

/** A repo after init, with agent feedback on. */
function repoWithFeedback() {
  const dir = tempRepo()
  assert.equal(cli(["init", "--feedback", "on"], dir).status, 0)
  return dir
}

const FIELDS = ["--harness", "claude-code", "--model", "claude-opus-5-5", "--skill", "next", "--category", "hook-friction", "--severity", "worked-around"]
const report = (link) => decodeReport(link.split("#report=")[1])

test("the link carries the whole report in its fragment, never in the query string", () => {
  const dir = repoWithFeedback()
  const r = cli([...["feedback"], ...FIELDS, "--happened", "The hook blocked a commit.", "--expected", "A note, and the commit going through.", "--file", "context/status/main.md"], dir)
  assert.equal(r.status, 0, r.err)
  const [link] = r.opened
  assert.ok(link.startsWith(`${FEEDBACK_URL}#report=`), link)
  assert.ok(!new URL(link).search, "no query string")
  const sent = report(link)
  assert.equal(sent.harness, "claude-code")
  assert.equal(sent.happened, "The hook blocked a commit.")
  assert.equal(sent.file, "context/status/main.md")
  // And the fields the CLI adds by itself.
  assert.equal(sent.contextual, JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version)
  assert.ok(["linux", "macos", "windows", "other"].includes(sent.os))
  assert.equal(sent.packageManager, "none")
  assert.deepEqual(sent.harnessFolders, [".agents", ".claude"])
  assert.equal(typeof sent.check.errors, "number")
  assert.equal(sent.features, "none")
  assert.match(r.out, /Opened the feedback form in the browser\. Nothing is sent unless the person presses Send there\./)
})

test("each text field is capped, and an overlong link trims its longest field and says so", () => {
  const long = "word ".repeat(400)
  const capped = buildReport({ values: { harness: "codex", model: "m", skill: "none", category: "token-cost", severity: "idea", happened: long, expected: "short" }, auto: {}, names: { project: [], features: [] } })
  assert.equal(capped.report.happened.length, TEXT_CAP)
  assert.ok(capped.notes.some((n) => /--happened was \d+ characters; cut to 600/.test(n)))

  // Text that grows a lot when encoded: 600 characters each, mostly three-byte characters.
  const wide = "界".repeat(700)
  const trimmed = buildReport({ values: { harness: "codex", model: "m", skill: "none", category: "token-cost", severity: "idea", happened: wide, expected: wide, suggestion: wide }, auto: {}, names: { project: [], features: [] } })
  assert.ok(trimmed.link.length <= LINK_CAP, `${trimmed.link.length}`)
  assert.ok(trimmed.notes.some((n) => /The link was too long, so --\w+ was trimmed to \d+ characters/.test(n)), trimmed.notes.join("\n"))
})

test("cleaning takes out code, links, paths, secrets and the project's names, and keeps Contextual's own words", () => {
  const names = { project: ["pantry-app", "Pantry"], features: ["add-items"] }
  const { text, removed } = cleanText(
    "In pantry-app, add-items failed: ```const x = 1``` see https://example.com/x and /home/me/pantry/src/a.ts or C:\\Users\\me\\a.ts. Token ghp_abcdefghijklmnopqrstuvwxyz123456 and postgres://u:p@host/db. Running /contextual-next then `check --staged` in context/status/main.md.",
    names,
  )
  for (const gone of ["pantry", "Pantry", "add-items", "const x", "example.com", "/home/me", "C:\\Users", "ghp_", "postgres://"]) assert.ok(!text.includes(gone), `${gone} is still in: ${text}`)
  for (const kept of ["/contextual-next", "`check --staged`", "context/status/main.md"]) assert.ok(text.includes(kept), `${kept} was removed: ${text}`)
  assert.ok(["code", "a link", "a path", "a secret", "a connection string", "the project's name", "a feature's name"].every((w) => removed.includes(w)), removed.join(", "))
})

test("the file field names a Contextual file without project details, and leaves out anything else", () => {
  assert.equal(genericFile("AGENTS.md"), "AGENTS.md")
  assert.equal(genericFile("context/features/boards/log.md"), "context/features/<feature>/log.md")
  assert.equal(genericFile("context/features/foundation/README.md"), "context/features/foundation/README.md")
  assert.equal(genericFile("context/status/feat-boards.md"), "context/status/<branch>.md")
  assert.equal(genericFile("context/decisions/2026-01-01-magic-links.md"), "context/decisions/<record>.md")
  assert.equal(genericFile(".claude/skills/contextual-next/SKILL.md"), ".claude/skills/contextual-next/SKILL.md")
  assert.equal(genericFile("src/app/page.tsx"), null)
  const dir = repoWithFeedback()
  const r = cli(["feedback", ...FIELDS, "--happened", "x", "--expected", "y", "--file", "src/app/page.tsx", "--print"], dir)
  assert.equal(report(r.out.split("\n").at(-1)).file, undefined)
  assert.match(r.out, /--file isn't one of Contextual's own files, so it was left out/)
})

test("the agent's values are checked: a wrong value or a missing field is an error that lists the choices", () => {
  const dir = repoWithFeedback()
  const bad = cli(["feedback", ...FIELDS.map((v) => (v === "claude-code" ? "cursor" : v)), "--happened", "x", "--expected", "y"], dir)
  assert.equal(bad.status, 2)
  assert.match(bad.err, /--harness must be one of: claude-code, codex, opencode, antigravity, other/)
  const missing = cli(["feedback", ...FIELDS, "--happened", "x"], dir)
  assert.equal(missing.status, 2)
  assert.match(missing.err, /--expected is required/)
  assert.deepEqual([...bad.opened, ...missing.opened], [])
})

test("feedback on adds the block after the Contextual block; off gives back the same AGENTS.md", () => {
  const dir = tempRepo()
  cli(["init", "--feedback", "off"], dir)
  const before = agents(dir)
  assert.ok(!before.includes(FEEDBACK_START))
  assert.equal(meta(dir).feedback, "off")

  assert.equal(cli(["feedback", "on"], dir).status, 0)
  const on = agents(dir)
  assert.ok(on.indexOf("<!-- contextual:end -->") < on.indexOf(FEEDBACK_START), "after the Contextual block")
  assert.ok(on.includes(FEEDBACK_END))
  assert.equal(meta(dir).feedback, "on")

  writeFileSync(join(dir, "AGENTS.md"), `${agents(dir)}\n## Our notes\nKeep these.\n`)
  const withNotes = agents(dir)
  assert.equal(cli(["feedback", "off"], dir).status, 0)
  assert.equal(agents(dir), withNotes.replace(on.slice(on.indexOf("<!-- contextual:end -->") + "<!-- contextual:end -->".length, on.indexOf(FEEDBACK_END) + FEEDBACK_END.length), ""))
  assert.equal(agents(dir), `${before}\n## Our notes\nKeep these.\n`)
  assert.equal(meta(dir).feedback, "off")
})

test("the block limits only what gets reported, never how the agent works", () => {
  const dir = repoWithFeedback()
  const block = agents(dir).slice(agents(dir).indexOf(FEEDBACK_START))
  assert.match(block, /It changes nothing about how you work or how you verify your work/)
  assert.match(block, /At most one report per session/)
  assert.match(block, /nothing is sent unless they press Send/)
  assert.match(block, /npx --yes usecontextual@\S+ feedback/)
})

test("update keeps the block in step with .meta.json", () => {
  const dir = repoWithFeedback()
  const withBlock = agents(dir)
  // On, but the block was deleted by hand: update puts it back.
  writeFileSync(join(dir, "AGENTS.md"), withFeedbackBlock(withBlock, null))
  assert.equal(cli(["update"], dir).status, 0)
  assert.equal(agents(dir), withBlock)
  // Off, but the block is there: update takes it out.
  const metaPath = join(dir, "context", ".meta.json")
  writeFileSync(metaPath, readFileSync(metaPath, "utf8").replace('"feedback": "on"', '"feedback": "off"'))
  assert.equal(cli(["update"], dir).status, 0)
  assert.ok(!agents(dir).includes(FEEDBACK_START))
})

test("it does nothing in CI, or when feedback is off", () => {
  const dir = repoWithFeedback()
  const ci = cli(["feedback", ...FIELDS, "--happened", "x", "--expected", "y"], dir, { env: { CI: "true" } })
  assert.equal(ci.status, 0)
  assert.match(ci.out, /doesn't run in CI/)
  assert.deepEqual(ci.opened, [])
  assert.doesNotMatch(ci.out, /#report=/)

  cli(["feedback", "off"], dir)
  const off = cli(["feedback", ...FIELDS, "--happened", "x", "--expected", "y"], dir)
  assert.equal(off.status, 0)
  assert.match(off.out, /Agent feedback is off in this repo, so nothing was opened/)
  assert.deepEqual(off.opened, [])
})

test("it prints the link when no browser opens, or with --print, and never sends anything itself", async () => {
  const dir = repoWithFeedback()
  const realFetch = globalThis.fetch
  let fetched = 0
  globalThis.fetch = async () => {
    fetched++
    throw new Error("no network in this test")
  }
  try {
    const noBrowser = cli(["feedback", ...FIELDS, "--happened", "x", "--expected", "y"], dir, { open: () => false })
    assert.equal(noBrowser.status, 0)
    assert.match(noBrowser.out, /Open this link to review the feedback form/)
    assert.match(noBrowser.out.split("\n").at(-1), /^https:\/\/contextual\.mikaelen\.site\/agent\/feedback#report=/)

    const printed = cli(["feedback", ...FIELDS, "--happened", "x", "--expected", "y", "--print"], dir)
    assert.deepEqual(printed.opened, [])
    assert.match(printed.out, /#report=/)
  } finally {
    globalThis.fetch = realFetch
  }
  assert.equal(fetched, 0)
})

test("init asks once; with nobody to answer, feedback stays off", () => {
  const asked = tempRepo()
  let questions = 0
  const yes = cli(["init"], asked, {
    ask: (q) => {
      questions++
      assert.match(q, /Turn on agent feedback\?/)
      return true
    },
  })
  assert.equal(yes.status, 0)
  assert.equal(questions, 1)
  assert.equal(meta(asked).feedback, "on")
  assert.ok(agents(asked).includes(FEEDBACK_START))

  // A real run with no terminal: no question, off.
  const quiet = tempRepo()
  const run = spawnSync(process.execPath, [bin, "init"], { cwd: quiet, encoding: "utf8", input: "y\n" })
  assert.equal(run.status, 0, run.stderr)
  assert.doesNotMatch(run.stdout, /Turn on agent feedback\?/)
  assert.equal(meta(quiet).feedback, "off")
  assert.ok(!agents(quiet).includes(FEEDBACK_START))
  assert.match(run.stdout, /feedback off/)
})

test("check warns when the block and .meta.json disagree", () => {
  const dir = repoWithFeedback()
  write(dir, "AGENTS.md", withFeedbackBlock(agents(dir), null))
  const r = cli(["check"], dir)
  assert.match(r.out, /agent feedback is on in \.meta\.json, but the feedback block is missing/)
})

test("on Linux it hands the link to xdg-open, the desktop's way of opening the default browser", { skip: process.platform !== "linux" }, () => {
  const dir = repoWithFeedback()
  const binDir = join(dir, ".git", "test-bin")
  write(dir, ".git/test-bin/xdg-open", `#!/bin/sh\nprintf '%s' "$1" > "${join(dir, ".git", "opened.txt")}"\n`)
  spawnSync("chmod", ["+x", join(binDir, "xdg-open")])
  const run = spawnSync(process.execPath, [bin, "feedback", ...FIELDS, "--happened", "x", "--expected", "y"], {
    cwd: dir,
    encoding: "utf8",
    env: { ...process.env, PATH: `${binDir}:${process.env.PATH}`, DISPLAY: ":0", CI: "" },
  })
  assert.equal(run.status, 0, run.stderr)
  const opened = readFileSync(join(dir, ".git", "opened.txt"), "utf8")
  assert.match(opened, /^https:\/\/contextual\.mikaelen\.site\/agent\/feedback#report=/)
  assert.match(run.stdout, /Opened the feedback form in the browser/)
})
