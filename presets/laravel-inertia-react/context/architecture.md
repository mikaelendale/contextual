# Architecture

## Overview
One Laravel app. Controllers load data with Eloquent and return Inertia pages; React renders them in the browser. Forms post back to controllers, which validate, save and redirect. <!-- fill: where the database runs and which outside services the app calls. -->

## Parts
| Part | Where | What it does |
|---|---|---|
| Routes | `routes/web.php` | Every page and form endpoint |
| Controllers | `app/Http/Controllers/<Feature>/` | Load data, validate input, return pages |
| Models | `app/Models/` | Eloquent models and their relationships |
| Pages | `resources/js/pages/<feature>/` | React components, one per page |
| App shell | `resources/js/app.tsx`, `resources/js/layouts/`, `resources/css/app.css`, `bootstrap/`, `config/` | Owned by `foundation` |
| UI building blocks | `resources/js/components/ui/` | Buttons, inputs, dialogs: no product logic |

## How a request flows
<!-- fill: one typical user action, followed through the code as a numbered list with file paths: the route, the controller, the model, the page. -->

## Data
<!-- fill: the main tables, grouped by the feature that owns them, with the migrations that create them. -->

## Outside services
| Service | Used for | Called from |
|---|---|---|
<!-- fill: one row per service. -->

## Boundaries
- A feature's controllers, pages, models and migrations stay in its own folders and file names, so its `covers:` globs can find them.
- Features talk to each other through models and their relationships, not through each other's controllers.
- The app shell, layouts, root config, `bootstrap/`, `config/` and the test setup belong to the `foundation` feature.
- The line below lists only UI building blocks and generated files.
<!-- fill: add generated folders, such as route helpers a package generates into resources/js/, to the line below. -->
shared: resources/js/components/ui/**
