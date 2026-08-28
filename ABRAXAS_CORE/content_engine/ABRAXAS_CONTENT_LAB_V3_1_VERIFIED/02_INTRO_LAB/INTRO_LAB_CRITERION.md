# INTRO LAB V3 · TRAILER ENGINE

## 1. Definición

Intro Lab V3 no genera “una recopilación de frases fuertes”.

Genera **trailers narrativos de 50–80 segundos** que hacen que el episodio
se sienta necesario, sin sacrificar source truth.

Su lenguaje puede usar:
- footage real del podcast;
- VO;
- Source Replacement;
- documental;
- archivo autorizado;
- B-roll generado o filmado;
- animación editorial;
- motion UI/data;
- visualización científica;
- palabras/objetos simbólicos;
- silencio;
- música;
- VFX.

La historia decide qué herramientas entran.

## 2. Output obligatorio: seis intros

### Podcast/entrevista con host + invitado

Generar exactamente:

#### Guest-only
- `INTRO_G01` · tesis/contradicción.
- `INTRO_G02` · character/story/fracture/reconstruction.
- `INTRO_G03` · mechanism/stakes/decision.

#### Mixed host + guest
- `INTRO_M01` · host challenge → guest reframe.
- `INTRO_M02` · collision/tension → mechanism.
- `INTRO_M03` · host setup → guest reveal → callback/close.

No son plantillas rígidas: son **familias de diferenciación**.
Las seis piezas deben tener tesis, orden, energía y payoff distintos.

### Single speaker

Generar seis rutas `SINGLE_SPEAKER`, manteniendo igual nivel de diversidad.

## 3. Runtime

Hard gate:
- `50.0 <= duration <= 80.0 s`.

No rellenar para llegar al mínimo.
No destruir una pieza de 79 s para “hacerla más TikTok”.

## 4. Beat grammar

Todo lo que se edita se expresa en beats semánticos.

`0 < beat_duration <= 9.0 s`

Un beat termina donde cambia alguno de estos factores:
- idea;
- relación causal;
- speaker;
- emoción;
- objeto narrativo;
- pregunta;
- evidencia;
- estado visual;
- función.

### Ejemplos

Speech original de 27 s:
- Beat A 8.2 s.
- Beat B 8.9 s.
- Beat C 8.6 s.

Speech de 20 s:
- puede ser 7.0 + 6.5 + 6.5;
- o 8.5 + 5.5 + 6.0.

**No dividir por matemática si rompe una frase o pensamiento.**

## 5. Funciones de beat

Cada beat declara una función primaria:

- `HARD_HOOK`
- `CONTRADICTION`
- `CHARACTER`
- `WORLD_BUILDING`
- `CONTEXT`
- `STAKES`
- `SPECIFICITY`
- `MECHANISM`
- `EVIDENCE`
- `TURN`
- `REVEAL`
- `REFRAME`
- `ESCALATION`
- `MOMENT_OF_VALUE`
- `CALLBACK`
- `PAYOFF_CONTROL`
- `CLOSE`
- `OPEN_LOOP`

Cada beat debe añadir algo nuevo.

## 6. Hook

Objetivo:
- comprensión inmediata;
- contraste/tensión/reconocimiento;
- promesa legítima.

Target:
- primer hook claramente legible dentro de 0–5 s.

No:
- biografía lenta;
- frase genérica;
- montaje espectacular sin pregunta narrativa.

## 7. Voice Over slot

Cada intro tiene tres VO alternativos:
- `VO_A_BALANCED`
- `VO_B_CONTRARIAN`
- `VO_C_EMOTIONAL_OR_INTELLECTUAL`

Cada VO:
- exactamente 2 beats;
- cada beat <=9 s;
- total <=18 s;
- añade información que no está repetida en el source;
- conecta entrada y salida;
- no inventa experiencia/citas/datos.

### Source Replacement

Existe una cuarta ruta:
`SOURCE_REPLACEMENT`.

Regla:
**VO o Source Replacement. Nunca ambos.**

Source Replacement puede contener 1–2 beats <=9 s cada uno.
Si necesita microtrim, se marca y se resuelve contra master.

## 8. Arquitectura narrativa

No imponer siempre la misma plantilla.
Toda ruta sí necesita:

1. **Entrada marcada.**
2. **Progresión.**
3. **Cambio de estado.**
4. **Valor real.**
5. **Cierre marcado.**

Familias válidas:
- Contrarian Thesis → Stakes → Evidence → Decision → Callback.
- Character → Fracture → Mechanism → Reconstruction → Punch.
- Question → World → Complication → Reframe → Open Loop.
- Host Challenge → Guest Reframe → Example → Consequence → Callback.
- Two-Voice Tension → Clarification → Stakes → Reveal → Statement.
- Moment of Value → Hidden Cost → Mechanism → Consequence → Final Rule.

## 9. Cierres

No todo termina con pregunta.

Tipos válidos:
- `QUESTION_OPEN_LOOP`
- `DECLARATIVE_PUNCH`
- `PARADOX`
- `CALLBACK`
- `UNRESOLVED_STATEMENT`
- `DECISION_LINE`
- `IMAGE_OR_SOUND_RESOLUTION`

Un final es fuerte cuando:
- paga el hook;
- deja una consecuencia;
- no revela toda la respuesta;
- no necesita “mira el episodio completo” para funcionar.

## 10. Visual treatment density

**Cada beat del Intro Lab debe recibir una decisión visual**, pero esa decisión puede ser:
- B-roll.
- VFX.
- UI/data.
- palabra.
- object metaphor.
- source close-up.
- camera movement.
- silence.
- `PRESENTER_ONLY`.

No existe obligación de “poner efecto en todos”.

## 11. VFX/B-roll decision test

Para cada beat:

1. ¿El source ya es la mejor imagen?
2. ¿Hay un objeto/acción literal más claro?
3. ¿Existe una representación visual del mecanismo?
4. ¿Una metáfora añade comprensión sin exagerar?
5. ¿Un gráfico/UI/data prueba o explica?
6. ¿El cambio visual coincide con un cambio de idea?
7. ¿El asset es plausible y producible?
8. ¿Los subtítulos quedan intactos?
9. ¿START/MIDDLE/END describen una misma escena continua?
10. ¿La salida deja espacio al beat siguiente?

## 12. Visual reference outputs por beat

Cada beat produce un `Visual Motion Pack`:

- `LOGIC.txt`
- `START_NO_TEXT.txt`
- `START_WITH_TEXT.txt`
- `MIDDLE_NO_TEXT.txt`
- `MIDDLE_WITH_TEXT.txt`
- `END_NO_TEXT.txt`
- `END_WITH_TEXT.txt`
- `ANIMATION_NO_TEXT.txt`
- `ANIMATION_WITH_TEXT.txt`

Y slots:
- START image.
- MIDDLE image.
- END image.

Los tres frames son **estados del mismo movimiento**, no tres concepts distintos.

## 13. Subtítulos

Si el master ya contiene subtítulos burned-in:
- no pedir a una IA que los reescriba;
- no pedir strike-through sobre ellos;
- no recrearlos;
- no traducirlos;
- no variar tipografía/color/posición.

Preferido:
1. generar tratamiento limpio;
2. componer tratamiento y source;
3. mantener/reaplicar la capa original de subtítulos por encima.

Texto VFX/keyword:
- es una capa editorial separada;
- nunca sustituye captions;
- no debe interferir con zona de subtítulos.

## 14. QA de seis intros

Set-level hard gates:

- 6/6 dentro de 50–80 s.
- 3 guest-only + 3 mixed cuando corresponde.
- ninguna secuencia beat >9 s.
- cada VO = 2 beats <=9 s.
- 6 tesis/ángulos diferenciados.
- 6 cierres no redundantes.
- no repetir el mismo B-roll/metáfora como default.
- no usar tecnología visual para cubrir una historia débil.
- source traceability completa.


# V3.1 verified delta

- This package contains six actual JOC55 intro routes, not only a target schema.
- Mixed routes are first-class and use speaker-balanced source.
- Legacy source blocks >9 s are resegmented into V3.1 microtrims with parent range + anchors.
- A source-replacement path is separately runtime-gated.
- Visual prompts are generated for both 9:16 and 16:9.
- Default treatment is PRESENTER_ONLY when no visual representation improves meaning.
- A visual opportunity is not counted as VFX merely because a beat exists.
