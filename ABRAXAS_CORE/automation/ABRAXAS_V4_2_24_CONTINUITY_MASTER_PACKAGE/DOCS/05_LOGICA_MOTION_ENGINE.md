# Lógica del Motion Engine V4.2.24

El motor usa primero la estructura editorial existente: segmentos, delivery parts aprobados, función narrativa, treatment family, speaker y transcripción exacta. Las keywords solo aportan puntuación; nunca son la decisión completa.

Para verticales construye candidatos de 4–9 s, los puntúa por calidad y posición narrativa, y resuelve una secuencia cronológica óptima de seis roles mediante programación dinámica. No usa cortes fijos.

Para horizontales conserva el programa completo, calcula un objetivo redondeado de duración/30 s y distribuye oportunidades de alta densidad semántica. Limita los inicios a dos por minuto de reloj para evitar acumulaciones.

Cada decisión contiene: rango de fuente, rango de timeline, duración, texto exacto, rol, motivo, motion primario, alternativa, pista, modo de colocación, contrato de assets y prompts V7.

La Terminal no decide creatividad. Organiza, valida, renderiza y permite una revisión humana posterior sin perder la decisión original.

