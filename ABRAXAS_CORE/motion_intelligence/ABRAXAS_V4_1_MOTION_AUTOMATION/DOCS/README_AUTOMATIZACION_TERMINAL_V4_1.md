# ABRAXAS V4.1 · Automatización de cortes, Motions y DaVinci

## Resultado

El sistema usa como fuentes oficiales:

- `~/Desktop/Joc podcast next ep 55/00_MASTERS_OFICIALES/JOC55_MASTER_VERTICAL_OFICIAL.mp4`
- `~/Desktop/Joc podcast next ep 55/00_MASTERS_OFICIALES/JOC55_MASTER_HORIZONTAL_OFICIAL.mp4`

Los HTML incluidos aportan transcripción, contenidos, beats, tratamientos y timecodes. El Terminal produce videos fuente, fragmentos físicos balanceados, prompts de imágenes por Motion, previews y un conform para DaVinci.

## Contrato obligatorio de fragmentos

- mínimo: **4.000 s**;
- máximo: **9.000 s**;
- objetivo: **8.000 s de promedio**;
- promedio aceptado por QA: **7.000–9.000 s**;
- nunca se crea una cola final de 1–3 s: el resto se redistribuye entre todos los fragmentos;
- el Motion reemplaza o complementa la imagen durante el mismo intervalo; el audio fuente continúa y no se alarga el video.

En la compilación verificada de JOC55 el plan produjo 1,341 placements (486 Motions accionables), con mínimo 7.333 s, máximo 8.909 s y promedio 7.970 s.

## Orden exacto

1. `00_INSTALL_DEPENDENCIES.command`
2. `01_SETUP_JOC55.command`
3. `02_VALIDATE_INPUTS.command`
4. `03_COMPILE_HTML.command`
5. `04_FINGERPRINT_SOURCES.command`
6. `05_BUILD_ASSETS_AND_VISUAL_QUEUE.command`
7. `06_LIST_INTRO_MICROTRIMS.command`
8. `06B_RESOLVE_ALL_INTRO_MICROTRIMS.command`
9. `06E_RESOLVE_ALL_RELEVANT_CONTENT_MICROTRIMS.command`
10. `07_PREVIEW_H03_LAST_SECONDS.command` y `07A_SET_H03_OVERRIDE.command`
11. `08_BUILD_PART_PLAN.command`
12. `08B_BUILD_MOTIONS_AND_PROMPTS.command`
13. `08A_DRY_RUN_WORKERS.command`
14. Abrir dos Terminales: `09_WORKER_A_RENDER.command` y `10_WORKER_B_RENDER.command`
15. Generar las imágenes con los prompts y guardarlas con el filename exacto dentro de cada `ASSETS_GENERADOS`.
16. `10B_BUILD_MOTION_PREVIEWS.command`
17. `11_BUILD_DAVINCI_HANDOFF.command`
18. Abrir DaVinci Resolve Studio, abrir/crear proyecto, ir a `Workspace > Console > Py3` y pegar el contenido de `10_DAVINCI_HANDOFF/WORKSPACE_CONSOLE_COMMAND.txt`.
19. `12_VERIFY.command`
20. `12B_VERIFY_MOTIONS_STRICT.command`
21. `13_STATUS.command`

Todos los comandos son reanudables. Los MP4 ya verificados se reutilizan mediante cache.

## Dónde están los prompts

Dentro del output:

```text
09_MOTIONS_V4_1/
  03_VERTICALS|04_HORIZONTALS|02_INTROS/
    CONTENT_ID/
      VERTICAL|HORIZONTAL/
        00_PROMPT_GENERAR_TODAS_LAS_IMAGENES_DEL_VIDEO.txt
        00_MOTION_INDEX.json
        00_ASSET_CHECKLIST.csv
        CONTENT_VARIANT_FRAG_001__MOTION/
          MOTION_BRIEF.json
          PROMPT_GENERAR_ESTE_MOTION_COMPLETO.txt
          PROMPT_ANIMAR_MOTION.txt
          PROMPTS_IMAGEN/
          ASSETS_GENERADOS/
```

El prompt maestro del video enumera todos sus assets. Cada Motion también conserva sus prompts individuales, texto exacto, duración, track, modo de placement y ruta de destino.

## Cómo colocar lo generado

1. Copiar el prompt de una imagen o el prompt maestro del video a ChatGPT.
2. Descargar cada imagen con el filename solicitado.
3. Guardarla en la carpeta `ASSETS_GENERADOS` de ese Motion.
4. Ejecutar `10B_BUILD_MOTION_PREVIEWS.command`.
5. Si se genera un video animado externo, guardarlo como `MOTION_FINAL.mp4` o `MOTION_FINAL.mov`; tiene prioridad sobre el preview de stills.

## DaVinci

El conformer crea timelines con sufijo `_ABRAXAS_V4_1` y protege las ya existentes. Usa:

- V1: source;
- V2: Motion 1/5 o B-roll;
- V3: Motion 2/4/6;
- V4: Motion 3;
- V5: reservada para subtítulos.

Si encuentra `MOTION_FINAL` o `MOTION_PREVIEW`, lo añade en el frame y track previstos. Si el asset falta, deja un marker con beat, Motion, transcripción, tiempos, prompt y carpeta. No elimina ni sobrescribe timelines existentes.

## Cambiar un Motion manualmente

En `PROJECT/project_config.json`, usar `motion.selection_overrides`:

```json
{
  "V01_SOURCE_FRAG_003": {
    "motion": "M3",
    "why_motion": "Override editorial aprobado"
  }
}
```

Después volver a ejecutar `08B_BUILD_MOTIONS_AND_PROMPTS.command`, `10B_BUILD_MOTION_PREVIEWS.command` y `11_BUILD_DAVINCI_HANDOFF.command`.

## Gates

- Un microtrim sin consenso queda bloqueado; no se inventa el timecode.
- H03 necesita el override humano de 721 s a máximo 720 s.
- `motion-verify` comprueba estructura y duración aunque aún falten imágenes.
- `12B_VERIFY_MOTIONS_STRICT.command` solo pasa cuando cada Motion accionable tiene video final o preview listo para DaVinci.
