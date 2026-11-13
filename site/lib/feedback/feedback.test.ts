// The server side of agent feedback: validation, Send, the limits, and the owner's cookie.
// Run with: cd site && node --test lib/*/*.test.ts
import assert from "node:assert/strict"
import { test } from "node:test"

import { isOwner, ownerToken } from "./owner.ts"
import { createLimiter, visitorKey } from "../rate-limit.ts"
import { BODY_CAP, TEXT_CAP, readFragment, validateReport, type Report } from "./report.ts"
import { HONEYPOT, OVERALL, handleSend, type Store } from "./send.ts"

const good = {
  harness: "codex",
  model: "gpt-6.1-sol",
  skill: "next",
  category: "hook-friction",
  severity: "worked-around",
  happened: "The hook blocked a commit while the pinned version was not on npm yet.",
  expected: "A note, and the commit going through.",
  suggestion: "",
  file: "context/status/main.md",
  contextual: "0.2.0",
  os: "linux",
  packageManager: "npm",
  harnessFolders: [".agents", ".claude"],
  check: { errors: 0, warnings: 2 },
  features: "6-20",
}

function memoryStore(recent = 0): Store & { rows: Report[] } {
  const rows: Report[] = []
  return {
    rows,
    async insert(r) {
      rows.push(r)
    },
    async recentCount() {
      return recent + rows.length
    },
  }
}

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost/agent/feedback/send", {
    method: "POST",
    headers: { "content-type": "application/json", "sec-fetch-site": "same-origin", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  })

test("validation keeps the lists strict and caps every text", () => {
  const ok = validateReport({ ...good, happened: "x".repeat(5000), model: "<script>alert(1)</script>model", file: "src/app/secret.ts" })
  assert.ok(ok.ok)
  if (!ok.ok) return
  assert.equal(ok.report.happened.length, TEXT_CAP)
  assert.ok(!ok.report.model.includes("<"), ok.report.model)
  assert.equal(ok.report.file, "", "a path outside Contextual's files is dropped")
  assert.deepEqual(ok.report.harnessFolders, [".agents", ".claude"])
  assert.equal(ok.report.checkErrors, 0)

  for (const [field, value] of [["harness", "cursor"], ["category", "praise"], ["severity", "blocked!"], ["skill", ""]]) {
    assert.equal(validateReport({ ...good, [field]: value }).ok, false, `${field}: ${value}`)
  }
  assert.equal(validateReport({ ...good, happened: "   " }).ok, false)
  assert.equal(validateReport([good]).ok, false)
  // Unknown fields are ignored, odd values fall back.
  const odd = validateReport({ ...good, ip: "1.2.3.4", os: "beos", harnessFolders: [".agents", "../etc", 7], check: { errors: -1 } })
  assert.ok(odd.ok && !("ip" in odd.report) && odd.report.os === "other" && odd.report.checkErrors === null)
  assert.ok(odd.ok && odd.report.harnessFolders.length === 1)
})

test("the fragment decodes the CLI's base64url JSON, and anything else is null", () => {
  const encoded = Buffer.from(JSON.stringify({ harness: "codex", happened: "Ünïcode ✓" }), "utf8").toString("base64url")
  assert.deepEqual(readFragment(`#report=${encoded}`), { harness: "codex", happened: "Ünïcode ✓" })
  assert.equal(readFragment(""), null)
  assert.equal(readFragment("#report=%%%"), null)
  assert.equal(readFragment("#report=bm90IGpzb24"), null)
})

test("Send stores one valid report, with the server's own caps", async () => {
  const store = memoryStore()
  const res = await handleSend(post({ ...good, suggestion: "y".repeat(900) }), { store, limiter: createLimiter(), visitor: "v" })
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { ok: true })
  assert.equal(store.rows.length, 1)
  assert.equal(store.rows[0].suggestion.length, TEXT_CAP)
})

test("Send drops the honeypot quietly, and refuses other sites, oversized and unreadable bodies", async () => {
  const store = memoryStore()
  const limiter = createLimiter()
  const bot = await handleSend(post({ ...good, [HONEYPOT]: "http://spam.example" }), { store, limiter, visitor: "v" })
  assert.equal(bot.status, 200)
  assert.equal(store.rows.length, 0, "nothing stored for a bot")

  assert.equal((await handleSend(post(good, { "sec-fetch-site": "cross-site" }), { store, limiter, visitor: "v" })).status, 403)
  assert.equal((await handleSend(post("x".repeat(BODY_CAP + 1)), { store, limiter, visitor: "v" })).status, 413)
  assert.equal((await handleSend(post("{not json"), { store, limiter, visitor: "v" })).status, 400)
  assert.equal((await handleSend(post({ ...good, harness: "nope" }), { store, limiter, visitor: "v" })).status, 400)
  assert.equal(store.rows.length, 0)
})

test("Send limits each visitor and everyone together, and says so when storage isn't set up", async () => {
  const store = memoryStore()
  const limiter = createLimiter({ max: 2 })
  for (let i = 0; i < 2; i++) assert.equal((await handleSend(post(good), { store, limiter, visitor: "a" })).status, 200)
  assert.equal((await handleSend(post(good), { store, limiter, visitor: "a" })).status, 429)
  assert.equal((await handleSend(post(good), { store, limiter, visitor: "b" })).status, 200, "another visitor isn't affected")

  const busy = memoryStore(OVERALL.max)
  assert.equal((await handleSend(post(good), { store: busy, limiter: createLimiter(), visitor: "c" })).status, 429)
  assert.equal(busy.rows.length, 0)

  assert.equal((await handleSend(post(good), { store: null, limiter: createLimiter(), visitor: "d" })).status, 503)
})

test("the visitor key isn't the address, and doesn't repeat across addresses", () => {
  const a = visitorKey("203.0.113.7")
  assert.ok(!a.includes("203"), a)
  assert.equal(a, visitorKey("203.0.113.7"))
  assert.notEqual(a, visitorKey("203.0.113.8"))
})

test("the owner cookie holds a keyed hash of the secret, never the secret", () => {
  const secret = "a-long-random-secret-for-the-test"
  const token = ownerToken(secret)
  assert.ok(!token.includes(secret))
  assert.equal(isOwner(token, secret), true)
  assert.equal(isOwner(ownerToken("another secret"), secret), false)
  assert.equal(isOwner(token, undefined), false, "no secret set: nobody gets in")
  assert.equal(isOwner(undefined, secret), false)
})
