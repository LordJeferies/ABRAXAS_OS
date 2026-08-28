# Status Update Protocol

Al cerrar cada fase:

1. verificar código/tests;
2. actualizar `system-status.json`;
3. cambiar `status`;
4. actualizar `progress` solo según tareas cerradas;
5. mover items de `next` a `done`;
6. registrar nuevo SHA remoto después del push;
7. no usar porcentajes como prueba de calidad;
8. no marcar GREEN si no existe evidencia.

El HTML es estable; lee `system-status.json` en GitHub Pages y usa fallback embebido si se abre sin servidor.
