# Shim Automation Handoff v1.1.2

## Salida obligatoria

La IA externa debe devolver como mínimo:

- `editable_html`
- `master_json`
- `terminalPackage`
- `davinciPackage`
- `copies`
- `visualPrompts`
- `blockers`
- `warnings`

## terminalPackage

Pensado para un pipeline tipo FFmpeg.

Campos base:

- `schema_version`
- `pipeline`
- `source`
- `timelines[]`
- `outputPlan`
- `scriptsSuggested[]`
- `verificationChecklist[]`

## davinciPackage

Pensado para DaVinci Resolve.

Campos base:

- `schema_version`
- `pipeline`
- `importMode`
- `timelines[]`
- `projectSetup`
- `subtitleStrategy`
- `textPlusFallback`
- `consoleScripts`
- `logsAndState`

## Regla editorial

Ambos paquetes deben representar la misma selección editorial. Terminal y DaVinci pueden diferir en implementación, pero no en la lógica del contenido.
