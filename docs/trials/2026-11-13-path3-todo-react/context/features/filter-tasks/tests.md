# Tests — Filter tasks

## Automated
None yet.

## How a person reaches it
Open the app. The All / Active / Completed buttons sit under the add form.

## How the agent checks it
1. `yarn dev` and open http://localhost:3000.
2. Click Active, then Completed, then All.

## What proves it works
Active shows Sleep and Repeat. Completed shows only Eat. All shows all three. Only the clicked button is underlined, with `aria-pressed="true"`.

## Last result
Not run yet. At setup, 2026-11-13, the code was only read.
