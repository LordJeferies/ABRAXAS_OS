# ABRAXAS v1.2 · LOCAL vs WEB

## LOCAL
- Un HTML standalone.
- `file://` sin CDN o secretos.
- Estado local.
- Export/import manual de prompts, JSON, manifests y assets.
- Automation Bridge entregado como archivos ejecutables/plantillas fuera del navegador.

## WEB
- `index.html` + CSS + JS modular + assets + manifest + service worker.
- Preparado para hosting estático/PWA.
- Mantiene el mismo dominio y UI.
- Backend, auth, sync y LLM remoto siguen siendo extensiones futuras: no se simulan en frontend.

## Regla
Nunca introducir una capacidad cloud en LOCAL si requiere exponer una API key o rompe el funcionamiento offline.
