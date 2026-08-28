# REGLAS PARA DEBUG Y HOTFIX

Ante un traceback:
1. leerlo completo;
2. identificar capa;
3. reproducir mínimo;
4. inspeccionar API/archivo real;
5. formular una hipótesis;
6. probar un cambio;
7. verificar;
8. solo entonces aplicar al lote.

Capas:
- parser;
- manifest;
- FFmpeg;
- audio;
- MLX;
- DaVinci launcher;
- DaVinci API;
- Media Pool;
- timeline;
- captions;
- Text+;
- render;
- filesystem.

Si hubo 3 hotfixes fallidos sobre la misma arquitectura, detenerse y cambiar arquitectura.

Cada hotfix debe contener:
- instalador;
- backup;
- payload completo;
- verificador;
- instrucciones;
- checksum;
- changelog.
