# ABRAXAS FRONTEND VISUAL GRAMMAR V1

## 1. Purpose & Scope
This document defines the binding visual, spatial, motion, and interaction standards for all ABRAXAS user-facing interfaces, ensuring brand unity, engineering rigor, and cinematic elegance across all modules.

---

## 2. Two Modes of the Unified System
ABRAXAS interfaces operate in two distinct but cohesive modes sharing the same core design tokens:

1. **OPERATING MODE** (*Workspaces, Dashboards, Editors*)
   - Focused on density, high-velocity task execution, tabular legibility, calendar scheduling, and non-blocking operational telemetry.
   - Primary Surface: High-contrast legible dark / editorial light panels with liquid glass chrome.
   - Spatial Role: Contextual landmark (reserved region/panel) reflecting live entity states (blockers, deadlines, dependencies) without reducing reading area.

2. **STORY MODE** (*Public Status, Landing, Product Architecture*)
   - Focused on chapter-based progressive storytelling, system conceptualization, and evidence-backed capability proof.
   - Primary Surface: Immersive Spatial Dark with sticky spatial canvas and interactive module exploration.
   - Spatial Role: Protagonist / state-reactive scene mapping the entire 10-module constellation and knowledge relationships.

---

## 3. Reference Extraction & ABRAXAS Authority
ABRAXAS frontend architecture draws upon three gold-standard paradigms while maintaining strict semantic independence:

| Reference Paradigm | Core Extraction & Emulated Principles | ABRAXAS Invariant & Authority |
|---|---|---|
| **Apple Product Pages** | Information architecture, sticky scroll progression, horizontal highlight carousels, clean typography hierarchy, responsive recomposition, and refined restraint. | Emulate interaction patterns and page grammar only. Zero Apple proprietary text, logos, or assets. |
| **MotionVFX** | High-impact audiovisual capability demonstration, poster-to-animated preview transitions, categorized video reels (Cuts, Captions, Motion), and tool proof. | Real rendered evidence from local engines (Remotion, FFmpeg). No fabricated renders or stock filler. |
| **Awwwards Top-Tier** | Semantic WebGL/spatial scenes, subtle cursor/scroll depth parallax, state-aware node highlighting, and liquid glass surfaces. | 3D represents real domain entities (modules, dependencies, feedback loops), never generic decorative orbs or random particle gimmicks. |
| **ABRAXAS** | Domain truth, RBAC security, deterministic public knowledge allowlists, and immutable activity ledgers. | Public Architect answers and status badges derive strictly from verified local data. Visualization is a projection, never the source of truth. |

---

## 4. Frontend Section Contract
Every public or top-level product section must explicitly define its structural descriptor:

```typescript
export type SectionIntent =
  | "HOOK"
  | "ORIENT"
  | "EXPLAIN"
  | "DEMONSTRATE"
  | "PROVE"
  | "EXPLORE"
  | "COMPARE"
  | "ACT"
  | "TRANSITION"
  | "CLOSE";

export type SectionDescriptor = {
  sectionId: string;
  sectionIntent: SectionIntent;
  contentClaim: string;
  visualRole: "HERO_STAGE" | "FEATURE_GRID" | "INTERACTIVE_EXPLORER" | "EVIDENCE_LEDGER" | "CHAT_DOCK";
  mediaType: "SPATIAL_CANVAS" | "VIDEO_PREVIEW" | "SCREENSHOT_PROOF" | "DATA_TABLE" | "NONE";
  mediaStyle: "PRODUCT_HERO" | "EDITORIAL_CONTEXT" | "UI_PROOF" | "MACRO_DETAIL" | "TECHNICAL_EXPLODED" | "ABSTRACT_SYSTEM" | "MOTION_PRESET" | "BEFORE_AFTER" | "DATA_EVIDENCE";
  motionFamily: WebMotionFamily;
  scrollMode: "STICKY_CHAPTER" | "NATURAL_SCROLL" | "CAROUSEL_SNAP";
  interactionMode: "DIRECT_SELECT" | "QUERY_PROMPT" | "HOVER_PREVIEW" | "NONE";
  navContext: string;
  ctaRole?: "PRIMARY" | "SECONDARY" | "NONE";
  spatialRole: "CONSTELLATION_OVERVIEW" | "MODULE_FOCUS" | "RELATIONSHIP_FOCUS" | "FEEDBACK_LOOP" | "NONE";
  evidenceLevel: "E1_STATIC" | "E2_UNIT" | "E3_INTEGRATION" | "E4_RUNTIME";
  responsiveMode: "RECOMPOSE_STACK" | "DRAWER_CONVERT" | "SCROLL_PRESERVE";
  reducedMotionMode: "STOP_ANIMATION_LOOP_STATIC_RENDER";
};
```

---

## 5. Media Routing Canon & Purpose
Every media element must have a clear functional role:

- **EMOTION**: Evokes engineering precision and cinematic scale (Hero scenes).
- **EXPLAIN**: Clarifies system relationships and feedback loops (Architecture diagrams, Chapter breakdowns).
- **DEMONSTRATE**: Shows real user interaction or motion graphics execution (VAV Motion preview, UI workflows).
- **PROVE**: Provides concrete verification of runtime execution and test assertions (Evidence tables, build logs, health check summaries).

---

## 6. Web Motion Grammar (17 Reusable Families)
Motion must communicate state, hierarchy, and continuity. The 17 approved families are:
1. `FADE_REVEAL`: Gentle opacity resolve on entry.
2. `MASK_REVEAL`: Geometric clip-path expansion revealing content.
3. `LINE_STAGGER`: Sequential baseline reveal for typographic lines.
4. `WORD_EMPHASIS`: Micro-scale accentuation on key terms.
5. `SCALE_RESOLVE`: Smooth scale-in from 0.96 to 1.0.
6. `SLIDE_CONTINUITY`: Horizontal transition preserving spatial direction.
7. `MATCH_TRANSITION`: Shared-element expansion between list and detail views.
8. `DEPTH_REVEAL`: Layered z-axis separation on scroll.
9. `CAMERA_PUSH`: WebGL/spatial focal length tightening on active entity.
10. `CAMERA_PULL`: Spatial wide shot returning to system overview.
11. `CAMERA_REFRAME`: Smooth coordinate pan to focused module node.
12. `SCROLL_SCRUB`: Direct frame-by-frame coupling between scroll offset and visual state.
13. `STICKY_SEQUENCE`: Fixed viewport stage with changing narrative cards.
14. `CAROUSEL_SNAP`: Inertial touch/drag snap on horizontal items.
15. `HOVER_PREVIEW`: Interactive playback / expansion on cursor hover.
16. `STATE_MORPH`: Smooth SVG/Canvas boundary transition on filter/state change.
17. `COUNTER_RESOLVE`: Deterministic numeric roll to final verified count.

---

## 7. Spatial Scene Contract & Families
Spatial visualizations must be semantically mapped to domain reality:

- `SYSTEM_CONSTELLATION`: ABRAXAS OS core sphere with 10 orbiting canonical module nodes.
- `KNOWLEDGE_NETWORK`: Yod pattern and taxonomic reference links.
- `CONTENT_CORE`: Lienzo persistent semantic identity object.
- `OPERATIONS_GRAPH`: He task, assignment, blocker, and dependency graph.
- `REALITY_LAYERS`: Shim observed vs resolved source truth states.
- `TIMELINE_SPACE`: VAV cuts and Remotion visual motion timebase.
- `PIPELINE_GRAPH`: Multi-stage batch processing DAG.
- `METRICS_FIELD`: Engagement signals feeding back into Yod intelligence.
- `RELATIONSHIP_FOCUS`: Focused dual-node spotlight with directional edge lighting.

---

## 8. Spatial Runtime & Honesty Contract
1. **Honest State Reporting**:
   - `THREE_ACTIVE`: Set ONLY if a real `THREE.WebGLRenderer` with active scene, camera, and geometries is rendering.
   - `WEBGL_ACTIVE`: Set when native WebGL2/WebGL program is actively rendering geometries/shaders.
   - `FALLBACK_ACTIVE`: Set when 2D Canvas / SVG / CSS fallback is rendering.
   - Canvas2D must NEVER be reported as `THREE_ACTIVE` or `WEBGL_ACTIVE`.
2. **Resource & Performance Management**:
   - DPR Cap: `Math.min(window.devicePixelRatio || 1, 2.0)` to prevent mobile GPU throttling.
   - Visibility Throttling: Automatically pause `requestAnimationFrame` loop when document is hidden (`document.visibilityState === "hidden"`).
   - Viewport Culling: Pause spatial stage when scrolled out of viewport using `IntersectionObserver`.
   - Clean Disposal: Dispose geometries, materials, textures, and cancel animation loops on unmount.
3. **JS-Level Reduced Motion (`prefers-reduced-motion: reduce`)**:
   - Detecting `window.matchMedia("(prefers-reduced-motion: reduce)")` must cancel all continuous orbital loops and camera shakes, rendering clear static state representations.

---

## 9. Surface Language & Liquid Glass
- **Spatial Dark**: Deep cosmic slate background (`#070a0f` / `#090d13`) with subtle geometric grid lines (`rgba(255,255,255,0.05)`).
- **Liquid Glass**: Applied selectively to topbars, navigation rails, floating control docks, and Public Architect chat widgets using `backdrop-filter: blur(16px)` with semi-transparent surfaces (`rgba(15, 21, 32, 0.85)`). Real translucent optical separation without over-glassing dense tables.
- **Editorial Light Accent**: High-contrast, crystal-clear white/slate surfaces for calendar day cells, form fields, and audit ledgers.

---

## 10. Frontend Quality Score (100-Point Matrix)

| Dimension | Points | Evaluation Standard |
|---|---|---|
| Information Architecture | 12 | Clean chapter progression, no vertical dumps, exact single view in workspace |
| UX / Usability | 14 | Responsive forms, clear action hierarchy (Primary/Secondary/Overflow), Kanban blocker feedback |
| Visual Direction | 12 | Spatial Dark + Editorial Light, liquid glass, geometric typography |
| Content–Media Semantics | 10 | Every visual proves/explains a concrete claim; real product proof included |
| Typography / Hierarchy | 8 | Strict scale, high-contrast readable tokens, monospace entity metadata |
| Motion Grammar | 8 | Reusable motion families, zero gratuitous bounce, full JS reduced-motion stop |
| Spatial / Signature | 8 | Real-time state-aware 3D stage and spatial landmark reacting to queries |
| Interaction Quality | 8 | Snappy button responses, starter pills, carousel snap, drawer controls |
| Navigation | 5 | Sticky liquid glass topbar, categorized module dropdowns, active states |
| Responsive Recomposition | 5 | Seamless layouts across Mobile (390px), Tablet (768px), Desktop (1440px) |
| Accessibility | 4 | Semantic HTML, ARIA roles, high contrast ratios, touch targets $\ge 44$px |
| Performance | 3 | DPR capped $\le 2.0$, visibility pause, 60fps render loops, zero memory leaks |
| Evidence Honesty | 3 | Honest capability statuses (no false RELEASED claims), honest renderer state tags |
| **Total** | **100** | **Target: $\ge$ 90 / 100 with ZERO critical defects** |
