# SHARED CORE V3.1

## Source Truth

Prioridad:
1. instrucción explícita actual;
2. selection/approval export;
3. editorialData confirmado;
4. timestamp exacto;
5. audio/video master;
6. transcript literal;
7. ASR;
8. inferencia editorial.

Nunca inventar speech ni word timecodes.

Un MICROTRIM conserva parent range + anchors y permanece BLOCKED hasta resolverse contra audio.

## Speaker roles

- GUEST_LED: invitado posee tesis, framing y payoff.
- HOST_LED: host posee tesis/framing/payoff aunque el invitado aporte evidencia.
- MIXED: ambos son estructuralmente necesarios. Una pregunta corta del host + monólogo del invitado NO convierte la pieza en MIXED.

## Hook–Payoff

El hook abre una deuda.
El desarrollo debe pagar exactamente esa deuda.
Si el hook podría pertenecer a otra pieza sin cambiar el cuerpo, revisar especificidad.

## Anti-slop

Rechazar:
- motivación genérica;
- stock corporativo sin función;
- dashboard inventado;
- hologramas por defecto;
- metáfora sin relación;
- quote account;
- carrusel que solo divide transcript;
- prompts que dependen de “como hablamos antes”.

# SHARED VISUAL / MOTION CORE V3

## 1. Tesis visual

Una intervención visual ABRAXAS debe ser:

`VERDAD + FUNCIÓN + ESPECIFICIDAD + MATERIALIDAD + MOVIMIENTO + IDENTIDAD`

No basta:
“premium, cinematic, futuristic, 8K”.

## 2. Lo que se extrae de las referencias

El PDF de referencias no significa:
“usar cerebros”.

Significa que, si aparece un cerebro, una manzana, una molécula, una hoja,
un teléfono, una mesa, un examen o una persona, debe tener:

- materialidad creíble;
- detalle macro/micro coherente;
- iluminación con dirección;
- profundidad real;
- contacto y sombras;
- textura no repetitiva;
- reflections/refraction plausibles;
- encuadre intencional;
- un sujeto dominante;
- jerarquía limpia;
- integración editorial;
- color con propósito.

## 3. Familias de tratamiento

### `VOX_EDITORIAL`
Para explicar:
- procesos;
- contradicciones;
- relaciones;
- mapas;
- causalidad;
- datos;
- news/editorial framing.

Lenguaje:
- shapes;
- líneas;
- flechas;
- diagramas;
- máscaras;
- recortes;
- type;
- data;
- fotografías;
- textura.

### `SAAS_PRODUCT_MOTION`
Para:
- UI;
- workflow;
- estados;
- comparaciones;
- cards;
- inputs/outputs;
- producto.

Lenguaje:
- materialización;
- focus state;
- stack;
- zoom contextual;
- graph;
- token/card movement;
- device/UI depth.

No inventar interfaz o capacidad si el source no la prueba.

### `DOAC_CINEMATIC_BROLL`
Para:
- character;
- stakes;
- memory;
- location;
- metaphor;
- world building.

Regla:
**storyboard before generation. Story > tech.**

Debe contextualizar la entrada a la escena generada.

### `DOCUMENTARY_LITERAL`
Acción realista ligada directamente al texto:
- escribir examen;
- abrir cuaderno;
- manipular muestra;
- caminar por laboratorio;
- leer documento;
- usar teclado;
- preparar instrumento.

### `SYMBOLIC_OBJECT`
Objeto que hace visible una idea:
- puerta;
- timeline;
- hoja;
- reloj;
- bloque;
- hilo;
- tablero;
- pieza de ajedrez.

El símbolo necesita explicación narrativa.

### `SCIENTIFIC_MACRO`
- planta;
- tejido;
- extracto;
- microestructura;
- líquido;
- cristales;
- placa;
- petri;
- laboratorio.

### `SCIENTIFIC_RENDER`
- moléculas;
- redes;
- membranas;
- células;
- mecanismos;
- relaciones.

Debe declararse ilustrativo si no es evidencia real.

### `UI_DATA_OVERLAY`
Gráficos/medidas/contexto sobre footage o B-roll.

### `WORD_ENVIRONMENT`
Una palabra/valor se vuelve parte del espacio:
- atrás del sujeto;
- en pared/suelo/vidrio;
- entre planos.

No tocar captions.

### `PRESENTER_INTERACTION`
El speaker interactúa con:
- nodos;
- objeto;
- gráfico;
- interface;
- palabra.

La interacción debe respetar:
- manos;
- eyeline;
- oclusión;
- perspectiva;
- física.

### `PRESENTER_ONLY`
Decisión positiva.
Usar cuando rostro/voz es más fuerte que cualquier intervención.

## 4. START / MIDDLE / END

### START
Estado inicial:
- composición clara;
- motivo todavía contenido;
- dirección de movimiento preparada;
- continuidad con plano anterior.

### MIDDLE
Estado de máxima actividad:
- idea visual totalmente legible;
- máximo número de elementos permitido;
- acción físicamente coherente;
- jerarquía todavía clara.

### END
Estado de salida:
- elemento resuelto/retraído/desapareciendo;
- no congelar caos;
- dejar espacio para siguiente corte;
- continuidad de dirección.

## 5. Motion grammar 2026

Usar como vocabulario:

- ease-in / ease-out;
- anticipation;
- overshoot;
- follow-through;
- hold;
- settle;
- match cut;
- parallax;
- focus shift;
- scale;
- reveal;
- masking;
- materialization;
- dissolve;
- state change;
- transform;
- orbit;
- rack focus.

Evitar “linear movement everywhere”.

Cada movimiento declara:
- start;
- acceleration;
- peak;
- deceleration;
- settle/exit.

## 6. Prompts por beat

Por cada visual:

### Explicación humana
`LOGIC.txt`
contiene:
- spoken text;
- function;
- visual idea;
- direct/symbolic mapping;
- why;
- what not to reveal;
- subtitle policy;
- reference assets needed.

### Frame prompts
- START_NO_TEXT
- START_WITH_TEXT
- MIDDLE_NO_TEXT
- MIDDLE_WITH_TEXT
- END_NO_TEXT
- END_WITH_TEXT

### Video prompts
- ANIMATION_NO_TEXT
- ANIMATION_WITH_TEXT

## 7. Prompt template observable

Todo prompt serio debe declarar, cuando aplica:

ROLE  
PURPOSE  
SPOKEN CONTEXT  
NARRATIVE FUNCTION  
DURATION  
CANVAS/RATIO  
REFERENCE IMAGE ROLE  
SUBJECT  
ACTION  
SCENE  
ELEMENTS  
COMPOSITION  
CAMERA HEIGHT/DISTANCE  
LENS FEEL  
FOREGROUND/MIDGROUND/BACKGROUND  
DEPTH OF FIELD  
LIGHTING  
HIGHLIGHT ROLLOFF  
CONTACT SHADOWS  
REFLECTION/REFRACTION  
MATERIALS  
MICROTEXTURE  
IMPERFECTIONS  
LIQUID/ORGANIC BEHAVIOR  
CLIENT PALETTE  
SUPPORTING COLOR HARMONY  
TEXT POLICY  
SUBTITLE EXCLUSION ZONE  
START STATE  
MIDDLE STATE  
END STATE  
MOTION CURVE  
SFX RELATION  
CONTINUITY  
NEGATIVE CONSTRAINTS  
OUTPUT

## 8. With text vs without text

### WITHOUT TEXT
No generated legible typography.
Useful for:
- compositing;
- source captions;
- later typography.

### WITH TEXT
Only the exact intentional editorial text specified.

Never:
- auto-caption;
- re-transcribe;
- add random UI text;
- make subtitle-like paragraphs.

## 9. Subtitle integrity

When original subtitles exist:
- preserve exact original layer.
- generated visual stays away from subtitle safe area.
- no generative text over captions.
- no strike-through of caption line.
- no replacing a caption word with stylized AI text.

When word emphasis is desired:
- separate `emphasis_layer`.
- different visual depth/position.
- no semantic conflict with captions.

## 10. Visual quality criteria

### Materials
Glass:
- real thickness;
- Fresnel-like reflection;
- refraction;
- contact shadow;
- no plastic blob.

Skin:
- pores/subtle variation;
- no wax;
- natural subsurface response.

Metal:
- correct roughness;
- directional highlights;
- no mirror unless specified.

Paper:
- fibers/edge;
- ink/print behavior;
- small imperfections.

Botany:
- veins;
- translucency;
- moisture;
- asymmetric natural detail.

Lab:
- plausible equipment;
- real grip;
- correct scale;
- clean but not sci-fi.

### Camera
Use explicit lens feeling:
- macro 90–120 mm;
- portrait 50–85 mm;
- documentary 28–50 mm;
- top shot;
- low-angle/object hero;
- telephoto compression;
- handheld restrained.

### Lighting
Prefer:
- one motivated key;
- controlled fill;
- practical/environment source;
- natural highlight rolloff;
- depth separation.

## 11. Anti-AI hard fails

Reject:
- plastic skin/materials;
- malformed hands;
- duplicate fingers;
- impossible keyboard interaction;
- floating object without designed reason;
- impossible reflection/refraction;
- repeated perfect texture;
- unreadable/fake text;
- invented brand logo;
- generic corporate hologram;
- random neon;
- random luxury prop;
- lab equipment that cannot exist;
- molecule presented as measured fact without source;
- excessive sharpen/clarity;
- deformed UI;
- captions changed by VFX;
- motion with no narrative trigger.

## 12. Client identity

The treatment family never replaces client identity.

Example Moka:
- official Moka colors dominate;
- supports may add amber/blue/red when scientifically/visually useful;
- result must still read Moka.

Example JOC:
- JOC palette/contrast/visual system remains primary even when motion grammar is Vox-like.

## 13. Safety against imitation

Use references to extract:
- grammar;
- pacing;
- composition;
- material quality;
- motion principles.

Do not ask model to:
- recreate exact Vox card;
- copy DOAC trailer shot;
- reproduce another brand’s interface;
- mimic identifiable artwork one-for-one.

