# Stack overview

**CLI.** Plain JavaScript modules on Node.js 20 or newer, with no runtime dependencies. It runs inside git hooks, so start-up time matters, and zero dependencies keeps installs and audits trivial (spec section 6).

**Tests.** Node's built-in test runner, so there's nothing to install. Most tests build real git repos in temp folders and run the CLI as a process.

**Package.** Published to npm as `usecontextual`, because `contextual` belongs to an unrelated package (spec 6.4). npm is the only registry.

**Skills, templates, presets and docs.** Markdown, because coding agents and people read the same files. A skill's `assets/` hold copies of `templates/`; the tests keep them identical.

**Site.** Next.js 16 with React 19 and Tailwind CSS 4, using shadcn/ui pieces, Phosphor icons and Paper Shaders for the live dither. It was the teaser site, moved into this repo as `site/`.

**CI.** GitHub Actions runs the CLI's tests on Node 20, 22, 24 and 26, and `check` on `example/`, for every push and pull request.
