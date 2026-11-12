# Architecture

## Overview
One Next.js app. Server components render pages and read data; server actions change it. <!-- fill: where data lives and which outside services the app calls, in a sentence or two. -->

## Parts
| Part | Where | What it does |
|---|---|---|
| Routes | `src/app/` | Pages and layouts |
| Features | `src/features/<feature>/` | Each feature's actions, queries, components and tests |
| UI building blocks | `src/components/ui/` | Buttons, inputs, dialogs: no product logic |
| App shell | `src/app/layout.tsx`, `src/app/globals.css`, the root config | Owned by `foundation` |
<!-- fill: rows the plan's stack adds (database client, auth, email). -->

## How a request flows
<!-- fill: one typical user action, followed through the code as a numbered list with file paths. -->

## Data
<!-- fill: the main tables or collections, grouped by the feature that owns them, and where the schema lives. "None" if the app stores nothing. -->

## Outside services
| Service | Used for | Called from |
|---|---|---|
| Vercel | Hosting | – |
<!-- fill: one row per other service. -->

## Boundaries
- A feature never imports another feature's internals; it uses what the other feature exports from its folder's `index.ts`.
- Pages in `src/app/` stay thin: they call into `src/features/`.
- The app shell, layouts, root config and test setup belong to the `foundation` feature.
- The line below lists only UI building blocks and generated files.
<!-- fill: add generated folders the plan's stack creates, such as database migrations, to the line below. -->
shared: src/components/ui/**
