# AI Roundtrip

ABRAXAS debe funcionar:
- sin IA;
- con IA externa;
- con IA integrada futura.

## Logical Engine

Coverage
Structure
Cadence
Rules
Validation
Impact
State
Dependencies
Prompt assembly

no requieren LLM.

## External AI

1. YOD compila AI Job.
2. He muestra COPY PROMPT.
3. Usuario usa IA externa.
4. Importa respuesta.
5. Parser + validator.
6. Preview diff.
7. Aceptar/revisar/rechazar.
8. Solo lo aceptado actualiza Lienzo.

## Internal AI

Mismo contrato, provider distinto.

Un resultado de IA nunca crea una pieza desconectada.
Vuelve al mismo content_id.
