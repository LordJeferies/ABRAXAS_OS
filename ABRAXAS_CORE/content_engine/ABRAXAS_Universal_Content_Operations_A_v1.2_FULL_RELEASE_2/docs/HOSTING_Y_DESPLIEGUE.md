# ABRAXAS v0.9.3 · Offline y online

## Offline
1. Copia `ABRAXAS_Universal_Content_Operations_A_v0.9.3.html` a una carpeta local.
2. Haz doble clic o abre con un navegador moderno.
3. Los datos de sesión/edición usan almacenamiento del navegador; mantén respaldos/exportaciones.
4. Para assets locales avanzados, sirve la carpeta con un servidor local si el navegador restringe File System APIs desde `file://`.

Servidor local simple:
```bash
cd /ruta/de/abraxas
python3 -m http.server 8080
```
Abre `http://localhost:8080/ABRAXAS_Universal_Content_Operations_A_v0.9.3.html`.

## Hosting estático
El standalone no requiere backend.
1. Sube el HTML a la carpeta pública (`public_html`, `www` o equivalente).
2. Renómbralo a `index.html` si será la raíz.
3. Activa HTTPS.
4. Configura cache corto durante pruebas y largo después de validar.
5. Revisa localStorage/IndexedDB por dominio: los datos guardados en `file://` no migran automáticamente al dominio.

## Netlify / Cloudflare Pages / Vercel static
Crea un proyecto sin build command y usa la carpeta que contiene el HTML como publish directory. Si quieres usar el source modular, ejecuta primero `python3 scripts/build.py` y publica el standalone resultante.

## Online multiusuario futuro
v0.9.3 A no implementa auth/sync multiusuario. Esa capacidad pertenece a ABRAXAS C/P10. No simularla con localStorage compartido.
