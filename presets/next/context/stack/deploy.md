# Deploy

## Where it runs
Vercel. Each pull request gets a preview deploy; `main` deploys to production.

## How a change ships
1. Open a pull request from the feature branch. CI runs `usecontextual check`, the unit tests and the end-to-end tests.
2. The owner reviews the preview deploy and merges.
3. Vercel builds and deploys `main`.
<!-- fill: steps the plan's stack adds, such as running migrations before the new code goes live. -->

## Rolling back
In Vercel, promote the previous production deployment. <!-- fill: how to undo a bad migration, if the stack has a database. -->

## Secrets
In the Vercel project's environment variables, per environment. <!-- fill: who can change them. -->
