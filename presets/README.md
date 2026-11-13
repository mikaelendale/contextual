# Presets

Ready-made stacks: a filled-in `stack/` folder plus matching `architecture.md` and `conventions.md`. `usecontextual init --preset <name>` lays one down in place of the blank templates; nothing that already exists is overwritten. `contextual-setup` then keeps the preset's defaults, fills the `<!-- fill: … -->` comments from the plan, and changes a default only where the plan says otherwise.

| Preset | Stack | Shared line |
|---|---|---|
| `next` | Next.js (App Router), TypeScript, Tailwind CSS, Vitest, Playwright, Vercel | `src/components/ui/**` |
| `laravel-inertia-react` | Laravel, Inertia, React with TypeScript, Tailwind CSS, Pest, Playwright | `resources/js/components/ui/**` |

Each preset keeps every heading of the template it replaces (the tests check), gives the app shell to the `foundation` feature, and adds a `stack/<lib>.md` for its framework. Versions are never written into a preset: they come from the project's own `package.json` or `composer.json`.
