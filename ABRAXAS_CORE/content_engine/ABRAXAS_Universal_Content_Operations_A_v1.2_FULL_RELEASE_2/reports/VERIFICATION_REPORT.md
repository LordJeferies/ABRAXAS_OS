# ABRAXAS A v0.9.5 · Replacement R2 Verification

## Evidencia final
- JavaScript syntax: PASS.
- Runtime Node smoke: PASS.
- Release/regression suite: 101/101 PASS.
- Prompt Quality Audit: 548 prompts, minimum 100/100, average 100/100, median 100/100, minimum 324 words.
- Prompt Strict Scan: 548 prompts, 0 short prompts, 0 placeholder hits.
- Standalone HTML build: PASS.
- Visual reference audit: `VISUAL_REFERENCE_AUDIT.md` incluye Apple, CleanMyMac, Dala, Refero y Ainsley; Apple sigue gobernando la interfaz.

## Regresiones nuevas cubiertas
- El Arquitecto responde sin rerender global para intents/preguntas locales.
- Home contiene router por intención + campo animado ABRAXAS.
- Menú global superior izquierdo existe en todo el shell.
- Branding Method tiene entrada genérica y aplicada.
- Branding aplicado consume contexto real del cliente.
- Story typography reducida y sin el antiguo máximo 118px en el bloque R2.
- Rails tienen controles y los capítulos pueden desplegar contexto.
- Clients y Roadmap incluyen interacción adicional además del texto lineal.

## Limitación visual automatizada
El entorno no proporciona una inspección perceptual de navegador fiable por el problema ya documentado de Chromium/DBus/zygote. Por eso la revisión visual final debe hacerse en el navegador real del usuario; el build incluye tests de contratos de layout/interacción, no una afirmación de similitud perceptual automática.
