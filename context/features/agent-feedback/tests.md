# Tests — Agent feedback

## Automated
- The CLI: `packages/cli/test/feedback.test.js`. Only these: `cd packages/cli && node --test test/feedback.test.js`.
- The site's server validation: `site/lib/feedback/validate.test.ts`, with `cd site && node --test lib/feedback/validate.test.ts`.

## How a person reaches it
In a project with feedback on, the agent runs `usecontextual feedback …` before its final answer, and a form opens in the browser.

## How the agent checks it
1. In a trial repo after `init`, run `feedback on`, then `feedback --print` with each kind of field.
2. Open the printed link against the site (`npm run dev` in `site/`, or a preview), and check the form shows exactly the fields.
3. Press Send with a test database, and see one row in the list page.
4. Run `feedback off`, and check `AGENTS.md` is back to what it was.

## What proves it works
The link carries everything in its fragment; the form shows it; one row appears after Send and none after closing the tab.

## Last result
Not run yet.
