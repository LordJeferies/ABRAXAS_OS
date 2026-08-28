# ABRAXAS Interface System 2.0 · Architect Edition

Apple-first design system. No intenta copiar assets propietarios; replica principios de jerarquía, spacing, progressive disclosure, materiales funcionales, controles desktop y motion contextual.

## Capas
1. Environment: fondo/ambient light.
2. Content: editores, listas, calendario, cards y narrativa. Sin glass.
3. Function: sidebar, toolbar, menus, command palette y controles. Glass selectivo.
4. Focus: sheets, El Arquitecto y overlays contextuales.

## Reglas
- No glass-on-glass.
- Una acción primaria dominante por workspace.
- Máximo aproximado de cuatro niveles visibles de jerarquía.
- Geometría/radios concéntricos.
- Accent de cliente para identidad/foco, no para estados semánticos.
- `prefers-reduced-motion` obligatorio.
- Motion source-anchored y funcional; no decorativo.
- Controles compactos en escritorio; capsules solo cuando su función lo justifica.
