# Objetivo del hotfix V4.2.24

Eliminar la confusión entre ventana Motion y unidad física de video.

Flujo incorrecto histórico: video completo → dividir cada 8/9 s → crear Motion en cada parte.

Flujo autorizado: video completo → transcripción y HTML → análisis narrativo → selección de momentos → contrato M1–M6 → crear solo assets/clips de referencia necesarios → colocar sobre el programa completo.

El resultado esperado incluye:

- Content Engine actualizado con el mapa semántico incorporado.
- Intro Lab actualizado solo de forma aditiva, con su núcleo protegido.
- mapa creativo, cola, razones, prompts, pistas y rangos exactos;
- carpetas de Motion ordenadas por video y rol;
- renderer de los programas completos sin fragmentación periódica;
- TXT completo de referencia dividido hasta 9 s, separado de la cola real.

