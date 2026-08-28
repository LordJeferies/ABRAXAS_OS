# Visual QA Gate

No PASS sin revisar:

Layout:
- una vista principal;
- preview dominante;
- inspector no roba demasiado ancho;
- no body vertical dump;
- no overflow accidental;
- timeline legible.

Typography:
- no clipping;
- metadata legible;
- no dependencia de fuentes Apple empaquetadas.

Components:
- active/inactive/disabled claros;
- icon-only con tooltip/aria-label;
- pointer coarse >=44;
- focus visible;
- destructive semantic.

Material:
- glass con propósito;
- no blur excesivo;
- paneles legibles sobre video.

Motion:
- interruptible;
- reduced-motion usable;
- no motion decorativo excesivo.

Cross-platform:
- MLX visible disabled fuera de Apple Silicon;
- system font funciona;
- icon language consistente.

Editor / reading workflow
- existe un espacio claro para leer captions completos;
- la línea activa del documento textual se sincroniza con la reproducción;
- el usuario puede saltar desde documento a preview/timeline;
- el panel textual no queda reducido a una nota decorativa.

Dockable workspace
- los paneles se perciben modulares;
- queda claro qué puede redimensionarse;
- los paneles candidatos pueden desacoplarse sin romper la app;
- existe restore layout;
- existe persistencia de layout.
