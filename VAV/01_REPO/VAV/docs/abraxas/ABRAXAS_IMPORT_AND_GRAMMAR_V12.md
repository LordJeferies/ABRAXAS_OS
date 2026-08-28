# ABRAXAS Import + Grammar Foundation V12

## Goal

VAV Captions can ingest structured outputs produced by the ABRAXAS analysis workflow without treating arbitrary analysis files as executable code.

## Trust boundary

Default flow:

`TXT/JSON/HTML -> classify -> Candidate -> Preview -> Approve -> Registry`

Trusted user-reviewed style or motion cards may be imported directly as approved. HTML, QVR datasets, shot/depth/spatial cards, user profiles and corpus datasets remain reference/evidence data unless a specific typed executable schema explicitly maps them into a supported VAV preset.

VAV does **not** execute imported `.ts`, `.js` or script content as plugins.

## Executable cards

Current executable families:
- `VAV_STYLE_CARD_V1`
- motion card/family structures recognized by `@vav/abraxas-import`

Canonical aliases preserve the four existing VAV style identities:
- `vav.hybrid_inspirational` -> `hybrid-inspirational`
- `vav.hollow_glow` -> `hollow-glow`
- `vav.impact_motion` -> `impact-motion`
- `vav.clean_bold` -> `clean-bold`

## Reference-only evidence

Recognized but not executed directly:
- V2 scene decomposition
- QVR / Quick Visual Reference cards
- V3 X/Y/Z spatial transform cards
- motion path cards
- shot/camera cards
- layer/depth stacks
- surface tracking cards
- user visual profile
- primitive taxonomies
- corpus/pattern datasets

These are provenance for later resolvers and VAV Motions primitives.

## Word hierarchy

`@vav/caption-hierarchy` introduces semantic word grouping rather than using a fixed positional HERO rule. It handles connectors, negation attachment, numbers/proof roles and multi-word hero spans while preserving every spoken token.

This is foundation, not a claim that semantic language understanding is finished. Future NaturalLanguage/AI-assisted scoring can improve the same typed contract without replacing it.

## Preset lifecycle

Every imported executable preset should retain:
- source path/name
- SHA-256
- imported timestamp
- kind
- candidate/approved state
- source id / canonical id

Approved registry lives under the VAV application-support data directory. Manual user overrides remain higher priority than automatic preset defaults until reset.
