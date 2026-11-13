// Counting page visits: only the site's own pages count, only known paths, a few per address, nothing else stored.
// Run with: cd site && node --test lib/*/*.test.ts
import assert from "node:assert/strict"
import { test } from "node:test"

import { createLimiter } from "../rate-limit.ts"
import { PER_VISITOR, handleVisit, type CountedPath, type VisitStore } from "./visits.ts"

function memoryStore(): VisitStore & { added: CountedPath[] } {
  const added: CountedPath[] = []
  return {
    added,
    async add(path) {
      added.push(path)
    },
  }
}

const visit = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/visits", {
    method: "POST",
    headers: { "content-type": "application/json", "sec-fetch-site": "same-origin", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  })

test("a visit from the home page counts once, and only its path is stored", async () => {
  const store = memoryStore()
  const res = await handleVisit(visit({ path: "/", referrer: "https://example.com", screen: "1440x900" }), { store, limiter: createLimiter(PER_VISITOR), visitor: "v" })
  assert.equal(res.status, 204)
  assert.equal(res.headers.get("cache-control"), "no-store")
  assert.deepEqual(store.added, ["/"])
})

test("requests from other sites, or without the browser's same-origin mark, count nothing", async () => {
  const store = memoryStore()
  const limiter = createLimiter(PER_VISITOR)
  for (const site of ["cross-site", "same-site", "none"]) {
    assert.equal((await handleVisit(visit({ path: "/" }, { "sec-fetch-site": site }), { store, limiter, visitor: "v" })).status, 403, site)
  }
  const bare = new Request("http://localhost/api/visits", { method: "POST", body: JSON.stringify({ path: "/" }) })
  assert.equal((await handleVisit(bare, { store, limiter, visitor: "v" })).status, 403, "no header, as from curl")
  assert.equal(store.added.length, 0)
})

test("only counted pages count: the feedback form never does, and odd bodies are refused", async () => {
  const store = memoryStore()
  const limiter = createLimiter(PER_VISITOR)
  for (const body of [{ path: "/agent/feedback" }, { path: "/agent/feedback/reports" }, { path: "/nope" }, { path: 1 }, {}, null, [], "{not json", "5"]) {
    assert.equal((await handleVisit(visit(body), { store, limiter, visitor: "v" })).status, 400, JSON.stringify(body))
  }
  assert.equal((await handleVisit(visit({ path: "/", pad: "x".repeat(300) }), { store, limiter, visitor: "v" })).status, 413)
  assert.equal(store.added.length, 0)
})

test("one address counts a few times per session at most; others aren't affected", async () => {
  const store = memoryStore()
  const limiter = createLimiter(PER_VISITOR)
  for (let i = 0; i < PER_VISITOR.max; i++) assert.equal((await handleVisit(visit({ path: "/" }), { store, limiter, visitor: "a" })).status, 204)
  assert.equal((await handleVisit(visit({ path: "/" }), { store, limiter, visitor: "a" })).status, 429)
  assert.equal((await handleVisit(visit({ path: "/" }), { store, limiter, visitor: "b" })).status, 204)
  assert.equal(store.added.length, PER_VISITOR.max + 1)
})

test("without a database, or when it fails, nothing breaks and the status says why", async () => {
  assert.equal((await handleVisit(visit({ path: "/" }), { store: null, limiter: createLimiter(PER_VISITOR), visitor: "v" })).status, 503)
  const failing: VisitStore = {
    async add() {
      throw new Error("connection refused")
    },
  }
  assert.equal((await handleVisit(visit({ path: "/" }), { store: failing, limiter: createLimiter(PER_VISITOR), visitor: "v" })).status, 500)
})
