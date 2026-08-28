# Shim

Shim analiza material real y lo conecta con YOD/Lienzo.

Hace:
source intake
transcription
semantic segmentation
scene/speaker evidence
structure matching
candidate generation
gap detection
claim/evidence checks
resolution after confirmation
copy verification/update
recording gap feedback

No hace:
- inventar frases;
- fabricar evidencia;
- tratar planned_seconds como timecode real;
- automatizar candidatos como decisión final.

Regla:
Shim automatiza decisiones confirmadas, no candidatos no confirmados.

Loop posible:
Shim gap
→ YOD question
→ Arquitecto Recording Coach
→ nueva toma
→ Shim reanalysis.
