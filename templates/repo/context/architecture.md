# Architecture

## Overview
<!-- fill: one paragraph: what runs where, and how the parts talk to each other. -->

## Parts
<!-- fill: a table: Part | Where | What it does. One row per top-level part (app, API, workers, shared packages). -->

## How a request flows
<!-- fill: one typical user action, followed through the code as a numbered list with file paths. -->

## Data
<!-- fill: the main tables or collections, grouped by the feature that owns them, and where the schema lives. -->

## Outside services
<!-- fill: a table: Service | Used for | Called from. -->

## Boundaries
<!-- fill: rules about what may import or call what, for example "a feature never imports another feature's internals". End the section with one line, "shared: <comma-separated globs>", listing only generated files (such as migrations) and UI building blocks. The app shell, layout and config belong to the foundation feature. `usecontextual which` and `check` read that line. -->
shared:
