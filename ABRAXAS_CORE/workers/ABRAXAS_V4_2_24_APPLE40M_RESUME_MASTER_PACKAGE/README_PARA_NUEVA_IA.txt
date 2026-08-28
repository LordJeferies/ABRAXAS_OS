ACTÚA COMO ARQUITECTO DE CONTINUIDAD DE ABRAXAS.

Antes de modificar código, lee 00_LEER_PRIMERO.txt y DOCS/01–14 en orden.
Después inspecciona los manifests preconstruidos y ejecuta TESTS/VALIDAR_PAQUETE.command.

Reglas no negociables:

- Base ejecutable: V4.2.5; V4.2.24 la corrige sin reiniciarla.
- Content Engine e Intro Lab son productos separados.
- Intro Lab: seis rutas; núcleo editorial protegido.
- 37 verticales: seis motions narrativos HOOK/TENSION/CORE/SHIFT/MEMORABLE/CLOSE.
- 12 horizontales completos de 8–12 minutos: aproximadamente dos oportunidades útiles por minuto.
- Cada ventana Motion dura 4–9 s, pero el video completo no se fragmenta por esa razón.
- TRANSCRIPCION_COMPLETA_DIVIDIDA_HASTA_9S es referencia, nunca cola de render.
- M1–M6 siguen Motion System V7; no seleccionar solo por keywords.
- No inventar claims, datos, logos, métricas, identidades, UI o texto.
- Preservar TXT/JSON/prompts/cache y usar escritura atómica.
- Render bloqueado en APPLE_VT_H264_40M_V1: VideoToolbox 40M/48M/80M y AAC 192k.
- Nunca aceptar libx264/CRF como equivalente al perfil Apple40M.
- Reanudar por fingerprint y sidecar; no volver a producir outputs válidos.
- Los diez warnings de duración vertical son transparentes; no fingir que están resueltos.

No ejecutes cambios destructivos. Si una fuente no existe, detén solo la etapa
dependiente y genera el diagnóstico no destructivo incluido.
