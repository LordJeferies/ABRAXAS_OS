# PIPELINE DAVINCI RESOLVE

## Modos de entrada

A. Importar los MP4 limpios generados por Terminal.
B. Importar master y construir timelines directamente desde sus rangos.

Recomendado: A cuando la precisión de corte ya fue resuelta por FFmpeg.

## Flujo

manifest
→ importar medios
→ timeline por clip
→ orientación/resolución
→ plantilla vertical/horizontal
→ Track FX de voz
→ movimiento
→ subtítulos IA
→ glosario
→ capa final editable
→ render preset
→ cola
→ verificación.

## Workspace Console

Usar Py3.

Nunca asumir una API por nombre sin comprobarla en la instalación local.

Crear:
- script de diagnóstico;
- script maestro;
- script reanudar;
- script reparar;
- estado JSON;
- logs.

## Compatibilidad Console

- UTF-8.
- `fu_stdout` puede no tener `flush()`.
- Evitar `flush=True`.
- Launcher que decodifique UTF-8-SIG.
- Limpiar `__pycache__` tras hotfix.
- Recargar módulos.

## Subtítulos

DaVinci debe seguir siendo la fuente de la transcripción IA cuando ese sea el requerimiento.

Guardar:
- original;
- corregido;
- reporte de cambios.

El glosario debe ser específico por cliente.

## Text+ fallback

Si captions nativos no son editables por API:
- conservar caption nativo;
- crear Text+ plantilla;
- duplicar por tiempo;
- setear texto;
- validar;
- ocultar/eliminar nativo solo después.
