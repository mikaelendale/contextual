# Design principles

## Look and feel
Plain and accessible, the look of MDN's tutorial app: one white card on a light grey page, black-and-grey text, thick-bordered buttons and large touch targets. These values were read from `src/index.css` at setup. They describe what exists and can be changed.

## Color
Contrast measured against white (`#fff`, the card) unless noted.

| Token | Value | Use for | Contrast |
|---|---|---|---|
| page-bg | `#f5f5f5` | Page background behind the card | — |
| surface | `#ffffff` | The app card | — |
| text | `#4d4d4d` | Body text, default button borders | 8.45:1 (7.75:1 on page-bg) |
| strong | `#000000` | Primary button background, large input border | 21:1 |
| field-border | `#565656` | Rename input border | 7.34:1 |
| muted-border | `#d3d3d3` | Unpressed filter button border | 1.50:1 — below 3:1, see the `filter-tasks` notes |
| focus | `#228bec` | Dashed 3px focus outline | 3.52:1 |
| danger | `#ca3c3c` bg / `#bd2130` border | Delete button (white text 4.97:1) | 6.13:1 (border) |

There is no separate muted text color.

## Type
- Family: Arial, sans-serif. Root font size is 62.5%, so `1rem` = 10px.
- Body: 1.6rem/1.25, or 1.9rem/1.316 from 620px.
- Large label, input and button (`__lg`): 1.9rem, or 2.4rem from 620px. The add-form label is weight 300.
- Headings use the browser defaults. Buttons are `text-transform: capitalize`.

## Spacing
- Vertical rhythm: `.stack-small` 1.25rem (1.4rem from 550px), `.stack-large` 2.5rem (2.8rem from 550px).
- Card padding 1rem, or 4rem from 550px. Page max width 68rem, card content max width 50rem.
- Button padding 0.8rem 1rem 0.7rem, 0.8rem gap in `.btn-group`. Checkbox and touch targets are 44px.

## Shape and depth
- Square corners everywhere (text inputs reset to radius 0).
- Only the app card has a shadow: `0 2px 4px rgb(0 0 0/20%), 0 2.5rem 5rem rgb(0 0 0/10%)`.

## Motion
None. Nothing animates.

## Icons
None. The checkbox tick is drawn with CSS borders.

## Words
- Short and plain: "What needs to be done?", "Add", "Edit", "Delete", "Save", "Cancel", "N tasks remaining".
- Buttons are one verb. Visually hidden text completes them for screen readers ("Delete Eat", "Show Active tasks").
- There are no error messages today.
