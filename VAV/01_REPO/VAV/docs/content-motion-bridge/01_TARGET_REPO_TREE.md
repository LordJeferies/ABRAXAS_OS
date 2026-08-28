# Target Repository Tree

```text
vav-captions/
│
├── apps/
│   ├── captions-desktop/              # React/Vite UI + Tauri shell
│   └── captions-cli/                  # Headless batch/automation entrypoint
│
├── services/
│   ├── local-engine/                  # Long-running Node orchestration
│   │   ├── jobs/
│   │   ├── ipc/
│   │   ├── health/
│   │   ├── media/
│   │   ├── importers/
│   │   ├── planning/
│   │   ├── compilers/
│   │   ├── render/
│   │   └── export/
│   └── remotion-worker/               # Optional later separation
│
├── packages/
│   │
│   ├── foundation/
│   │   ├── schema/                    # Zod contracts
│   │   ├── timebase/                  # integer microseconds, rational FPS
│   │   ├── actions/                   # VAV Actions
│   │   ├── events/                    # domain events
│   │   ├── jobs/                      # progress/cancel/retry
│   │   ├── cache/                     # dependency-hash cache
│   │   └── provenance/                # SOURCE/USER/AI/EDITORIAL/SYSTEM
│   │
│   ├── project/
│   │   ├── project-model/
│   │   ├── project-session/
│   │   ├── migrations/
│   │   ├── asset-registry/
│   │   ├── font-registry/
│   │   ├── workspace-layout/
│   │   └── recovery/
│   │
│   ├── content-os/
│   │   ├── ficha-domain/              # content_id, modules, versions
│   │   ├── content-import/            # TXT/MD/HTML/JSON adapters
│   │   ├── content-intent/            # hook/development/close/CTA map
│   │   ├── module-graph/              # consumes/produces/invalidation
│   │   ├── projection-contracts/      # TXT/HTML/JSON view contracts
│   │   └── bridge-manifest/           # Universal Content OS ↔ VAV
│   │
│   ├── media/
│   │   ├── media-domain/
│   │   ├── source-map/                # source ↔ edited timeline mapping
│   │   ├── proxy/
│   │   ├── scene-model/
│   │   ├── frame-analysis/
│   │   └── vision/
│   │
│   ├── speech/
│   │   ├── transcription/
│   │   ├── alignment/
│   │   ├── speakers/
│   │   ├── glossary/
│   │   └── correction/
│   │
│   ├── captions/
│   │   ├── caption-domain/
│   │   ├── segmentation/
│   │   ├── emphasis/
│   │   ├── styles/
│   │   ├── structures/
│   │   ├── visual-priors/
│   │   ├── layout/
│   │   ├── placement/
│   │   ├── scene-smart/
│   │   ├── caption-motion/            # subtitle animation only
│   │   ├── caption-document/
│   │   ├── caption-tracks/
│   │   ├── review/
│   │   └── property-resolution/
│   │
│   ├── visual-motions/
│   │   ├── visual-motion-domain/      # Motion 00–07 / B-roll context
│   │   ├── motion-library/            # family metadata
│   │   ├── motion-import/             # TXT/HTML/manifest ingestion
│   │   ├── motion-context/            # instantiated time ranges
│   │   ├── motion-caption-policy/     # how captions behave per motion
│   │   └── occupancy-map/             # visual critical/reserved regions
│   │
│   ├── orchestration/
│   │   ├── module-graph/
│   │   ├── dependency-invalidation/
│   │   ├── content-resolver/
│   │   ├── timeline-reconciler/
│   │   ├── caption-compiler/
│   │   └── plan-reconciler/
│   │
│   ├── render/
│   │   ├── remotion-composition/
│   │   ├── text-layout/
│   │   ├── fonts/
│   │   ├── render-plan/
│   │   ├── qc/
│   │   └── export-system/
│   │
│   ├── editor/
│   │   ├── editor-state/
│   │   ├── commands/
│   │   ├── history/
│   │   ├── selection/
│   │   ├── snapping/
│   │   ├── markers/
│   │   ├── navigator/
│   │   ├── dock-layout/
│   │   └── multiwindow-session/
│   │
│   └── interchange/
│       ├── vav-project/
│       ├── vav-manifest/
│       ├── vav-motion-manifest/
│       ├── vav-edit-map/
│       ├── vav-content-bridge/
│       └── ai-package/
│
├── presets/
│   ├── caption-styles/
│   ├── caption-structures/
│   ├── caption-motions/
│   ├── visual-motion-policies/
│   ├── behaviors/
│   ├── platform-safe-zones/
│   ├── workspaces/
│   └── brand-kits/
│
├── schemas/
│   ├── project/
│   ├── content/
│   ├── motion/
│   ├── caption/
│   ├── timeline/
│   └── interchange/
│
├── fixtures/
│   ├── transcripts/
│   ├── content-os/
│   ├── motion-manifests/
│   ├── edit-maps/
│   └── caption-plans/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── golden-frames/
│   └── workflow-scenarios/
│
├── docs/
│   ├── architecture/
│   ├── contracts/
│   ├── ui-canon/
│   ├── motion-library/
│   ├── content-bridge/
│   ├── workflows/
│   ├── decisions/
│   └── development-log/
│
├── models/
├── tools/
└── scripts/
```

Physical Corrida 01 may collapse some folders into packages to avoid needless
monorepo overhead, but these domain boundaries are the target map.
