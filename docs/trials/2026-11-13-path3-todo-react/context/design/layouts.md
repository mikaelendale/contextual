# Layouts

## Single card (the only page, `/`)
Used for the whole app. Top to bottom, inside the white `.todoapp` card centred on the grey page:

1. `h1` "TodoMatic", centred.
2. Add form: centred large label "What needs to be done?", full-width large input, full-width black Add button.
3. Filter row: All / Active / Completed toggle buttons in a `.btn-group`.
4. `h2` "N tasks remaining" (focusable, `tabIndex=-1`, gets focus after a delete).
5. Task list `ul`: each `li` shows a checkbox and name, then an Edit/Delete button row. While editing, it shows the rename form instead (label, input, Cancel/Save).

States:
- Empty: the heading reads "0 tasks remaining" and the list is empty. There's no separate empty message.
- Loading: none, since nothing loads.
- Error: none exist today.
