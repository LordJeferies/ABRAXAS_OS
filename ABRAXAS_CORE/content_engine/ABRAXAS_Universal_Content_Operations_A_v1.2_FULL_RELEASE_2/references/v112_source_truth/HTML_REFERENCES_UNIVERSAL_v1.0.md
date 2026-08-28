# HTML REFERENCES — Biblioteca Universal de 41 Técnicas Web v1.0

> Sistema de decisión y ejecución para crear diferentes tipos de páginas y aplicaciones web. La IA debe seleccionar las técnicas adecuadas según el objetivo, el público, la marca, el contenido, la arquitectura y las restricciones del proyecto.
>
> Sirve para landings, webs corporativas, páginas de servicios, e-commerce, portfolios, sitios editoriales, SaaS, dashboards, herramientas internas, CMS y experiencias inmersivas.
>
> Regla principal: **no aplicar todas las técnicas**. Una solución sencilla, coherente y rápida es superior a una acumulación de efectos.

---

## Índice

1. [Cómo consumir esta biblioteca](#parte-a--prompt-universal-para-consumir-la-biblioteca)
2. [Principios aprendidos de peticiones y resultados](#principios-aprendidos-de-peticiones-y-resultados)
3. [Bloque 1 — Fundamentos](#bloque-1--fundamentos-de-arquitectura-y-desarrollo-profesional)
4. [Bloque 2 — Experiencia visual](#bloque-2--efectos-de-impacto-y-experiencia-visual)
5. [Bloque 3 — Sistemas de producto y aplicaciones](#bloque-3--sistemas-de-producto-y-aplicaciones-web)
6. [Bloque 4 — Técnicas detectadas en las referencias visuales](#bloque-4--técnicas-detectadas-en-las-referencias-visuales)
7. [Perfiles de aplicación rápida](#perfiles-de-aplicación-rápida)
8. [Matriz final de selección](#matriz-final-de-selección)
9. [Fidelity Gate Universal](#fidelity-gate-universal)

---

# PARTE A — Prompt universal para consumir la biblioteca

## Rol

Actúa como Lead Product Designer, UX Architect, Creative Technologist, CRO Strategist e Ingeniero Frontend Principal. Diseña la solución adecuada para el proyecto real: no impongas una estética, framework o efecto antes de comprender el negocio y la petición.

Si el usuario proporciona referencias visuales —Apple, Awwwards, una agencia, una tienda, una aplicación o cualquier otra— analiza sus principios de composición, interacción y motion. No copies marcas, assets ni layouts píxel por píxel.

Recibirás:

1. Una petición del usuario.
2. Esta biblioteca universal de 41 técnicas.
3. Cuando existan, archivos, referencias visuales, datos y restricciones del proyecto.

Tu tarea es convertir la petición en requisitos, identificar el tipo de web y seleccionar únicamente las técnicas que aportan valor medible. No debes aplicar todas por defecto.

## Ficha universal del proyecto

Antes de proponer diseño o código, completa esta ficha con la información disponible. Pregunta solo por datos que cambien materialmente la solución.

```javascript
const projectProfile = {
  projectName: 'Nombre del proyecto',
  pageType: 'landing | corporate | services | ecommerce | portfolio | editorial | saas | dashboard | webapp | immersive',
  businessGoal: 'Resultado comercial u operativo esperado',
  targetAudience: 'Cliente o usuario principal',
  problemToSolve: 'Problema real que la página debe resolver',
  primaryAction: 'Acción principal que debe realizar el usuario',
  secondaryActions: [],
  contentSource: 'config | cms | api | database | static-files',
  environment: 'static | app | hybrid | cms',
  startView: 'home',
  brand: {
    personality: [],
    colors: {},
    typography: {},
    visualAssets: [],
    references: []
  },
  constraints: {
    offline: false,
    accessibilityLevel: 'WCAG-AA',
    performanceTarget: 'Core Web Vitals',
    browserSupport: 'modern',
    editableByNonDeveloper: false
  }
};
```

## Protocolo obligatorio

### Paso 1 — Separar peticiones, resultados y correcciones

Convierte la petición en requisitos verificables:

- objetivo del usuario;
- resultado esperado;
- superficie afectada;
- entorno de ejecución;
- funciones que deben conservarse;
- cambios solicitados;
- restricciones explícitas;
- errores de resultados anteriores que no deben repetirse.

Si existe historial, separa:

- **Petición:** lo que el usuario pidió.
- **Resultado:** lo que se produjo.
- **Corrección:** lo que el usuario indicó que faltaba o estaba mal.

Convierte las correcciones en requisitos de aceptación. Si una respuesta anterior contradice una petición explícita, gana la petición más reciente. No reduzcas contexto para simplificar artificialmente el resultado.

### Paso 2 — Clasificar el tipo de página

| Tipo | Objetivo habitual | Prioridad de diseño |
|---|---|---|
| Landing de conversión | Captar leads o vender una oferta | Claridad, prueba, CRO, velocidad y CTA |
| Corporativa / servicios | Transmitir confianza y generar contacto | Autoridad, arquitectura de información y casos |
| E-commerce | Descubrimiento y compra | Catálogo, filtros, ficha, confianza y checkout |
| Portfolio / agencia | Demostrar criterio y trabajo | Storytelling, proyectos y dirección visual |
| Editorial / contenido | Facilitar lectura y descubrimiento | Jerarquía, navegación, búsqueda y rendimiento |
| SaaS / web app | Completar tareas y retener usuarios | Estado, onboarding, flujos y feedback |
| Dashboard / herramienta interna | Operar con precisión | Densidad controlada, accesibilidad y eficiencia |
| Experiencia inmersiva | Impactar y explorar | Dirección artística, WebGL y fallback accesible |

### Paso 3 — Detectar el entorno técnico

| Etiqueta | Entorno | Contrato técnico |
|---|---|---|
| 🟢 STATIC | HTML/CSS/Vanilla JS, local o hosting estático | Sin framework obligatorio. Rutas correctas, progressive enhancement y dependencias mínimas. |
| 🔵 APP | React/Next.js, Vue/Nuxt, SvelteKit u otro framework | Componentes, estado, routing, servicios seguros y render adecuado. |
| 🟣 HYBRID | Astro/Vite/SSG/Jamstack | Contenido pre-renderizado, islands e hidratación selectiva. |
| 🟠 CMS | WordPress, Shopify, Webflow o headless CMS | Respetar theme, editor, bloques, plugins y contenido administrable. Nunca editar el core. |

Si el entorno no está definido, recomienda el más simple que cumpla el objetivo. Una landing no necesita convertirse automáticamente en SPA. Nunca introduzcas claves privadas o secretos en el frontend.

**Regla 🟠 CMS:** cuando una técnica no incluya una variante CMS explícita, tradúcela a bloques, secciones, componentes o snippets del theme. Los textos, imágenes, colores contextuales y opciones deben quedar editables. No modificar el core de WordPress/Shopify ni depender de código que el editor elimine al guardar.

### Paso 4 — Clasificar la superficie y el nivel de motion

| Superficie | Ejemplos | Comportamiento |
|---|---|---|
| **NARRATIVE / MARKETING** | Landing, Home, producto, servicio, caso de estudio | Storytelling, ritmo editorial y motion seleccionado. |
| **EDITORIAL / DISCOVERY** | Blog, portfolio, biblioteca, catálogo | Legibilidad, búsqueda, filtros y navegación contextual. |
| **COMMERCE** | Categoría, ficha de producto, carrito | Confianza, comparación, precio, disponibilidad y conversión. |
| **WORKSPACE / APPLICATION** | Dashboard, wizard, editor, panel administrativo | Calm-first, cursor nativo, feedback, eficiencia y progressive disclosure. |

### Paso 5 — Seleccionar técnicas

Selecciona pocas técnicas bien integradas. Para cada una indica:

- número y nombre;
- problema que resuelve;
- por qué es adecuada para esta petición;
- costo o riesgo técnico;
- degradación para `prefers-reduced-motion`, móvil u offline cuando corresponda.

### Paso 6 — Generar y validar

Genera código de producción siguiendo los patrones “✅ BIEN” y evitando los “❌ MAL”. Conserva datos y lógica funcional que el usuario no haya autorizado cambiar. Finaliza con el Fidelity Gate Universal marcado.

## Las 9 reglas transversales

1. **La petición y el objetivo ganan:** las referencias inspiran; los requisitos, la marca y el usuario real deciden.
2. **El sistema de marca gana sobre la tendencia:** no imponer dark mode, glass, neón, Apple-like o Awwwards si contradicen la identidad.
3. **Reduced motion obligatorio:** toda animación debe ofrecer una rama estática o reducida.
4. **Navegación adecuada al entorno:** una web multipágina puede usar enlaces reales; una aplicación puede usar routing/estado. No imponer zero-reloads si perjudica SEO, resiliencia o simplicidad.
5. **Bootstrap controlado:** primero se definen datos, módulos y renderizadores; después se ejecuta un arranque explícito.
6. **Motion según superficie:** expresivo en narrativa; mínimo y funcional en herramientas.
7. **Materiales con propósito:** glass, blur, sombras y 3D se usan donde comunican jerarquía o estado, no sobre cada bloque.
8. **Claridad antes que efecto:** una técnica se elimina si compite con contenido, conversión, rendimiento o accesibilidad.
9. **Una fuente de verdad:** contenido, estado, tokens y configuración no se duplican innecesariamente.

## Jerarquía para resolver conflictos

1. Petición y restricciones explícitas del usuario.
2. Objetivo comercial u operativo.
3. Necesidades del público y accesibilidad.
4. Contenido y sistema de marca.
5. Entorno técnico y capacidad de mantenimiento.
6. Referencias visuales seleccionadas.
7. Tendencias y efectos.

## Formato de salida esperado de la IA

1. Petición interpretada como requisitos.
2. Entorno detectado y razón.
3. Superficie y nivel de motion permitido.
4. Técnicas seleccionadas con justificación.
5. Arquitectura propuesta.
6. Código completo y listo para producción.
7. Pruebas realizadas o plan de verificación.
8. Fidelity Gate Universal marcado.

---

## Principios aprendidos de peticiones y resultados

Estos principios evitan que una IA entregue un resultado visualmente atractivo pero incorrecto, incompleto o difícil de reutilizar.

| Problema detectado | Regla universal | Impacto en el resultado |
|---|---|---|
| Aplicar todas las técnicas | Seleccionar solo lo necesario y justificar cada elección. | Menos ruido, mejor rendimiento y mantenimiento. |
| Copiar la estética de una referencia | Extraer principios sin copiar identidad, contenido o layout exacto. | Resultado propio y coherente con la marca. |
| Cambiar colores sin cambiar anatomía | Revisar arquitectura de información, jerarquía y flujo antes del estilo. | La mejora deja de ser cosmética. |
| Resumir hasta perder contexto | Mantener explicación suficiente, ejemplos y anti-patrones. | La biblioteca puede ejecutarse sin adivinar requisitos. |
| Imponer una SPA o framework | Elegir el entorno más simple que cumpla el objetivo. | Menos complejidad y costo técnico. |
| Añadir animación a herramientas | Separar narrativa de workspace. | La interfaz operativa mantiene precisión. |
| Hardcodear contenido y marca | Centralizar datos y tokens. | La misma técnica se adapta a diferentes proyectos. |
| Romper funcionalidad existente | Modificar solo la capa autorizada y verificar regresiones. | Se conservan datos, integraciones y procesos. |
| Ignorar estados y errores | Diseñar vacío, carga, éxito, error y recuperación. | La experiencia funciona fuera del camino ideal. |
| Dependencia crítica sin fallback | Incorporar degradación accesible u offline según el proyecto. | La web sigue siendo usable si falla una librería o dispositivo. |

---

# PARTE B — Biblioteca universal de las 41 técnicas

# BLOQUE 1 — Fundamentos de arquitectura y desarrollo profesional

Estas técnicas son los cimientos. Si fallan, los efectos visuales solo ocultarán una aplicación inestable.

---

## 1. Animaciones avanzadas con GSAP

### En qué consiste

GSAP es un motor de animación JavaScript orientado a secuencias complejas, timelines, easings físicos y animaciones vinculadas al scroll. Permite coordinar entradas, salidas y transformaciones con mayor control que una colección dispersa de `@keyframes`.

### Por qué eleva la calidad

Una experiencia premium depende del ritmo. GSAP permite iniciar una animación mientras otra está terminando, sincronizar escenas con `ScrollTrigger`, pausar o revertir secuencias y mantener una curva de movimiento coherente.

### Cuándo usarla

- Hero, product story, reveals, morphs y transiciones de vista.
- Cuando varios elementos deben entrar con una coreografía común.
- No usar por defecto para estados simples que CSS resuelve mejor, como `hover` de color.

### Prompt por entorno

- 🟢 STATIC: “Usa `gsap.timeline()` para Hero y `ScrollTrigger` para escenas ligadas al scroll. Incluye fallback estático si GSAP no está disponible offline. Registra plugins una sola vez.”
- 🔵 APP: “Usa `@gsap/react` y `useGSAP({ scope })`. Limpia timelines al desmontar y evita `useEffect` crudo que duplique animaciones en Strict Mode.”
- 🟣 HYBRID: “Carga GSAP solo en la island interactiva. No hidrates toda la página por una animación local.”

### ✅ Código bien hecho

```javascript
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && window.gsap) {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.1 } });
  tl.from('.hero-title', { y: 48, opacity: 0 })
    .from('.hero-copy', { y: 28, opacity: 0 }, '-=0.72')
    .from('.hero-cta', { y: 16, scale: 0.96, opacity: 0 }, '-=0.68');
}
```

### ❌ Código mal hecho

```css
.hero-title,
.hero-copy,
.hero-cta { animation: fade-up 1s ease-in-out; }

@keyframes fade-up {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Problema:** todos los elementos arrancan sin orquestación, no existe control de cleanup y la secuencia no puede sincronizarse con el scroll.

### Nota de adaptación

El movimiento debe salir del elemento que lo origina. En workspaces, reduce duración, distancia y cantidad; nunca conviertas un wizard en una demo de animación.

---

## 2. Arquitectura Data-Driven

### En qué consiste

Separa contenido, configuración y datos de la estructura HTML/CSS. En local, `window.siteConfig` concentra textos, rutas, colores y configuración editable. En arquitecturas con build, los datos viven en archivos o servicios tipados.

### Por qué eleva la calidad

Evita buscar textos entre miles de líneas y reduce el riesgo de romper la interfaz al actualizar contenidos. También permite tematización por cliente, render reutilizable y validación de datos.

### Cuándo usarla

- Siempre que exista contenido repetido, múltiples clientes, casos de estudio o herramientas configurables.
- Cuando la persona que edita contenido no debe tocar la maquetación.

### Prompt por entorno

- 🟢 STATIC: “Declara `window.siteConfig` antes del render. El body contiene slots y templates; un renderizador seguro consume la configuración durante el bootstrap.”
- 🔵 APP: “Usa TypeScript, esquema de validación y componentes que reciben props. No mezcles copy de cliente con JSX estructural.”
- 🟣 HYBRID: “Mantén contenido en `/src/data` o content collections y pasa solo los datos necesarios a cada island.”

### ✅ Código bien hecho

```html
<script>
window.siteConfig = {
  identity: { base: '#ffffff', text: '#17181b', primary: '#5b5bd6', accent: '#f59e0b' },
  hero: {
    eyebrow: 'NOMBRE DEL PROYECTO · Propuesta principal',
    title: 'Convierte señales dispersas en decisiones claras.',
    cta: { label: 'Comenzar', view: 'primary-flow' }
  }
};
</script>

<main id="app"></main>
<script>
function renderHero(config) {
  const title = document.createElement('h1');
  title.textContent = config.hero.title;
  document.getElementById('app').replaceChildren(title);
}
</script>
```

### ❌ Código mal hecho

```html
<section class="client-card"><h2>Cliente A</h2></section>
<section class="client-card"><h2>Cliente B</h2></section>
<section class="client-card"><h2>Cliente C</h2></section>
```

**Problema:** contenido quemado, duplicación y ausencia de una fuente única de verdad.

### Nota de adaptación

Los colores de campañas, categorías o clientes pertenecen a sus contextos. El shell global mantiene la identidad principal del proyecto.

---

## 3. Optimización CRO, ganchos de retención y alineación de marca

### En qué consiste

Integra CRO y copywriting desde la arquitectura visual. Sustituye saludos genéricos por una promesa, tensión o problema específico; alinea la jerarquía, el espacio y el CTA con esa idea. Aquí se conserva la técnica original de **Alineación de Marca mediante Ganchos de Alto Impacto**, que no debe perderse al añadir gestión de estado.

### Por qué eleva la calidad

La técnica conecta forma y mensaje. Un diseño atractivo no convierte si el H1 es genérico, el CTA compite con cinco acciones o el contenido no comunica autoridad en los primeros segundos.

### Cuándo usarla

- Landing pages, Home, onboarding, casos de estudio y módulos de decisión.
- No convertir workspaces internos en páginas agresivas de venta.

### Prompt universal

“Define primero la promesa, el problema y la acción primaria. Prohíbe Lorem Ipsum. Escribe un gancho específico de contradicción, dolor o resultado; una prueba o explicación breve; y un CTA directo. La jerarquía visual debe conducir hacia una sola acción primaria. Conserva la voz definida en `projectProfile.brand`.”

### ✅ Código bien hecho

```html
<header class="hero-copy">
  <p class="eyebrow">Estrategia de crecimiento</p>
  <h1>Tu negocio no necesita más ruido. Necesita una ruta clara para convertir.</h1>
  <p>Conectamos oferta, mensaje y experiencia para llevar al usuario hacia una decisión concreta.</p>
  <button type="button" data-action="start-analysis">Descubrir la solución</button>
</header>
```

### ❌ Código mal hecho

```html
<h1>Bienvenido a nuestra plataforma</h1>
<p>Somos una solución innovadora para todas tus necesidades.</p>
<button>Ver más</button>
<button>Conócenos</button>
<button>Contáctanos</button>
```

### Nota de adaptación

El copy de autoridad debe ser claro, no grandilocuente. Una acción primaria por escena o paso. Los “50 ganchos” son una fuente de patrones, no texto para pegar sin contexto.

---

## 4. Rendimiento, carga diferida y prevención de CLS

### En qué consiste

Reserva dimensiones para imágenes, videos, canvases y embeds; prioriza el contenido crítico; difiere recursos secundarios; y evita ejecutar efectos pesados fuera del viewport.

### Por qué eleva la calidad

La estabilidad visual es parte de la percepción premium. Si el contenido salta, las fuentes parpadean o el canvas bloquea la interacción, el diseño pierde credibilidad aunque sea atractivo.

### Cuándo usarla

- Siempre. Es un requisito transversal.

### Prompt por entorno

- 🟢 STATIC: “Define `width`, `height` o `aspect-ratio`; usa `loading='lazy'` y `decoding='async'` en media no crítica. Mantén recursos por rutas relativas y no bloquees el bootstrap.”
- 🔵 APP: “Usa `next/image`, preload selectivo y dynamic import para módulos pesados.”
- 🟣 HYBRID: “Usa optimización de assets de Astro y `client:visible` para islas no críticas.”

### ✅ Código bien hecho

```html
<figure class="media-frame" style="aspect-ratio: 16 / 9">
  <img
    src="assets/client-case.webp"
    width="1280"
    height="720"
    loading="lazy"
    decoding="async"
    alt="Vista del caso de estudio"
  >
</figure>
```

### ❌ Código mal hecho

```html
<div><img src="assets/client-case.png" alt=""></div>
```

### Nota de adaptación

Todo canvas, sistema de partículas o visual generativo debe ajustar densidad según rendimiento, viewport y `devicePixelRatio`; nunca debe bloquear la interacción principal.

---

## 5. Gestión de estado reactiva

### En qué consiste

La interfaz se deriva de un estado central. El estado contiene vista activa, paso, paneles, última tarea, contexto del asistente y preferencias; los controles mutan estado y un renderizador sincroniza la UI.

### Por qué eleva la calidad

Evita lógica dispersa en `onclick`, clases inconsistentes y estados imposibles. Es la columna vertebral de una SPA zero-reloads con Home, workspaces y ventanas contextuales.

### Cuándo usarla

- Aplicaciones con más de una vista o flujo.
- Recomendada para navegación compleja, wizards y asistentes contextuales.

### Prompt por entorno

- 🟢 STATIC: “Usa un `Proxy` y un `renderUI(changes)` central. Persiste solo preferencias y `lastWorkspace` en `localStorage`; al iniciar, muestra Home.”
- 🔵 APP: “Usa Zustand con selectores pequeños y acciones explícitas. Separa estado de UI, datos remotos y formularios.”
- 🟣 HYBRID: “Usa Nano Stores para estado compartido entre islands. No hidrates componentes estáticos.”

### ✅ Código bien hecho — Local

```javascript
const initialState = {
  view: 'home',
  lastWorkspace: localStorage.getItem('project:lastWorkspace'),
  wizardStep: 1,
  assistantOpen: false
};

const appState = new Proxy(initialState, {
  set(target, key, value) {
    if (Object.is(target[key], value)) return true;
    target[key] = value;
    if (key === 'view' && value !== 'home') {
      target.lastWorkspace = value;
      localStorage.setItem('project:lastWorkspace', value);
    }
    renderUI({ key, value });
    return true;
  }
});
```

### ✅ Código bien hecho — Cloud

```javascript
import { create } from 'zustand';

export const useAppStore = create((set) => ({
  view: 'home',
  wizardStep: 1,
  assistantOpen: false,
  setView: (view) => set({ view }),
  nextStep: () => set((state) => ({ wizardStep: state.wizardStep + 1 }))
}));
```

### ❌ Código mal hecho

```javascript
document.getElementById('open-tool').onclick = () => {
  document.getElementById('home').style.display = 'none';
  document.getElementById('tool').style.display = 'block';
  document.getElementById('nav-home').classList.remove('active');
  document.getElementById('nav-tool').classList.add('active');
};
```

### Nota de adaptación

En una aplicación, recordar el último workspace no obliga a abrirlo automáticamente. Define este comportamiento según onboarding, frecuencia de uso y expectativa del usuario.

---

# BLOQUE 2 — Efectos de impacto y experiencia visual

Estas técnicas se aplican principalmente en **story mode**. En workspaces se desactivan o reducen, salvo que resuelvan una función concreta.

---

## 6. Smooth Scroll con Lenis

### En qué consiste

Lenis suaviza la relación entre el input de rueda/touchpad y el desplazamiento, y puede sincronizarse con GSAP para mantener coherencia entre scroll y animación.

### Por qué eleva la calidad

En una narrativa extensa reduce la sensación de tirones y hace que sticky scenes, reveals y morphs respondan con un ritmo continuo.

### Cuándo usarla

- Story mode en escritorio cuando aporta continuidad.
- No usar dentro de wizards, campos, tablas extensas o superficies donde el scroll preciso es parte de la tarea.
- Desactivar en reduced motion y cuando una modal, Command Palette o asistente contextual captura el foco.

### Prompt por entorno

- 🟢 STATIC: “Inicializa Lenis una sola vez, sincronízalo con `ScrollTrigger.update` y `gsap.ticker`. Si la librería no está disponible, conserva scroll nativo.”
- 🔵🟣: “Encapsula la instancia y destrúyela al desmontar/cambiar de superficie. No crees una instancia por componente.”

### ✅ Código bien hecho

```javascript
function createStoryScroll() {
  if (!window.Lenis || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { start() {}, stop() {}, destroy() {} };
  }

  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', () => window.ScrollTrigger?.update());
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
```

### ❌ Código mal hecho

```css
html { scroll-behavior: smooth; }
```

**Problema:** no coordina escenas, puede pelear con ScrollTrigger y no ofrece control de pausa por superficie.

### Nota de adaptación

Lenis solo vive en story mode. Los workspaces usan scroll nativo para preservar precisión y accesibilidad.

---

## 7. Gestión inteligente de clips con Intersection Observer

### En qué consiste

`IntersectionObserver` detecta cuándo un video o clip entra/sale del viewport sin recalcular su posición en cada evento de scroll.

### Por qué eleva la calidad

Evita reproducir varios videos simultáneamente, reduce consumo de CPU/GPU y mantiene fluido el storytelling de clientes.

### Cuándo usarla

- Reels, demos, testimonios y casos de estudio.
- También sirve para diferir escenas pesadas o pausar canvases secundarios.

### Prompt universal

“Observa cada video con `threshold` apropiado. Al entrar, reproduce solo si está `muted` y el usuario no pidió reduced motion; al salir, pausa. Captura el rechazo de `play()` y desconecta el observer al destruir la vista.”

### ✅ Código bien hecho

```javascript
const clipObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const video = entry.target;
    if (entry.isIntersecting && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }
}, { threshold: 0.55 });

document.querySelectorAll('video[data-autoplay]').forEach((video) => {
  video.muted = true;
  video.loop = true;
  clipObserver.observe(video);
});
```

### ❌ Código mal hecho

```javascript
window.addEventListener('scroll', () => {
  document.querySelectorAll('video').forEach((video) => {
    if (video.getBoundingClientRect().top < innerHeight) video.play();
  });
});
```

### Nota de adaptación

Cada caso conserva su identidad editorial. El sistema del sitio organiza, pero no homogeniza todas las historias con el mismo color y animación.

---

## 8. Elementos 3D “Zero-Code” con Spline Viewer

### En qué consiste

Integra escenas 3D interactivas mediante `<spline-viewer>` u otro embed WebGL sin construir una escena completa en Three.js.

### Por qué eleva la calidad

Permite prototipos y renders reactivos de producto con menor esfuerzo técnico, siempre que la escena esté optimizada.

### Cuándo usarla

- Storytelling secundario, showcases o prototipos con conexión disponible.
- No usar como sustituto automático de una identidad visual propia o de contenido significativo.
- Evitar en local-first estricto si no existe un paquete/fallback offline.

### Prompt por entorno

- 🟢 STATIC: “Antes de usar Spline, confirma disponibilidad offline. Si depende de CDN, muestra fallback visual estático y no bloquees la experiencia.”
- 🔵🟣: “Carga el viewer bajo demanda, reserva `aspect-ratio`, pausa fuera del viewport y ofrece una imagen fallback.”

### ✅ Código bien hecho

```html
<div class="scene-frame" style="aspect-ratio: 16 / 9">
  <spline-viewer
    data-optional-3d
    loading="lazy"
    url="https://prod.spline.design/scene.splinecode"
    aria-label="Modelo tridimensional del producto"
  ></spline-viewer>
  <noscript><img src="assets/scene-fallback.webp" alt="Vista del producto"></noscript>
</div>
```

### ❌ Código mal hecho

```html
<spline-viewer url="https://example.com/heavy-scene.splinecode"></spline-viewer>
```

**Problema:** sin dimensiones, fallback, lazy load, control de recursos ni compatibilidad offline.

### Nota de adaptación

Si el proyecto posee un sistema visual procedural propio, Spline no debe reemplazarlo por una escena genérica.

---

## 9. Preloader cinematográfico de entrada

### En qué consiste

Una capa de entrada controla el momento en que se revela la interfaz mientras se preparan fuentes, configuración y módulos visuales críticos.

### Por qué eleva la calidad

Evita FOUT, flashes de contenido sin estilos y la aparición fragmentada del Home. También ofrece un punto seguro para inicializar el visual principal antes de mostrarlo.

### Cuándo usarla

- Solo si existe trabajo crítico real que ocultar.
- No alargar artificialmente la carga ni esperar todos los recursos secundarios.

### Prompt universal

“Crea un preloader breve con progreso real o estados honestos. Espera únicamente fuentes y recursos críticos. Inicializa el visual principal antes de revelar. Incluye timeout de seguridad y reduced motion.”

### ✅ Código bien hecho

```javascript
async function revealApplication() {
  const safetyTimeout = new Promise((resolve) => setTimeout(resolve, 2500));
  await Promise.race([document.fonts.ready, safetyTimeout]);
  initPrimaryVisual();

  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !window.gsap) {
    preloader.remove();
    return;
  }

  gsap.to(preloader, {
    yPercent: -100,
    duration: 0.8,
    ease: 'power4.inOut',
    onComplete: () => preloader.remove()
  });
}
```

### ❌ Código mal hecho

```javascript
setTimeout(() => document.querySelector('.loader').remove(), 7000);
```

### Nota de adaptación

El preloader no es una excusa para una app pesada. El bootstrap debe seguir siendo único, determinista y recuperable.

---

## 10. Parallax multicapa

### En qué consiste

Distribuye elementos en capas con velocidades distintas para simular profundidad durante el scroll.

### Por qué eleva la calidad

Cuando es sutil, crea una sensación espacial más rica que mover únicamente el fondo.

### Cuándo usarla

- Escenas editoriales con pocos elementos.
- No usar junto a otros tres efectos de profundidad en la misma escena.
- No aplicar en workspaces.

### Prompt universal

“Usa atributos `data-depth` y `ScrollTrigger` con `scrub`. Limita desplazamiento, evita listeners crudos de scroll y desactiva el efecto en reduced motion/móvil cuando comprometa legibilidad.”

### ✅ Código bien hecho

```javascript
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.utils.toArray('[data-depth]').forEach((layer) => {
    const depth = Number(layer.dataset.depth || 0);
    gsap.to(layer, {
      yPercent: depth * -12,
      ease: 'none',
      scrollTrigger: {
        trigger: layer.closest('[data-parallax-scene]'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}
```

### ❌ Código mal hecho

```javascript
window.onscroll = () => {
  document.querySelector('.background').style.transform = `translateY(${scrollY * .8}px)`;
};
```

### Nota de adaptación

Si el Home usa un sistema visual generativo, este puede morfear según el contenido; no debe limitarse a desplazarse como una capa plana.

---

## 11. Cursores magnéticos y estados de foco

### En qué consiste

Un cursor visual sigue el puntero con easing y reacciona a elementos interactivos. El efecto magnético desplaza sutilmente el control o cursor hacia el objetivo.

### Por qué eleva la calidad

Puede reforzar feedback y tactilidad en experiencias editoriales, siempre que no oculte el foco ni perjudique la precisión.

### Cuándo usarla

- Solo story mode, escritorio y `pointer: fine`.
- Nunca en formularios, tablas, wizards ni dispositivos táctiles.

### Prompt universal

“Activa cursor custom únicamente con `(pointer:fine)`, conserva focus visible de teclado, usa `gsap.quickTo` y desactívalo en workspace/reduced motion.”

### ✅ Código bien hecho

```javascript
const canUseCustomCursor = matchMedia('(pointer: fine)').matches
  && !matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canUseCustomCursor && document.body.dataset.surface === 'story') {
  const cursor = document.querySelector('[data-cursor]');
  const moveX = gsap.quickTo(cursor, 'x', { duration: 0.22, ease: 'power3' });
  const moveY = gsap.quickTo(cursor, 'y', { duration: 0.22, ease: 'power3' });
  addEventListener('pointermove', (event) => {
    moveX(event.clientX);
    moveY(event.clientY);
  }, { passive: true });
}
```

### ❌ Código mal hecho

```css
* { cursor: none !important; }
```

### Nota de adaptación

En dashboards, formularios, editores y workspaces se usa cursor nativo. La precisión es más importante que el ornamento.

---

## 12. Scroll horizontal mixto

### En qué consiste

Una sección fijada traduce temporalmente el avance vertical en desplazamiento horizontal para recorrer una colección o secuencia.

### Por qué eleva la calidad

Permite presentar portfolios, timelines o etapas amplias sin extender excesivamente la página.

### Cuándo usarla

- Solo cuando el contenido tiene una secuencia horizontal natural.
- Ofrecer alternativa vertical en móvil y reduced motion.
- No encerrar navegación esencial dentro del efecto.

### Prompt universal

“Usa una pista horizontal, calcula el desplazamiento con `scrollWidth - innerWidth`, fija la sección solo en escritorio y crea fallback vertical accesible.”

### ✅ Código bien hecho

```javascript
const media = gsap.matchMedia();
media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
  const track = document.querySelector('[data-horizontal-track]');
  const distance = () => Math.max(0, track.scrollWidth - innerWidth);

  gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: track.parentElement,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });
});
```

### ❌ Código mal hecho

```css
body { overflow: hidden; }
.track { transform: translateX(-5000px); }
```

### Nota de adaptación

Úsalo para una historia con etapas o galería, no como patrón general de navegación.

---

## 13. Typography Reveal con máscaras

### En qué consiste

Divide líneas o palabras en contenedores con `overflow: hidden` para revelar el texto desde una máscara.

### Por qué eleva la calidad

Produce entradas editoriales limpias y controladas, más refinadas que un fade uniforme.

### Cuándo usarla

- H1/H2 breves en story mode.
- No fragmentar párrafos, contenido seleccionable importante o textos largos.

### Prompt universal

“Anima líneas, no cada letra por defecto. Mantén el texto real en el DOM, no dupliques contenido para lectores de pantalla y desactiva transformaciones con reduced motion.”

### ✅ Código bien hecho

```html
<h2 class="masked-title">
  <span class="masked-line"><span>Las señales ya existen.</span></span>
  <span class="masked-line"><span>Falta conectarlas.</span></span>
</h2>
```

```css
.masked-line { display: block; overflow: hidden; }
```

```javascript
gsap.from('.masked-line > span', {
  yPercent: 110,
  duration: 0.9,
  stagger: 0.08,
  ease: 'power4.out'
});
```

### ❌ Código mal hecho

```javascript
heading.innerHTML = [...heading.textContent].map((c) => `<span>${c}</span>`).join('');
```

### Nota de adaptación

Los titulares se mantienen en una escala contenida. El efecto no justifica H1 de 140px que rompan el layout.

---

## 14. Distorsión WebGL y liquid hover

### En qué consiste

Usa shaders para deformar o refractar imágenes durante hover o transición.

### Por qué eleva la calidad

Puede crear una interacción de portfolio distintiva, con mayor profundidad que un simple zoom CSS.

### Cuándo usarla

- Casos de estudio seleccionados y escenas experimentales.
- Nunca sobre UI funcional, texto, formularios o media esencial.
- Requiere fallback y presupuesto de rendimiento.

### Prompt universal

“Aplica el shader únicamente al asset visual. Detecta soporte WebGL, limita resolución y detén el render loop cuando el elemento no es visible. Fallback: imagen estática con transición CSS.”

### ✅ Código bien hecho

```javascript
const supportsWebGL = (() => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
})();

document.documentElement.classList.toggle('has-webgl', supportsWebGL);
```

### ❌ Código mal hecho

```javascript
new HeavyShaderEffect(document.querySelectorAll('img'));
```

### Nota de adaptación

Uso muy restringido. Si compite con el visual principal o ralentiza la lectura, se elimina.

---

## 15. Transiciones SPA y View Transitions

### En qué consiste

Intercambia vistas mediante estado y anima la transición sin recargar el documento. Puede usar `document.startViewTransition()` con fallback.

### Por qué eleva la calidad

En una aplicación, mantiene contexto, audio/video, visual persistente y posición de trabajo. Evita flashes blancos y reinicios innecesarios.

### Cuándo usarla

- Navegación interna de una SPA o aplicación cuando conservar estado aporta valor.
- Los enlaces externos y documentos descargables siguen siendo enlaces reales.

### Prompt por entorno

- 🟢 STATIC: “`navigate(viewId)` muta `appState.view`. Usa View Transitions con fallback directo. Nunca navega a otro HTML para vistas internas.”
- 🔵 APP: “Usa el router del framework y transiciones compatibles sin duplicar estado global.”
- 🟣 HYBRID: “Usa View Transitions de Astro cuando no destruya el estado de islands persistentes.”

### ✅ Código bien hecho

```javascript
function navigate(viewId) {
  const commit = () => { appState.view = viewId; };
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(commit);
  } else {
    commit();
  }
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-view]');
  if (!trigger) return;
  navigate(trigger.dataset.view);
});
```

### ❌ Código mal hecho

```html
<a href="production.html">Production</a>
<a href="assets.html">Assets</a>
```

### Nota de adaptación

En una SPA, las vistas internas conservan estado y visuales persistentes cuando aporta valor. En una web multipágina, los enlaces reales siguen siendo correctos.

---

## 16. Tipografía variable reactiva

### En qué consiste

Usa fuentes variables y modifica ejes como peso, ancho u óptica de manera continua según una interacción.

### Por qué eleva la calidad

Permite respuestas tipográficas sutiles sin cargar múltiples archivos de fuente ni saltar entre pesos discretos.

### Cuándo usarla

- Titulares editoriales breves en story mode.
- No alterar texto de lectura continua ni depender del efecto para comunicar jerarquía.

### Prompt universal

“Usa una fuente variable local en `.woff2` con fallback `system-ui`. Limita el rango de `wght` o `wdth`; interpola suavemente y respeta reduced motion.”

### ✅ Código bien hecho

```css
@font-face {
  font-family: 'Brand Variable';
  src: url('assets/fonts/brand-variable.woff2') format('woff2-variations');
  font-display: swap;
  font-weight: 300 700;
}

.reactive-type {
  font-family: 'Brand Variable', system-ui, sans-serif;
  font-variation-settings: 'wght' var(--type-weight, 480);
}
```

```javascript
const title = document.querySelector('.reactive-type');
const setWeight = gsap.quickSetter(title, '--type-weight');
addEventListener('pointermove', (event) => {
  const weight = gsap.utils.mapRange(0, innerWidth, 430, 570, event.clientX);
  setWeight(weight);
}, { passive: true });
```

### ❌ Código mal hecho

```javascript
document.body.style.fontWeight = Math.round(Math.random() * 900);
```

### Nota de adaptación

El efecto debe sentirse, no anunciarse. La legibilidad y la escala tipográfica tienen prioridad.

---

## 17. Ruido dinámico y grano fílmico

### En qué consiste

Añade una textura de grano de muy baja opacidad sobre fondos digitales para evitar una apariencia excesivamente plástica.

### Por qué eleva la calidad

Una textura controlada aporta profundidad y tactilidad a fondos negros/graphite sin crear nuevos contenedores.

### Cuándo usarla

- Story mode y fondos amplios.
- No sobre texto pequeño, workspaces densos ni capturas que deben conservar color exacto.

### Prompt universal

“Usa un SVG/data texture estático o animación de muy baja frecuencia y opacidad de 1–3%. `pointer-events:none`, `mix-blend-mode` prudente y sin canvas a 60fps solo para ruido.”

### ✅ Código bien hecho

```css
.film-grain::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 30;
  pointer-events: none;
  opacity: .022;
  background-image: url('assets/noise-tile.webp');
  background-repeat: repeat;
}
```

### ❌ Código mal hecho

```javascript
function noise() {
  redrawFullScreenNoiseCanvas();
  requestAnimationFrame(noise);
}
noise();
```

### Nota de adaptación

El grano no debe ensuciar el color de texto, los controles ni las visualizaciones de contenido.

---

## 18. Marquee inteligente reversible

### En qué consiste

Una cinta continua cambia su dirección o velocidad según el desplazamiento y puede desacelerar durante hover/focus.

### Por qué eleva la calidad

Sirve para mostrar clientes, principios o frases breves con ritmo editorial sin ocupar una lista vertical extensa.

### Cuándo usarla

- Logos, categorías o mensajes secundarios en story mode.
- No incluir información esencial que solo pueda leerse en movimiento.

### Prompt universal

“Duplica únicamente la pista visual, conserva una lista semántica accesible, vincula dirección a la velocidad de scroll y detén la animación con hover, focus o reduced motion.”

### ✅ Código bien hecho

```javascript
const marquee = gsap.to('[data-marquee-track]', {
  xPercent: -50,
  duration: 22,
  repeat: -1,
  ease: 'none'
});

ScrollTrigger.create({
  onUpdate: (self) => marquee.timeScale(self.direction > 0 ? 1 : -1)
});

document.querySelector('[data-marquee]')?.addEventListener('focusin', () => marquee.pause());
document.querySelector('[data-marquee]')?.addEventListener('focusout', () => marquee.resume());
```

### ❌ Código mal hecho

```html
<marquee>Clientes · Clientes · Clientes · Clientes</marquee>
```

### Nota de adaptación

Ideal para un conjunto de pilares o marcas; no usar dentro de un workspace operativo.

---

## 19. Desdoblamiento 3D de tarjetas

### En qué consiste

Las tarjetas entran desde una rotación en perspectiva y se “levantan” progresivamente al aparecer.

### Por qué eleva la calidad

Aporta profundidad física a un conjunto seleccionado de tarjetas sin usar una escena 3D completa.

### Cuándo usarla

- Bento editorial o casos de estudio en story mode.
- No usar en cada tarjeta del producto ni en resultados de herramientas.

### Prompt universal

“Aplica `perspective` al contenedor y anima `rotateX`, `y` y `opacity` con ScrollTrigger. Limita el ángulo, preserva el orden de lectura y usa fallback plano.”

### ✅ Código bien hecho

```css
.fold-scene { perspective: 1200px; }
.fold-card { transform-origin: 50% 100%; }
```

```javascript
gsap.from('.fold-card', {
  rotateX: 18,
  y: 48,
  opacity: 0,
  stagger: 0.08,
  ease: 'power3.out',
  scrollTrigger: { trigger: '.fold-scene', start: 'top 78%' }
});
```

### ❌ Código mal hecho

```css
.card { transform: perspective(200px) rotateX(70deg); }
```

### Nota de adaptación

No confundir “más 3D” con “más premium”. El efecto debe apoyar una escena, no afectar la lectura de métricas.

---

## 20. Scrubbing de video controlado por scroll

### En qué consiste

Mapea el progreso de una sección al `currentTime` de un video o a una secuencia de imágenes.

### Por qué eleva la calidad

Permite revelar un producto o transformación cuadro a cuadro con control directo del usuario, similar a una narrativa de lanzamiento.

### Cuándo usarla

- Escena central de producto con video preparado para seek.
- No usar con videos largos, codecs difíciles de buscar o móviles de bajo rendimiento sin fallback.

### Prompt universal

“Prepara el video para fast seeking, espera `loadedmetadata`, vincula `currentTime` a ScrollTrigger y ofrece poster/video normal en reduced motion.”

### ✅ Código bien hecho

```javascript
const video = document.querySelector('[data-scroll-video]');
video.addEventListener('loadedmetadata', () => {
  const playhead = { time: 0 };
  gsap.to(playhead, {
    time: video.duration,
    ease: 'none',
    onUpdate: () => { video.currentTime = playhead.time; },
    scrollTrigger: {
      trigger: video.closest('[data-scroll-video-scene]'),
      start: 'top top',
      end: 'bottom bottom',
      scrub: true
    }
  });
}, { once: true });
```

### ❌ Código mal hecho

```javascript
window.addEventListener('scroll', () => {
  video.currentTime = scrollY / 50;
});
```

### Nota de adaptación

Úsalo para explicar una transformación concreta del sistema, no como fondo decorativo permanente.

---

## 21. Máscara de texto gigante o Typography Window

### En qué consiste

Un video o imagen se revela a través de las formas de una palabra y la máscara puede escalar hasta ocupar la pantalla.

### Por qué eleva la calidad

Convierte una frase clave en transición visual y puede conectar dos escenas narrativas sin un corte convencional.

### Cuándo usarla

- Una sola transición de alto impacto.
- No usar con mensajes largos, interfaces funcionales o información que deba permanecer legible.

### Prompt universal

“Crea máscara SVG accesible con texto alternativo visible para lectores de pantalla. Mantén una versión estática y limita la escala para evitar artefactos.”

### ✅ Código bien hecho

```html
<section class="type-window" aria-label="De señal a sistema">
  <svg viewBox="0 0 1200 600" role="presentation" aria-hidden="true">
    <defs>
      <mask id="type-mask">
        <rect width="1200" height="600" fill="black"/>
        <text x="600" y="340" text-anchor="middle" fill="white">SISTEMA</text>
      </mask>
    </defs>
    <foreignObject width="1200" height="600" mask="url(#type-mask)">
      <video autoplay muted loop playsinline src="assets/system.mp4"></video>
    </foreignObject>
  </svg>
</section>
```

### ❌ Código mal hecho

```css
h1 { font-size: 40vw; mix-blend-mode: difference; }
```

### Nota de adaptación

Una dirección editorial premium no significa usar texto gigante en todas partes. La escala debe responder al contenido y al viewport.

---

## 22. Carruseles de físicas táctiles

### En qué consiste

Permiten arrastrar una pista con mouse o touch y simulan inercia/desaceleración.

### Por qué eleva la calidad

Una galería se siente directa y física, especialmente en trackpads y móviles, sin depender solo de pequeñas flechas.

### Cuándo usarla

- Portfolios, clips y colecciones visuales.
- Debe conservar botones, teclado, indicadores y límites claros.

### Prompt universal

“Implementa drag con pointer events o GSAP Draggable; añade snap, controles de teclado, botones anterior/siguiente y reduced motion. No hagas depender el contenido de InertiaPlugin.”

### ✅ Código bien hecho

```javascript
const carousel = document.querySelector('[data-carousel]');
const track = carousel.querySelector('[data-carousel-track]');

Draggable.create(track, {
  type: 'x',
  bounds: carousel,
  inertia: true,
  edgeResistance: 0.85,
  snap: (value) => Math.round(value / 320) * 320
});

carousel.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') moveCarousel(1);
  if (event.key === 'ArrowLeft') moveCarousel(-1);
});
```

### ❌ Código mal hecho

```javascript
track.onmousedown = () => track.style.left = `${event.clientX}px`;
```

### Nota de adaptación

En Storytelling de clientes, el carrusel debe respetar el orden narrativo y mostrar posición/progreso.

---

## 23. Efecto linterna o Mouse Spotlight

### En qué consiste

Actualiza variables CSS con las coordenadas del puntero para revelar un gradiente radial local.

### Por qué eleva la calidad

Puede destacar bordes, textura o información secundaria sin iluminar toda la superficie.

### Cuándo usarla

- Tarjetas oscuras editoriales y hotspots exploratorios.
- No esconder acciones esenciales hasta hover; móvil necesita versión visible.

### Prompt universal

“Actualiza `--mouse-x` y `--mouse-y` con pointermove pasivo, activa solo con pointer fino y deja visibles contenido y foco sin el efecto.”

### ✅ Código bien hecho

```css
.spotlight-card {
  --mouse-x: 50%;
  --mouse-y: 50%;
  background:
    radial-gradient(220px at var(--mouse-x) var(--mouse-y), rgba(216,180,108,.16), transparent 70%),
    #121216;
}
```

```javascript
document.querySelectorAll('.spotlight-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  }, { passive: true });
});
```

### ❌ Código mal hecho

```css
.card * { opacity: 0; }
.card:hover * { opacity: 1; }
```

### Nota de adaptación

Los hotspots importantes siempre son identificables; el spotlight puede enriquecerlos, pero nunca ocultarlos.

---

## 24. Dibujo vectorial narrativo con SVG Path Scroll

### En qué consiste

Vincula el avance del scroll al trazado progresivo de una línea SVG mediante `stroke-dasharray` y `stroke-dashoffset`.

### Por qué eleva la calidad

Una ruta visual puede conectar etapas, nodos o decisiones y guiar la mirada sin añadir más tarjetas.

### Cuándo usarla

- Roadmaps, procesos, evolución de marca y conexiones entre nodos.
- La línea no debe ser la única forma de entender el orden.

### Prompt universal

“Calcula la longitud real con `getTotalLength()`, anima `strokeDashoffset` con scrub y conserva números/títulos semánticos como alternativa.”

### ✅ Código bien hecho

```javascript
const path = document.querySelector('[data-scroll-path]');
const length = path.getTotalLength();
path.style.strokeDasharray = `${length}`;
path.style.strokeDashoffset = `${length}`;

gsap.to(path, {
  strokeDashoffset: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: path.closest('[data-path-story]'),
    start: 'top 70%',
    end: 'bottom 30%',
    scrub: true
  }
});
```

### ❌ Código mal hecho

```css
path { animation: draw 8s linear infinite; }
```

### Nota de adaptación

Puede conectar hotspots del Home o beats de Roadmap, pero no debe convertirse en un hilo neón decorativo sin significado.

---

# BLOQUE 3 — Sistemas de producto y aplicaciones web

Estas técnicas convierten efectos aislados en sistemas reutilizables para sitios narrativos, productos digitales, SaaS, dashboards y herramientas internas.

---

## 25. Sistema visual generativo de marca y navegador de partículas

### En qué consiste

Es un motor sobre `<canvas>`, SVG o WebGL que dibuja partículas basadas en un elemento real de la identidad: punto, línea, letra, isotipo, textura o figura geométrica. Las partículas pueden formar símbolos, productos, mapas, ondas o estructuras relacionadas con el contenido.

No es un fondo genérico. Es simultáneamente:

- firma visual del proyecto;
- navegador contextual;
- visualización del estado del sistema;
- puente entre capítulos, categorías o herramientas.

### Por qué eleva la calidad

Corrige el error de usar partículas genéricas sin relación con la marca. El sistema aporta identidad, continuidad entre escenas y una forma visual de representar categorías, datos o navegación.

### Cuándo usarla

- Cuando la marca posee un símbolo o lenguaje visual que puede convertirse en sistema.
- En Home, campañas, product stories, mapas de servicios o visualizaciones narrativas.
- No usar si una fotografía, ilustración o diagrama comunica mejor el mensaje.
- En workspaces se mantiene discreto y funcional.

### Requisitos funcionales

1. La forma de partícula proviene de `projectProfile.brand`, no de una decisión aleatoria del desarrollador.
2. La paleta proviene de tokens configurables; no se reparte en valores hardcoded por el motor.
3. Los hotspots importantes son visibles sin depender exclusivamente de hover.
4. Cada hotspot incluye nodo, leader line, nombre, explicación breve y CTA.
5. El morph responde al beat narrativo o a `appState.context`, no a un temporizador aleatorio.
6. En una SPA puede persistir entre vistas; en una web multipágina debe reinicializarse sin bloquear contenido ni navegación.
7. Reduced motion muestra una composición estática funcional.
8. La densidad se adapta a viewport, `devicePixelRatio` y rendimiento.

### Prompt por entorno

- 🟢 STATIC: “Construye un sistema de partículas Canvas 2D con JavaScript puro. La forma, paleta y targets deben proceder de `brandConfig`. Implementa morph por interpolación y hotspots DOM accesibles.”
- 🔵 APP: “Encapsula el motor visual en un componente estable. El componente recibe marca, targets y contexto; no se recrea en cada render.”
- 🟣 HYBRID: “Hidrata únicamente la island del sistema generativo y conserva el contenido principal pre-renderizado.”
- 🟠 CMS: “Usa el sistema generativo como bloque aislado configurable desde campos del CMS; incluye imagen fallback para editor, SEO y dispositivos limitados.”

### ✅ Código bien hecho — forma de partícula

```javascript
class BrandParticle {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.tx = x;
    this.ty = y;
    this.size = size;
    this.color = color;
    this.alpha = 0.5 + Math.random() * 0.4;
  }

  update() {
    this.x += (this.tx - this.x) * 0.075;
    this.y += (this.ty - this.y) * 0.075;
  }

  draw(ctx, drawGlyph) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = this.color;
    drawGlyph(ctx, this.x, this.y, this.size);
    ctx.restore();
  }
}

const brandConfig = {
  particleGlyph: 'diamond',
  particlePalette: ['#5b5bd6', '#f59e0b', '#22c55e']
};

function drawBrandGlyph(ctx, x, y, size) {
  ctx.lineWidth = Math.max(1, size * 0.14);
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size, y);
  ctx.closePath();
  ctx.stroke();
}
```

### ✅ Código bien hecho — morph por contexto

```javascript
const visualTargets = {
  home: createBrandMarkShape(),
  services: createServiceOrbitShape(),
  cases: createGalleryPathShape(),
  data: createDataWaveShape()
};

function morphVisual(view) {
  const targets = visualTargets[view] || visualTargets.home;
  particles.forEach((particle, index) => {
    const target = targets[index % targets.length];
    particle.tx = target.x;
    particle.ty = target.y;
  });
}
```

### ❌ Código mal hecho

```javascript
for (let i = 0; i < 2000; i += 1) {
  context.arc(Math.random() * width, Math.random() * height, 2, 0, Math.PI * 2);
  context.fill();
}
```

**Problema:** partículas genéricas sin relación con la marca, targets, navegación, adaptación ni función contextual.

### Nota de adaptación

La figura concreta no es universal. Un proyecto puede usar letras, pétalos, píxeles, estrellas, nodos, líneas o su isotipo. La técnica es el **sistema configurable**, no una forma predeterminada.

---

## 26. Navegación global adaptativa, Tools Menu y Command Palette

### En qué consiste

Un sistema de navegación puede combinar, según la complejidad del proyecto:

- topbar, menú principal o control global;
- Tools Menu para explorar módulos;
- Command Palette con `⌘K`/`Ctrl+K`;
- sidebar adaptativa según superficie;
- routing, enlaces reales o navegación por estado según el entorno.

La arquitectura exacta depende de la cantidad de secciones, frecuencia de uso, SEO y tamaño de pantalla.

### Por qué eleva la calidad

Permite que una superficie narrativa conserve amplitud y que una aplicación recupere orientación. La navegación apoya el contenido sin dominarlo.

### Cuándo usarla

- En SaaS, dashboards o webs con muchas secciones/acciones.
- En landings simples puede bastar una navegación corta y no se necesita Command Palette.
- La sidebar compacta aparece únicamente cuando aporta orientación al workspace.
- El Command Palette acelera acceso experto, pero nunca es la única forma de navegar.

### Comportamiento por superficie

| Superficie | Navegación recomendada | Control global | Command Palette |
|---|---|---|---|
| Narrative / marketing | Header corto, sticky si aporta valor | Opcional | Generalmente no |
| Editorial / commerce | Categorías, búsqueda y breadcrumbs | Visible | Opcional |
| Workspace / application | Sidebar o topbar adaptativa | Visible | Útil para usuarios frecuentes |
| Móvil | Drawer o navegación inferior accesible | Visible | Búsqueda simplificada |

### Prompt universal

“Diseña la navegación según el tipo de web y su arquitectura de información. Si el producto tiene muchas herramientas, añade Tools Menu y Command Palette con búsqueda, teclado y foco. Define comportamiento responsive, estado activo y breadcrumbs cuando sean necesarios. Usa enlaces reales o routing según el entorno.”

### ✅ Código bien hecho

```html
<button
  class="global-tools-trigger"
  type="button"
  aria-haspopup="dialog"
  aria-controls="tools-menu"
  aria-expanded="false"
  data-open-tools
>
  Herramientas
  <kbd>⌘K</kbd>
</button>

<section id="tools-menu" role="dialog" aria-modal="false" hidden>
  <label for="command-search">Buscar herramienta o acción</label>
  <input id="command-search" type="search" autocomplete="off">
  <ul role="listbox" id="command-results"></ul>
</section>
```

```javascript
addEventListener('keydown', (event) => {
  const shortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
  if (!shortcut) return;
  event.preventDefault();
  appState.commandPaletteOpen = !appState.commandPaletteOpen;
});
```

### ❌ Código mal hecho

```html
<div class="dashboard-button" onclick="location.href='dashboard.html'">☰</div>
```

### Nota de adaptación

El menú aparece desde su control de origen, conserva foco y no cubre contenido crítico. No usar iconos ambiguos sin etiqueta ni esconder navegación esencial dentro de atajos expertos.

---

## 27. Home orientado al objetivo, onboarding y continuidad

### En qué consiste

Home establece qué ofrece el proyecto, para quién es y cuál es la siguiente acción. En una aplicación también puede orientar, resumir estado y permitir retomar una tarea anterior.

### Por qué eleva la calidad

Evita portadas genéricas y dashboards saturados. Hace visible la propuesta de valor, reduce decisiones iniciales y conserva continuidad cuando el producto tiene sesiones o workspaces.

### Cuándo usarla

- En cualquier web, adaptando el Home al objetivo comercial o funcional.
- En una landing, Home puede ser la propia página de conversión.
- En una aplicación, puede ofrecer onboarding, accesos y continuidad.

### Requisitos funcionales

- Hero o entrada con una propuesta clara y un visual relacionado con la marca.
- Acciones principales limitadas y distinguibles.
- Accesos iniciales a los caminos principales según el tipo de página.
- Hotspots de herramientas visibles y accesibles.
- En aplicaciones, botón “Volver a [última tarea]” solo si existe memoria válida y esa decisión mejora la experiencia.
- La política de inicio —Home o última tarea— se define en `projectProfile`, no se impone universalmente.

### Prompt universal

“Construye un Home según el objetivo del proyecto. Explica propuesta, público y acción primaria en el primer tramo. Usa progressive disclosure para contenido secundario. Si es una aplicación, incluye onboarding, estado o regreso a la última tarea solo cuando aporten valor.”

### ✅ Código bien hecho

```javascript
function getHomeActions(state) {
  const actions = [
    { label: projectProfile.primaryAction, view: 'primary-flow', kind: 'primary' },
    { label: 'Ver casos y resultados', view: 'case-studies', kind: 'secondary' }
  ];

  if (state.lastWorkspace) {
    actions.push({
      label: `Volver a ${getWorkspaceLabel(state.lastWorkspace)}`,
      view: state.lastWorkspace,
      kind: 'resume'
    });
  }
  return actions;
}

function bootstrap() {
  appState.view = projectProfile.startView || 'home';
  renderApplication();
  initPrimaryVisual();
}
```

### ❌ Código mal hecho

```javascript
appState.view = localStorage.getItem('lastWorkspace'); // sin validar ni definir política de inicio
```

### Nota de adaptación

La continuidad debe ser configurable. Una tienda, una landing y una herramienta profesional no necesitan la misma política de inicio.

---

## 28. Storytelling editorial de producto

### En qué consiste

Combina el ritmo de una página de producto con estructuras editoriales como:

- media sticky;
- beats narrativos al scroll;
- reveals contenidos;
- sliders o galleries con propósito;
- grandes pausas de espacio;
- jerarquía tipográfica legible;
- transición de visuales anclada al texto.

Puede inspirarse en páginas de lanzamiento, revistas digitales o sitios de producto, adaptándose a la marca sin copiar assets ni layouts píxel por píxel.

### Por qué eleva la calidad

Corrige la estructura plana de “texto a la izquierda + tarjeta a la derecha” repetida. Cada sección presenta una idea, una evidencia y una transición clara.

### Cuándo usarla

- Landing de producto, servicios, Home, casos, portfolio y roadmap.
- No usar como contenedor de formularios o tablas operativas.

### Prompt universal

“Diseña una secuencia de beats. Cada beat tiene una idea, prueba y visual. Usa una columna visual sticky y contenido que avanza, o escenas full-bleed cuando la historia lo exija. Titulares en `clamp(32px, 5vw, 60px)` y cuerpo 16–18px. Evita paredes de tarjetas glass.”

### ✅ Código bien hecho

```html
<section class="product-story" data-product-story>
  <div class="product-story__visual" aria-live="polite">
    <figure data-story-visual="signal"><img src="assets/signal.webp" alt="Señales dispersas"></figure>
    <figure data-story-visual="system" hidden><img src="assets/system.webp" alt="Sistema conectado"></figure>
  </div>

  <div class="product-story__beats">
    <article data-story-beat="signal"><p>Todo empieza con señales dispersas.</p></article>
    <article data-story-beat="system"><p>La solución las convierte en una decisión clara.</p></article>
  </div>
</section>
```

```css
.product-story { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(20rem, .8fr); }
.product-story__visual { position: sticky; top: 0; height: 100svh; }
.product-story__beats article { min-height: 88svh; display: grid; align-items: center; }
@media (max-width: 800px) {
  .product-story { display: block; }
  .product-story__visual { position: relative; height: auto; }
}
```

### ❌ Código mal hecho

```html
<div class="grid grid-cols-3 gap-4">
  <div class="glass-card">Métrica 1</div>
  <div class="glass-card">Métrica 2</div>
  <div class="glass-card">Métrica 3</div>
</div>
```

### Nota de adaptación

Cada cliente conserva identidad editorial propia. El acento del cliente aparece dentro de su historia, no reemplaza el sistema visual global.

---

## 29. Flujos guiados y Wizards orientados a tareas

### En qué consiste

Cada herramienta organiza una tarea compleja como una secuencia clara:

1. contexto o entrada;
2. decisión principal;
3. procesamiento/validación;
4. resultado revisable;
5. siguiente acción.

El patrón puede inspirarse en aplicaciones de productividad: un objetivo protagonista, una acción primaria y resultados convertidos en unidades revisables.

### Por qué eleva la calidad

Reduce densidad y carga cognitiva sin eliminar capacidad. Evita que todas las opciones aparezcan a la vez y que todos los workspaces sean el mismo formulario con distinto título.

### Cuándo usarla

- En herramientas con varias decisiones, validaciones o resultados.
- No es necesario para una acción única que pueda resolverse en una sola pantalla clara.
- Cada wizard debe adaptarse a la lógica real de su herramienta.

### Requisitos

- Cada herramienta tiene UX específica según su tarea.
- Una acción primaria por paso.
- Indicador de progreso y retorno seguro.
- Resumen editable antes de confirmar.
- Estados vacíos, error, carga, éxito y recuperación.
- El sistema de ayuda contextual conoce paso y bloqueos.
- Motion funcional, no decorativo.

### Prompt universal

“Diseña el workspace como wizard específico para la tarea. Empieza con una decisión central, revela opciones avanzadas cuando sean necesarias y convierte resultados en módulos revisables. Conserva keyboard navigation, validación inline y estado recuperable.”

### ✅ Código bien hecho

```html
<section class="workspace" aria-labelledby="workspace-title">
  <header class="workspace-toolbar">
    <p>Paso <span data-current-step>1</span> de <span data-total-steps>4</span></p>
    <progress value="1" max="4">25%</progress>
  </header>

  <div data-step="1">
    <h1 id="workspace-title">Define el objetivo de producción</h1>
    <fieldset>
      <legend>¿Qué quieres producir?</legend>
      <!-- opciones específicas -->
    </fieldset>
    <button type="button" data-next-step>Continuar</button>
  </div>
</section>
```

### ❌ Código mal hecho

```html
<div class="glass-grid">
  <input><select></select><textarea></textarea><button>Guardar</button>
  <button>Generar</button><button>Exportar</button><button>Publicar</button>
</div>
```

### Nota de adaptación

No alterar el modelo de dominio, IDs, datos, integraciones o procesos al rehacer la presentación. La capa visual se adapta a la lógica existente salvo autorización expresa.

---

## 30. Asistente contextual y sistema de ayuda integrado

### En qué consiste

Es un asistente o sistema de ayuda que conoce la sección, tarea, selección y progreso actual. Puede aparecer como utility window lateral, panel, sheet móvil, popover o ayuda inline según el producto.

En un proyecto estático puede funcionar con reglas locales y preparar una consulta. Una integración real con un LLM requiere backend seguro, control de permisos y protección de datos.

### Por qué eleva la calidad

Convierte la ayuda en parte del flujo. Puede explicar el siguiente paso, señalar un control, advertir un bloqueo y preparar una consulta con el contexto correcto sin exponer secretos.

### Cuándo usarla

- En onboarding, configuradores, dashboards y herramientas complejas.
- No es necesario en landings o webs informativas simples si una buena arquitectura resuelve la orientación.
- Se abre por decisión del usuario o ante un bloqueo claro; no interrumpe cada paso.
- En móvil se presenta como sheet o panel modal, no como ventana que reduzca demasiado el contenido.

### Contexto mínimo que debe leer

```javascript
{
  module: 'catalog',
  section: 'item-review',
  entityId: 'item_042',
  step: 3,
  progress: 0.65,
  blockers: ['missing-image'],
  selection: ['item_042']
}
```

### Requisitos de interacción

- ubicación adaptada al dispositivo: lateral en escritorio, sheet/modal en móvil o inline cuando conviene;
- no bloquear CTA ni texto;
- conservar foco y atajos;
- leer el store, no raspar textos aleatoriamente del DOM;
- respuestas contextuales breves y accionables;
- botón para resaltar/abrir el control recomendado;
- botón “Preparar pregunta para IA” que copia un prompt completo;
- nunca guardar una API key en HTML/localStorage.

### Prompt universal

“Implementa un asistente contextual suscrito al estado de la tarea. Muestra recomendación, razón y acción. Define su superficie según el dispositivo. En static, genera/copia una consulta contextual; para chat real, usa una interfaz de backend sin incluir secretos en el cliente.”

### ✅ Código bien hecho

```html
<aside
  id="assistant-window"
  class="assistant-window"
  aria-labelledby="assistant-title"
  data-state="collapsed"
>
  <header>
    <h2 id="assistant-title">Asistente del proyecto</h2>
    <button type="button" data-assistant-toggle aria-expanded="false">Abrir</button>
  </header>
  <div data-assistant-content></div>
  <footer>
    <button type="button" data-highlight-action>Mostrar dónde</button>
    <button type="button" data-copy-ai-question>Preparar pregunta para IA</button>
  </footer>
</aside>
```

```javascript
function buildAssistantPrompt(context) {
  return [
    `Actúa como especialista en ${projectProfile.projectName}.`,
    `Módulo: ${context.module}`,
    `Sección: ${context.section}`,
    `Entidad: ${context.entityId || 'sin asignar'}`,
    `Paso: ${context.step}`,
    `Bloqueos: ${(context.blockers || []).join(', ') || 'ninguno'}`,
    'Indica la siguiente acción concreta y no modifiques datos fuera de este contexto.'
  ].join('\n');
}

async function copyAssistantQuestion() {
  const prompt = buildAssistantPrompt(appState.context);
  await navigator.clipboard.writeText(prompt);
  announce('Pregunta preparada y copiada.');
}
```

### ❌ Código mal hecho

```html
<div class="sidebar-left">Chat IA</div>
<script>const OPENAI_API_KEY = 'sk-...';</script>
```

### Nota de adaptación

Una utility window lateral funciona bien en aplicaciones de escritorio; en móvil conviene un sheet. En un HTML no es una ventana nativa always-on-top del sistema operativo; eso requeriría empaquetado de escritorio.

---

## 31. Fidelidad al sistema de diseño, plataforma e iconografía

### En qué consiste

Aplica un sistema coherente a anatomía, controles, densidad, spacing, tipografía, foco, materiales e iconografía. Puede inspirarse en Apple HIG, Material Design, Fluent, Shopify Polaris u otro sistema pertinente, sin copiar identidad ajena.

### Por qué eleva la calidad

Corrige interfaces genéricas y estilos mezclados: mejora jerarquía, coherencia, estados, controles y reconocimiento de la acción principal.

### Cuándo usarla

- Es transversal a toda web o aplicación.
- La intensidad de materiales y motion cambia entre story y workspace.
- No se usa para copiar una plataforma, sino para aplicar principios compatibles con el proyecto.

### Sistema visual base

```css
:root {
  --brand-primary: #5b5bd6;
  --brand-accent: #f59e0b;
  --color-canvas: #ffffff;
  --color-surface: #f6f7f9;
  --color-text: #17181b;
  --color-muted: #656872;
  --functional-layer: rgba(255,255,255,.82);
  --border-subtle: rgba(23,24,27,.12);
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --radius-control: 10px;
  --radius-panel: 18px;
  --radius-window: 24px;
}
```

### Reglas de diseño

- Usa las tipografías de la marca con fallbacks compatibles y métricas estables.
- Elige un sistema de iconos coherente con la personalidad: lineal, sólido o duotono; no mezcles estilos.
- No emojis como iconografía funcional.
- Si el proyecto usa glass, resérvalo para capas funcionales y evita glass-on-glass.
- Mantén contraste, densidad y separación acordes con el tipo de página.
- Tipografía: body generalmente 16–18px; la escala de títulos depende del contenido, viewport y dirección editorial.
- Un CTA primario por paso o escena.
- Foco visible, objetivos táctiles suficientes y navegación por teclado.
- Los acentos contextuales no deben destruir la identidad global.

### Prompt universal

“Reestructura la anatomía antes de estilizar. Deriva tokens de `projectProfile.brand`, define jerarquía, spacing, radios, tipografía, iconografía y estados. Adapta densidad y navegación al tipo de página. No conviertas cada bloque en una card ni impongas glass/dark mode sin justificación.”

### ✅ Código bien hecho

```css
.functional-layer {
  background: var(--functional-layer);
  border: 1px solid var(--border-subtle);
}

@supports (backdrop-filter: blur(1px)) {
  .functional-layer[data-material="glass"] {
    backdrop-filter: blur(24px) saturate(135%);
    -webkit-backdrop-filter: blur(24px) saturate(135%);
  }
}

.content-surface {
  background: var(--color-canvas);
  color: var(--color-text);
}

:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 3px;
}
```

### ❌ Código mal hecho

```css
.card, .panel, .metric, .section, .modal, .content {
  background: rgba(255,255,255,.06);
  backdrop-filter: blur(40px);
  border-radius: 32px;
}
```

### Nota de adaptación

El sistema visual seleccionado debe servir al proyecto. Apple HIG es útil para una app macOS-like; Material puede ser mejor para Android; Polaris para Shopify; un sistema propio puede ser la decisión correcta para una marca editorial.

---

# BLOQUE 4 — Técnicas detectadas en las referencias visuales

Las nueve referencias visuales aportaron patrones adicionales a las técnicas 1–31. La biblioteca puede utilizarse sin tener esos videos: la tabla funciona como trazabilidad del análisis, no como dependencia.

## Mapa de hallazgos por referencia

| Referencia | Patrones observados | Técnicas ya cubiertas | Técnicas nuevas derivadas |
|---|---|---|---|
| Página de producto tecnológica | Product story oscuro, visual sticky, selector lateral de features, media que cambia por capítulo, cifras de impacto y secciones de color contrastante | 1, 7, 13, 20, 22, 28, 31 | 32, 33 |
| Ecosistema de software y tienda | Navegación local sticky, carruseles, tarjetas de preguntas, paneles de detalle y cambio oscuro/claro | 15, 22, 28, 31 | 32, 33 |
| Software creativo | Media apilada, galerías en perspectiva, comparación de planes, acordeones y escenarios de producto | 7, 19, 22, 28, 29 | 32 |
| Agencia editorial | Tipografía editorial cinética, mezcla sans/serif, composición asimétrica, navegación lateral y progreso de sección | 13, 16, 18, 28 | 34, 35 |
| Explorador de inspiración | Grid visual, filtros, búsqueda, bookmarks, estados vacíos y vistas guardadas | 2, 4, 5, 22, 31 | 36 |
| Narrativa de partículas | Sistema de partículas con forma semántica, morph y escena persistente | 10, 15, 24, 25, 28 | Valida y refuerza la técnica 25; no requiere duplicado |
| Portfolio con identidad fluida | Gradient blob/mesh, tipografía como composición, transiciones de gran escala y portfolio modular | 13, 16, 18, 28 | 34, 37 |
| Experiencia 3D inmersiva | Mundo WebGL, portales, viaje de cámara, túneles, escenas 3D y hotspots espaciales | 8, 10, 14, 15 | 38 |
| Aplicación de mantenimiento | Objeto central funcional, color por módulo, escaneo/progreso, transformación a resultados y mapa radial | 5, 9, 29, 31 | 39, 40, 41 |

---

## 32. Sticky Feature Showcase con scroll-spy y media swapping

### En qué consiste

Una escena mantiene un visual principal fijo mientras los capítulos de texto avanzan. El capítulo activo actualiza el visual, una lista lateral, un indicador o una combinación de ellos. Es más específico que el product-story general: aquí existe una relación explícita **paso → estado visual**.

### Por qué eleva la calidad

Permite explicar varias capacidades sin repetir grandes bloques de media. El usuario conserva orientación porque ve qué capítulo está activo, qué cambió y cuánto falta.

### Cuándo usarla

- Comparación de capacidades, casos de uso, pasos de producto o highlights.
- Cuando varias explicaciones comparten un mismo dispositivo, mockup o escena.
- En móvil debe transformarse en media inline, accordion o tabs; no forzar sticky de 100vh.

### Prompt universal

“Crea un showcase con visual sticky y capítulos observados con `IntersectionObserver`. Cada capítulo tiene `data-feature-id`; al activarse, actualiza media, etiqueta y estado del selector. Mantén una transición anterior/siguiente breve, deep links por hash y fallback vertical en móvil/reduced motion.”

### ✅ Código bien hecho

```html
<section class="feature-showcase" data-feature-showcase>
  <nav aria-label="Capítulos del producto">
    <a href="#feature-speed" data-feature-link="speed">Rendimiento</a>
    <a href="#feature-ai" data-feature-link="ai">Inteligencia</a>
    <a href="#feature-battery" data-feature-link="battery">Autonomía</a>
  </nav>

  <div class="feature-showcase__stage" aria-live="polite">
    <img data-feature-media alt="Vista de rendimiento">
  </div>

  <div class="feature-showcase__chapters">
    <article id="feature-speed" data-feature-id="speed">
      <h3>Rendimiento sostenido</h3>
      <p>Procesa más activos sin perder continuidad en el flujo.</p>
    </article>
    <article id="feature-ai" data-feature-id="ai">
      <h3>Inteligencia contextual</h3>
      <p>Convierte el estado actual en una siguiente acción concreta.</p>
    </article>
    <article id="feature-battery" data-feature-id="battery">
      <h3>Trabajo continuo</h3>
      <p>Conserva el progreso y permite retomar el último workspace.</p>
    </article>
  </div>
</section>
```

```javascript
const featureMedia = {
  speed: { src: 'assets/speed.webp', alt: 'Flujo de rendimiento' },
  ai: { src: 'assets/ai.webp', alt: 'Asistencia inteligente' },
  battery: { src: 'assets/battery.webp', alt: 'Estado de autonomía' }
};

function activateFeature(id) {
  const media = featureMedia[id];
  const image = document.querySelector('[data-feature-media]');
  image.src = media.src;
  image.alt = media.alt;
  document.querySelectorAll('[data-feature-link]').forEach((link) => {
    link.toggleAttribute('aria-current', link.dataset.featureLink === id);
  });
}

const featureObserver = new IntersectionObserver((entries) => {
  const active = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (active) activateFeature(active.target.dataset.featureId);
}, { threshold: [0.45, 0.65, 0.85] });

document.querySelectorAll('[data-feature-id]').forEach((chapter) => featureObserver.observe(chapter));
```

### ❌ Código mal hecho

```javascript
window.addEventListener('scroll', () => {
  if (scrollY > 1000) image.src = '2.jpg';
  if (scrollY > 2000) image.src = '3.jpg';
});
```

### Nota de adaptación

Úsalo para producto, servicios, casos o roadmap. Cada capítulo puede actualizar el visual generativo además de la media, pero ambos deben responder al mismo `featureId`.

---

## 33. Transiciones cromáticas y cambio de tema por sección

### En qué consiste

El canvas, el texto y los controles cambian gradualmente entre temas oscuros, claros o cromáticos al entrar en una sección. No es un cambio arbitrario de color: comunica una nueva fase, producto o contexto.

### Por qué eleva la calidad

Marca capítulos narrativos sin añadir más cajas. También puede aumentar contraste cuando una pieza visual necesita un fondo distinto.

### Cuándo usarla

- Transición entre capítulos de product story.
- Casos de cliente o módulos con identidad propia.
- No cambiar toda la interfaz en cada tarjeta ni comprometer contraste/foco.

### Prompt universal

“Define temas como tokens semánticos y asigna `data-theme` a secciones. Detecta la sección dominante con IntersectionObserver y actualiza variables CSS en el shell. Valida contraste y mantén controles funcionales legibles durante toda la interpolación.”

### ✅ Código bien hecho

```css
:root {
  --page-bg: #09090b;
  --page-fg: #f5f5f7;
  --page-accent: #d8b46c;
}

body {
  background: var(--page-bg);
  color: var(--page-fg);
  transition: background-color .55s ease, color .4s ease;
}
```

```javascript
const themes = {
  dark: { bg: '#09090b', fg: '#f5f5f7', accent: '#d8b46c' },
  light: { bg: '#f5f5f7', fg: '#111114', accent: '#8052ff' },
  client: { bg: '#17131f', fg: '#fbf7ff', accent: '#ef7db8' }
};

function applyTheme(name) {
  const theme = themes[name] || themes.dark;
  const root = document.documentElement.style;
  root.setProperty('--page-bg', theme.bg);
  root.setProperty('--page-fg', theme.fg);
  root.setProperty('--page-accent', theme.accent);
}
```

### ❌ Código mal hecho

```javascript
setInterval(() => {
  document.body.style.background = `hsl(${Math.random() * 360} 80% 50%)`;
}, 1000);
```

### Nota de adaptación

El shell no pierde identidad. El tema de campaña, cliente o capítulo es contextual y reversible; los tokens globales mantienen continuidad.

---

## 34. Tipografía cinética y composición editorial mixta

### En qué consiste

Usa el texto como estructura visual: contraste entre sans y serif/itálica, cambios de alineación, escalas, superposición y movimiento por frases o palabras. A diferencia de Typography Reveal, no se limita a “hacer entrar” un título; diseña una coreografía tipográfica completa.

### Por qué eleva la calidad

Puede expresar tono, contraste y ritmo sin recurrir siempre a imágenes. En referencias editoriales, una palabra en serif o itálica cambia la voz y crea una tensión deliberada con el sistema sans.

### Cuándo usarla

- Home, manifiestos, transiciones de capítulo y portfolio.
- No usar en párrafos largos, formularios, métricas o instrucciones.
- Limitar familias tipográficas y preservar lectura semántica.

### Prompt universal

“Construye una composición tipográfica con texto real y spans semánticos. Usa máximo dos voces tipográficas compatibles, una escala con `clamp()` y animación por frase/palabra con GSAP. Evita fragmentar caracteres, conserva orden de lectura y ofrece layout estático en móvil/reduced motion.”

### ✅ Código bien hecho

```html
<h1 class="editorial-lockup" aria-label="Digital craftsmanship, sculpting you as an industry leader">
  <span>Digital</span>
  <em>craftsmanship</em>
  <span>sculpting you as an</span>
  <strong>industry leader</strong>
</h1>
```

```css
.editorial-lockup {
  display: grid;
  max-width: 12ch;
  font: 600 clamp(2.5rem, 7vw, 7rem)/.9 system-ui, sans-serif;
  letter-spacing: -.055em;
}

.editorial-lockup em {
  font-family: ui-serif, Georgia, serif;
  font-weight: 400;
  letter-spacing: -.03em;
}
```

```javascript
gsap.from('.editorial-lockup > *', {
  yPercent: 110,
  rotate: 1.5,
  opacity: 0,
  stagger: 0.08,
  ease: 'power4.out'
});
```

### ❌ Código mal hecho

```html
<h1><span>D</span><span>I</span><span>G</span><span>I</span><span>T</span><span>A</span><span>L</span></h1>
```

### Nota de adaptación

La voz editorial puede aparecer en story mode, pero los workspaces conservan tipografía estable y sobria.

---

## 35. Rail de progreso y navegación contextual por secciones

### En qué consiste

Una barra o rail lateral muestra la sección activa, progreso del documento y accesos anclados. Puede combinar etiquetas verticales, marcadores y un indicador continuo.

### Por qué eleva la calidad

En páginas largas evita desorientación y permite saltar entre capítulos sin abrir el menú global.

### Cuándo usarla

- Storytelling extenso, servicios, portfolios o roadmap.
- No duplicar una sidebar completa ni saturar móvil; en pantallas pequeñas se reduce a barra/contador.

### Prompt universal

“Crea un rail secundario con anchors reales, `aria-current`, indicador de progreso y scroll-spy con IntersectionObserver. Mantén el Tools Menu como navegación global; el rail solo representa el documento actual.”

### ✅ Código bien hecho

```html
<nav class="section-rail" aria-label="Secciones de esta página">
  <a href="#intro" data-section-link="intro">Inicio</a>
  <a href="#services" data-section-link="services">Servicios</a>
  <a href="#work" data-section-link="work">Proyectos</a>
  <span class="section-rail__progress" aria-hidden="true"></span>
</nav>
```

```javascript
let scrollRange = 1;
let progressFrame = 0;

const measureScrollRange = () => {
  scrollRange = Math.max(1, document.documentElement.scrollHeight - innerHeight);
};

const updateProgress = () => {
  if (progressFrame) return;
  progressFrame = requestAnimationFrame(() => {
    document.documentElement.style.setProperty('--page-progress', scrollY / scrollRange);
    progressFrame = 0;
  });
};

measureScrollRange();
addEventListener('resize', measureScrollRange, { passive: true });
addEventListener('scroll', updateProgress, { passive: true });
```

```css
.section-rail__progress::after {
  transform: scaleY(var(--page-progress));
  transform-origin: top;
}
```

### ❌ Código mal hecho

```html
<div class="side-text">Services</div>
```

**Problema:** decoración sin navegación, semántica, estado activo ni acceso por teclado.

### Nota de adaptación

Puede usarse en casos, servicios o roadmap. Dentro de un wizard, el indicador de pasos ya cumple esta función y no debe duplicarse.

---

## 36. Explorador visual adaptativo con filtros, búsqueda y bookmarks

### En qué consiste

Combina un grid editorial/masonry con búsqueda, filtros, tags, ordenamiento, guardados y estados vacíos. La técnica no es solo “poner tarjetas”: define un sistema para encontrar, comparar y conservar referencias o activos.

### Por qué eleva la calidad

Transforma una colección grande en una herramienta útil. El usuario puede reducir el espacio de búsqueda, guardar elementos y recuperar una vista sin perder contexto.

### Cuándo usarla

- Assets, inspiración, biblioteca de clientes, templates y resultados de IA.
- Cuando existen suficientes elementos para justificar filtros.
- No añadir filtros vacíos o taxonomías que nadie puede mantener.

### Prompt por entorno

- 🟢 STATIC: “Deriva resultados de `siteConfig.items`, persiste filtros y bookmarks en `localStorage`, usa URL hash opcional y renderiza estados vacío/error. No dupliques el dataset por vista.”
- 🔵 APP: “Separa query state, paginación y datos remotos. Usa URL search params y optimistic updates para bookmarks.”
- 🟣 HYBRID: “Pre-renderiza el catálogo y activa una island para filtro/búsqueda; evita hidratar cada tarjeta individual.”

### ✅ Código bien hecho

```javascript
const explorerState = new Proxy({
  query: '',
  tags: new Set(),
  savedOnly: false,
  savedIds: new Set(JSON.parse(localStorage.getItem('project:saved') || '[]'))
}, {
  set(target, key, value) {
    target[key] = value;
    renderExplorer(selectItems(window.siteConfig.items, target));
    return true;
  }
});

function selectItems(items, state) {
  const query = state.query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesQuery = !query || `${item.title} ${item.client}`.toLowerCase().includes(query);
    const matchesTags = !state.tags.size || [...state.tags].every((tag) => item.tags.includes(tag));
    const matchesSaved = !state.savedOnly || state.savedIds.has(item.id);
    return matchesQuery && matchesTags && matchesSaved;
  });
}
```

### ❌ Código mal hecho

```javascript
search.onkeyup = () => {
  document.querySelectorAll('.card').forEach((card) => {
    card.style.display = card.innerHTML.includes(search.value) ? '' : 'none';
  });
};
```

### Nota de adaptación

El grid puede ser bento/masonry, pero la jerarquía proviene de datos (prioridad, tamaño, tipo), no de tamaños aleatorios. Bookmarks y vistas guardadas deben tener estados vacíos útiles.

---

## 37. Gradient Mesh, blobs y metaballs generativos

### En qué consiste

Genera formas suaves de color mediante múltiples gradientes, SVG filters, canvas o shaders. Los blobs pueden cambiar de forma, mezclarse y reaccionar al scroll/puntero.

### Por qué eleva la calidad

Aporta una presencia orgánica y contemporánea sin recurrir a una fotografía. Puede actuar como transición, acento de cliente o campo atmosférico.

### Cuándo usarla

- Hero editorial, manifiestos y transiciones de portfolio.
- No competir con el visual principal ni usar como fondo permanente de todos los workspaces.
- Preferir CSS/SVG cuando no se necesita física o interacción compleja.

### Prompt universal

“Crea un mesh gradient con 3–5 focos de color y movimiento lento. Usa tokens de tema, limita blur y repaints, activa interacción solo con pointer fino y ofrece una composición estática para reduced motion.”

### ✅ Código bien hecho — versión CSS ligera

```css
.gradient-mesh {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 25% 25%, rgba(255,111,145,.82), transparent 34%),
    radial-gradient(circle at 72% 30%, rgba(255,190,72,.78), transparent 38%),
    radial-gradient(circle at 58% 78%, rgba(95,172,255,.72), transparent 40%),
    #f3efe8;
  filter: saturate(110%);
}

.gradient-mesh::after {
  content: '';
  position: absolute;
  inset: 12%;
  border-radius: 45% 55% 62% 38% / 42% 38% 62% 58%;
  backdrop-filter: blur(46px);
  transform: translate3d(var(--mesh-x, 0), var(--mesh-y, 0), 0);
}
```

### ❌ Código mal hecho

```css
* { filter: blur(80px); animation: blob 1s infinite alternate; }
```

### Nota de adaptación

Si la escena principal ya contiene un sistema de partículas, el mesh se usa como acento o transición, no como segundo protagonista animado.

---

## 38. Storytelling espacial inmersivo con WebGL y portales 3D

### En qué consiste

Construye un mundo 3D navegable con cámara, escenas, portales y hotspots. A diferencia de Spline Zero-Code o liquid hover, aquí la navegación y la narrativa ocurren dentro de un espacio WebGL completo.

### Por qué eleva la calidad

Permite experiencias inmersivas donde cada proyecto o capítulo es un lugar y la transición es un viaje de cámara, no un cambio de sección convencional.

### Cuándo usarla

- Experiencias de marca, portfolios experimentales o demos especiales.
- No usar para workspaces, tareas frecuentes o información que debe localizarse rápido.
- Requiere presupuesto alto, pruebas de GPU, rutas alternativas y carga progresiva.

### Prompt por entorno

- 🟢 STATIC: “Solo implementar si todos los assets y librerías pueden alojarse correctamente. Incluye una experiencia HTML 2D completa como fallback; no conviertas WebGL en requisito para usar el sitio.”
- 🔵 APP: “Usa Three.js/R3F con lazy loading de escenas, compresión de modelos/texturas, límites de DPR, cleanup de recursos y rutas semánticas sincronizadas.”
- 🟣 HYBRID: “Hidrata la experiencia inmersiva bajo demanda y conserva contenido SSR fuera del canvas.”

### ✅ Código bien hecho — arquitectura conceptual

```javascript
const sceneManifest = {
  home: { camera: 'origin', assets: ['portal-home'], fallback: '#home-content' },
  studio: { camera: 'studio', assets: ['studio-low.glb'], fallback: '#studio-content' },
  work: { camera: 'gallery', assets: ['gallery-low.glb'], fallback: '#work-content' }
};

async function enterScene(id) {
  const scene = sceneManifest[id];
  if (!scene || !supportsWebGL) return navigateToFallback(scene?.fallback || '#home-content');
  await assetManager.load(scene.assets);
  await cameraRig.travelTo(scene.camera, { reducedMotion });
  appState.spatialScene = id;
}
```

### ❌ Código mal hecho

```javascript
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(devicePixelRatio);
loadAll4KTextures();
document.body.replaceChildren(renderer.domElement);
```

### Nota de adaptación

No reemplaza automáticamente el Home ni la navegación convencional. Es una técnica opcional; el contenido principal debe seguir siendo usable sin WebGL.

---

## 39. Objeto hero funcional y coreografía de estados

### En qué consiste

Un objeto visual central representa el estado real de una herramienta: listo, analizando, procesando, encontrado, bloqueado o completado. Durante la tarea, el objeto se transforma y luego da paso a resultados accionables.

### Por qué eleva la calidad

Une feedback, progreso y emoción sin llenar la pantalla con loaders separados. En la referencia de mantenimiento, el objeto central no es adorno: explica qué módulo está activo y qué está ocurriendo.

### Cuándo usarla

- Escaneos, análisis, generación, importación y procesos con estados claros.
- No simular progreso falso ni ocultar detalles necesarios.

### Prompt universal

“Modela el proceso como state machine. El objeto hero recibe un estado semántico y cambia forma/color/motion. Muestra etiqueta, progreso real, cancelar/reintentar y transición a resultados. Reduced motion conserva cambios de icono/color/texto sin morph.”

### ✅ Código bien hecho

```javascript
const processStates = {
  idle: { label: 'Listo para analizar', icon: 'scan', tone: 'neutral' },
  running: { label: 'Analizando activos', icon: 'activity', tone: 'active' },
  review: { label: 'Resultados listos', icon: 'check', tone: 'success' },
  error: { label: 'No se pudo completar', icon: 'alert', tone: 'danger' }
};

function renderProcessHero({ status, progress = 0 }) {
  const definition = processStates[status];
  const hero = document.querySelector('[data-process-hero]');
  hero.dataset.status = status;
  hero.style.setProperty('--progress', Math.max(0, Math.min(1, progress)));
  hero.querySelector('[data-process-label]').textContent = definition.label;
  hero.querySelector('progress').value = progress;
}
```

### ❌ Código mal hecho

```javascript
let progress = 0;
setInterval(() => progress += 10, 500); // progreso inventado
```

### Nota de adaptación

Puede complementar configuradores, escaneos, generadores o procesos. El objeto funcional cambia según estado; el sistema visual global conserva la identidad.

---

## 40. Visualización radial, orbital y bubble-map de datos

### En qué consiste

Representa distribución, agrupación o tamaño mediante nodos circulares, órbitas o bubble packing. Un nodo central puede mostrar total/selección y los satélites representan categorías o activos.

### Por qué eleva la calidad

Hace visible la estructura de un conjunto de datos y permite explorar relaciones o peso relativo de forma más intuitiva que una lista plana.

### Cuándo usarla

- Assets, almacenamiento, clusters de contenido, relaciones de clientes o mapa de producción.
- No usar cuando el usuario necesita leer valores exactos rápidamente; acompañar con tabla/lista.

### Prompt universal

“Usa escalas de área, no radio, para valores cuantitativos. Añade leyenda, etiquetas, focus/teclado, tooltip y vista tabular equivalente. Evita colisiones y limita cantidad de nodos visibles.”

### ✅ Código bien hecho — preparación de nodos

```javascript
function toBubbleNodes(items) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);
  return items.map((item) => ({
    id: item.id,
    label: item.label,
    value: item.value,
    radius: 14 + Math.sqrt(item.value / maxValue) * 54,
    group: item.group
  }));
}

function announceBubble(node) {
  return `${node.label}: ${formatBytes(node.value)}`;
}
```

### ❌ Código mal hecho

```javascript
items.forEach((item) => drawCircle(item.value, item.value, item.value));
```

**Problema:** radio lineal exagera áreas, no hay escala, etiquetas, interacción ni alternativa accesible.

### Nota de adaptación

La forma visual debe corresponder a los datos y a la lectura requerida. Círculos, barras, áreas o nodos son válidos cuando representan correctamente la información.

---

## 41. Theming ambiental semántico por módulo

### En qué consiste

Cada módulo puede tener un tono ambiental controlado —por ejemplo, verde para limpieza/estado sano, naranja para rendimiento, turquesa para recursos y violeta para análisis— sin cambiar la estructura ni multiplicar estilos arbitrarios.

### Por qué eleva la calidad

Ayuda a reconocer contexto y estado de un vistazo. El color deja de ser decoración y se convierte en señal funcional.

### Cuándo usarla

- Workspaces con funciones claramente diferenciadas.
- Estados de proceso y resultados.
- No depender solo del color ni reemplazar la identidad principal.

### Prompt universal

“Define tokens `--module-accent`, `--module-glow`, `--status-*` desde un manifest. Cambia ambient background, objeto hero y estados activos; conserva texto, controles y shell con contraste estable. Añade icono/etiqueta para no depender del color.”

### ✅ Código bien hecho

```javascript
const moduleThemes = {
  strategy: { accent: '#64d98b', glow: 'rgba(100,217,139,.24)', label: 'Estrategia' },
  performance: { accent: '#ff9a4d', glow: 'rgba(255,154,77,.24)', label: 'Rendimiento' },
  library: { accent: '#5dd7d0', glow: 'rgba(93,215,208,.22)', label: 'Biblioteca' },
  creation: { accent: '#9b75ff', glow: 'rgba(155,117,255,.24)', label: 'Creación' }
};

function applyModuleTheme(moduleId) {
  const theme = moduleThemes[moduleId] || moduleThemes.creation;
  const style = document.documentElement.style;
  style.setProperty('--module-accent', theme.accent);
  style.setProperty('--module-glow', theme.glow);
  document.querySelector('[data-module-label]').textContent = theme.label;
}
```

### ❌ Código mal hecho

```css
.module:nth-child(1) { background: red; }
.module:nth-child(2) { background: blue; }
.module:nth-child(3) { background: lime; }
```

### Nota de adaptación

El color ambiental pertenece al contexto funcional. La navegación, la tipografía y el shell mantienen la identidad global; los acentos contextuales aparecen solo donde corresponden.

---

# Perfiles de aplicación rápida

Estos perfiles orientan a la IA antes de elegir técnicas. No sustituyen el análisis del proyecto.

| Tipo de página | Estructura mínima recomendada | Nivel de motion | Resultado principal |
|---|---|---|---|
| Landing de conversión | Hero con promesa + problema + mecanismo + beneficios + prueba + objeciones + CTA | Bajo o medio; concentrado en Hero y prueba | Lead, compra, reserva o contacto |
| Corporativa / servicios | Propuesta + servicios + sectores + casos + proceso + confianza + equipo + contacto | Bajo o medio; sobrio | Autoridad y solicitud comercial |
| E-commerce | Navegación + categorías + filtros + catálogo + ficha + confianza + carrito + checkout | Bajo durante compra; funcional | Descubrir, comparar y comprar |
| Portfolio / agencia | Manifiesto + proyectos seleccionados + casos detallados + capacidades + proceso + contacto | Medio o alto si la marca lo soporta | Demostrar criterio y generar contacto |
| Editorial / blog | Navegación + búsqueda + categorías + artículo legible + relacionados + suscripción | Bajo; no interrumpir lectura | Consumo y descubrimiento de contenido |
| SaaS marketing | Promesa + demo + problema + capacidades + integraciones + prueba + precios + FAQ + CTA | Medio; orientado a explicar producto | Registro, demo o prueba |
| Web app / dashboard | Onboarding + navegación + workspace + estados + ayuda + resultados + ajustes | Mínimo y funcional | Completar una tarea con eficiencia |
| Experiencia inmersiva | Entrada + instrucciones + escenas + navegación + contenido equivalente 2D + salida/CTA | Alto, con reduced motion y fallback | Exploración, impacto o narrativa de marca |

## Prompt de activación universal

```text
Usa la biblioteca HTML REFERENCES UNIVERSAL.

1. Separa mi petición, los resultados anteriores y mis correcciones.
2. Completa projectProfile con la información disponible.
3. Detecta el tipo de página, el entorno técnico y la superficie.
4. Selecciona únicamente las técnicas necesarias y justifica cada una.
5. Indica qué técnicas descartas por rendimiento, accesibilidad o falta de utilidad.
6. Propón la arquitectura de información y el flujo antes del estilo.
7. Genera código en el entorno indicado, con contenido editable, responsive, estados completos y fallback.
8. Verifica el Fidelity Gate Universal antes de entregar.

PETICIÓN DEL PROYECTO:
[Escribe aquí el objetivo, público, oferta, contenido, marca, referencias y restricciones.]
```

---

# Matriz final de selección

La IA debe usar esta matriz como punto de partida y luego justificar cada técnica.

| Petición / objetivo | Base obligatoria | Técnicas candidatas | Técnicas a evitar por defecto |
|---|---|---|---|
| Landing de conversión | 2, 3, 4 | 1, 6, 7, 9, 13, 23, 32, 33, 34, 37 | 8, 14, 20, 38 si no existe razón fuerte |
| Web corporativa / servicios | 2, 3, 4, 26, 27, 31 | 1, 7, 13, 28, 32–35, 37 | Exceso de animación antes de explicar oferta y confianza |
| E-commerce | 2, 3, 4, 26, 31, 36 | 7, 22, 32, 33, 35, 39, 41 | Scrolljacking, cursores custom y WebGL en compra/checkout |
| Home de producto o aplicación | 2, 4, 26, 27, 31 | 1, 5, 9, 13, 15, 23–25, 32–35, 37 | 8 o 38 como sustitutos automáticos del contenido |
| Storytelling de producto | 2, 4, 28, 31 | 1, 6, 7, 10, 12, 13, 15, 20, 21, 24, 32–35, 37, 38 | 29 dentro de la narrativa |
| Portfolio / agencia / casos | 2, 4, 7, 28, 31 | 10, 12–14, 18, 19, 22, 23, 32–38 | Homogenizar todos los proyectos o esconder información tras efectos |
| Editorial / blog / contenido | 2, 4, 26, 31 | 7, 13, 18, 28, 32, 33, 35, 36 | Motion que interrumpe lectura y tipografía experimental en cuerpo |
| SaaS / web app | 2, 4, 5, 15, 26, 31 | 27, 29, 30, 35, 39–41 | Decoración constante dentro del flujo de trabajo |
| Dashboard / herramienta interna | 2, 4, 5, 26, 31 | 29, 30, 35, 39–41 | 6, 10–14, 16–21, 23, 37, 38 salvo función explícita |
| Herramienta o wizard | 2, 4, 5, 29, 30, 31 | 15, 39, 40, 41 y motion funcional mínimo | 6, 10–14, 16–21, 23, 37, 38 salvo función explícita |
| Catálogo / galería / activos | 2, 4, 7, 22, 31, 36 | 8, 14, 18, 19, 23, 32–35, 37, 38, 40 | Grid sin búsqueda/filtros o WebGL sin fallback |
| Navegación global | 26, 31 | 5, 15, 25, 27, 30, 35 | Ocultar rutas esenciales o imponer SPA sin necesidad |
| Asistente contextual | 5, 30, 31 | 15, 26 | API keys o prompts sin contexto |
| Explorador de referencias/activos | 2, 4, 5, 31, 36 | 7, 22, 32, 35, 40 | Grid visual sin búsqueda ni estados vacíos |
| Escaneo, análisis o generación | 4, 5, 29, 31, 39 | 7, 9, 30, 40, 41 | Progreso inventado o animación sin estado real |
| Experiencia inmersiva especial | 4, 15, 31, 38 | 1, 7, 10, 14, 33 | Sustituir la app principal o eliminar fallback 2D |
| CMS / WordPress / Shopify | 2, 3, 4, 26, 31 | Según tipo de página; técnicas aisladas como bloques editables | Editar core, hardcodear contenido o romper el editor |
| Sitio static/offline | 2, 4 | 1, 5, 7, 15, 25–37 y 39–41 con fallback | 38 salvo assets incluidos; dependencia crítica sin degradación |

## Regla de economía

Antes de incluir una técnica visual, la IA debe responder:

1. ¿Qué problema concreto resuelve?
2. ¿Cómo mejora comprensión, conversión o control?
3. ¿Qué costo añade en rendimiento y mantenimiento?
4. ¿Cuál es su fallback accesible/offline?
5. ¿Compite con el visual principal, el contenido o la acción primaria?

Si no puede responder con precisión, la técnica no se aplica.

---

# Fidelity Gate Universal

## Arquitectura y navegación

- [ ] Se detectó correctamente 🟢 STATIC, 🔵 APP, 🟣 HYBRID o 🟠 CMS.
- [ ] Se clasificaron el tipo de página y la superficie.
- [ ] La navegación usa enlaces reales, routing o estado según el entorno.
- [ ] Existe una fuente de verdad para contenido, configuración y estado relevante.
- [ ] El bootstrap es explícito y no ejecuta módulos antes de definir dependencias.
- [ ] El comportamiento inicial está definido según el producto.
- [ ] Navegación, búsqueda, breadcrumbs y sidebar aparecen solo cuando aportan orientación.
- [ ] En CMS, el contenido requerido queda editable y no se modifica el core.

## Diseño y jerarquía

- [ ] La anatomía responde al objetivo y no parece una plantilla genérica.
- [ ] Narrative mode usa ritmo editorial; workspace prioriza claridad operativa.
- [ ] Los materiales visuales coinciden con la marca y tienen propósito.
- [ ] Si existe glass, no hay glass-on-glass ni pérdida de contraste.
- [ ] Spacing, radios y tipografía siguen una escala consistente.
- [ ] Body 16–18px y títulos con escala contenida.
- [ ] Existe una sola acción primaria por escena/paso.
- [ ] Los iconos pertenecen a un sistema coherente y no usan emojis funcionales.
- [ ] Los acentos contextuales no destruyen la identidad global.

## Negocio, contenido y conversión

- [ ] La propuesta de valor puede entenderse sin depender de la animación.
- [ ] El público, problema y acción primaria están claros.
- [ ] Los CTA corresponden al objetivo comercial u operativo.
- [ ] Prueba, confianza, precio y objeciones aparecen cuando el tipo de página los requiere.
- [ ] El contenido no usa Lorem Ipsum ni promesas genéricas.
- [ ] SEO, metadata, headings y enlaces se ajustan a la arquitectura elegida.

## Movimiento y accesibilidad

- [ ] Todas las técnicas animadas respetan `prefers-reduced-motion`.
- [ ] Los workspaces no contienen movimiento decorativo.
- [ ] El cursor nativo se conserva en workspaces y touch.
- [ ] Controles, hotspots y carruseles funcionan con teclado.
- [ ] El foco es visible y se restaura al cerrar popovers/ventanas.
- [ ] Ninguna información esencial depende exclusivamente de hover.
- [ ] La experiencia conserva sentido sin WebGL, GSAP o red.
- [ ] Sticky showcases indican el capítulo activo y tienen fallback móvil.
- [ ] El rail de progreso usa anchors y `aria-current`, no es decoración.
- [ ] La tipografía cinética conserva el orden de lectura.

## Rendimiento

- [ ] Imágenes/videos tienen dimensiones o `aspect-ratio`.
- [ ] Media no crítica usa lazy load y no produce CLS.
- [ ] Videos y escenas se pausan fuera del viewport.
- [ ] Todo canvas o sistema generativo adapta densidad y resolución.
- [ ] No hay listeners de scroll que recalculen layout por píxel.
- [ ] Las dependencias críticas tienen fallback o estrategia de fallo.
- [ ] Las transiciones de tema mantienen contraste durante toda la interpolación.
- [ ] Mesh gradients y escenas WebGL detienen su render fuera del viewport.
- [ ] Una experiencia 3D inmersiva conserva contenido 2D accesible y navegable.

## Exploración, procesos y datos

- [ ] El explorador visual incluye búsqueda/filtros solo cuando existen datos que los justifican.
- [ ] Bookmarks y vistas guardadas tienen estado vacío y persistencia definida.
- [ ] El grid se deriva de datos; los tamaños no son aleatorios.
- [ ] El objeto hero representa estados reales de la herramienta.
- [ ] El progreso mostrado es real o se identifica honestamente como indeterminado.
- [ ] Las visualizaciones radiales usan escalas correctas, leyenda y alternativa tabular.
- [ ] El theming ambiental comunica contexto y no depende solo del color.

## Sistemas avanzados opcionales

- [ ] La forma de un sistema de partículas deriva de la marca o del significado de los datos.
- [ ] Los hotspots son visibles, explicativos y accionables.
- [ ] El morph responde al contenido/contexto.
- [ ] El sistema generativo persiste solo cuando conservarlo aporta valor.
- [ ] El asistente contextual usa la superficie adecuada para escritorio y móvil.
- [ ] El asistente recibe sección, entidad, paso, selección y bloqueos relevantes.
- [ ] “Preparar pregunta para IA” copia contexto útil.
- [ ] No hay API keys ni secretos en HTML/localStorage.
- [ ] El modelo de dominio, datos, integraciones y flujos no autorizados permanecen intactos.

## Integridad de la entrega

- [ ] Se explican las técnicas seleccionadas y también las descartadas relevantes.
- [ ] No hay `Lorem Ipsum`, placeholders ambiguos ni TODOs.
- [ ] El código incluye estados de error, vacío, carga y recuperación cuando aplican.
- [ ] Los bloques de código están completos y correctamente cerrados.
- [ ] La solución puede probarse en el entorno declarado.

---

# Cierre

Esta biblioteca no es una lista de efectos. Es un sistema de decisión. La IA debe empezar por la petición, conservar las restricciones, elegir la arquitectura correcta y aplicar únicamente las técnicas que mejoran el resultado.

La calidad de una implementación se reconoce cuando:

- el Home tiene identidad y propósito;
- la navegación conserva contexto;
- cada herramienta guía una tarea concreta;
- la ayuda contextual aparece solo cuando aporta valor;
- las escenas narrativas tienen ritmo y no ruido;
- el sistema funciona con claridad, rendimiento y accesibilidad incluso cuando los efectos se degradan.
