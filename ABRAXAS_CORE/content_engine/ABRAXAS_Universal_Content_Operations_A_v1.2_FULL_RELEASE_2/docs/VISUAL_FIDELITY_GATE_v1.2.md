# ABRAXAS v1.2 · Visual Fidelity Gate

Every updated module must be reviewed against its primary reference and real task.

## Required checks
- **Anatomy:** Is the screen organized like the intended surface (Story / Workspace / Explorer), not a generic card grid?
- **Hierarchy:** Can the user identify location, dominant object, next action and state within five seconds?
- **Density:** Operational text is readable on desktop; no 7–10 px interface copy. Story uses larger typography without replacing content with giant text.
- **Spacing:** Uses system tokens and comfortable macOS-like density.
- **Liquid Glass:** Only navigation, sidebar, topbar, popover/sheet, Architect and other functional layers. Stable content surfaces do not use glass-on-glass.
- **Interaction:** Buttons execute registered Action Controller commands. Loading, Empty, Success and Error states exist where relevant.
- **Motion:** State/source-anchored and task-supporting; reduced motion preserves all information.
- **Accessibility:** keyboard, visible focus, semantic labels, non-color state cues and responsive layout.
- **Performance:** canvas/media/observers clean up on route changes; only one continuous visual runtime at a time.
- **Reference:** Registry records primary/secondary reference and technique IDs.

## Surface rules
- Product Story: MacBook Pro product-page composition + ABRAXAS Brain, highlights, closer-look, sticky showcases.
- Workspace: CleanMyMac/pro-app task focus; one dominant object/action; sidebar + inspector where useful.
- Explorer: search + filters + saved views + preview/context.

## Release blocker
A module fails the gate if its enhancement can be removed and the task becomes *more* understandable, or if any visible control has no real action behind it.
