# Prompt Intelligence Canon V2

Un prompt ABRAXAS es una especificación de producción.

## Bloques

ROLE
OBJECTIVE
CONTEXT
INPUTS
WHAT_IT_IS
WHAT_IT_IS_NOT
STRUCTURE
CLIENT_RULES
FORMAT_RULES
PLATFORM_RULES
EVIDENCE
RESTRICTIONS
NEGATIVES
OUTPUT_CONTRACT
ACCEPTANCE_CRITERIA
QA
HANDOFF
CONTINUITY

## Prompt Compiler

PROMPT =
CORE_ROLE
+ TASK_PRESET
+ CLIENT_CORE
+ LIENZO
+ FORMAT
+ STRUCTURE
+ PLATFORM
+ VISUAL/MOTION/COPY PRESET
+ EVIDENCE
+ NEGATIVES
+ OUTPUT_SCHEMA
+ QA

## Reglas

- Todo preset importante declara qué es y qué no es.
- Cuando se espera estructura, pedir estructura.
- Preferir JSON/schema cuando el resultado volverá al sistema.
- Guardar preset/version/client core version/Lienzo version/provider/input hash/output/accepted fields/human edits.
- El prompt debe ser detallado cuando el criterio lo exige, no por longitud arbitraria.
