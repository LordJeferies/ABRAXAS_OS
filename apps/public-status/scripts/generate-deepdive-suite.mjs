import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');
const docsDir = path.join(rootDir, 'docs/abraxas-os-status');

function getHeader(locale, activeTab, depth = 2) {
  const isEs = locale === 'es';
  const prefix = '../'.repeat(depth);
  const esPrefix = `${prefix}es/`;
  const enPrefix = `${prefix}en/`;

  return `
  <nav class="localnav" aria-label="Local Navigation">
    <div class="localnav-wrapper">
      <a href="${prefix}index.html" class="localnav-title">
        <span>ABRAXAS OS</span>
        <span class="badge">DOCS PRO</span>
      </a>
      <div class="localnav-menu">
        <a href="${prefix}index.html" class="localnav-link">${isEs ? 'Inicio' : 'Home'}</a>
        <a href="${prefix}v3/index.html" class="localnav-link">${isEs ? '🍎 Edición v3' : '🍎 v3 Edition'}</a>
        <a href="${prefix}${locale}/ecosistema/index.html" class="localnav-link">${isEs ? '⚡ Ecosistema 8-en-1' : '⚡ 8-in-1 Ecosystem'}</a>
        <a href="${prefix}${locale}/flujo/index.html" class="localnav-link ${activeTab === 'flujo' ? 'active' : ''}">${isEs ? '🔄 Ciclo de Vida' : '🔄 Lifecycle Flow'}</a>
        <a href="${prefix}${locale}/tools/vav/motions/index.html" class="localnav-link ${activeTab === 'motions' ? 'active' : ''}">🎬 Motions</a>
        <a href="${prefix}${locale}/tools/vav/captions/index.html" class="localnav-link ${activeTab === 'captions' ? 'active' : ''}">💬 Captions</a>
        <a href="${prefix}${locale}/tools/vav/cuts/index.html" class="localnav-link ${activeTab === 'cuts' ? 'active' : ''}">✂️ Cuts 18s</a>
        <a href="${prefix}${locale}/tools/shim/index.html" class="localnav-link ${activeTab === 'shim' ? 'active' : ''}">🔍 SHIM (0% GAPs)</a>
        <a href="${prefix}${locale}/tools/arquitecto/index.html" class="localnav-link ${activeTab === 'arquitecto' ? 'active' : ''}">👁️ Arquitecto</a>
        <a href="${prefix}${locale}/tools/he/index.html" class="localnav-link ${activeTab === 'he' ? 'active' : ''}">💼 HE (50 Lotes)</a>
        <a href="${prefix}${locale}/canon/index.html" class="localnav-link" style="color: #d4af37;">📚 Canon 37 TXT</a>
        <a href="${prefix}${locale}/backup/index.html" class="localnav-link">🏛️ Backup</a>
      </div>
      <div class="localnav-actions">
        <a href="${prefix}${locale === 'es' ? 'en' : 'es'}/index.html" class="localnav-link" style="font-family: monospace; font-weight: 700; color: #fff;">${isEs ? 'EN' : 'ES'}</a>
        <a href="${prefix}index.html" class="btn-apple-buy">${isEs ? 'Abrir Sistema' : 'Launch OS'}</a>
      </div>
    </div>
  </nav>
  `;
}

function getFooter(locale) {
  const isEs = locale === 'es';
  return `
  <footer class="apple-footer-v3">
    <div class="footer-v3-inner">
      <div class="footer-v3-columns">
        <div class="footer-v3-col">
          <h4>${isEs ? 'Herramientas de Síntesis' : 'Synthesis Tools'}</h4>
          <ul>
            <li><a href="../vav/motions/index.html">${isEs ? '13 Familias de Motion Remotion' : '13 Remotion Motion Families'}</a></li>
            <li><a href="../vav/captions/index.html">${isEs ? 'Subtítulos Cinéticos Whisper' : 'Kinetic Subtitles Whisper'}</a></li>
            <li><a href="../vav/cuts/index.html">${isEs ? 'Cortes Quirúrgicos en 18s' : '18s Surgical Auto-Cuts'}</a></li>
            <li><a href="../shim/index.html">${isEs ? 'Metrología 0.00% GAPs' : '0.00% GAP Metrology'}</a></li>
          </ul>
        </div>
        <div class="footer-v3-col">
          <h4>${isEs ? 'Inteligencia & Orquestación' : 'Intelligence & Orchestration'}</h4>
          <ul>
            <li><a href="../arquitecto/index.html">${isEs ? 'Arquitecto (Coach & Asistente)' : 'Arquitecto (Coach & Assistant)'}</a></li>
            <li><a href="../yod/index.html">${isEs ? 'YOD (Radar de Puntos Ciegos)' : 'YOD (Niche Blindspot Radar)'}</a></li>
            <li><a href="../contenido/index.html">${isEs ? 'Contenido (Merkle-DAG 8 Formatos)' : 'Contenido (Merkle-DAG 8 Formats)'}</a></li>
            <li><a href="../he/index.html">${isEs ? 'HE (Despacho de 50 Lotes)' : 'HE (50-Asset Batch Desk)'}</a></li>
          </ul>
        </div>
        <div class="footer-v3-col">
          <h4>${isEs ? 'Gobernanza & Procesos' : 'Governance & Flow'}</h4>
          <ul>
            <li><a href="../../flujo/index.html">${isEs ? 'Ciclo de Vida del Contenido' : 'Content Lifecycle Journey'}</a></li>
            <li><a href="../../gerencia/index.html">${isEs ? 'Auditoría Gerencial SQLite' : 'SQLite Executive Audit'}</a></li>
            <li><a href="../../canon/index.html">${isEs ? 'Biblioteca Canon 37 TXT' : 'Canon 37 TXT Library'}</a></li>
            <li><a href="../../backup/index.html">${isEs ? 'Versión Backup de Respaldo' : 'Legacy Backup Snapshot'}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-v3-bottom">
        <p>Copyright © 2026 ABRAXAS OS. ${isEs ? 'Arquitectura Determinista de Contenidos en Apple Silicon.' : 'Deterministic Content Architecture on Apple Silicon.'}</p>
        <p style="font-family: monospace; color: #d4af37; font-size: 11px;">SHA-256: <code>91234741f0b3a1ac5bd7e4c0556fafa868d00769</code></p>
      </div>
    </div>
  </footer>
  `;
}

// 1. GENERATE MOTIONS DEEP DIVE PAGE (/tools/vav/motions/index.html)
function generateMotionsPage(locale) {
  const isEs = locale === 'es';
  const targetDir = path.join(docsDir, locale, 'tools/vav/motions');
  fs.mkdirSync(targetDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Las 13 Familias de Motion y Física de Animación — ABRAXAS OS' : '13 Motion Families & Spring Physics — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Cómo funcionan los motions en Remotion: física de resortes, interpolación, composición 3D, creación, inserción y edición en tiempo real.' : 'Deep dive into Remotion motion families, spring physics, and real-time editing in ABRAXAS OS.'}">
  <link rel="stylesheet" href="../../../../assets/apple-macbook-pro-v3.css">
</head>
<body class="theme-dark">
  ${getHeader(locale, 'motions', 4)}

  <main class="section-container" style="padding-top: 80px; padding-bottom: 80px; max-width: 1200px;">
    
    <!-- Hero Header -->
    <div class="section-title-wrap" style="text-align: center;">
      <span class="section-eyebrow" style="color: #bf5af2;">VAV SYNTHESIS // REMOTION MOTION ENGINE</span>
      <h1 class="headline-gradient" style="font-size: clamp(2.5rem, 5.5vw, 4.2rem);">
        ${isEs ? 'Las 13 Familias de Motion.<br/>Física de Resortes y Animación en 18s.' : 'The 13 Motion Families.<br/>Spring Physics & 18s Video Animation.'}
      </h1>
      <p class="subhead" style="margin: 0 auto 2.5rem auto;">
        ${isEs 
          ? 'Descubre cómo ABRAXAS inyecta movimiento profesional en cada segundo de video mediante ecuaciones físicas de resorte (spring physics), capas 3D y renderizado nativo por GPU en Apple Silicon.'
          : 'Discover how ABRAXAS injects high-impact motion using spring physics equations, 3D composition layers, and native GPU rendering on Apple Silicon.'}
      </p>
    </div>

    <!-- DUAL BOX: RESUMEN EJECUTIVO + ESPECIFICACIÓN TÉCNICA -->
    <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem; margin-bottom: 3.5rem;">
      
      <!-- Resumen Ejecutivo (En 30 Segundos) -->
      <div class="bento-box bento-col-6" style="background: rgba(191, 90, 242, 0.08); border: 1px solid rgba(191, 90, 242, 0.35);">
        <div>
          <span class="apple-card-tag purple">⚡ EN 30 SEGUNDOS // RESUMEN EJECUTIVO</span>
          <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">${isEs ? '¿Qué son y cómo se usan los Motions?' : 'What are Motions & How They Work?'}</h3>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.92rem; color: #e2e8f0; line-height: 1.5;">
            <li>✨ <strong>Sin fotogramas clave manuales:</strong> Los motions se calculan con física real (masa, rigidez, fricción), eliminando animaciones robóticas.</li>
            <li>🎯 <strong>13 Familias Prediseñadas:</strong> Desde zoom cinético y rotación 3D hasta tarjetas flotantes y subrayados de impacto.</li>
            <li>⏱️ <strong>Inserción Automática:</strong> El sistema analiza el guion y coloca el motion exacto en la palabra de mayor énfasis emocional.</li>
            <li>🎨 <strong>Edición Instantánea:</strong> Cambias el estilo visual, escala o posición en un clic sin tener que renderizar en Premiere.</li>
          </ul>
        </div>
      </div>

      <!-- Especificación Técnica (En Profundidad) -->
      <div class="bento-box bento-col-6" style="background: rgba(41, 151, 255, 0.08); border: 1px solid rgba(41, 151, 255, 0.35);">
        <div>
          <span class="apple-card-tag cyan">🛠️ EN PROFUNDIDAD // INGENIERÍA DE REMOTION</span>
          <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">${isEs ? 'Arquitectura de Renderizado y Física' : 'Rendering Architecture & Physics'}</h3>
          <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.55; margin-bottom: 12px;">
            ${isEs 
              ? 'Cada motion se compila como un componente React en Remotion, evaluado a 60 FPS. La función <code>spring({ frame, fps, config: { damping, stiffness, mass } })</code> garantiza continuidad matemática sin saltos.' 
              : 'Each motion compiles as a React Remotion component evaluated at 60 FPS. The <code>spring({ frame, fps, config })</code> equation guarantees continuous mathematical curvature.'}
          </p>
          <div style="background: #000; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 11px; color: #38bdf8; border: 1px solid rgba(255,255,255,0.1);">
            const scale = spring({ frame: currentFrame, fps: 60, config: { mass: 0.5, damping: 12, stiffness: 100 } });
          </div>
        </div>
      </div>

    </div>

    <!-- The 13 Motion Families Grid -->
    <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem; text-align: center;">
      ${isEs ? 'Las 13 Familias de Motion en Detalle' : 'The 13 Motion Families in Detail'}
    </h2>

    <div class="viewer-bento-grid" style="margin-bottom: 4rem;">
      
      <div class="bento-box bento-col-4">
        <span class="apple-card-tag gold">01 // KINETIC POP</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Impacto Pop Elástico' : 'Elastic Pop Impact'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Escala de 0.8 a 1.05 con rebote suave en 6 fotogramas. Ideal para palabras clave de venta o shock.</p>
      </div>

      <div class="bento-box bento-col-4">
        <span class="apple-card-tag cyan">02 // 3D CARD FLIP</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Giro Espacial 3D' : '3D Spatial Flip'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Rotación en eje Y con perspectiva CSS a 1000px y sombra dinámica para presentar datos.</p>
      </div>

      <div class="bento-box bento-col-4">
        <span class="apple-card-tag purple">03 // HIGHLIGHT SWEEP</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Barrido de Marcador' : 'Marker Sweep'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Franja dorada que subraya el texto de izquierda a derecha sincronizada con la entonación de voz.</p>
      </div>

      <div class="bento-box bento-col-4">
        <span class="apple-card-tag emerald">04 // FLOATING BADGE</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Insignia Flotante' : 'Floating Badge'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Placa de vidrio con efecto de levitación senoidal continua (sine-wave float) para títulos.</p>
      </div>

      <div class="bento-box bento-col-4">
        <span class="apple-card-tag gold">05 // FOCUS ZOOM IN</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Zoom Óptico al Rostro' : 'Face Focus Zoom'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Acercamiento de cámara del 10% al 15% en momentos de máxima tensión para romper la monotonía.</p>
      </div>

      <div class="bento-box bento-col-4">
        <span class="apple-card-tag cyan">06 // SPLIT GLITCH</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Distorsión Cromática' : 'Chromatic Glitch'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Separación de canales RGB en 3 fotogramas en transiciones de contrates o giros argumentales.</p>
      </div>

      <div class="bento-box bento-col-4">
        <span class="apple-card-tag purple">07 // COUNTER NUMBER ROLL</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Contador Numérico' : 'Number Counter Roll'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Animación de números en odómetro que suben rápidamente de 0 a la cifra mencionada en el audio.</p>
      </div>

      <div class="bento-box bento-col-4">
        <span class="apple-card-tag emerald">08 // EMOJI BURST</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Explosión de Emojis' : 'Emoji Particle Burst'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Partículas de emojis temáticos con física de dispersión y gravedad suave en momentos cómicos.</p>
      </div>

      <div class="bento-box bento-col-4">
        <span class="apple-card-tag gold">09 // SIDE SLIDE PANEL</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Panel Lateral de Resumen' : 'Side Slide Panel'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Panel de vidrio que se desliza desde el lateral mostrando listas de puntos clave de 3 elementos.</p>
      </div>

      <div class="bento-box bento-col-4">
        <span class="apple-card-tag cyan">10 // PROGRESS BAR PULSE</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Barra de Progreso Viva' : 'Live Progress Pulse'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Línea inferior de retención con brillo sutil que indica a la audiencia el avance del video.</p>
      </div>

      <div class="bento-box bento-col-4">
        <span class="apple-card-tag purple">11 // BENT REVEAL</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Revelado Curvo' : 'Bent Mask Reveal'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Máscara curva de revelado tipográfico con desenfoque de movimiento direccional.</p>
      </div>

      <div class="bento-box bento-col-4">
        <span class="apple-card-tag emerald">12 // SUB-BASS SHAKE</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Sacudida de Sub-Bajo' : 'Sub-Bass Cam Shake'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Micro-sacudida de 2 píxeles acoplada al golpe de audio a 45Hz para impactos contundentes.</p>
      </div>

    </div>

    <!-- How are Motions Created, Added, and Edited -->
    <div class="bento-box bento-col-12" style="background: rgba(14, 18, 28, 0.9); border: 1px solid rgba(212, 175, 55, 0.35); padding: 3rem;">
      <h3 style="font-size: 1.8rem; color: #fff; margin-bottom: 1.5rem; text-align: center;">
        🛠️ ${isEs ? 'El Flujo de Trabajo: ¿Cómo se Crean, Agregan y Editan los Motions?' : 'Workflow: How Motions are Created, Added, and Edited'}
      </h3>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
        
        <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 14px; border-top: 3px solid #d4af37;">
          <strong style="color: #fff; font-size: 1.1rem; display: block; margin-bottom: 8px;">1. Creación de Nuevos Motions</strong>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">
            Los motions se programan como componentes modulares en TypeScript usando Remotion. Puedes definir curvas de resorte personalizadas, colores de marca y tipografías en el archivo de estilo global.
          </p>
        </div>

        <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 14px; border-top: 3px solid #38bdf8;">
          <strong style="color: #fff; font-size: 1.1rem; display: block; margin-bottom: 8px;">2. Inserción Automática en Video</strong>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">
            El motor VAV lee las marcas de tiempo generadas por Whisper. Cuando detecta un cambio de ritmo o una palabra clave, inserta automáticamente el motion correspondiente sin intervención manual.
          </p>
        </div>

        <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 14px; border-top: 3px solid #bf5af2;">
          <strong style="color: #fff; font-size: 1.1rem; display: block; margin-bottom: 8px;">3. Edición en Tiempo Real</strong>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">
            En la interfaz de ABRAXAS puedes hacer clic sobre cualquier motion en la línea de tiempo para cambiar su familia, ajustar la escala, desactivarlo o moverlo a otra palabra en milisegundos.
          </p>
        </div>

      </div>
    </div>

  </main>

  ${getFooter(locale)}
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[DeepDive Suite] Generated /${locale}/tools/vav/motions/index.html`);
}

// 2. GENERATE CAPTIONS DEEP DIVE PAGE (/tools/vav/captions/index.html)
function generateCaptionsPage(locale) {
  const isEs = locale === 'es';
  const targetDir = path.join(docsDir, locale, 'tools/vav/captions');
  fs.mkdirSync(targetDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Subtítulos Cinéticos & Tipografía Viral — ABRAXAS OS' : 'Kinetic Subtitles & Viral Typography — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Cómo funcionan los subtítulos cinéticos en ABRAXAS: sincronización palabra por palabra con Whisper, estilos de marca, emojis y animación.' : 'Deep dive into Whisper word-level synchronization and kinetic subtitle styling in ABRAXAS OS.'}">
  <link rel="stylesheet" href="../../../../assets/apple-macbook-pro-v3.css">
</head>
<body class="theme-dark">
  ${getHeader(locale, 'captions', 4)}

  <main class="section-container" style="padding-top: 80px; padding-bottom: 80px; max-width: 1200px;">
    
    <div class="section-title-wrap" style="text-align: center;">
      <span class="section-eyebrow" style="color: #38bdf8;">VAV SYNTHESIS // KINETIC TYPOGRAPHY</span>
      <h1 class="headline-gradient" style="font-size: clamp(2.5rem, 5.5vw, 4.2rem);">
        ${isEs ? 'Subtítulos Cinéticos Virales.<br/>Sincronización Palabra por Palabra.' : 'Viral Kinetic Subtitles.<br/>Word-Level Whisper Precision.'}
      </h1>
      <p class="subhead" style="margin: 0 auto 2.5rem auto;">
        ${isEs 
          ? 'El 80% de los videos en redes sociales se ven sin sonido. ABRAXAS convierte tu voz en tipografía cinética hipnótica con sincronización exacta a nivel de microsegundos.'
          : 'Over 80% of social videos are watched on mute. ABRAXAS converts speech into hypnotic kinetic typography with sub-millisecond precision.'}
      </p>
    </div>

    <!-- Dual Summary & Tech Specs Grid -->
    <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem; margin-bottom: 3.5rem;">
      
      <div class="bento-box bento-col-6" style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.35);">
        <span class="apple-card-tag cyan">⚡ EN 30 SEGUNDOS // RESUMEN EJECUTIVO</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">${isEs ? '¿Por qué nuestros subtítulos retienen más?' : 'Why Our Captions Retain More?'}</h3>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.92rem; color: #e2e8f0; line-height: 1.5;">
          <li>🎯 <strong>Word-by-Word Highlight:</strong> La palabra exacta que estás pronunciando se ilumina en dorado o amarillo neón al instante.</li>
          <li>📝 <strong>Líneas Cortas (1 a 3 palabras):</strong> Evita bloques de texto pesados que aburren a la vista; mantiene un ritmo dinámico de lectura.</li>
          <li>🔥 <strong>Auto-Inyección de Emojis:</strong> Coloca emojis contextuales en palabras de emoción (fuego, dinero, cohete, cerebro) sin buscarlos a mano.</li>
          <li>📱 <strong>Zona Segura (Safe Zone) Garantizada:</strong> Los subtítulos nunca quedan tapados por los botones de TikTok, Reels o la descripción.</li>
        </ul>
      </div>

      <div class="bento-box bento-col-6" style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.35);">
        <span class="apple-card-tag gold">🛠️ EN PROFUNDIDAD // MOTOR WHISPER + REMOTION</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">${isEs ? 'Extracción de Timestamps y Renderizado' : 'Timestamp Extraction & Rendering'}</h3>
        <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.55; margin-bottom: 12px;">
          ${isEs 
            ? 'Whisper Large V3 Turbo genera un arreglo JSON con <code>start</code> y <code>end</code> en milisegundos para cada palabra. Remotion interpola la posición y aplica el shader de brillo en el frame exacto.' 
            : 'Whisper Large V3 Turbo outputs timestamps for every token. Remotion interpolates frame coordinates and applies the glow shader on the exact audio peak.'}
        </p>
        <div style="background: #000; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 11px; color: #d4af37; border: 1px solid rgba(255,255,255,0.1);">
          { "word": "ABRAXAS", "start": 1.42, "end": 1.88, "highlight": true, "emoji": "⚡" }
        </div>
      </div>

    </div>

    <!-- 4 Preset Typography Styles -->
    <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem; text-align: center;">
      ${isEs ? '4 Estilos Tipográficos de Alta Retención' : '4 High-Retention Typographic Presets'}
    </h2>

    <div class="viewer-bento-grid">
      
      <div class="bento-box bento-col-6">
        <span class="apple-card-tag gold">ESTILO 01 // VIRAL GOLD</span>
        <h4 style="font-size: 1.35rem; color: #fff; margin-bottom: 8px;">Viral Gold (The Authority Look)</h4>
        <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1rem;">
          Tipografía pesada en negro o blanco con iluminación dorada metálica en la palabra activa y trazo exterior negro de 8px para máxima legibilidad sobre cualquier fondo.
        </p>
        <div style="background: #000; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(212,175,55,0.3);">
          <span style="font-size: 1.8rem; font-weight: 900; color: #fff; font-family: 'SF Pro Display', sans-serif; text-shadow: 0 4px 10px rgba(0,0,0,0.8);">EL SECRETO ES <span style="color: #fef08a; text-shadow: 0 0 16px rgba(212,175,55,0.8);">LA DISCIPLINA</span> ⚡</span>
        </div>
      </div>

      <div class="bento-box bento-col-6">
        <span class="apple-card-tag cyan">ESTILO 02 // CYBER NEON</span>
        <h4 style="font-size: 1.35rem; color: #fff; margin-bottom: 8px;">Cyber Neon (Tech & Devs)</h4>
        <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1rem;">
          Letras estilo monospace con fondo de caja oscura translúcida y resplandor cian eléctrico, ideal para temas de software, finanzas e inteligencia artificial.
        </p>
        <div style="background: #000; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(56,189,248,0.3);">
          <span style="font-size: 1.6rem; font-weight: 800; color: #fff; font-family: 'SF Mono', monospace;"><span style="background: rgba(56,189,248,0.25); color: #38bdf8; padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(56,189,248,0.5);">0.00% GAPs</span> DE ERROR</span>
        </div>
      </div>

      <div class="bento-box bento-col-6">
        <span class="apple-card-tag emerald">ESTILO 03 // CLEAN MINIMAL</span>
        <h4 style="font-size: 1.35rem; color: #fff; margin-bottom: 8px;">Clean Minimal (Luxury Executive)</h4>
        <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1rem;">
          Tipografía minimalista con caja de vidrio esmerilado inferior para líderes ejecutivos y marcas premium que buscan elegancia sin ruido visual.
        </p>
        <div style="background: #000; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.15);">
          <span style="font-size: 1.4rem; font-weight: 600; color: #f5f5f7; font-family: -apple-system, sans-serif;">Custodia inmutable de marca</span>
        </div>
      </div>

      <div class="bento-box bento-col-6">
        <span class="apple-card-tag purple">ESTILO 04 // KINETIC IMPACT</span>
        <h4 style="font-size: 1.35rem; color: #fff; margin-bottom: 8px;">Kinetic Impact (High Energy)</h4>
        <p style="font-size: 0.9rem; color: #94a3b8; line-height: 1.5; margin-bottom: 1rem;">
          Cada palabra aparece individualmente en el centro de la pantalla con rebote elástico a 100 WPM, forzando la vista del espectador a no soltar la pantalla.
        </p>
        <div style="background: #000; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(191,90,242,0.3);">
          <span style="font-size: 2rem; font-weight: 900; color: #bf5af2; font-family: sans-serif; letter-spacing: -0.03em;">¡DETÉN EL SCROLL! 💥</span>
        </div>
      </div>

    </div>

  </main>

  ${getFooter(locale)}
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[DeepDive Suite] Generated /${locale}/tools/vav/captions/index.html`);
}

// 3. GENERATE CUTS & 18S SYNTHESIS PAGE (/tools/vav/cuts/index.html)
function generateCutsPage(locale) {
  const isEs = locale === 'es';
  const targetDir = path.join(docsDir, locale, 'tools/vav/cuts');
  fs.mkdirSync(targetDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Cortes Quirúrgicos & Auto-Edición en 18s — ABRAXAS OS' : 'Surgical Auto-Cuts & 18s Synthesis — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Cómo el motor VAV elimina silencios muertos, preserva la respiración natural y auto-edita videos en 18 segundos en Apple Silicon.' : 'Deep dive into VAV automated silence trimming, jump cuts, and 18-second video synthesis on Apple Silicon.'}">
  <link rel="stylesheet" href="../../../../assets/apple-macbook-pro-v3.css">
</head>
<body class="theme-dark">
  ${getHeader(locale, 'cuts', 4)}

  <main class="section-container" style="padding-top: 80px; padding-bottom: 80px; max-width: 1200px;">
    
    <div class="section-title-wrap" style="text-align: center;">
      <span class="section-eyebrow" style="color: #30d158;">VAV SYNTHESIS // SURGICAL CUTTING ENGINE</span>
      <h1 class="headline-gradient" style="font-size: clamp(2.5rem, 5.5vw, 4.2rem);">
        ${isEs ? 'Auto-Edición en 18 Segundos.<br/>Cortes con Precisión de Microsegundos.' : '18-Second Auto-Editing.<br/>Sub-Millisecond Jump Cut Precision.'}
      </h1>
      <p class="subhead" style="margin: 0 auto 2.5rem auto;">
        ${isEs 
          ? 'Pasar horas cortando silencios y pausas manualmente en Premiere es cosa del pasado. VAV analiza la onda de audio y la energía espectral, eliminando el aire muerto sin cortar tus respiraciones naturales.'
          : 'Manual silence trimming in video editors is obsolete. VAV inspects audio waveforms and spectral energy, trimming dead pauses while preserving organic speech cadences.'}
      </p>
    </div>

    <!-- Dual Summary & Technical Spec -->
    <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem; margin-bottom: 3.5rem;">
      
      <div class="bento-box bento-col-6" style="background: rgba(48, 209, 88, 0.08); border: 1px solid rgba(48, 209, 88, 0.35);">
        <span class="apple-card-tag emerald">⚡ EN 30 SEGUNDOS // RESUMEN EJECUTIVO</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">${isEs ? 'El Ritmo Perfecto sin Esfuerzo' : 'Flawless Pacing Without Effort'}</h3>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.92rem; color: #e2e8f0; line-height: 1.5;">
          <li>⏱️ <strong>De 8 Horas a 18 Segundos:</strong> Lo que a un editor humano le toma una jornada, ABRAXAS lo resuelve antes de que tomes un sorbo de café.</li>
          <li>🎙️ <strong>Preservación de Respiración:</strong> Aplica un margen inteligente de 80ms antes y después de cada palabra para que la voz suene fluida y humana.</li>
          <li>💥 <strong>Cero Cortes Abruptos:</strong> Aplica micro-fundidos de audio (crossfades de 5ms) para evitar clicks o chasquidos en los empalmes.</li>
          <li>🔊 <strong>Normalización a -14 LUFS:</strong> Tu audio sale masterizado con compresión multibanda listo para el estándar de TikTok y YouTube.</li>
        </ul>
      </div>

      <div class="bento-box bento-col-6" style="background: rgba(255, 69, 58, 0.08); border: 1px solid rgba(255, 69, 58, 0.35);">
        <span class="apple-card-tag ruby">🛠️ EN PROFUNDIDAD // ALGORITMO DE DETECCIÓN</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">${isEs ? 'Detección de Umbral y Curva de Energía' : 'Threshold Detection & Energy Envelope'}</h3>
        <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.55; margin-bottom: 12px;">
          ${isEs 
            ? 'El motor calcula el nivel RMS por ventana de 10ms. Si el nivel cae por debajo de -38 dBFS por más de 120ms, la región se marca como silencio y se remueve con compensación de fase en VideoToolbox.' 
            : 'The engine evaluates RMS levels in 10ms windows. If amplitude falls below -38 dBFS for >120ms, the region is trimmed with phase alignment in VideoToolbox.'}
        </p>
        <div style="background: #000; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 11px; color: #ff453a; border: 1px solid rgba(255,255,255,0.1);">
          silenceThreshold: -38dB, minDuration: 120ms, prePadding: 80ms, postPadding: 80ms
        </div>
      </div>

    </div>

  </main>

  ${getFooter(locale)}
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[DeepDive Suite] Generated /${locale}/tools/vav/cuts/index.html`);
}

// 4. GENERATE SHIM REALITY METROLOGY PAGE (/tools/shim/index.html)
function generateShimPage(locale) {
  const isEs = locale === 'es';
  const targetDir = path.join(docsDir, locale, 'tools/shim');
  fs.mkdirSync(targetDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'SHIM: Metrología 0.00% GAPs y Verificación en Set — ABRAXAS OS' : 'SHIM: 0.00% GAP Metrology & Set Verification — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Cómo SHIM audita en vivo grabaciones, subtítulos y diapositivas con Whisper y visión computacional con cero tolerancia a fallos.' : 'Deep dive into SHIM Reality Metrology, Whisper on-set audit, and zero error tolerance in ABRAXAS OS.'}">
  <link rel="stylesheet" href="../../../assets/apple-macbook-pro-v3.css">
</head>
<body class="theme-dark">
  ${getHeader(locale, 'shim', 3)}

  <main class="section-container" style="padding-top: 80px; padding-bottom: 80px; max-width: 1200px;">
    
    <div class="section-title-wrap" style="text-align: center;">
      <span class="section-eyebrow" style="color: #bf5af2;">DAAT THRESHOLD // REALITY METROLOGY</span>
      <h1 class="headline-gradient" style="font-size: clamp(2.5rem, 5.5vw, 4.2rem);">
        ${isEs ? 'SHIM: Metrología Lúcida.<br/>Cero Errores. 0.00% GAPs.' : 'SHIM: Reality Metrology.<br/>Zero Errors. 0.00% GAPs.'}
      </h1>
      <p class="subhead" style="margin: 0 auto 2.5rem auto;">
        ${isEs 
          ? 'Daat es el umbral donde la intención creativa se confronta con la verdad física observada. SHIM escucha tu set en vivo y audita tus activos con IA local, garantizando que nada salga con errores.'
          : 'Daat is the sacred threshold where creative intention meets physical observation. SHIM inspects recordings live with zero error tolerance.'}
      </p>
    </div>

    <!-- Dual Summary & Deep Dive -->
    <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem; margin-bottom: 3.5rem;">
      
      <div class="bento-box bento-col-6" style="background: rgba(191, 90, 242, 0.08); border: 1px solid rgba(191, 90, 242, 0.35);">
        <span class="apple-card-tag purple">⚡ EN 30 SEGUNDOS // RESUMEN EJECUTIVO</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">${isEs ? '¿Cómo te protege SHIM en cada etapa?' : 'How SHIM Protects Every Stage?'}</h3>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.92rem; color: #e2e8f0; line-height: 1.5;">
          <li>🔍 <strong>Auditoría en Set (Live Teleprompter):</strong> Si te saltas una línea del guion mientras grabas, la pantalla se pone en ámbar y te pide regrabar solo esa frase.</li>
          <li>📊 <strong>Detección de Datos Erróneos:</strong> Audita que los números, precios o nombres citados coincidan con el documento oficial de marca.</li>
          <li>🎙️ <strong>Inspección Acústica:</strong> Detecta clipping, eco de habitación o ruido de fondo excesivo antes de que apagues las luces del set.</li>
          <li>🔒 <strong>Bloqueo a Exportar:</strong> Si un activo tiene discrepancias no aprobadas, el sistema bloquea la exportación para proteger tu reputación.</li>
        </ul>
      </div>

      <div class="bento-box bento-col-6" style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.35);">
        <span class="apple-card-tag cyan">🛠️ EN PROFUNDIDAD // LA ECUACIÓN DE GAP</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">${isEs ? 'Metrología de Discrepancia Levenshtein' : 'Levenshtein Discrepancy Metrology'}</h3>
        <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.55; margin-bottom: 12px;">
          ${isEs 
            ? 'SHIM calcula la distancia de edición fonética entre el texto planificado (T_plan) y el audio transcrito (T_audio). Si la similitud cae por debajo del 98.5%, se emite un GAP alert con código de tiempo exacto.' 
            : 'SHIM computes phonetic edit distance between planned script and transcribed speech. If similarity falls under 98.5%, a timecoded GAP alert is generated.'}
        </p>
        <div style="background: #000; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 11px; color: #38bdf8; border: 1px solid rgba(255,255,255,0.1);">
          GAP_SCORE = 1.0 - (LevenshteinDistance(T_plan, T_audio) / MaxLength) -> PASS if GAP == 0.00%
        </div>
      </div>

    </div>

    <!-- How SHIM Adapts to Everything -->
    <h2 class="section-title" style="font-size: 2rem; margin-bottom: 1.5rem; text-align: center;">
      ${isEs ? 'Cómo SHIM se Adapta a Cada Parte del Sistema' : 'How SHIM Adapts Across the Whole Pipeline'}
    </h2>

    <div class="viewer-bento-grid">
      <div class="bento-box bento-col-4">
        <span class="apple-card-tag gold">FASE 1: PRE-PRODUCCIÓN</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Validación de Guion' : 'Script Compliance'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Verifica que el guion cumpla con las leyes de tono de marca y no contenga frases prohibidas.</p>
      </div>
      <div class="bento-box bento-col-4">
        <span class="apple-card-tag cyan">FASE 2: EN EL SET</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Auditoría en Vivo' : 'Live Speech Audit'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Escucha en tiempo real mediante Whisper y te avisa al instante si omitiste una palabra clave.</p>
      </div>
      <div class="bento-box bento-col-4">
        <span class="apple-card-tag purple">FASE 3: POST-EXPORTACIÓN</span>
        <h4 style="font-size: 1.2rem; color: #fff; margin-bottom: 6px;">${isEs ? 'Inspección Visual 8K' : 'Visual Slide Inspection'}</h4>
        <p style="font-size: 0.88rem; color: #94a3b8;">Escanea las diapositivas del carrusel y subtítulos para garantizar que no haya texto cortado.</p>
      </div>
    </div>

  </main>

  ${getFooter(locale)}
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[DeepDive Suite] Generated /${locale}/tools/shim/index.html`);
}

// 5. GENERATE ARQUITECTO COGNITIVE LENS PAGE (/tools/arquitecto/index.html)
function generateArquitectoPage(locale) {
  const isEs = locale === 'es';
  const targetDir = path.join(docsDir, locale, 'tools/arquitecto');
  fs.mkdirSync(targetDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'ARQUITECTO: Tu Coach, Asistente y Guía Estratégico — ABRAXAS OS' : 'ARQUITECTO: Your Coach, Assistant & Strategic Guide — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Descubre cómo funciona ARQUITECTO: como coach que desafía tus ideas, asistente de redacción, orquestador de módulos y guía de crecimiento.' : 'Deep dive into ARQUITECTO: system orchestrator, creative coach, writing assistant, and strategic guide in ABRAXAS OS.'}">
  <link rel="stylesheet" href="../../../assets/apple-macbook-pro-v3.css">
</head>
<body class="theme-dark">
  ${getHeader(locale, 'arquitecto', 3)}

  <main class="section-container" style="padding-top: 80px; padding-bottom: 80px; max-width: 1200px;">
    
    <div class="section-title-wrap" style="text-align: center;">
      <span class="section-eyebrow" style="color: #d4af37;">COGNITIVE ORCHESTRATION // ARQUITECTO LENS</span>
      <h1 class="headline-gradient" style="font-size: clamp(2.5rem, 5.5vw, 4.2rem);">
        ${isEs ? 'ARQUITECTO.<br/>Tu Coach, Asistente y Guía Estratégico.' : 'ARQUITECTO.<br/>Your Coach, Assistant & Strategic Guide.'}
      </h1>
      <p class="subhead" style="margin: 0 auto 2.5rem auto;">
        ${isEs 
          ? 'ARQUITECTO es el cerebro cognitivo de ABRAXAS. No es un chatbot genérico: es una inteligencia especializada que conoce tu marca, tus audiencias, tus números y tus 13 herramientas a la perfección.'
          : 'ARQUITECTO is the cognitive brain of ABRAXAS. It acts as an unrelenting coach, tireless assistant, and strategic orchestrator.'}
      </p>
    </div>

    <!-- The 4 Personas / Roles of Arquitecto -->
    <div class="viewer-bento-grid" style="margin-bottom: 4rem;">
      
      <!-- Persona 1: Coach -->
      <div class="bento-box bento-col-6" style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.35);">
        <div>
          <span class="apple-card-tag gold">ROL 01 // EL COACH EXIGENTE</span>
          <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.75rem;">${isEs ? 'Desafía Premisas Débiles y Pule tu Criterio' : 'Challenges Weak Premises & Sharpens Voice'}</h3>
          <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.55;">
            ${isEs 
              ? 'Si intentas crear un contenido genérico o un gancho aburrido, ARQUITECTO te frena. Te pregunta: "¿Por qué alguien se detendría en esto? ¿Cuál es tu ángulo contrario?" Te empuja a formular tesis de autoridad real.' 
              : 'If you draft generic fluff, ARQUITECTO halts you. It asks: "Why would anyone stop for this? What is your contrarian angle?" It forces you to build true authority.'}
          </p>
        </div>
      </div>

      <!-- Persona 2: Assistant -->
      <div class="bento-box bento-col-6" style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.35);">
        <div>
          <span class="apple-card-tag cyan">ROL 02 // EL ASISTENTE DE PRODUCCIÓN</span>
          <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.75rem;">${isEs ? 'Escribe Borradores y Ramifica en 8 Formatos' : 'Drafts Content & Branches into 8 Formats'}</h3>
          <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.55;">
            ${isEs 
              ? 'Le das una nota de voz o una idea en sucio y él te entrega: el guion en 4 tiempos para teleprompter, las 8 diapositivas del carrusel con copys listos, el hilo de 7 posts para X y el correo de ventas.' 
              : 'Feed it a rough voice note and it outputs: a 4-beat teleprompter script, 8 carousel slides with design copy, a 7-post X thread, and a sales email.'}
          </p>
        </div>
      </div>

      <!-- Persona 3: Strategic Guide -->
      <div class="bento-box bento-col-6" style="background: rgba(191, 90, 242, 0.08); border: 1px solid rgba(191, 90, 242, 0.35);">
        <div>
          <span class="apple-card-tag purple">ROL 03 // EL GUÍA ESTRATÉGICO</span>
          <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.75rem;">${isEs ? 'Orquestador del Embudo y Coordenadas XYZA' : 'Funnel Orchestration & XYZA Mapping'}</h3>
          <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.55;">
            ${isEs 
              ? 'Te ayuda a balancear tu calendario: te dice cuándo publicar piezas de atracción masiva (X=Expansión) y cuándo publicar contenido educativo denso de conversión (Y=Restricción).' 
              : 'Maintains healthy funnel balance: advises when to deploy viral attraction pieces and when to release dense conversion essays.'}
          </p>
        </div>
      </div>

      <!-- Persona 4: System Inspector -->
      <div class="bento-box bento-col-6" style="background: rgba(48, 209, 88, 0.08); border: 1px solid rgba(48, 209, 88, 0.35);">
        <div>
          <span class="apple-card-tag emerald">ROL 04 // EL AUDITOR DE SISTEMA</span>
          <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.75rem;">${isEs ? 'Supervisión de Base de Datos y Merkle-DAG' : 'Database & Merkle-DAG Auditing'}</h3>
          <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.55;">
            ${isEs 
              ? 'Puedes preguntarle en lenguaje natural: "¿Qué videos faltan por aprobar? ¿Cuánto tiempo tardó la síntesis de ayer? ¿Cuál es el hash SHA-256 de este guion?" y te responde al instante con datos precisos.' 
              : "Query in natural language: Which assets need review? What was the render time? What is the SHA-256 hash? with instant telemetry."}
          </p>
        </div>
      </div>

    </div>

  </main>

  ${getFooter(locale)}
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[DeepDive Suite] Generated /${locale}/tools/arquitecto/index.html`);
}

// 6. GENERATE CONTENT LIFECYCLE FLOW PAGE (/flujo/index.html)
function generateLifecycleFlowPage(locale) {
  const isEs = locale === 'es';
  const targetDir = path.join(docsDir, locale, 'flujo');
  fs.mkdirSync(targetDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'El Ciclo de Vida del Contenido: De la Idea al Retorno — ABRAXAS OS' : 'Content Lifecycle Journey: Idea to Closed-Loop ROI — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'El proceso completo paso a paso que atraviesa una pieza de contenido en ABRAXAS OS para convertirse en un ecosistema de 8 formatos vivos.' : 'The complete 6-stage lifecycle journey of content inside ABRAXAS OS.'}">
  <link rel="stylesheet" href="../../assets/apple-macbook-pro-v3.css">
</head>
<body class="theme-dark">
  ${getHeader(locale, 'flujo', 2)}

  <main class="section-container" style="padding-top: 80px; padding-bottom: 80px; max-width: 1200px;">
    
    <div class="section-title-wrap" style="text-align: center;">
      <span class="section-eyebrow" style="color: #2997ff;">DETERMINISTIC CLOSED-LOOP // CONTENT LIFECYCLE</span>
      <h1 class="headline-gradient" style="font-size: clamp(2.5rem, 5.5vw, 4.2rem);">
        ${isEs ? 'El Ciclo de Vida del Contenido.<br/>De la Semilla Pura al Retorno de Retención.' : 'The Content Lifecycle Journey.<br/>From Pure Seed to Telemetric ROI.'}
      </h1>
      <p class="subhead" style="margin: 0 auto 2.5rem auto;">
        ${isEs 
          ? 'Descubre las 6 fases inmutables que atraviesa cada activo de tu marca para ser concebido, estructurado, verificado, auto-editado y aprendido en bucle cerrado.' 
          : 'Explore the 6 deterministic phases every brand asset moves through from conception to continuous feedback learning.'}
      </p>
    </div>

    <!-- 6 Phase Journey Grid -->
    <div class="viewer-bento-grid">
      
      <div class="bento-box bento-col-12" style="background: #0d0d12; border-left: 4px solid #d4af37;">
        <span class="apple-card-tag gold">FASE 01 // GÉNESIS & CRITERIO (ATZILUTH)</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 8px;">1. Ingesta de Idea y Radar de Ganchos (Módulo YOD)</h3>
        <p style="font-size: 0.95rem; color: #94a3b8; line-height: 1.55;">
          ${isEs 
            ? 'Ingresas un tema, enlace o nota de voz. YOD evalúa los puntos ciegos de la audiencia y formula una tesis central aprobada con 3 ganchos magnéticos calificados de 0 a 100.' 
            : 'You enter a topic or voice note. YOD evaluates audience blind spots and formulates an approved master thesis with 3 dialectic hooks scored 0-100.'}
        </p>
      </div>

      <div class="bento-box bento-col-12" style="background: #0d0d12; border-left: 4px solid #38bdf8;">
        <span class="apple-card-tag cyan">FASE 02 // ESTRUCTURA & CONTINUIDAD (BERI'AH)</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 8px;">2. Ramificación en 8 Formatos Vivos (Módulo CONTENIDO)</h3>
        <p style="font-size: 0.95rem; color: #94a3b8; line-height: 1.55;">
          ${isEs 
            ? 'El motor Merkle-DAG asigna un contentId inmutable y genera simultáneamente: el guion teleprompter de video, las 8 láminas del carrusel, el hilo de X/LinkedIn y la newsletter.' 
            : 'The Merkle-DAG engine assigns an immutable contentId and simultaneously generates: video teleprompter script, 8 carousel slides, X/LinkedIn thread, and newsletter.'}
        </p>
      </div>

      <div class="bento-box bento-col-12" style="background: #0d0d12; border-left: 4px solid #bf5af2;">
        <span class="apple-card-tag purple">FASE 03 // AUDITORÍA EN SET & VERIFICACIÓN (DAAT)</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 8px;">3. Grabación Lúcida y Metrología 0.00% GAPs (Módulo SHIM)</h3>
        <p style="font-size: 0.95rem; color: #94a3b8; line-height: 1.55;">
          ${isEs 
            ? 'Grabas con el teleprompter nativo mientras SHIM escucha en tiempo real con Whisper. Si te saltas una frase o hay ruido en el set, te avisa para corregir en 5 segundos.' 
            : 'Record on the native teleprompter while SHIM listens live via Whisper. If you skip a phrase or encounter audio clipping, it prompts immediate on-set correction.'}
        </p>
      </div>

      <div class="bento-box bento-col-12" style="background: #0d0d12; border-left: 4px solid #30d158;">
        <span class="apple-card-tag emerald">FASE 04 // SÍNTESIS INDUSTRIAL EN 18S (YETZIRAH)</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 8px;">4. Auto-Cortes, Subtítulos y Motions (Módulo VAV)</h3>
        <p style="font-size: 0.95rem; color: #94a3b8; line-height: 1.55;">
          ${isEs 
            ? 'VAV auto-edita los silencios muertos en 18s, aplica subtítulos cinéticos con resaltado palabra por palabra, renderiza las 13 familias de motion y exporta las láminas gráficas.' 
            : 'VAV auto-trims silent pauses in 18s, applies word-level kinetic captions, renders 13 Remotion motion families, and exports high-res graphics.'}
        </p>
      </div>

      <div class="bento-box bento-col-12" style="background: #0d0d12; border-left: 4px solid #ff453a;">
        <span class="apple-card-tag ruby">FASE 05 // GOBIERNO & DESPACHO EN LOTE (ASSIAH)</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 8px;">5. Aprobación Ejecutiva de 50 Piezas (Módulo HE)</h3>
        <p style="font-size: 0.95rem; color: #94a3b8; line-height: 1.55;">
          ${isEs 
            ? 'El operador o líder de marketing revisa el lote en el tablero Kanban. Una sola aprobación sella los archivos en el baúl criptográfico SHA-256 y programa el mes de contenido.' 
            : 'Marketing leadership reviews batch cards on the Kanban desk. One click approves 50 assets into the immutable SHA-256 CAS vault and schedules publication.'}
        </p>
      </div>

      <div class="bento-box bento-col-12" style="background: #0d0d12; border-left: 4px solid #f59e0b;">
        <span class="apple-card-tag gold">FASE 06 // RETORNO TELEMÉTRICO & APRENDIZAJE (LA LUNA)</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 8px;">6. Curvas de Retención y Re-Ignición de YOD (Módulo METRICS)</h3>
        <p style="font-size: 0.95rem; color: #94a3b8; line-height: 1.55;">
          ${isEs 
            ? 'Metrics ingesta las curvas de retención real de TikTok, Instagram y LinkedIn en la Dimensión A: S(t+1) = S(t) + A(t). El sistema aprende qué ganchos retuvieron más para el siguiente lote.' 
            : 'Metrics feeds second-by-second watch time into Dimension A: S(t+1) = S(t) + A(t). The system compounds intelligence to make future content more viral.'}
        </p>
      </div>

    </div>

  </main>

  ${getFooter(locale)}
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[DeepDive Suite] Generated /${locale}/flujo/index.html`);
}


// 7. GENERATE CONTENIDO MERKLE-DAG PAGE (/tools/contenido/index.html)
function generateContenidoPage(locale) {
  const isEs = locale === 'es';
  const targetDir = path.join(docsDir, locale, 'tools/contenido');
  fs.mkdirSync(targetDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'CONTENIDO: Eje de Continuidad y Merkle-DAG — ABRAXAS OS' : 'CONTENIDO: Continuity Axis & Merkle-DAG — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Cómo funciona el Eje de Continuidad de CONTENIDO: identidad de pieza única, árbol Merkle-DAG y ramificación automática en 8 formatos.' : 'Deep dive into CONTENIDO Merkle-DAG single piece identity and 8-format synchronized branching in ABRAXAS OS.'}">
  <link rel="stylesheet" href="../../../assets/apple-macbook-pro-v3.css">
</head>
<body class="theme-dark">
  ${getHeader(locale, 'contenido', 3)}

  <main class="section-container" style="padding-top: 80px; padding-bottom: 80px; max-width: 1200px;">
    
    <div class="section-title-wrap" style="text-align: center;">
      <span class="section-eyebrow" style="color: #38bdf8;">BERI'AH CREATION // CONTINUITY AXIS</span>
      <h1 class="headline-gradient" style="font-size: clamp(2.5rem, 5.5vw, 4.2rem);">
        ${isEs ? 'CONTENIDO: Eje de Continuidad.<br/>Una Identidad. Ocho Formatos Vivos.' : 'CONTENIDO: The Continuity Axis.<br/>One Identity. Eight Living Formats.'}
      </h1>
      <p class="subhead" style="margin: 0 auto 2.5rem auto;">
        ${isEs 
          ? 'En la mayoría de empresas el contenido se fragmenta en 20 archivos sueltos. CONTENIDO crea un árbol criptográfico Merkle-DAG donde una sola semilla genera y mantiene sincronizados 8 formatos derivados.'
          : 'Traditional workflows suffer from fragmented files. CONTENIDO maintains an immutable Merkle-DAG tree synchronizing 8 living format derivatives.'}
      </p>
    </div>

    <!-- Dual Summary & Deep Dive -->
    <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem; margin-bottom: 3.5rem;">
      
      <div class="bento-box bento-col-6" style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.35);">
        <span class="apple-card-tag cyan">⚡ EN 30 SEGUNDOS // RESUMEN EJECUTIVO</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">${isEs ? '¿Por qué el Eje de Continuidad es Revolucionario?' : 'Why the Continuity Axis is Revolutionary?'}</h3>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.92rem; color: #e2e8f0; line-height: 1.5;">
          <li>🔒 <strong>Identidad Inmutable (contentId):</strong> Cada pieza tiene un identificador único que rastrea su evolución desde borrador hasta publicación.</li>
          <li>🌳 <strong>Sincronización en Cascada:</strong> Cambias una palabra en el guion y los subtítulos del reel, el carrusel de Instagram y la newsletter se actualizan solos.</li>
          <li>📦 <strong>Cero Enlaces Rotos:</strong> Las tomas de video, pistas de voz y diapositivas se guardan por contenido (CAS), eliminando la pantalla roja de "Media Offline".</li>
          <li>📊 <strong>Historial Forense:</strong> Cada cambio queda firmado con SHA-256 para saber exactamente quién editó qué y cuándo.</li>
        </ul>
      </div>

      <div class="bento-box bento-col-6" style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.35);">
        <span class="apple-card-tag gold">🛠️ EN PROFUNDIDAD // ESTRUCTURA MERKLE-DAG</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">${isEs ? 'Topología del Grafo de Contenido' : 'Content Graph Topology'}</h3>
        <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.55; margin-bottom: 12px;">
          ${isEs 
            ? 'El nodo raíz representa la Tesis de Marca (YOD). De él se derivan los nodos hijos: <code>derivative_reel_9x16</code>, <code>derivative_carousel_4x5</code>, <code>derivative_thread_x</code>, etc. Cada nodo contiene el hash de sus dependencias.' 
            : 'The root node represents Brand Thesis (YOD). Child nodes branch into 9:16 reel, 4:5 carousel, X thread, etc., referencing parent Merkle hashes.'}
        </p>
        <div style="background: #000; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 11px; color: #38bdf8; border: 1px solid rgba(255,255,255,0.1);">
          root_hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
        </div>
      </div>

    </div>

  </main>

  ${getFooter(locale)}
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[DeepDive Suite] Generated /${locale}/tools/contenido/index.html`);
}

// 8. GENERATE YOD CREATIVE INTELLIGENCE PAGE (/tools/yod/index.html)
function generateYodPage(locale) {
  const isEs = locale === 'es';
  const targetDir = path.join(docsDir, locale, 'tools/yod');
  fs.mkdirSync(targetDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'YOD: Inteligencia de Nicho y Radar de Ganchos — ABRAXAS OS' : 'YOD: Niche Radar & Contrarian Hooks — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Cómo funciona el motor creativo YOD: radar de puntos ciegos, generación de ganchos dialécticos y calificación de 0 a 100.' : 'Deep dive into YOD Creative Intelligence, niche blind spot scanning, and 0-100 hook scoring.'}">
  <link rel="stylesheet" href="../../../assets/apple-macbook-pro-v3.css">
</head>
<body class="theme-dark">
  ${getHeader(locale, 'yod', 3)}

  <main class="section-container" style="padding-top: 80px; padding-bottom: 80px; max-width: 1200px;">
    
    <div class="section-title-wrap" style="text-align: center;">
      <span class="section-eyebrow" style="color: #d4af37;">ATZILUTH // CREATIVE INTELLIGENCE</span>
      <h1 class="headline-gradient" style="font-size: clamp(2.5rem, 5.5vw, 4.2rem);">
        ${isEs ? 'YOD: Inteligencia Seminal.<br/>El Relámpago Primordial que Detiene el Scroll.' : 'YOD: Creative Intelligence.<br/>The Primordial Spark Stopping the Scroll.'}
      </h1>
      <p class="subhead" style="margin: 0 auto 2.5rem auto;">
        ${isEs 
          ? 'YOD es el punto de ignición. Escanea las creencias obsoletas de tu nicho y genera aperturas dialécticas de alto impacto que obligan al usuario a prestar atención.'
          : 'YOD is the ignition spark. It scans outdated niche dogmas and outputs contrarian dialectic hooks commanding immediate audience focus.'}
      </p>
    </div>

    <!-- Dual Summary & Deep Dive -->
    <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem; margin-bottom: 3.5rem;">
      
      <div class="bento-box bento-col-6" style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.35);">
        <span class="apple-card-tag gold">⚡ EN 30 SEGUNDOS // RESUMEN EJECUTIVO</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">${isEs ? '¿Cómo genera YOD ganchos magnéticos?' : 'How YOD Generates Magnetic Hooks?'}</h3>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.92rem; color: #e2e8f0; line-height: 1.5;">
          <li>🎯 <strong>Radar de Puntos Ciegos:</strong> Detecta lo que todo el mundo repite como loro en tu industria y formula la tesis contraria fundamentada.</li>
          <li>📊 <strong>Calificación 0 a 100:</strong> Evalúa la tensión dramática, la claridad y la promesa del gancho. Si puntúa menos de 85/100, exige optimizarlo.</li>
          <li>🔥 <strong>3 Ángulos por Formato:</strong> Te da una variante de confrontación directa, una de curiosidad intelectual y una de historia práctica.</li>
          <li>🧠 <strong>Alineado con tus Axiomas:</strong> Nunca genera ganchos clickbait que violen la dignidad o el tono de tu marca.</li>
        </ul>
      </div>

      <div class="bento-box bento-col-6" style="background: rgba(191, 90, 242, 0.08); border: 1px solid rgba(191, 90, 242, 0.35);">
        <span class="apple-card-tag purple">🛠️ EN PROFUNDIDAD // LA ECUACIÓN DIALÉCTICA</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">${isEs ? 'Estructura Triádica Tesis-Antítesis-Síntesis' : 'Triadic Thesis-Antithesis-Synthesis'}</h3>
        <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.55; margin-bottom: 12px;">
          ${isEs 
            ? 'YOD aplica dialéctica hegeliana: expone la creencia común (Tesis), revela su fallo destructivo (Antítesis) y presenta tu metodología como la única salida lógica (Síntesis).' 
            : 'YOD applies dialectic structure: states common dogma (Thesis), exposes its failure (Antithesis), and positions your methodology as the solution (Synthesis).'}
        </p>
        <div style="background: #000; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 11px; color: #bf5af2; border: 1px solid rgba(255,255,255,0.1);">
          HOOK_SCORE = (Tension * 0.4) + (Clarity * 0.3) + (Authority * 0.3) -> 92/100
        </div>
      </div>

    </div>

  </main>

  ${getFooter(locale)}
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[DeepDive Suite] Generated /${locale}/tools/yod/index.html`);
}

// 9. GENERATE HE KANBAN OPERATIONS PAGE (/tools/he/index.html)
function generateHePage(locale) {
  const isEs = locale === 'es';
  const targetDir = path.join(docsDir, locale, 'tools/he');
  fs.mkdirSync(targetDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'HE: Despacho de Operaciones Kanban de 50 Lotes — ABRAXAS OS' : 'HE: 50-Asset Batch Operations Desk — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Cómo funciona el módulo HE: tablero Kanban nativo en macOS, 6 compuertas de control de calidad y despacho de 50 activos en una tarde.' : 'Deep dive into HE operational Kanban desk and 50-asset batch governance in ABRAXAS OS.'}">
  <link rel="stylesheet" href="../../../assets/apple-macbook-pro-v3.css">
</head>
<body class="theme-dark">
  ${getHeader(locale, 'he', 3)}

  <main class="section-container" style="padding-top: 80px; padding-bottom: 80px; max-width: 1200px;">
    
    <div class="section-title-wrap" style="text-align: center;">
      <span class="section-eyebrow" style="color: #30d158;">ASSIAH WORKSHOP // KANBAN OPERATIONS DESK</span>
      <h1 class="headline-gradient" style="font-size: clamp(2.5rem, 5.5vw, 4.2rem);">
        ${isEs ? 'HE: Despacho de Operaciones.<br/>50 Activos Multicanal en una Sola Tarde.' : 'HE: Operational Operations Desk.<br/>50 Multi-Channel Assets in One Afternoon.'}
      </h1>
      <p class="subhead" style="margin: 0 auto 2.5rem auto;">
        ${isEs 
          ? 'HE es el mundo de la acción concreta en macOS. Un tablero visual donde un solo líder de marketing gobierna, aprueba y despacha un mes entero de contenido en un clic.'
          : 'HE is the workshop of physical manifestation on macOS. A single operator governs and batch-exports an entire month of multi-channel content.'}
      </p>
    </div>

    <!-- Dual Summary & Deep Dive -->
    <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem; margin-bottom: 3.5rem;">
      
      <div class="bento-box bento-col-6" style="background: rgba(48, 209, 88, 0.08); border: 1px solid rgba(48, 209, 88, 0.35);">
        <span class="apple-card-tag emerald">⚡ EN 30 SEGUNDOS // RESUMEN EJECUTIVO</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">${isEs ? '¿Cómo se gobiernan 50 piezas al mes?' : 'How to Govern 50 Monthly Assets?'}</h3>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.92rem; color: #e2e8f0; line-height: 1.5;">
          <li>📋 <strong>Tablero Kanban por Fases:</strong> Arrastras tarjetas entre Idea, Guion, Grabado, Verificado, Síntesis y Aprobado.</li>
          <li>⚡ <strong>Aprobación en Lote:</strong> Un solo botón "Aprobar Lote" exporta y programa 50 videos, carruseles y posts a la vez.</li>
          <li>🚦 <strong>Alertas de Calidad en Vivo:</strong> Tarjetas con errores de SHIM se marcan en rojo para que nunca salgan a producción.</li>
          <li>👥 <strong>Multi-Rol Sin Confusión:</strong> Asigna tareas a redactores, editores o directores con permisos claros de aprobación.</li>
        </ul>
      </div>

      <div class="bento-box bento-col-6" style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.35);">
        <span class="apple-card-tag cyan">🛠️ EN PROFUNDIDAD // PERSISTENCIA SQLITE LOCAL</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 1rem;">${isEs ? 'Motor de Estados Determinista' : 'Deterministic State Machine'}</h3>
        <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.55; margin-bottom: 12px;">
          ${isEs 
            ? 'Cada proyecto sigue una máquina de estados finitos inmutable: <code>DRAFT -> RECORDED -> VERIFIED -> SYNTHESIZED -> APPROVED -> PUBLISHED</code>. Cada transición queda registrada con timestamp y firma forense.' 
            : 'Projects transition across an immutable finite state machine with SQLite timestamps and forensic signing.'}
        </p>
        <div style="background: #000; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 11px; color: #38bdf8; border: 1px solid rgba(255,255,255,0.1);">
          UPDATE projects SET state = 'APPROVED', approved_by = 'CEO', approved_at = 1788298000
        </div>
      </div>

    </div>

  </main>

  ${getFooter(locale)}
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[DeepDive Suite] Generated /${locale}/tools/he/index.html`);
}


function executeDeepDiveSuite() {
  ['es', 'en'].forEach(locale => {
    generateMotionsPage(locale);
    generateCaptionsPage(locale);
    generateCutsPage(locale);
    generateShimPage(locale);
    generateArquitectoPage(locale);
    generateContenidoPage(locale);
    generateYodPage(locale);
    generateHePage(locale);
    generateLifecycleFlowPage(locale);
  });
  console.log('✨ [DeepDive Suite] Complete Technical Deep-Dive Suite compiled successfully!');
}

executeDeepDiveSuite();
