# Layouts

## App shell
Every signed-in page. A sidebar on the left (240px): the team's name, Links, Boards with each board listed, Settings. Content on the right, at most 960px wide. On phones the sidebar becomes a menu button at the top left.

## List page
For any list: links, boards, members.
1. Header row: the page title on the left, one primary action on the right ("Save link", "New board").
2. Filters, when the list has any.
3. The list: 40px rows divided by borders, with `Skeleton` rows while it loads.
4. When the list is empty, `EmptyState` replaces it: a short title, one sentence, and the same primary action.

Examples: `/app/links`, `/app/boards`.

## Detail page
One thing and what's in it, such as a board. Header: the name, then a ⋯ menu for rename and delete. Below it, the body of a list page.

When the list is empty, the empty state's action takes the person to where items get added. Links are added to boards from a link's ⋯ menu, so an empty board's action is "Go to Links".

Example: `/app/boards/[boardId]`.

## Settings page
Sections stacked down the page, at most 640px wide. Each has a title, one sentence and its controls. Destructive actions sit at the bottom of their section.

Example: `/app/settings/team`.

## Auth page
Sign-in and accepting invites. One 400px column in the middle of the page: the logo, a title, the form. Nothing else.

Example: `/sign-in`.
