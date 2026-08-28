# ABRAXAS v1.2 · Technique Research / External Sources

## Goal
Re-audit the 41-technique library against current primary sources and use the techniques only where they improve a real ABRAXAS task.

## Apple design rules used as hard constraints
- **Sidebars:** leading navigation; on large canvases sidebars can float above content inside the Liquid Glass functional layer. ABRAXAS applies this to its left navigation and hides/collapses it responsively.
- **Mac layout:** exploit large displays to show more information with fewer nested levels while preserving comfortable density. This directly motivated the v1.2 typography/density increase and Studio/Calendar multi-column layouts.
- **Liquid Glass:** control/navigation layer, not generic card material. ABRAXAS v1.2 uses it for sidebar, topbar, command palette, Architect and transient controls; content cards use stable materials.
- **Scroll edge / content-under-navigation:** Product Story may visually extend beneath floating navigation; operational workspaces prioritize legibility.
- **Accessibility:** Reduced Motion/Reduced Transparency/contrast require fallbacks; v1.2 explicitly includes reduced-motion CSS/runtime fallbacks.

Primary references: Apple Human Interface Guidelines — Sidebars, Materials, Designing for macOS; WWDC25 Meet Liquid Glass; WWDC25 Get to know the new design system.

## CleanMyMac patterns used
- Smart Care: one prominent action → processing state → results → Review/Run.
- My Tools: reduce navigation steps; direct access to commonly needed tools, search and favorites.
- ABRAXAS adaptation: role shortcuts, next-action cards, module protagonist, results/blocked states, no generic dashboard wall.

Primary references: MacPaw CleanMyMac Smart Care; MacPaw My Tools.

## Motion / interaction research
- GSAP ScrollTrigger confirms the interaction vocabulary of trigger/pin/snap/scrub and responsive recalculation. ABRAXAS uses native IntersectionObserver/scroll state for LOCAL so no CDN is mandatory; the registry records GSAP-equivalent patterns conceptually.
- GSAP Flip/Draggable inform continuity and drag affordances, while v1.2 uses DOM state + native drag/drop in Calendar.
- MDN View Transition API is treated as progressive enhancement, not a hard dependency.
- `prefers-reduced-motion` is mandatory for motion reduction.
- Lenis was reviewed as a smooth-scroll option but is not forced into operational workspaces: ABRAXAS preserves native scrolling/keyboard behavior and offline simplicity.
- WebGL context loss and recovery requirements are why heavy WebGL techniques remain in the explicit visual-lab/deferred group rather than being inserted into critical workflows.

## Registry outcome
- Total: **41 techniques**.
- `implemented`: **18**.
- `selective`: **20** — implemented only on surfaces where the technique helps a task.
- `lab`: **3** — T08, T14, T38; retained as deliberate visual-lab capabilities because always-on WebGL/3D would reduce reliability of the local-first operational product.

The release does **not** claim “41 visual effects switched on.” It claims all 41 are researched, classified, mapped and gated, while critical operational UI only uses the techniques that improve clarity, state, navigation, continuity or production.
