# Verifying a feature

A passing build or a green test run is not proof that the feature works. Check it the way a person would use it.

1. **Run the feature's tests** with the command in `tests.md`. Run the whole suite as well if `conventions.md` says it's quick.
2. **Drive it for real.** Follow "How the agent checks it" in `tests.md`: start the app the way `stack/requirements.md` says, open the page or run the command, and do what a person would do. Check what "What proves it works" lists.
3. **Look at the screens** if the feature has UI. Use whatever this machine has: a browser you can drive (Playwright, a browser tool), or a headless browser that saves screenshots. Look at 375px and at a desktop width, and see the empty, loading and error states.
4. **Run the deslop checklist** in `context/design/deslop.md` on every screen you changed, and record the result:
   - `Deslop: pass (<how you checked>)`, naming the screenshot path or the tool.
   - `Deslop: fixed <what>`, after fixing what failed and looking again.
   - `Deslop: not verified <reason>` when nothing here can render the UI. Say what's missing, and put "run the deslop checklist" first under Next in the status file.
5. **Tick acceptance boxes** in the README only for what you saw work. If you couldn't verify a line, leave it unticked and say why in the status file.
6. **Record the result** under Last result in `tests.md`.
