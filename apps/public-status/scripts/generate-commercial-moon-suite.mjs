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

function getUniversalHeader(locale, activePage, depth = 2) {
  const isEs = locale === 'es';
  const root = getRootPrefix(depth);
  const langPrefix = `${root}${locale}/`;
  const otherLocale = isEs ? 'en' : 'es';
  const switchLangHref = `${root}${otherLocale}/index.html`;

  return `
  <!-- Film Grain Overlay -->
  <div class="film-grain-overlay"></div>

  <!-- Master Sticky Localnav -->
  <nav class="apple-localnav" aria-label="Local Navigation">
    <div class="localnav-inner">
      <a href="${root}index.html" class="localnav-brand">
        <span>ABRAXAS OS</span>
        <span class="tag">v3.0 PRO</span>
      </a>
      <div class="localnav-items">
        <a href="${root}index.html" class="localnav-a ${activePage === 'home' ? 'active' : ''}">${isEs ? 'Inicio' : 'Home'}</a>
        <a href="${root}v3/index.html" class="localnav-a ${activePage === 'v3' ? 'active' : ''}">🍎 v3 MacBook Pro</a>
        <a href="${langPrefix}luna-comercial/index.html" class="localnav-a ${activePage === 'luna-comercial' ? 'active' : ''}" style="color: #30d158; font-weight: 700;">🌙 ${isEs ? 'Luna de Ventas & ROI' : 'Sales Moon & ROI'}</a>
        <a href="${langPrefix}branding-method/index.html" class="localnav-a ${activePage === 'branding-method' ? 'active' : ''}" style="color: #bf5af2;">🎯 ${isEs ? 'Branding & Campañas YOD' : 'Branding & Campaigns'}</a>
        <a href="${langPrefix}abraxas-core-example/index.html" class="localnav-a ${activePage === 'abraxas-core-example' ? 'active' : ''}" style="color: #d4af37;">💎 ${isEs ? 'Caso ABRAXAS Core' : 'ABRAXAS Core Example'}</a>
        <a href="${langPrefix}criterios-roadmap/index.html" class="localnav-a ${activePage === 'criterios-roadmap' ? 'active' : ''}">${isEs ? '🗺️ Criterios & Roadmap' : '🗺️ Criteria & Roadmap'}</a>
        <a href="${langPrefix}ecosistema/index.html" class="localnav-a ${activePage === 'ecosistema' ? 'active' : ''}">${isEs ? '⚡ Ecosistema 8-en-1' : '⚡ 8-in-1 Ecosystem'}</a>
        <a href="${langPrefix}gerencia/index.html" class="localnav-a ${activePage === 'gerencia' ? 'active' : ''}">${isEs ? '💼 Gerencia & ROI' : '💼 Governance & ROI'}</a>
        <a href="${langPrefix}flujo/index.html" class="localnav-a ${activePage === 'flujo' ? 'active' : ''}">${isEs ? '🔄 Ciclo de Vida' : '🔄 Lifecycle Flow'}</a>
        <a href="${langPrefix}tools/vav/motions/index.html" class="localnav-a ${activePage === 'motions' ? 'active' : ''}">🎬 Motions</a>
        <a href="${langPrefix}tools/vav/captions/index.html" class="localnav-a ${activePage === 'captions' ? 'active' : ''}">💬 Captions</a>
        <a href="${langPrefix}tools/vav/cuts/index.html" class="localnav-a ${activePage === 'cuts' ? 'active' : ''}">✂️ Cuts 18s</a>
        <a href="${langPrefix}tools/shim/index.html" class="localnav-a ${activePage === 'shim' ? 'active' : ''}">🔍 SHIM (0% GAPs)</a>
        <a href="${langPrefix}tools/arquitecto/index.html" class="localnav-a ${activePage === 'arquitecto' ? 'active' : ''}">👁️ Arquitecto</a>
        <a href="${langPrefix}canon/index.html" class="localnav-a ${activePage === 'canon' ? 'active' : ''}" style="color: #d4af37;">📚 Canon 37 TXT</a>
        <a href="${langPrefix}backup/index.html" class="localnav-a ${activePage === 'backup' ? 'active' : ''}">🏛️ Backup</a>
      </div>
      <div class="localnav-right">
        <a href="${switchLangHref}" class="localnav-a" style="font-family: var(--font-mono); font-weight: 700; color: #fff;">${isEs ? 'EN' : 'ES'}</a>
        <button id="btn-open-control-center" class="btn-control-center">
          <span>🌳 Árbol / Menú</span>
        </button>
        <a href="${root}index.html" class="btn-apple-cta">${isEs ? 'Abrir Sistema' : 'Launch OS'}</a>
      </div>
    </div>
  </nav>
  `;
}

function getInternalQuickMenu(items) {
  return `
  <div style="background: rgba(14, 14, 20, 0.85); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 10px 1.5rem; position: sticky; top: 52px; z-index: 999; overflow-x: auto; scrollbar-width: none;">
    <div style="max-width: 1280px; margin: 0 auto; display: flex; gap: 8px; align-items: center; white-space: nowrap;">
      <span style="font-size: 0.75rem; font-family: var(--font-mono); color: #d4af37; font-weight: 800; margin-right: 6px;">IR A:</span>
      ${items.map(item => `<a href="${item.href}" class="btn-control-center" style="font-size: 0.76rem; padding: 4px 12px; background: rgba(255,255,255,0.06);">${item.label}</a>`).join('')}
    </div>
  </div>
  `;
}

function getUniversalWidgets(locale, depth = 2) {
  const isEs = locale === 'es';
  const root = getRootPrefix(depth);
  const langPrefix = `${root}${locale}/`;

  return `
  <!-- Contextual Floating Arquitecto Widget -->
  <div id="floating-architect-widget">
    <div id="architect-popup-card" class="architect-popup-card">
      <div class="popup-header">
        <span class="popup-title">👁️ ARQUITECTO // LUNA COMERCIAL & YOD</span>
        <button id="architect-popup-close" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.1rem;">✕</button>
      </div>
      <p class="popup-body">
        ${isEs 
          ? '«El contenido que no vende es solo vanidad estética.» La Luna Comercial vincula cada video, carrusel y mensaje de WhatsApp con ingresos reales y ROI medible.' 
          : '«Content that does not sell is aesthetic vanity.» The Commercial Moon connects every video, carousel, and message to actual revenue.'}
      </p>
      <button id="btn-copy-prompt" class="btn-copy-prompt">
        📋 ${isEs ? 'Preparar informe de ventas para IA' : 'Prepare Sales Report Prompt'}
      </button>
    </div>
    
    <div id="architect-pill-trigger" class="architect-pill-trigger">
      <span class="architect-sparkle">✦</span>
      <span class="architect-pill-text">Luna de Ventas</span>
    </div>
  </div>

  <!-- Dashboard Control Center Drawer -->
  <div id="control-center-drawer">
    <div class="drawer-header-row">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.2rem; color: #d4af37;">▲</span>
        <h3 style="font-size: 1.1rem; color: #fff; font-weight: 700;">Panel de Control Central</h3>
      </div>
      <button id="btn-close-control-center" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.2rem;">✕</button>
    </div>

    <div class="drawer-nav-grid">
      <a href="${root}index.html" class="drawer-nav-btn">🏠 <span>Visión General (Home)</span></a>
      <a href="${root}v3/index.html" class="drawer-nav-btn">🍎 <span>Edición v3 MacBook Pro</span></a>
      <a href="${langPrefix}luna-comercial/index.html" class="drawer-nav-btn" style="border-color: rgba(48,209,88,0.4); color: #30d158;">🌙 <span>Luna de Ventas, Facturas & ROI</span></a>
      <a href="${langPrefix}branding-method/index.html" class="drawer-nav-btn" style="border-color: rgba(191,90,242,0.4); color: #bf5af2;">🎯 <span>Diagnóstico YOD & Campañas</span></a>
      <a href="${langPrefix}abraxas-core-example/index.html" class="drawer-nav-btn" style="border-color: rgba(212,175,55,0.4); color: #d4af37;">💎 <span>Ejemplo Real ABRAXAS Core</span></a>
      <a href="${langPrefix}criterios-roadmap/index.html" class="drawer-nav-btn">🗺️ <span>Criterios & Roadmap Maestro</span></a>
      <a href="${langPrefix}ecosistema/index.html" class="drawer-nav-btn">⚡ <span>Ecosistema 8-en-1</span></a>
      <a href="${langPrefix}gerencia/index.html" class="drawer-nav-btn">💼 <span>Gobernanza & ROI</span></a>
      <a href="${langPrefix}flujo/index.html" class="drawer-nav-btn">🔄 <span>Ciclo de Vida (10 Esferas)</span></a>
      <a href="${langPrefix}tools/vav/motions/index.html" class="drawer-nav-btn">🎬 <span>13 Familias de Motion</span></a>
      <a href="${langPrefix}tools/vav/captions/index.html" class="drawer-nav-btn">💬 <span>Subtítulos Cinéticos Whisper</span></a>
      <a href="${langPrefix}tools/vav/cuts/index.html" class="drawer-nav-btn">✂️ <span>Cortes en 18s & RMS</span></a>
      <a href="${langPrefix}tools/shim/index.html" class="drawer-nav-btn">🔍 <span>Metrología SHIM 0.00% GAPs</span></a>
      <a href="${langPrefix}tools/arquitecto/index.html" class="drawer-nav-btn">👁️ <span>ARQUITECTO (Coach & Asistente)</span></a>
      <a href="${langPrefix}canon/index.html" class="drawer-nav-btn" style="border-color: rgba(212,175,55,0.4);">📚 <span>Biblioteca Canon 37 TXT</span></a>
      <a href="${langPrefix}backup/index.html" class="drawer-nav-btn">🏛️ <span>Respaldo / Backup Completo</span></a>
    </div>

    <div style="margin-top: 2.5rem; padding: 18px; background: rgba(212,175,55,0.08); border-radius: 14px; border: 1px solid rgba(212,175,55,0.25);">
      <span style="font-size: 0.72rem; font-family: var(--font-mono); color: #d4af37; font-weight: 800;">LÍNEA BASE CERTIFICADA</span>
      <p style="font-size: 0.82rem; color: #cbd5e1; margin-top: 4px;">SHA-256: <code>91234741f0b3a1ac5bd7e4c0556fafa868d00769</code></p>
    </div>
  </div>
  `;
}

function getUniversalFooter(locale, depth = 2) {
  const isEs = locale === 'es';
  const root = getRootPrefix(depth);
  const langPrefix = `${root}${locale}/`;

  return `
  <footer style="background: #050508; border-top: 1px solid rgba(255,255,255,0.08); padding: 5rem 1.5rem 3rem 1.5rem; font-size: 0.85rem; color: #86868b;">
    <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2.5rem; margin-bottom: 3.5rem;">
      <div>
        <h4 style="color: #fff; font-size: 0.92rem; margin-bottom: 1rem;">${isEs ? 'Comercio & Inteligencia' : 'Commerce & Intelligence'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${langPrefix}luna-comercial/index.html" style="color: #30d158; font-weight: 600;">${isEs ? '🌙 Luna Comercial & ROI' : '🌙 Commercial Moon & ROI'}</a></li>
          <li><a href="${langPrefix}branding-method/index.html" style="color: #bf5af2; font-weight: 600;">${isEs ? '🎯 Diagnóstico YOD & Campañas' : '🎯 YOD Diagnostic & Campaigns'}</a></li>
          <li><a href="${langPrefix}abraxas-core-example/index.html" style="color: #d4af37; font-weight: 600;">${isEs ? '💎 Caso Real ABRAXAS Core' : '💎 ABRAXAS Real Core Case'}</a></li>
          <li><a href="${langPrefix}criterios-roadmap/index.html">${isEs ? '🗺️ Criterios & Roadmap' : '🗺️ Criteria & Roadmap'}</a></li>
        </ul>
      </div>
      <div>
        <h4 style="color: #fff; font-size: 0.92rem; margin-bottom: 1rem;">${isEs ? 'Herramientas de Síntesis' : 'Synthesis Tools'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${langPrefix}tools/vav/motions/index.html">${isEs ? '13 Familias de Motion' : '13 Motion Families'}</a></li>
          <li><a href="${langPrefix}tools/vav/captions/index.html">${isEs ? 'Subtítulos Cinéticos' : 'Kinetic Captions'}</a></li>
          <li><a href="${langPrefix}tools/vav/cuts/index.html">${isEs ? 'Cortes en 18s' : '18s Auto-Cuts'}</a></li>
          <li><a href="${langPrefix}tools/shim/index.html">${isEs ? 'Metrología 0.00% GAPs' : '0.00% GAP Metrology'}</a></li>
        </ul>
      </div>
      <div>
        <h4 style="color: #fff; font-size: 0.92rem; margin-bottom: 1rem;">${isEs ? 'Gobernanza & Documentación' : 'Governance & Docs'}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="${langPrefix}mapa-sistema/index.html" style="color: #fef08a; font-weight: 700;">🗺️ ${isEs ? 'Árbol & Mapa Total (Raíces)' : 'Master Tree & Atlas'}</a></li>
            <li><a href="${langPrefix}flujo/index.html">${isEs ? 'Ciclo de Vida (10 Esferas)' : '6-Phase Lifecycle'}</a></li>
          <li><a href="${langPrefix}gerencia/index.html">${isEs ? 'Control de Costos SQLite' : 'SQLite Cost Governance'}</a></li>
          <li><a href="${langPrefix}canon/index.html">${isEs ? 'Biblioteca Canon 37 TXT' : 'Canon 37 TXT Library'}</a></li>
          <li><a href="${langPrefix}backup/index.html">${isEs ? 'Versión Backup de Respaldo' : 'Legacy Backup Snapshot'}</a></li>
        </ul>
      </div>
    </div>
    <div style="max-width: 1240px; margin: 0 auto; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <p>Copyright © 2026 ABRAXAS OS. ${isEs ? 'Todos los derechos reservados. Arquitectura Determinista en Apple Silicon.' : 'All rights reserved. Deterministic Architecture on Apple Silicon.'}</p>
      <p style="font-family: var(--font-mono); color: #d4af37; font-size: 0.78rem;">SHA-256: <code>91234741f0b3a1ac5bd7e4c0556fafa868d00769</code></p>
    </div>
  </footer>
  `;
}

// 1. GENERATE LA LUNA COMERCIAL PAGE (/es/luna-comercial/index.html)
function generateLunaComercialPage(locale) {
  const isEs = locale === 'es';
  const depth = 2;
  const root = getRootPrefix(depth);
  const targetDir = path.join(docsDir, locale, 'luna-comercial');
  fs.mkdirSync(targetDir, { recursive: true });

  const quickItems = [
    { label: '⚡ En 30s', href: '#resumen' },
    { label: '🔗 Vínculo Pieza-Venta', href: '#atribucion' },
    { label: '📸 OCR de Facturas', href: '#ocr-facturas' },
    { label: '👥 Control de Vendedores & Closers', href: '#vendedores' },
    { label: '📊 Cálculo de ROI de Campañas', href: '#roi-campanas' },
    { label: '📱 Canales (WhatsApp, ML, MP)', href: '#canales' }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'La Luna Comercial: Informes de Ventas, OCR y ROI — ABRAXAS OS' : 'The Commercial Moon: Sales Telemetry, OCR & ROI — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Cómo funciona la Luna Comercial de ABRAXAS: atribución de ventas por contenido en WhatsApp, MercadoLibre y Marketplace, ingesta de facturas por foto/OCR, gestión de vendedores y cálculo de ROI.' : 'Commercial Telemetry Moon: link multi-channel sales to published content, OCR invoice ingestion, sales rep management and campaign ROI calculation.'}">
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body>
  ${getUniversalHeader(locale, 'luna-comercial', depth)}
  ${getInternalQuickMenu(quickItems)}

  <main class="section-wrap" style="padding-top: 50px;">
    
    <div class="section-head" style="text-align: center;">
      <span class="tag" style="color: #30d158;">COMMERCE TELEMETRY // LA LUNA COMERCIAL DE VENTAS</span>
      <h1 class="h2">${isEs ? 'La Luna Comercial.<br/>De las Vistas en Redes a la Factura Cobrada.' : 'The Commercial Moon.<br/>From Content Views to Paid Invoices.'}</h1>
      <p class="p">${isEs ? 'Una herramienta de telemetría comercial independiente diseñada para conectar tus publicaciones con ventas reales en WhatsApp, MercadoLibre, Marketplace y tiendas físicas, con ingesta automática por foto de facturas y rendimiento de vendedores.' : 'A dedicated commercial telemetry engine connecting published content directly to multi-channel sales, OCR receipt ingestion, closer metrics, and exact campaign ROI.'}</p>
    </div>

    <!-- Dual Summary: En 30s + Especificación Técnica -->
    <div id="resumen" class="bento-grid" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag emerald">⚡ EN 30 SEGUNDOS // RESUMEN EJECUTIVO</span>
        <h3 class="card-h3">${isEs ? '¿Qué es y cómo funciona la Luna Comercial?' : 'What is the Commercial Moon?'}</h3>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.92rem; color: #e2e8f0; line-height: 1.5;">
          <li>💰 <strong>No es solo medir likes:</strong> Mide dinero ingresado en tu cuenta bancaria o caja registradora.</li>
          <li>🔗 <strong>Atribución Pieza a Venta:</strong> Cada video, carrusel o hilo lleva un contador en vivo de cuántos productos vendió y cuántos dólares generó.</li>
          <li>📸 <strong>Ingesta Ultrarrápida por Foto:</strong> Le tomas una foto a la factura o recibo, y la IA extrae monto, producto, fecha y cliente en 2 segundos.</li>
          <li>👥 <strong>Control de Vendedores y Closers:</strong> Mide qué asesor de ventas cierra más clientes provenientes del contenido de ABRAXAS.</li>
        </ul>
      </div>

      <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">🛠️ EN PROFUNDIDAD // LA LUNA DE CONTENIDO VS LA LUNA COMERCIAL</span>
        <h3 class="card-h3">${isEs ? 'Dos Lunas Complementarias en Coherencia' : 'Two Complementary Telemetric Moons'}</h3>
        <p class="card-desc" style="font-size: 0.92rem; line-height: 1.55;">
          ${isEs 
            ? '<strong>Luna 1 (Contenido):</strong> Ingesta retención de audiencia y watch-time para que YOD perfeccione los ganchos.<br/><strong>Luna 2 (Comercial):</strong> Ingesta facturas, órdenes de WhatsApp y ventas de MercadoLibre para calcular el ROI real y alimentar el presupuesto de nuevas campañas.' 
            : '<strong>Moon 1 (Content):</strong> Feeds audience retention into YOD to sharpen hooks.<br/><strong>Moon 2 (Commercial):</strong> Ingests sales orders, invoices, and sales reps conversion to compute true financial ROI.'}
        </p>
      </div>
    </div>

    <!-- 1. Vínculo Pieza-Venta (Content Revenue Ledger) -->
    <section id="atribucion" style="margin-bottom: 4rem;">
      <div class="section-head" style="text-align: left; margin-bottom: 2rem;">
        <span class="tag" style="color: #38bdf8;">01 // REGISTRO DE ATRIBUCIÓN</span>
        <h2 class="h2" style="font-size: 2rem;">${isEs ? 'El Registro de Ingresos por Pieza Publicada' : 'Published Content Revenue Ledger'}</h2>
        <p class="p" style="margin: 0; font-size: 1rem;">Cada contenido mantiene un libro contable vivo donde se actualizan automáticamente las ventas generadas.</p>
      </div>

      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.15); color: #d4af37;">
                <th style="padding: 12px 14px;">PIEZA / CONTENT_ID</th>
                <th style="padding: 12px 14px;">FORMATO</th>
                <th style="padding: 12px 14px;">CANAL ORIGEN</th>
                <th style="padding: 12px 14px;">UNIDADES</th>
                <th style="padding: 12px 14px;">FACTURACIÓN ($ USD)</th>
                <th style="padding: 12px 14px;">ROI ESTIMADO</th>
                <th style="padding: 12px 14px;">ESTADO</th>
              </tr>
            </thead>
            <tbody id="ocr-live-ledger-body">
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); color: #e2e8f0;">
                <td style="padding: 14px;"><span style="color: #38bdf8;">reel_01_gancho_autoridad</span></td>
                <td>Video 9:16 (Reels)</td>
                <td>WhatsApp Inbound</td>
                <td><strong>34 artículos</strong></td>
                <td><strong style="color: #30d158;">$4,760.00</strong></td>
                <td><span style="color: #fef08a; background: rgba(212,175,55,0.15); padding: 2px 6px; border-radius: 4px;">+840%</span></td>
                <td><span style="color: #30d158;">● Activo</span></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); color: #e2e8f0;">
                <td style="padding: 14px;"><span style="color: #38bdf8;">carousel_03_metodo_explicado</span></td>
                <td>Carrusel 4:5 (IG)</td>
                <td>MercadoLibre / Link Bio</td>
                <td><strong>19 artículos</strong></td>
                <td><strong style="color: #30d158;">$2,850.00</strong></td>
                <td><span style="color: #fef08a; background: rgba(212,175,55,0.15); padding: 2px 6px; border-radius: 4px;">+520%</span></td>
                <td><span style="color: #30d158;">● Activo</span></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); color: #e2e8f0;">
                <td style="padding: 14px;"><span style="color: #38bdf8;">thread_05_contrarian_thesis</span></td>
                <td>Hilo X / LinkedIn</td>
                <td>B2B DM / Llamada Closer</td>
                <td><strong>3 contratos</strong></td>
                <td><strong style="color: #30d158;">$15,000.00</strong></td>
                <td><span style="color: #fef08a; background: rgba(212,175,55,0.15); padding: 2px 6px; border-radius: 4px;">+2,900%</span></td>
                <td><span style="color: #30d158;">● Activo</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      
        <div style="margin-top: 1.5rem; display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          <button id="btn-simulate-ocr" class="btn-apple-cta" style="background: var(--color-emerald); padding: 12px 24px; font-size: 0.9rem; cursor: pointer; border: none; font-weight: 700;">
            📸 ${isEs ? 'Simular Foto de Factura / Ticket OCR' : 'Simulate OCR Invoice Upload'}
          </button>
          <span style="font-size: 0.8rem; color: #94a3b8;">Formatos soportados: Facturas PDF, JPG, Tickets POS y capturas de WhatsApp.</span>
        </div>

      </div>
    </section>

    <!-- 2. Ingesta Ultrarrápida por Foto / OCR y Formulario -->
    <section id="ocr-facturas" class="bento-grid" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag iris">02 // INGESTA DE VENTAS POR FOTO / OCR</span>
        <h3 class="card-h3">${isEs ? 'Escaneo Inteligente de Facturas y Tickets' : 'OCR Receipt & Invoice Scanning'}</h3>
        <p class="card-desc">
          ${isEs 
            ? 'Toma una foto de una factura física, captura de pantalla de MercadoLibre, comprobante de transferencia bancaria o ticket POS. El motor OCR extrae automáticamente: <code>Monto, Fecha, SKU/Producto, Nombre de Comprador y Canal</code> sin teclear manualmente.' 
            : 'Snap a photo of an invoice, transfer receipt, or MercadoLibre screenshot. The OCR engine automatically extracts Amount, Date, SKU, and Buyer details.'}
        </p>
        <div style="background: #000; padding: 14px; border-radius: 10px; border: 1px solid rgba(128,82,255,0.3); font-family: var(--font-mono); font-size: 0.8rem; color: #cbd5e1;">
          📸 [Foto Subida] ➔ OCR Parse: { total: "$140.00", sku: "PACK_PRO", date: "2026-09-01", channel: "WhatsApp" }
        </div>
      </div>

      <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag cyan">FORMULARIO ÁGIL DE VENTA MANUAL</span>
        <h3 class="card-h3">${isEs ? 'Ajustes Cómodos en 3 Clics' : 'Frictionless 3-Click Manual Adjustments'}</h3>
        <p class="card-desc">
          ${isEs 
            ? 'Si prefieres agregar datos a mano, la interfaz ofrece selectores desplegables para asignar el <strong>Vendedor / Closer</strong>, la <strong>Pieza de Contenido</strong> origen y la <strong>Ciudad / Plataforma</strong> en segundos.' 
            : 'Easily assign sales rep ID, content origin, and platform with rapid dropdown selectors.'}
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.8rem; font-family: var(--font-mono);">
          <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px;">Vendedor: [Carlos Closer #02]</div>
          <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px;">Origen: [Reel #01 Gancho]</div>
        </div>
      </div>
    </section>

    <!-- 3. Control de Vendedores y Closers -->
    <section id="vendedores" style="margin-bottom: 4rem;">
      <div class="section-head" style="text-align: left; margin-bottom: 2rem;">
        <span class="tag" style="color: #bf5af2;">03 // EQUIPO DE VENTAS & CLOSERS</span>
        <h2 class="h2" style="font-size: 2rem">${isEs ? 'Rendimiento de Vendedores Digitales' : 'Sales Rep & Closer Telemetry'}</h2>
        <p class="p" style="margin: 0; font-size: 1rem;">El contenido genera los leads calificados; la Luna Comercial mide la efectividad del equipo de ventas que los recibe y monetiza.</p>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-4" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">CLOSER #01 // ALTA CONVERSIÓN</span>
          <h4 style="font-size: 1.25rem; color: #fff; margin-bottom: 6px;">Mariana V. (WhatsApp B2B)</h4>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">Leads atendidos: <strong>84</strong><br/>Ventas cerradas: <strong>31 (36.9%)</strong><br/>Facturación total: <strong style="color: #30d158;">$18,400.00</strong></p>
        </div>

        <div class="spotlight-card col-4" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">CLOSER #02 // ECOMMERCE & ML</span>
          <h4 style="font-size: 1.25rem; color: #fff; margin-bottom: 6px;">Jorge R. (MercadoLibre / DMs)</h4>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">Consultas atendidas: <strong>142</strong><br/>Ventas cerradas: <strong>58 (40.8%)</strong><br/>Facturación total: <strong style="color: #30d158;">$9,280.00</strong></p>
        </div>

        <div class="spotlight-card col-4" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">CLOSER #03 // HIGH-TICKET</span>
          <h4 style="font-size: 1.25rem; color: #fff; margin-bottom: 6px;">Daniela S. (Llamadas Directas)</h4>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">Llamadas agendadas: <strong>14</strong><br/>Contratos firmados: <strong>6 (42.8%)</strong><br/>Facturación total: <strong style="color: #30d158;">$30,000.00</strong></p>
        </div>
      </div>
    </section>

    <!-- 4. Cálculo de ROI y Canales -->
    <section id="roi-campanas" class="bento-grid" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">04 // FÓRMULA DE RETORNO SOBRE INVERSIÓN (ROI DE CAMPAÑA)</span>
        <h3 class="card-h3">${isEs ? 'Cálculo Matemático de Rentabilidad Real' : 'Mathematical Campaign ROI Calculation'}</h3>
        <p class="card-desc" style="font-size: 1rem; color: #e2e8f0; line-height: 1.6;">
          \\[
            \\text{ROI} = \\frac{\\text{Facturación Atribuida} - (\\text{Costo de Producción} + \\text{Pauta Comercial})}{\\text{Costo de Producción} + \\text{Pauta Comercial}} \\times 100\\%
          \\]
        </p>
        <p style="font-size: 0.92rem; color: #cbd5e1;">
          ${isEs 
            ? 'Dado que el costo de producción con ABRAXAS OS en Apple Silicon es cercano a cero (0.00 USD en horas de edición humana y GPU local), el ROI de cada campaña se dispara exponencialmente.' 
            : 'Since local Apple Silicon production compute costs approach zero, campaign ROI expands exponentially.'}
        </p>
      </div>
    </section>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  
  <script>
    // OCR Simulate Button — Adds real new row to the ledger
    let ocrCounter = 0;
    const sampleProducts = [
      { name: 'reel_nuevo_autoridad', format: 'Video 9:16 (Reels)', canal: 'WhatsApp Inbound', units: Math.floor(Math.random()*40+5), price: Math.floor(Math.random()*200+50) },
      { name: 'carousel_coaching_pro', format: 'Carrusel 4:5 (IG)', canal: 'Instagram DM', units: Math.floor(Math.random()*25+3), price: Math.floor(Math.random()*150+80) },
      { name: 'hilo_caso_exito', format: 'Hilo X / LinkedIn', canal: 'LinkedIn Inbound', units: Math.floor(Math.random()*10+1), price: Math.floor(Math.random()*500+200) },
      { name: 'newsletter_especial', format: 'Newsletter Email', canal: 'Substack Referral', units: Math.floor(Math.random()*15+2), price: Math.floor(Math.random()*120+40) },
      { name: 'youtube_manifiesto', format: 'YouTube 16:9', canal: 'Búsqueda Orgánica', units: Math.floor(Math.random()*8+1), price: Math.floor(Math.random()*800+300) },
      { name: 'podcast_entrevista', format: 'Micro-Podcast', canal: 'Spotify Link', units: Math.floor(Math.random()*12+2), price: Math.floor(Math.random()*100+30) }
    ];
    
    document.getElementById('btn-simulate-ocr')?.addEventListener('click', function() {
      ocrCounter++;
      const sample = sampleProducts[ocrCounter % sampleProducts.length];
      const units = Math.floor(Math.random()*40+5);
      const unitPrice = Math.floor(Math.random()*200+50);
      const total = units * unitPrice;
      const roi = Math.floor(Math.random()*2000+200);
      const tbody = document.getElementById('ocr-live-ledger-body');
      if (!tbody) return;
      
      const newRow = document.createElement('tr');
      newRow.style.cssText = 'border-bottom: 1px solid rgba(255,255,255,0.06); color: #e2e8f0; animation: fadeIn 0.5s ease;';
      newRow.innerHTML = [
        "<td style=\"padding: 14px;\"><span style=\"color: #38bdf8;\">" + sample.name + "_" + String(ocrCounter).padStart(2, "0") + "</span></td>",
        "<td>" + sample.format + "</td>",
        "<td>" + sample.canal + "</td>",
        "<td><strong>" + units + " artículos</strong></td>",
        "<td><strong style=\"color: #30d158;\">$" + total.toLocaleString() + ".00</strong></td>",
        "<td><span style=\"color: #fef08a; background: rgba(212,175,55,0.15); padding: 2px 6px; border-radius: 4px;\">+" + roi + "%</span></td>",
        "<td><span style=\"color: #30d158;\">● Nuevo (OCR)</span></td>"
      ].join("");
      tbody.insertBefore(newRow, tbody.firstChild);
      
      // Flash animation
      newRow.style.background = 'rgba(48,209,88,0.15)';
      setTimeout(() => { newRow.style.background = 'transparent'; newRow.style.transition = 'background 1s ease'; }, 1500);
      
      // Update summary if exists
      const summaryEl = document.getElementById('ocr-total-summary');
      if (summaryEl) {
        const currentTotal = parseInt(summaryEl.dataset.total || '22610');
        const newTotal = currentTotal + total;
        summaryEl.dataset.total = newTotal;
        summaryEl.textContent = '$' + newTotal.toLocaleString() + '.00';
      }
    });
  </script>
  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Commercial Moon Suite] Generated /${locale}/luna-comercial/index.html`);
}

// 2. GENERATE BRANDING METHOD & YOD CAMPAIGNS PAGE (/es/branding-method/index.html)
function generateBrandingMethodPage(locale) {
  const isEs = locale === 'es';
  const depth = 2;
  const root = getRootPrefix(depth);
  const targetDir = path.join(docsDir, locale, 'branding-method');
  fs.mkdirSync(targetDir, { recursive: true });

  const quickItems = [
    { label: '⚡ En 30s', href: '#resumen' },
    { label: '🧭 Diagnóstico YOD', href: '#diagnostico' },
    { label: '🔥 4 Campañas Pre-Diseñadas', href: '#campanas' },
    { label: '📜 El Branding Method Core', href: '#core-method' },
    { label: '🎙️ Ramificación a Podcasts & Ventas', href: '#ramificacion' }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'El ABRAXAS Branding Method & Generador de Campañas YOD — ABRAXAS OS' : 'ABRAXAS Branding Method & YOD Campaign Engine — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Cómo funciona el diagnóstico de YOD: De dónde vienes, A dónde quieres ir, Quién eres ahora y Quién puedes llegar a ser. Creación de campañas, pitch de ventas y Branding Method.' : 'YOD Strategic Diagnostic & Campaign Generator: Origin, Destination, Identity Evolution, pre-built campaigns, sales pitches, and master branding method.'}">
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body>
  ${getUniversalHeader(locale, 'branding-method', depth)}
  ${getInternalQuickMenu(quickItems)}

  <main class="section-wrap" style="padding-top: 50px;">
    
    <div class="section-head" style="text-align: center;">
      <span class="tag" style="color: #bf5af2;">ATZILUTH CREATIVE STRATEGY // BRANDING METHOD & CAMPAIGNS</span>
      <h1 class="h2">${isEs ? 'El Branding Method de ABRAXAS.<br/>Diagnóstico Estratégico y Campañas YOD.' : 'The ABRAXAS Branding Method.<br/>YOD Strategic Diagnostic & Campaigns.'}</h1>
      <p class="p">${isEs ? 'YOD procesa el origen y aspiración de tu empresa para revelar su máximo potencial de nicho, generando un plan de contenidos, campañas maestras, pitch de ventas y el documento fundacional de marca.' : 'YOD maps your origin and vision, generating pre-built campaigns, sales pitches, and master branding blueprints.'}</p>
    </div>

    <!-- Resumen Ejecutivo -->
    <div id="resumen" class="bento-grid" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag iris">⚡ EN 30 SEGUNDOS // RESUMEN EJECUTIVO</span>
        <h3 class="card-h3">${isEs ? '¿Cómo transforma YOD la estrategia de una empresa?' : 'How YOD Transforms Brand Strategy?'}</h3>
        <p class="card-desc" style="color: #e2e8f0; font-size: 1rem; line-height: 1.6;">
          ${isEs 
            ? 'El usuario responde 3 preguntas fundacionales: <strong>1. ¿De dónde vienes?</strong> (estado actual y dolores), <strong>2. ¿A dónde quieres ir?</strong> (visión y metas), y <strong>3. ¿Quién eres ahora y qué te hace ser eso?</strong> (activos y fortalezas). YOD analiza los vacíos del mercado y define <em>«Quién más puedes llegar a ser»</em>, redactando automáticamente el Branding Method, las campañas activas, los guiones de podcasts y los argumentos de venta de tus vendedores.' 
            : 'User answers origin, destination, and current identity. YOD computes market blind spots, defining your maximum brand potential and auto-generating branding blueprints and sales pitches.'}
        </p>
      </div>
    </div>

    
    <!-- Interactive YOD Diagnostic Tool -->
    <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
      <span class="card-pill-tag gold">SIMULADOR EN VIVO // YOD COGNITIVE RADAR</span>
      <h3 class="card-h3">${isEs ? 'Prueba el Diagnóstico de Nicho en Tiempo Real' : 'Test Real-Time Niche Diagnostic'}</h3>
      <p class="card-desc">${isEs ? 'Selecciona tu industria y haz clic para ver cómo YOD extrae los ángulos de autoridad y redacta los ganchos de venta:' : 'Select your industry and run the YOD diagnostic engine:'}</p>

      <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <select id="select-niche-preset" style="background: #000; color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 10px 18px; border-radius: 8px; font-size: 0.9rem; outline: none;">
          <option value="saas">Software B2B & Tecnología</option>
          <option value="ecommerce">E-Commerce & Productos Físicos</option>
          <option value="consulting">Consultoría & Servicios High-Ticket</option>
          <option value="creator">Creadores de Contenido & Agencias</option>
        </select>
        <button id="btn-run-yod-diagnostic" class="btn-apple-cta" style="background: var(--color-iris); border: none; padding: 10px 24px; font-size: 0.9rem; cursor: pointer; font-weight: 700;">
          🧭 ${isEs ? 'Ejecutar Diagnóstico Estratégico YOD' : 'Run YOD Strategic Diagnostic'}
        </button>
      </div>

      <!-- Dynamic Output Box -->
      <div id="yod-diagnostic-output" style="display: none; background: #000; border: 1px solid rgba(212,175,55,0.35); border-radius: 14px; padding: 20px; animation: slideUpPopup 0.3s ease;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 14px;">
          <span style="font-family: var(--font-mono); color: #d4af37; font-size: 0.85rem; font-weight: 700;">◈ YOD ANALYSIS COMPLETE // CATEGORY EXPANSION</span>
          <span style="font-family: var(--font-mono); color: #30d158; font-size: 0.8rem;">AUTORIDAD: 96/100</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; font-size: 0.88rem; color: #cbd5e1;">
          <div>
            <strong style="color: #fff; display: block; margin-bottom: 4px;">1. Tesis Contraria Identificada:</strong>
            <p style="color: #94a3b8;">"Tu mercado está saturado de promesas vacías. La salida es convertir el proceso técnico en evidencia visual transparente."</p>
          </div>
          <div>
            <strong style="color: #fff; display: block; margin-bottom: 4px;">2. Gancho Maestro Calificado (94/100):</strong>
            <p style="color: #fef08a;">«El error que comete el 90% de las empresas al intentar escalar sin infraestructura determinista.»</p>
          </div>
          <div>
            <strong style="color: #fff; display: block; margin-bottom: 4px;">3. Campaña Asignada:</strong>
            <p style="color: #38bdf8;">Campaña 01 (Conquista de Nicho) ➔ 8 Formatos Sincronizados con Merkle-DAG.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 1. El Diagnóstico Estratégico de YOD en 4 Pasos -->
    <section id="diagnostico" style="margin-bottom: 4rem;">
      <div class="section-head" style="text-align: left; margin-bottom: 2rem;">
        <span class="tag" style="color: #d4af37;">01 // LOS 4 VECTORES DEL DIAGNÓSTICO</span>
        <h2 class="h2" style="font-size: 2rem;">${isEs ? 'La Matriz de Identidad & Expansión' : 'Identity & Expansion Matrix'}</h2>
        <p class="p" style="margin: 0; font-size: 1rem;">El mapa que conecta la realidad actual con la autoridad de mercado futura.</p>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag ruby">PASO 1 // ORIGEN</span>
          <h4 style="font-size: 1.3rem; color: #fff; margin-bottom: 8px;">1. ¿De dónde vienes? (El Dolor Fundacional)</h4>
          <p style="font-size: 0.92rem; color: #94a3b8; line-height: 1.55;">
            Registra el estado actual: cuellos de botella de ventas, dependencia de referidos, falta de autoridad o contenido que no convierte.
          </p>
        </div>

        <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag emerald">PASO 2 // DESTINO</span>
          <h4 style="font-size: 1.3rem; color: #fff; margin-bottom: 8px;">2. ¿A dónde quieres ir? (La Visión de Expansión)</h4>
          <p style="font-size: 0.92rem; color: #94a3b8; line-height: 1.55;">
            Establece las metas financieras, el nivel de posicionamiento deseado y el tamaño de mercado que se planea conquistar.
          </p>
        </div>

        <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">PASO 3 // IDENTIDAD ACTUAL</span>
          <h4 style="font-size: 1.3rem; color: #fff; margin-bottom: 8px;">3. ¿Quién eres ahora y qué te hace serlo?</h4>
          <p style="font-size: 0.92rem; color: #94a3b8; line-height: 1.55;">
            Audita tus verdades probadas, casos de éxito, ventajas competitivas reales y los axiomas inmutables de tu equipo.
          </p>
        </div>

        <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">PASO 4 // POTENCIAL EXPANDIDO (YOD ENGINE)</span>
          <h4 style="font-size: 1.3rem; color: #fff; margin-bottom: 8px;">4. ¿Quién más puedes ser? (La Tesis de Autoridad)</h4>
          <p style="font-size: 0.92rem; color: #cbd5e1; line-height: 1.55;">
            YOD sintetiza la información y revela la categoría de mercado donde tu marca puede ser el líder indiscutible sin competir por precio.
          </p>
        </div>
      </div>
    </section>

    <!-- 2. 4 Modelos de Campañas Pre-Diseñadas -->
    <section id="campanas" style="margin-bottom: 4rem;">
      <div class="section-head" style="text-align: left; margin-bottom: 2rem;">
        <span class="tag" style="color: #38bdf8;">02 // MODELOS DE CAMPAÑA PRE-DISEÑADOS</span>
        <h2 class="h2" style="font-size: 2rem;">${isEs ? '4 Campañas Listas para Desplegar según tu Etapa' : '4 Plug-and-Play Campaign Blueprints'}</h2>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">CAMPAÑA 01 // CONQUISTA DE NICHO</span>
          <h4 class="card-h3">Tesis Contraria & Destrucción de Mitos</h4>
          <p class="card-desc">Ataca las falsas creencias de tu industria. Posiciona tu producto como la única solución lógica mediante videos de 18s y carruseles 4:5.</p>
        </div>

        <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">CAMPAÑA 02 // REACTIVACIÓN DE BASE FRÍA</span>
          <h4 class="card-h3">Oferta Relámpago por WhatsApp & Email</h4>
          <p class="card-desc">Reactiva prospectos antiguos en tu base de datos mediante mensajes cortos con deuda narrativa y payoff irresistible.</p>
        </div>

        <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">CAMPAÑA 03 // EL GRAN MONUMENTO</span>
          <h4 class="card-h3">Autoridad Institucional & Podcasts</h4>
          <p class="card-desc">Ensayos largos en YouTube (16:9) y episodios de podcast que educan a clientes de alto valor adquisitivo.</p>
        </div>

        <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag emerald">CAMPAÑA 04 // CIERRE HIGH-TICKET</span>
          <h4 class="card-h3">Lanzamiento en 4 Tiempos & Pitch Closer</h4>
          <p class="card-desc">Secuencia cronometrada que calienta la audiencia en 7 días y deriva a llamadas de cierre con guiones optimizados para vendedores.</p>
        </div>
      </div>
    </section>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  
  <script>
    // OCR Simulate Button — Adds real new row to the ledger
    let ocrCounter = 0;
    const sampleProducts = [
      { name: 'reel_nuevo_autoridad', format: 'Video 9:16 (Reels)', canal: 'WhatsApp Inbound', units: Math.floor(Math.random()*40+5), price: Math.floor(Math.random()*200+50) },
      { name: 'carousel_coaching_pro', format: 'Carrusel 4:5 (IG)', canal: 'Instagram DM', units: Math.floor(Math.random()*25+3), price: Math.floor(Math.random()*150+80) },
      { name: 'hilo_caso_exito', format: 'Hilo X / LinkedIn', canal: 'LinkedIn Inbound', units: Math.floor(Math.random()*10+1), price: Math.floor(Math.random()*500+200) },
      { name: 'newsletter_especial', format: 'Newsletter Email', canal: 'Substack Referral', units: Math.floor(Math.random()*15+2), price: Math.floor(Math.random()*120+40) },
      { name: 'youtube_manifiesto', format: 'YouTube 16:9', canal: 'Búsqueda Orgánica', units: Math.floor(Math.random()*8+1), price: Math.floor(Math.random()*800+300) },
      { name: 'podcast_entrevista', format: 'Micro-Podcast', canal: 'Spotify Link', units: Math.floor(Math.random()*12+2), price: Math.floor(Math.random()*100+30) }
    ];
    
    document.getElementById('btn-simulate-ocr')?.addEventListener('click', function() {
      ocrCounter++;
      const sample = sampleProducts[ocrCounter % sampleProducts.length];
      const units = Math.floor(Math.random()*40+5);
      const unitPrice = Math.floor(Math.random()*200+50);
      const total = units * unitPrice;
      const roi = Math.floor(Math.random()*2000+200);
      const tbody = document.getElementById('ocr-live-ledger-body');
      if (!tbody) return;
      
      const newRow = document.createElement('tr');
      newRow.style.cssText = 'border-bottom: 1px solid rgba(255,255,255,0.06); color: #e2e8f0; animation: fadeIn 0.5s ease;';
      newRow.innerHTML = [
        "<td style=\"padding: 14px;\"><span style=\"color: #38bdf8;\">" + sample.name + "_" + String(ocrCounter).padStart(2, "0") + "</span></td>" +
        "<td>" + sample.format + "</td>" +
        "<td>" + sample.canal + "</td>" +
        "<td><strong>" + units + " artículos</strong></td>" +
        "<td><strong style=\"color: #30d158;\">$" + total.toLocaleString() + ".00</strong></td>" +
        "<td><span style=\"color: #fef08a; background: rgba(212,175,55,0.15); padding: 2px 6px; border-radius: 4px;\">+" + roi + "%</span></td>" +
        "<td><span style=\"color: #30d158;\">● Nuevo (OCR)</span></td>"
      ].join("");
      tbody.insertBefore(newRow, tbody.firstChild);
      
      // Flash animation
      newRow.style.background = 'rgba(48,209,88,0.15)';
      setTimeout(() => { newRow.style.background = 'transparent'; newRow.style.transition = 'background 1s ease'; }, 1500);
      
      // Update summary if exists
      const summaryEl = document.getElementById('ocr-total-summary');
      if (summaryEl) {
        const currentTotal = parseInt(summaryEl.dataset.total || '22610');
        const newTotal = currentTotal + total;
        summaryEl.dataset.total = newTotal;
        summaryEl.textContent = '$' + newTotal.toLocaleString() + '.00';
      }
    });
  </script>
  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Commercial Moon Suite] Generated /${locale}/branding-method/index.html`);
}

// 3. GENERATE ABRAXAS CORE REAL-WORLD EXAMPLE PAGE (/es/abraxas-core-example/index.html)
function generateAbraxasCoreExamplePage(locale) {
  const isEs = locale === 'es';
  const depth = 2;
  const root = getRootPrefix(depth);
  const targetDir = path.join(docsDir, locale, 'abraxas-core-example');
  fs.mkdirSync(targetDir, { recursive: true });

  const quickItems = [
    { label: '⚡ En 30s', href: '#resumen' },
    { label: '🏛️ Diagnóstico de ABRAXAS', href: '#diag-abraxas' },
    { label: '📜 El Branding Method Oficial', href: '#branding-abraxas' },
    { label: '🚀 Campañas Activas', href: '#campanas-abraxas' },
    { label: '💬 Argumentario de Ventas', href: '#pitch-abraxas' }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Caso de Ejemplo: El Core de ABRAXAS OS — ABRAXAS OS' : 'Reference Case: The Core of ABRAXAS OS — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Ejemplo completo y detallado del diagnóstico de YOD, Branding Method, campañas activas y pitch de ventas aplicado directamente a ABRAXAS OS.' : 'Complete real-world case study of the YOD diagnostic and Branding Method applied to ABRAXAS OS itself.'}">
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body>
  ${getUniversalHeader(locale, 'abraxas-core-example', depth)}
  ${getInternalQuickMenu(quickItems)}

  <main class="section-wrap" style="padding-top: 50px;">
    
    <div class="section-head" style="text-align: center;">
      <span class="tag" style="color: #d4af37;">MASTER REFERENCE IMPLEMENTATION // ABRAXAS CORE</span>
      <h1 class="h2">${isEs ? 'El Core de ABRAXAS OS.<br/>El Caso de Ejemplo Real Completo.' : 'The Core of ABRAXAS OS.<br/>The Complete Real Case Blueprint.'}</h1>
      <p class="p">${isEs ? 'Observa cómo el motor YOD y el Branding Method se aplican al 100% sobre ABRAXAS OS: su diagnóstico, su voz de marca, sus campañas activas y su argumentario comercial.' : 'See the YOD engine and Branding Method applied end-to-end to ABRAXAS OS itself.'}</p>
    </div>

    <!-- Resumen Ejecutivo -->
    <div id="resumen" class="bento-grid" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">⚡ EN 30 SEGUNDOS // RESUMEN EJECUTIVO</span>
        <h3 class="card-h3">${isEs ? 'La Identidad de ABRAXAS OS en una Cápsula' : 'ABRAXAS OS Identity in a Capsule'}</h3>
        <p class="card-desc" style="color: #e2e8f0; font-size: 1rem; line-height: 1.6;">
          ${isEs 
            ? '<strong>Tesis:</strong> «ABRAXAS convierte criterio en infraestructura.»<br/><strong>Propuesta Única:</strong> El único sistema operativo local para macOS que permite a un solo operador producir y gobernar 50 activos de contenido multicanal al mes en una tarde, con cero costo computacional de nube y cero margen de error (0.00% GAPs).' 
            : '<strong>Thesis:</strong> «ABRAXAS turns criterion into infrastructure.»<br/><strong>Value Proposition:</strong> The only local macOS OS enabling one person to produce 50 multi-channel assets in one afternoon with zero cloud fees and zero error tolerance.'}
        </p>
      </div>
    </div>

    <!-- 1. Diagnóstico de ABRAXAS OS -->
    <section id="diag-abraxas" style="margin-bottom: 4rem;">
      <div class="section-head" style="text-align: left; margin-bottom: 2rem;">
        <span class="tag" style="color: #38bdf8;">01 // EL DIAGNÓSTICO DE ABRAXAS</span>
        <h2 class="h2" style="font-size: 2rem;">${isEs ? 'Los 4 Vectores Aplicados a ABRAXAS OS' : 'The 4 Vectors Applied to ABRAXAS OS'}</h2>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag ruby">ORIGEN (DE DÓNDE VENIMOS)</span>
          <h4 class="card-h3">El Caos de las Agencias Tradicionales</h4>
          <p class="card-desc">Creadores agotados saltando entre Premiere, Notion, ChatGPT y Canva, perdiendo días en editar silencios y terminando con contenido sin tesis ni ventas.</p>
        </div>

        <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag emerald">DESTINO (A DÓNDE VAMOS)</span>
          <h4 class="card-h3">El Estándar de Soberanía en Apple Silicon</h4>
          <p class="card-desc">Convertir a ABRAXAS OS en el sistema operativo indispensable para empresas, CEOs y agencias que exigen control absoluto de su marca y producción industrial.</p>
        </div>

        <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">QUIÉNES SOMOS AHORA</span>
          <h4 class="card-h3">Infraestructura Determinista Probada</h4>
          <p class="card-desc">Un motor de software verificado con pruebas de regresión, persistencia SQLite local, 37 dossiers canónicos y metrología SHIM 0.00% GAPs.</p>
        </div>

        <div class="spotlight-card col-6" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">QUIÉNES PODEMOS SER</span>
          <h4 class="card-h3">La Máquina de Autoridad y Rentabilidad</h4>
          <p class="card-desc">El ecosistema donde cada pieza de contenido genera demanda predecible y ventas auditadas en tiempo real mediante la Luna Comercial.</p>
        </div>
      </div>
    </section>

    <!-- 2. Argumentario Comercial y Pitch de Ventas -->
    <section id="pitch-abraxas" style="margin-bottom: 4rem;">
      <div class="section-head" style="text-align: left; margin-bottom: 2rem;">
        <span class="tag" style="color: #30d158;">02 // ARGUMENTARIO COMERCIAL & PITCH DE CIERRE</span>
        <h2 class="h2" style="font-size: 2rem;">${isEs ? 'El Pitch de Ventas Oficial para Closers' : 'Official Closer Sales Pitch'}</h2>
      </div>

      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag emerald">PITCH EN 4 TIEMPOS</span>
        <h3 class="card-h3">${isEs ? '«Deja de ser esclavo de la edición manual: toma el control con ABRAXAS»' : '«Take Total Command with ABRAXAS OS»'}</h3>
        <div style="display: flex; flex-direction: column; gap: 14px; font-size: 0.95rem; color: #cbd5e1; line-height: 1.6; margin-top: 1rem;">
          <p><strong>1. Gancho de Dolor:</strong> "¿Cuánto tiempo y dinero pierdes cada mes coordinando redactores, editores de video y diseñadores para publicar solo un puñado de piezas mediocres?"</p>
          <p><strong>2. Contradicción:</strong> "Contratar más gente o pagar más suscripciones de IA en la nube no resuelve el problema, porque el cuello de botella es la falta de criterio estructurado."</p>
          <p><strong>3. Mecanismo Único:</strong> "ABRAXAS OS ejecuta todo en tu Mac en una sola tarde: auto-edita tus videos en 18s, genera carruseles e hilos desde una sola idea y audita que todo sea perfecto."</p>
          <p><strong>4. Llamado a la Acción:</strong> "Implementa ABRAXAS OS en tu equipo hoy y multiplica tu volumen de contenido por 8 reduciendo tus costos en un 90%."</p>
        </div>
      </div>
    </section>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  
  <script>
    // OCR Simulate Button — Adds real new row to the ledger
    let ocrCounter = 0;
    const sampleProducts = [
      { name: 'reel_nuevo_autoridad', format: 'Video 9:16 (Reels)', canal: 'WhatsApp Inbound', units: Math.floor(Math.random()*40+5), price: Math.floor(Math.random()*200+50) },
      { name: 'carousel_coaching_pro', format: 'Carrusel 4:5 (IG)', canal: 'Instagram DM', units: Math.floor(Math.random()*25+3), price: Math.floor(Math.random()*150+80) },
      { name: 'hilo_caso_exito', format: 'Hilo X / LinkedIn', canal: 'LinkedIn Inbound', units: Math.floor(Math.random()*10+1), price: Math.floor(Math.random()*500+200) },
      { name: 'newsletter_especial', format: 'Newsletter Email', canal: 'Substack Referral', units: Math.floor(Math.random()*15+2), price: Math.floor(Math.random()*120+40) },
      { name: 'youtube_manifiesto', format: 'YouTube 16:9', canal: 'Búsqueda Orgánica', units: Math.floor(Math.random()*8+1), price: Math.floor(Math.random()*800+300) },
      { name: 'podcast_entrevista', format: 'Micro-Podcast', canal: 'Spotify Link', units: Math.floor(Math.random()*12+2), price: Math.floor(Math.random()*100+30) }
    ];
    
    document.getElementById('btn-simulate-ocr')?.addEventListener('click', function() {
      ocrCounter++;
      const sample = sampleProducts[ocrCounter % sampleProducts.length];
      const units = Math.floor(Math.random()*40+5);
      const unitPrice = Math.floor(Math.random()*200+50);
      const total = units * unitPrice;
      const roi = Math.floor(Math.random()*2000+200);
      const tbody = document.getElementById('ocr-live-ledger-body');
      if (!tbody) return;
      
      const newRow = document.createElement('tr');
      newRow.style.cssText = 'border-bottom: 1px solid rgba(255,255,255,0.06); color: #e2e8f0; animation: fadeIn 0.5s ease;';
      newRow.innerHTML = [
        "<td style=\"padding: 14px;\"><span style=\"color: #38bdf8;\">" + sample.name + "_" + String(ocrCounter).padStart(2, "0") + "</span></td>" +
        "<td>" + sample.format + "</td>" +
        "<td>" + sample.canal + "</td>" +
        "<td><strong>" + units + " artículos</strong></td>" +
        "<td><strong style=\"color: #30d158;\">$" + total.toLocaleString() + ".00</strong></td>" +
        "<td><span style=\"color: #fef08a; background: rgba(212,175,55,0.15); padding: 2px 6px; border-radius: 4px;\">+" + roi + "%</span></td>" +
        "<td><span style=\"color: #30d158;\">● Nuevo (OCR)</span></td>"
      ].join("");
      tbody.insertBefore(newRow, tbody.firstChild);
      
      // Flash animation
      newRow.style.background = 'rgba(48,209,88,0.15)';
      setTimeout(() => { newRow.style.background = 'transparent'; newRow.style.transition = 'background 1s ease'; }, 1500);
      
      // Update summary if exists
      const summaryEl = document.getElementById('ocr-total-summary');
      if (summaryEl) {
        const currentTotal = parseInt(summaryEl.dataset.total || '22610');
        const newTotal = currentTotal + total;
        summaryEl.dataset.total = newTotal;
        summaryEl.textContent = '$' + newTotal.toLocaleString() + '.00';
      }
    });
  </script>
  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Commercial Moon Suite] Generated /${locale}/abraxas-core-example/index.html`);
}

// 4. GENERATE CRITERIOS & ROADMAP PAGE (/es/criterios-roadmap/index.html)
function generateCriteriosRoadmapPage(locale) {
  const isEs = locale === 'es';
  const depth = 2;
  const root = getRootPrefix(depth);
  const targetDir = path.join(docsDir, locale, 'criterios-roadmap');
  fs.mkdirSync(targetDir, { recursive: true });

  const quickItems = [
    { label: '⚡ En 30s', href: '#resumen' },
    { label: '📜 Los Criterios de Calidad', href: '#criterios' },
    { label: '🗺️ Roadmap 2026-2027', href: '#roadmap' },
    { label: '🧭 Hitos de Madurez', href: '#hitos' }
  ];

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isEs ? 'Criterios de Calidad & Roadmap Maestro — ABRAXAS OS' : 'Master Criteria & Roadmap — ABRAXAS OS'}</title>
  <meta name="description" content="${isEs ? 'Explicación detallada de todos los criterios de calidad de ABRAXAS OS, reglas ontológicas, mapa de ruta 2026-2027 y seguimiento de objetivos.' : 'Detailed criteria breakdown, ontological rules, and 2026-2027 roadmap tracking in ABRAXAS OS.'}">
  <link rel="stylesheet" href="${root}assets/abraxas-apple-canon.css">
  <link rel="stylesheet" href="${root}assets/apple-macbook-pro-v3.css">
</head>
<body>
  ${getUniversalHeader(locale, 'criterios-roadmap', depth)}
  ${getInternalQuickMenu(quickItems)}

  <main class="section-wrap" style="padding-top: 50px;">
    
    <div class="section-head" style="text-align: center;">
      <span class="tag" style="color: #d4af37;">SYSTEM CANON // CRITERIA & ROADMAP</span>
      <h1 class="h2">${isEs ? 'Criterios de Calidad & Roadmap.<br/>A dónde vamos y quiénes somos.' : 'Quality Criteria & Master Roadmap.<br/>Where we go and who we are.'}</h1>
      <p class="p">${isEs ? 'El compendio exhaustivo de los principios que gobiernan cada módulo de ABRAXAS OS y el mapa de ruta evolutivo hacia la soberanía tecnológica total.' : 'The comprehensive criteria governing every ABRAXAS OS subsystem.'}</p>
    </div>

    <!-- Resumen Ejecutivo -->
    <div id="resumen" class="bento-grid" style="margin-bottom: 4rem;">
      <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
        <span class="card-pill-tag gold">⚡ EN 30 SEGUNDOS // RESUMEN EJECUTIVO</span>
        <h3 class="card-h3">${isEs ? 'La Ley Suprema de Criterio de ABRAXAS' : 'The Supreme Law of Criteria'}</h3>
        <p class="card-desc" style="color: #e2e8f0; font-size: 1rem; line-height: 1.6;">
          ${isEs 
            ? 'En ABRAXAS ninguna pieza se publica por inercia. Cada activo debe responder a: 1. Razón de existir, 2. Tesis probada, 3. Deuda narrativa pagada (Hook + Payoff), 4. Evidencia de metrología SHIM 0.00% GAPs y 5. Retorno medible en la Luna Comercial.' 
            : 'In ABRAXAS, no asset is published without justification. Every piece must fulfill: 1. Reason to exist, 2. Proven thesis, 3. Paid narrative debt, 4. 0.00% GAP metrology, and 5. Measurable ROI.'}
        </p>
      </div>
    </div>

    <!-- 1. Los Criterios Sobre-Explicados -->
    <section id="criterios" style="margin-bottom: 4rem;">
      <div class="section-head" style="text-align: left; margin-bottom: 2rem;">
        <span class="tag" style="color: #38bdf8;">01 // COMPENDIO DE CRITERIOS FUNDAMENTALES</span>
        <h2 class="h2" style="font-size: 2rem;">${isEs ? 'Los Principios Inmutables de Producción' : 'Immutable Production Principles'}</h2>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-4" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">CRITERIO 01</span>
          <h4 style="font-size: 1.25rem; color: #fff; margin-bottom: 6px;">Tema ≠ Idea</h4>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">Un tema es una palabra hueca ("productividad"); una idea es una afirmación dialéctica comprobable con mecanismo de acción.</p>
        </div>

        <div class="spotlight-card col-4" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">CRITERIO 02</span>
          <h4 style="font-size: 1.25rem; color: #fff; margin-bottom: 6px;">Deuda & Payoff</h4>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">El gancho promete una revelación específica; el cuerpo y cierre del contenido deben pagar exactamente esa deuda sin rodeos.</p>
        </div>

        <div class="spotlight-card col-4" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">CRITERIO 03</span>
          <h4 style="font-size: 1.25rem; color: #fff; margin-bottom: 6px;">Metrología Da'at (SHIM)</h4>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">La realidad observada manda sobre el plan. Si el audio grabado no coincide con el guion, el activo se bloquea hasta corregirse.</p>
        </div>

        <div class="spotlight-card col-4" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag emerald">CRITERIO 04</span>
          <h4 style="font-size: 1.25rem; color: #fff; margin-bottom: 6px;">Anti-AI-Slop</h4>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">Prohibición de cliches visuales, neones gratuitos y textos genéricos de IA que degradan la percepción de lujo de la marca.</p>
        </div>

        <div class="spotlight-card col-4" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag ruby">CRITERIO 05</span>
          <h4 style="font-size: 1.25rem; color: #fff; margin-bottom: 6px;">Total Production Coach</h4>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">Reglas estrictas para edición, VFX, SFX, música y motion. Si no hay justificación narrativa para un efecto, la directiva es <code>no_sfx_needed</code>.</p>
        </div>

        <div class="spotlight-card col-4" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">CRITERIO 06</span>
          <h4 style="font-size: 1.25rem; color: #fff; margin-bottom: 6px;">Bucle de Doble Luna</h4>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5;">La Luna de Contenido mejora la retención creativa y la Luna Comercial audita la rentabilidad de las ventas en dinero real.</p>
        </div>
      </div>
    </section>

    <!-- 2. Roadmap 2026-2027 -->
    <section id="roadmap" style="margin-bottom: 4rem;">
      <div class="section-head" style="text-align: left; margin-bottom: 2rem;">
        <span class="tag" style="color: #30d158;">02 // MAPA DE RUTA 2026-2027</span>
        <h2 class="h2" style="font-size: 2rem;">${isEs ? 'Hitos Técnicos y Evolución del Sistema' : 'System Roadmap & Milestones'}</h2>
      </div>

      <div class="bento-grid">
        <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag gold">Q3 2026 // ESTADO ACTUAL (LÍNEA BASE VERIFICADA)</span>
          <h4 class="card-h3">Release Candidate 1 (RC1) & Suite Apple MacBook Pro 2026</h4>
          <p class="card-desc">Motor VAV de auto-edición en 18s, 13 familias de motion, metrología SHIM 0.00% GAPs, Luna Comercial con OCR y 37 dossiers canónicos sellados en SHA-256.</p>
        </div>

        <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag cyan">Q4 2026 // FASE SIGUIENTE</span>
          <h4 class="card-h3">Integración Nativa Metal GPU & Modelos Locales M-Series</h4>
          <p class="card-desc">Inferencia de LLM local offline en Apple Neural Engine con latencia sub-10ms y composición de shaders 3D nativos en Swift.</p>
        </div>

        <div class="spotlight-card col-12" style="position: relative;">
        <button class="card-expand-btn" title="Expandir">+</button>
          <span class="card-pill-tag iris">Q1-Q2 2027 // EXPANSIÓN INDUSTRIAL</span>
          <h4 class="card-h3">Autonomía Multi-Empresa & Despliegue de Nodos Distribuidos</h4>
          <p class="card-desc">Sincronización P2P criptográfica entre estaciones de trabajo Mac Studio sin depender de servidores centrales.</p>
        </div>
      </div>
    </section>

  </main>

  ${getUniversalFooter(locale, depth)}
  ${getUniversalWidgets(locale, depth)}

  
  <script>
    // OCR Simulate Button — Adds real new row to the ledger
    let ocrCounter = 0;
    const sampleProducts = [
      { name: 'reel_nuevo_autoridad', format: 'Video 9:16 (Reels)', canal: 'WhatsApp Inbound', units: Math.floor(Math.random()*40+5), price: Math.floor(Math.random()*200+50) },
      { name: 'carousel_coaching_pro', format: 'Carrusel 4:5 (IG)', canal: 'Instagram DM', units: Math.floor(Math.random()*25+3), price: Math.floor(Math.random()*150+80) },
      { name: 'hilo_caso_exito', format: 'Hilo X / LinkedIn', canal: 'LinkedIn Inbound', units: Math.floor(Math.random()*10+1), price: Math.floor(Math.random()*500+200) },
      { name: 'newsletter_especial', format: 'Newsletter Email', canal: 'Substack Referral', units: Math.floor(Math.random()*15+2), price: Math.floor(Math.random()*120+40) },
      { name: 'youtube_manifiesto', format: 'YouTube 16:9', canal: 'Búsqueda Orgánica', units: Math.floor(Math.random()*8+1), price: Math.floor(Math.random()*800+300) },
      { name: 'podcast_entrevista', format: 'Micro-Podcast', canal: 'Spotify Link', units: Math.floor(Math.random()*12+2), price: Math.floor(Math.random()*100+30) }
    ];
    
    document.getElementById('btn-simulate-ocr')?.addEventListener('click', function() {
      ocrCounter++;
      const sample = sampleProducts[ocrCounter % sampleProducts.length];
      const units = Math.floor(Math.random()*40+5);
      const unitPrice = Math.floor(Math.random()*200+50);
      const total = units * unitPrice;
      const roi = Math.floor(Math.random()*2000+200);
      const tbody = document.getElementById('ocr-live-ledger-body');
      if (!tbody) return;
      
      const newRow = document.createElement('tr');
      newRow.style.cssText = 'border-bottom: 1px solid rgba(255,255,255,0.06); color: #e2e8f0; animation: fadeIn 0.5s ease;';
      newRow.innerHTML = [
        "<td style=\"padding: 14px;\"><span style=\"color: #38bdf8;\">" + sample.name + "_" + String(ocrCounter).padStart(2, "0") + "</span></td>" +
        "<td>" + sample.format + "</td>" +
        "<td>" + sample.canal + "</td>" +
        "<td><strong>" + units + " artículos</strong></td>" +
        "<td><strong style=\"color: #30d158;\">$" + total.toLocaleString() + ".00</strong></td>" +
        "<td><span style=\"color: #fef08a; background: rgba(212,175,55,0.15); padding: 2px 6px; border-radius: 4px;\">+" + roi + "%</span></td>" +
        "<td><span style=\"color: #30d158;\">● Nuevo (OCR)</span></td>"
      ].join("");
      tbody.insertBefore(newRow, tbody.firstChild);
      
      // Flash animation
      newRow.style.background = 'rgba(48,209,88,0.15)';
      setTimeout(() => { newRow.style.background = 'transparent'; newRow.style.transition = 'background 1s ease'; }, 1500);
      
      // Update summary if exists
      const summaryEl = document.getElementById('ocr-total-summary');
      if (summaryEl) {
        const currentTotal = parseInt(summaryEl.dataset.total || '22610');
        const newTotal = currentTotal + total;
        summaryEl.dataset.total = newTotal;
        summaryEl.textContent = '$' + newTotal.toLocaleString() + '.00';
      }
    });
  </script>
  <script src="${root}assets/abraxas-engine-v3.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`[Commercial Moon Suite] Generated /${locale}/criterios-roadmap/index.html`);
}

function compileCommercialMoonSuite() {
  ['es', 'en'].forEach(locale => {
    generateLunaComercialPage(locale);
    generateBrandingMethodPage(locale);
    generateAbraxasCoreExamplePage(locale);
    generateCriteriosRoadmapPage(locale);
  });
  console.log('✨ [Commercial Moon Suite] All sales moon, branding method, abraxas core example, and criteria roadmap pages compiled successfully!');
}

compileCommercialMoonSuite();
