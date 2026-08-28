# Dockable / Resizable / Detachable Workspace

## Requisito
VAV debe permitir un flujo tipo workstation de escritorio:
- ensamblar paneles;
- cambiar tamaños;
- mover paneles;
- sacar paneles a ventana independiente;
- mantener todo dentro del mismo proyecto/app.

## Uso esperado
- editor principal con preview + timeline + caption document + inspector;
- preview a pantalla separada/segundo monitor;
- caption document separado para corrección intensiva;
- inspector desacoplado en trabajos avanzados.

## Persistencia
Guardar layout en JSON serializado por usuario/proyecto.
Debe existir botón `Reset layout`.

## Implementación recomendada
React + Desktop workspace layout manager.
Puede usarse una librería docking open-source o una capa propia, pero el
contrato de layout debe ser interno y estable.
