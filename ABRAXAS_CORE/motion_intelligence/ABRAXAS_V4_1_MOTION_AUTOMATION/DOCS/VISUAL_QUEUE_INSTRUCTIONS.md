# VISUAL GENERATION QUEUE · CÓMO USARLA

`05_BUILD_ASSETS_AND_VISUAL_QUEUE.command` crea:

`09_VISUAL_QUEUE/VISUAL_GENERATION_QUEUE.json`

La cola separa:
- motion/VFX/B-roll;
- slides de carruseles principales;
- slides de Highlight Carousels;
- frases que todavía necesitan una dirección visual aprobada.

## Motion

Cada item apunta a una carpeta que contiene:
- LOGIC;
- START/MIDDLE/END;
- prompts con/sin texto;
- prompt de animación.

Proceso recomendado:
1. subir referencia de personaje/estilo/cliente;
2. generar START sin texto;
3. usando las mismas referencias/identidad, generar MIDDLE;
4. generar END;
5. llevar los tres estados + `ANIMATION_NO_TEXT.txt` a Flow/Omni;
6. generar el clip <=9 s;
7. componerlo en DaVinci;
8. conservar subtítulos originales por encima.

## Carruseles

Cada slide ya contiene prompt WITH_TEXT y NO_TEXT. Generar una imagen por slide; nunca un collage/contact sheet.

## Frases

El HTML V3.1 conserva 15 frases fuente, pero no contiene una escena visual aprobada para cada una. La cola las marca `NEEDS_CREATIVE_DIRECTION` para evitar que el renderizador invente imágenes genéricas. Use el Content Engine/una IA editorial para decidir escena y luego añada el prompt.

## Claims

Los claims no entran en generación pública mientras estén `VERIFY_SOURCE`.
