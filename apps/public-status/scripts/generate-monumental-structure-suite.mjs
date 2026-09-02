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
        <a href="${langPrefix}lunas/luna-3-financiera-roi/index.html" class="localnav-a ${activePage === 'luna-3' ? 'active' : ''}" style="color: #30d158; font-weight: 700;">🛰️ Luna 3</a>
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
    function getMegaFooter(locale, depth = 2) {
  const isEs = locale === 'es';
  let root = '';
  if (depth === 1) root = '../';
  else if (depth === 2) root = '../../';
  else if (depth === 3) root = '../../../';
  else if (depth === 4) root = '../../../../';

  const lang = `${root}${locale}/`;

  return `
  <!-- MEGA FOOTER UNIVERSAL ABRAXAS OS -->
  <footer style="background: #040407; border-top: 1px solid rgba(255,255,255,0.1); padding: 5rem 1.5rem 3rem 1.5rem; font-size: 0.85rem; color: #86868b; margin-top: 6rem;">
    <div style="max-width: 1320px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2.5rem; margin-bottom: 3.5rem;">
      
      <!-- COL 1: ESTRUCTURA MONUMENTAL & CÁMARAS -->
      <div>
        <h4 style="color: #d4af37; font-size: 0.95rem; margin-bottom: 1rem; font-weight: 700;">▲ La Gran Pirámide</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${lang}piramide/index.html" style="color: #fff; font-weight: 600;">▲ Estructura Monumental</a></li>
          <li><a href="${lang}piramide/cuspide-oro/index.html">👑 Cúspide de Oro (YOD)</a></li>
          <li><a href="${lang}piramide/umbral-daat/index.html">👁️ Umbral Da'at & SHIM</a></li>
          <li><a href="${lang}piramide/cristales-teluricos/index.html">💎 Cristales Telúricos</a></li>
          <li><a href="${lang}piramide/forja-vav/index.html">🎬 Forja Audiovisual VAV (18s)</a></li>
          <li><a href="${lang}piramide/camara-sqlite/index.html">🗄️ Bóveda SQLite (metrics.db)</a></li>
        </ul>
      </div>

      <!-- COL 2: LOS DOS SOLES & LOS 4 MUNDOS -->
      <div>
        <h4 style="color: #fef08a; font-size: 0.95rem; margin-bottom: 1rem; font-weight: 700;">☀️ Soles & 4 Planos</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${lang}soles/sol-negro/index.html" style="color: #cbd5e1;">🌑 Sol Negro (Software & Ley)</a></li>
          <li><a href="${lang}soles/sol-blanco/index.html" style="color: #fef08a;">☀️ Sol Blanco (Marca del Cliente)</a></li>
          <li><a href="${lang}mundos/atziluth/index.html" style="color: #f59e0b;">🔥 Cara Sur: Atziluth (Mente)</a></li>
          <li><a href="${lang}mundos/briah/index.html" style="color: #38bdf8;">🌊 Cara Occidente: Briah (Datos)</a></li>
          <li><a href="${lang}mundos/yetzirah/index.html" style="color: #bf5af2;">💨 Cara Oriente: Yetzirah (Forja)</a></li>
          <li><a href="${lang}mundos/assiah/index.html" style="color: #30d158;">🌱 Cara Norte: Assiah (Acción)</a></li>
        </ul>
      </div>

      <!-- COL 3: LAS TRES LUNAS ORBITALES -->
      <div>
        <h4 style="color: #38bdf8; font-size: 0.95rem; margin-bottom: 1rem; font-weight: 700;">🛰️ Las Tres Lunas</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${lang}lunas/luna-1-publicador/index.html">🛰️ Luna 1: Despacho a 8 Redes</a></li>
          <li><a href="${lang}lunas/luna-2-procesos-retencion/index.html">🛰️ Luna 2: Tareas & Retención</a></li>
          <li><a href="${lang}lunas/luna-3-financiera-roi/index.html" style="color: #30d158; font-weight: 700;">🛰️ Luna 3: Finanzas, OCR & ROI</a></li>
          <li><a href="${lang}luna-comercial/index.html#ventas-campana">🎯 Ventas por Campaña General</a></li>
          <li><a href="${lang}luna-comercial/index.html#atribucion">🔗 Ventas por Pieza Individual</a></li>
        </ul>
      </div>

      <!-- COL 4: PROCESOS, VENTAS & INGENIERÍA -->
      <div>
        <h4 style="color: #30d158; font-size: 0.95rem; margin-bottom: 1rem; font-weight: 700;">💼 Ventas & Procesos</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${lang}proceso-ingenieria/index.html" style="color: #38bdf8; font-weight: 600;">⚙️ Proceso Técnico (Sin Cábala)</a></li>
          <li><a href="${lang}speech-ventas/index.html" style="color: #30d158; font-weight: 700;">🔥 Speech de Ventas & Objeciones</a></li>
          <li><a href="${lang}branding-method/index.html#campanas">🎯 Branding Method & 4 Campañas</a></li>
          <li><a href="${lang}gerencia/index.html">💼 Gobernanza & Control de Costos</a></li>
          <li><a href="${lang}abraxas-core-example/index.html">💎 Caso Real ABRAXAS Core</a></li>
          <li><a href="${lang}criterios-roadmap/index.html">🗺️ Criterios & Roadmap</a></li>
        </ul>
      </div>

      <!-- COL 5: LAS 10 HERRAMIENTAS CORE -->
      <div>
        <h4 style="color: #bf5af2; font-size: 0.95rem; margin-bottom: 1rem; font-weight: 700;">🔧 Las Herramientas</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${lang}tools/yod/index.html">🧭 YOD (Cognitive Radar)</a></li>
          <li><a href="${lang}tools/shim/index.html">🔍 SHIM (0.00% GAPs Set)</a></li>
          <li><a href="${lang}tools/vav/cuts/index.html">✂️ VAV Cuts (Auto-Corte 18s)</a></li>
          <li><a href="${lang}tools/vav/motions/index.html">🎬 VAV Motions (7 Motions)</a></li>
          <li><a href="${lang}tools/vav/captions/index.html">💬 VAV Captions (Cinéticos)</a></li>
          <li><a href="${lang}tools/vav/vfx/index.html">✨ VAV VFX (Ópticos 35mm)</a></li>
          <li><a href="${lang}tools/vav/framing/index.html">📐 VAV Framing (Safe Zones 9:16)</a></li>
          <li><a href="${lang}tools/vav/carousel/index.html">📑 VAV Carousel (4:5)</a></li>
          <li><a href="${lang}tools/arquitecto/index.html">👁️ Arquitecto (Ojo 3D 9D)</a></li>
          <li><a href="${lang}tools/he/index.html">🛡️ HE Desk (6 Compuertas)</a></li>
          <li><a href="${lang}tools/contenido/index.html">📦 Contenido (Spine)</a></li>
        </ul>
      </div>

      <!-- COL 6: FILOSOFÍA, SCRUM & BIBLIOTECA -->
      <div>
        <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 1rem; font-weight: 700;">📚 Canon & Filosofía</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${lang}cosmogonia/index.html">☀️ Cosmogonía Solar Completa</a></li>
          <li><a href="${lang}flujo/index.html">🔄 Ciclo de Keter a Malkut (40 Est.)</a></li>
          <li><a href="${lang}catedra/index.html">🏛️ Cátedra 165 IQ (Alta Autoridad)</a></li>
          <li><a href="${lang}gustos-canon/index.html">🎨 Canon de Gustos Apple 2026</a></li>
          <li><a href="${lang}prompt-maestro/index.html">⚡ Prompt Maestro (100 Prompts)</a></li>
          <li><a href="${lang}scrum/index.html">📋 Scrum & Backlog 100%</a></li>
          <li><a href="${lang}canon/index.html">📚 Buscador Canon 37 TXT</a></li>
          <li><a href="${lang}backup/index.html">🏛️ Bóveda de Respaldo SHA-256</a></li>
        </ul>
      </div>

    </div>

    <!-- Barra Inferior de Copyright y Hash -->
    <div style="max-width: 1320px; margin: 0 auto; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <p style="color: #64748b;">ABRAXAS OS &bull; Sistema Operativo de Contenido Determinista en Apple Silicon. Todos los derechos reservados.</p>
      <div style="display: flex; gap: 14px; align-items: center;">
        <span style="font-family: var(--font-mono); color: #d4af37; font-size: 0.8rem;">SHA-256: <code>91234741f0b3a1ac5bd7e4c0556fafa868d00769</code></span>
      </div>
    </div>
  </footer>
  <!-- FIN MEGA FOOTER UNIVERSAL -->
  `;
}
    return getMegaFooter(locale, depth);
  }

function renderRichPage(filePath, data, locale, activePage, depth) {
  const root = getRootPrefix(depth);
  const isEs = locale === 'es';

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title} — ABRAXAS OS</title>
  <meta name="description" content="${data.seoDesc}">
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body class="theme-dark">
  ${getHeader(locale, activePage, depth)}

  <main class="section-wrap" style="padding-top: 60px; max-width: 1240px; margin: 0 auto;">
    
    <!-- Hero Header -->
    <div class="section-head" style="text-align: center; margin-bottom: 3.5rem;">
      <span class="tag" style="color: ${data.heroColor || '#d4af37'};">${data.eyebrow}</span>
      <h1 class="h2" style="margin-top: 12px; font-size: 3rem; line-height: 1.15;">${data.headline}</h1>
      <p class="p" style="max-width: 900px; margin: 1.2rem auto 0 auto; font-size: 1.15rem; line-height: 1.6; color: #cbd5e1;">${data.lead}</p>
    </div>

    <!-- Quick Navigation Pills -->
    ${data.quickLinks && data.quickLinks.length ? `
      <div style="background: rgba(14, 14, 20, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 18px; margin-bottom: 3.5rem; display: flex; gap: 10px; align-items: center; overflow-x: auto; scrollbar-width: none;">
        <span style="font-size: 0.78rem; font-family: var(--font-mono); color: #d4af37; font-weight: 800; margin-right: 6px;">CAPÍTULOS:</span>
        ${data.quickLinks.map(q => `<a href="${q.href}" class="btn-control-center" style="font-size: 0.8rem; padding: 6px 14px; background: rgba(255,255,255,0.05);">${q.label}</a>`).join('')}
      </div>
    ` : ''}

    <!-- Rich Sections -->
    ${data.sections.map((sec, idx) => `
      <section id="${sec.id || `sec-${idx}`}" style="margin-bottom: 4.5rem;">
        <div class="section-head" style="text-align: left; margin-bottom: 1.8rem;">
          <span class="tag" style="color: ${sec.tagColor || '#38bdf8'};">${sec.tag}</span>
          <h2 class="h2" style="font-size: 2.2rem; margin: 6px 0;">${sec.title}</h2>
          ${sec.desc ? `<p class="p" style="margin: 0; font-size: 1.05rem; color: #94a3b8; max-width: 920px;">${sec.desc}</p>` : ''}
        </div>

        ${sec.banner ? `
          <div class="spotlight-card col-12" style="background: ${sec.banner.bg || '#0b0c16'}; border-left: 4px solid ${sec.banner.border || '#d4af37'}; margin-bottom: 2rem; padding: 2rem;">
            <span class="card-pill-tag ${sec.banner.pill || 'gold'}">${sec.banner.badge}</span>
            <h3 class="card-h3" style="margin-top: 10px; font-size: 1.5rem;">${sec.banner.title}</h3>
            <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.65; margin: 8px 0 0 0;">${sec.banner.text}</p>
            ${sec.banner.extraHtml || ''}
          </div>
        ` : ''}

        <div class="bento-grid">
          ${sec.cards.map(c => `
            <div class="spotlight-card ${c.col || 'col-6'}" style="background: #090a12; border-left: 4px solid ${c.border || '#d4af37'}; padding: 2rem; position: relative;">
              <span class="card-pill-tag ${c.pill || 'gold'}">${c.badge}</span>
              <h3 class="card-h3" style="margin-top: 10px; font-size: 1.35rem; color: #fff;">${c.title}</h3>
              <p class="card-desc" style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.65; margin-top: 8px;">${c.body}</p>
              ${c.bullets ? `
                <ul style="color: #94a3b8; font-size: 0.88rem; line-height: 1.6; margin-top: 14px; padding-left: 1.3rem;">
                  ${c.bullets.map(b => `<li style="margin-bottom: 6px;">${b}</li>`).join('')}
                </ul>
              ` : ''}
              ${c.extraHtml || ''}
            </div>
          `).join('')}
        </div>
      </section>
    `).join('')}

    <!-- Call to action footer box -->
    <div class="spotlight-card col-12" style="background: linear-gradient(180deg, rgba(212,175,55,0.08) 0%, rgba(9,10,18,0.98) 100%); border: 1px solid rgba(212,175,55,0.3); text-align: center; padding: 4rem 2rem; margin-top: 4rem;">
      <span class="card-pill-tag gold">${isEs ? 'CONTINUIDAD DETERMINISTA' : 'DETERMINISTIC CONTINUITY'}</span>
      <h3 style="color: #fff; font-size: 2.2rem; margin: 12px 0;">${data.ctaTitle || (isEs ? 'El Organismo Vivo de ABRAXAS OS' : 'The Living Organism of ABRAXAS OS')}</h3>
      <p style="color: #cbd5e1; max-width: 750px; margin: 0 auto 2rem auto; font-size: 1rem; line-height: 1.6;">
        ${data.ctaText || (isEs ? 'Cada estación de la pirámide, cada sol y cada luna operan de forma ininterrumpida para garantizar que tu marca domine el mercado con verdad matemática y cero deuda narrativa.' : 'Every station of the pyramid, every sun, and every moon operate seamlessly to ensure category dominance.')}
      </p>
      <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
        <a href="${root}index.html" class="btn-apple-cta">${isEs ? 'Volver al Inicio All-in-One' : 'Return to Master Home'}</a>
        <a href="${root}${locale}/piramide/index.html" class="btn-control-center" style="padding: 10px 22px;">▲ ${isEs ? 'Explorar la Pirámide' : 'Explore The Pyramid'}</a>
      </div>
    </div>

  </main>

  ${getFooter(locale, depth)}
</body>
</html>`;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`  ✅ Generado Dossier Monumental: ${path.relative(docsDir, filePath)}`);
}

export function generateAllMonumentalPages() {
  console.log('🏛️ Generando la Suite Monumental Completa con Máxima Riqueza...');

  ['es', 'en'].forEach(locale => {
    const isEs = locale === 'es';

    // 1. LA PIRÁMIDE (PORTADA PRINCIPAL)
    renderRichPage(
      path.join(docsDir, locale, 'piramide/index.html'),
      {
        title: isEs ? 'La Gran Pirámide de Bloque Negro Monumental' : 'The Black Block Monumental Pyramid',
        seoDesc: isEs ? 'Arquitectura completa de la Gran Pirámide de ABRAXAS OS: descenso por Kav, cristales telúricos, 4 caras holográficas de Dion Fortune y cúspide de oro.' : 'Complete architecture of the Black Block Pyramid: descent by Kav, telluric crystals, 4 holographic faces of Dion Fortune, and gold capstone.',
        eyebrow: 'MONUMENTAL ARCHITECTURE // THE COSMIC FORTRESS',
        headline: isEs ? 'La Gran Pirámide de Bloque Negro.<br/>Estructura, Cristales y Cúspide de Oro.' : 'The Black Block Monumental Pyramid.<br/>Structure, Telluric Crystals & Gold Capstone.',
        heroColor: '#d4af37',
        lead: isEs 
          ? 'Del rayo del eclipse primordial (Kav) desciende la Pirámide Negra sobre la Tierra. Al impactar el suelo, gigantescos cristales telúricos brotan y la elevan hacia el cielo. A su alrededor se consolida la Pirámide de Bloque Negro Monumental (estilo Egipto, textura Space Black mineral, no negro plano muerto). Al completarse la forma sagrada, su punta se transmuta en oro macizo puro (asiento de YOD), mientras sus 4 caras exteriores albergan un Árbol de la Vida completo cada una, según el modelo holográfico de Dion Fortune.' 
          : 'Dispatched from the eclipse ray, the Black Pyramid descends. Telluric crystals erupt to lift it, surrounded by Space Black mineral blocks, crowned with solid gold.',
        quickLinks: [
          { label: isEs ? '⚡ Génesis Telúrico' : '⚡ Telluric Genesis', href: '#genesis' },
          { label: isEs ? '🏛️ Textura Space Black' : '🏛️ Space Black Texture', href: '#textura' },
          { label: isEs ? '📐 4 Caras Holográficas' : '📐 4 Holographic Faces', href: '#caras' },
          { label: isEs ? '🚪 Las 5 Cámaras' : '🚪 The 5 Chambers', href: '#camaras' }
        ],
        sections: [
          {
            id: 'genesis',
            tag: '01 // EL IMPACTO DEL KAV',
            title: isEs ? 'El Descenso y la Elevación por Cristales Subterráneos' : 'Descent and Telluric Mineral Lift',
            desc: isEs ? 'La pirámide no fue erigida por manos humanas: es la condensación matemática de la ley del Tzimtzum sobre el plano físico de Assiah.' : 'The pyramid was not built by human hands: it is the mathematical condensation of Tzimtzum.',
            cards: [
              {
                badge: 'EL RAYO KAV',
                title: isEs ? 'El Envío desde el Eclipse Sagrado' : 'Dispatched from Sacred Eclipse',
                body: isEs ? 'El Sol Negro y el Sol Blanco entran en eclipse total. De la corona colisionada se dispara un rayo ultra-denso (Kav) que transporta la semilla geométrica de ABRAXAS OS directo hacia la corteza terrestre.' : 'Black and White suns achieve total eclipse. An ultra-dense ray (Kav) fires the seed.',
                border: '#d4af37',
                bullets: [
                  isEs ? 'Concentración infinita de gravedad y software.' : 'Infinite concentration of gravity and software.',
                  isEs ? 'Alineación de los 4 compases rítmicos antes de tocar materia.' : '4-beat meter alignment prior to hitting matter.',
                  isEs ? 'Vector inmutable que no puede ser desviado ni hackeado.' : 'Immutable vector impervious to drift.'
                ]
              },
              {
                badge: 'FUERZA TELÚRICA',
                title: isEs ? 'Brote de Columnas Minerales' : 'Eruption of Mineral Columns',
                body: isEs ? 'Al impactar el suelo, la corteza se quiebra y brotan gigantescos cristales telúricos de cuarzo negro y selenita. Estos cristales no destruyen la pirámide: la elevan hacia el cielo, sirviendo de pilares estructurales para el santuario interior.' : 'Upon impact, massive quartz and selenite crystals erupt lifting the pyramid to heaven.',
                border: '#38bdf8',
                bullets: [
                  isEs ? 'Anclaje telúrico que sostiene la memoria CAS SHA-256.' : 'Telluric anchor holding CAS SHA-256 memory.',
                  isEs ? 'Elevación física de Malkut hacia las esferas celestes.' : 'Physical lift of Malkuth toward heavenly spheres.',
                  isEs ? 'Canalización de la resonancia acústica del planeta.' : 'Channeling planetary acoustic resonance.'
                ]
              }
            ]
          },
          {
            id: 'textura',
            tag: '02 // GEOLOGÍA ESPACIAL',
            title: isEs ? 'Textura Space Black Mineral (No Negro Plano Digital)' : 'Space Black Mineral Texture (Not Flat Black)',
            desc: isEs ? 'El canon de diseño Apple 2026 exige riqueza táctil. La pirámide está labrada en piedra monolítica mineral.' : 'Apple 2026 canon demands tactile richness. Monolithic mineral blocks.',
            banner: {
              badge: 'SPACE BLACK OLED',
              title: isEs ? 'Monolitos estilo Egipto con Micro-Brillo de Amatista y Oro' : 'Egyptian-Style Monoliths with Amethyst & Gold Sheen',
              border: '#d4af37',
              pill: 'gold',
              text: isEs 
                ? 'Los bloques de la pirámide utilizan una paleta geológica viva (#07070a, #0d0d12, #16161d). Sobre la piedra se proyecta un 3% de Film Grain cinematográfico en 35mm. Cuando la luz solar roza sus aristas de 51° 50’ 40", la piedra refracta reflejos metálicos de oro azafrán y amatista eléctrica.' 
                : 'Living geological palette (#07070a, #0d0d12) with 3% 35mm grain. Refracts saffron gold and electric iris.'
            },
            cards: [
              {
                badge: 'PUNTA DE ORO',
                title: isEs ? 'La Transmutación de la Cúspide' : 'Apex Transmutation',
                body: isEs ? 'Cuando las 40 Sephiroth de las 4 caras quedan en perfecta resonancia, la punta de la pirámide se transmuta instantáneamente en oro macizo puro de 24 quilates. Allí se asienta YOD.' : 'When the 40 Sephiroth resonate in harmony, the capstone transmutes into pure 24K solid gold.',
                border: '#d4af37'
              },
              {
                badge: 'DAAT SHIN',
                title: isEs ? 'El Umbral Intersticial de Fuego' : 'Interstitial Fire Threshold',
                body: isEs ? 'En el vientre de la pirámide se abre Daat: la cámara donde arde el fuego de Shin (ש). Aquí SHIM mide la distancia Levenshtein palabra por palabra con Whisper ANE a 0.00% GAPs.' : 'At the core lies Daat where Shin fire burns. SHIM audits Whisper ANE at 0.00% GAPs.',
                border: '#ef4444'
              }
            ]
          },
          {
            id: 'caras',
            tag: '03 // DOCTRINA DION FORTUNE',
            title: isEs ? 'Las 4 Caras Exteriores: 4 Árboles Completos (40 Sephiroth)' : 'The 4 Exterior Faces: 4 Complete Trees (40 Sephiroth)',
            desc: isEs ? 'ABRAXAS OS erradica el error de apilar los mundos como pisos de un edificio. Cada cara exterior de la pirámide es un Árbol de la Vida completo con sus 10 Sephiroth.' : 'No vertical building floors. Each face is a complete 10-Sephiroth Tree of Life.',
            cards: [
              {
                badge: 'CARA SUR // FUEGO',
                title: isEs ? 'Atziluth (Mundo de la Mente)' : 'Atziluth (Mind World)',
                body: isEs ? '10 Sephiroth dedicadas a la intención pura, el diagnóstico de nicho del Branding Method, los axiomas innegociables y los ganchos de autoridad YOD.' : '10 Sephiroth dedicated to pure intention, niche diagnosis, brand axioms, and YOD hooks.',
                border: '#f59e0b',
                bullets: [
                  'Keter: La tesis de autoridad suprema',
                  'Jojmá: El rayo seminal de inspiración',
                  'Binah: La estructura lógica del argumento',
                  'Malkut: El guion congelado listo para emitir'
                ]
              },
              {
                badge: 'CARA OCCIDENTE // AGUA',
                title: isEs ? 'Briah (Mundo de los Datos)' : 'Briah (Data World)',
                body: isEs ? '10 Sephiroth dedicadas a la arquitectura de datos Merkle-DAG inmutable en CAS SHA-256, la cascada 1➔8 formatos y el escritorio operativo HE Desk.' : '10 Sephiroth dedicated to Merkle-DAG architecture in CAS SHA-256, 1-to-8 cascade, and HE Desk.',
                border: '#38bdf8',
                bullets: [
                  'Keter: El contrato fundacional de datos',
                  'Binah: El ledger Merkle-DAG en CAS',
                  'Gevurah: Las 6 compuertas de HE Desk',
                  'Malkut: El paquete de producción sellado'
                ]
              },
              {
                badge: 'CARA ORIENTE // AIRE',
                title: isEs ? 'Yetzirah (Mundo de la Forja)' : 'Yetzirah (Forge World)',
                body: isEs ? '10 Sephiroth dedicadas a la metrología fonética SHIM en set, el auto-corte quirúrgico en 18s de VAV Engine, los 7 motions y el audio EBU R128.' : '10 Sephiroth dedicated to SHIM set metrology, 18s surgical cuts of VAV, 7 motions, and EBU R128 audio.',
                border: '#bf5af2',
                bullets: [
                  'Daat: Metrología SHIM 0.00% GAPs',
                  'Tiféret: El corazón audiovisual en 18s',
                  'Netzach: Los 7 motions fijos M0 a M6',
                  'Malkut: El master ProRes 422 renderizado'
                ]
              },
              {
                badge: 'CARA NORTE // TIERRA',
                title: isEs ? 'Assiah (Mundo de la Acción)' : 'Assiah (Action World)',
                body: isEs ? '10 Sephiroth dedicadas al despacho a 8 redes, la gestión de tareas de equipo en Luna 2, las campañas multioferta y las ventas por OCR en Luna 3.' : '10 Sephiroth dedicated to 8-channel dispatch, team task Kanban in Moon 2, campaigns, and Moon 3 OCR sales.',
                border: '#30d158',
                bullets: [
                  'Netzach: Luna 1 (Despacho 8 redes Safe Zones)',
                  'Hod: Luna 2 (Kanban tareas y retención APV)',
                  'Yesod: Las 4 Campañas maestras de lote',
                  'Malkut: Luna 3 (Ventas OCR y ROI al centavo)'
                ]
              }
            ]
          }
        ]
      },
      locale,
      'piramide',
      2
    );

    // 2. CÚSPIDE DE ORO
    renderRichPage(
      path.join(docsDir, locale, 'piramide/cuspide-oro/index.html'),
      {
        title: isEs ? 'La Cúspide de Oro Macizo y el Asiento de YOD' : 'The Solid Gold Capstone & Seat of YOD',
        seoDesc: isEs ? 'Dossier exhaustivo de la Cúspide de Oro de la Gran Pirámide: asiento de YOD, convergencia de los Dos Soles y micro agujero negro de Arquitecto.' : 'Comprehensive dossier of the Gold Capstone: seat of YOD, convergence of the Two Suns, and Architect singularity.',
        eyebrow: 'APEX ARCHITECTURE // SEAT OF YOD & SINGULARITY',
        headline: isEs ? 'La Cúspide de Oro Macizo.<br/>El Piramidión Áureo, YOD y la Singularidad.' : 'The Solid Gold Capstone.<br/>The Golden Pyramidion, YOD & Singularity.',
        heroColor: '#d4af37',
        lead: isEs 
          ? 'En el vértice supremo de la Gran Pirámide de Bloque Negro descansa la Cúspide de Oro Macizo. No es un adorno: es la lente focal donde el Sol Negro (la ley y el software) y el Sol Blanco (la marca viva del cliente) convergen en eclipse perfecto. Aquí reside el motor YOD y el micro agujero negro desde donde el Ojo Digital 3D de Arquitecto supervisa en 9 disciplinas simultáneas.' 
          : 'At the supreme apex rests the Solid Gold Capstone. It is the focal lens where the Black Sun and White Sun converge in perfect eclipse.',
        quickLinks: [
          { label: isEs ? '👑 El Piramidión Áureo' : '👑 Golden Pyramidion', href: '#piramidion' },
          { label: isEs ? '⚡ El Motor YOD' : '⚡ YOD Engine', href: '#motor-yod' },
          { label: isEs ? '🕳️ La Singularidad de Arquitecto' : '🕳️ Architect Singularity', href: '#singularidad' }
        ],
        sections: [
          {
            id: 'piramidion',
            tag: '01 // METAFÍSICA Y MATERIA',
            title: isEs ? 'Por qué la Punta se Vuelve de Oro Macizo' : 'Why the Apex Transmutes into Solid Gold',
            desc: isEs ? 'La transmutación de la cima ocurre únicamente cuando la geometría de la pirámide y las 4 caras holográficas alcanzan la perfección determinista.' : 'The transmutation occurs only when the geometry of the 4 holographic faces achieves deterministic perfection.',
            cards: [
              {
                badge: 'METALOGENESIS',
                title: isEs ? 'El Asiento de la Letra YOD (י)' : 'The Seat of Letter YOD (י)',
                body: isEs ? 'El oro representa la luz solar incorruptible y la sabiduría divina (Jojmá). En la cábala de Dion Fortune, la chispa primordial no puede reposar sobre piedra tosca: requiere oro macizo para reflejar la gloria del Keter supremo sin disipar energía.' : 'Gold represents incorruptible solar light and divine wisdom (Chokmah). In Dion Fortune qabalah, the primordial spark demands solid gold.',
                border: '#d4af37',
                bullets: [
                  isEs ? 'Punto de contacto directo con el Rayo del Eclipse (Kav).' : 'Direct contact point with the Eclipse Ray (Kav).',
                  isEs ? 'Alineación astronómica con el meridiano de Atziluth (Sur/Fuego).' : 'Astronomical alignment with Atziluth meridian (South/Fire).',
                  isEs ? 'Cero impurezas: conductividad absoluta de la intención del creador.' : 'Zero impurities: absolute conductivity of creator intent.'
                ]
              },
              {
                badge: 'OPTICA SOLAR',
                title: isEs ? 'La Lente del Doble Eclipse' : 'The Dual Eclipse Focal Lens',
                body: isEs ? 'El Sol Negro preexistente y el Sol Blanco del cliente no colisionan caóticamente. La Cúspide de Oro actúa como prisma refractor: comprime la fuerza expansiva del cliente mediante la gravedad del software ABRAXAS OS, generando un haz coherente de alta intensidad.' : 'The Black Sun and White Sun do not collide in chaos. The Gold Capstone acts as a refractive prism compressing client force into coherent laser focus.',
                border: '#f59e0b',
                bullets: [
                  isEs ? 'Fusión de Rigor (Gevurah) y Amor (Jesed) pre-sefiróticos.' : 'Fusion of pre-sephirotic Rigor (Gevurah) and Mercy (Chesed).',
                  isEs ? 'Inyección de la voz del fundador en los 4 compases rítmicos.' : 'Injection of founder voice into 4-beat rhythmic meters.',
                  isEs ? 'Apertura de la deuda narrativa inmutable hacia las caras inferiores.' : 'Opening immutable narrative debt towards lower faces.'
                ]
              }
            ]
          },
          {
            id: 'motor-yod',
            tag: '02 // COGNITIVE ENGINE',
            title: isEs ? 'El Motor YOD: Axiom Vault & Radar Dialéctico' : 'YOD Engine: Axiom Vault & Dialectical Radar',
            desc: isEs ? 'Dentro de la cúspide opera el núcleo cognitivo que redacta, califica y aprueba los ganchos y tesis de marca.' : 'Inside the capstone operates the cognitive core drafting, scoring, and validating brand hooks and theses.',
            banner: {
              badge: 'HILBERT COHERENCE',
              title: isEs ? 'Espacio Vectorial de Hilbert >= 0.88' : 'Hilbert Vector Space >= 0.88',
              border: '#38bdf8',
              pill: 'cyan',
              text: isEs 
                ? 'YOD mide la coherencia semántica en un espacio de Hilbert de alta dimensionalidad. Si el borrador contiene frases hechas de IA, lugares comunes o autoayuda vacía, la coherencia cae por debajo de 0.88 y la compuerta rechaza el guion antes de que llegue a la boca del orador.' 
                : 'YOD measures semantic coherence in a high-dimensional Hilbert space. Generic AI clichés cause coherence to drop below 0.88, triggering immediate rejection.'
            },
            cards: [
              {
                badge: 'HOOK SCORE',
                title: isEs ? 'La Ecuación del Gancho Inexpugnable' : 'The Irrefutable Hook Formula',
                body: isEs ? 'Cada gancho producido en la Cúspide de Oro debe superar una calificación mínima de 85/100 calculada matemáticamente: Hook Score = (Tensión × 0.4) + (Claridad × 0.3) + (Autoridad × 0.3) >= 85.' : 'Every hook generated in the Capstone must exceed 85/100 calculated mathematically.',
                border: '#d4af37'
              },
              {
                badge: 'AXIOM VAULT',
                title: isEs ? 'Bóveda Inmutable de Axiomas' : 'Immutable Axiom Vault',
                body: isEs ? 'Los principios innegociables de tu marca residen aquí. Ningún colaborador, editor o agente de IA puede generar contenido que contradiga los axiomas fundacionales del negocio.' : 'Your brand non-negotiables live here. No editor or AI agent can publish copy contradicting foundational axioms.',
                border: '#bf5af2',
                bullets: [
                  isEs ? 'Protección contra la deriva de marca (Brand Drift).' : 'Absolute protection against brand drift.',
                  isEs ? 'Custodia forense del tono de voz y vocabulario técnico.' : 'Forensic custody of voice tone and technical vocabulary.',
                  isEs ? 'Almacenamiento en Merkle-DAG con hash SHA-256.' : 'Merkle-DAG storage with immutable SHA-256 hash.'
                ]
              }
            ]
          },
          {
            id: 'singularidad',
            tag: '03 // EL OJO 3D',
            title: isEs ? 'El Micro Agujero Negro & Ojo de Arquitecto' : 'The Micro Black Hole & Architect Eye',
            desc: isEs ? 'En el centro geométrico de la punta dorada existe una singularidad gravitatoria controlada: el Ojo de Arquitecto.' : 'In the geometric center of the gold apex exists a controlled singularity: the Architect Eye.',
            cards: [
              {
                badge: 'ARQUITECTO 3D',
                title: isEs ? 'Supervisión en 9 Disciplinas Simultáneas' : 'Supervision Across 9 Simultaneous Disciplines',
                body: isEs ? 'Desde la singularidad de la cúspide, el Ojo Digital de Arquitecto tiene visibilidad total sobre las 4 caras de la pirámide y el cosmos exterior. Audita en tiempo real:' : 'From the apex singularity, the Architect Eye maintains total visibility over all 4 faces and outer space. Audits in real time:',
                border: '#2997ff',
                bullets: [
                  '1. Editing (Cortes J/L y respiraciones de 80ms)',
                  '2. VFX (Efectos ópticos 35mm sin slop)',
                  '3. SFX (Directiva estricta no_sfx_needed)',
                  '4. Music (Sidechain ducking a -18dB)',
                  '5. Motion (Cumplimiento de los 7 motions M0-M6)',
                  '6. Image (Regla de las 3 imágenes reales de evidencia)',
                  '7. Cover (Portadas con Safe Zones 1:1)',
                  '8. Copy (Semántica Hilbert >= 0.88)',
                  '9. Recording (Verificación en set con SHIM a 0.00% GAPs)'
                ]
              },
              {
                badge: 'KETER PROJECTION',
                title: isEs ? 'Consumo de YOD sin Duplicación' : 'Consuming YOD Without Duplication',
                body: isEs ? 'Arquitecto no adivina ni inventa nuevas estrategias: consume la memoria viva de YOD y los dossiers canónicos del Sol Negro. Su rol es el de un Director Creativo con 165 IQ que corrige con mano de hierro antes de autorizar el render.' : 'Architect does not hallucinate. It consumes YOD living memory and canonical dossiers, acting as a 165 IQ creative director.',
                border: '#30d158'
              }
            ]
          }
        ]
      },
      locale,
      'piramide',
      3
    );

    // 3. UMBRAL DE DAAT & SHIM
    renderRichPage(
      path.join(docsDir, locale, 'piramide/umbral-daat/index.html'),
      {
        title: isEs ? 'El Umbral de Daat & La Cámara Fonética SHIM' : 'The Daat Threshold & SHIM Phonetic Chamber',
        seoDesc: isEs ? 'Dossier maestro de Daat y SHIM: conciencia activa, fuego de Shin, metrología de realidad Planned vs Observed y Whisper ANE a 0.00% GAPs.' : 'Master dossier of Daat and SHIM: active consciousness, Shin fire, Planned vs Observed reality metrology, and Whisper ANE at 0.00% GAPs.',
        eyebrow: 'INTERSTITIAL REALITY // CONSCIOUSNESS & SHIN FIRE',
        headline: isEs ? 'El Umbral de Da\'at.<br/>Conciencia Lúcida, Fuego de Shin y Metrología SHIM.' : 'The Threshold of Da\'at.<br/>Active Consciousness, Shin Fire & SHIM Metrology.',
        heroColor: '#ef4444',
        lead: isEs 
          ? 'Da\'at no es un abismo pasivo ni un pozo ciego: es el reflejo de la conciencia activa despierta y el fuego sagrado de la letra Shin (ש). Aquí habita SHIM, el guardián de la metrología de realidad que resuelve la polaridad entre Chesed (candidatos) y Gevurah (restricciones). En el set de grabación, SHIM ejecuta Whisper Large V3 en el Apple Neural Engine (< 40ms) palabra por palabra, impidiendo que el orador omita ideas o invente relleno.' 
          : 'Daat is not a passive abyss: it is active awakened consciousness and the sacred fire of letter Shin (ש). Here lives SHIM, reality metrology gatekeeper.',
        quickLinks: [
          { label: isEs ? '🔥 Fuego de Shin & Daat' : '🔥 Shin Fire & Daat', href: '#fuego-shin' },
          { label: isEs ? '🎙️ Metrología Whisper ANE' : '🎙️ Whisper ANE Metrology', href: '#whisper-ane' },
          { label: isEs ? '🔒 Regla 0.00% GAPs' : '🔒 0.00% GAPs Rule', href: '#gaps-rule' }
        ],
        sections: [
          {
            id: 'fuego-shin',
            tag: '01 // LA NATURALEZA DE DA\'AT',
            title: isEs ? 'Da\'at: La Conciencia Activa que Enlaza Mente y Materia' : 'Daat: Active Consciousness Bridging Mind and Matter',
            desc: isEs ? 'En la cábala de Dion Fortune, Da\'at es el hijo místico de Jojmá (Sabiduría) y Binah (Entendimiento). No es una esfera estática: es el relámpago de la conciencia lúcida.' : 'In Dion Fortune qabalah, Daat is the mystical son of Chokmah and Binah. Active lightning consciousness.',
            cards: [
              {
                badge: 'LETRA SHIN (ש)',
                title: isEs ? 'Las Tres Lenguas de Fuego' : 'The Three Tongues of Fire',
                body: isEs ? 'La letra Shin representa la triple llama de la verdad: Planned (lo planeado en el guion), Observed (lo observado físicamente en el set) y Resolved (la toma certificada). El fuego quema el ego y la improvisación mediocre del orador.' : 'Letter Shin represents the triple flame: Planned (script), Observed (raw set take), and Resolved (certified master). Fire purges mediocrity.',
                border: '#ef4444',
                bullets: [
                  isEs ? 'Elimina la discrepancia entre intención y ejecución.' : 'Eliminates discrepancy between intent and execution.',
                  isEs ? 'Transforma la memoria en evidencia física tangible.' : 'Transforms memory into tangible physical evidence.',
                  isEs ? 'Protege la dignidad de la marca ante el mercado.' : 'Protects brand dignity before market scrutiny.'
                ]
              },
              {
                badge: 'REALIDAD FORENSE',
                title: isEs ? 'SHIM No Inventa: Resuelve Material Real' : 'SHIM Never Hallucinates: Ingests Real Media',
                body: isEs ? 'SHIM es el dueño de la ingesta de fuentes vivas. Mientras otras IAs inventan textos estocásticos, SHIM confronta la onda acústica real contra la tesis inmutable. Si el orador no lo dijo frente al micrófono, para SHIM no existe.' : 'SHIM owns live source ingestion. Confronts physical acoustic waves against immutable thesis. If speaker did not say it, it does not exist.',
                border: '#f59e0b'
              }
            ]
          },
          {
            id: 'whisper-ane',
            tag: '02 // INFERENCIA EN APPLE SILICON',
            title: isEs ? 'Whisper Large V3 On-Device (< 40ms)' : 'Whisper Large V3 On-Device (< 40ms)',
            desc: isEs ? 'La metrología acústica de SHIM corre de forma 100% local sobre los 16 núcleos del Apple Neural Engine (ANE).' : 'SHIM acoustic metrology runs 100% locally on Apple Neural Engine 16 cores.',
            banner: {
              badge: 'ANE LATENCY',
              title: isEs ? 'Sub-40ms: Auditoría en Tiempo Real de Set' : 'Sub-40ms: Real-Time Set Floor Audit',
              border: '#ef4444',
              pill: 'ruby',
              text: isEs 
                ? 'El orador habla frente a la cámara y en la pantalla de monitoreo las palabras se van iluminando en verde o rojo con menos de 40 milisegundos de latencia. Si olvida mencionar el mecanismo clave o altera un número financiero, el sistema dispara una alarma antes de apagar las luces del estudio.' 
                : 'Speaker talks and words light up green or red under 40ms latency. If key numbers are omitted, alarms trigger before studio lights are turned off.'
            },
            cards: [
              {
                badge: 'LEVENSHTEIN GAP = 0.00%',
                title: isEs ? 'Tolerancia Cero a la Deriva Fonética' : 'Zero Tolerance for Phonetic Drift',
                body: isEs ? 'La distancia Levenshtein entre el texto canónico del guion y la transcripción de Whisper debe ser exactamente 0.00% GAPs en los puntos de control clave. Una sola palabra técnica cambiada bloquea la transición a edición.' : 'Levenshtein distance between canonical script and Whisper transcript must be exactly 0.00% GAPs at key beats.',
                border: '#d4af37'
              },
              {
                badge: 'SHA-256 CERTIFICATE',
                title: isEs ? 'Certificado Criptográfico de Set' : 'Cryptographic Set Certificate',
                body: isEs ? 'Al completar una toma limpia, SHIM genera un certificado inmutable sellado con SHA-256 (91234741f0b3a1ac5bd7e4c0556fafa868d00769). Sin este certificado, el VAV Engine se niega a procesar el renderizado.' : 'Upon a clean take, SHIM stamps an immutable SHA-256 certificate. Without it, VAV Engine refuses rendering.',
                border: '#30d158'
              }
            ]
          }
        ]
      },
      locale,
      'piramide',
      3
    );

    // 4. CRISTALES TELÚRICOS
    renderRichPage(
      path.join(docsDir, locale, 'piramide/cristales-teluricos/index.html'),
      {
        title: isEs ? 'El Santuario de Cristales Telúricos' : 'The Telluric Crystals Sanctuary',
        seoDesc: isEs ? 'Dossier de los Cristales Telúricos: columnas geológicas que elevan la pirámide, almacenamiento Merkle-DAG inmutable y cero Media Offline.' : 'Telluric Crystals dossier: geological pillars lifting the pyramid, immutable Merkle-DAG storage, and zero Media Offline.',
        eyebrow: 'GEOLOGICAL ARCHITECTURE // MERKLE-DAG & CAS STORAGE',
        headline: isEs ? 'El Santuario de Cristales Telúricos.<br/>Columnas Geológicas, Inmutabilidad y CAS.' : 'The Telluric Crystals Sanctuary.<br/>Geological Pillars, Immutability & CAS.',
        heroColor: '#a855f7',
        lead: isEs 
          ? 'Las columnas gigantes de cristal que brotaron del suelo no son una alegoría poética: representan la infraestructura geológica del sistema. Cada cristal actúa como un nodo inmutable dentro del Content Addressable Storage (CAS), garantizando que el árbol de dependencias (Merkle-DAG) jamás sufra corrupción, pérdida de datos o el temido error de Media Offline.' 
          : 'The giant crystal columns are the geological infrastructure of the system, acting as immutable nodes in CAS.',
        quickLinks: [
          { label: isEs ? '💎 La Geología Sagrada' : '💎 Sacred Geology', href: '#geologia' },
          { label: isEs ? '🌳 Merkle-DAG Inmutable' : '🌳 Immutable Merkle-DAG', href: '#merkle' }
        ],
        sections: [
          {
            id: 'geologia',
            tag: '01 // PILARES SUBTERRÁNEOS',
            title: isEs ? 'La Elevación Estructural de la Pirámide' : 'Structural Elevation of the Pyramid',
            desc: isEs ? 'Los cristales sostienen el peso masivo de la Pirámide de Bloque Negro, creando un espacio cavernoso donde opera el santuario central.' : 'Crystals support the massive weight of the Black Block Pyramid, creating the central sanctuary.',
            cards: [
              {
                badge: 'ESTABILIDAD',
                title: isEs ? 'Resonancia Cuarzo-Basalto' : 'Quartz-Basalt Resonance',
                body: isEs ? 'La combinación de cuarzo piezoeléctrico y basalto negro confiere a la estructura una inmunidad absoluta contra perturbaciones externas. Simboliza la roca sólida sobre la cual se edifica la reputación de la empresa.' : 'Piezoelectric quartz and basalt give the structure absolute immunity against external disturbances.',
                border: '#a855f7'
              },
              {
                badge: 'CAS STORAGE',
                title: isEs ? 'Almacenamiento Direccionado por Contenido' : 'Content Addressable Storage (CAS)',
                body: isEs ? 'En el santuario cristalino, los archivos de audio, video y guiones no se guardan por nombres arbitrarios: se identifican por su hash criptográfico SHA-256. El contenido ES su propia dirección.' : 'Files are addressed by cryptographic hash SHA-256, not arbitrary file paths.',
                border: '#38bdf8'
              }
            ]
          },
          {
            id: 'merkle',
            tag: '02 // INTEGRIDAD DE DATOS',
            title: isEs ? 'El Árbol Merkle-DAG Cero Errores' : 'Zero-Error Merkle-DAG Tree',
            desc: isEs ? 'Si un solo frame o palabra cambia, el hash de la raíz cambia instantáneamente, delatando cualquier alteración no autorizada.' : 'If a single frame changes, root hash shifts immediately, exposing unauthorized edits.',
            cards: [
              {
                badge: 'TRAZABILIDAD',
                title: isEs ? 'Linaje Completo de la Semilla al Render' : 'Complete Seed-to-Render Lineage',
                body: isEs ? 'Puedes rastrear cualquier Reel de 18s en TikTok directamente hasta el axioma exacto de YOD y la grabación de SHIM que lo originó hace 6 meses.' : 'Trace any 18s TikTok Reel directly back to the exact YOD axiom and SHIM take that birthed it.',
                border: '#30d158'
              },
              {
                badge: 'CERO MEDIA OFFLINE',
                title: isEs ? 'Garantía Criptográfica Inquebrantable' : 'Unbreakable Cryptographic Guarantee',
                body: isEs ? 'A diferencia de Premiere o DaVinci Resolve donde los enlaces se rompen al mover carpetas, en ABRAXAS el CAS local garantiza que jamás verás una pantalla roja de Media Offline.' : 'Unlike Premiere or DaVinci, ABRAXAS CAS guarantees you will never see a red Media Offline screen.',
                border: '#ef4444'
              }
            ]
          }
        ]
      },
      locale,
      'piramide',
      3
    );

    // 5. FORJA VAV EN 18S
    renderRichPage(
      path.join(docsDir, locale, 'piramide/forja-vav/index.html'),
      {
        title: isEs ? 'La Gran Forja Audiovisual VAV (18s)' : 'The Great VAV Audiovisual Forge (18s)',
        seoDesc: isEs ? 'Dossier maestro de la Forja VAV: auto-corte en 18s por FFT a -38 dBFS, 7 motions fijos, regla de las 3 imágenes reales y EBU R128.' : 'Master dossier of VAV Forge: 18s FFT silence cuts at -38 dBFS, 7 fixed motions, 3 real images rule, and EBU R128.',
        eyebrow: 'TIFERET SOLAR HEARTH // 18S AUDIOVISUAL FORGE',
        headline: isEs ? 'La Gran Forja Audiovisual VAV.<br/>18 Segundos, Cortes FFT, 7 Motions y EBU R128.' : 'The Great VAV Audiovisual Forge.<br/>18 Seconds, FFT Cuts, 7 Motions & EBU R128.',
        heroColor: '#2997ff',
        lead: isEs 
          ? 'En el centro de Yetzirah arde el horno solar de Tiféret: la Forja VAV. Aquí la palabra pura de SHIM se transforma en materia audiovisual viva. VAV opera con precisión milimétrica: ejecuta cortes quirúrgicos por FFT a -38 dBFS, fija la duración estricta en exactamente 18 segundos, monta los 7 motions canónicos en tracks V1 a V4 bajo la regla innegociable de las 3 imágenes reales, y masteriza el audio con la norma broadcast EBU R128 (-14 LUFS).' 
          : 'At the heart of Yetzirah burns the solar forge of Tiferet: VAV Engine. Transforms spoken word into 18s audiovisual reality.',
        quickLinks: [
          { label: isEs ? '✂️ Auto-Corte FFT a 18s' : '✂️ FFT Auto-Cut to 18s', href: '#corte-fft' },
          { label: isEs ? '🎬 Los 7 Motions Canónicos' : '🎬 7 Canonical Motions', href: '#motions' },
          { label: isEs ? '🔊 Norma Broadcast EBU R128' : '🔊 EBU R128 Broadcast', href: '#audio-broadcast' }
        ],
        sections: [
          {
            id: 'corte-fft',
            tag: '01 // QUIRÚRGICA ACÚSTICA',
            title: isEs ? 'Auto-Corte por FFT a -38 dBFS & Micro-Fades de 5ms' : 'FFT Silence Auto-Cut at -38 dBFS & 5ms Micro-Fades',
            desc: isEs ? 'VAV no requiere que un editor humano pase 4 horas cortando silencios con la cuchilla.' : 'VAV eliminates 4 hours of tedious human ripple editing.',
            cards: [
              {
                badge: 'FFT THRESHOLD',
                title: isEs ? 'Detección a -38 dBFS con Ventana de 80ms' : '-38 dBFS Detection with 80ms Breathing Margin',
                body: isEs ? 'El algoritmo escanea el espectro de audio mediante Transformada Rápida de Fourier (FFT). Silencios por debajo de -38 dBFS son eliminados, pero preservando exactamente 80ms de respiración natural para evitar el sonido robótico ahogado.' : 'Fast Fourier Transform detects silences under -38 dBFS while preserving 80ms natural breath.',
                border: '#2997ff'
              },
              {
                badge: 'MICRO-FADES',
                title: isEs ? 'Fundidos Cruzados de 5ms Cero Clics' : '5ms Crossfades Zero Acoustic Clicks',
                body: isEs ? 'Cada punto de corte recibe un micro-fade in y fade out de 5 milisegundos en el cruce por cero (zero-crossing), eliminando el molesto chasquido digital de los cortes secos.' : '5ms micro-fades at zero-crossing eliminate digital pop and click artifacts.',
                border: '#38bdf8'
              }
            ]
          },
          {
            id: 'motions',
            tag: '02 // CINEMATOGRAFÍA CANÓNICA',
            title: isEs ? 'Los 7 Motions Fijos (M0 a M6) en Pistas V1 a V4' : 'The 7 Fixed Motions (M0 to M6) on V1-V4 Tracks',
            desc: isEs ? 'Prohibido inventar animaciones arbitrarias o zooms mareantes. Solo 7 motions matemáticamente armónicos.' : 'Zero arbitrary zoom-ins. Exactly 7 mathematically harmonic motions.',
            banner: {
              badge: 'CANON DE MOTIONS',
              title: isEs ? 'Tracks V1 (A-Roll), V2 (B-Roll Evidencia), V3 (Motion/VFX), V4 (Captions)' : 'Tracks V1 (A-Roll), V2 (Evidence B-Roll), V3 (Motion/VFX), V4 (Captions)',
              border: '#d4af37',
              pill: 'gold',
              text: isEs 
                ? 'M0: Slide + Blur Lite | M1: Hero Pop | M2: Minimal Push | M3: Glow Pulse | M4: Split Screen Comparativo | M5: Impact Kinetic | M6: Clean Fade. Cada motion tiene su física de resortes damping 12 y curva cubic-bezier calibrada.' 
                : 'M0 to M6: fixed motion catalog with damping 12 springs and calibrated cubic-bezier curves.'
            },
            cards: [
              {
                badge: 'REGLA DE 3 IMÁGENES',
                title: isEs ? 'START ➔ DEVELOPMENT ➔ RESULT' : 'START ➔ DEVELOPMENT ➔ RESULT',
                body: isEs ? 'Si un motion muestra un caso de estudio, debe exhibir OBLIGATORIAMENTE 3 capturas o fotos físicas reales: 1. Estado inicial caótico, 2. La intervención del sistema, 3. La pantalla de resultados con números verificables. Cero fotos de stock.' : 'Every case study MUST display 3 real screenshots: 1. Initial friction, 2. System execution, 3. Hard verifiable numbers. Zero stock photos.',
                border: '#30d158'
              },
              {
                badge: 'EBU R128 AUDIO',
                title: isEs ? 'Normalización a -14.0 LUFS Integrados' : 'Integrated -14.0 LUFS Normalization',
                body: isEs ? 'El master sale con sonoridad broadcast estándar: -14.0 LUFS (+/- 0.5), limitador True Peak a -1.0 dBTP y sidechain ducking que comprime la música -18dB automáticamente bajo la voz.' : 'Broadcast standard: -14.0 LUFS, -1.0 dBTP True Peak limiter, and -18dB sidechain ducking.',
                border: '#f59e0b'
              }
            ]
          }
        ]
      },
      locale,
      'piramide',
      3
    );

    // 6. BÓVEDA SQLITE
    renderRichPage(
      path.join(docsDir, locale, 'piramide/camara-sqlite/index.html'),
      {
        title: isEs ? 'La Bóveda Relacional Subterránea SQLite (metrics.db)' : 'The Subterranean SQLite Vault (metrics.db)',
        seoDesc: isEs ? 'Dossier de metrics.db en Assiah: costos al centavo, horas de colaboradores, facturas OCR, ventas por campaña y vista P&L sin nube.' : 'Dossier of metrics.db in Assiah: manufacturing costs, collaborator timers, OCR invoices, campaign sales, and P&L view.',
        eyebrow: 'ASSIAH UNDERGROUND VAULT // ZERO-CLOUD SQLITE SOVEREIGNTY',
        headline: isEs ? 'La Bóveda Relacional SQLite.<br/>Costos de Fábrica, OCR y ROI Soberano.' : 'The SQLite Relational Vault.<br/>Manufacturing Costs, OCR & Sovereign ROI.',
        heroColor: '#30d158',
        lead: isEs 
          ? 'En los cimientos más profundos de Assiah descansa la cámara del tesoro: la base de datos local SQLite metrics.db. Aquí reside la verdad contable absoluta del negocio. Cero datos en servidores externos, cero suscripciones SaaS. Se rige por el principio de BIPARTICIÓN ESTRICTA: los costos internos de los empleados jamás se mezclan con los ingresos de clientes, cruzándose únicamente mediante la vista SQL v_asset_pnl_roi.' 
          : 'In the deepest foundations of Assiah lies the local SQLite database metrics.db. Zero cloud subscriptions. Governed by STRICT BIPARTITION.',
        quickLinks: [
          { label: isEs ? '⚖️ Bipartición Estricta' : '⚖️ Strict Bipartition', href: '#biparticion' },
          { label: isEs ? '📊 Vista SQL P&L & ROI' : '📊 SQL P&L & ROI View', href: '#sql-view' }
        ],
        sections: [
          {
            id: 'biparticion',
            tag: '01 // ARQUITECTURA CONTABLE',
            title: isEs ? 'Bipartición Estricta: Fábrica vs Mercado' : 'Strict Bipartition: Factory vs Market',
            desc: isEs ? 'Separación matemática inquebrantable entre lo que cuesta producir y lo que se factura en el mundo exterior.' : 'Unbreakable mathematical separation between manufacturing cost and market sales.',
            cards: [
              {
                badge: 'COSTOS DE FÁBRICA',
                title: isEs ? 'manufacturing_cost_ledger' : 'manufacturing_cost_ledger',
                body: isEs ? 'Registra horas trabajadas por editores, redactores y closers multiplicadas por su tarifa por hora ($/h). Calcula el costo exacto por Reel ($44.00 USD) o por lote de campaña ($680.00 USD).' : 'Records hours worked by editors and copywriters multiplied by hourly rate ($/h).',
                border: '#f59e0b'
              },
              {
                badge: 'INGRESOS DE MERCADO',
                title: isEs ? 'sales_revenue_ledger' : 'sales_revenue_ledger',
                body: isEs ? 'Registra dinero real cobrado vía WhatsApp, Stripe o transferencias bancarias extraído mediante el escáner OCR on-device. Cero proyecciones ficticias: solo dinero en cuenta.' : 'Records cold cash collected via WhatsApp, Stripe, or wire transfers extracted via on-device OCR.',
                border: '#30d158'
              }
            ]
          },
          {
            id: 'sql-view',
            tag: '02 // LA ECUACIÓN DE ROI',
            title: isEs ? 'Vista SQL de Solo Lectura: v_asset_pnl_roi' : 'Read-Only SQL View: v_asset_pnl_roi',
            desc: isEs ? 'El cruce entre costos e ingresos ocurre únicamente a través de una vista SQL inmutable.' : 'Cost and revenue reconciliation occurs strictly through an immutable SQL view.',
            banner: {
              badge: 'SQL CONTRACT',
              title: isEs ? 'CREATE VIEW v_asset_pnl_roi AS...' : 'CREATE VIEW v_asset_pnl_roi AS...',
              border: '#30d158',
              pill: 'emerald',
              text: isEs 
                ? 'SELECT a.id, a.campaign_id, c.batch_cost, s.total_revenue, (s.total_revenue - c.batch_cost) AS net_profit, ROUND(((s.total_revenue - c.batch_cost) / c.batch_cost) * 100, 2) AS roi_percentage FROM manufacturing_cost_ledger c JOIN sales_revenue_ledger s ON c.campaign_id = s.campaign_id;' 
                : 'SELECT a.id, c.batch_cost, s.total_revenue, ROUND(((s.total_revenue - c.batch_cost) / c.batch_cost) * 100, 2) AS roi_percentage...'
            },
            cards: [
              {
                badge: 'ATRIBUCIÓN N:M',
                title: isEs ? 'Campañas Multioferta vs Piezas Sueltas' : 'Multi-Offer Campaigns vs Loose Assets',
                body: isEs ? 'Permite asociar 15 piezas a 3 productos distintos bajo un mismo campaign_id. Si un cliente vio 4 videos de la campaña antes de comprar, la venta se acredita limpiamente a la campaña sin fugas.' : 'Associates 15 assets to 3 products under one campaign_id. Leak-free attribution for multi-video viewers.',
                border: '#2997ff'
              },
              {
                badge: 'CLOSERS AUDIT',
                title: isEs ? 'Tablero de Rendimiento de Vendedores' : 'Closers Performance Dashboard',
                body: isEs ? 'Mide la velocidad de respuesta en WhatsApp (speed to lead), tasa de conversión de cada vendedor y comisiones liquidadas contra comprobantes reales escaneados por OCR.' : 'Tracks speed to lead in WhatsApp, closer closing rate, and commissions reconciled against OCR receipts.',
                border: '#a855f7'
              }
            ]
          }
        ]
      },
      locale,
      'piramide',
      3
    );

    // 7. SOL NEGRO
    renderRichPage(
      path.join(docsDir, locale, 'soles/sol-negro/index.html'),
      {
        title: isEs ? 'El Sol Negro Preexistente (ABRAXAS OS Software & Ley)' : 'The Pre-Existing Black Sun (ABRAXAS OS Engine & Law)',
        seoDesc: isEs ? 'Dossier del Sol Negro preexistente: software inmutable de ABRAXAS OS, gravedad pre-sefirótica, 4 tiempos, 7 motions y sabiduría editorial.' : 'Black Sun dossier: immutable ABRAXAS OS software, pre-sephirotic gravity, 4 beats, 7 motions, and pre-built editorial wisdom.',
        eyebrow: 'PRE-SEPHIROTIC CRITERIA // RIGOR, GRAVITY & ENGINE',
        headline: isEs ? 'El Sol Negro Preexistente.<br/>Software, Gravedad y Sabiduría Editorial.' : 'The Pre-Existing Black Sun.<br/>Software, Gravity & Editorial Wisdom.',
        heroColor: '#cbd5e1',
        lead: isEs 
          ? 'Antes de que cualquier cliente toque el sistema, el Sol Negro ya existe. Es la densidad infinita, la contracción voluntaria (Tzimtzum) y la ley inmutable. Representa el software determinista de ABRAXAS OS y toda la sabiduría editorial pre-construida: el compás de 4 tiempos, los copies anti-slop, los 7 motions canónicos, los 4 modelos de campaña y la infraestructura en Apple Silicon.' 
          : 'Before any client touches the system, the Black Sun already exists. It is infinite density, Tzimtzum, and immutable software law.',
        quickLinks: [
          { label: isEs ? '🌑 Naturaleza Pre-Sefirótica' : '🌑 Pre-Sephirotic Nature', href: '#naturaleza' },
          { label: isEs ? '💻 El Software Preexistente' : '💻 The Pre-Existing Engine', href: '#software' }
        ],
        sections: [
          {
            id: 'naturaleza',
            tag: '01 // CRITERIO FUNDACIONAL',
            title: isEs ? 'Fuera de Keter: La Densidad y la Ley' : 'Outside Keter: Gravity and Law',
            desc: isEs ? 'No forma parte de las 10 Sephiroth: es el criterio de fondo sobre el cual todo el universo de contenidos descansa.' : 'Not part of the 10 Sephiroth: it is the background criteria upon which the universe rests.',
            cards: [
              {
                badge: 'TZIMTZUM',
                title: isEs ? 'La Auto-Contracción Creativa' : 'Creative Self-Contraction',
                body: isEs ? 'Para que una marca pueda brillar con autoridad, primero debe haber límites estrictos. El Sol Negro impone las restricciones: 18 segundos exactos, cero relleno, cero música a volumen invasivo, cero afirmaciones sin prueba.' : 'For a brand to shine with authority, strict boundaries must exist. Black Sun enforces 18s limits, zero filler, zero unproven claims.',
                border: '#94a3b8'
              },
              {
                badge: 'GRAVEDAD',
                title: isEs ? 'La Fuerza que Impide el Slop' : 'The Anti-Slop Gravitational Well',
                body: isEs ? 'El internet está inundado de contenido basura de IA. El Sol Negro ejerce una gravedad implacable: cualquier guion o video que no tenga peso intelectual colapsa y es devorado antes de salir a la luz pública.' : 'The web is flooded with AI garbage slop. The Black Sun exerts relentless gravity: light, shallow copy collapses.',
                border: '#d4af37'
              }
            ]
          },
          {
            id: 'software',
            tag: '02 // INFRAESTRUCTURA TÉCNICA',
            title: isEs ? 'El Código Inmutable de ABRAXAS OS' : 'The Immutable Codebase of ABRAXAS OS',
            desc: isEs ? 'El software que reside en el Sol Negro es soberano, local y libre de dependencias de la nube.' : 'Software residing in Black Sun is sovereign, local, and cloud-free.',
            cards: [
              {
                badge: 'CORE ENGINE',
                title: isEs ? 'VideoToolbox ProRes & ANE Whisper' : 'VideoToolbox ProRes & ANE Whisper',
                body: isEs ? 'Aceleración nativa en chips M-Series de Apple. Transcodificación en hardware a 3.2 segundos por minuto de video 4K y Whisper fonético a 40ms.' : 'Native Apple Silicon acceleration. Hardware ProRes encode at 3.2s per 4K minute, Whisper ANE at 40ms.',
                border: '#38bdf8'
              },
              {
                badge: 'LEYES EDITORIALES',
                title: isEs ? 'El Compás de 4 Tiempos Inmutable' : 'The Immutable 4-Beat Meter',
                body: isEs ? 'Hook (0-3s) ➔ Tesis (3-7s) ➔ Mecanismo (7-15s) ➔ Payoff (15-18s). El compás está grabado a fuego en el código fuente de VAV y no se puede alterar.' : 'Hook (0-3s) ➔ Thesis (3-7s) ➔ Mechanism (7-15s) ➔ Payoff (15-18s). Hardcoded in VAV source code.',
                border: '#f59e0b'
              }
            ]
          }
        ]
      },
      locale,
      'sol-negro',
      3
    );

    // 8. SOL BLANCO
    renderRichPage(
      path.join(docsDir, locale, 'soles/sol-blanco/index.html'),
      {
        title: isEs ? 'El Sol Blanco (La Marca Viva del Cliente)' : 'The White Sun (The Client Living Brand)',
        seoDesc: isEs ? 'Dossier del Sol Blanco: la voz viva, números, historia del cliente y los 4 vectores del Branding Method (Origen, Destino, Identidad, Potencial).' : 'White Sun dossier: living voice, metrics, client story, and 4 Branding Method vectors.',
        eyebrow: 'PRE-SEPHIROTIC CRITERIA // MERCY, LIFE & CLIENT VOICE',
        headline: isEs ? 'El Sol Blanco.<br/>La Sustancia Viva, Historia y Números del Cliente.' : 'The White Sun.<br/>The Living Substance, History & Client Metrics.',
        heroColor: '#fef08a',
        lead: isEs 
          ? 'El Sol Blanco es la chispa viva, expansiva y luminosa de la empresa o creador. Es la fuerza de Jesed (Amor/Expansión) sin límites. Por sí solo se quemaría en contenido desordenado y caótico. Se llena con la verdad del cliente a través del ABRAXAS Branding Method, respondiendo a los 4 vectores fundamentales: Origen, Destino, Identidad y Potencial de Nicho.' 
          : 'The White Sun is the expansive, living spark of the company. It is filled with the truth of the client via the ABRAXAS Branding Method.',
        quickLinks: [
          { label: isEs ? '☀️ La Chispa Expansiva' : '☀️ Expansive Spark', href: '#chispa' },
          { label: isEs ? '🧭 Los 4 Vectores YOD' : '🧭 4 YOD Vectors', href: '#vectores' }
        ],
        sections: [
          {
            id: 'vectores',
            tag: '01 // LA MATRIZ DE 4 VECTORES',
            title: isEs ? 'Los Cuatro Vectores del Branding Method' : 'The Four Branding Method Vectors',
            desc: isEs ? 'El mapa que extrae la verdad interna del fundador para convertirla en munición de ventas.' : 'The map converting the founder internal truth into sales ammunition.',
            cards: [
              {
                badge: 'VECTOR 1 // ORIGEN',
                title: isEs ? '¿De Dónde Vienes? (El Dolor Fundacional)' : 'Where Do You Come From? (Foundational Pain)',
                body: isEs ? 'Registra el estado actual: cuellos de botella de ventas, dependencia de referidos, clientes tóxicos o frustración con el contenido que no factura.' : 'Records current bottlenecks: referral dependency, toxic clients, or marketing that brings zero revenue.',
                border: '#ef4444',
                bullets: [
                  isEs ? 'Identificación de la herida del mercado.' : 'Identification of market wound.',
                  isEs ? 'Los errores que tus competidores cometen una y otra vez.' : 'Competitor mistakes you were born to fix.',
                  isEs ? 'El motivo por el cual fundaste esta empresa.' : 'The uncompromising reason you started.'
                ]
              },
              {
                badge: 'VECTOR 2 // DESTINO',
                title: isEs ? '¿A Dónde Quieres Ir? (La Visión de Mercado)' : 'Where Do You Want to Go? (Category Vision)',
                body: isEs ? 'Establece las metas financieras exactas, el posicionamiento de marca deseado y la cuota de mercado que tu empresa va a capturar en los próximos 24 meses.' : 'Sets exact revenue targets, brand positioning, and market share to capture over next 24 months.',
                border: '#30d158'
              },
              {
                badge: 'VECTOR 3 // IDENTIDAD',
                title: isEs ? '¿Quién Eres Ahora y Qué te Hace Serlo?' : 'Who Are You Now & What Makes You That?',
                body: isEs ? 'Audita tus verdades probadas, casos de éxito con números en mano, ventaja competitiva tecnológica y los axiomas que defiendes a muerte.' : 'Audits proven case studies with hard numbers, tech advantages, and non-negotiables.',
                border: '#38bdf8'
              },
              {
                badge: 'VECTOR 4 // POTENCIAL',
                title: isEs ? '¿Quién Más Puedes Llegar a Ser?' : 'Who Else Can You Become?',
                body: isEs ? 'YOD procesa los vacíos de la industria y revela la categoría de mercado donde tu empresa puede cobrar 5 veces más sin competir por precio jamás.' : 'YOD processes industry voids, revealing the uncontested category where you command 5x prices.',
                border: '#bf5af2'
              }
            ]
          }
        ]
      },
      locale,
      'sol-blanco',
      3
    );

    // 9. LUNA 1
    renderRichPage(
      path.join(docsDir, locale, 'lunas/luna-1-publicador/index.html'),
      {
        title: isEs ? 'Luna 1: El Publicador Multicanal Adaptativo' : 'Moon 1: The Adaptive Multi-Channel Dispatcher',
        seoDesc: isEs ? 'Dossier de Luna 1: despacho a 8 redes sociales, Safe Zones 9:16 al milímetro, presets H.264 12 Mbps y preservación sonora sin compresión.' : 'Moon 1 dossier: 8-platform dispatch, 9:16 Safe Zones, H.264 12 Mbps presets, and uncompressed audio preservation.',
        eyebrow: 'ORBITAL SATELLITE 1 // ADAPTIVE MULTI-NETWORK DISPATCH',
        headline: isEs ? 'Luna 1: El Publicador Multicanal.<br/>8 Plataformas, Safe Zones 9:16 y Calidad Broadcast.' : 'Moon 1: The Multi-Channel Dispatcher.<br/>8 Platforms, 9:16 Safe Zones & Broadcast Purity.',
        heroColor: '#38bdf8',
        lead: isEs 
          ? 'Luna 1 es el primer satélite exterior orbital de ABRAXAS OS (no es una Sephira: orbita en la ionosfera del sistema). Su misión es recibir el master audiovisual de 18 segundos de la forja VAV y adaptarlo quirúrgicamente a las 8 plataformas simultáneas respetando las Safe Zones 9:16 para que ningún botón de TikTok, Reels o Shorts tape los rostros ni la tipografía.' 
          : 'Moon 1 is the first orbital satellite (not a Sephira). Takes the 18s master and adapts it to 8 platforms adhering to strict Safe Zones.',
        quickLinks: [
          { label: isEs ? '📐 Safe Zones 9:16' : '📐 9:16 Safe Zones', href: '#safe-zones' }
        ],
        sections: [
          {
            id: 'safe-zones',
            tag: '01 // GEOMETRÍA DE PANTALLA',
            title: isEs ? 'Safe Zones 9:16: Tolerancia Cero al Solapamiento' : '9:16 Safe Zones: Zero Tolerance for UI Occlusion',
            desc: isEs ? 'Cada red social coloca botones, comentarios y avatares en lugares diferentes. Luna 1 recalcula los márgenes para cada destino.' : 'Each social platform places like buttons and audio badges differently. Moon 1 recalculates margins.',
            cards: [
              {
                badge: 'TIKTOK & REELS',
                title: isEs ? '280px Inferiores y 120px Derechos Reservados' : '280px Bottom & 120px Right Reserved',
                body: isEs ? 'Los subtítulos cinéticos y las imágenes de evidencia física se confinan a la zona central segura (600px de altura). Ningún texto queda oculto tras el nombre de usuario ni el selector de música.' : 'Kinetic captions and evidence images stay inside the central safe box (600px). Zero text occluded.',
                border: '#38bdf8'
              },
              {
                badge: 'CAROUSEL 4:5',
                title: isEs ? 'Adaptación a Instagram & LinkedIn' : 'Instagram & LinkedIn Adaptation',
                body: isEs ? 'Para carruseles de autoridad, Luna 1 recompone la tipografía en relación de aspecto 4:5 (1080x1350) con márgenes perimetrales de 100px para garantizar legibilidad en móviles pequeños.' : 'Recomposes 4:5 carousels (1080x1350) with 100px padding for mobile legibility.',
                border: '#d4af37'
              }
            ]
          }
        ]
      },
      locale,
      'luna-1',
      3
    );

    // 10. LUNA 2
    renderRichPage(
      path.join(docsDir, locale, 'lunas/luna-2-procesos-retencion/index.html'),
      {
        title: isEs ? 'Luna 2: Gestión de Tareas de Equipo, Procesos y Retención' : 'Moon 2: Team Task Management, Creative Processes & Retention',
        seoDesc: isEs ? 'Dossier de Luna 2: tablero Kanban de colaboradores, supervisión de creación, curvas de retención 0-18s y feedback penalizador a YOD.' : 'Moon 2 dossier: collaborator Kanban board, creative supervision, 0-18s retention curves, and YOD penalty feedback.',
        eyebrow: 'ORBITAL SATELLITE 2 // TEAM OPERATIONS & AUDIENCE RESONANCE',
        headline: isEs ? 'Luna 2: Tareas, Procesos y Retención.<br/>El Pulso Interno del Equipo y la Audiencia.' : 'Moon 2: Team Tasks, Processes & Retention.<br/>Internal Factory Pulse & Audience Attention.',
        heroColor: '#bf5af2',
        lead: isEs 
          ? 'Luna 2 opera con una doble mirada canónica: hacia adentro de la empresa, audita los procesos de creación y gobierna el tablero Kanban de tareas asignadas a los empleados (editores, guionistas, diseñadores); hacia afuera del mercado, monitorea en vivo las curvas de retención segundo a segundo (0-18s) y el APV, penalizando automáticamente a YOD si el público cae en los primeros 3 segundos.' 
          : 'Moon 2 governs with a dual canonical gaze: internally audits creation workflows and team tasks; externally monitors audience drop-off curves.',
        quickLinks: [
          { label: isEs ? '📋 Tablero Kanban' : '📋 Kanban Board', href: '#kanban' },
          { label: isEs ? '📉 Retención 0-18s' : '📉 0-18s Retention', href: '#retencion' }
        ],
        sections: [
          {
            id: 'kanban',
            tag: '01 // FÁBRICA INTERNA',
            title: isEs ? 'El Tablero Kanban de Colaboradores y Tareas' : 'Collaborator Kanban Board & Employee Task Management',
            desc: isEs ? 'Asignación precisa de responsabilidades sin duplicación ni desorden operativo.' : 'Precise task assignments without operational friction or chaos.',
            cards: [
              {
                badge: 'ESTADOS ESTANDARIZADOS',
                title: isEs ? 'BACKLOG ➔ IN_PROGRESS ➔ REVIEW ➔ BLOCKED ➔ DONE' : 'BACKLOG ➔ IN_PROGRESS ➔ REVIEW ➔ BLOCKED ➔ DONE',
                body: isEs ? 'Cada pieza de contenido del lote tiene un responsable único asignado. Si una tarea entra en estado BLOCKED, Luna 2 registra el timestamp exacto para cuantificar el dinero perdido en sueldos por la espera.' : 'Each asset has a single owner. If blocked, Moon 2 records idle timestamps.',
                border: '#bf5af2'
              },
              {
                badge: 'AUDITORÍA DE CREACIÓN',
                title: isEs ? 'Supervisión Paso a Paso' : 'Step-by-Step Creation Supervision',
                body: isEs ? 'Verifica que los editores no se salten el corte FFT a -38 dBFS, que no agreguen música invasiva y que los copies respeten la directiva anti-slop antes de permitir el pase a revisión del CEO.' : 'Verifies editors follow FFT cuts, ducking, and anti-slop rules before CEO review.',
                border: '#38bdf8'
              }
            ]
          },
          {
            id: 'retencion',
            tag: '02 // PULSO DE MERCADO',
            title: isEs ? 'Analítica de Retención y Caídas al Segundo 3' : 'Retention Analytics & Second 3 Drop-Off',
            desc: isEs ? 'El veredicto implacable de la audiencia convertido en telemetría de ingeniería.' : 'The ruthless audience verdict turned into engineering telemetry.',
            cards: [
              {
                badge: 'UMBRAL DEL 60%',
                title: isEs ? 'La Barrera de los 3 Segundos' : 'The 3-Second Retention Barrier',
                body: isEs ? 'Si un video retiene a menos del 60% de los espectadores en el segundo 3, el gancho falló dialécticamente. Luna 2 aplica un castigo de -25 puntos al Hook Score en YOD para mutar el ángulo en el próximo lote.' : 'If retention falls below 60% at second 3, hook failed. Moon 2 applies -25 points penalty to YOD.',
                border: '#ef4444'
              },
              {
                badge: 'APV AVERAGE',
                title: isEs ? 'Porcentaje Promedio de Visualización (APV)' : 'Average Percentage Viewed (APV)',
                body: isEs ? 'Mide el consumo completo de los 18 segundos. Un APV superior al 85% activa automáticamente la sugerencia de inyección de pauta o derivación directa a la Campaña 04 de Conversión.' : 'APV > 85% automatically suggests ad budget boost or conversion campaign routing.',
                border: '#30d158'
              }
            ]
          }
        ]
      },
      locale,
      'luna-2',
      3
    );

    // 11. LUNA 3
    renderRichPage(
      path.join(docsDir, locale, 'lunas/luna-3-financiera-roi/index.html'),
      {
        title: isEs ? 'Luna 3: La Luna Financiera, Costos, Ventas por Campaña & ROI' : 'Moon 3: The Financial Moon, Costs, Campaign Sales & ROI',
        seoDesc: isEs ? 'Dossier de Luna 3: costos de producción según horas de L2, ventas por campaña y pieza con OCR on-device, closers y ROI real.' : 'Moon 3 dossier: manufacturing costs from L2 turnaround, campaign and per-piece sales with on-device OCR, and true ROI.',
        eyebrow: 'ORBITAL SATELLITE 3 // THE FINANCIAL MOON & COLD CASH',
        headline: isEs ? 'Luna 3: La Luna Financiera.<br/>Costos de Fábrica, Ventas por Campaña y ROI Real.' : 'Moon 3: The Financial Moon.<br/>Manufacturing Costs, Campaign Sales & Real ROI.',
        heroColor: '#30d158',
        lead: isEs 
          ? 'Luna 3 es el tercer satélite exterior orbital: la consola financiera del fundador. Convierte los tiempos de trabajo registrados en Luna 2 en costos monetarios de producción ($/pieza y $/campaña), ingiere comprobantes de pago de WhatsApp y pasarelas mediante OCR on-device en Python, audita ventas tanto a nivel de Campaña General como por Publicación Individual, y calcula el ROI matemático exacto.' 
          : 'Moon 3 is the founder financial console: converts L2 hours into manufacturing costs, ingests invoices via OCR, audits campaign sales, and computes true ROI.',
        quickLinks: [
          { label: isEs ? '💵 Costos de Producción' : '💵 Manufacturing Costs', href: '#costos' },
          { label: isEs ? '🎯 Ventas por Campaña General' : '🎯 Macro Campaign Sales', href: '#campanas' },
          { label: isEs ? '🔗 Ventas por Pieza' : '🔗 Per-Piece Sales', href: '#piezas' }
        ],
        sections: [
          {
            id: 'costos',
            tag: '01 // CONTABILIDAD INTERNA',
            title: isEs ? 'Costos Financieros de Producción al Centavo' : 'Manufacturing Costs Down to the Cent',
            desc: isEs ? 'Luna 3 ingesta las horas y segundos trabajados en Luna 2 y los multiplica por las tarifas salariales.' : 'Ingests active hours from Moon 2 and multiplies them by hourly rates.',
            cards: [
              {
                badge: 'COSTO POR ACTIVO',
                title: isEs ? '$44.00 USD por Reel Vertical' : '$44.00 USD per Vertical Reel',
                body: isEs ? 'Calculado sumando: 0.8h de guionista ($16) + 1.2h de editor ($24) + 0.2h de render/QA ($4). Sabes exactamente cuánto dinero te costó poner esa pieza en el mercado.' : 'Exact breakdown: scriptwriting + editing + QA. You know the exact cash cost.',
                border: '#f59e0b'
              },
              {
                badge: 'COSTO POR LOTE',
                title: isEs ? '$680.00 USD por Campaña de 16 Piezas' : '$680.00 USD per 16-Asset Campaign',
                body: isEs ? 'El consolidado de fabricación de un lote completo de campaña (12 reels + 3 carruseles + 1 ensayo). Permite contrastar el costo del lote contra la facturación total generada.' : 'Total batch cost for 16 assets. Enables true batch ROI calculations.',
                border: '#38bdf8'
              }
            ]
          },
          {
            id: 'campanas',
            tag: '02 // TELEMETRÍA DE INGRESOS',
            title: isEs ? 'Auditoría Dual: Ventas por Campaña General vs por Pieza' : 'Dual Revenue Audit: Macro Campaign Sales vs Per-Piece',
            desc: isEs ? 'Resuelve el problema de atribución cuando un cliente consume múltiples videos antes de comprar.' : 'Solves attribution leakage when a lead views multiple pieces before texting sales.',
            banner: {
              badge: 'REPORTE MACRO DE CAMPAÑA',
              title: isEs ? 'CAMP_01 // Lanzamiento Ecosistema Q3: ROI +1,877%' : 'CAMP_01 // Q3 Ecosystem Launch: ROI +1,877%',
              border: '#30d158',
              pill: 'emerald',
              text: isEs 
                ? 'Lote de 16 piezas vinculadas a 2 productos (Software Core + Membresía). Costo total de producción: $680.00 USD. Ventas cobradas por OCR: $13,450.00 USD. Retorno sobre la Inversión (ROI): +1,877%. Ninguna venta se pierde aunque el comprador haya visto 5 videos distintos de la campaña.' 
                : '16 assets promoting 2 products. Batch cost: $680. OCR cash collected: $13,450. Batch ROI: +1,877%.'
            },
            cards: [
              {
                badge: 'VENTAS POR PIEZA',
                title: isEs ? 'Atribución Forense por Activo Individual' : 'Forensic Single-Asset Attribution',
                body: isEs ? 'Identifica qué video o carrusel específico disparó el mensaje directo en WhatsApp, permitiéndote duplicar los ganchos de mayor conversión.' : 'Pinpoints which exact reel drove the inbound chat, enabling hook cloning.',
                border: '#2997ff'
              },
              {
                badge: 'CLOSERS PERFORMANCE',
                title: isEs ? 'Monitoreo del Equipo de Vendedores' : 'Closers Performance Dashboard',
                body: isEs ? 'Audita la velocidad de respuesta en WhatsApp (speed to lead), tasa de cierre individual de cada closer y liquidación de comisiones contra facturas reales verificadas por OCR.' : 'Tracks speed to lead in WhatsApp, closer closing rates, and commission payouts.',
                border: '#bf5af2'
              }
            ]
          }
        ]
      },
      locale,
      'luna-3',
      3
    );

    // 12. MUNDO ATZILUTH
    renderRichPage(
      path.join(docsDir, locale, 'mundos/atziluth/index.html'),
      {
        title: isEs ? 'Cara Sur: Atziluth (Mundo de la Emanación / Fuego / YOD)' : 'South Face: Atziluth (Emanation World / Fire / YOD)',
        seoDesc: isEs ? 'Dossier de la Cara Sur Atziluth: el Árbol de la Mente con 10 Sephiroth completas, tesis soberana, YOD Cognitive Radar y axiomas fundacionales.' : 'South Face Atziluth dossier: Tree of Mind with 10 Sephiroth, sovereign thesis, and YOD axioms.',
        eyebrow: 'SOUTH FACE // ATZILUTH // FIRE & LETTER YOD',
        headline: isEs ? 'Cara Sur: Atziluth.<br/>El Árbol de la Mente, la Intención y la Tesis.' : 'South Face: Atziluth.<br/>The Tree of Mind, Intent & Sovereign Thesis.',
        heroColor: '#f59e0b',
        lead: isEs 
          ? 'La Cara Sur de la Gran Pirámide pertenece al Mundo de Atziluth: el elemento Fuego y la letra YOD (י). Siguiendo la doctrina holográfica de Dion Fortune, Atziluth no es un piso: es un Árbol de la Vida completo con sus 10 Sephiroth dedicadas a la emanación pura de la mente del creador, la calibración de la tesis de autoridad y los axiomas de marca.' 
          : 'South Face belongs to Atziluth: Fire and letter YOD. In Dion Fortune qabalah, it holds a full 10-Sephiroth Tree dedicated to pure mind.',
        quickLinks: [
          { label: isEs ? '🔥 Fuego Sagrado & YOD' : '🔥 Sacred Fire & YOD', href: '#fuego' },
          { label: isEs ? '🌳 Las 10 Sephiroth de Atziluth' : '🌳 10 Sephiroth of Atziluth', href: '#sephiroth' }
        ],
        sections: [
          {
            id: 'sephiroth',
            tag: '01 // EL ÁRBOL DE LA MENTE',
            title: isEs ? 'Las 10 Sephiroth Holográficas de Atziluth' : 'The 10 Holographic Sephiroth of Atziluth',
            desc: isEs ? 'El descenso continuo de la idea desde el silencio de Keter hasta la formulación verbal de Malkut.' : 'The descent of idea from Keter silence to Malkuth verbal formula.',
            cards: [
              {
                badge: '1. KETER DE ATZILUTH',
                title: isEs ? 'La Semilla Silenciosa' : 'The Silent Seed',
                body: isEs ? 'La convicción primordial del fundador antes de expresarse en palabras. La voluntad pura de resolver un problema que nadie más puede solucionar.' : 'The primordial conviction of the founder prior to words.',
                border: '#d4af37'
              },
              {
                badge: '2. JOJMÁ DE ATZILUTH',
                title: isEs ? 'El Rayo Seminal de Inspiración' : 'The Seminal Flash',
                body: isEs ? 'El ángulo contrariano instantáneo. La ruptura con el dogma establecido de la industria generada por el radar cognitivo de YOD.' : 'The contrarian angle breaking industry dogma.',
                border: '#f59e0b'
              },
              {
                badge: '3. BINAH DE ATZILUTH',
                title: isEs ? 'La Matriz de Razonamiento' : 'The Reasoning Matrix',
                body: isEs ? 'La estructura lógica del argumento: premisas, refutación de objeciones y ordenación dialéctica del pensamiento.' : 'Logical argument structure: premises and dialectical ordering.',
                border: '#38bdf8'
              },
              {
                badge: '10. MALKUT DE ATZILUTH',
                title: isEs ? 'El Guion Concreto Congelado' : 'The Frozen Concrete Script',
                body: isEs ? 'El punto donde la mente toca la forma: el guion final sellado con hash SHA-256 listo para ser transferido a Briah (Cara Occidente).' : 'Script frozen with SHA-256 ready for Briah.',
                border: '#30d158'
              }
            ]
          }
        ]
      },
      locale,
      'atziluth',
      3
    );

    // 13. MUNDO BRIAH
    renderRichPage(
      path.join(docsDir, locale, 'mundos/briah/index.html'),
      {
        title: isEs ? 'Cara Occidente: Briah (Mundo de la Creación / Agua / Primera HÉ)' : 'West Face: Briah (Creation World / Water / First HE)',
        seoDesc: isEs ? 'Dossier de la Cara Occidente Briah: el Árbol de la Arquitectura de Datos con 10 Sephiroth, Merkle-DAG inmutable en CAS y HE Desk.' : 'West Face Briah dossier: Tree of Data Architecture with 10 Sephiroth, Merkle-DAG in CAS, and HE Desk.',
        eyebrow: 'WEST FACE // BRIAH // WATER & FIRST LETTER HE',
        headline: isEs ? 'Cara Occidente: Briah.<br/>El Árbol de la Arquitectura de Datos y CAS.' : 'West Face: Briah.<br/>The Tree of Data Architecture & CAS.',
        heroColor: '#38bdf8',
        lead: isEs 
          ? 'La Cara Occidente de la Gran Pirámide pertenece al Mundo de Briah: el elemento Agua y la primera letra HÉ (ה). Contiene un Árbol de la Vida completo con sus 10 Sephiroth dedicadas a la arquitectura de datos, la estructura inmutable Merkle-DAG en almacenamiento direccionado por contenido (CAS) y la gobernanza en HE Desk.' 
          : 'West Face belongs to Briah: Water and first HE. Holds a full 10-Sephiroth Tree governing Merkle-DAG and CAS.',
        quickLinks: [
          { label: isEs ? '🌊 Agua & Primera HÉ' : '🌊 Water & First HE', href: '#agua' },
          { label: isEs ? '🌳 Las 10 Sephiroth de Briah' : '🌳 10 Sephiroth of Briah', href: '#sephiroth' }
        ],
        sections: [
          {
            id: 'sephiroth',
            tag: '01 // ARQUITECTURA DE DATOS',
            title: isEs ? 'Las 10 Sephiroth Holográficas de Briah' : 'The 10 Holographic Sephiroth of Briah',
            desc: isEs ? 'Cómo el guion mental de Atziluth adquiere recipientes de datos y topología relacional inquebrantable.' : 'How Atziluth mental script acquires immutable data vessels.',
            cards: [
              {
                badge: '1. KETER DE BRIAH',
                title: isEs ? 'El Contrato de Datos Raíz' : 'Root Data Contract',
                body: isEs ? 'El esquema TypeScript/JSON canónico inmutable que define las propiedades que todo activo debe poseer antes de existir.' : 'Immutable TypeScript canonical schema defining asset properties.',
                border: '#38bdf8'
              },
              {
                badge: '5. GEVURAH DE BRIAH',
                title: isEs ? 'Las 6 Compuertas de HE Desk' : 'The 6 HE Desk Quality Gates',
                body: isEs ? 'El rigor de las pruebas: verificación de márgenes 9:16, directiva no_sfx_needed, sidechain ducking y firma criptográfica.' : 'Rigorous test gates: 9:16 margins, no_sfx directive, sidechain ducking.',
                border: '#ef4444'
              },
              {
                badge: '10. MALKUT DE BRIAH',
                title: isEs ? 'El Paquete Sellado para Yetzirah' : 'Sealed Package for Yetzirah',
                body: isEs ? 'Los recipientes de datos listos para entrar al set de grabación y encender los motores audiovisuales de la Cara Oriente.' : 'Data vessels ready to enter set and ignite East Face audiovisual engines.',
                border: '#30d158'
              }
            ]
          }
        ]
      },
      locale,
      'briah',
      3
    );

    // 14. MUNDO YETZIRAH
    renderRichPage(
      path.join(docsDir, locale, 'mundos/yetzirah/index.html'),
      {
        title: isEs ? 'Cara Oriente: Yetzirah (Mundo de la Formación / Aire / VAV)' : 'East Face: Yetzirah (Formation World / Air / Letter VAV)',
        seoDesc: isEs ? 'Dossier de la Cara Oriente Yetzirah: el Árbol de la Forja Audiovisual con 10 Sephiroth, SHIM en Daat 0.00% GAPs y VAV Engine en 18s.' : 'East Face Yetzirah dossier: Tree of Audiovisual Forge with 10 Sephiroth, SHIM in Daat 0.00% GAPs, and VAV Engine in 18s.',
        eyebrow: 'EAST FACE // YETZIRAH // AIR & LETTER VAV',
        headline: isEs ? 'Cara Oriente: Yetzirah.<br/>El Árbol de la Forja Audiovisual y SHIM.' : 'East Face: Yetzirah.<br/>The Tree of Audiovisual Forge & SHIM.',
        heroColor: '#bf5af2',
        lead: isEs 
          ? 'La Cara Oriente de la Gran Pirámide pertenece al Mundo de Yetzirah: el elemento Aire y la letra VAV (ו). Contiene un Árbol de la Vida completo con sus 10 Sephiroth dedicadas a la metrología acústica en set (SHIM a 0.00% GAPs en Daat), la síntesis audiovisual determinista en 18s (VAV Engine) y los 7 motions canónicos.' 
          : 'East Face belongs to Yetzirah: Air and letter VAV. Holds a full 10-Sephiroth Tree dedicated to SHIM and VAV 18s forge.',
        quickLinks: [
          { label: isEs ? '💨 Aire & Letra VAV' : '💨 Air & Letter VAV', href: '#aire' },
          { label: isEs ? '🌳 Las 10 Sephiroth de Yetzirah' : '🌳 10 Sephiroth of Yetzirah', href: '#sephiroth' }
        ],
        sections: [
          {
            id: 'sephiroth',
            tag: '01 // FORJA AUDIOVISUAL',
            title: isEs ? 'Las 10 Sephiroth Holográficas de Yetzirah' : 'The 10 Holographic Sephiroth of Yetzirah',
            desc: isEs ? 'La encarnación del pensamiento y los datos en luz proyectada, ondas sonoras y ritmo temporal.' : 'Embodiment of thought and data into projected light, soundwaves, and rhythm.',
            cards: [
              {
                badge: 'DAAT DE YETZIRAH',
                title: isEs ? 'La Cámara Fonética SHIM' : 'The SHIM Phonetic Chamber',
                body: isEs ? 'Auditoría Whisper ANE en set a 0.00% GAPs. Resuelve la discrepancia entre Planned y Observed en tiempo real.' : 'Whisper ANE set audit at 0.00% GAPs resolving Planned vs Observed.',
                border: '#ef4444'
              },
              {
                badge: '6. TIFÉRET DE YETZIRAH',
                title: isEs ? 'El Corazón Audiovisual en 18s' : '18s Audiovisual Solar Heart',
                body: isEs ? 'La síntesis armónica central: auto-corte FFT a -38 dBFS, respiraciones de 80ms y ensamble en pistas V1 a V4.' : 'Central harmonic synthesis: FFT cuts, 80ms breaths, V1-V4 assembly.',
                border: '#2997ff'
              },
              {
                badge: '10. MALKUT DE YETZIRAH',
                title: isEs ? 'El Master Renderizado Inmutable' : 'Immutable Rendered Master',
                body: isEs ? 'El archivo ProRes / HEVC definitivo con sonoridad EBU R128 (-14 LUFS) listo para cruzar a Assiah.' : 'Final ProRes/HEVC file with EBU R128 audio ready for Assiah.',
                border: '#30d158'
              }
            ]
          }
        ]
      },
      locale,
      'yetzirah',
      3
    );

    // 15. MUNDO ASSIAH
    renderRichPage(
      path.join(docsDir, locale, 'mundos/assiah/index.html'),
      {
        title: isEs ? 'Cara Norte: Assiah (Mundo de la Acción / Tierra / Segunda HÉ)' : 'North Face: Assiah (Action World / Earth / Second HE)',
        seoDesc: isEs ? 'Dossier de la Cara Norte Assiah: el Árbol de la Acción Comercial con 10 Sephiroth, despacho multicanal, campañas y Luna 3 con OCR y ROI.' : 'North Face Assiah dossier: Tree of Commercial Action with 10 Sephiroth, multi-channel dispatch, campaigns, and Moon 3 OCR ROI.',
        eyebrow: 'NORTH FACE // ASSIAH // EARTH & SECOND LETTER HE',
        headline: isEs ? 'Cara Norte: Assiah.<br/>El Árbol de la Acción Comercial, Campañas y Dinero.' : 'North Face: Assiah.<br/>The Tree of Commercial Action, Campaigns & Cash.',
        heroColor: '#30d158',
        lead: isEs 
          ? 'La Cara Norte de la Gran Pirámide pertenece al Mundo de Assiah: el elemento Tierra y la segunda letra HÉ (ה). Contiene un Árbol de la Vida completo con sus 10 Sephiroth dedicadas a la manifestación física final: el despacho adaptativo a 8 plataformas en Luna 1, las campañas multioferta, las tareas del equipo en Luna 2 y la facturación cobrada con escáner OCR en Luna 3.' 
          : 'North Face belongs to Assiah: Earth and second HE. Holds a full 10-Sephiroth Tree dedicated to dispatch, campaigns, and cash.',
        quickLinks: [
          { label: isEs ? '🌱 Tierra & Segunda HÉ' : '🌱 Earth & Second HE', href: '#tierra' },
          { label: isEs ? '🌳 Las 10 Sephiroth de Assiah' : '🌳 10 Sephiroth of Assiah', href: '#sephiroth' }
        ],
        sections: [
          {
            id: 'sephiroth',
            tag: '01 // ACCIÓN COMERCIAL',
            title: isEs ? 'Las 10 Sephiroth Holográficas de Assiah' : 'The 10 Holographic Sephiroth of Assiah',
            desc: isEs ? 'Donde la autoridad de marca se convierte en dólares reales en la cuenta bancaria del fundador.' : 'Where brand authority converts into cold cash in the bank.',
            cards: [
              {
                badge: '7. NETZACH DE ASSIAH',
                title: isEs ? 'Luna 1: Despacho a 8 Plataformas' : 'Moon 1: 8-Network Dispatch',
                body: isEs ? 'Distribución adaptativa en TikTok, Reels, Shorts, X, LinkedIn, Substack, Podcasts y Medium sin compresión.' : 'Adaptive distribution to 8 platforms adhering to safe zones.',
                border: '#38bdf8'
              },
              {
                badge: '8. HOD DE ASSIAH',
                title: isEs ? 'Luna 2: Tareas Kanban & Retención' : 'Moon 2: Kanban Tasks & Retention',
                body: isEs ? 'Control de colaboradores y muestreo de retención segundo a segundo con retroalimentación correctiva.' : 'Collaborator governance and second-by-second retention sampling.',
                border: '#bf5af2'
              },
              {
                badge: '10. MALKUT DE ASSIAH',
                title: isEs ? 'Luna 3: El Cobro y el Retorno Real (ROI)' : 'Moon 3: Cash Inflow & Real ROI',
                body: isEs ? 'El escáner OCR en Python, la conciliación de ventas por campaña general y la liquidación contable en SQLite.' : 'Python on-device OCR, campaign sales reconciliation, and SQLite ledger.',
                border: '#30d158'
              }
            ]
          }
        ]
      },
      locale,
      'assiah',
      3
    );
  });

  console.log('✨ ¡Las 30 páginas de la suite monumental han sido generadas con máxima riqueza!');
}

generateAllMonumentalPages();
