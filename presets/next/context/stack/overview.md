# Stack overview

**Next.js with the App Router.** One app serves the pages and the server code: server components read data, and server actions or route handlers change it. There's no separate API service to deploy.

**TypeScript, strict.** Types catch mistakes at the boundaries between features before they reach the browser.

**Tailwind CSS.** Styles live next to the markup, and the design tokens in `design/principles.md` become the theme, so colors and spacing come from one place.

**Vitest and Playwright.** Vitest for logic and server actions; Playwright for the paths a person clicks through, and for the screenshots the deslop checklist needs.

**Vercel.** Every pull request gets a preview deploy, and `main` deploys to production.

<!-- fill: one short paragraph for each choice the plan adds (database, auth, email, payments), saying why it was picked over the obvious alternative. -->
