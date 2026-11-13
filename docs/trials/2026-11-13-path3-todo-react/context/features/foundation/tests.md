# Tests — Foundation

## Automated
None yet. The only automated check is `yarn lint`.

## How a person reaches it
Run `yarn dev`. The browser opens at http://localhost:3000.

## How the agent checks it
1. `yarn install`, then `yarn lint`. It should exit 0.
2. `yarn dev` and open http://localhost:3000.
3. Look at the page at 375px and at desktop width.

## What proves it works
The "TodoMatic" heading, the add form, three filter buttons, "3 tasks remaining", and the tasks Eat (ticked), Sleep and Repeat.

## Last result
Not run yet. At setup, 2026-11-13, the code was only read.
