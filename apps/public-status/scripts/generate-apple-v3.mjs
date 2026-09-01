import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');
const docsDir = path.join(rootDir, 'docs/abraxas-os-status');

// Ingest canonical datasets
const corpusPath = path.resolve(__dirname, '../src/data/canonical-corpus-files.json');
const corpusFiles = JSON.parse(fs.readFileSync(corpusPath, 'utf-8'));

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const actsData = {
  es: [
    {
      num: "01",
      chip: "CHIP ATZILUTH",
      tag: "01. ATZILUTH & KETER // LA SEMILLA MAESTRA DE MARCA",
      title: "Elimina el pánico a la página en blanco: 1 sola tesis alimenta 8 canales a la vez.",
      pain: "Pasar días pensando ideas desconectadas para reels, carruseles, newsletters y posts de LinkedIn, terminando con contenido genérico que nadie recuerda.",
      solution: "Convierte una sola tesis de marca validada en la semilla matriz que genera automáticamente todo tu despliegue multicanal.",
      howItWorks: "Configuras tu voz de marca y pilares de autoridad una sola vez. YOD genera una tesis angular calificada de 0 a 100 de la que nacen 8 formatos listos.",
      cabala: "Atziluth (Emanación) y Keter (La Corona). La Voluntad Pura (state = NULL). Una sola intención se ramifica en infinitas expresiones sin perder identidad.",
      plate: "assets/plates/plate_01_hero.webp"
    },
    {
      num: "02",
      chip: "CHIP CHOKHMAH",
      tag: "02. CHOKHMAH & YOD // RADAR DE GANCHOS MULTICANAL",
      title: "Detén el scroll en los primeros 3 segundos en videos, carruseles, hilos y emails.",
      pain: "Publicar contenido valioso en múltiples redes que la gente ignora de inmediato porque el gancho del video, la portada del carrusel o el asunto del email es aburrido.",
      solution: "Genera ganchos dialécticos calificados de 0 a 100 adaptados para frenar el scroll en videos cortos, carruseles de Instagram, hilos de X y bandejas de correo.",
      howItWorks: "YOD escanea los puntos ciegos de tu nicho y entrega 3 variantes de apertura por formato. Si el gancho no supera 85/100, exige optimizarlo antes de grabar.",
      cabala: "Chokhmah (Sabiduría) y Módulo YOD (י). El relámpago primordial (Kav) que rompe la inercia cósmica y despierta el interés inmediato en todos los planos.",
      plate: "assets/plates/plate_06_arquitecto_lens.webp"
    },
    {
      num: "03",
      chip: "CHIP BERI'AH",
      tag: "03. BERI'AH & CONTINUIDAD // EL EJE DE CONTINUIDAD (1 IDEA -> 8 FORMATOS)",
      title: "Fin a reescribir lo mismo 5 veces: actualiza tu guion y sincroniza 8 formatos automáticamente.",
      pain: "Reescribir manualmente la misma idea para TikTok, carruseles, LinkedIn y emails, terminando con 20 archivos desordenados y mensajes desincronizados.",
      solution: "Otorga a cada proyecto un contentId inmutable en un Eje de Continuidad vertical donde 8 formatos derivados se actualizan solos en tiempo real.",
      howItWorks: "Contenido usa un árbol de datos Merkle-DAG. Si editas una frase del guion, los subtítulos del video 9:16, las láminas del carrusel 4:5 y la newsletter se actualizan al unísono.",
      cabala: "Beri'ah (Creación) y La Gran Pirámide. La vasija indestructible (Keli) que contiene la luz creativa a lo largo de un eje vertical unificado, evitando el caos.",
      plate: "assets/plates/plate_03_continuity_axis.webp"
    },
    {
      num: "04",
      chip: "CHIP SEFIROT",
      tag: "04. TOPOLOGÍA SEFIROTICA // SUITE UNIFICADA DE 13 MÓDULOS",
      title: "Reemplaza 8 aplicaciones desconectadas por un solo sistema operativo multicanal soberano.",
      pain: "Perder horas saltando entre Notion para notas, Figma/Canva para carruseles, Premiere para videos, Typefully para X, Mailchimp para emails y Drive para almacenar.",
      solution: "Un solo sistema operativo soberano donde todo tu ecosistema de contenidos fluye de Idea -> Generación Multiformato -> Verificación -> Auto-Edición -> Publicación.",
      howItWorks: "Unifica redacción de guiones, teleprompter, diseño de carruseles, normalización de audio, auto-edición de video y publicación en lote en una sola ventana de macOS.",
      cabala: "Topología del Árbol de la Vida. Las 10 Sefirot son los estados naturales del contenido; los 13 Módulos de ABRAXAS son los verbos que ejecutan la transformación.",
      plate: "assets/plates/plate_10_master_monument.webp"
    },
    {
      num: "05",
      chip: "CHIP DA'AT",
      tag: "05. DA'AT & SHIM // VERIFICACIÓN EMPÍRICA MULTI-MODAL EN VIVO",
      title: "Cero errores en el set, cero datos equivocados y cero subtítulos desincronizados.",
      pain: "Grabar durante 2 horas para descubrir que te comiste una frase clave, tuviste clipping de audio o cometiste un error de datos en las láminas de tu carrusel.",
      solution: "La IA de metrología SHIM escucha tu grabación en vivo y audita las diapositivas visuales, avisándote al instante para corregir en segundos antes de exportar.",
      howItWorks: "SHIM usa Whisper Large V3 Turbo y visión computacional para auditar audio y texto palabra por palabra contra el guion, marcando omisiones con 0.00% de tolerancia a fallos.",
      cabala: "Da'at (Conocimiento Lúcido) y La Letra Shin (ש). Da'at es la lucidez de la conciencia saltando a la acción física. Es el umbral donde la intención se confronta con la verdad observada.",
      plate: "assets/plates/plate_04_shim_metrology.webp"
    },
    {
      num: "06",
      chip: "CHIP YHSHVH",
      tag: "06. YHSHVH & CAS // BÓVEDA CRIPTOGRÁFICA MULTI-FORMATO",
      title: "Cero archivos perdidos, cero proyectos rotos y cero pérdida de calidad por compresión.",
      pain: "Abrir proyectos y encontrarse la pantalla roja de Media Offline, láminas de carruseles borradas o videos que pierden nitidez al subirlos a la nube.",
      solution: "Congela videos, carruseles, audios y copys en un solo bloque blindado con sello criptográfico SHA-256 que nunca se corrompe ni pierde resolución.",
      howItWorks: "Guarda los activos en Almacenamiento Direccionado por Contenido (CAS). Mover carpetas de disco nunca rompe enlaces y todos los medios cargan al instante con 100% de calidad.",
      cabala: "Sello YHSHVH (Pentagramatón). Las 4 barras del cuerpo material (Y-H-V-H) reciben el fuego sagrado de Shin (ש) en su centro, sellando el espíritu con la materia en un cuerpo indestructible.",
      plate: "assets/plates/plate_08_he_assiah_operations.webp"
    },
    {
      num: "07",
      chip: "CHIP MATRIX",
      tag: "07. QABALAH RELACIONAL // VELOCIDAD DE PRODUCCIÓN Y AUDITORÍA DE COSTOS",
      title: "Mide costos exactos, cuellos de botella del equipo y velocidad de entrega en todos los formatos.",
      pain: "No saber por qué la producción de contenidos se atrasa, qué colaborador está bloqueado o cuánto dinero te cuesta realmente producir tu volumen mensual multicanal.",
      solution: "Tablas de control relacionales que auditan tiempos de entrega, cuellos de botella del equipo y costo por pieza al centavo para videos, carruseles y textos.",
      howItWorks: "Registra cada edición, ciclo de revisión, tiempo de renderizado y aprobación en una base de datos local SQLite. En un clic auditas la eficiencia total de tu equipo.",
      cabala: "Qabalah Occidental de Dion Fortune. Traducir la potencia creativa intuitiva a leyes matemáticas exactas, estructuras transparentes y métricas auditables para mantener gobierno total.",
      plate: "assets/plates/plate_09_system_dashboard.webp"
    },
    {
      num: "08",
      chip: "CHIP XYZA",
      tag: "08. ESPACIO XYZA // ESTRATIGRAFÍA DE CONTENIDOS POR OBJETIVO",
      title: "Adapta cada video, carrusel e hilo a su objetivo exacto en el embudo de ventas.",
      pain: "Tratar todo el contenido igual: hacer videos educativos con ritmo aburrido o publicar carruseles con demasiado texto que no convierten seguidores en clientes.",
      solution: "El motor modula automáticamente la velocidad de cortes, la densidad de texto y el estilo visual según el objetivo específico de cada pieza en el embudo.",
      howItWorks: "Mapea activos en 4D: Polaridad (X), Manifestación (Y), Contexto (Z) y Memoria (A). Los contenidos de atracción reciben cortes rápidos; los carruseles educativos reciben alta densidad.",
      cabala: "Espacio de Estados Cuatridimensional XYZA. Cada creación ocupa una coordenada de fase exacta entre la expansión y la restricción para lograr su manifestación perfecta en el embudo.",
      plate: "assets/plates/plate_08_contenido_portal.webp"
    },
    {
      num: "09",
      chip: "CHIP APEX",
      tag: "09. CÚSPIDE Y EL OJO // TELEMETRÍA DE HARDWARE APPLE SILICON",
      title: "Cero Macs sobrecalentadas, cero líneas de tiempo congeladas y cero cuelgues al 99%.",
      pain: "Que tu editor se congele al 99% del renderizado, los ventiladores suenen como turbinas y la máquina colapse al exportar lotes pesados de contenido multicanal.",
      solution: "Monitorea memoria y temperatura de Apple Silicon en tiempo real, exportando lotes de 50 videos y carruseles simultáneamente sin un solo cuelgue.",
      howItWorks: "El Ojo se conecta directamente a los procesadores Apple Silicon (M1/M2/M3/M4) mediante Metal y VideoToolbox, balanceando la carga entre GPU y Neural Engine sin estrangulamiento térmico.",
      cabala: "El Ojo del Ápice en la Pirámide. La mirada vigilante que supervisa el flujo de energía en la cúspide para garantizar que el templo físico no sufra rupturas de tensión.",
      plate: "assets/plates/plate_06_optical_port_eye.webp"
    },
    {
      num: "10",
      chip: "CHIP VAV",
      tag: "10. VAV SÍNTESIS // FORJA INDUSTRIAL MULTI-FORMATO EN 18 SEGUNDOS",
      title: "Auto-edita videos en 18s, genera tipografía cinética, renderiza carruseles y formatea hilos.",
      pain: "Perder 8 horas cortando pausas a mano en Premiere, diseñando láminas de carruseles en Canva y reformateando textos para cada red social.",
      solution: "Corta silencios muertos, pone subtítulos animados virales, inyecta sonido sub-bajo a 45Hz y exporta diapositivas gráficas e hilos formateados en segundos.",
      howItWorks: "La catedral VAV ejecuta cortes con microsegundos de precisión, aplica 13 familias de movimiento en Remotion, normaliza audio a -14 LUFS y genera láminas de carrusel en alta resolución.",
      cabala: "Módulo VAV (ו) // El Gancho Universal en Yetzirah. En hebreo, Vav es el gancho sagrado que une el sonido, la tipografía, el movimiento y la imagen en un solo cuerpo vivo sensorial.",
      plate: "assets/plates/plate_05_vav_cathedral.webp"
    },
    {
      num: "11",
      chip: "CHIP HE",
      tag: "11. DESPACHO DE HE // GOBIERNO DE 50 ACTIVOS MULTICANAL EN UNA TARDE",
      title: "Produce, aprueba y programa un mes entero de contenido multicanal en una sola tarde.",
      pain: "Sentirse abrumado intentando publicar diario en 5 redes sociales, perdiendo fechas límite y dependiendo de agencias costosas para mantener volumen.",
      solution: "Un tablero Kanban nativo en macOS donde un solo creador u operador organiza, aprueba y exporta 50 activos multicanal en una sola tarde.",
      howItWorks: "Arrastras proyectos a través de 6 compuertas de calidad (Idea -> Guion -> Grabación -> Verificación -> Síntesis -> Aprobado). La aprobación en un clic exporta un mes de contenido.",
      cabala: "Módulo HE (ה) // El Taller de Manifestación en Assiah. El mundo físico de la acción concreta donde el operador humano toma el control con sus manos para gobernar la manufactura final.",
      plate: "assets/plates/plate_02_he_macro.webp"
    },
    {
      num: "12",
      chip: "CHIP MOON",
      tag: "12. LA LUNA CELESTE // BUCLE CERRADO DE APRENDIZAJE MULTICANAL",
      title: "Convierte la retención real de tus videos, carruseles e hilos en contenido futuro más efectivo.",
      pain: "Publicar a ciegas en TikTok, Instagram y LinkedIn sin entender por qué un formato funcionó y otro fracasó, repitiendo los mismos errores siempre.",
      solution: "Mide la curva exacta de retención de video, la tasa de lectura de carruseles y la interacción de hilos, retroalimentando al sistema para el próximo lote.",
      howItWorks: "Metrics consolida el rendimiento real en la Dimensión A: S(t+1) = S(t) + A(t). El sistema aprende qué ganchos y formatos retienen más para que tu próximo mes sea más viral.",
      cabala: "La Luna Celeste y el Retorno Telemétrico. La luna refleja la luz hacia la Tierra y devuelve las mareas telemétricas hacia el Sol/YOD. La creación es una espiral infinita de aprendizaje.",
      plate: "assets/plates/plate_07_moon_loop.webp"
    }
  ],
  en: [
    {
      num: "01",
      chip: "CHIP ATZILUTH",
      tag: "01. ATZILUTH & KETER // THE CORE BRAND SEED",
      title: "Kill blank-page panic: generate a master brand thesis that feeds 8 content channels at once.",
      pain: "Spending days brainstorming disjointed ideas for reels, carousels, newsletters, and LinkedIn posts, ending up with generic fluff that nobody remembers.",
      solution: "Destroys creative friction by turning one unshakeable brand thesis into the master seed that powers your entire multi-channel content ecosystem.",
      howItWorks: "You set your brand voice, authority pillars, and forbidden topics once. YOD outputs a certified master thesis scored 0-100 that automatically branches into 8 platform-specific formats.",
      cabala: "Atziluth (Emanation) & Keter (The Crown). Pure Intention and Criterion (state = NULL). In universal creation, one pure intention branches into infinite physical expressions without losing identity.",
      plate: "assets/plates/plate_01_hero.webp"
    },
    {
      num: "02",
      chip: "CHIP CHOKHMAH",
      tag: "02. CHOKHMAH & YOD // MULTI-CHANNEL HOOK & NARRATIVE RADAR",
      title: "Stop the 3-second scroll drop across videos, carousels, threads, and newsletters.",
      pain: "Publishing valuable content across multiple networks that gets instantly ignored because the opening hook, carousel title, or email subject line is boring.",
      solution: "Generates dialectic opening hooks scored 0-100 tailored to stop the scroll on short video, swipe carousels, X threads, and email inboxes.",
      howItWorks: "YOD scans audience blind spots and crafts 3 contrarian hook angles per format. If a hook scores below 85/100, the system forces optimization before you record or publish.",
      cabala: "Chokhmah (Wisdom) & Module YOD (י). The primordial lightning spark (Kav) that shatters cosmic inertia, commanding immediate attention across all perceptual planes.",
      plate: "assets/plates/plate_06_arquitecto_lens.webp"
    },
    {
      num: "03",
      chip: "CHIP BERI'AH",
      tag: "03. BERI'AH & CONTINUITY // THE 1-IDEA TO 8-FORMAT CONTINUITY AXIS",
      title: "End fragmented rework: update your script once and sync all 8 formats automatically.",
      pain: "Manually re-writing the same concept 5 times for TikTok, carousels, LinkedIn, and email, resulting in 20 messy doc files and desynchronized messaging.",
      solution: "Assigns every project an immutable contentId on a vertical Continuity Axis where 8 content derivatives update simultaneously in real time.",
      howItWorks: "Contenido uses a Merkle-DAG data tree. Edit a single sentence in your script, and the 9:16 reel captions, 4:5 carousel slides, X thread, and newsletter update in lockstep without broken files.",
      cabala: "Beri'ah (Creation) & The Basalt Pyramid. The indestructible vessel (Keli) that contains creative light along a unified vertical axis, preventing structural entropy and drift.",
      plate: "assets/plates/plate_03_continuity_axis.webp"
    },
    {
      num: "04",
      chip: "CHIP SEFIROT",
      tag: "04. SEFIROTIC TOPOLOGY // UNIFIED 13-MODULE PRODUCTION SUITE",
      title: "Replace 8 disconnected apps with one sovereign multi-format operating system.",
      pain: "Juggling Notion for scripts, Figma/Canva for carousels, Premiere for video, Typefully for X, Mailchimp for emails, and Drive for storage, losing hours in context switching.",
      solution: "A single sovereign OS where your content ecosystem moves from Idea -> Multi-Format Generation -> Verification -> Auto-Synthesis -> Publishing in one fluid flow.",
      howItWorks: "Unifies scriptwriting, teleprompter, carousel layout, audio normalization, video auto-editing, and batch publishing inside a single native macOS workspace without cloud delays.",
      cabala: "Tree of Life Topology. The 10 Sephirot are the natural states of content (Thesis, Draft, Visual Layout, Rendered Media); the 13 ABRAXAS Modules are the active verbs driving transmutation.",
      plate: "assets/plates/plate_10_master_monument.webp"
    },
    {
      num: "05",
      chip: "CHIP DA'AT",
      tag: "05. DA'AT & SHIM // LIVE MULTI-MODAL TRUTH VERIFICATION",
      title: "Zero on-set blunders, zero fact errors, and zero desynchronized captions.",
      pain: "Recording for 2 hours only to realize you forgot a crucial point, had audio clipping, or made a factual mistake in your carousel slides after posting.",
      solution: "The SHIM AI inspects your recording live and audits visual slides, alerting you on the spot to correct errors in seconds before exporting.",
      howItWorks: "SHIM runs Whisper Large V3 Turbo and computer vision to verify audio and text word-by-word against your planned script, marking missing phrases in red with 0.00% GAP tolerance.",
      cabala: "Da'at (Awakened Consciousness) & The Letter Shin (ש). Da'at is the lucidity of consciousness leaping into physical execution. It is the gate where planned intent meets observed reality.",
      plate: "assets/plates/plate_04_shim_metrology.webp"
    },
    {
      num: "06",
      chip: "CHIP YHSHVH",
      tag: "06. YHSHVH & CAS // CRYPTOGRAPHIC MULTI-FORMAT VAULT",
      title: "Never lose media, break project links, or suffer cloud compression degradation.",
      pain: "Opening your projects to red Missing Media offline screens, broken carousel assets, or video quality butchered by cloud compression tools.",
      solution: "Freezes all videos, carousels, slides, audio stems, and written copys into an immutable SHA-256 cryptographic vault that never corrupts.",
      howItWorks: "Stores assets in Content-Addressable Storage (CAS). Moving disk folders or updating assets never breaks links, and all media renders at 100% native bit depth.",
      cabala: "The Seal of YHSHVH (Pentagrammaton). The 4 material elements (Y-H-V-H) receive the living flame of Shin (ש) at their core, sealing spirit and matter into an indestructible physical body.",
      plate: "assets/plates/plate_08_he_assiah_operations.webp"
    },
    {
      num: "07",
      chip: "CHIP MATRIX",
      tag: "07. RELATIONAL MATRIX // INDUSTRIAL PRODUCTION VELOCITY & COST AUDIT",
      title: "Track exact production costs, team bottlenecks, and turnaround speed across all formats.",
      pain: "Not knowing why content production is delayed, which team member is bottlenecked, or how much it actually costs to output your monthly content volume.",
      solution: "Real-time relational dashboards auditing turnaround times, team task states, and cost-per-asset down to the cent for videos, carousels, and copy.",
      howItWorks: "Logs every edit, review cycle, render duration, and approval in local SQLite tables. In one click, you audit your entire production pipeline efficiency.",
      cabala: "Western Qabalah of Dion Fortune. Translating intuitive creative power into exact mathematical relations, transparent structures, and auditable metrics to maintain sovereignty over matter.",
      plate: "assets/plates/plate_09_system_dashboard.webp"
    },
    {
      num: "08",
      chip: "CHIP XYZA",
      tag: "08. XYZA STATE-SPACE // MULTI-FORMAT CONTENT STRATIGRAPHY",
      title: "Tailor every video, carousel, and thread to its exact funnel goal with surgical pacing.",
      pain: "Treating all content the same: creating boring educational videos with viral pacing, or publishing carousels too text-heavy to convert followers into clients.",
      solution: "Automatically adapts visual density, cut speed, typography weight, and narrative depth to match the specific funnel objective of each piece.",
      howItWorks: "Maps assets across 4 dimensions: Polarity (X), Manifestation (Y), Context (Z), and Memory (A). Top-of-funnel gets punchy jump cuts; mid-funnel carousels get high information density.",
      cabala: "Four-Dimensional State Space XYZA. Nothing in the cosmos floats arbitrarily: every creation occupies an exact phase coordinate between expansion and restriction for perfect manifestation.",
      plate: "assets/plates/plate_08_contenido_portal.webp"
    },
    {
      num: "09",
      chip: "CHIP APEX",
      tag: "09. THE APEX & THE EYE // APPLE SILICON HARDWARE TELEMETRY",
      title: "Zero overheating Macs, zero frozen timelines, and zero 99% render crashes.",
      pain: "Your editing software freezing at 99% render, laptop fans screaming, and machines crashing when exporting heavy batches of multi-format media.",
      solution: "Monitors Apple Silicon hardware memory and temperature in real time, batch-exporting 50 videos and carousels simultaneously with zero freezes.",
      howItWorks: "The Eye connects directly to Apple Silicon chips (M1/M2/M3/M4) via Metal and VideoToolbox, balancing compute across GPU and Neural Engine cores for maximum throughput.",
      cabala: "The Eye of the Apex. The vigilant watcher overseeing energy flow at the pyramid summit, ensuring the physical vessel never suffers structural breakdown.",
      plate: "assets/plates/plate_06_optical_port_eye.webp"
    },
    {
      num: "10",
      chip: "CHIP VAV",
      tag: "10. VAV SYNTHESIS // AUTOMATED 18-SECOND MULTI-FORMAT FORGE",
      title: "Auto-cut video in 18s, generate kinetic typography, render carousel slides, and format threads.",
      pain: "Spending 8 hours manually cutting video pauses in Premiere, designing carousel slides in Canva, and reformatting text posts for social networks.",
      solution: "Trims silences, renders bouncy viral captions, injects 45Hz sub-bass sound design, and formats carousels and text threads in seconds.",
      howItWorks: "The VAV Cathedral auto-edits jump cuts with sub-millisecond precision, applies 13 Remotion motion families, normalizes audio to -14 LUFS, and exports high-res graphic slides.",
      cabala: "Module VAV (ו) // The Universal Hook in Yetzirah. Vav is the sacred hook that joins sound, typography, motion, and image into a unified, living multi-format sensory organism.",
      plate: "assets/plates/plate_05_vav_cathedral.webp"
    },
    {
      num: "11",
      chip: "CHIP HE",
      tag: "11. HE GOVERNANCE // 50-ASSET MULTI-CHANNEL BATCH DESK",
      title: "Produce, approve, and schedule an entire month of multi-format content in one afternoon.",
      pain: "Feeling overwhelmed managing daily posting across 5 social networks, missing deadlines, and needing a large expensive agency team to maintain volume.",
      solution: "A native macOS Kanban desk where a single creator or operator governs, approves, and batch-exports 50 multi-channel assets in one afternoon.",
      howItWorks: "Drag project cards across 6 quality gates (Idea -> Script -> Record -> Verify -> Synthesize -> Approved). One-click batch approval exports an entire month of content.",
      cabala: "Module HE (ה) // The Physical Workshop in Assiah. The concrete world of tangible execution where the human operator takes sovereign command over physical manifestation.",
      plate: "assets/plates/plate_02_he_macro.webp"
    },
    {
      num: "12",
      chip: "CHIP MOON",
      tag: "12. THE CELESTIAL MOON // CLOSED-LOOP MULTI-CHANNEL LEARNING",
      title: "Turn real retention and engagement curves across all platforms into smarter future content.",
      pain: "Posting blindly across TikTok, Instagram, and LinkedIn without knowing why one format worked and another failed, repeating mistakes forever.",
      solution: "Measures exact video retention drop-offs, carousel slide swipe rates, and thread engagement, retraining the system to make future batches more viral.",
      howItWorks: "Metrics feeds live platform performance into Dimension A: S(t+1) = S(t) + A(t). The system refines YOD hook structures and carousel layouts for continuously compounding retention.",
      cabala: "The Celestial Moon & The Telemetric Return. The Moon reflects light back to Earth and returns telemetric tides to nourish the primordial seed (YOD). Creation is a perpetual learning spiral.",
      plate: "assets/plates/plate_07_moon_loop.webp"
    }
  ]
};

function generateAppleV3Page(locale) {
  const isEs = locale === 'es';
  const acts = actsData[locale];
  const targetDir = path.join(docsDir, locale, 'v3');
  fs.mkdirSync(targetDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'MacBook Pro — ABRAXAS OS Edition (v3 Oficial)' : 'MacBook Pro — ABRAXAS OS Edition (Official v3)'}</title>
  <meta name="description" content="${isEs ? 'Mente abierta. Poder total. El Sistema Operativo de Contenidos a velocidad industrial en Apple Silicon.' : 'Mind-blowing. Head-turning. The Content Operating System at industrial speed on Apple Silicon.'}">
  <link rel="stylesheet" href="../../assets/apple-macbook-pro-v3.css">
</head>
<body class="theme-dark">

  <!-- Apple Sticky Localnav -->
  <nav class="localnav" aria-label="Local Navigation">
    <div class="localnav-wrapper">
      <div class="localnav-title">
        <span>ABRAXAS OS</span>
        <span class="badge">v3.0 PRO</span>
      </div>
      <div class="localnav-menu">
        <a href="#welcome" class="localnav-link active">${isEs ? 'Visión general' : 'Overview'}</a>
        <a href="#highlights" class="localnav-link">${isEs ? 'Destacados' : 'Highlights'}</a>
        <a href="#viewer" class="localnav-link">${isEs ? 'Ecosistema 8-en-1' : '8-in-1 Ecosystem'}</a>
        <a href="#performance" class="localnav-link">${isEs ? 'Rendimiento' : 'Performance'}</a>
        <a href="#governance" class="localnav-link">${isEs ? 'Gerencia' : 'Executive Suite'}</a>
        <a href="#sequences" class="localnav-link">${isEs ? '12 Secuencias' : '12 Sequences'}</a>
        <a href="../canon/index.html" class="localnav-link" style="color: #d4af37;">📚 Canon 37 TXT</a>
        <a href="../backup/index.html" class="localnav-link">🏛️ Backup</a>
      </div>
      <div class="localnav-actions">
        <a href="../index.html" class="btn-apple-buy">${isEs ? 'Abrir Sistema' : 'Launch OS'}</a>
      </div>
    </div>
  </nav>

  <!-- 1. SECTION: WELCOME (Hero "Mente abierta. Poder total.") -->
  <section id="welcome" class="section-welcome">
    <div class="product-eyebrow">
      ${isEs ? 'MACBOOK PRO // ABRAXAS OS EDITION 2026' : 'MACBOOK PRO // ABRAXAS OS EDITION 2026'}
    </div>
    <h1 class="headline-gradient">
      ${isEs ? 'Mente abierta.<br/>Poder total.' : 'Mind-blowing.<br/>Head-turning.'}
    </h1>
    <p class="subhead">
      ${isEs 
        ? 'Una sola semilla de marca. Ocho formatos vivos. Cero margen de error. ABRAXAS transforma ideas atómicas en videos cortos, carruseles visuales, hilos y newsletters a velocidad de hardware local.'
        : 'One core brand seed. Eight living formats. Zero error margin. ABRAXAS turns atomic ideas into short video, carousels, threads, and newsletters at native hardware speed.'}
    </p>

    <div class="hero-actions">
      <a href="#viewer" class="btn-pill-primary">${isEs ? '⚡ Explorar Ecosistema 8-en-1' : '⚡ Explore 8-in-1 Ecosystem'}</a>
      <a href="#governance" class="btn-pill-secondary">${isEs ? '💼 Para Gerencia y Directores' : '💼 For Executives'}</a>
      <a href="../canon/index.html" class="btn-pill-secondary">${isEs ? '📚 Leer el Canon 37 TXT' : '📚 Read 37 TXT Canon'}</a>
    </div>

    <!-- Master Hardware Chassis with Plate 01 -->
    <div class="hero-hardware-chassis">
      <div class="hardware-bezel">
        <div class="hardware-screen">
          <img src="../../assets/plates/plate_01_hero.webp" alt="ABRAXAS OS Hardware Chamber" loading="eager">
          <div class="hardware-notch-badge">
            ◈ ATZILUTH CORE CHAMBER // SILICON ARCHITECTURE
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 2. SECTION: HIGHLIGHTS ("Mira lo más destacado.") -->
  <section id="highlights" class="section-highlights">
    <div class="section-container">
      <div class="section-title-wrap">
        <span class="section-eyebrow">${isEs ? 'LO MÁS DESTACADO' : 'KEY HIGHLIGHTS'}</span>
        <h2 class="section-title">${isEs ? 'Mira lo más destacado.' : 'Get the highlights.'}</h2>
      </div>

      <div class="highlights-grid">
        <div class="highlight-card">
          <div class="highlight-stat gold">18s</div>
          <div class="highlight-label">${isEs ? 'Auto-edición y síntesis completa en Apple Silicon' : 'Auto-cut & complete synthesis on Apple Silicon'}</div>
        </div>
        <div class="highlight-card">
          <div class="highlight-stat cyan">1 ➔ 8</div>
          <div class="highlight-label">${isEs ? 'Formatos derivados de una sola semilla' : 'Live formats derived from one core seed'}</div>
        </div>
        <div class="highlight-card">
          <div class="highlight-stat">50</div>
          <div class="highlight-label">${isEs ? 'Activos gobernados en una sola tarde' : 'Assets governed in a single afternoon'}</div>
        </div>
        <div class="highlight-card">
          <div class="highlight-stat emerald">0.00%</div>
          <div class="highlight-label">${isEs ? 'GAPs de error (Metrología Whisper V3)' : 'Error tolerance (Whisper V3 Metrology)'}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. SECTION: PRODUCT VIEWER ("Mírala en detalle." / 8-in-1 Explorer) -->
  <section id="viewer" class="section-product-viewer">
    <div class="section-container">
      <div class="section-title-wrap" style="text-align: center;">
        <span class="section-eyebrow">${isEs ? 'FÁBRICA MULTICANAL' : 'MULTI-CHANNEL FACTORY'}</span>
        <h2 class="section-title">${isEs ? 'Mírala en detalle.<br/>Una semilla. Ocho formatos vivos.' : 'Take a closer look.<br/>One seed. Eight living formats.'}</h2>
      </div>

      <!-- Format Tab Pills -->
      <div class="format-tab-pills">
        <button class="format-pill-btn active" onclick="switchV3Format(0, this)">🎬 ${isEs ? 'Videos Cortos (9:16)' : 'Shorts / Reels (9:16)'}</button>
        <button class="format-pill-btn" onclick="switchV3Format(1, this)">🖼️ ${isEs ? 'Carruseles (4:5)' : 'Visual Carousels (4:5)'}</button>
        <button class="format-pill-btn" onclick="switchV3Format(2, this)">✍️ ${isEs ? 'Hilos X/LinkedIn' : 'X / LinkedIn Threads'}</button>
        <button class="format-pill-btn" onclick="switchV3Format(3, this)">📧 ${isEs ? 'Newsletters & Email' : 'Newsletters & Email'}</button>
        <button class="format-pill-btn" onclick="switchV3Format(4, this)">🎙️ ${isEs ? 'Audio & Podcasts' : 'Audio & Podcasts'}</button>
        <button class="format-pill-btn" onclick="switchV3Format(5, this)">🎥 ${isEs ? 'YouTube (16:9)' : 'YouTube (16:9)'}</button>
      </div>

      <!-- Interactive Bento Display -->
      <div class="viewer-bento-grid">
        <div class="bento-box bento-col-8">
          <div>
            <span class="apple-card-tag gold" id="v3-tab-tag">FORMAT 01 // AUDIVISUAL SYNTHESIS</span>
            <h3 class="bento-box-title" id="v3-tab-title">${isEs ? 'Videos Cortos de Alta Retención (TikTok, Reels, Shorts)' : 'High-Retention Short Video (TikTok, Reels, Shorts)'}</h3>
            <p class="bento-box-desc" id="v3-tab-desc">
              ${isEs 
                ? 'Auto-edición en 18 segundos con cortes quirúrgicos de silencios, subtítulos virales animados en Remotion, gráficos 3D y diseño sonoro a 45Hz.' 
                : 'Auto-cut in 18s with sub-millisecond jump cuts, kinetic typography in Remotion, 3D overlays, and 45Hz sub-bass sound design.'}
            </p>
          </div>
          <div class="bento-media" style="aspect-ratio: 16/9;">
            <img id="v3-tab-img" src="../../assets/plates/plate_05_vav_cathedral.webp" alt="Format Preview">
          </div>
        </div>

        <div class="bento-box bento-col-4">
          <div>
            <span class="apple-card-tag cyan">${isEs ? 'ESPECIFICACIONES PRO' : 'PRO SPECIFICATIONS'}</span>
            <h3 class="bento-box-title" style="font-size: 1.35rem;">${isEs ? 'Velocidad & Hardware' : 'Speed & Hardware'}</h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 14px; margin-top: 1.5rem; font-size: 0.92rem; color: #cbd5e1;">
              <li style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">⚡ <strong>${isEs ? 'Velocidad de Síntesis:' : 'Synthesis Velocity:'}</strong> 18s en Apple Silicon</li>
              <li style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">🎯 <strong>${isEs ? 'Gancho Dialéctico:' : 'Dialectic Hook:'}</strong> Score 0-100 por YOD</li>
              <li style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">🎙️ <strong>${isEs ? 'Auditoría en Set:' : 'On-Set Metrology:'}</strong> Whisper Large V3 Turbo</li>
              <li>🔒 <strong>${isEs ? 'Sellado CAS:' : 'CAS Vault:'}</strong> SHA-256 Inmutable</li>
            </ul>
          </div>
          <a href="../ecosistema/index.html" class="btn-pill-primary" style="margin-top: 2rem; justify-content: center;">
            ${isEs ? 'Ver Ecosistema Completo →' : 'View Full Ecosystem →'}
          </a>
        </div>
      </div>

    </div>
  </section>

  <!-- 4. SECTION: PERFORMANCE ("Rendimiento // Como estos tres motores no hay dos") -->
  <section id="performance" class="section-performance">
    <div class="section-container">
      <div class="section-title-wrap">
        <span class="section-eyebrow">${isEs ? 'ARQUITECTURA DE PROCESAMIENTO' : 'PROCESSING ARCHITECTURE'}</span>
        <h2 class="section-title">${isEs ? 'Rendimiento.<br/>Como estos tres motores no hay dos.' : 'Performance.<br/>Three revolutionary engines.'}</h2>
      </div>

      <div class="chip-cards-grid">
        <div class="chip-card">
          <div class="chip-badge">י</div>
          <h3 class="chip-name">${isEs ? 'Motor YOD' : 'YOD Engine'}</h3>
          <div class="chip-tagline">${isEs ? 'Inteligencia de Nicho y Ganchos' : 'Niche Radar & Contrarian Hooks'}</div>
          <p class="chip-desc">
            ${isEs 
              ? 'Escanea los puntos ciegos de tu sector y genera 3 variantes de apertura calificadas de 0 a 100 para detener el scroll de inmediato.' 
              : 'Scans audience blind spots and crafts 3 contrarian hook angles scored 0-100 to stop the scroll across all platforms.'}
          </p>
        </div>

        <div class="chip-card">
          <div class="chip-badge">ו</div>
          <h3 class="chip-name">${isEs ? 'Motor VAV' : 'VAV Engine'}</h3>
          <div class="chip-tagline">${isEs ? 'Auto-Síntesis Audiovisual en 18s' : '18s Audiovisual Synthesis Forge'}</div>
          <p class="chip-desc">
            ${isEs 
              ? 'Corta pausas con microsegundos de precisión, genera subtítulos animados virales y renderiza láminas gráficas de alta resolución.' 
              : 'Auto-cuts silent dead time, applies kinetic typography motion families in Remotion, and renders high-res carousel slides.'}
          </p>
        </div>

        <div class="chip-card">
          <div class="chip-badge">ש</div>
          <h3 class="chip-name">${isEs ? 'Motor SHIM' : 'SHIM Engine'}</h3>
          <div class="chip-tagline">${isEs ? 'Metrología y Verificación 0.00% GAPs' : 'Reality Metrology 0.00% GAPs'}</div>
          <p class="chip-desc">
            ${isEs 
              ? 'Audita con Whisper Large V3 y visión computacional que lo grabado coincida palabra por palabra con el guion antes de salir del set.' 
              : 'Audits reality against planned script using Whisper Large V3 Turbo with 0.00% error tolerance before you leave the set.'}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. SECTION: GOVERNANCE ("El Poder de la Gerencia") -->
  <section id="governance" class="section-product-viewer" style="background: var(--apple-bg);">
    <div class="section-container">
      <div class="section-title-wrap">
        <span class="section-eyebrow" style="color: var(--apple-cyan);">${isEs ? 'ALTA DIRECCIÓN & GOBERNANZA' : 'EXECUTIVE COMMAND'}</span>
        <h2 class="section-title">${isEs ? 'Control Total para CEOs y Directores.<br/>Cero Caos Operativo.' : 'Total Control for CEOs & CMOs.<br/>Zero Operational Chaos.'}</h2>
      </div>

      <div class="viewer-bento-grid">
        <div class="bento-box bento-col-6">
          <div>
            <span class="apple-card-tag gold">🛡️ CUSTODIA INMUTABLE DE MARCA</span>
            <h3 class="bento-box-title">${isEs ? 'Criterio Blindado y Anti-Deriva' : 'Immutable Brand Custody'}</h3>
            <p class="bento-box-desc">
              ${isEs 
                ? 'Fijas tus pilares de autoridad, tono de voz y reglas una sola vez. Ningún colaborador puede publicar contenido fuera de compliance.' 
                : 'Define authority pillars and voice tone once. The system automatically rejects any draft violating brand compliance.'}
            </p>
          </div>
          <div class="bento-media" style="aspect-ratio: 16/9;">
            <img src="../../assets/plates/plate_03_continuity_axis.webp" alt="Brand Custody">
          </div>
        </div>

        <div class="bento-box bento-col-6">
          <div>
            <span class="apple-card-tag cyan">📊 TELEMETRÍA DE COSTOS SQLITE</span>
            <h3 class="bento-box-title">${isEs ? 'Auditoría al Centavo y Tiempos' : 'Cost & Turnaround Telemetry'}</h3>
            <p class="bento-box-desc">
              ${isEs 
                ? 'Tablas relacionales que miden tiempos por etapa, cuellos de botella del equipo y el costo de manufactura exacto por activo.' 
                : 'Relational SQLite telemetry auditing exact turnaround times, team bottlenecks, and cost-per-asset down to the penny.'}
            </p>
          </div>
          <div class="bento-media" style="aspect-ratio: 16/9;">
            <img src="../../assets/plates/plate_09_system_dashboard.webp" alt="Cost Telemetry">
          </div>
        </div>

        <div class="bento-box bento-col-6">
          <div>
            <span class="apple-card-tag emerald">⚡ APALANCAMIENTO 1 = 10</span>
            <h3 class="bento-box-title">${isEs ? '1 Operador = Una Agencia Entera' : '1 Operator = Full Agency'}</h3>
            <p class="bento-box-desc">
              ${isEs 
                ? 'Elimina retainers de agencias de $5,000–$15,000/mes. Un solo líder gobierna y aprueba 50 a 100 piezas multicanal en una tarde.' 
                : 'Eliminate $5k-$15k/mo agency retainers. A single operator governs and approves 50-100 multi-channel assets in one afternoon.'}
            </p>
          </div>
          <div class="bento-media" style="aspect-ratio: 16/9;">
            <img src="../../assets/plates/plate_02_he_macro.webp" alt="Team Leverage">
          </div>
        </div>

        <div class="bento-box bento-col-6">
          <div>
            <span class="apple-card-tag purple">🔒 PRIVACIDAD EN APPLE SILICON</span>
            <h3 class="bento-box-title">${isEs ? '100% Silicio Apple Local' : '100% Local Apple Silicon'}</h3>
            <p class="bento-box-desc">
              ${isEs 
                ? 'Todo corre en local en tu Mac. Tus estrategias confidenciales y grabaciones jamás se suben a servidores externos ni entrenan IA de terceros.' 
                : 'Runs 100% locally on your Mac. Confidential company assets never leak to public cloud servers or train third-party AI.'}
            </p>
          </div>
          <div class="bento-media" style="aspect-ratio: 16/9;">
            <img src="../../assets/plates/plate_04_shim_metrology.webp" alt="Local Security">
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- 6. SECTION: 12 MASTER SEQUENCES -->
  <section id="sequences" class="section-product-viewer" style="background: var(--apple-bg-alt);">
    <div class="section-container">
      <div class="section-title-wrap">
        <span class="section-eyebrow" style="color: var(--apple-gold);">${isEs ? 'ARQUITECTURA OPERATIVA COMPLETA' : 'FULL OPERATIONAL ARCHITECTURE'}</span>
        <h2 class="section-title">${isEs ? 'Las 12 Secuencias de Creación.<br/>Del dolor real a la obra terminada.' : 'The 12 Creation Sequences.<br/>From real friction to finished media.'}</h2>
      </div>

      <div class="sequence-card-grid">
        ${acts.map(a => `
        <div class="bento-box">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <span class="apple-card-tag gold">${a.tag}</span>
              <span style="font-family: var(--apple-mono); font-size: 11px; color: #38bdf8; background: rgba(56,189,248,0.1); padding: 2px 8px; border-radius: 4px;">${a.chip}</span>
            </div>
            <h3 class="bento-box-title" style="font-size: 1.35rem; margin-bottom: 1rem;">${a.title}</h3>

            <div class="tier-box pain">
              <span class="tier-label" style="color: #ef4444;">💥 ${isEs ? 'EL DOLOR REAL:' : 'THE PAIN POINT:'}</span>
              <p class="tier-text" style="color: #f1f5f9;">${a.pain}</p>
            </div>

            <div class="tier-box solution">
              <span class="tier-label" style="color: #d4af37;">⚡ ${isEs ? 'LA SOLUCIÓN ABRAXAS:' : 'ABRAXAS SOLUTION:'}</span>
              <p class="tier-text" style="color: #fff; font-weight: 600;">${a.solution}</p>
            </div>

            <div class="tier-box tool">
              <span class="tier-label" style="color: #38bdf8;">🛠️ ${isEs ? 'CÓMO LO HACE EL SOFTWARE:' : 'HOW SOFTWARE DOES IT:'}</span>
              <p class="tier-text" style="color: #cbd5e1;">${a.howItWorks}</p>
            </div>

            <div class="tier-box cabala">
              <span class="tier-label" style="color: #c084fc;">🔯 ${isEs ? 'PRINCIPIO CABALÍSTICO:' : 'CABALISTIC PRINCIPLE:'}</span>
              <p class="tier-text" style="color: #94a3b8; font-family: var(--apple-mono); font-size: 11.5px;">${a.cabala}</p>
            </div>
          </div>

          <div class="bento-media" style="aspect-ratio: 16/9; margin-top: 1.5rem;">
            <img src="../../${a.plate}" alt="${a.title}" loading="lazy">
          </div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- 7. SECTION: CANON 37 TXT TEASER -->
  <section class="section-product-viewer" style="background: #000; text-align: center;">
    <div class="section-container">
      <span class="apple-card-tag gold">📚 BASE DE CONOCIMIENTO OFICIAL // 37 ARCHIVOS</span>
      <h2 class="section-title" style="margin-top: 0.5rem; margin-bottom: 1.25rem;">${isEs ? 'El Canon Completo en tu Navegador' : 'The Complete Canon in Your Browser'}</h2>
      <p class="subhead" style="margin-bottom: 2.5rem;">
        ${isEs 
          ? 'Lee directamente los 37 textos canónicos: ontología, ingeniería 4D, gobernanza y los 100 prompts cinematográficos con buscador instantáneo.' 
          : 'Read all 37 authentic canonical dossiers: ontology, 4D engineering, governance, and 100 film prompts with live search.'}
      </p>
      <a href="../canon/index.html" class="btn-pill-primary" style="font-size: 1.1rem; padding: 14px 32px;">
        ${isEs ? 'Abrir Biblioteca Canon 37 TXT →' : 'Open Canon 37 TXT Library →'}
      </a>
    </div>
  </section>

  <!-- Apple Global Footer v3 -->
  <footer class="apple-footer-v3">
    <div class="footer-v3-inner">
      <div class="footer-v3-columns">
        <div class="footer-v3-col">
          <h4>${isEs ? 'Ecosistema de Contenido' : 'Content Ecosystem'}</h4>
          <ul>
            <li><a href="#viewer">${isEs ? 'Videos Cortos (9:16)' : 'Short-Form Video (9:16)'}</a></li>
            <li><a href="#viewer">${isEs ? 'Carruseles Visuales (4:5)' : 'Visual Carousels (4:5)'}</a></li>
            <li><a href="#viewer">${isEs ? 'Hilos X / LinkedIn' : 'X / LinkedIn Threads'}</a></li>
            <li><a href="#viewer">${isEs ? 'Newsletters & Email' : 'Newsletters & Email'}</a></li>
            <li><a href="#viewer">${isEs ? 'Audio & Podcasts' : 'Audio & Podcasts'}</a></li>
          </ul>
        </div>
        <div class="footer-v3-col">
          <h4>${isEs ? 'Rendimiento & Módulos' : 'Performance & Modules'}</h4>
          <ul>
            <li><a href="#performance">YOD // Radar de Nicho</a></li>
            <li><a href="#performance">CONTENIDO // Eje de Continuidad</a></li>
            <li><a href="#performance">SHIM // Metrología Whisper</a></li>
            <li><a href="#performance">VAV // Auto-Síntesis 18s</a></li>
            <li><a href="#performance">HE // Despacho Kanban</a></li>
          </ul>
        </div>
        <div class="footer-v3-col">
          <h4>${isEs ? 'Gobernanza & Alta Dirección' : 'Executive Governance'}</h4>
          <ul>
            <li><a href="#governance">${isEs ? 'Custodia Inmutable de Marca' : 'Immutable Brand Custody'}</a></li>
            <li><a href="#governance">${isEs ? 'Telemetría SQLite al Centavo' : 'SQLite Cost Telemetry'}</a></li>
            <li><a href="#governance">${isEs ? 'Apalancamiento 1 Operador = 10' : '1 Operator = 10 Leverage'}</a></li>
            <li><a href="#governance">${isEs ? 'Soberanía Apple Silicon' : 'Apple Silicon Sovereignty'}</a></li>
          </ul>
        </div>
        <div class="footer-v3-col">
          <h4>${isEs ? 'Base de Conocimiento' : 'Knowledge Base'}</h4>
          <ul>
            <li><a href="../canon/index.html">${isEs ? 'Biblioteca Canon 37 TXT' : 'Canon 37 TXT Library'}</a></li>
            <li><a href="../arquitectura/index.html">${isEs ? 'Cábala & Arquitectura 4D' : 'Kabbalah & 4D Architecture'}</a></li>
            <li><a href="../guia/index.html">${isEs ? 'Guía Rápida en 2 Minutos' : 'Quick 2-Minute Guide'}</a></li>
            <li><a href="../backup/index.html">${isEs ? '🏛️ Versión Backup / Legacy' : '🏛️ Legacy Backup Version'}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-v3-bottom">
        <p>Copyright © 2026 ABRAXAS OS. ${isEs ? 'Todos los derechos reservados. Edición Oficial Apple MacBook Pro.' : 'All rights reserved. Official Apple MacBook Pro Edition.'}</p>
        <p style="font-family: var(--apple-mono); color: var(--apple-gold); font-size: 11px;">SHA-256: <code>91234741f0b3a1ac5bd7e4c0556fafa868d00769</code></p>
      </div>
    </div>
  </footer>

  <script>
    const v3Tabs = [
      {
        tag: 'FORMAT 01 // AUDIVISUAL SYNTHESIS',
        title: '${isEs ? 'Videos Cortos de Alta Retención (TikTok, Reels, Shorts)' : 'High-Retention Short Video (TikTok, Reels, Shorts)'}',
        desc: '${isEs ? 'Auto-edición en 18 segundos con cortes quirúrgicos de silencios, subtítulos virales animados en Remotion, gráficos 3D y diseño sonoro a 45Hz.' : 'Auto-cut in 18s with sub-millisecond jump cuts, kinetic typography in Remotion, 3D overlays, and 45Hz sub-bass sound design.'}',
        img: '../../assets/plates/plate_05_vav_cathedral.webp'
      },
      {
        tag: 'FORMAT 02 // EDITORIAL GRAPHICS',
        title: '${isEs ? 'Carruseles Visuales de Alta Conversión (Instagram / LinkedIn)' : 'High-Conversion Visual Carousels (Instagram / LinkedIn)'}',
        desc: '${isEs ? 'Diapositivas en formato 4:5 y 1:1 con tipografía editorial de impacto, densidad de información calibrada y esquemas que detienen el scroll.' : '4:5 and 1:1 slide decks with impact typography, calibrated information density, and thumb-stopping visual hierarchy.'}',
        img: '../../assets/plates/plate_08_contenido_portal.webp'
      },
      {
        tag: 'FORMAT 03 // WRITTEN AUTHORITY',
        title: '${isEs ? 'Hilos de Autoridad & Posts Largos (X / LinkedIn)' : 'Authority Threads & Long Posts (X / LinkedIn)'}',
        desc: '${isEs ? 'Hilos de 6 a 10 publicaciones redactados con tensión dialéctica y listas de valor listas para publicar en X y LinkedIn.' : '6-10 post threads structured with dialectic tension, punchy bullet points, and high conversion hooks ready to publish.'}',
        img: '../../assets/plates/plate_03_continuity_axis.webp'
      },
      {
        tag: 'FORMAT 04 // RETENTION & SALES',
        title: '${isEs ? 'Newsletters y Correos de Venta Sincronizados' : 'Synchronized Newsletters & Sales Emails'}',
        desc: '${isEs ? 'Correos electrónicos con narrativa envolvente y llamados a la acción comerciales sincronizados con la tesis del video.' : 'Engaging editorial emails and sales letters perfectly synchronized with the core video thesis.'}',
        img: '../../assets/plates/plate_07_moon_loop.webp'
      },
      {
        tag: 'FORMAT 05 // AUDIO BROADCAST',
        title: '${isEs ? 'Snippets de Audio & Guiones de Podcast' : 'Audio Snippets & Podcast Frameworks'}',
        desc: '${isEs ? 'Pistas de audio normalizadas a -14 LUFS con reducción de ruido y resúmenes para comunidades de Telegram y Spotify.' : 'Audio tracks normalized to -14 LUFS with noise gating and executive takeaways for podcast feeds and Telegram communities.'}',
        img: '../../assets/plates/plate_04_shim_metrology.webp'
      },
      {
        tag: 'FORMAT 06 // DEEP-DIVE ESSAY',
        title: '${isEs ? 'Ensayos Audiovisuales Largos (YouTube 16:9)' : 'Long-Form Video Essays (YouTube 16:9)'}',
        desc: '${isEs ? 'Estructura narrativa en 4 tiempos para videos horizontales de 8 a 15 minutos con retención continua.' : '4-beat narrative structure for 8-15 minute horizontal YouTube videos engineered for continuous watch time.'}',
        img: '../../assets/plates/plate_10_master_monument.webp'
      }
    ];

    function switchV3Format(idx, btn) {
      document.querySelectorAll('.format-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const d = v3Tabs[idx];
      document.getElementById('v3-tab-tag').innerText = d.tag;
      document.getElementById('v3-tab-title').innerText = d.title;
      document.getElementById('v3-tab-desc').innerText = d.desc;
      document.getElementById('v3-tab-img').src = d.img;
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Apple v3 Engine] Generated /${locale}/v3/index.html successfully!`);
}

function executeV3Master() {
  ['es', 'en'].forEach(locale => {
    generateAppleV3Page(locale);
  });

  // Also create root /v3/index.html
  const esV3 = fs.readFileSync(path.join(docsDir, 'es/v3/index.html'), 'utf8');
  const rootV3Dir = path.join(docsDir, 'v3');
  fs.mkdirSync(rootV3Dir, { recursive: true });
  const rootV3Html = esV3
    .replace(/href="\.\.\/\.\.\/assets\//g, 'href="../assets/')
    .replace(/src="\.\.\/\.\.\/assets\//g, 'src="../assets/')
    .replace(/href="\.\.\/canon\//g, 'href="../es/canon/')
    .replace(/href="\.\.\/ecosistema\//g, 'href="../es/ecosistema/')
    .replace(/href="\.\.\/backup\//g, 'href="../es/backup/')
    .replace(/href="\.\.\/index\.html"/g, 'href="../index.html"');

  fs.writeFileSync(path.join(rootV3Dir, 'index.html'), rootV3Html, 'utf8');
  console.log('[Apple v3 Engine] Generated root /v3/index.html successfully!');
  console.log('✨ [Apple v3 Engine] All v3 editions compiled flawlessly!');
}

executeV3Master();
