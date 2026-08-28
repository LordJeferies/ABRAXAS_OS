# ABRAXAS v1.1.3 · Visual Fidelity Gate

Cada módulo actualizado es incompleto si solo “funciona”. Debe pasar el gate funcional y perceptual contra Interface System 3.0.

## Gate por módulo

- **Anatomía visual:** ¿la pantalla usa el patrón correcto (Story, Workspace o Explorer) y no una grilla SaaS genérica?
- **Jerarquía:** ¿se entiende en menos de cinco segundos dónde estoy, qué importa y qué hago después?
- **Densidad:** ¿la cantidad de información corresponde al rol y al trabajo actual?
- **Spacing:** ¿usa tokens del sistema y mantiene respiración/compactación coherentes?
- **Motion:** ¿cada animación explica relación espacial, progreso, selección o cambio de estado?
- **Empty:** ¿el estado vacío explica qué aparecerá aquí y ofrece una siguiente ruta útil?
- **Loading:** ¿las operaciones conceptualmente pesadas muestran las fases que ABRAXAS está resolviendo?
- **Success:** ¿se resume qué cambió y cuál es la siguiente acción?
- **Error:** ¿el sistema preserva datos, explica qué falló y ofrece retry/mapear/cancelar?
- **Responsive:** ¿el módulo mantiene su tarea principal en desktop/tablet/mobile sin overflow o texto superpuesto?
- **Keyboard:** ¿navegación, Command Palette, foco y acciones críticas son operables sin mouse?
- **Reduced Motion:** ¿`prefers-reduced-motion` elimina motion continuo y conserva el estado final legible?
- **Performance:** ¿no hay jank perceptible, layout shift evitable ni efectos caros fuera del viewport?

## Surface contracts

### Story Mode
Home, Clients, Brand Intelligence y Roadmap. Hero funcional, highlights, closer-look, sticky showcase, capítulos, narrativa y motion editorial. La sidebar no compite con el story.

### Workspace Mode
He, Shim, AI Results, Content Studio, Production, Calendar y QA. Herramienta protagonista, acción primaria, estado claro, inspector contextual y feedback inmediato.

### Explorer Mode
Library, Assets y Format Explorer. Search, filtros, vistas, grid/list, preview y contexto persistente.

## Technique rule

`json/TECHNIQUE_REGISTRY_v1.1.3.json` es el contrato auditable. Una técnica solo se considera aplicada si tiene propósito, ubicación, fallback, Reduced Motion y Performance budget definidos. No se aprueba “glass everywhere”, parallax ornamental, cursor personalizado que reemplace el cursor nativo ni WebGL obligatorio para una tarea operativa.
