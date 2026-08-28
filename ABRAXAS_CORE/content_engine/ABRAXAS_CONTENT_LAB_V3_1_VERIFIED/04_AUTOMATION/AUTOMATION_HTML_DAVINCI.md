# AUTOMATION + DAVINCI V3

## 1. Objetivo

Producir V3 sin:
- borrar legacy;
- re-trabajar assets válidos;
- ejecutar procesos monolíticos;
- provocar timeouts evitables;
- hacer que DaVinci re-decida editorial.

## 2. Nueva raíz de output

Ejemplo:

`PROJECT_OUTPUT_V3/`

Legacy:
`PROJECT_OUTPUT/`

V3 nunca hace `rm -rf PROJECT_OUTPUT`.

## 3. Checkpoints

Cada fase es independiente y reanudable:

### 00 · VALIDATE_INPUTS
- HTML.
- transcript.
- masters.
- client pack.
- ffmpeg.
- VideoToolbox.
- free space.

### 01 · COMPILE_HTML
Ejecutar `08_HTML_BRIDGE_V3.py`.
Salida:
`00_MANIFEST/V3_COMPILED_MANIFEST.json`.

### 02 · SOURCE_FINGERPRINT
Por master:
- canonical path;
- size;
- mtime;
- sha256 o strong partial hash policy;
- ffprobe metadata;
- burned subtitle policy.

### 03 · MIGRATION_REPORT
Guardar:
- legacy content.
- content reusable.
- content needing V3 visual replan.
- intros requiring rebuild.
- highlight carousels missing.

### 04 · RESOLVE_MICROTRIMS
Solo filas MICROTRIM.
MLX dual-pass + human fallback.
No re-transcribir todo si exact timestamps ya existen.

### 05 · BUILD_BEATS
Procesar un content_id por invocación.
Emitir beats <=9s + source traceability.

### 06 · BUILD_VISUAL_TREATMENTS
Procesar un content_id por invocación.
Emitir:
- LOGIC.
- START/MIDDLE/END.
- prompts with/no text.
- animation prompts.

### 07 · BUILD_PART_PLAN
Crear canonical PART keys.

### 08 · ENCODE_MISSING_PARTS
VideoToolbox H.264 40M.
Un PART por job.

### 09 · ASSEMBLE_STREAM_COPY
`ffmpeg concat + -c copy`.

### 10 · DAVINCI_HANDOFF
Crear timelines/markers/manifests.

### 11 · VERIFY
Validar streams, duration, no gaps, fingerprints, subtitle policy.

## 4. Estado

Cada job escribe:

```json
{
  "content_id": "INTRO_G01",
  "stage": "BUILD_VISUAL_TREATMENTS",
  "status": "PASS",
  "started_at": "...",
  "finished_at": "...",
  "input_fingerprint": "...",
  "output_fingerprint": "...",
  "artifacts": []
}
```

Estados:
- PENDING
- RUNNING
- PASS
- FAIL
- BLOCKED
- STALE

Un proceso muerto no invalida etapas PASS.

## 5. Política anti-timeout

No ejecutar:
`todo_el_episodio.py`

que haga:
parse → ASR → 100 renders → DaVinci → QA.

Preferir:
- un content_id;
- una etapa;
- un checkpoint;
- retorno al shell.

Los wrappers pueden iterar jobs, pero cada job:
- escribe estado;
- usa output atómico;
- puede reiniciarse;
- no depende de memoria de proceso anterior.

## 6. Retrys

Retry automático solo para:
- file lock temporal;
- output file transient access;
- subprocess transient failure con input idéntico y límite bajo.

No retry editorial:
- microtrim sin consenso;
- source missing;
- claim conflict;
- speaker ambiguity;
- malformed manifest.

Esos quedan BLOCKED.

## 7. Video profile

`APPLE_VT_H264_40M_V1`

Video:
- `h264_videotoolbox`
- High profile cuando build lo soporta.
- 40M target.
- 48M maxrate target.
- 80M buf target.
- yuv420p.
- MP4 faststart.

Audio:
- AAC 192k.
- 48 kHz.
- stereo.

## 8. PART cache

Cache key contiene:
- source fingerprint;
- ordered exact source segments;
- V/H orientation;
- CLEAN/FULL;
- crop/reframe;
- render profile;
- fps/resolution;
- audio profile;
- output version V3.

Un source change invalida solo dependencias del source.

## 9. M1 Pro worker policy

Default:
- 2 logical workers.
- 1 hardware encode slot.

Ambos pueden en paralelo:
- parse;
- plan;
- hash;
- create prompts;
- stream-copy assemble;
- verify.

Solo un job toma hardware encode lock por defecto.

### Six intro distribution

Con 6 intros, usar round-robin estable:

Worker A:
- INTRO_G01
- INTRO_G03
- INTRO_M02
- longs
- potentials

Worker B:
- INTRO_G02
- INTRO_M01
- INTRO_M03
- verticals

Esto es routing de trabajo, no criterio editorial.

## 10. Intro outputs

Cada intro conserva:

VERTICAL/
- CLEAN/
  - NO_VO
  - SOURCE_REPLACEMENT
  - PARTS
- FULL/
  - NO_VO
  - SOURCE_REPLACEMENT
  - PARTS

HORIZONTAL/
- CLEAN/
  - NO_VO
  - SOURCE_REPLACEMENT
  - PARTS
- FULL/
  - NO_VO
  - SOURCE_REPLACEMENT
  - PARTS

Además:
- VO_A.txt
- VO_B.txt
- VO_C.txt
- READTHROUGH files
- VISUAL_MOTION_PACK/
- DAVINCI manifests.

## 11. VFX/B-roll folder

Per beat:

```
BEAT_B03/
├── LOGIC.txt
├── START_NO_TEXT.txt
├── START_WITH_TEXT.txt
├── MIDDLE_NO_TEXT.txt
├── MIDDLE_WITH_TEXT.txt
├── END_NO_TEXT.txt
├── END_WITH_TEXT.txt
├── ANIMATION_NO_TEXT.txt
├── ANIMATION_WITH_TEXT.txt
├── START.png              # when generated
├── MIDDLE.png
├── END.png
├── treatment.json
└── qa.json
```

## 12. Flow / Omni handoff

Recommended process:

1. Upload client/style/character reference images.
2. Generate/select START.
3. Generate/select MIDDLE with same identities/materials/scene.
4. Generate/select END.
5. Use reference images as Flow/Omni/Veo ingredients/frames.
6. Animate exactly the <=9s beat.
7. Do not ask the model to invent captions.
8. Export clean motion plate.
9. Composite with source/subtitles in DaVinci.

For a presenter interaction:
- source presenter shot is the anchor;
- generated element is a layer/plate when possible;
- match eyeline/occlusion/perspective;
- keep original subtitles as top caption layer.

## 13. DaVinci handoff

DaVinci receives editorial decisions, not raw transcript analysis.

For each timeline:
- append source/PARTS back-to-back;
- no black gaps;
- markers by beat:
  - HOOK
  - SOURCE
  - VO_SLOT
  - BROLL
  - VFX
  - SFX
  - CLAIM
  - CLOSE
  - REVIEW
- import generated B-roll to dedicated bin/track;
- keep original/source subtitle layer protected.

Recommended track logic:

V5 · exact subtitle/emphasis final layer  
V4 · intentional type/word emphasis  
V3 · generated VFX/graphic overlay  
V2 · generated/real B-roll  
V1 · source podcast  
A1 · dialogue  
A2 · music  
A3 · SFX

## 14. Subtitle preservation

If subtitle is burned into source:
- do not generate replacement full-frame presenter unless subtitle layer can be restored exactly.
- prefer masked/side/background interaction.
- for full-frame B-roll, subtitle can temporarily disappear only if editorially intended and source captions are not expected there.

If separate subtitle file exists:
- render it above VFX/B-roll.
- literal audit required.

## 15. Black-gap prevention

For every joined timeline:
- source seek per fragment;
- use actual media bounds;
- clamp microtrims;
- append sequentially;
- verify gap list = [].

## 16. Verification output

Per content:
- duration;
- orientation;
- source fingerprint;
- legacy/new version;
- beat max duration;
- selected visual treatments;
- rendered PART count;
- stream-copy assemblies;
- subtitle integrity status;
- DaVinci handoff status;
- blockers.


# V3.1 HTML separation

- Intro Lab HTML and Content Engine HTML have separate document_type and localStorage keys.
- Automation must refuse an INTRO_LAB document when asked to render Content Engine assets, and vice versa.
- Exported selection JSON is the portable approval state. Browser localStorage is UI convenience only.
- H03 in the JOC55 example is 12:01 and remains TRIM_REQUIRED_1S until an exact trim is chosen against source; do not auto-shave one second.
