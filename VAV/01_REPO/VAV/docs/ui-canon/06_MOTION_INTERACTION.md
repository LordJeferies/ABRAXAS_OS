# UI Motion & Interaction

UI motion y caption/video motion son sistemas distintos.

UI:
Motion for React puede usarse para springs e interacciones interrumpibles.

Video:
Remotion sigue siendo el contrato determinista.

Tiempos:
fast 120–180ms
panel/state 180–280ms
major layout 240–360ms

Springs:
- active rail indicator
- inspector expand/collapse
- popover
- drag/drop settle
- snap settle

Evitar:
- rebote en todo;
- fades lentos;
- page transitions cinematográficas en un editor.

Respetar prefers-reduced-motion.
