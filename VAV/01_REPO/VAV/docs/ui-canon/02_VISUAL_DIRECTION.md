# VAV Visual Direction

## Identidad
"Instrumento audiovisual profesional, calmado para editar durante horas."

No debe parecer:
- dashboard gamer;
- HUD cyberpunk;
- landing SaaS;
- clon de CapCut;
- clon de DaVinci;
- navegador encapsulado.

## Composición
1. ventana desktop real;
2. top command toolbar fina;
3. rail lateral compacto/colapsable;
4. preview central dominante;
5. inspector contextual derecho;
6. timeline/transcript inferior;
7. scroll contextual por plano, no body scroll kilométrico.

## Materiales
Base near-black.
Paneles charcoal mate.
Elevated surfaces algo más claras.
Glass solo en toolbar/popovers/controles flotantes.
Textura: grano/gradiente casi imperceptible.

## Color
Acento VAV: violeta eléctrico.

Semánticos:
cyan = analysis/media
green = success/audio
amber = warning
red = destructive/error
purple = captions
coral = motion

## Jerarquía
1. video;
2. caption seleccionado;
3. inspector/herramienta actual;
4. navegación.

## Profundidad
luminancia de superficie + borde + blur + occlusión.
No usar box-shadow pesado como lenguaje principal.

## Workbench textual obligatorio
Además del timeline, VAV debe mostrar un espacio de lectura continua de los
captions completos. El usuario no debe depender solo de cajas pequeñas sobre el
timeline para leer o corregir el contenido.

La `bottom workbench area` tendrá como mínimo:
- timeline;
- caption document panel sincronizado;
- posibilidad futura de vista split / focus.

## Dockable desktop workbench
La UI de VAV debe comportarse como una workstation modular de escritorio.

Objetivo:
- rearrange panels;
- resize panels;
- move work areas between columns/rows;
- detach selected surfaces into floating windows while preserving the same
  project/session.

Paneles candidatos a docking/detach:
- Preview
- Inspector
- Timeline
- Caption Document View
- Scene Smart map
- Transcript/diagnostics side tools
