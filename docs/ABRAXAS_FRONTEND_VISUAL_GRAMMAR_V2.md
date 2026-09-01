# ABRAXAS FRONTEND VISUAL GRAMMAR V2 (GENERAL)

## 1. Scope & Purpose
This document establishes the universal frontend visual, spatial, motion, and interaction standards for all ABRAXAS OS applications, workspaces, dashboards, communication surfaces, and future client experiences. It defines **general engineering and art-direction principles** without coupling the universal system to any single product application's specific geometry or surface palette.

Application-specific art direction (such as the Public Status V3 Spatial Pyramid) is specified in dedicated downstream documents and consumes these general rules.

---

## 2. Invariant Foundation (Preserved from V1)

All foundational invariants established in V1 remain fully binding across all interfaces:

1. **Two Core Operating Modes**:
   - **OPERATING MODE** (*Workspaces, Dashboards, Editors, Studio Desks*): Dense, high-velocity, high-contrast, tabular legibility, calendar scheduling, non-blocking operational telemetry. Spatial elements serve as contextual landmarks.
   - **STORY MODE** (*Public Status, Capability Portals, Architecture Walkthroughs*): Progressive chapter storytelling, state-driven spatial protagonist, evidence-backed capability proof.
2. **Honesty & Verification Reporting**:
   - `THREE_ACTIVE`: Set ONLY if a true `THREE.WebGLRenderer` with an active scene, camera, and geometries is rendering.
   - `WEBGL_ACTIVE`: Set when a native WebGL/WebGL2 program is rendering shader buffers.
   - `FALLBACK_ACTIVE`: Set when a 2D Canvas, SVG, or CSS fallback is active.
   - Never report 2D Canvas or SVG as 3D/WebGL.
3. **Resource & Performance Caps**:
   - DPR Cap: $\le 2.0$ on Desktop, $\le 1.5$ on Mobile.
   - Immediate pause of `requestAnimationFrame` render loops when document is hidden (`document.visibilityState === "hidden"`).
   - Viewport culling: Pause render loops when spatial canvas is scrolled out of viewport via `IntersectionObserver`.
   - Clean lifecycle disposal: Geometries, materials, textures, render targets, and listeners must be explicitly disposed of on unmount.
4. **JS-Level Reduced Motion (`prefers-reduced-motion: reduce`)**:
   - Cancel all continuous orbital loops, floating animations, and camera shakes.
   - Render deterministic static views with immediate clarity.

---

## 3. Hybrid Render Routing Canon

No single rendering technology is universally optimal. ABRAXAS frontends route rendering layers strictly by semantic purpose:

| Render Mode | Semantic Purpose | Typical Use Cases |
| :--- | :--- | :--- |
| **DOM / CSS** | Typographic readability, tabular data, forms, search, navigation, accessibility, responsive flow | Section headings, data tables, Kanban boards, chat interfaces, audit ledgers |
| **Three.js / WebGL** | Spatial topology, structural depth, real-time lighting, interactive inspection, state-driven camera choreography | System architecture stages, spatial navigators, relationship graphs, live node meshes |
| **Video (Remotion / FFmpeg)** | Audiovisual capability demonstration, motion playback | Video cut previews, kinetic motion graphic reels, timeline exports |
| **Frame-Sequence Canvas** | High-precision sequential scrubbing | Direct scroll-to-frame video inspection without browser decode stutter |
| **SVG** | Crisp technical schematics, vector diagrams | Pipeline DAG graphs, platform safe-zone overlays, flowcharts |
| **Static Proof Media** | Immutable forensic evidence | Verified engine render stills, test output logs, browser runtime screenshots |

---

## 4. Semantic 3D & Anti-AI-Slop Principle

3D in ABRAXAS is **semantic, structural, and state-reactive**. It is never decorative filler.

1. **No Decorative Orb Fields**: Every 3D mesh, node, line, or volume must directly correspond to a domain entity, module, lifecycle state, dependency, or event.
2. **Procedural-First Visual Strategy**: Prioritize procedural geometry, instanced meshes, and shader-driven materials over static pre-baked decorative assets.
3. **Proof Separation**:
   - 3D can **EXPLAIN**, **MAP**, and **ILLUMINATE** system architecture and data flows.
   - Only runtime executions, engine logs, and verified test assertions can **PROVE** capability.
   - 3D visual fidelity must never be substituted for real product evidence.

---

## 5. Camera Grammar

All spatial camera movements in ABRAXAS interfaces must express clear architectural intent through named camera behaviors:

| Camera Behavior | Semantic Intent | Motion Characteristics |
| :--- | :--- | :--- |
| `OVERVIEW` | Establish holistic system topology | Distant wide shot, balanced isometric or perspective framing |
| `PUSH` | Direct deep focus into a specific subsystem | Smooth focal length tightening with subtle depth-of-field emphasis |
| `PULL` | Return to systemic context from detail view | Controlled pullback revealing surrounding module connections |
| `ORBIT` | Inspect multi-dimensional relationships | Smooth circular or elliptical traverse around active system plane |
| `DIVE` | Enter inner domain mechanics or core state | Linear traverse through structural interior or central axis |
| `REFRAME` | Switch primary focus between peer components | Smooth ease-in-out translation between regional targets |
| `CROSS_SECTION` | Inspect reality vs plan or boundary membrane | Orthogonal cutaway reveal of internal layers |
| `EXIT` | Follow outbound distribution or export pipeline | Forward tracking shot along outward routing gates |
| `RETURN` | Trace telemetry or learning signal back to source | Upward tracking shot closing the systemic feedback loop |

---

## 6. Color Space, Lighting & Surface Materials

1. **Color Space & Tone Mapping**:
   - When rendering physically based Three.js / WebGL scenes, explicitly configure the color space (e.g. `sRGBEncoding` / `SRGBColorSpace`) and appropriate tone mapping algorithm (such as `ACESFilmicToneMapping` or `NeutralToneMapping`) calibrated to the project's art direction.
2. **Surface Palette Governance**:
   - Color palettes and surface contrast derive from the specific product, workspace, or client brand identity guidelines, always preserving high accessibility ratios ($\text{WCAG AA}\ge 4.5:1$).
   - Interfaces maintain disciplined light-and-shadow hierarchies, avoiding flat ambient-only scenes or uncalibrated fluorescent glows.
3. **Physical Material Properties**:
   - Use physical transmission, roughness, and metalness to convey real structural properties rather than generic plastic gloss.
   - Self-luminous emission is reserved for active energy conduits, focused nodes, or verified state indicators.

---

## 7. Capability Status → Material State Mapping

Visual systems representing system or workflow capabilities must deterministically reflect verified status data:

| Capability Status | Visual & Material Representation |
| :--- | :--- |
| `CURRENT_FUNCTIONAL` / `VERIFIED_LOCAL` | Solid structural geometry, crisp specular reflection, active stable emission |
| `PARTIAL_FUNCTIONAL` / `PARTIAL_FOUNDATION` | Semi-solid structure, segmented emission lines, moderate luminance |
| `IMPLEMENTED_UNVERIFIED` | Solid structure with rhythmic diagnostic amber pulse |
| `CONTRACT_ONLY` / `DESIGN_READY` | Translucent wireframe / architectural blueprint rendering, zero emission |
| `PLANNED` / `NOT_IMPLEMENTED` | Ghosted silhouette, low-opacity dashed edges, distant horizon |
| `BLOCKED` | Interrupted path, warning chevron highlight |

---

## 8. Render Tiers & Performance Governance

To guarantee smooth 60fps execution across diverse hardware, interfaces adapt across four render tiers:

1. **HIGH TIER** (Desktop / Dedicated GPU):
   - Full PBR materials, dynamic camera paths, subtle procedural bloom, particle trails, max DPR 2.0.
2. **BALANCED TIER** (Laptops / Mid-Range Devices):
   - Standard lighting, instanced geometry, simplified bloom/fog, max DPR 1.5.
3. **REDUCED TIER** (Mobile / Low-Power / Battery-Saver):
   - Flat/unlit shaders, minimal particle count, static camera angles, max DPR 1.0.
4. **STATIC TIER** (Reduced-Motion / WebGL Disabled):
   - Static 2D Canvas / SVG / CSS projections, zero continuous animation loops, 100% accessible text and controls.

---

## 9. Responsive Recomposition Strategy

Mobile viewports ($\le 390\text{px}$) must **recompose**, not merely scale down desktop layouts:
- Spatial stages switch to frontal, high-legibility camera angles with reduced travel distance.
- Complex multi-column narrative decks collapse into swipeable cards or accessible drawers.
- Interactive controls maintain a minimum touch target of $44\text{px} \times 44\text{px}$.
- Full information depth remains 100% accessible across all device classes.

---

## 10. Truthful Persuasive Copy & Narrative Integrity

1. **Persuasive Engineering Copy**:
   - ABRAXAS interfaces leverage curiosity, contrast, tension, open loops, and high specificity derived from YOD intelligence criteria.
2. **Strict Evidence Invariant**:
   - Persuasive storytelling must **never fabricate evidence**, **never invent capability**, and **never misrepresent outcomes**.
   - Every claim must be traceable to verified architecture, live data, or explicit test evidence.
