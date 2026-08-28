# Estado real: base V4.2.5, decisión V4.2.24

La versión declarada por continuidad era V4.2.23, pero la última base ejecutable coherente encontrada es V4.2.5. V4.2.24 no rebaja ni reinicia el proyecto: instala su motor semántico sobre esa base comprobada.

Estado preconstruido V4.2.24:

- 37 verticales presentes y ordenados: V01–V18, JV01–JV11, MV01–MV08.
- 222 motions verticales: seis exactos por vertical.
- 12 horizontales presentes y ordenados: H01–H04, JH01–JH04, MH01–MH04.
- 255 oportunidades horizontales seleccionadas, densidad global cercana a 2/min.
- 477 ventanas Motion en total, todas entre 4 y 9 s.
- 953 cues SRT analizados.
- 842 ventanas de referencia de transcripción, máximo 8.983 s y pérdida de palabras igual a cero.
- Intro Lab: seis rutas y hash del núcleo editorial sin cambios.

Warnings heredados, no ocultados: diez verticales exceden 80 s (V03, V08, V10, V13, JV03, MV01, MV02, MV03, MV05 y MV07). El motor no mutila contenido para fingir cumplimiento; genera `VERTICAL_DURATION_REVIEW` y exige una decisión editorial separada si el límite 45–80 debe aplicarse estrictamente.

