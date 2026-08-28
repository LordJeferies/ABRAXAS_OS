# ABRAXAS v1.1.2 · Shim Confirmed Automation

## Principle

**Shim does not automate candidates. It automates confirmed editorial decisions.** The external AI first returns an editable review HTML modeled on the proven Moka clip-review anatomy: chronological candidates, Hook/Development/Final, literal source fragments/timestamps, score/priority, claims, potential blocks, filters and source traceability. ABRAXAS v1.1.2 extends that station with carousels, per-unit production layers and human selection states.

## Flow

`Transcript → Shim Master Prompt → editable review HTML → human review → CONFIRMADO → SHIM_CONFIRMED_MANIFEST.json → Terminal/FFmpeg OR DaVinci Resolve`

Selection states are `CANDIDATO`, `REVISADO`, `CONFIRMADO`, `DESCARTADO`, `NEEDS_FIX`. Only `CONFIRMADO` is exported to automation.

## One source of truth

`SHIM_CONFIRMED_MANIFEST.json` is the only editorial source for both execution engines. Terminal and Resolve may implement the plan differently, but they cannot change clip selection, order, source ranges or speaker attribution. `sourceReadOnly` must be `true`.

## Terminal / FFmpeg

The terminal bridge supports:

- selection: one confirmed video, multiple IDs, all confirmed, current saved selection;
- output: separate segments, joined final, both, instructions only, full package;
- precision: precise/transcoded or fast/keyframe-dependent stream copy.

`ABRAXAS_SHIM.command` is a launcher. `verify_environment.py` checks FFmpeg/FFprobe/manifest/source. `abraxas_shim_export.py` reads the manifest, creates derivatives, cutlists and package folders. It does not overwrite the source.

## DaVinci Resolve

`ABRAXAS_IMPORT_TO_RESOLVE.py` runs inside Resolve's scripting environment. It imports the same source/derivative media, creates one editable timeline per confirmed video, assembles the confirmed ranges and adds markers for `HOOK`, `DEVELOPMENT`, `PAYOFF`, `B-ROLL`, `VFX`, `SFX`, `CLAIM`, `REVIEW`.

The automation prepares a timeline; it does not replace editorial/video QA. Subtitle generation, Text+ styling, effects and mix remain editable and must be reviewed.

## Carrusels

Carrusels never enter FFmpeg. Confirmed carousels export through `CAROUSEL_PRODUCTION_PACKAGE.json` to Content Studio → visual prompts → image/design tools → Assets → QA → Calendar.

Every confirmed carousel carries sourceThemeIds, formatId, thesis, slides, copies, visual system, prompt with text, prompt without text, asset slots, QA and blockers.

## Video production layers

Each confirmed video/beat preserves:

- Recording / source
- B-roll
- VFX / Omni
- SFX
- Music
- Cover
- Copies
- START / MIDDLE / END references
- prompt with text / without text when applicable

These are production layers around the same source ranges, not permissions to rewrite the source.

## Expected export tree

```text
ABRAXAS_SHIM_EXPORT/
├── MASTER_MANIFEST.json
├── SHIM_CONFIRMED_MANIFEST.json
├── CONFIRMED_SELECTION.json
├── README.md
├── terminal/
├── davinci/
└── clips/<candidateId>/
    ├── manifest.json
    ├── cutlist.json
    ├── cutlist.csv
    ├── transcript.txt
    ├── subtitles.srt
    ├── fragments/
    ├── joined/
    ├── copies/
    ├── covers/
    ├── visual/{visual_plan.json,broll.json,vfx.json,sfx.json,music.json}
    ├── prompts/{omni/,images/,covers/}
    └── references/
```

## Human QA after automation

Verify every cut against source audio/waveform, source speaker, subtitles, claims, aspect ratio, audio continuity, B-roll/VFX evidence labels, cover/copy and final publishing state. Automation reduces repetition; it does not waive editorial approval.
