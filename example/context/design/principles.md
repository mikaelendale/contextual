# Design principles

## Look and feel
Calm and dense, like a good email client: white and light grey, one teal accent, no illustrations. Lists rather than cards. The common actions have keyboard shortcuts.

## Color
| Token | Value | Use for |
|---|---|---|
| `background` | #FFFFFF | The page |
| `surface` | #F6F6F4 | Sidebar, hovered rows |
| `border` | #E4E4E0 | Dividers, inputs |
| `text` | #1B1B19 | Body text (17.3:1 on background) |
| `text-muted` | #6A6A64 | Secondary text (5.4:1 on background, 5.0:1 on surface) |
| `accent` | #0F766E | Primary buttons, links, the focus ring (white text on it: 5.5:1) |
| `accent-hover` | #115E59 | Primary buttons on hover |
| `danger` | #B42318 | Destructive actions and errors (6.6:1 on background) |

## Type
Inter for everything. Sizes: 12 for labels and dates, 14 for body text and controls, 16 for page intros, 20 for page titles, 24 for empty-state titles. Weights 400 and 600 only.

## Spacing
4, 8, 12, 16, 24, 32, 48. List rows are 40px tall, the sidebar is 240px wide, and content is at most 960px wide.

## Shape and depth
Radius 6px on controls, 10px on dialogs and menus, fully round only for avatars. Borders separate things. Only menus, dialogs and toasts get a shadow.

## Motion
150ms ease-out for hover and press, 200ms for dialogs and menus opening. Nothing moves on its own. With reduced motion, no transitions.

## Icons
Lucide, 16px, stroke width 1.5, in `text-muted` unless the icon is the action.

## Words
Sentence case everywhere. Buttons say what they do: "Save link", "New board", "Remove member". Errors say what happened and what to do: "That doesn't look like a link. Check the address and try again." No exclamation marks.

Keyboard: `n` saves a new link, `/` focuses search (when search ships), `Esc` closes dialogs and menus.
