# Auditoría recursiva de ZIP

Se inspeccionaron todos los ZIP adjuntos y cada ZIP interno por hash, no solo por nombre. El inventario reproducible está en `AUDIT/RECURSIVE_ZIP_INVENTORY.json`.

Resultado de la segunda pasada:

- 65 apariciones de archivos ZIP.
- 42 hashes únicos.
- 22 archivos ZIP reales únicos extraídos y revisados.
- 23 apariciones duplicadas confirmadas por SHA-256.
- 20 entradas `__MACOSX/._*.zip` inválidas: metadata AppleDouble, no archivos históricos perdidos.

Hallazgos que cambian la implementación:

1. El primer paquete V4.2.24 era continuidad documental mínima; no contenía un hotfix creativo ejecutable.
2. V4.2.23 y el prototipo V4.2.24 generaban estados `AI_PENDING`; no tomaban decisiones semánticas reales.
3. V4.2.5 es la base ejecutable más completa y verificable. Sus 37 pruebas pasan con `PYTHONPATH=TOOLS`.
4. V4.2.5 corrigió horizontales longform, pero aún fragmentaba verticales físicamente. El runtime V4.2.24 desactiva esa fragmentación.
5. Los hotfixes V4.2.6–V4.2.9 aportan evidencia de reanudación y organización, pero varias copias son truncadas, no-op o reparaciones fallidas. No son base autorizada.
6. El histórico reporta 73 entregables: 24 variantes/orientaciones de intros, 37 verticales y 12 horizontales.
7. TXT, JSON, prompts, manifests, cache y decisiones aprobadas deben conservarse. Una actualización de medios solo debe reemplazar medios regenerables.

