# CONTENT ENGINE V3

## 1. Qué produce

Content Engine V3 administra:
- clips verticales;
- clips horizontales;
- carruseles principales;
- carruseles highlights;
- frases;
- claims;
- potentials;
- copies;
- visual plans;
- production manifests.

Intro Lab vive fuera de este motor.

## 2. Vertical video

Hard gate:
- 50–90 s.

El speech se descompone en beats semánticos <=9 s para:
- lectura;
- edición;
- visual planning;
- B-roll/VFX placement.

### VFX/B-roll density

Seleccionar **3–4 oportunidades fuertes** por vertical.

No son “3–4 efectos obligatorios”.
Cada oportunidad puede terminar como `PRESENTER_ONLY`
si la intervención visual debilita el source.

Criterios de selección:
- hook;
- mecanismo difícil de imaginar;
- ejemplo concreto;
- dato/relación;
- cambio emocional;
- contraste;
- payoff.

## 3. Horizontal video

Hard gate:
- 8–12 min.

Necesita:
- cold open;
- tesis;
- capítulos;
- resets de atención;
- ejemplos/evidencia;
- payoff.

### VFX/B-roll density

Objetivo aproximado:
- **1 intervención de <=9 s por minuto de video.**

No usar el reloj como selector.

Para cada minuto lógico:
1. encontrar la idea más visualizable;
2. decidir si necesita B-roll/VFX;
3. si no existe intervención útil, mover la oportunidad a un punto vecino;
4. mantener densidad media sin convertirlo en slideshow.

## 4. Carruseles principales

La portada/slide 1 debe:
- tocar un pain point real;
- crear contexto suficiente;
- prometer una transformación/explicación concreta.

El desarrollo puede adoptar:
- noticia/qué cambió;
- explicación;
- tensión;
- mecanismo;
- evidencia;
- tips;
- framework;
- decision criteria.

**Tips solo si se derivan de source.**
No añadir “5 tips” porque el formato necesita llenar slides.

### Estructura base flexible

- S01 · Pain / Hook.
- S02 · Context.
- S03 · Why this happens.
- S04 · Mechanism / evidence.
- S05 · Consequence.
- S06+ · Tips/framework/application cuando exista source.
- Final · Punch/payoff/decision/CTA.

## 5. Carruseles Highlight

Podcast/interview:
crear 6.

Distribución:
- 2 host.
- 2 guest.
- 2 mixed.

Single speaker:
- 6 single-speaker.

### Lógica

Funcionan como un clip leído.

Cada slide:
- 1–2 frases cortas;
- exactas o paráfrasis rotulada;
- una sección interesante del source;
- 1–2 imágenes solo si el layout lo necesita.

Primera lámina:
- hook funcional.

Última:
- super-punch / idea de alto valor / cierre memorable.

No usar:
- frases arbitrarias sin continuidad;
- quote account;
- carrusel de screenshots sin tesis.

## 6. Prompts de carrusel

Cada slide exporta:
- `PROMPT_WITH_TEXT`
- `PROMPT_NO_TEXT`

Igual que en Visual Motion Core:
- observable;
- brand-specific;
- text zones;
- safe areas;
- camera/light/material;
- negatives;
- continuity.

## 7. Phrases

Una frase:
- fuente/timestamp;
- speaker;
- contexto;
- prompt visual;
- status source.

No convertir ASR dudoso en quote público.

## 8. Claims

Estados:
- VERIFIED.
- APPROVED.
- DRAFT.
- UNVERIFIED.
- BLOCKED.

Automatización no transforma UNVERIFIED en VERIFIED.

## 9. Potentials

Mantener:
- source;
- por qué tiene potencial;
- por qué no fue principal;
- qué necesita;
- posible formato;
- posible treatment.

## 10. Copies

Copy ≠ transcript.

Puede:
- contextualizar;
- extender;
- transferir a otra decisión;
- abrir conversación;
- convertir;
- citar fuentes.

Debe conservar open loop cuando el video lo usa.

## 11. Legacy preservation

Outputs anteriores:
- se marcan `legacy_output`.
- no se eliminan.
- no se sobreescriben.

V3 usa:
- `output_version = V3`.
- source fingerprint.
- strategy fingerprint.
- render fingerprint.


# V3.1 verified delta

- Multi-speaker podcast balance is explicit: GUEST_LED / HOST_LED / MIXED.
- JOC55 example contains 29 verticals and 12 horizontals.
- Each vertical has 3–4 actionable visual opportunities; PRESENTER_ONLY can be a beat decision but does not satisfy the VFX/B-roll minimum by itself.
- Each horizontal targets approximately one actionable visual intervention per assembled minute.
- Principal carousel cover = pain + context.
- Six additional highlight carousels: 2 host, 2 guest, 2 mixed.
- Claims remain VERIFY_SOURCE until independently confirmed.
