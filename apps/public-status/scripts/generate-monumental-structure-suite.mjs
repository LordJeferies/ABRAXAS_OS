import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');
const docsDir = path.join(rootDir, 'docs/abraxas-os-status');

function getRootPrefix(depth) {
  if (depth === 0) return '';
  return '../'.repeat(depth);
}

function getHeader(locale, activePage, depth = 3) {
  const isEs = locale === 'es';
  const root = getRootPrefix(depth);
  const langPrefix = `${root}${locale}/`;
  const otherLocale = isEs ? 'en' : 'es';
  const switchLangHref = `${root}${otherLocale}/index.html`;

  return `
  <div class="film-grain-overlay"></div>
  <nav class="apple-localnav" aria-label="Local Navigation">
    <div class="localnav-inner">
      <a href="${root}index.html" class="localnav-brand">
        <span>ABRAXAS OS</span>
        <span class="tag">v3.3 MONUMENTAL</span>
      </a>
      <div class="localnav-items">
        <a href="${root}index.html" class="localnav-a">${isEs ? 'Inicio' : 'Home'}</a>
        <a href="${langPrefix}piramide/index.html" class="localnav-a ${activePage === 'piramide' ? 'active' : ''}" style="color: #d4af37; font-weight: 700;">▲ ${isEs ? 'La Pirámide' : 'The Pyramid'}</a>
        <a href="${langPrefix}soles/sol-negro/index.html" class="localnav-a ${activePage === 'sol-negro' ? 'active' : ''}">🌑 ${isEs ? 'Sol Negro' : 'Black Sun'}</a>
        <a href="${langPrefix}soles/sol-blanco/index.html" class="localnav-a ${activePage === 'sol-blanco' ? 'active' : ''}">☀️ ${isEs ? 'Sol Blanco' : 'White Sun'}</a>
        <a href="${langPrefix}mundos/atziluth/index.html" class="localnav-a ${activePage === 'atziluth' ? 'active' : ''}">🔥 Atziluth</a>
        <a href="${langPrefix}mundos/briah/index.html" class="localnav-a ${activePage === 'briah' ? 'active' : ''}">🌊 Briah</a>
        <a href="${langPrefix}mundos/yetzirah/index.html" class="localnav-a ${activePage === 'yetzirah' ? 'active' : ''}">💨 Yetzirah</a>
        <a href="${langPrefix}mundos/assiah/index.html" class="localnav-a ${activePage === 'assiah' ? 'active' : ''}">🌱 Assiah</a>
        <a href="${langPrefix}lunas/luna-1-publicador/index.html" class="localnav-a ${activePage === 'luna-1' ? 'active' : ''}">🛰️ Luna 1</a>
        <a href="${langPrefix}lunas/luna-2-procesos-retencion/index.html" class="localnav-a ${activePage === 'luna-2' ? 'active' : ''}">🛰️ Luna 2</a>
        <a href="${langPrefix}lunas/luna-3-financiera-roi/index.html" class="localnav-a ${activePage === 'luna-3' ? 'active' : ''}">🛰️ Luna 3</a>
      </div>
      <div class="localnav-right">
        <a href="${switchLangHref}" class="localnav-a" style="font-family: var(--font-mono); font-weight: 700; color: #fff;">${isEs ? 'EN' : 'ES'}</a>
        <a href="${root}index.html" class="btn-apple-cta">${isEs ? 'Cúspide' : 'Apex'}</a>
      </div>
    </div>
  </nav>
  `;
}

function getFooter(locale, depth = 3) {
  const isEs = locale === 'es';
  const root = getRootPrefix(depth);
  const langPrefix = `${root}${locale}/`;

  return `
  <footer style="background: #050508; border-top: 1px solid rgba(255,255,255,0.08); padding: 4rem 1.5rem 2rem 1.5rem; font-size: 0.85rem; color: #86868b; margin-top: 5rem;">
    <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
      <div>
        <h4 style="color: #fff; font-size: 0.9rem; margin-bottom: 0.8rem;">${isEs ? 'Estructura Monumental' : 'Monumental Structure'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px;">
          <li><a href="${langPrefix}piramide/index.html" style="color: #d4af37;">▲ ${isEs ? 'Pirámide de Bloque Negro' : 'Black Block Pyramid'}</a></li>
          <li><a href="${langPrefix}piramide/cuspide-oro/index.html">👑 ${isEs ? 'Cúspide de Oro (YOD)' : 'Gold Capstone'}</a></li>
          <li><a href="${langPrefix}piramide/umbral-daat/index.html">👁️ ${isEs ? 'Umbral de Daat & SHIM' : 'Daat Threshold'}</a></li>
          <li><a href="${langPrefix}piramide/cristales-teluricos/index.html">💎 ${isEs ? 'Cristales Telúricos' : 'Telluric Crystals'}</a></li>
          <li><a href="${langPrefix}piramide/forja-vav/index.html">🎬 ${isEs ? 'Forja VAV en 18s' : 'VAV 18s Forge'}</a></li>
          <li><a href="${langPrefix}piramide/camara-sqlite/index.html">🗄️ ${isEs ? 'Cámara SQLite metrics.db' : 'SQLite Vault'}</a></li>
        </ul>
      </div>
      <div>
        <h4 style="color: #fff; font-size: 0.9rem; margin-bottom: 0.8rem;">${isEs ? 'Los Dos Soles' : 'The Two Suns'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px;">
          <li><a href="${langPrefix}soles/sol-negro/index.html" style="color: #cbd5e1;">🌑 ${isEs ? 'Sol Negro (Software & Sabiduría)' : 'Black Sun (Engine)'}</a></li>
          <li><a href="${langPrefix}soles/sol-blanco/index.html" style="color: #fef08a;">☀️ ${isEs ? 'Sol Blanco (Marca del Cliente)' : 'White Sun (Brand)'}</a></li>
        </ul>
      </div>
      <div>
        <h4 style="color: #fff; font-size: 0.9rem; margin-bottom: 0.8rem;">${isEs ? 'Las 4 Caras (Dion Fortune)' : 'The 4 Faces (Dion Fortune)'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px;">
          <li><a href="${langPrefix}mundos/atziluth/index.html" style="color: #f59e0b;">Cara Sur: Atziluth (Mente)</a></li>
          <li><a href="${langPrefix}mundos/briah/index.html" style="color: #38bdf8;">Cara Occidente: Briah (Datos)</a></li>
          <li><a href="${langPrefix}mundos/yetzirah/index.html" style="color: #bf5af2;">Cara Oriente: Yetzirah (Forja)</a></li>
          <li><a href="${langPrefix}mundos/assiah/index.html" style="color: #30d158;">Cara Norte: Assiah (Acción)</a></li>
        </ul>
      </div>
      <div>
        <h4 style="color: #fff; font-size: 0.9rem; margin-bottom: 0.8rem;">${isEs ? 'Las Tres Lunas' : 'The Three Moons'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 6px;">
          <li><a href="${langPrefix}lunas/luna-1-publicador/index.html">🛰️ Luna 1: Despacho a 8 Redes</a></li>
          <li><a href="${langPrefix}lunas/luna-2-procesos-retencion/index.html">🛰️ Luna 2: Tareas & Retención</a></li>
          <li><a href="${langPrefix}lunas/luna-3-financiera-roi/index.html" style="color: #30d158;">🛰️ Luna 3: Finanzas & ROI</a></li>
        </ul>
      </div>
    </div>
    <div style="max-width: 1240px; margin: 0 auto; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <p>ABRAXAS OS &bull; Arquitectura Determinista en Apple Silicon.</p>
      <p style="font-family: var(--font-mono); color: #d4af37; font-size: 0.78rem;">SHA-256: 91234741f0b3a1ac5bd7e4c0556fafa868d00769</p>
    </div>
  </footer>
  `;
}

function buildPage(filePath, title, eyebrow, headline, intro, sections, locale, activePage, depth) {
  const root = getRootPrefix(depth);
  const isEs = locale === 'es';

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — ABRAXAS OS</title>
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body class="theme-dark">
  ${getHeader(locale, activePage, depth)}

  <main class="section-wrap" style="padding-top: 60px; max-width: 1240px; margin: 0 auto;">
    <div class="section-head" style="text-align: center; margin-bottom: 4rem;">
      <span class="tag" style="color: #d4af37;">${eyebrow}</span>
      <h1 class="h2" style="margin-top: 8px;">${headline}</h1>
      <p class="p" style="max-width: 860px; margin: 0 auto;">${intro}</p>
    </div>

    ${sections.map(s => `
      <section style="margin-bottom: 4rem;">
        <div class="section-head" style="text-align: left; margin-bottom: 1.5rem;">
          <span class="tag" style="color: ${s.tagColor || '#38bdf8'};">${s.tag}</span>
          <h2 class="h2" style="font-size: 1.8rem; margin: 4px 0;">${s.title}</h2>
          ${s.subtitle ? `<p class="p" style="margin: 0; font-size: 0.95rem;">${s.subtitle}</p>` : ''}
        </div>
        <div class="bento-grid">
          ${s.cards.map(c => `
            <div class="spotlight-card ${c.col || 'col-6'}" style="background: #0a0b12; border-left: 4px solid ${c.border || '#d4af37'};">
              <span class="card-pill-tag ${c.pill || 'gold'}">${c.badge}</span>
              <h3 class="card-h3" style="margin-top: 8px;">${c.header}</h3>
              <p class="card-desc" style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">${c.body}</p>
              ${c.extraHtml || ''}
            </div>
          `).join('')}
        </div>
      </section>
    `).join('')}
  </main>

  ${getFooter(locale, depth)}
</body>
</html>`;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`  -> Generado: ${path.relative(docsDir, filePath)}`);
}

export function generateAllMonumentalPages() {
  console.log('🏛️ Generando la Suite Monumental Completa...');

  ['es', 'en'].forEach(locale => {
    const isEs = locale === 'es';

    // 1. LA PIRÁMIDE
    buildPage(
      path.join(docsDir, locale, 'piramide/index.html'),
      isEs ? 'La Pirámide de Bloque Negro Monumental' : 'The Black Block Monumental Pyramid',
      'MONUMENTAL ARCHITECTURE // HOLOGRAPHIC SANCTUARY',
      isEs ? 'La Gran Pirámide de Bloque Negro.<br/>Estructura, Cristales y Cúspide de Oro.' : 'The Black Block Monumental Pyramid.<br/>Structure, Telluric Crystals & Gold Capstone.',
      isEs ? 'Enviada desde el rayo del eclipse primordial (Kav), la Pirámide Negra desciende sobre la Tierra. Al impactar, gigantescos cristales telúricos brotan y la elevan. A su alrededor se consolida la piedra negra monumental con textura Space Black, culminando en un piramidión de oro macizo puro donde reside YOD.' : 'Dispatched from the eclipse ray, the Black Pyramid descends to Earth. Telluric crystals erupt to elevate it, surrounded by Space Black mineral stone, crowned with solid gold.',
      [
        {
          tag: '01 // GENESIS TELÚRICO',
          title: isEs ? 'El Descenso y la Consolidación de la Forma' : 'Descent & Structural Consolidation',
          tagColor: '#d4af37',
          cards: [
            {
              badge: 'KAV // EL RAYO',
              header: isEs ? 'Del Eclipse al Suelo Terrestre' : 'From the Eclipse to Earth',
              body: isEs ? 'El rayo del eclipse transporta la semilla geométrica. No es una metáfora decorativa: es la condensación de la ley y el software sobre el plano físico.' : 'The eclipse ray carries the geometric seed. It condenses law and software onto the physical plane.',
              border: '#d4af37'
            },
            {
              badge: 'TELÚRICO // ELEVACIÓN',
              header: isEs ? 'Los Cristales Subterráneos' : 'The Subterranean Crystals',
              body: isEs ? 'Cristales minerales brotan del suelo y levantan la pirámide hacia el cielo. Representan la fuerza telúrica de la materia y el Árbol de la Vida que asciende.' : 'Mineral crystals erupt to lift the pyramid towards heaven, representing telluric force and the ascending Tree of Life.',
              border: '#38bdf8'
            }
          ]
        },
        {
          tag: '02 // ANATOMÍA MONUMENTAL',
          title: isEs ? 'Las 5 Cámaras Internas de la Pirámide' : 'The 5 Internal Chambers of the Pyramid',
          tagColor: '#f59e0b',
          cards: [
            {
              badge: 'CÚSPIDE',
              header: isEs ? 'La Cúspide de Oro Puro (YOD)' : 'Solid Gold Capstone (YOD)',
              body: isEs ? 'Punta áurea maciza. Asiento del motor YOD y del micro agujero negro desde donde el Ojo de Arquitecto supervisa en 3D.' : 'Pure gold capstone. Seat of YOD and the micro black hole of the Architect.',
              border: '#d4af37',
              extraHtml: `<a href="../piramide/cuspide-oro/index.html" class="btn-control-center" style="display:inline-block; margin-top:10px; font-size:0.75rem;">Explorar Cúspide ➔</a>`
            },
            {
              badge: 'DAAT',
              header: isEs ? 'El Umbral de Conciencia Lúcida (SHIM)' : 'Threshold of Active Consciousness (SHIM)',
              body: isEs ? 'Cámara de confrontación Planned vs. Observed con Whisper ANE a 0.00% GAPs y firma SHA-256.' : 'Chamber of confrontation with Whisper ANE at 0.00% GAPs and SHA-256 signature.',
              border: '#ef4444',
              extraHtml: `<a href="../piramide/umbral-daat/index.html" class="btn-control-center" style="display:inline-block; margin-top:10px; font-size:0.75rem;">Explorar Daat ➔</a>`
            },
            {
              badge: 'CRISTALES',
              header: isEs ? 'El Santuario Central de Cristales' : 'Central Sanctuary of Telluric Crystals',
              body: isEs ? 'El núcleo telúrico que sostiene la estabilidad estructural y la memoria inmutable en Merkle-DAG.' : 'The telluric core sustaining structural stability and Merkle-DAG immutable memory.',
              border: '#a855f7',
              extraHtml: `<a href="../piramide/cristales-teluricos/index.html" class="btn-control-center" style="display:inline-block; margin-top:10px; font-size:0.75rem;">Explorar Cristales ➔</a>`
            },
            {
              badge: 'VAV',
              header: isEs ? 'La Gran Forja Audiovisual en 18s' : 'The 18s Audiovisual Forge',
              body: isEs ? 'Auto-corte quirúrgico FFT a -38 dBFS, 7 motions y mastering EBU R128 a -14 LUFS.' : 'FFT surgical cut at -38 dBFS, 7 motions, and EBU R128 broadcast mastering.',
              border: '#2997ff',
              extraHtml: `<a href="../piramide/forja-vav/index.html" class="btn-control-center" style="display:inline-block; margin-top:10px; font-size:0.75rem;">Explorar Forja ➔</a>`
            },
            {
              badge: 'SQLITE',
              header: isEs ? 'La Bóveda Relacional metrics.db' : 'The Relational SQLite Vault',
              body: isEs ? 'La base contable en Assiah donde residen costos de equipo, facturación OCR y balance P&L.' : 'The accounting vault in Assiah storing team costs, OCR invoices, and P&L.',
              border: '#30d158',
              col: 'col-12',
              extraHtml: `<a href="../piramide/camara-sqlite/index.html" class="btn-control-center" style="display:inline-block; margin-top:10px; font-size:0.75rem;">Explorar Bóveda SQLite ➔</a>`
            }
          ]
        }
      ],
      locale,
      'piramide',
      2
    );

    // 2. SOL NEGRO
    buildPage(
      path.join(docsDir, locale, 'soles/sol-negro/index.html'),
      isEs ? 'El Sol Negro Preexistente (ABRAXAS OS)' : 'The Pre-Existing Black Sun (ABRAXAS OS)',
      'PRE-SEPHIROTIC CRITERIA // SEVERITY & LAW',
      isEs ? 'El Sol Negro Preexistente.<br/>Software, Gravedad y Sabiduría Editorial.' : 'The Pre-Existing Black Sun.<br/>Software, Gravity & Editorial Wisdom.',
      isEs ? 'Antes de cualquier cliente, el Sol Negro ya existe. Es la densidad infinita, la geometría fría y el Tzimtzum (auto-contracción). Contiene la infraestructura inmutable de ABRAXAS OS y toda la sabiduría editorial pre-construida (4 tiempos, copies anti-slop, 7 motions, 4 campañas).' : 'Before any client exists, the Black Sun is already there. It contains the fixed software of ABRAXAS OS and all pre-built editorial wisdom.',
      [
        {
          tag: '01 // INFRAESTRUCTURA TÉCNICA',
          title: isEs ? 'La Ley Dura del Software' : 'The Hard Law of Software',
          tagColor: '#cbd5e1',
          cards: [
            {
              badge: 'ENGINE',
              header: isEs ? 'Cortes FFT y 7 Motions' : 'FFT Cuts & 7 Motions',
              body: isEs ? 'Corte de silencios por FFT a -38 dBFS con respiraciones de 80ms y micro-fades de 5ms. Duración exacta: 18 segundos. Siete motions fijos en tracks V1 a V4.' : 'FFT audio silence removal at -38 dBFS, 80ms breaths, 5ms micro-fades. Exactly 18s duration. Seven fixed motions.',
              border: '#94a3b8'
            },
            {
              badge: 'ACOUSTICS',
              header: isEs ? 'Norma Broadcast EBU R128' : 'EBU R128 Broadcast Standard',
              body: isEs ? 'Normalización integrada a -14.0 LUFS (+/- 0.5 LUFS), limitador True Peak a -1.0 dBTP y sidechain ducking de música a -18dB.' : 'Integrated normalization at -14.0 LUFS, True Peak at -1.0 dBTP, and music ducking at -18dB.',
              border: '#94a3b8'
            }
          ]
        },
        {
          tag: '02 // SABIDURÍA EDITORIAL PRE-HECHA',
          title: isEs ? 'Leyes Editoriales Inmutables' : 'Immutable Editorial Laws',
          tagColor: '#d4af37',
          cards: [
            {
              badge: 'RITMO',
              header: isEs ? 'El Compás de 4 Tiempos' : 'The 4-Beat Meter',
              body: isEs ? 'Hook (0-3s) ➔ Tesis (3-7s) ➔ Mecanismo (7-15s) ➔ Payoff (15-18s). Toda deuda narrativa debe pagarse antes del segundo 18.' : 'Hook (0-3s) ➔ Thesis (3-7s) ➔ Mechanism (7-15s) ➔ Payoff (15-18s). Narrative debt must be repaid.',
              border: '#d4af37'
            },
            {
              badge: 'COPIES',
              header: isEs ? 'Calidad Anti-Slop (Hilbert >= 0.88)' : 'Anti-Slop Quality (Hilbert >= 0.88)',
              body: isEs ? 'Prohibido usar frases de IA, sonrisas de stock y autoayuda genérica. El lenguaje debe ser quirúrgico, forense y de alta autoridad.' : 'No AI generic clichés, stock footage smiles, or shallow self-help. Surgical, forensic, authoritative prose.',
              border: '#d4af37'
            }
          ]
        }
      ],
      locale,
      'sol-negro',
      3
    );

    // 3. SOL BLANCO
    buildPage(
      path.join(docsDir, locale, 'soles/sol-blanco/index.html'),
      isEs ? 'El Sol Blanco (La Marca del Cliente)' : 'The White Sun (The Client Brand)',
      'PRE-SEPHIROTIC CRITERIA // MERCY & LIVING VOICE',
      isEs ? 'El Sol Blanco.<br/>La Sustancia Viva, Historia y Números del Cliente.' : 'The White Sun.<br/>The Client Living Substance, History & Metrics.',
      isEs ? 'El Sol Blanco es la chispa viva y expansiva de la empresa o creador. Por sí solo se quemaría en contenido desordenado. Se llena con la verdad del cliente a través del ABRAXAS Branding Method (Origen, Destino, Identidad, Potencial).' : 'The White Sun is the living, expansive spark of the company. It is filled via the ABRAXAS Branding Method across 4 foundational vectors.',
      [
        {
          tag: '01 // LA MATRIZ DE 4 VECTORES',
          title: isEs ? 'Los Cuatro Vectores del Branding Method' : 'The 4 Branding Method Vectors',
          tagColor: '#fef08a',
          cards: [
            {
              badge: 'ORIGEN',
              header: isEs ? '1. ¿De Dónde Vienes?' : '1. Where Do You Come From?',
              body: isEs ? 'La herida fundacional, los errores del mercado que te obligaron a innovar y las frustraciones reales de tu nicho.' : 'Foundational friction, competitor flaws that forced you to invent your solution, and raw industry pains.',
              border: '#ef4444'
            },
            {
              badge: 'DESTINO',
              header: isEs ? '2. ¿A Dónde Quieres Ir?' : '2. Where Do You Want to Go?',
              body: isEs ? 'La visión de expansión a 5 años, el territorio comercial a conquistar y las metas de facturación.' : '5-year expansion vision, commercial category dominance, and revenue targets.',
              border: '#30d158'
            },
            {
              badge: 'IDENTIDAD',
              header: isEs ? '3. ¿Quién Eres Ahora?' : '3. Who Are You Right Now?',
              body: isEs ? 'Axiomas inmutables, pruebas verificadas, testimonios reales y la postura radical de tu marca.' : 'Immutable axioms, verified proof, client cases, and your uncompromising market stance.',
              border: '#38bdf8'
            },
            {
              badge: 'POTENCIAL',
              header: isEs ? '4. ¿Quién Más Puedes Ser?' : '4. Who Else Can You Become?',
              body: isEs ? 'El catálogo de ofertas, el producto insignia y la categoría de mercado donde no compites por precio.' : 'Product catalog, flagship offer, and the high-ticket space where you never compete on price.',
              border: '#bf5af2'
            }
          ]
        }
      ],
      locale,
      'sol-blanco',
      3
    );

    // 4. LOS 4 MUNDOS (CARAS DE LA PIRÁMIDE)
    const mundos = [
      {
        slug: 'atziluth',
        name: isEs ? 'Cara Sur: Atziluth (Mundo de la Emanación)' : 'South Face: Atziluth (Emanation World)',
        element: isEs ? 'Fuego // Letra YOD // Mente & Tesis' : 'Fire // Letter YOD // Mind & Thesis',
        desc: isEs ? 'El Árbol de la Mente y la Intención Pura. Contiene 10 Sephiroth completas dedicadas a formular la tesis soberana, el radar cognitivo y el Brand Core.' : 'The Tree of Mind and Pure Intent. Holds a full 10-Sephiroth Tree formulating sovereign thesis and brand axioms.',
        color: '#f59e0b'
      },
      {
        slug: 'briah',
        name: isEs ? 'Cara Occidente: Briah (Mundo de la Creación)' : 'West Face: Briah (Creation World)',
        element: isEs ? 'Agua // Primera HÉ // Estructura de Datos' : 'Water // First HE // Data Architecture',
        desc: isEs ? 'El Árbol de la Arquitectura de Datos. Contiene 10 Sephiroth completas gobernando el Merkle-DAG inmutable en CAS SHA-256, el Eje 1➔8 y HE Desk.' : 'The Tree of Data Architecture. Holds a full 10-Sephiroth Tree governing Merkle-DAG in CAS SHA-256, 1-to-8 cascade, and HE Desk.',
        color: '#38bdf8'
      },
      {
        slug: 'yetzirah',
        name: isEs ? 'Cara Oriente: Yetzirah (Mundo de la Formación)' : 'East Face: Yetzirah (Formation World)',
        element: isEs ? 'Aire // Letra VAV // Forja Audiovisual' : 'Air // Letter VAV // Audiovisual Forge',
        desc: isEs ? 'El Árbol de la Forja Audiovisual. Contiene 10 Sephiroth completas donde SHIM audita a 0.00% GAPs en Daat y VAV renderiza el master en 18s.' : 'The Tree of Audiovisual Forge. Holds a full 10-Sephiroth Tree where SHIM verifies 0.00% GAPs in Daat and VAV renders 18s masters.',
        color: '#bf5af2'
      },
      {
        slug: 'assiah',
        name: isEs ? 'Cara Norte: Assiah (Mundo de la Acción)' : 'North Face: Assiah (Action World)',
        element: isEs ? 'Tierra // Segunda HÉ // Retorno Comercial' : 'Earth // Second HE // Commercial Return',
        desc: isEs ? 'El Árbol de la Acción Comercial y Materia. Contiene 10 Sephiroth completas gobernando el despacho a 8 redes, las campañas y Luna 3 con OCR y ROI.' : 'The Tree of Commercial Action and Matter. Holds a full 10-Sephiroth Tree governing 8-channel dispatch, campaigns, and Moon 3 OCR.',
        color: '#30d158'
      }
    ];

    mundos.forEach(m => {
      buildPage(
        path.join(docsDir, locale, `mundos/${m.slug}/index.html`),
        m.name,
        'HOLOGRAPHIC CABALA // DION FORTUNE 4 FACES',
        m.name,
        m.desc,
        [
          {
            tag: '01 // DOCTRINA HOLOGRÁFICA',
            title: isEs ? 'Un Árbol de la Vida Completo con 10 Sephiroth' : 'A Complete 10-Sephiroth Tree of Life',
            tagColor: m.color,
            cards: [
              {
                badge: '10 ESFERAS',
                header: isEs ? `Las 10 Estaciones de ${m.slug.toUpperCase()}` : `The 10 Stations of ${m.slug.toUpperCase()}`,
                body: isEs ? `En la tradición de Dion Fortune ('La Cábala Mística'), cada mundo es holográfico: contiene su propio Keter, Jojmá, Binah, Chesed, Gevurah, Tiféret, Netzach, Hod, Yesod y Malkut especializados.` : `Following Dion Fortune ('The Mystical Qabalah'), every world contains its own complete 10-sphere Tree.`,
                border: m.color
              },
              {
                badge: 'ESCALA DE JACOB',
                header: isEs ? 'Traspaso Continuo entre Caras' : 'Continuous Jacob\'s Ladder Transfer',
                body: isEs ? `El Malkut de esta cara despierta el Keter de la cara siguiente, completando el circuito cósmico cerrado: S(t+1) = S(t) + A(t).` : `Malkut of this face awakens Keter of the next, closing the cosmic feedback loop: S(t+1) = S(t) + A(t).`,
                border: m.color
              }
            ]
          }
        ],
        locale,
        m.slug,
        3
      );
    });

    // 5. LAS TRES LUNAS (PÁGINAS INDIVIDUALES)
    // Luna 1
    buildPage(
      path.join(docsDir, locale, 'lunas/luna-1-publicador/index.html'),
      isEs ? 'Luna 1: El Publicador Multicanal' : 'Moon 1: The Multi-Channel Dispatcher',
      'ORBITAL SATELLITE 1 // ADAPTIVE DISTRIBUTION',
      isEs ? 'Luna 1: El Publicador Multicanal.<br/>Despacho a 8 Plataformas en Safe Zones 9:16.' : 'Moon 1: The Multi-Channel Dispatcher.<br/>Adaptive 8-Network Dispatch in Safe Zones 9:16.',
      isEs ? 'Satélite exterior orbital que toma el master audiovisual de 18s y lo transcodifica adaptativamente para TikTok, Instagram, YouTube Shorts, X, LinkedIn, Substack, Podcasts y Medium sin compresión destructiva.' : 'Orbital satellite taking the 18s master and adaptively transcoding it for 8 platforms in strict compliance.',
      [
        {
          tag: '01 // ESPECIFICACIONES TÉCNICAS',
          title: isEs ? 'Cumplimiento de Red y Safe Zones' : 'Network Compliance & Safe Zones',
          tagColor: '#38bdf8',
          cards: [
            {
              badge: '9:16 SAFE ZONES',
              header: isEs ? '280px Inferiores y 120px Derechos Libres' : '280px Bottom & 120px Right Margin',
              body: isEs ? 'Garantiza que la interfaz de TikTok y Reels (botones de like, comentarios y audio) nunca tape los textos ni el rostro del orador.' : 'Guarantees UI overlays from TikTok and Instagram never occlude typography or speaker.',
              border: '#38bdf8'
            },
            {
              badge: 'BITRATE',
              header: isEs ? 'H.264 / HEVC a 12 Mbps' : 'H.264 / HEVC at 12 Mbps',
              body: isEs ? 'Exportación con audio AAC a 320 kbps y 48 kHz para evitar la re-compresión agresiva de las redes sociales.' : 'AAC 320 kbps at 48 kHz audio export preventing platform recompression artifacts.',
              border: '#38bdf8'
            }
          ]
        }
      ],
      locale,
      'luna-1',
      3
    );

    // Luna 2
    buildPage(
      path.join(docsDir, locale, 'lunas/luna-2-procesos-retencion/index.html'),
      isEs ? 'Luna 2: Tareas, Procesos y Retención' : 'Moon 2: Tasks, Processes & Retention',
      'ORBITAL SATELLITE 2 // OPERATIONS & AUDIENCE RESONANCE',
      isEs ? 'Luna 2: Procesos, Tareas de Equipo y Retención.<br/>El Pulso de la Fábrica y la Audiencia.' : 'Moon 2: Processes, Team Tasks & Retention.<br/>The Factory Pulse and Audience Attention.',
      isEs ? 'Satélite exterior con doble función: audita los procesos de creación y gestiona el tablero Kanban de tareas de los empleados, mientras monitorea en vivo las curvas de retención y APV de la audiencia exterior.' : 'Dual-role orbital satellite: audits creative workflows and governs employee Kanban tasks while tracking audience drop-off curves.',
      [
        {
          tag: '01 // GESTIÓN DE TAREAS & PROCESOS',
          title: isEs ? 'El Tablero de Trabajo de los Empleados' : 'The Employee Task Board',
          tagColor: '#bf5af2',
          cards: [
            {
              badge: 'KANBAN',
              header: isEs ? 'Control de Colaboradores' : 'Collaborator Governance',
              body: isEs ? 'Asignación de tareas a editores, copywriters y diseñadores en estados BACKLOG, IN_PROGRESS, REVIEW, BLOCKED y DONE.' : 'Assigning tasks to editors, copywriters, and designers across standardized operational states.',
              border: '#bf5af2'
            },
            {
              badge: 'CUELLOS DE BOTELLA',
              header: isEs ? 'Detección de Tiempos Muertos' : 'Idle Time & Bottleneck Detection',
              body: isEs ? 'Mide las horas de espera (idleSeconds) y destraba los procesos de trabajo antes de que se pierda dinero en sueldos.' : 'Measures idleSeconds and unblocks production bottlenecks before payroll is wasted.',
              border: '#ef4444'
            }
          ]
        },
        {
          tag: '02 // RETENCIÓN DE AUDIENCIA',
          title: isEs ? 'Muestreo Sensorial Segundo a Segundo' : 'Second-by-Second Audience Telemetry',
          tagColor: '#38bdf8',
          cards: [
            {
              badge: '0-18S DROP-OFF',
              header: isEs ? 'Caídas al Segundo 3 y APV' : 'Second 3 Drop-Off & APV',
              body: isEs ? 'Si la retención cae del 60% en el segundo 3, Luna 2 penaliza automáticamente con -25 puntos a YOD para mutar el gancho en el próximo lote.' : 'If retention falls below 60% at second 3, Moon 2 docks 25 points from YOD to force hook mutation.',
              border: '#38bdf8'
            }
          ]
        }
      ],
      locale,
      'luna-2',
      3
    );

    // Luna 3
    buildPage(
      path.join(docsDir, locale, 'lunas/luna-3-financiera-roi/index.html'),
      isEs ? 'Luna 3: Finanzas, Ventas por Campaña & ROI' : 'Moon 3: Finance, Campaign Sales & ROI',
      'ORBITAL SATELLITE 3 // COMMERCIAL METRICS & MONEY',
      isEs ? 'Luna 3: La Luna Financiera.<br/>Costos de Fábrica, Ventas por Campaña y ROI Real.' : 'Moon 3: The Financial Moon.<br/>Manufacturing Costs, Campaign Sales & Real ROI.',
      isEs ? 'Satélite exterior que gobierna la economía del negocio: traduce los tiempos de Luna 2 en costos financieros ($/activo), escanea facturas con OCR on-device en Python, audita ventas tanto por Campaña General como por Pieza Individual, y calcula el ROI real.' : 'Orbital satellite governing finances: converts Moon 2 turnaround into manufacturing costs ($/asset), ingests receipts via on-device OCR, audits campaign sales, and computes true ROI.',
      [
        {
          tag: '01 // COSTOS DE PRODUCCIÓN',
          title: isEs ? 'La Fábrica Interna al Centavo' : 'Internal Factory Down to the Cent',
          tagColor: '#f59e0b',
          cards: [
            {
              badge: 'COSTO DE ACTIVO',
              header: isEs ? '$44.00 USD por Reel en Timers' : '$44.00 USD per Reel in Timers',
              body: isEs ? 'Calcula el costo sumando horas reales trabajadas por tarifa de cada empleado. Cero mezcla con datos de clientes o ventas.' : 'Computes cost by summing active hours multiplied by user hourly rate. Zero customer data contamination.',
              border: '#f59e0b'
            },
            {
              badge: 'COSTO CUELLO BOTELLA',
              header: isEs ? 'Cuantificación de Fricción' : 'Friction Quantification',
              body: isEs ? 'Muestra cuánto dinero se perdió en sueldos por cada hora que un empleado estuvo bloqueado esperando aprobación.' : 'Shows payroll wasted per hour an employee spent blocked waiting for review.',
              border: '#ef4444'
            }
          ]
        },
        {
          tag: '02 // VENTAS POR CAMPAÑA Y POR PIEZA',
          title: isEs ? 'Auditoría Dual de Ingresos' : 'Dual Revenue Audit',
          tagColor: '#30d158',
          cards: [
            {
              badge: 'MACRO',
              header: isEs ? 'Ventas por Campaña General' : 'Macro Campaign Sales',
              body: isEs ? 'Compara el costo de manufactura de todo el lote ($680 USD) contra las ventas totales ($13,450 USD). Atribución sin pérdidas para leads que consumieron varios videos.' : 'Compares full batch cost ($680) against total sales ($13,450). Leak-free attribution for multi-video viewers.',
              border: '#30d158'
            },
            {
              badge: 'MICRO',
              header: isEs ? 'Ventas por Pieza Individual' : 'Per-Piece Direct Sales',
              body: isEs ? 'Identifica qué video o carrusel específico disparó la conversación o compra en WhatsApp, revelando los ganchos ganadores.' : 'Identifies which exact reel or carousel triggered the inbound lead, highlighting winning hooks.',
              border: '#2997ff'
            }
          ]
        }
      ],
      locale,
      'luna-3',
      3
    );

    // 6. PARTES INTERNAS DE LA PIRÁMIDE (CÁMARAS)
    const camaras = [
      {
        slug: 'cuspide-oro',
        name: isEs ? 'La Cúspide de Oro Macizo' : 'The Solid Gold Capstone',
        tag: 'APEX // ASINTO DE YOD',
        desc: isEs ? 'El piramidión áureo puro. Donde el Sol Negro y el Sol Blanco convergen. Alberga el motor YOD y el micro agujero negro de Arquitecto.' : 'Pure gold pyramidion where Black and White suns converge. Houses YOD engine and Architect eye.',
        color: '#d4af37'
      },
      {
        slug: 'umbral-daat',
        name: isEs ? 'El Umbral de Daat & SHIM' : 'The Daat Threshold & SHIM Gate',
        tag: 'INTERSTITIAL // ACTIVE CONSCIOUSNESS',
        desc: isEs ? 'La cámara del fuego de Shin. Conciencia lúcida activa donde SHIM ejecuta Whisper ANE a 0.00% GAPs con certificación criptográfica SHA-256.' : 'Chamber of Shin fire. Active consciousness where SHIM executes Whisper ANE at 0.00% GAPs with SHA-256 hash.',
        color: '#ef4444'
      },
      {
        slug: 'cristales-teluricos',
        name: isEs ? 'El Santuario de Cristales Telúricos' : 'Sanctuary of Telluric Crystals',
        tag: 'GEOLOGICAL // TELURIC LIFT',
        desc: isEs ? 'Los cristales gigantes que brotaron del suelo para elevar la pirámide hacia el cielo. Sostienen la matriz Merkle-DAG inmutable y el eje CAS.' : 'Giant mineral crystals that erupted from the earth to lift the pyramid, sustaining immutable Merkle-DAG and CAS.',
        color: '#a855f7'
      },
      {
        slug: 'forja-vav',
        name: isEs ? 'La Gran Forja Audiovisual VAV' : 'The VAV Audiovisual Forge',
        tag: 'TIFERET // 18S AUDIVISUAL FORGE',
        desc: isEs ? 'El corazón solar de la síntesis audiovisual. FFT a -38 dBFS, 7 motions canónicos y compuerta sonora EBU R128 a -14 LUFS.' : 'Solar heart of audiovisual synthesis. FFT silence cut at -38 dBFS, 7 motions, and EBU R128 mastering.',
        color: '#2997ff'
      },
      {
        slug: 'camara-sqlite',
        name: isEs ? 'La Bóveda Relacional metrics.db' : 'The SQLite Relational Vault',
        tag: 'ASSIAH // SOBERANIA SQLITE',
        desc: isEs ? 'La cámara subterránea de Assiah donde residen las tablas de costos de equipo, cuellos de botella y facturación OCR con privacidad 100% en Apple Silicon.' : 'Subterranean vault storing team costs, bottlenecks, and OCR invoices locally with zero cloud dependencies.',
        color: '#30d158'
      }
    ];

    camaras.forEach(c => {
      buildPage(
        path.join(docsDir, locale, `piramide/${c.slug}/index.html`),
        c.name,
        c.tag,
        c.name,
        c.desc,
        [
          {
            tag: '01 // ESPECIFICACIÓN DETERMINISTA',
            title: isEs ? 'Propósito y Operación en el Sistema' : 'Purpose and Operation in the System',
            tagColor: c.color,
            cards: [
              {
                badge: 'ROL',
                header: isEs ? 'Función en la Gran Pirámide' : 'Function in the Great Pyramid',
                body: c.desc,
                border: c.color
              },
              {
                badge: 'SOBERANÍA',
                header: isEs ? 'Integración en Apple Silicon' : 'Integration in Apple Silicon',
                body: isEs ? 'Cero dependencias de servidores en la nube. Todo el procesamiento corre en los motores locales de hardware de tu Mac.' : 'Zero cloud dependencies. All processing runs locally on your Mac hardware engines.',
                border: c.color
              }
            ]
          }
        ],
        locale,
        c.slug,
        3
      );
    });
  });

  console.log('✨ ¡Todas las páginas individuales generadas con éxito!');
}

generateAllMonumentalPages();
