# Assets · local / online

Patrón canónico: `assets/{client_id}/{content_id}/{asset_group}/{filename}`.

Local: guarda el archivo en la ruta prevista o impórtalo al slot mediante la UI. Online futuro: la misma ruta funciona como logical key para object storage/CDN. La URL física puede cambiar sin cambiar `content_id` ni `slotId`.
