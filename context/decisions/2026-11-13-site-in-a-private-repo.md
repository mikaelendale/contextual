# The website's code moves to a private repository
Date: 2026-11-13 · Scope: site, agent-feedback, foundation

## Context
The website was in `site/` here, open source with the rest of the product. The owner doesn't want the site's code open source. The Vercel project behind contextual.mikaelen.site already builds the root of the private repo the teaser came from.

## Decision
The site's code lives at the root of that private repository and leaves this one. This repo keeps the product: the CLI, the skills, the templates, the presets, the example and the docs, including `docs/agent-feedback.md`, which says what a report holds. The CLI keeps linking to the form at contextual.mikaelen.site.

## Why not the alternatives
- Keeping it in `site/`: the owner's call.
- Rewriting this repo's history to remove every trace: it would need a force push to a public repo, would change every commit id since the start, and copies already made keep the old history anyway. Not done unless the owner asks.

## Revisit if
The owner wants the site open source again, or wants its old code gone from this repo's history.
