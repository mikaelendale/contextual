# Stack overview

**Laravel.** Routing, validation, the database (Eloquent and migrations), auth, mail and queues come from one framework with one way of doing each.

**Inertia with React.** Controllers return pages instead of JSON, so there's no separate API to design and version, and the pages are React components in TypeScript.

**Tailwind CSS.** The design tokens in `design/principles.md` become the theme, so colors and spacing come from one place.

**Pest and Playwright.** Pest for controllers, models and rules; Playwright for the paths a person clicks through, and for the screenshots the deslop checklist needs.

<!-- fill: one short paragraph for hosting and for each choice the plan adds, saying why it was picked over the obvious alternative. -->
