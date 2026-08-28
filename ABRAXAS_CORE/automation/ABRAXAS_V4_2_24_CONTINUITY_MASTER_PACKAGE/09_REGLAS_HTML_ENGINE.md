# Reglas de los HTML Engine

Los HTML contienen un `<script id="editorialData">` canónico. La actualización es aditiva:

- Content Engine recibe `ai_motion_map_v4_2_24`, hard gates corregidos, estado de los delivery parts antiguos y panel de revisión.
- Intro Lab recibe `intro_lab_policy_v4_2_24`, versión V7 y panel protegido.
- Los arrays editoriales existentes conservan IDs, texto, source ranges y orden.
- El panel funciona localmente sin servidor ni dependencia de red.
- El mapa visible en el HTML debe coincidir con `FINAL_AI_MOTION_MAP_V4_2_24.json`.

Archivos finales: `HTML/JOC55_AMANDA_CONTENT_ENGINE_V4_2_24.html` y `HTML/JOC55_AMANDA_INTRO_LAB_V4_2_24.html`.

