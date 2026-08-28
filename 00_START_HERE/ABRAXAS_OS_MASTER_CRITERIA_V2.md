# ABRAXAS OS — Master Criteria V2

## 1. Definición general

ABRAXAS OS es un sistema operativo de creación, producción, organización, publicación y aprendizaje de contenidos.

Su tesis central es:

> **ABRAXAS convierte criterio en infraestructura.**

El sistema debe funcionar con:
- lógica determinista;
- trabajo humano;
- IA externa por roundtrip de prompts;
- IA integrada futura.

La IA no es el sistema. Es un proveedor intercambiable.

## 2. Módulos y responsabilidades

### YOD
Core de inteligencia y memoria:
- Client Core;
- Brand Core;
- formatos;
- estructuras;
- patterns;
- prompts;
- copy;
- visual intelligence;
- motion intelligence;
- source truth;
- opportunities;
- coverage;
- cadence;
- planning;
- learning.

### Lienzo
Objeto vivo, editable, versionado y trazable de cada contenido.

Nace temprano y evoluciona:
PLANNED → OBSERVED → RESOLVED → PRODUCTION → PUBLICATION → LEARNING.

No se reemplaza en cada etapa. Se completa como rompecabezas.

### He
Ventana operativa.
Permite ver y operar YOD/Lienzos, contenidos, producción, tareas, dependencias, backlog, calendario, publishing, metrics y Arquitecto.

### Shim
Analiza material real.
Encuentra candidatos, gaps, estructuras compatibles, evidencia y decisiones confirmadas.
No inventa.

### VAV
Brazo de producción audiovisual.
Materializa edición, captions, motions, visuales, renders y devuelve estado + artefactos al Lienzo.

### Arquitecto
Presencia transversal.
Asistente, coach, productor, director, navegador, QA y documentación viva.

### Publishing
Distribución mediante adapters de plataforma.

### Metrics
Resultados post-publicación.
He los muestra.
YOD aprende de ellos.

## 3. Qué ABRAXAS no es

No es:
- chatbot genérico;
- simple prompt generator;
- calendario social aislado;
- gestor de tareas con IA;
- repositorio de templates;
- IA autónoma que decide;
- sistema que copia la misma estrategia a todas las marcas;
- sistema que pierde provenance;
- sistema donde un render final elimina la posibilidad de editar.

## 4. Calidad de contenido

Una pieza publicable debe tener:
- razón de existir;
- tesis;
- hook legítimo;
- payoff;
- progresión;
- información nueva por unidad;
- mecanismo cuando haga falta;
- ejemplos específicos;
- source truth;
- brand fit;
- platform fit;
- visuales funcionales;
- copy funcional;
- trazabilidad;
- versionado;
- QA.

### Tema no es idea

Tema:
“liderazgo”.

Idea:
“haber ejecutado varias funciones al principio puede mejorar el criterio con el que luego delegas”.

### Hook

Crea una deuda narrativa.
No es clickbait gratuito.

### Payoff

Debe pagar la deuda concreta que abrió el hook.

### Anti-slop

Evitar clichés, simetrías artificiales, CTAs automáticos, tensión falsa, lenguaje de gurú y redacción genérica de IA.

## 5. Formato vs estructura

Formato físico y estructura narrativa son dimensiones distintas.

Ejemplo:

Formato:
SHORT_VERTICAL_VIDEO

Estructura:
EVIDENCE → LIMITATION → DECISION

Otro contenido puede usar el mismo formato y una estructura completamente distinta.

## 6. Structure Library

El registry debe incluir familias universales, industry adaptations y client patterns.

Seed:
DIAGNOSIS
PROBLEM_MECHANISM_DECISION
CONTRAST
EVIDENCE
CASE
PROCESS
MYTH
STORY
FRAMEWORK
DECISION
DEMO
AUTHORITY
CONVERSATION
MYTH_REALITY
OBJECTION
DEFINITION
SYSTEM

El corpus histórico debe ser minado para crear el Registry V1 real.

## 7. Ingeniería inversa

El Content Structure Miner debe:
- recorrer corpus;
- entrar en ZIPs internos;
- deduplicar;
- identificar hooks, tesis, funciones, progression, payoff, CTA, format, speaker, visual mode y evidence;
- detectar equivalencias;
- clusterizar;
- conservar provenance;
- producir Structure Genome y families.

## 8. YOD Opportunity Engine

YOD puede crear sin idea inicial.

Analiza:
Client Core
history
pillars
coverage
formats
structures
hooks
CTA
metrics
cadence
sources
goals

y propone oportunidades justificadas.

No “lista de 50 ideas” sin criterio.

## 9. Creación individual o por plan

Debe poder crear:
- 1 contenido;
- N contenidos;
- una semana;
- dos semanas;
- un mes.

Plan != Lienzo.

Un Plan agrupa múltiples Lienzos independientes.

Cadence Engine controla:
diversidad
coverage
format mix
pillar mix
structure mix
hooks
CTA
energy
platform adaptation
cannibalization.

## 10. Copy

El copy nace temprano.

YOD puede crear Master Copy y variantes.

Shim puede verificar/actualizar según source real.

Arquitecto puede sugerir mejoras.

El usuario puede editar antes y después de producir.

Copy no es resumen automático.

Funciones:
CONTEXTUALIZE
EXTEND
TRANSFER
CONVERT
DISCUSS
SOURCE
FRAME

Model:
copy.master
copy.platforms.instagram
copy.platforms.tiktok
copy.platforms.linkedin
copy.platforms.youtube

Cada variante es versionada.

Si el contenido final cambia:
OUT_OF_SYNC
→ revisar
→ nueva versión.

## 11. Prompt Intelligence

Un prompt ABRAXAS es una especificación de producción.

Debe poder ensamblarse con:

ROLE
OBJECTIVE
CONTEXT
INPUTS
WHAT_IT_IS
WHAT_IT_IS_NOT
STRUCTURE
CLIENT_RULES
FORMAT_RULES
PLATFORM_RULES
EVIDENCE
RESTRICTIONS
NEGATIVES
OUTPUT_CONTRACT
ACCEPTANCE_CRITERIA
QA
HANDOFF
CONTINUITY

Prompt Compiler:
core + task + client + Lienzo + format + structure + platform + preset + evidence + negatives + output schema + QA.

## 12. IA con y sin integración

ABRAXAS funciona sin IA.

### Logic Engine
Puede resolver:
coverage
structure
cadence
validation
impact
state
dependencies
prompt assembly.

### External AI
YOD crea prompt → usuario lo usa afuera → importa respuesta → parser → validator → diff → aceptar/rechazar.

### Internal AI
Mismo contrato, provider integrado.

No crear copias desconectadas.
Todo vuelve al mismo content_id.

## 13. Visual Intelligence

Una imagen debe:
EXPLAIN
CONTRAST
ANCHOR
PROVE
ORIENT
HUMANIZE
SYMBOLIZE
CREATE_TENSION
SHOW_PROCESS
SHOW_RESULT

Pregunta:
¿Qué perderíamos si desaparece?

Tres vías:
- IA interna;
- IA externa por prompt roundtrip;
- renderer determinista/procedural.

No todo necesita IA generativa.

## 14. Edición visual después de generar

Generar no cierra.

Plan visual sigue editable.

Si cambia:
- conservar artifact anterior;
- nueva versión;
- marcar OUT_OF_SYNC;
- mostrar impacto;
- corregir/regenerar/ignorar.

Correction:
BASE PROMPT + CORRECTION + PRESERVE RULES.

Aplica a:
images
covers
motions
captions
copies
renders
visual text.

## 15. Motion / VFX / SFX

Motion no se elige por espectacularidad.

Debe justificar:
función
momento
duración
source relation
caption relation
preserve rules
fallback.

Con una sola foto se puede usar:
push/pan
parallax
depth
crop/reveal
mask
light shift
camera simulation
text overlay.

Con START/MIDDLE/END se puede interpolar una secuencia.

VFX:
aclarar, visualizar, enfatizar, conectar o cambiar estado.

SFX:
cada sonido tiene trigger y función.
Si no hay evento justificable: no_sfx_needed.

## 16. Lienzo

Secciones:
GENERAL
CONTENT
COPY
VISUAL
COVER
MOTIONS
CAPTIONS
EDIT
AUDIO
VFX
SFX
PUBLISHING
METRICS
HISTORY

Estados:
NOT_NEEDED
NOT_STARTED
DRAFT
IN_PROGRESS
WAITING
BLOCKED
READY_FOR_REVIEW
REVIEW
APPROVED
LOCKED
GENERATING
GENERATED
OUT_OF_SYNC
READY
DONE
ERROR

## 17. Impact Graph

Los componentes conocen dependencias.

Ejemplo:
Hook
→ copy
→ cover headline
→ motion title
→ caption emphasis

Cambiar una fuente no regenera todo.
Calcula y muestra impacto.

## 18. He

He es la ventana operativa.

Debe permitir:
- Client Core;
- YOD;
- ideas;
- opportunities;
- plans;
- Lienzos;
- copy;
- visual;
- production;
- tasks;
- dependencies;
- backlog;
- calendar;
- publishing;
- metrics;
- Architect.

Solo mode:
“dónde quedaste / qué sigue”.

Team mode:
assigned_to / blocked_by / waiting_for / dependencies / due dates.

## 19. Shim

Shim trabaja contra material real.

Puede:
transcribir
segmentar
identificar speaker/scene
structure match
candidates
gaps
claims
resolve
copy sync
recording feedback.

No inventa material faltante.

Gap loop:
Shim → YOD → Arquitecto Recording Coach → nueva toma → Shim.

## 20. VAV

VAV produce y reporta.

No entrega solo un MP4.

Debe actualizar:
component status
artifacts
versions
hashes
errors
events
provenance.

He ve el estado a través del Lienzo.

## 21. Arquitecto

Arquitecto está presente en todo el OS.

Modos:
navigation
coach
producer
director
editor
copy
visual
motion
recording
QA
technical/training

Puede trabajar aunque la edición ocurra en otra app.

### Production Coach

Puede guiar:
editing
VFX
SFX
music
motion
still animation
image editing
cover
copy
recording

Debe saber dónde estás, de dónde vienes y qué sigue.

No cambia una decisión aprobada sin permiso.

## 22. Publishing

Content != Publication.

Una pieza puede publicarse en diferentes redes y fechas.

publication_targets[] por plataforma.

Al programar guardar snapshot de:
asset
copy
cover
metadata
time
account
version.

Una target programada no congela otras.

## 23. Metrics

Raw:
views
reach
impressions
likes
comments
shares
saves
watch time
completion
clicks
leads
conversions

Normalized:
ATTENTION
RETENTION
ENGAGEMENT
AMPLIFICATION
CONVERSION

He muestra.
YOD aprende.

V1:
manual/CSV/JSON.

V2:
APIs.

## 24. Arquitectura de APIs

No meter Meta/TikTok/YouTube/LinkedIn directamente en He.

PublisherAdapter:
validate
prepare
schedule
publish
reschedule
cancel
getStatus
getMetrics.

OAuth y secretos fuera de Git.

## 25. Source Truth

Fuentes:
APPROVED_PRIMARY
APPROVED_SECONDARY
UNVERIFIED
CONTRADICTED
BLOCKED

Claims:
VERIFIED
APPROVED
DRAFT
UNVERIFIED
BLOCKED

Shim/YOD no inventan precisión.

## 26. Git

Única raíz Git:
`~/Desktop/abraxasos`.

No repos anidados.

Versionar:
código
schemas
docs
tests
scripts
criteria
registries
contracts.

No versionar:
models
runtime
node_modules
venvs
renders
video/audio
evidence pesada
backups
quarantine
secrets.

Cada fase GREEN:
review
targeted staging
large/secret/nested-git check
commit
push
verify local SHA == remote SHA.

## 27. Roadmap

F0 Baseline
F1 Forensic Content Intelligence
F2 Contracts First
F3 YOD V1
F4 He V1
F5 Shim V1
F6 VAV Integration
F7 Visual Production
F8 Arquitecto V1
F9 Publishing
F10 Metrics
F11 Platform APIs
F12 Internal AI Providers

## 28. Regla final

YOD recuerda y piensa.
Shim observa y resuelve.
VAV produce.
He organiza y muestra.
Arquitecto acompaña.
Lienzo conecta todo.
Publishing distribuye.
Metrics devuelve realidad.
YOD aprende.
