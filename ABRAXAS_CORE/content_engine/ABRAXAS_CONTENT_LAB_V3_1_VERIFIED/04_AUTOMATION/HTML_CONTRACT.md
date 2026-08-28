# HTML CONTRACT V3.1

## Two document types

### `INTRO_LAB_V3_1`
Allowed production family:
- intros only.

### `CONTENT_ENGINE_V3_1`
Allowed:
- verticals
- horizontals
- principal_carousels
- highlight_carousels
- phrases
- claims
- potentials
- transcript

Automation must reject cross-engine rendering.

## Embedded data

Every review HTML contains:

```html
<script id="editorialData" type="application/json">...</script>
```

This is the portable compiled editorial contract.

Browser UI state is NOT source truth.

## Selection

UI may store state in localStorage, but approval must be exported through:
`Exportar selección`.

Portable JSON contains:
- document_type;
- episode;
- content states;
- exported_at.

## Heavy data / timeout protection

V3.1 uses lazy hydration:
- summary cards render first;
- beats/prompts render only when card opens;
- transcript renders only when transcript panel opens.

The entire editorialData remains embedded for automation, but the DOM does not expand millions of characters at startup.

## Automation sequence

HTML
→ inspect document_type
→ export/parse editorialData
→ merge explicit current selection
→ verify source fingerprints
→ resolve MICROTRIM
→ build PART/cache plan
→ render/handoff

## Backward compatibility

A legacy review HTML can be inspected but does NOT become V3.1 by filename.

Bridge output marks legacy as `requires_migration=true`.

Do not delete legacy files.
