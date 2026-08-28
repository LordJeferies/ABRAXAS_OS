# Migración v1.1.2 → v1.1.3

## Se migra sin reinterpretar
- `content_id` y Contents.
- Campaign/Format/Pillar.
- Production Tasks.
- Assets/expectedAssets.
- Source Truth.
- History y QA.
- Prompts/Prompt Inputs.
- Client Intelligence.
- Shim/Automation contracts.

## Se reemplaza
- `src/app.js` anterior.
- shell/sidebar/topbar anterior.
- renderers anteriores.
- CSS anterior.
- Dashboard anterior.
- Product Story anterior.
- Content Studio anterior.
- Production Queue anterior.
- Brain renderer anterior.
- Architect UI anterior.

## Compatibilidad de estado
`src/v113/store.js` puede leer estado propio v1.1.3 y migrar preferencias desde claves v1.1.2/v1.0/v0.9.6.1. Los datos de dominio siguen viniendo de `ABRAXAS_DATA`; la migración de UI no genera Contents nuevos.
