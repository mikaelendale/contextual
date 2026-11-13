# Stack

| Layer | Choice | Notes |
|---|---|---|
| CLI | JavaScript modules, Node.js 20 or newer | No runtime dependencies; `packages/cli` |
| CLI tests | Node's test runner (`node:test`) | `npm test` in `packages/cli` |
| Package | npm, `usecontextual` | npm is the only registry |
| Skills, templates, presets, docs | Markdown | `skills/`, `templates/`, `presets/`, `docs/` |
| Site | Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, Phosphor icons, Paper Shaders | `site/`, with its own `AGENTS.md` |
| CI | GitHub Actions | `.github/workflows/ci.yml` |
| Site hosting | Vercel | Root Directory `site` |
