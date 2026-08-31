# WEB TASTE COMPILER SPECIFICATION V1
*Compiler Pipeline from Abstract Taste Profile + Project Context to Concrete Design Intent Tokens*

**Classification**: `CANONICAL_SPECIFICATION`  
**Spec ID**: `ABX-SPEC-WEB-TASTE-COMPILER-V1`  
**Owning Domain**: `YOD // Visual Intelligence`

---

## 1. Pipeline Overview

The **YOD Web Taste Compiler** processes an input `TasteProfile` alongside project-specific domain metadata to generate a deterministic `DesignIntentBundle`.

```
┌─────────────────────────┐     ┌─────────────────────────┐
│      TasteProfile       │  +  │     ProjectContext      │
│ (Brand Aesthetic Rules) │     │ (Domain Nodes & Routes) │
└────────────┬────────────┘     └────────────┬────────────┘
             │                               │
             └───────────────┬───────────────┘
                             ▼
             ┌───────────────────────────────┐
             │   YOD Web Taste Compiler      │
             │   1. Hierarchy Validator      │
             │   2. Palette Balancer         │
             │   3. Material Shader Compiler │
             │   4. Viewport Adapter         │
             │   5. Fallback Generator       │
             └───────────────┬───────────────┘
                             ▼
             ┌───────────────────────────────┐
             │      DesignIntentBundle       │
             │   - CSS Custom Properties     │
             │   - Three.js Scene Parameters │
             │   - SVG Schematic Vectors     │
             │   - DOM Layout Guidelines     │
             └───────────────────────────────┘
```

---

## 2. Compilation Stages

### Stage 1: Typographic & Negative Space Scale
* Calculates typography scale ratio from `TasteProfile.typographyPreferences.scaleRatio`.
* Generates CSS clamp expressions for fluid responsiveness:
  - Hero headline: `clamp(2.4rem, 4.8vw, 3.8rem)`
  - Subheadings: `clamp(1.5rem, 2.8vw, 2.2rem)`
  - Monospace tags: `0.75rem – 0.85rem`

### Stage 2: Palette Balancing & Semantic Assignment
* Enforces the 88 / 9 / 3 ratio:
  - Base Dark Void: `--bg-primary: #070a0f`
  - Structural Borders: `--border-subtle: rgba(255, 255, 255, 0.08)`
  - Semantic Status Tokens:
    - `RELEASED_CURRENT`: `--accent-emerald: #10b981`
    - `POST_RC1_CANDIDATE`: `--accent-cyan: #38bdf8`
    - `CONTRACT_ONLY`: `--accent-purple: #a855f7`
    - `PLANNED`: `--accent-amber: #f59e0b`

### Stage 3: Material Shader Compilation
* Configures Three.js material pipelines:
  - Smoked crystal: Physical material with `transmission = 0.88`, `roughness = 0.08`, `ior = 1.55`.
  - Glancing Fresnel: Custom GLSL injected into `#include <dithering_fragment>` computing $\text{pow}(1.0 - |\mathbf{N} \cdot \mathbf{V}|, 2.5)$.
  - Planetary Rim: Custom atmosphere shader simulating Rayleigh atmospheric scattering around the dark body.

### Stage 4: WebGL Degradation & Fallback Generation
* Automatically derives a 100% vector SVG architectural schematic from 3D node coordinates when WebGL context fails.

