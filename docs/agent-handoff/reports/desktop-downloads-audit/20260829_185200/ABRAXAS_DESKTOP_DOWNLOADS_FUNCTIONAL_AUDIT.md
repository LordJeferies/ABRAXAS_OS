# ABRAXAS FORENSIC AUDIT REPORT: DESKTOP & DOWNLOADS

**Task ID**: `ABX-FORENSIC-DESKTOP-DOWNLOADS-001`  
**Execution Timestamp**: `20260829_185200`  
**Canonical Workspace**: `/Users/lordjef/Desktop/abraxasos`  
**Audit Mode**: `READ-ONLY FORENSIC AUDIT`  

## 1. Executive Baseline & Scope

- **Canonical Git HEAD**: `40dee102e34048cb4243758a5a31ac45db73f2f7` (`main` == `origin/main`)
- **Total Desktop Items Evaluated**: 354
- **Total Downloads Items Evaluated**: 1030
- **Total Items Processed**: 1384
- **ABRAXAS Ecosystem Candidates Discovered**: 564
- **Exact Duplicates Identified**: 196
- **Migration Candidates (Possible Unique Code)**: 69
- **Unrelated Top-Level Items**: 820

## 2. Inventory & Classification Groups

### Group A: CURRENT CANONICAL (1 items)

| PATH | LOCATION | TYPE | CLASSIFICATION | FUNCTIONAL STATUS | UNIQUE CODE | RECOMMENDATION |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/Users/lordjef/Desktop/abraxasos` | Desktop | directory | CURRENT_CANONICAL | CURRENT VERIFIED | NO | `KEEP_CANONICAL` |

### Group B: COMPATIBILITY POINTERS (8 items)

| PATH | LOCATION | TYPE | CLASSIFICATION | FUNCTIONAL STATUS | UNIQUE CODE | RECOMMENDATION |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/Users/lordjef/Desktop/ABRAXAS_CONTENT_LAB_V3_1_VERIFIED` | Desktop | symlink | COMPATIBILITY_POINTER | CURRENT VERIFIED | NO | `KEEP_COMPATIBILITY` |
| `/Users/lordjef/Desktop/ABRAXAS_V3_1_EXECUTABLE_AUTOMATION` | Desktop | symlink | COMPATIBILITY_POINTER | CURRENT VERIFIED | NO | `KEEP_COMPATIBILITY` |
| `/Users/lordjef/Desktop/ABRAXAS_V4_1_MOTION_AUTOMATION` | Desktop | symlink | COMPATIBILITY_POINTER | CURRENT VERIFIED | NO | `KEEP_COMPATIBILITY` |
| `/Users/lordjef/Downloads/ABRAXAS_Universal_Content_Operations_A_v1.2_FULL_RELEASE 2` | Downloads | symlink | COMPATIBILITY_POINTER | CURRENT VERIFIED | NO | `KEEP_COMPATIBILITY` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_24_APPLE40M_RESUME_MASTER_PACKAGE` | Downloads | symlink | COMPATIBILITY_POINTER | CURRENT VERIFIED | NO | `KEEP_COMPATIBILITY` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_24_CONTINUITY_MASTER_PACKAGE` | Downloads | symlink | COMPATIBILITY_POINTER | CURRENT VERIFIED | NO | `KEEP_COMPATIBILITY` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_24_MOTION_1080P_40M_HOTFIX` | Downloads | symlink | COMPATIBILITY_POINTER | CURRENT VERIFIED | NO | `KEEP_COMPATIBILITY` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_5_HORIZONTAL_LONGFORM_HOTFIX` | Downloads | symlink | COMPATIBILITY_POINTER | CURRENT VERIFIED | NO | `KEEP_COMPATIBILITY` |

### Group C: CURRENT FUNCTIONAL OUTSIDE CANONICAL (1 items)

| PATH | LOCATION | TYPE | CLASSIFICATION | FUNCTIONAL STATUS | UNIQUE CODE | RECOMMENDATION |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/Users/lordjef/Desktop/ABRAXAS_OS_STATUS_SITE` | Desktop | directory | FUNCTIONAL_CURRENT_OUTSIDE_CANONICAL | CURRENT VERIFIED | YES | `KEEP_REFERENCE` |

### Group D: FUNCTIONAL BUT UNVERIFIED CANDIDATES (29 items)

| PATH | LOCATION | TYPE | CLASSIFICATION | FUNCTIONAL STATUS | UNIQUE CODE | RECOMMENDATION |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/Users/lordjef/Desktop/INSTALL_ABRAXAS_ANTIGRAVITY_CHATGPT_PRO.command` | Desktop | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Desktop/REFRESH_ABRAXAS_CHATGPT_CONTEXT.command` | Desktop | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Desktop/START_ABRAXAS_ANTIGRAVITY.command` | Desktop | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Desktop/VAV_ECOSYSTEM_FORENSIC_AUDIT_V2.command` | Desktop | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/08C_BUILD_MOTION_DESCRIPTIONS.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_MONITOR_CONTINUO_V3.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_MONITOR_EN_VIVO.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_MONITOR_SEGURO_V4_2_6.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_MONITOR_VERIFICADO_V5.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_COMMIT_NEXT_FOUNDATION_V1.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_FIX_AND_PUBLISH_ALL.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_INSTALL_NEXT_FOUNDATION_V1.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_RESUME_FIX_PUBLISH.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_SYNC_ALL_TO_GITHUB.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/CREAR_VAVCAPTIONS_SUBIDA_LIGERA_V10.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_ABRAXAS_OS_PHASE2A_MOVE_REPO (1).command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_ABRAXAS_OS_PHASE2B_PRODUCTS_CONTINUITY.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_ABRAXAS_OS_PHASE2C_INTERNAL_CLASSIFICATION.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_ABRAXAS_OS_PHASE3B_CANONICAL_SELECTION.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_ABRAXAS_OS_PHASE3_ABRAXAS_FUNCTIONAL_AUDIT.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_ABRAXAS_OS_PHASE4_CORE_CONSOLIDATION.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_ABRAXAS_OS_PHASE5R_SAFE_RETRY (1).command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_ABRAXAS_OS_PHASE5R_SAFE_RETRY.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_ABRAXAS_OS_PHASE5_GLOBAL_VERIFY.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_ABRAXAS_OS_PHASE6R_GITHUB_TERMINAL.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_ABRAXAS_OS_PHASE6_GITHUB_TERMINAL.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_CONTEXT_AUDIT_PREUPDATE_V12.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_ORGANIZE_UNIVERSAL_CONTINUITY_V14.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_STORAGE_AUDIT_CLEANUP_V1.command` | Downloads | file (.command) | FUNCTIONAL_UNVERIFIED_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |

### Group E: MIGRATION CANDIDATES WITH POSSIBLE UNIQUE CODE (69 items)

| PATH | LOCATION | TYPE | CLASSIFICATION | FUNCTIONAL STATUS | UNIQUE CODE | RECOMMENDATION |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/Users/lordjef/Desktop/ABRAXAS_V4_1_FULL_MOTION_TXT_HOTFIX` | Desktop | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Desktop/ABRAXAS_V4_2_MOTIONS_BESIDE_VIDEOS_HOTFIX` | Desktop | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Desktop/JOC55_AMANDA_TERMINAL_DAVINCI_AUTOMATION_V1` | Desktop | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Desktop/Joc podcast next ep 55` | Desktop | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Desktop/Moka_Premium_Automatizacion` | Desktop | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Desktop/Moka_Premium_Automatizacion_asd` | Desktop | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Desktop/Moka_Terminal_Cortes_48_FrameMatched_FINAL` | Desktop | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Desktop/Moka_Terminal_Cortes_48_FrameMatched_FINAL_FIX2` | Desktop | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Desktop/abraxas content lab con joc y amanda` | Desktop | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_CONTENT_LAB_V3_CINEMATIC_2026` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_FOUNDATION_V1_EXTRACTED_20260828_171540` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_GITHUB_PAGES_ACTIVATION_V1` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_NEXT_FOUNDATION_PACK_V1 (1).zip` | Downloads | file (.zip) | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_NEXT_FOUNDATION_PACK_V1.zip` | Downloads | file (.zip) | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_PUBLIC_STATUS_SITE_V1` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_Universal_Content_Operations_A_v1.2_FULL_RELEASE` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V3_1_EXECUTABLE_AUTOMATION` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_1_FULL_MOTION_TXT_HOTFIX` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_11_ONE_COMMAND_COMPLETE_FINISH` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_12_FINAL_REPAIR_JV07` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_12_MASTER_REFRESH_ONE_COMMAND` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_13_CLEAN_FINISH` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_14_FINAL_ORGANIZER` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_15_MEDIA_RELOCATION` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_16_CLEAN_STRUCTURE_MERGE` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_17_MOTION_AUDIT` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_18_MOTION_ENGINE_FIX` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_19_MOTION_OUTPUT_REBUILDER` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_20_FINAL_MOTION_REBUILD` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_21_SMART_MOTION_REBUILD` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_22_SMART_MOTION_SELECTOR` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_23_AI_MOTION_ANALYZER` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_24_AI_MOTION_DECISION_ENGINE` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_2_HOTFIX_37_VERTICALS` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_3_SIN_REVISION_MANUAL` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_6_RENDER_RESUME_SAFE_TERMINAL_HOTFIX` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_6_RENDER_RESUME_SAFE_TERMINAL_HOTFIX_V2` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_6_RESILIENT_QUEUE_HOTFIX` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_7_RESILIENT_WORKER_HOTFIX` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_8_MEDIA_STRUCTURE_HOTFIX` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_8_MONITOR_AND_MEDIA_HOTFIX` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_9_MEDIA_ORGANIZER_FAILED_REPAIR` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_HTML_DRIVEN_AUTOMATION` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_MOTIONS_BESIDE_VIDEOS_HOTFIX` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_3_REBALANCE_COMPACT_MOTIONS_HOTFIX` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_4_QUALITY_AUDIT_HOTFIX` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/JOC55_HOTFIX_FAST_V3_3_HW_DECODE_RESUME` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/JOC55_HOTFIX_FAST_V3_3_HW_DECODE_RESUME.zip` | Downloads | file (.zip) | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/JOC55_SPEAKER_BALANCED_OFFICIAL_REBUILD_V3` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/JOC55_SPEAKER_BALANCED_OFFICIAL_REBUILD_V3_2_MOTION_TREATMENT_V2` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAVCAPTIONS_CONTINUITY_V9` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAVCAPTIONS_ORGANIZER_V8` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_ABRAXAS_STYLE_MINING_SYSTEM_V2_MERGED` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_BOOTSTRAP_C01_V10_20260827_184025` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_C01_5_COMMANDS_20260827_193324` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_C01_6_20260827_194251` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_C01_FIX2_20260827_185435` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_CAPTIONS_C01_5_INTERACTIVE_UI_COMMANDS` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_CAPTIONS_C01_6_GUIDED_WORKFLOW_COMMANDS` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_CAPTIONS_PATCH_C01_ENGINE_REGISTRY_COMMA_FIX` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_CAPTIONS_PATCH_C01_FIX2_TYPECHECK_TAURI` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_FULL_ALPHA_20260827_202803` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_HOTFIX_V7_1` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_HOTFIX_V7_2` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_PORTABLE_PRO_V7` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VAV_SUBIDA_LIGERA_V10` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VIDEO_CONTENT_AUTOMATION_PLAYBOOK_V7_OFFICIAL_MASTERS_MIXED_INTROS_APPLE40M` | Downloads | directory | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VIDEO_CONTENT_AUTOMATION_PLAYBOOK_V7_OFFICIAL_MASTERS_MIXED_INTROS_APPLE40M.zip` | Downloads | file (.zip) | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/VIDEO_CONTENT_AUTOMATION_PLAYBOOK_V8_MOTION_TREATMENT_V2_APPLE40M.zip` | Downloads | file (.zip) | MIGRATION_CANDIDATE | CURRENT UNVERIFIED | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |

### Group F: HISTORICAL FUNCTIONAL SYSTEMS (0 items)

_No items in this category._

### Group G: REFERENCES (213 items)

| PATH | LOCATION | TYPE | CLASSIFICATION | FUNCTIONAL STATUS | UNIQUE CODE | RECOMMENDATION |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/Users/lordjef/Desktop/ASTRIS_VS_DOWNLOADS_DUPLICATES.txt` | Desktop | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/JOC_PODCAST_55_AMANDA_VICARI_CONTENT_REVIEW_INTRO_LAB_V1_2.html` | Desktop | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/MOKA_DIAGNOSTICO_LITERAL_V01_20260805_174958.zip` | Desktop | file (.zip) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/MOKA_REPORTE_CONSOLE_UNIVERSAL_V3_20260806_104044.txt` | Desktop | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/MOKA_REPORTE_CONSOLE_UNIVERSAL_V3_20260806_104123.txt` | Desktop | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/MOKA_REPORTE_HOTFIX_CONSOLE_FLUSH_V2_20260806_101110.txt` | Desktop | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/MOKA_REPORTE_HOTFIX_DAVINCI_20260806_100341.txt` | Desktop | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/MOKA_REPORTE_SRT_GAPS_V4_20260806_105805.txt` | Desktop | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/MOKA_REPORTE_SRT_GAPS_V4_20260806_105837.txt` | Desktop | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/MOKA_REPORTE_SRT_GAPS_V4_20260806_110120.txt` | Desktop | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/MOKA_REPORTE_TEXTPLUS_V5_20260806_115858.txt` | Desktop | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/Moka_Clips_Finales` | Desktop | directory | REFERENCE_ONLY | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/Moka_Cortes_Finales_48_DaVinci_Subtitulos` | Desktop | directory | REFERENCE_ONLY | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/Moka_Cortes_Finales_48_FrameMatched` | Desktop | directory | REFERENCE_ONLY | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/Moka_Cortes_Finales_48_Sin_Subtitulos` | Desktop | directory | REFERENCE_ONLY | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/Moka_Premium_Limpios_48` | Desktop | directory | REFERENCE_ONLY | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/Moka_Resolve_Input` | Desktop | directory | REFERENCE_ONLY | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/Seed • Whole Body Health Starts in the Gut.pdf` | Desktop | file (.pdf) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/VAV_HOTFIX_V7_2_TEST_DISCOVERY_20260827_210557.txt` | Desktop | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/VAV_MAC_FULL_AUDIT.txt` | Desktop | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/VAV_STORAGE_AUDIT.py` | Desktop | file (.py) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/VAV_STORAGE_AUDIT.txt` | Desktop | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/ejemplos joc copies` | Desktop | directory | REFERENCE_ONLY | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/heart.svg` | Desktop | file (.svg) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/llamadas moka` | Desktop | directory | REFERENCE_ONLY | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/mahgia-alada-MASTER.af` | Desktop | file (.af) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/mahgia-alada-MASTER.af~lock~` | Desktop | file (.af~lock~) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/mahgia-closed.svg` | Desktop | file (.svg) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/mahgia-master.svg` | Desktop | file (.svg) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/mahgia-open.svg` | Desktop | file (.svg) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/moka_resolve_batch 2.py` | Desktop | file (.py) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/moka_resolve_batch mucho tiempo con reframe.py` | Desktop | file (.py) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/moka_resolve_batch.py` | Desktop | file (.py) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/moka_resolve_batch_ANTERIOR.py` | Desktop | file (.py) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/vav-captioned-quality.mp4` | Desktop | file (.mp4) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/00_LEER_PRIMERO_CONTINUIDAD.md` | Downloads | file (.md) | REFERENCE_ONLY | HISTORICAL | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/2026-08-01-joc-agosto-editor-design.md` | Downloads | file (.md) | REFERENCE_ONLY | HISTORICAL | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_CONTENT_LAB_V3_CINEMATIC_2026.sha256` | Downloads | file (.sha256) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_INTRO_LAB_v1.2_CRITERIO_MAESTRO_NARRATIVA_PRODUCCION_CLEAN_REASSEMBLY.txt` | Downloads | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_INTRO_LAB_v1.2_PROMPT_MAESTRO_GENERADOR_3x4_CLEAN_REASSEMBLY.txt` | Downloads | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_INTRO_LAB_v1.3_CRITERIO_MAESTRO_AUTOMATION_EXPORTS.txt` | Downloads | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_INTRO_LAB_v1.3_PROMPT_MAESTRO_AUTOMATION_EXPORTS.txt` | Downloads | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_INTRO_LAB_v2.1_REFERENCE_LIBRARY` | Downloads | directory | REFERENCE_ONLY | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_MOTIONS_MANUAL_INTERACTIVO_V4.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_MOTIONS_TODOS_JUNTOS_V4.txt` | Downloads | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_MOTION_SYSTEM_V5_INTERACTIVE.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_Moka_Bio_Aigocy_Knowledge_OS_2026_ES_v2.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_Moka_Bio_Aigocy_Strategic_Content_Repository_2026_ES.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_Moka_Bio_Aigocy_Strategic_System_2026_ES.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_Moka_Bio_Strategic_Content_OS_11_10_ES (1).html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_Moka_Bio_Strategic_Content_OS_11_10_ES.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_GITHUB_PAGES_ACTIVATION_V1.zip` | Downloads | file (.zip) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_GIT_CRITERIA_PACK(1)(1).zip` | Downloads | file (.zip) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_GIT_CRITERIA_PACK.zip` | Downloads | file (.zip) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_PUBLIC_STATUS_SITE_V1.zip` | Downloads | file (.zip) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_OS_STATUS_DASHBOARD_V1.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_STYLE_MINING_V2_EXTENSION.zip` | Downloads | file (.zip) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_24_APPLE40M_RESUME_MASTER_PACKAGE.zip.sha256` | Downloads | file (.sha256) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/AUDITORIA_LLAMADAS_Y_GITHUB_V26_4.md` | Downloads | file (.md) | REFERENCE_ONLY | HISTORICAL | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/Based_on_the_two_men_202606041355.jpeg` | Downloads | file (.jpeg) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/CALL_DECISION_REGISTER_V26_4.json` | Downloads | file (.json) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/CODEX_HANDOFF_JOC55_V3_3.md` | Downloads | file (.md) | REFERENCE_ONLY | HISTORICAL | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/CONTINUATION_STATUS_2026-08-26.md` | Downloads | file (.md) | REFERENCE_ONLY | HISTORICAL | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/CÓMO CREAMOS UN INTRO AL ESTILO "THE DIARY OF A CEO".pdf` | Downloads | file (.pdf) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/CRITERIO_UNIVERSAL_FICHAS_CONTENIDO_V2_3_2026-08-26.zip` | Downloads | file (.zip) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/CRITERIO_UNIVERSAL_FICHAS_CONTENIDO_V2_5_2026-08-26.zip` | Downloads | file (.zip) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/Copia de Dr-Joc-10.txt` | Downloads | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/DaVinci_Resolve_Studio_20.2.2_Torrentmac.netjj` | Downloads | directory | REFERENCE_ONLY | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/Dr-Joc-10.srt` | Downloads | file (.srt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/Dr-Joc-10.txt` | Downloads | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/GUIA_HOTFIX.md` | Downloads | file (.md) | REFERENCE_ONLY | HISTORICAL | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/HTML_REFERENCES_ABRAXAS_VISOR_v1.0.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/IMG_1641.HEIC` | Downloads | file (.heic) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/IMG_1642.HEIC` | Downloads | file (.heic) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/IMG_6591.HEIC` | Downloads | file (.heic) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/INTROS_MIXTOS_I04_I05.md` | Downloads | file (.md) | REFERENCE_ONLY | HISTORICAL | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/Invoice Joc x Abraxas 2026 05 28.pdf` | Downloads | file (.pdf) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/Invoice Joc x Abraxas- Jun 225.pdf` | Downloads | file (.pdf) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/Invoice Joc x Abraxas.pdf` | Downloads | file (.pdf) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_AMANDA_CONTENT_ENGINE_V3_1 (1).html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_AMANDA_CONTENT_ENGINE_V3_1.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_AMANDA_CONTENT_ENGINE_V4 (1).html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_AMANDA_CONTENT_ENGINE_V4.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_AMANDA_INTRO_LAB_V3_1 (1).html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_AMANDA_INTRO_LAB_V3_1 (2).html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_AMANDA_INTRO_LAB_V3_1.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_AMANDA_INTRO_LAB_V4 (1).html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_AMANDA_INTRO_LAB_V4.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_BLOQUES_POTENCIAL_VT40.zip` | Downloads | file (.zip) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_MOTION_V2_TODO_ACTUALIZADO.zip` | Downloads | file (.zip) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_SPEAKER_BALANCED_OFFICIAL_REBUILD_V3.zip` | Downloads | file (.zip) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_SPEAKER_BALANCED_OFFICIAL_REBUILD_V3_2_MOTION_TREATMENT_V2.zip` | Downloads | file (.zip) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_V3_TODO_ACTUALIZADO.zip` | Downloads | file (.zip) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC_PODCAST_55_AMANDA_VICARI_CONTENT_REVIEW (1).html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC_PODCAST_55_AMANDA_VICARI_CONTENT_REVIEW_INTRO_LAB_V1_2.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC_PODCAST_SHIM_PROMPT_COMPOSER.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC_PODCAST_SHIM_REVIEW.html` | Downloads | file (.html) | REFERENCE_ONLY | CURRENT UNVERIFIED | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC_VISUAL_DESIGN_GENERATION_SYSTEM.txt` | Downloads | file (.txt) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC_visual_assets_package.zip` | Downloads | file (.zip) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/Joc lopez Facechart.png` | Downloads | file (.png) | REFERENCE_ONLY | HISTORICAL | NO | `KEEP_REFERENCE` |

_... [113 additional items listed in CSV/JSON]_  

### Group H: BACKUPS / CHECKPOINTS (2 items)

| PATH | LOCATION | TYPE | CLASSIFICATION | FUNCTIONAL STATUS | UNIQUE CODE | RECOMMENDATION |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/Users/lordjef/Desktop/ABRAXAS_OS_LOCAL_BACKUPS` | Desktop | directory | BACKUP_SNAPSHOT | HISTORICAL | POSSIBLE | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/ABRAXAS_OS_LOCAL_QUARANTINE` | Desktop | directory | BACKUP_SNAPSHOT | HISTORICAL | POSSIBLE | `KEEP_REFERENCE` |

### Group I: HANDOFFS (6 items)

| PATH | LOCATION | TYPE | CLASSIFICATION | FUNCTIONAL STATUS | UNIQUE CODE | RECOMMENDATION |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/Users/lordjef/Desktop/ABRAXAS_CHATGPT_PRO_CONTEXT.zip` | Desktop | file (.zip) | ARCHIVE_HANDOFF | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Desktop/VAV_CURRENT_REPO_HANDOFF_20260827_205337` | Desktop | directory | ARCHIVE_HANDOFF | HISTORICAL | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Desktop/VAV_CURRENT_REPO_HANDOFF_20260827_205537` | Desktop | directory | ARCHIVE_HANDOFF | HISTORICAL | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Desktop/VAV_CURRENT_REPO_HANDOFF_20260827_212113` | Desktop | directory | ARCHIVE_HANDOFF | HISTORICAL | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |
| `/Users/lordjef/Downloads/CODEX_HANDOFF_JOC55_V3_3.zip` | Downloads | file (.zip) | ARCHIVE_HANDOFF | HISTORICAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/VAV_CAPTIONS_PORTABLE_PRO_HANDOFF_V7` | Downloads | directory | ARCHIVE_HANDOFF | HISTORICAL | POSSIBLE | `COMPARE_BEFORE_MIGRATE` |

### Group J: INSTALLERS / TOOLS (7 items)

| PATH | LOCATION | TYPE | CLASSIFICATION | FUNCTIONAL STATUS | UNIQUE CODE | RECOMMENDATION |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/Users/lordjef/Downloads/Antigravity.dmg` | Downloads | file (.dmg) | INSTALLER_TOOLING | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/Astris-1.0.10+c349d3e44.dmg` | Downloads | file (.dmg) | INSTALLER_TOOLING | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/Astris-1.0.18+24bfd57a8.dmg` | Downloads | file (.dmg) | INSTALLER_TOOLING | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/Astris-1.0.22+d354de498.dmg` | Downloads | file (.dmg) | INSTALLER_TOOLING | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/DaVinci Resolve Studio v21.0 macOS Patches only.dmg` | Downloads | file (.dmg) | INSTALLER_TOOLING | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/DaVinci_Resolve_Studio_20.3.2_macOS_Torrentmac.net.zip.torrent` | Downloads | file (.torrent) | INSTALLER_TOOLING | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/cult_of_the_lamb_enUS_1_5_20_339_.dmg` | Downloads | file (.dmg) | INSTALLER_TOOLING | NON-FUNCTIONAL | NO | `KEEP_REFERENCE` |

### Group K: EXACT DUPLICATES (196 items)

| PATH | LOCATION | TYPE | CLASSIFICATION | FUNCTIONAL STATUS | UNIQUE CODE | RECOMMENDATION |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/Users/lordjef/Desktop/Copia de captionsxx2.txt` | Desktop | file (.txt) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/VAV_CURRENT_REPO_HANDOFF_20260827_205337.zip` | Desktop | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/VAV_CURRENT_REPO_HANDOFF_20260827_205537.zip` | Desktop | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/VAV_CURRENT_REPO_HANDOFF_20260827_212113.zip` | Desktop | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/VAV_HOTFIX_V7_1_APPLY_20260827_210222.txt` | Desktop | file (.txt) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/VAV_HOTFIX_V7_1_VERIFY_20260827_210254.txt` | Desktop | file (.txt) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/VAV_HOTFIX_V7_2_APPLY_20260827_210543.txt` | Desktop | file (.txt) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/VAV_HOTFIX_V7_2_VERIFY_20260827_210557.txt` | Desktop | file (.txt) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/VAV_LOCAL_RECOVERY_20260827_205405.zip` | Desktop | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/VAV_LOCAL_RECOVERY_20260827_212121.zip` | Desktop | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/VAV_VERIFY_CURRENT_20260827_205349.txt` | Desktop | file (.txt) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/VAV_VERIFY_CURRENT_20260827_205544.txt` | Desktop | file (.txt) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/captionsxx2.srt` | Desktop | file (.srt) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/vav-captioned-alpha.mp4` | Desktop | file (.mp4) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/vav-captioned-alphaXX.mp4` | Desktop | file (.mp4) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Desktop/vav-captioned-alphaxx2.mp4` | Desktop | file (.mp4) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `QUARANTINE_CANDIDATE` |
| `/Users/lordjef/Downloads/03_QVR_DEEP_CARDS_V3_1.json` | Downloads | file (.json) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/05_QUICK_VISUAL_REVIEW_BOARD_DEEP_V3_1.html` | Downloads | file (.html) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/09_VERIFICATION_REPORT.txt` | Downloads | file (.txt) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_COMPLETE_SYSTEM_v4.3.2_MOTIONS_v5.3_FINAL.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_COMPLETE_SYSTEM_v4.3.3_MOTIONS_v5.4_FINAL.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_COMPLETE_SYSTEM_v4.3.4_MOTIONS_v5.5.5_ORACLE_4K_PROVIDENCE_FINAL.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_COMPLETE_SYSTEM_v4.3.4_MOTIONS_v5.5.5_R4_FINAL.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_COMPLETE_SYSTEM_v4.3.4_MOTIONS_v5.5_FINAL.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_COMPLETE_SYSTEM_v4.3_MOTIONS_v5.2.1_FINAL.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_CONTENT_LAB_V3_CINEMATIC_2026.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_CONTENT_LAB_v2.2_MAINTAINABLE_PACKAGE.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_CONTENT_LAB_v2.3_SPEAKER_BALANCE.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_CONTENT_LAB_v2.4_SPEAKER_BALANCE_MIXED_INTROS.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_CONTENT_LAB_v2.5_MOTION_TREATMENT_V2_VOX_DOAC.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_CONTINUIDAD_CHAT_NUEVO_V4_2_5.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_CONTINUIDAD_CHAT_NUEVO_V4_2_5_ACTUALIZADA.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_CONTINUIDAD_CHAT_NUEVO_V4_2_6_ESTADO_43_DE_73.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_CONTINUIDAD_V4_2_NUEVO_CHAT.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_HTML_WORKFLOW_v4.3.4_FINAL (1).zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_HTML_WORKFLOW_v4.3.4_FINAL.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_INTRO_LAB_v2.0_AUTONOMO.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_INTRO_LAB_v2.1_REFERENCE_LIBRARY.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_MOTION_SYSTEM_V6_DOCUMENTATION.html` | Downloads | file (.html) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_MOTION_SYSTEM_V7_INTERACTIVE.html` | Downloads | file (.html) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_Moka_Bio_Strategic_Content_Repository_2026.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_PROMPT_PROFUNDIDAD_3D_CAMARA_MOTION_V3.txt` | Downloads | file (.txt) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_QVR_DEEP_REBUILD_V3_1.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_R4_TXT_LIBRARY_ORGANIZED.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_SPATIAL_MOTION_CAMERA_GRAMMAR_V3.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_1_FULL_MOTION_TXT_HOTFIX.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_1_MOTION_AUTOMATION.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_10_MASTER_REFRESH_SAFE_HOTFIX.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_11_ONE_COMMAND_COMPLETE_FINISH.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_12_MASTER_REFRESH_ONE_COMMAND.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_24_APPLE40M_RESUME_MASTER_PACKAGE.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_24_CONTINUITY_MASTER_PACKAGE(2).zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_24_CONTINUITY_MASTER_PACKAGE.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_24_MOTION_1080P_40M_HOTFIX.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_2_HOTFIX_37_VERTICALS.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_3_SIN_REVISION_MANUAL.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_4_DASHBOARDS_MOTION.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_5_HORIZONTAL_LONGFORM_HOTFIX.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_5_HTML_DRIVEN_AUTOMATION.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_6_RENDER_RESUME_SAFE_TERMINAL_HOTFIX.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_6_RENDER_RESUME_SAFE_TERMINAL_HOTFIX_V2.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_6_RESILIENT_QUEUE_HOTFIX (1).zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_6_RESILIENT_QUEUE_HOTFIX (2).zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_6_RESILIENT_QUEUE_HOTFIX.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_7_RESILIENT_WORKER_HOTFIX.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_8_MEDIA_STRUCTURE_HOTFIX.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_8_MONITOR_AND_MEDIA_HOTFIX.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_8_SAFE_FINISH_AND_ORGANIZE_HOTFIX.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_9_MEDIA_ORGANIZER_FAILED_REPAIR.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_HTML_DRIVEN_AUTOMATION (1).zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_HTML_DRIVEN_AUTOMATION.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_MOTIONS_BESIDE_VIDEOS_HOTFIX.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_3_REBALANCE_COMPACT_MOTIONS_HOTFIX.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_4_QUALITY_AUDIT_HOTFIX.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_CONTINUACION_SEGURA.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/Copia de dr-joc.txt` | Downloads | file (.txt) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/HTML_REFERENCES_ABRAXAS_v1.1.1_FUNCIONAL_IA.md` | Downloads | file (.md) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/HTML_REFERENCES_UNIVERSAL_v1.0.md` | Downloads | file (.md) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/JOC55_AMANDA_CONTENT_ENGINE_V4_2_24.html` | Downloads | file (.html) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V25_1_FLUID_CALL_OS_PACK.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V25_4_STORYFLOW_PODCAST_OS_PACK.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V25_6_BALANCED_WEEKLY_CALLS_OS_PACK.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V25_7_SESSION_DASHBOARD_OS_PACK.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V25_8_MASTER_OS_PACK.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V25_RECORDING_DIRECTOR_OS_PACK.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_17_CONTINUIDAD_FICHAS_E_INFO.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_17_TXT_MASTER_GRABACION_2026-08-26.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_19_CONTINUIDAD_FICHAS_E_INFO.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_19_TXT_MASTER_GRABACION_2026-08-26.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_1_PREPRODUCCION_LANZAMIENTO.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_20_CONTINUIDAD_FICHAS_E_INFO.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_20_GITHUB_PRIVATE_READY_2026-08-26.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_20_GITHUB_REPO_READY_R10_2026-08-27.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_20_GITHUB_REPO_READY_R11_2026-08-27.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_20_GITHUB_REPO_READY_R12_2026-08-27.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_20_GITHUB_REPO_READY_R13_2026-08-27.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_20_GITHUB_REPO_READY_R9_2026-08-27.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_20_HTML_ABRAXAS_V4_3_4_2026-08-26 (1).zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_20_HTML_ABRAXAS_V4_3_4_2026-08-26.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |
| `/Users/lordjef/Downloads/MOKA_V26_20_HTML_ABRAXAS_V4_3_4_R10_2026-08-27.zip` | Downloads | file (.zip) | EXACT_DUPLICATE | CURRENT VERIFIED | NO | `KEEP_REFERENCE` |

_... [96 additional items listed in CSV/JSON]_  

### Group L: PROBABLE DUPLICATES (0 items)

_No items in this category._

### Group M: UNRELATED TOP-LEVEL ITEMS (820 items)

| PATH | LOCATION | TYPE | CLASSIFICATION | FUNCTIONAL STATUS | UNIQUE CODE | RECOMMENDATION |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/Users/lordjef/Desktop/.DS_Store` | Desktop | file | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/.localized` | Desktop | file | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-12 a la(s) 10.50.13 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-12 a la(s) 10.51.09 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-12 a la(s) 7.29.03 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-14 a la(s) 7.38.10 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-16 a la(s) 3.17.01 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-18 a la(s) 8.18.58 a.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-19 a la(s) 1.21.54 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-19 a la(s) 5.03.39 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-19 a la(s) 5.03.42 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-19 a la(s) 5.03.46 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-19 a la(s) 5.04.11 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-19 a la(s) 5.04.17 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-19 a la(s) 5.04.24 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-20 a la(s) 11.39.03 a.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-21 a la(s) 11.01.28 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-21 a la(s) 2.53.42 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-21 a la(s) 2.53.53 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-21 a la(s) 5.48.29 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-21 a la(s) 5.48.43 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-22 a la(s) 12.26.33 a.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-22 a la(s) 2.22.42 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 3.55.29 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 3.55.33 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 3.55.39 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 3.55.45 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 3.57.32 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 3.57.36 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 3.57.46 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 3.57.48 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 3.57.50 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 3.57.53 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 4.10.01 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 4.10.04 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 4.10.07 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 4.10.18 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 4.10.21 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 4.10.25 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-23 a la(s) 4.23.46 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-27 a la(s) 3.47.35 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-28 a la(s) 2.44.32 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-28 a la(s) 2.45.16 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-28 a la(s) 2.45.38 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-05-28 a la(s) 8.08.33 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-03 a la(s) 11.25.27 a.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.26.00 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.26.06 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.26.18 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.26.20 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.26.26 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.26.40 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.26.42 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.26.43 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.26.45 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.27.12 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.27.16 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.27.20 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.27.25 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.27.28 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.27.32 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.27.41 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.27.47 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.28.02 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.28.14 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.28.20 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.28.43 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.28.55 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-05 a la(s) 3.29.06 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-11 a la(s) 2.39.36 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-11 a la(s) 2.39.48 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-17 a la(s) 9.21.33 a.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-17 a la(s) 9.28.34 a.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-18 a la(s) 7.55.47 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-18 a la(s) 7.56.06 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-18 a la(s) 7.56.23 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-18 a la(s) 7.58.39 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-18 a la(s) 8.29.23 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-18 a la(s) 9.16.25 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-19 a la(s) 10.18.36 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-19 a la(s) 2.04.38 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-20 a la(s) 11.15.55 a.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-20 a la(s) 11.16.35 a.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-21 a la(s) 3.48.15 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-21 a la(s) 5.28.27 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-22 a la(s) 3.56.08 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-23 a la(s) 10.03.53 a.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-23 a la(s) 10.04.16 a.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-23 a la(s) 10.04.24 a.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-23 a la(s) 10.04.30 a.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-23 a la(s) 10.04.54 a.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-23 a la(s) 10.05.23 a.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-24 a la(s) 5.05.45 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-24 a la(s) 5.05.47 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-24 a la(s) 5.05.48 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-24 a la(s) 5.05.50 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-24 a la(s) 5.05.51 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-24 a la(s) 5.06.04 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-24 a la(s) 5.06.06 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |
| `/Users/lordjef/Desktop/Captura de pantalla 2026-06-24 a la(s) 5.06.08 p.m..png` | Desktop | file (.png) | UNRELATED | NON-FUNCTIONAL | NO | `IGNORE_UNRELATED` |

_... [720 additional items listed in CSV/JSON]_  

### Group N: UNKNOWN / MANUAL REVIEW (32 items)

| PATH | LOCATION | TYPE | CLASSIFICATION | FUNCTIONAL STATUS | UNIQUE CODE | RECOMMENDATION |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/Users/lordjef/Desktop/ABRAXAS_CHATGPT_PRO_CONTEXT` | Desktop | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Desktop/ABRAXAS_CONTENT_LAB_v2.5_MOTION_TREATMENT_V2_VOX_DOAC` | Desktop | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Desktop/ABRAXAS_GIT_SAFETY` | Desktop | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Desktop/ABRAXAS_MODULAR_AUDITS` | Desktop | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Desktop/MokaBio` | Desktop | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Desktop/VAV_STORAGE_AUDIT` | Desktop | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Desktop/mahgia-pet` | Desktop | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Desktop/sistema motions` | Desktop | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/ABRAXAS_COMPLETE_SYSTEM_v4.3_MOTIONS_v5.2.1_FINAL` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/ABRAXAS_CONTENT_LAB_v2.2_MAINTAINABLE_PACKAGE` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/ABRAXAS_HTML_WORKFLOW_v4.3.4_FINAL (1)` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_18_MOTION_POLICY_ENGINE` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_23_SMART_MOTION_RENDER_BUILDER` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_25_SMART_CUT_BUILDER` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/ABRAXAS_V4_2_26_HTML_MOTION_UPDATE` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/Contenido para continuar abraxas` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/Elementos graficos Joc png` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/Estructura de fotos moka` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/JOC55_V3_TODO_ACTUALIZADO` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/MOKA_V25_RECORDING_DIRECTOR_OS_PACK (1)` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/MOKA_V26_17_TXT_MASTER_GRABACION_2026-08-26` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/MOKA_V26_19_TXT_MASTER_GRABACION_2026-08-26` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/MOKA_V26_20_HTML_STANDALONE_R10_2026-08-27` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/MOKA_V26_20_HTML_STANDALONE_R11_2026-08-27` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/MOKA_V26_20_HTML_STANDALONE_R12_2026-08-27` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/MOKA_V26_20_HTML_STANDALONE_R13_2026-08-27` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/MOKA_V26_20_HTML_STANDALONE_R9_2026-08-27` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/Rostro Joc` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/UNIVERSAL_CONTENT_OS_V22_1_WITH_CLIENT_INTAKE` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/UNIVERSAL_CONTENT_OS_V25_REPLICATION_PACK (1)` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/llamada moka 2` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |
| `/Users/lordjef/Downloads/referncias joc` | Downloads | directory | UNKNOWN_REVIEW | UNKNOWN | POSSIBLE | `MANUAL_REVIEW` |


============================================================
FINAL SAFETY ASSERTION
============================================================
FILES MOVED: 0
FILES DELETED: 0
FILES RENAMED: 0
ARCHIVES EXTRACTED: 0
DEPENDENCIES INSTALLED: 0
COMMITS CREATED: 0
PUSHES PERFORMED: 0
