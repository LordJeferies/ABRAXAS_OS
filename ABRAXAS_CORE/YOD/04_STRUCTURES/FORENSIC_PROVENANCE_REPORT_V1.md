# ABRAXAS YOD — Forensic Content Intelligence Context Freeze Report V1

**Task ID**: `ABX-F1-FINAL-CLOSURE-CONTEXT-FREEZE-001`  
**Module**: `YOD` (Content Intelligence, Structures, Formats, Hooks, CTAs, Patterns, Source Truth)  
**Status**: `F1_READY_FOR_ARCHITECTURE_REVIEW`  
**Gate**: `F1 — Forensic Content Intelligence`

---

## 1. Executive Summary & Context Freeze

This document establishes the frozen candidate context for Gate F1 (Forensic Content Intelligence).

F1 is strictly a **Knowledge, Registry, and Provenance** gate. It does not implement a runtime engine, modify VAV product code, or establish formal JSON Schemas (which belong to Gate F2).

Every promoted entity across the 6 candidate registries is traceably linked to verified source records in [`FORENSIC_SOURCE_LEDGER_V1.json`](file:///Users/lordjef/Desktop/abraxasos/ABRAXAS_CORE/YOD/11_SOURCE_TRUTH/FORENSIC_SOURCE_LEDGER_V1.json).

---

## 2. Frozen Registry File Hashes

The exact state of the F1 candidate registries is frozen under the following SHA-256 hashes:

| Registry File | Path | Size (Bytes) | SHA-256 |
| :--- | :--- | :--- | :--- |
| **Source Ledger** | `ABRAXAS_CORE/YOD/11_SOURCE_TRUTH/FORENSIC_SOURCE_LEDGER_V1.json` | 18800 | `05f46939ae860cb9e438b22405cc999290ebaa2901218eda8754ba5f605982c6` |
| **Structure Registry** | `ABRAXAS_CORE/YOD/04_STRUCTURES/STRUCTURE_REGISTRY_V1.json` | 33996 | `306856f628a6ed3d26ec4b86b2898418c78039cd9d7128dc5e8ac3eed5874d07` |
| **Format Registry** | `ABRAXAS_CORE/YOD/03_FORMATS/FORMAT_REGISTRY_V1.json` | 10262 | `8d619cd44a7e64d1d34c6111dc3ef281c3aaeff98a9c767eeef924a392c7077c` |
| **Hook Taxonomy** | `ABRAXAS_CORE/YOD/02_CONTENT_INTELLIGENCE/HOOK_TAXONOMY_V1.json` | 10232 | `bb0cc34ff5763d0528549fbfe9b9a0c15207804b18ff8e9e4c6f18613c373e92` |
| **CTA Taxonomy** | `ABRAXAS_CORE/YOD/02_CONTENT_INTELLIGENCE/CTA_TAXONOMY_V1.json` | 5612 | `e1c1473e49cb1fd361f5a55865723bc53222501263cbe672942fa8fef6acd4c6` |
| **Content Pattern Registry** | `ABRAXAS_CORE/YOD/02_CONTENT_INTELLIGENCE/CONTENT_PATTERN_REGISTRY_V1.json` | 5386 | `061c8dced91ce8fc324b1fb5a42241299b3137c0224e1c319d4c49f0348be80a` |
| **Source Requirement Library**| `ABRAXAS_CORE/YOD/11_SOURCE_TRUTH/SOURCE_REQUIREMENT_LIBRARY_V1.json` | 5380 | `cb2e1a79ac1eb618758aab25e198ba6808bed160b45108a58ca568caa5f86bd2` |

---

## 3. Source Ledger & Read Semantics Summary

* **Source Families Located**: 6
* **Source Families Semantically Read**: 6
* **Source Families Contributing to Promoted Entries**: 6
* **Total Ledger Source Records**: 18
* **Semantic Read Methods**:
  * `FULL_READ`: 17 records
  * `SELECTIVE_SECTION_READ`: 1 record (`ABRAXAS_INTRO_LAB_v2.1_CRITERIO_MAESTRO_AUTONOMO_CON_EJEMPLOS.txt`, Sections 0-3 audited)
  * `HASHED_ONLY`: 0 records
* **Archive Container**: `Downloads/Nueva carpeta con elementos 8/Referencias para logica de abraxas y sus contenidos y creaciones.zip` (SHA-256: `1f464d9633202e056421b09c81c9f13edae4ccf89abcb3b2a380d5a6678ef9b8`, Size: 307,281,719 bytes, Status: `LOCATED_AND_AUDITED`).

---

## 4. Final Registry Entity & Evidence-State Counts

| Registry | Declared Count | Actual Count | `OBSERVED` | `NORMALIZED` | `INFERRED` | `UNVERIFIED` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Structure Registry** | 10 | 10 | 5 | 5 | 0 | 0 |
| **Format Registry** | 8 | 8 | 6 | 2 | 0 | 0 |
| **Hook Taxonomy** | 11 | 11 | 9 | 2 | 0 | 0 |
| **CTA Taxonomy** | 7 | 7 | 6 | 1 | 0 | 0 |
| **Content Pattern Registry** | 8 | 8 | 4 | 4 | 0 | 0 |
| **Source Requirement Library** | 8 | 8 | 7 | 1 | 0 | 0 |
| **Total Promoted Entities** | **52** | **52** | **37 (71.2%)** | **15 (28.8%)** | **0 (0.0%)** | **0 (0.0%)** |

---

## 5. Seed Reconciliation Matrix

| Seed Family ID | Progression Roles | Seed Reconciliation Status | Corroborating Source Families |
| :--- | :--- | :--- | :--- |
| `EVIDENCE` | `claim → evidence → limitation → interpretation → decision` | **CORROBORATED** | `FAM_MOKA_EDITORIAL`, `FAM_CANONICAL_CONTENT_LAB` |
| `DIAGNOSIS` | `pain → cause → mechanism → decision → payoff` | **CORROBORATED** | `FAM_MOKA_EDITORIAL`, `FAM_CANONICAL_CONTENT_LAB` |
| `CONTRAST` | `belief → contradiction → explanation → implication` | **CORROBORATED** | `FAM_MOKA_EDITORIAL`, `FAM_INTRO_LAB` |
| `PROBLEM_MECHANISM_DECISION`| `problem → mechanism → decision` | **CORROBORATED** | `FAM_CANONICAL_CONTENT_LAB`, `FAM_MOKA_EDITORIAL` |
| `STORY` | `scene → tension → realization → implication` | **CORROBORATED** | `FAM_INTRO_LAB`, `FAM_CANONICAL_CONTENT_LAB` |
| `FRAMEWORK` | `problem → model → parts → use → rule` | **CORROBORATED** | `FAM_MOKA_CAROUSELS`, `FAM_CANONICAL_UNIVERSAL_OPS` |
| `CONVERSATION` | `question → disagreement → exploration → proof → resolution`| **CORROBORATED** | `FAM_CANONICAL_CONTENT_LAB`, `FAM_MOKA_EDITORIAL` |
| `CASE` | `situation → problem → intervention → result → lesson` | **PARTIALLY_CORROBORATED** | Candidate reserved for post-F1 expansion |
| `PROCESS` | `goal → steps → friction → correction → result` | **PARTIALLY_CORROBORATED** | Candidate reserved for post-F1 expansion |
| `DECISION` | `situation → options → tradeoff → criterion → decision` | **PARTIALLY_CORROBORATED** | Candidate reserved for post-F1 expansion |
| `OBJECTION` | `objection → why_reasonable → reframe → evidence → decision`| **PARTIALLY_CORROBORATED** | Candidate reserved for post-F1 expansion |
| `DEFINITION` | `term → misunderstanding → definition → mechanism → application`| **PARTIALLY_CORROBORATED** | Candidate reserved for post-F1 expansion |
| `MYTH` / `MYTH_REALITY` | `belief → why_it_feels_true → failure → mechanism → rule` | **PARTIALLY_CORROBORATED** | Candidate reserved for post-F1 expansion |
| `AUTHORITY` | `observation → mechanism → evidence → implication` | **PARTIALLY_CORROBORATED** | Candidate reserved for post-F1 expansion |
| `DEMO` | `problem → criterion → proof → demonstration` | **PARTIALLY_CORROBORATED** | Candidate reserved for post-F1 expansion |
| `SYSTEM` | `problem → components → relationships → operation → result` | **PARTIALLY_CORROBORATED** | Candidate reserved for post-F1 expansion |

* **Seed File Preservation**: [`STRUCTURE_REGISTRY_SEED_V1.json`](file:///Users/lordjef/Desktop/abraxasos/ABRAXAS_CORE/YOD/04_STRUCTURES/STRUCTURE_REGISTRY_SEED_V1.json) is preserved completely untouched as historical input.

---

## 6. Downstream Stable IDs for Gate F2

* **Structure IDs**: `STR_EVIDENCE_LIMITATION_DECISION`, `STR_DOUBLE_HOOK_INTENSITY_CURVE`, `STR_CONTRAST_BELIEF_CONTRADICTION`, `STR_PROBLEM_MECHANISM_DECISION`, `STR_THREE_ACT_INTRO_LAB`, `STR_FRAMEWORK_MODEL_PARTS_RULES`, `STR_CONVERSATION_DISAGREEMENT_SYNTHESIS`, `STR_WETLAB_MOLECULAR_VALIDATION_LEVELS`, `STR_ENTERPRISE_PREQUALIFICATION_ROADMAP`, `STR_MOKA_TOPIC_ROOM_RECORDING_FICHA`.
* **Format IDs**: `FMT_SHORT_VERTICAL_VIDEO`, `FMT_HORIZONTAL_LONGFORM_VIDEO`, `FMT_LINKEDIN_CAROUSEL`, `FMT_PODCAST_MASTER`, `FMT_PODCAST_CLIP_STANDALONE`, `FMT_LINKEDIN_TEXT_POST`, `FMT_HYBRID_VIDEO_SLIDES`, `FMT_NEWSLETTER_DEEPDIVE`.
* **Hook IDs**: `HK_QUESTION_DEBT`, `HK_EVIDENCE_FIRST`, `HK_CONTRARIAN_REFRAMING`, `HK_SPECIFIC_RESULT_PROMISE`, `HK_PROBLEM_DIAGNOSIS`, `HK_UNEXPECTED_MECHANISM`, `HK_OBJECTION_INTERCEPT`, `HK_DEFINITION_CHALLENGE`, `HK_CASE_OPENING_SCENE`, `HK_PROCESS_REVEAL`, `HK_DOUBLE_HOOK_DIRECT_PAIN`.
* **CTA IDs**: `CTA_NO_CTA_AUTHORITY`, `CTA_CONTEXTUAL_DISCUSSION`, `CTA_ASSET_TRANSFER`, `CTA_CONSULTATIVE_INTAKE`, `CTA_SOURCE_ATTRIBUTION`, `CTA_SUBSCRIBE_SERIALIZED`, `CTA_COMMUNITY_PARTICIPATION`.
* **Pattern IDs**: `PAT_UPSTREAM_DIAGNOSIS_OVER_SYMPTOMS`, `PAT_TECHNICAL_RIGOR_OVER_MARKETING_HYPE`, `PAT_EVIDENCE_LADDER_VERIFICATION`, `PAT_UNRESOLVED_COMPLEXITY_ACKNOWLEDGMENT`, `PAT_TOOL_AGNOSTIC_FIRST_PRINCIPLES`, `PAT_DUAL_SPEAKER_SCIENTIFIC_COMMERCIAL_BALANCE`, `PAT_CONVERSATIONAL_STRESS_TESTING`, `PAT_CAPITAL_EXPOSURE_PREQUALIFICATION`.
* **Source Requirement IDs**: `REQ_PRIMARY_METRIC_DATA`, `REQ_EXPERIMENTAL_ASSAY_LOG`, `REQ_EXPERT_RECORDING_SEGMENT`, `REQ_SYSTEM_ARCHITECTURE_MAP`, `REQ_HISTORICAL_CASE_TIMELINE`, `REQ_PEER_REVIEWED_PAPER_CITATION`, `REQ_REGULATORY_COMPLIANCE_STANDARD`, `REQ_LIVE_EXECUTION_SCREEN_CAPTURE`.
