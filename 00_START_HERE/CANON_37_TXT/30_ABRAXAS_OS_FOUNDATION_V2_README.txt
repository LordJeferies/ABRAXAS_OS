# ABRAXAS OS — Foundation V2

Este documento consolida la arquitectura y criterio actual para la siguiente etapa de ABRAXAS OS.

## Principio rector

ABRAXAS convierte criterio en infraestructura.

No reconstruir el sistema desde cero. Integrar la lógica nueva al monorepo y preservar código funcional existente.

## Módulos

- **YOD**: inteligencia, memoria, clientes, estructuras, formatos, prompts, copies, planificación, oportunidad y aprendizaje.
- **Lienzo**: objeto vivo, editable, versionado y trazable de cada contenido.
- **He**: ventana operativa central. Permite ver YOD/Lienzos, organizar trabajo, editar, calendarizar, publicar y revisar métricas.
- **Shim**: análisis del material real, structure matching, gaps, candidatos y resolución contra evidencia.
- **VAV**: producción audiovisual; devuelve estados, versiones y artefactos al Lienzo.
- **Arquitecto**: presencia transversal, guía, coach, productor, director, navegador y QA.
- **Publishing**: distribución por adapters.
- **Metrics**: resultados post-publicación que He muestra y YOD aprende.

## Regla de autoridad

Cuando haya conflicto:

1. decisión explícita más reciente aprobada;
2. código funcional actual;
3. canon/foundation nuevo;
4. referencias actuales;
5. histórico funcional;
6. beta/legacy.

No perder material histórico: clasificarlo.
No reintroducir lógica antigua si existe un criterio actual mejor.
