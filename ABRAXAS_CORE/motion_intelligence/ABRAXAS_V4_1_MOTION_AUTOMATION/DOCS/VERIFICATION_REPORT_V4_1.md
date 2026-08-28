# ABRAXAS V4.1 · Verification Report

Fecha de verificación: 2026-08-20.

## Resultado

PASS para compilación, planificación, prompts, contrato de fragmentos, dry-run de render y verificación estructural de Motions.

## Dataset JOC55 compilado

- 29 verticales.
- 12 horizontales.
- 6 intros.
- 6 carruseles principales.
- 6 carruseles highlight.
- 15 frases.
- 8 claims.

## Plan Motion V4.1

- 1,341 placements.
- 486 Motions accionables.
- 855 decisiones `M0 KEEP_SOURCE`.
- mínimo: 7.333 s.
- máximo: 8.909 s.
- promedio: 7.970 s.
- bloqueos por duración: 0.

## Fragmentos físicos previstos por Terminal

El dry-run de ambos workers escribió 48 manifests de video y 1,197 fragmentos:

- mínimo: 7.555 s.
- máximo: 8.375 s.
- promedio: 7.969 s.
- menores de 4 s: 0.
- mayores de 9 s: 0.

La diferencia entre 1,341 placements y 1,197 fragmentos renderizables se debe a intros todavía bloqueadas por microtrims y al H03 de 721 s todavía pendiente del override humano previsto por el runbook.

## Tests

32 tests unitarios: PASS.

Cobertura relevante:

- lectura de ambos HTML y conteos;
- fingerprints y hashes;
- scopes y consenso de microtrims;
- bloqueo H03;
- render/caches/atomic partials;
- distribución de workers;
- generación de assets y colas;
- partición balanceada sin cola corta;
- Motion 2 con reconstrucción literal;
- prompts y árbol de Motion;
- configuración V4.1;
- handoff base de DaVinci;
- compilación Python del conformer V4.1.

## Gates esperados antes del render real

- Los masters oficiales deben existir en las rutas de `00_MASTERS_OFICIALES` en la Mac del usuario.
- Los microtrims pendientes deben resolverse o aprobarse manualmente.
- H03 requiere elegir editorialmente el segundo que se elimina.
- Los 486 Motions accionables se marcan `MISSING_ASSETS` hasta que el usuario coloque las imágenes o videos generados. Es warning en QA estructural y blocker en `12B_VERIFY_MOTIONS_STRICT.command`.
- La ejecución real del API de DaVinci debe hacerse dentro de Resolve Studio; fuera de Resolve solo se valida sintaxis y manifest.
