# Estructura objetivo

```text
~/Desktop/abraxasos/
│
├── 00_START_HERE/
│
├── ABRAXAS_CORE/
│   ├── YOD/
│   │   ├── 00_CANON/
│   │   ├── 01_CLIENT_INTELLIGENCE/
│   │   ├── 02_CONTENT_INTELLIGENCE/
│   │   ├── 03_FORMATS/
│   │   ├── 04_STRUCTURES/
│   │   ├── 05_PROMPT_INTELLIGENCE/
│   │   ├── 06_VISUAL_INTELLIGENCE/
│   │   ├── 07_MOTION_INTELLIGENCE/
│   │   ├── 08_COPY_INTELLIGENCE/
│   │   ├── 09_PLANNING_AND_CADENCE/
│   │   ├── 10_LEARNING_AND_METRICS/
│   │   ├── 11_SOURCE_TRUTH/
│   │   └── 12_SCHEMAS/
│   │
│   ├── HE/
│   │   ├── 00_PRODUCT/
│   │   ├── 01_LIENZO_UI/
│   │   ├── 02_WORKFLOW/
│   │   ├── 03_CALENDAR/
│   │   ├── 04_PUBLISHING/
│   │   ├── 05_METRICS/
│   │   ├── 06_TASKS_AND_TEAMS/
│   │   ├── 07_UI_SYSTEM/
│   │   └── 08_SYSTEM_STATUS/
│   │
│   ├── SHIM/
│   │   ├── 00_CANON/
│   │   ├── 01_SOURCE_INGEST/
│   │   ├── 02_SEGMENTATION/
│   │   ├── 03_STRUCTURE_MATCHER/
│   │   ├── 04_CANDIDATES/
│   │   ├── 05_RESOLUTION/
│   │   ├── 06_COPY_SYNC/
│   │   └── 07_CONTRACTS/
│   │
│   ├── ARQUITECTO/
│   │   ├── 00_CANON/
│   │   ├── 01_CONTEXT/
│   │   ├── 02_COACH_MODES/
│   │   ├── 03_SUGGESTIONS/
│   │   ├── 04_NAVIGATION/
│   │   ├── 05_RECORDING_DIRECTOR/
│   │   ├── 06_PRODUCTION_COACH/
│   │   ├── 07_QA_COACH/
│   │   └── 08_SYSTEM_KNOWLEDGE/
│   │
│   └── contracts/
│       ├── lienzo/
│       ├── events/
│       ├── artifacts/
│       ├── publishing/
│       ├── metrics/
│       ├── ai-roundtrip/
│       └── integrations/
│
├── VAV/
│   ├── ...
│   └── integrations/
│       ├── yod/
│       ├── shim/
│       ├── lienzo/
│       └── he/
│
├── SHARED_KNOWLEDGE/
│   ├── visual_grammar/
│   ├── motion_grammar/
│   ├── content_intelligence/
│   └── cross_product_contracts/
│
└── docs/
    └── abraxas-os-status/
        ├── index.html
        └── system-status.json
```

## Información mínima que debe tener cada nueva herramienta

- README;
- propósito;
- qué es;
- qué no es;
- inputs;
- outputs;
- data model;
- estados;
- eventos;
- acciones;
- permisos;
- dependencias;
- integración con Lienzo;
- integración con Arquitecto;
- UI/UX si aplica;
- prompts si aplica;
- QA;
- tests cuando exista código;
- ejemplos;
- anti-ejemplos;
- migración;
- roadmap;
- changelog/versiones.
