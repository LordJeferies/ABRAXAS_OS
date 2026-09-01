import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');
const docsDir = path.resolve(rootDir, 'docs/abraxas-os-status');

// Ingest canonical datasets
const bilingualPath = path.resolve(__dirname, '../src/data/canonical-knowledge-bilingual.json');
const corpusPath = path.resolve(__dirname, '../src/data/canonical-corpus-files.json');

const bilingualData = JSON.parse(fs.readFileSync(bilingualPath, 'utf-8'));
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

const fileSummaries = {
  "00_LEEME_PRIMERO": {
    es: "El Checksum Conceptual. Establece la ley anti-confusión: El Árbol describe qué le pasa al Contenido (estados); los 13 Módulos describen qué hace ABRAXAS (verbos).",
    en: "Conceptual Checksum. Defines the anti-confusion law: Tree describes what happens to Content (states); Modules describe what ABRAXAS does (verbs)."
  },
  "01_CAPAS_HISTORICAS_Y_METODO": {
    es: "Diferenciación rigurosa de fuentes: Cábala Judía (Luria/Cordovero), Cristiana (Reuchlin), Hermética (Dion Fortune) y síntesis propia de software.",
    en: "Rigorous source differentiation: Jewish Kabbalah, Christian Cabala, Hermetic Qabalah (Dion Fortune), and ABRAXAS software synthesis."
  },
  "02_CUATRO_MUNDOS_Y_TETRAGRAMATON": {
    es: "Los 4 Mundos como grados de condensación: Atziluth (Emanación/YOD), Beri'ah (Creación/HE I), Yetzirah (Formación/VAV), Assiah (Acción/HE II).",
    en: "The Four Worlds as data condensation grades: Atziluth (Emanation), Beri'ah (Creation), Yetzirah (Formation), Assiah (Action/Media)."
  },
  "03_ARBOL_SEFIROT_PILARES_PATHS": {
    es: "Las 10 Sefirot y 22 Senderos como red de enrutamiento y balance entre Expansión (Chesed) y Restricción (Gevurah).",
    en: "The 10 Sephirot and 22 Paths as routing topology and dialectic balance between Expansion (Chesed) and Restriction (Gevurah)."
  },
  "04_DAAT_ABISMO_SHIM": {
    es: "Da'at como umbral de metrología lúcida. SHIM verifica que lo grabado coincida con lo planeado (0.00% GAPs).",
    en: "Da'at as awakened metrology threshold. SHIM verifies recorded media against planned script with 0.00% GAPs."
  },
  "05_YHSHVH_SHIN_CABALA_CRISTIANA": {
    es: "El Pentagramatón YHSHVH: inserción del fuego de Shin (ש) en el cuerpo físico, materializado en el sellado inmutable CAS SHA-256.",
    en: "The Pentagrammaton YHSHVH: inserting Shin flame into physical form, materialized via immutable CAS SHA-256 sealing."
  },
  "06_DION_FORTUNE_QABALAH_OCCIDENTAL": {
    es: "Traducción de correspondencias planetarias a esquemas relacionales JSON-Schema, índices SQL y auditoría de software.",
    en: "Translating planetary glyphs into relational JSON-Schema tables, SQLite indexes, and auditable production telemetry."
  },
  "07_XYZA_STATE_SPACE": {
    es: "El hiperespacio 4D: Polaridad X, Manifestación Y, Contexto Z y la meta-dimensión A (Memoria cognitiva acumulada).",
    en: "The 4D state-space: Polarity X, Manifestation Y, Context Z, and meta-dimension A (Adaptive Intelligence & Lineage)."
  },
  "08_MODULOS_MUNDOS_OPERADORES": {
    es: "Definición de los 13 operadores de software (YOD, HE, SHIM, VAV, ARQUITECTO, etc.) y su dominio funcional.",
    en: "Definition of the 13 software operators (YOD, HE, SHIM, VAV, ARQUITECTO, etc.) and their functional operational domains."
  },
  "09_CONTENIDO_CRISTAL_CONTINUITY_AXIS": {
    es: "Identidad persistente de pieza única: Merkle-DAG sobre SHA-256 anclado al Eje de Continuidad vertical.",
    en: "Single-piece persistent identity: Merkle-DAG over SHA-256 anchored to the vertical sapphire Continuity Axis."
  },
  "10_ATZILUTH_CAMARA_DORADA": {
    es: "Cámara de emanación pura donde se definen las tesis y los axiomas de marca inmutables.",
    en: "Pure emanation chamber defining thesis and unshakeable brand voice axioms prior to project instantiation."
  },
  "11_ARQUITECTO_SOL_OJO_LUNA": {
    es: "La tríada de observabilidad: Sol Primordial (potencial), Ojo de la Pirámide (telemetría en vivo) y Luna (retorno telemétrico).",
    en: "The observability triad: Primordial Sun (potential), Pyramid Eye (live telemetry), and Moon (telemetric return)."
  },
  "12_DIMENSION_A_MEMORIA_CRITERIO_OPTIMIZACION": {
    es: "La ecuación de aprendizaje: S(t+1) = S(t) + A(t). Memoria de linaje, procedencia forense y optimización de ganchos.",
    en: "The learning equation: S(t+1) = S(t) + A(t). Lineage memory, forensic provenance, and automated hook refinement."
  },
  "13_FLUJO_COMPLETO_EJEMPLOS": {
    es: "Casos de uso reales de extremo a extremo desde el radar de nicho hasta la exportación y análisis de retención.",
    en: "End-to-end real production walkthroughs from niche radar to multi-channel batch export and retention analysis."
  },
  "14_ARQUITECTURA_ESPACIAL_FISICA": {
    es: "Dimensiones físicas y geometría del monumento piramidal de basalto (base 500m, pendiente 51.8487°).",
    en: "Physical geometry and layout of the 500m basalt monument (slope 51.8487°, 4 physical stepped world tiers)."
  },
  "15_REGLAS_CANONICAS_ANTI_CONFUSION": {
    es: "Axiomas inmutables de producto: Verdad de producto por encima de belleza simbólica. Cero alucinaciones.",
    en: "Unshakeable product axioms: Product truth above symbolic elegance. Zero hallucination tolerance."
  },
  "16_GLOSARIO": {
    es: "Definiciones exactas de todos los términos técnicos y ontológicos de ABRAXAS OS.",
    en: "Exact definitions for all technical and ontological terms across ABRAXAS OS."
  },
  "17_FUENTES_Y_BIBLIOGRAFIA": {
    es: "Bibliografía académica e histórica completa que fundamenta la arquitectura simbólica.",
    en: "Complete academic, historical, and mathematical bibliography underpinning the symbolic architecture."
  },
  "18_CONTEXTO_CORTO_PARA_OTROS_CHATS": {
    es: "Resumen ejecutivo ultracompacto para transferir contexto a otros modelos o desarrolladores.",
    en: "Ultra-compact executive prompt packet to bootstrap new AI models and engineering sessions."
  },
  "19_MAPAS_ASCII": {
    es: "Diagramas topológicos y mapas de flujo en texto ASCII para inspección rápida.",
    en: "Topology diagrams, tree cutaways, and ASCII state-space maps for fast terminal inspection."
  },
  "20_SISTEMA_MOTION_100_KEYFRAMES": {
    es: "El sistema de 10 secuencias x 10 keyframes con encadenamiento causal estricto para eliminar el drift de IA.",
    en: "The 10 sequences x 10 keyframes system with strict causal chaining to eliminate AI generative drift."
  },
  "21_PROMPTS_SEQ01_MASTER_HERO_ORIGIN": {
    es: "10 prompts cinematográficos para la Secuencia 01: El Sol Primordial, el Ojo y el Descenso a Atziluth.",
    en: "10 cinematic prompts for Sequence 01: Primordial Sun, Eye, and Atziluth golden emanation chamber."
  },
  "22_PROMPTS_SEQ02_EXTERIOR_CLOSED_LOOP": {
    es: "10 prompts cinematográficos para la Secuencia 02: El Bucle Exterior, la Luna y las Ondas Telemétricas.",
    en: "10 cinematic prompts for Sequence 02: Exterior Closed Loop, Celestial Moon, and Telemetric Waves."
  },
  "23_PROMPTS_SEQ03_EDITORIAL_INGRESS_BERIAH": {
    es: "10 prompts cinematográficos para la Secuencia 03: Ingreso Editorial a Beri'ah y el Eje de Continuidad.",
    en: "10 cinematic prompts for Sequence 03: Editorial Ingress to Beri'ah and Sapphire Continuity Axis."
  },
  "24_PROMPTS_SEQ04_CUTAWAY_FOUR_WORLDS_TREE": {
    es: "10 prompts cinematográficos para la Secuencia 04: Corte transversal del Árbol de la Vida y las Cámaras.",
    en: "10 cinematic prompts for Sequence 04: Architectural cutaway of the Tree of Life chambers."
  },
  "25_PROMPTS_SEQ05_SHIM_DAAT_METROLOGY": {
    es: "10 prompts cinematográficos para la Secuencia 05: El Umbral de Da'at, la Amatista Negra y el Escáner SHIM.",
    en: "10 cinematic prompts for Sequence 05: Da'at Threshold, Black Amethyst, and SHIM Metrology Scanner."
  },
  "26_PROMPTS_SEQ06_VAV_YETZIRAH_PRODUCTION": {
    es: "10 prompts cinematográficos para la Secuencia 06: La Catedral de Síntesis VAV y los 3 Rieles Industriales.",
    en: "10 cinematic prompts for Sequence 06: VAV Synthesis Cathedral, 3 Industrial Rails, and Gold Typography."
  },
  "27_PROMPTS_SEQ07_OPTICAL_PORT_ARQUITECTO_A": {
    es: "10 prompts cinematográficos para la Secuencia 07: El Puerto Óptico, la Inspección XYZA y la Estratigrafía.",
    en: "10 cinematic prompts for Sequence 07: Optical Port, XYZA Volumetric Matrix, and Stratigraphy."
  },
  "28_PROMPTS_SEQ08_HE_ASSIAH_OPERATIONS": {
    es: "10 prompts cinematográficos para la Secuencia 08: El Despacho de Basalto de HE y el Silicio M-Series.",
    en: "10 cinematic prompts for Sequence 08: HE Basalt Operations Desk and Apple Silicon hardware clusters."
  },
  "29_PROMPTS_SEQ09_DASHBOARD_XYZA_AWARE": {
    es: "10 prompts cinematográficos para la Secuencia 09: El Dashboard Táctico sin UI Ocultista.",
    en: "10 cinematic prompts for Sequence 09: Tactical System Dashboard and Live Hardware Telemetry HUD."
  },
  "30_PROMPTS_SEQ10_MOON_METRICS_A_HELIX": {
    es: "10 prompts cinematográficos para la Secuencia 10: La Hélice de Aprendizaje y el Retorno Infinito a YOD.",
    en: "10 cinematic prompts for Sequence 10: Closed-Loop Moon Return Helix and YOD re-ignition."
  },
  "31_MAPA_NARRATIVO_100_IMAGENES": {
    es: "El storyboard director de arte para interpolación de scroll, transiciones Three.js y parallax.",
    en: "Art direction storyboard for continuous scroll interpolation, Three.js transitions, and parallax."
  },
  "32_QA_100_IMAGENES": {
    es: "Protocolo de control de calidad fotográfica: lentes 65mm, cero estética cyberpunk y consistencia de basalto.",
    en: "Photographic QA protocol: 65mm anamorphic lenses, anti-cyberpunk slop, and basalt consistency."
  },
  "33_COMO_USAR_LOS_PROMPTS": {
    es: "Manual operativo para generar imágenes consistentes en Midjourney v6 y generadores de video.",
    en: "Operational manual to generate high-coherence visual assets in Midjourney v6 and video models."
  },
  "34_MASTER_100_IMAGE_PROMPTS_ALL_IN_ONE": {
    es: "Compendio maestro consolidado de 285KB con todos los 100 prompts organizados en un solo archivo.",
    en: "Consolidated 285KB master compendium with all 100 cinematic prompts in one file."
  },
  "35_INDICE_DE_ARCHIVOS": {
    es: "Índice de navegación y estructura de carpetas del paquete de prompts.",
    en: "Navigation directory and folder hierarchy of the prompt package."
  },
  "36_SHA256_MANIFEST": {
    es: "Registro de firmas criptográficas SHA-256 de cada archivo para garantizar inmutabilidad.",
    en: "Cryptographic SHA-256 provenance manifest certifying file integrity and immutability."
  }
};

console.log('[Apple Builder] Ingested canonical database & 37 dossiers.');
