# Apple Guidance — Adaptación correcta para VAV Desktop

Fuentes:
https://developer.apple.com/design/
https://developer.apple.com/design/human-interface-guidelines/
https://developer.apple.com/design/resources/

Adoptar:
- jerarquía familiar;
- colores semánticos;
- tipografía del sistema;
- toolbar concisa;
- sidebar;
- ventanas resizables;
- productividad con teclado;
- estados de foco;
- material/translucencia con propósito;
- iconografía consistente;
- motion que comunica estado.

Adaptar, no copiar literalmente:

## Safe Areas iPhone
Dynamic Island/Home Indicator no aplican al desktop actual.
Reservar correctamente title bar, toolbar, rail, inspector y resize zones.

## 44 pt
Es referencia de touch.
Desktop de precisión puede usar 32–36 px densos y 36–40 primarios.
Con pointer coarse: >=44 px.

## Bottom Tab Bar
No usar en desktop.
VAV usa rail/sidebar leading.

## Dynamic Type
macOS no usa iOS Dynamic Type del mismo modo.
Aun así evitar alturas frágiles y clipping.

## SF Pro / SF Symbols
Usar system-ui.
NO incluir archivos SF Pro.
Lucide será el set cross-platform.
SF Symbols queda como referencia de comportamiento/consistencia.

## Haptics
No es requisito desktop actual.

## Sheets/gestures
Usar el modelo conceptual de jerarquía/modal, pero con dialogs/popovers/menu
desktop apropiados.
