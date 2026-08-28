# Component System

## Toolbar
48–56 px.
Máximo 3 grupos lógicos.
Leading: sidebar/proyecto.
Center: acciones frecuentes.
Trailing: settings/export.
Export es la acción más fuerte.

## Rail
64–76 px icon-forward.
Expandible a 160–200 px con labels.
Solo destinos top-level.

## Preview
Plano dominante, neutral.
Handles/overlays solo sobre el media.
Safe zones/face boxes/scene debug son overlays opcionales.

## Inspector
320–380 px.
Solo controles relevantes a la selección.
Grupos plegables.
Progressive disclosure.

## Transport
Compacto.
Play/Pause es la acción más fuerte.

## Timeline
Caption-centric, no NLE general.
Lanes:
Scene
Media
Waveform
Captions
Emphasis
Motion

## Buttons
Primary: fill accent.
Secondary: surface + border.
Ghost: transparent + hover surface.
Icon button desktop: 32–36 px mínimo.
Primary frequent: 36–40.
Pointer coarse/touch: >=44.

## Popovers
Elevated material.
Destructive actions aisladas y semánticas.

## Caption Document Panel / Subtitle Reading Panel
Componente obligatorio.

Objetivo:
permitir leer y editar los captions completos como documento sincronizado, sin
perder el contexto del preview ni del timeline.

Requisitos:
- scroll propio;
- bloques de caption/utterance completos;
- línea o bloque activo claramente resaltado;
- click en una línea = seek al tiempo;
- selección sincronizada con timeline e inspector;
- mostrar timestamps de bloque o phrase cuando sea útil;
- permitir futuro modo read-only / correction / segmentation.

Desktop default:
en ventanas amplias, debe convivir con timeline dentro del workbench.
No esconderlo detrás de demasiados pasos.

## Workspace Layout Manager
Componente/sistema obligatorio.

Capacidades mínimas:
- split horizontal/vertical;
- resize by drag;
- tabbed panels cuando aplique;
- restore default layout;
- save current layout;
- detachable window para paneles seleccionados;
- serialized layout state por usuario/proyecto.

Regla:
una ventana desprendida sigue siendo parte del mismo proyecto y del mismo state.
