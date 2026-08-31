# WEB EXPERIENCE PATTERN LIBRARY V1
*Reusable Composable Patterns for High-End Digital Experiences*

**Classification**: `SHARED_KNOWLEDGE_PATTERN_LIBRARY`  
**Pattern Library ID**: `ABX-LIB-WEB-EXPERIENCE-PATTERNS-V1`  
**Owning Domain**: `Shared Knowledge // Visual Grammar`

---

## 1. Composable Web Patterns

### Pattern 01: The Monumental Negative Space Hero (`HERO_MONUMENTAL_V1`)
* **Intent**: Establish the primary premise and mood with supreme editorial confidence.
* **Composition**: 60–70% clean dark negative space, large fluid typography (`clamp(2.4rem, 4.8vw, 3.8rem)`), single tag badge, and dual CTA buttons ("Explore Journey" and "Verified Evidence").
* **Invariant**: Zero floating glass backdrop boxes behind hero copy.

### Pattern 02: The Operational Architecture Explorer (`SYSTEM_EXPLORER_V1`)
* **Intent**: Interactive 3D spatial exploration of deep multi-module systems.
* **Composition**:
  - **Left Rail**: Thin typographic directory with status pills and active module indicators.
  - **Center Canvas**: Interactive 3D Spatial Pyramid + External World planet + dynamic route tubes.
  - **Right Rail**: Contextual inspector with 15-point domain dossier, input/output contracts, and direct link to `/tools/{slug}/`.
  - **Header Switch**: `CURRENT` vs `TARGET` truth view toggle.

### Pattern 03: The Deep Domain Capability Page (`TOOL_DOSSIER_PAGE_V1`)
* **Intent**: Comprehensive, non-template-slop technical documentation for individual modules.
* **Composition**:
  - Distinct visual protagonist (e.g. pattern grid for Yod, crystalline spine for Lienzo, timeline forge for VAV, orbital routes for Publishing).
  - 15 deep architectural sections: What, Why, Problem Solved, Owns, Does Not Own, Inputs, Outputs, Source of Truth, Data Model, States, Events, Artifacts, Current Released vs Working Candidate vs Target, Next Steps, System Connections, Example Flow, Evidence, Debt, Criteria, DO/DON'T.
  - Distinct status badges: `RELEASED_CURRENT`, `POST_RC1_CANDIDATE`, `CONTRACT_ONLY`, `PLANNED`.

### Pattern 04: The DAG Pipeline Explorer (`PIPELINE_ROUTE_EXPLORER_V1`)
* **Intent**: Interactive visualization of multi-stage sequential and branching workflows.
* **Composition**:
  - Blueprint selector (`CORE_LOOP_FULL_V1`, `VAV_STANDARD_VIDEO_V1`, `GAP_RECOVERY_V1`).
  - Stage owner chips colored by owning domain.
  - 3D spline route tube rendered in center canvas with animated content pulse.

### Pattern 05: The Cryptographic Evidence Registry (`PROOF_REGISTRY_V1`)
* **Intent**: Verifiable proof registry citing Git commit SHAs, automated test suite results, and interactive media captures.
* **Composition**:
  - Release metadata cards with Git commit hashes (`v1.0.0-rc1`).
  - Test suite assertions with live pass counts.
  - Real interactive screenshots/videos when media exists; `[TEXTUAL EVIDENCE ONLY]` when none exists.

### Pattern 06: The Public Architect Query Surface (`PUBLIC_ARCHITECT_SURFACE_V1`)
* **Intent**: Contextual natural language and topic-based architectural guidance.
* **Composition**:
  - Floating/docked contextual query bar.
  - Dynamic 17-topic matrix answering engine.
  - Auto-focuses 3D camera onto the referenced domain upon question submission.

### Pattern 07: 2D High-Fidelity SVG Fallback (`SVG_SCHEMATIC_FALLBACK_V1`)
* **Intent**: Fail-closed operational continuity when WebGL is unsupported or disabled.
* **Composition**:
  - Precise 2D isometric SVG schematic of the Spatial Pyramid and External World.
  - Preserves 100% of DOM mode switching, directory selection, flow analysis, and public architect queries.

