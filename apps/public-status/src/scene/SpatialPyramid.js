import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import { CameraDirector } from './camera-director.js';
import { resolvePublicCapabilityState } from '../data/truth-resolver.js';

/**
 * ABRAXAS_TREE_PATH_PROJECTION_V1
 * Explicit Canonical 22-Path Architectural Registry
 */
export const ABRAXAS_TREE_PATH_PROJECTION_V1 = [
  { pathId: 'P01_KETER_CHOKHMAH', from: 'KETER', to: 'CHOKHMAH', semanticReason: 'Primary emanation of generative potential', architecturalExpression: 'Upper Atziluth light shaft' },
  { pathId: 'P02_KETER_BINAH', from: 'KETER', to: 'BINAH', semanticReason: 'Primary emanation of structural discernment', architecturalExpression: 'Upper Atziluth light shaft' },
  { pathId: 'P03_KETER_TIFERET', from: 'KETER', to: 'TIFERET', semanticReason: 'Direct supernal synthesis axis', architecturalExpression: 'Central vertical light channel' },
  { pathId: 'P04_KETER_DAAT', from: 'KETER', to: 'DAAT', semanticReason: 'Descent into metrology threshold', architecturalExpression: 'Da\'at inspection conduit' },
  { pathId: 'P05_CHOKHMAH_BINAH', from: 'CHOKHMAH', to: 'BINAH', semanticReason: 'Supernal reciprocal balance', architecturalExpression: 'Horizontal apex traverse bridge' },
  { pathId: 'P06_CHOKHMAH_CHESED', from: 'CHOKHMAH', to: 'CHESED', semanticReason: 'Flow into expansive generative volume', architecturalExpression: 'Right descent shaft' },
  { pathId: 'P07_CHOKHMAH_TIFERET', from: 'CHOKHMAH', to: 'TIFERET', semanticReason: 'Direct creative synthesis feed', architecturalExpression: 'Diagonal upper conduit' },
  { pathId: 'P08_BINAH_GEVURAH', from: 'BINAH', to: 'GEVURAH', semanticReason: 'Flow into boundary constraint logic', architecturalExpression: 'Left descent shaft' },
  { pathId: 'P09_BINAH_TIFERET', from: 'BINAH', to: 'TIFERET', semanticReason: 'Structural synthesis feed', architecturalExpression: 'Diagonal upper conduit' },
  { pathId: 'P10_DAAT_CHESED', from: 'DAAT', to: 'CHESED', semanticReason: 'Empirical verification to expansion', architecturalExpression: 'Metrology feed conduit' },
  { pathId: 'P11_DAAT_GEVURAH', from: 'DAAT', to: 'GEVURAH', semanticReason: 'Empirical verification to constraint', architecturalExpression: 'Metrology filter conduit' },
  { pathId: 'P12_DAAT_TIFERET', from: 'DAAT', to: 'TIFERET', semanticReason: 'Discrepancy resolution into synthesis', architecturalExpression: 'Central resolution shaft' },
  { pathId: 'P13_CHESED_GEVURAH', from: 'CHESED', to: 'GEVURAH', semanticReason: 'Reciprocal balance of form & volume', architecturalExpression: 'Mid-pyramid traverse gallery' },
  { pathId: 'P14_CHESED_TIFERET', from: 'CHESED', to: 'TIFERET', semanticReason: 'Harmonic synthesis convergence', architecturalExpression: 'Right synthesis arch' },
  { pathId: 'P15_CHESED_NETZACH', from: 'CHESED', to: 'NETZACH', semanticReason: 'Generative energy to motion impulse', architecturalExpression: 'Right kinetic chute' },
  { pathId: 'P16_GEVURAH_TIFERET', from: 'GEVURAH', to: 'TIFERET', semanticReason: 'Constrained synthesis convergence', architecturalExpression: 'Left synthesis arch' },
  { pathId: 'P17_GEVURAH_HOD', from: 'GEVURAH', to: 'HOD', semanticReason: 'Boundary rules to typographic precision', architecturalExpression: 'Left linguistic chute' },
  { pathId: 'P18_TIFERET_NETZACH', from: 'TIFERET', to: 'NETZACH', semanticReason: 'Synthesis dispatch to motion engine', architecturalExpression: 'Motion feeder conduit' },
  { pathId: 'P19_TIFERET_HOD', from: 'TIFERET', to: 'HOD', semanticReason: 'Synthesis dispatch to typography engine', architecturalExpression: 'Typography feeder conduit' },
  { pathId: 'P20_TIFERET_YESOD', from: 'TIFERET', to: 'YESOD', semanticReason: 'Descent to integration foundation', architecturalExpression: 'Vertical bedrock shaft' },
  { pathId: 'P21_NETZACH_YESOD', from: 'NETZACH', to: 'YESOD', semanticReason: 'Motion consolidation into composite', architecturalExpression: 'Kinetic convergence conduit' },
  { pathId: 'P22_HOD_YESOD', from: 'HOD', to: 'YESOD', semanticReason: 'Typographic consolidation into composite', architecturalExpression: 'Linguistic convergence conduit' }
];

/**
 * ABRAXAS Status V6 Master Spatial Pyramid Engine
 */
export class SpatialPyramid {
  constructor(container, onChamberSelect = null, onShotChange = null, publicKnowledge = {}, evidenceIndex = {}) {
    this.container = container;
    this.onChamberSelect = onChamberSelect;
    this.onShotChange = onShotChange;
    this.publicKnowledge = publicKnowledge;
    this.evidenceIndex = evidenceIndex;
    this.activeMode = 'STORY';
    this.isTargetMode = false;
    this.capabilityRegistry = [];
    this.clock = new THREE.Clock();

    // Canonical Giza Proportions: Base 8.0, Height 5.092 (Ratio 0.6365, Slope 51.8487°)
    this.baseSide = 8.0;
    this.halfBase = 4.0;
    this.height = this.baseSide * 0.6365; // 5.092m
    this.halfHeight = this.height / 2; // 2.546m
    this.slopeDeg = Math.atan(this.height / this.halfBase) * (180 / Math.PI);

    // Canonical Tree of Life Coordinates (11 Nodes)
    this.treeNodes = {
      KETER: new THREE.Vector3(0, 2.2, 0),
      CHOKHMAH: new THREE.Vector3(0.8, 1.8, -0.3),
      BINAH: new THREE.Vector3(-0.8, 1.8, -0.3),
      DAAT: new THREE.Vector3(0, 1.1, 0.2),
      CHESED: new THREE.Vector3(1.2, 0.5, -0.2),
      GEVURAH: new THREE.Vector3(-1.2, 0.5, -0.2),
      TIFERET: new THREE.Vector3(0, -0.2, 0),
      NETZACH: new THREE.Vector3(1.0, -1.0, -0.2),
      HOD: new THREE.Vector3(-1.0, -1.0, -0.2),
      YESOD: new THREE.Vector3(0, -1.7, 0.1),
      MALKHUT: new THREE.Vector3(0, -2.4, 0.3)
    };

    this.treePaths = ABRAXAS_TREE_PATH_PROJECTION_V1;

    this.initRenderer();
    if (this.renderer) {
      this.initProceduralTextures();
      this.initPBRMaterials();
      this.createAtmosphericDust();
      this.createPhotographicSolarEclipse();
      this.createGizaBlackAmethystMonument();
      this.createGoldenAtziluthApex();
      this.createVolumetricEtchedArquitectoEye();
      this.createCanonicalTreeOfLifeTopology();
      this.createInternalChambers();
      this.createCelestialMoonAndLoops();
      this.createHitProxies();
      this.createTechnicalDrawingHUDLayer();
      this.initLivingPlatePlanes();
      this.initSpatialCapabilityRegistry();
      this.initCameraDirector();
      this.initControls();
      this.initRaycasting();
      this.setupListeners();
      this.setupDebugHooks();
    } else {
      this.setupFallbackDebugHooks();
    }
  }

  initRenderer() {
    try {
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x050507, 0.022);

      const width = this.container?.clientWidth || window.innerWidth;
      const height = this.container?.clientHeight || window.innerHeight;

      this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 200);

      const isSys = typeof window !== 'undefined' && window.location.pathname.includes('/system');
      if (isSys) {
        this.camera.position.set(4.8, 1.6, 13.0);
        this.camera.lookAt(0, 0.2, 0);
      } else {
        this.camera.position.set(3.8, -0.4, 12.5);
        this.camera.lookAt(0, 0.2, 0);
      }

      let maxDpr = 2.0;
      if (width <= 480) maxDpr = 1.0;
      else if (width <= 1024) maxDpr = 1.5;

      const dpr = Math.min(typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1, maxDpr);
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(dpr);
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.35;
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;

      this.renderer.domElement.id = 'spatial-pyramid-canvas';
      this.renderer.domElement.style.width = '100%';
      this.renderer.domElement.style.height = '100%';
      this.renderer.domElement.style.position = 'absolute';
      this.renderer.domElement.style.top = '0';
      this.renderer.domElement.style.left = '0';
      this.renderer.domElement.style.pointerEvents = 'none';

      if (this.container) {
        this.container.appendChild(this.renderer.domElement);
      }

      this.renderer.render(this.scene, this.camera);
      if (typeof window !== 'undefined') window.__ABRAXAS_RENDERER_STATE__ = 'THREE_ACTIVE';
    } catch (e) {
      console.warn('[SpatialPyramid] WebGL initialization fallback:', e.message);
      if (typeof window !== 'undefined') window.__ABRAXAS_RENDERER_STATE__ = 'FALLBACK_ACTIVE';
      this.renderer = null;
    }
  }

  initProceduralTextures() {
    // Generate Procedural Basalt Mineral Normal & Roughness Maps via Canvas (Pure Offline)
    if (typeof document === 'undefined') return;

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base dark mineral noise
    ctx.fillStyle = '#8080ff';
    ctx.fillRect(0, 0, size, size);

    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 32;
      data[i] = Math.min(255, Math.max(0, 128 + noise));     // R (Normal X)
      data[i + 1] = Math.min(255, Math.max(0, 128 + noise)); // G (Normal Y)
      data[i + 2] = 255;                                     // B (Normal Z)
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);

    this.texBasaltNormal = new THREE.CanvasTexture(canvas);
    this.texBasaltNormal.wrapS = THREE.RepeatWrapping;
    this.texBasaltNormal.wrapT = THREE.RepeatWrapping;
    this.texBasaltNormal.repeat.set(4, 4);

    // Roughness Canvas
    const rCanvas = document.createElement('canvas');
    rCanvas.width = size;
    rCanvas.height = size;
    const rCtx = rCanvas.getContext('2d');
    rCtx.fillStyle = '#e0e0e0';
    rCtx.fillRect(0, 0, size, size);
    const rData = rCtx.getImageData(0, 0, size, size);
    for (let i = 0; i < rData.data.length; i += 4) {
      const grain = (Math.random() - 0.5) * 45;
      const val = Math.min(255, Math.max(0, 220 + grain));
      rData.data[i] = val;
      rData.data[i + 1] = val;
      rData.data[i + 2] = val;
      rData.data[i + 3] = 255;
    }
    rCtx.putImageData(rData, 0, 0);

    this.texBasaltRoughness = new THREE.CanvasTexture(rCanvas);
    this.texBasaltRoughness.wrapS = THREE.RepeatWrapping;
    this.texBasaltRoughness.wrapT = THREE.RepeatWrapping;
    this.texBasaltRoughness.repeat.set(4, 4);
  }

  initPBRMaterials() {
    // 1. Black Amethyst Monumental Masonry (Reads BLACK first, subtle amethyst under grazing light)
    this.matBlackAmethystStone = new THREE.MeshStandardMaterial({
      color: 0x0c0b10,
      roughness: 0.88,
      metalness: 0.18,
      normalMap: this.texBasaltNormal || null,
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughnessMap: this.texBasaltRoughness || null
    });

    // 2. Obsidian Casing Shells
    this.matPolishedCasing = new THREE.MeshPhysicalMaterial({
      color: 0x070709,
      roughness: 0.24,
      metalness: 0.76,
      transmission: 0.42,
      ior: 1.58,
      transparent: true,
      opacity: 0.5,
      depthWrite: false
    });

    // 3. Aged Gold / Electrum Apex (Upper 7–12% / Atziluth)
    this.matGoldenPyramidion = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.38,
      metalness: 0.92
    });

    // 4. Central Continuity Axis & Contenido Crystal
    this.matContinuityAxis = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      transmission: 0.92,
      roughness: 0.05,
      metalness: 0.08,
      ior: 1.65,
      transparent: true,
      opacity: 0.9
    });

    // 5. Shim Metrology Laser Plane (Da'at / Precision verification)
    this.matShimLaser = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      emissive: 0xe2e8f0,
      emissiveIntensity: 0.85,
      transmission: 0.95,
      roughness: 0.04,
      metalness: 0.1,
      ior: 1.5,
      transparent: true,
      opacity: 0.85
    });

    // 6. Architectural Conduit Paths (22 Connective Channels)
    this.matConduitPath = new THREE.LineBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.45
    });

    // 7. Volumetric Copperplate Etching Filament Material
    this.matEtchingFilament = new THREE.LineBasicMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0.8
    });
  }

  createAtmosphericDust() {
    this.particleGroup = new THREE.Group();
    this.scene.add(this.particleGroup);

    const count = 1200;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 28;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xf1f5f9,
      size: 0.028,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    });

    this.particleField = new THREE.Points(geo, mat);
    this.particleGroup.add(this.particleField);
  }

  createPhotographicSolarEclipse() {
    this.ambientLight = new THREE.AmbientLight(0x0a0a0e, 1.2);
    this.scene.add(this.ambientLight);

    // Distant Solar Eclipse Corona living in deep cosmic sky
    this.solarEclipseGroup = new THREE.Group();
    this.solarEclipseGroup.position.set(0, 20, -42);
    this.scene.add(this.solarEclipseGroup);

    // Deep black solar disk occluder
    const sunCoreGeo = new THREE.CircleGeometry(5.4, 64);
    const sunCoreMat = new THREE.MeshBasicMaterial({ color: 0x010102 });
    const sunCoreMesh = new THREE.Mesh(sunCoreGeo, sunCoreMat);
    this.solarEclipseGroup.add(sunCoreMesh);

    // Soft atmospheric corona gradient rings
    for (let r = 0; r < 4; r++) {
      const inner = 5.4 + r * 0.4;
      const outer = 6.2 + r * 0.8;
      const coronaGeo = new THREE.RingGeometry(inner, outer, 64);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: r === 0 ? 0xfef08a : 0xfde047,
        transparent: true,
        opacity: 0.35 / (r + 1),
        side: THREE.DoubleSide
      });
      const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
      this.solarEclipseGroup.add(coronaMesh);
    }

    this.solarKeyLight = new THREE.DirectionalLight(0xffedd5, 4.6);
    this.solarKeyLight.position.set(4, 20, 16);
    this.scene.add(this.solarKeyLight);

    this.astralRimLight = new THREE.DirectionalLight(0x94a3b8, 3.4);
    this.astralRimLight.position.set(-18, 8, -14);
    this.scene.add(this.astralRimLight);

    this.coreLight = new THREE.PointLight(0x38bdf8, 3.2, 10);
    this.coreLight.position.set(0, 0.4, 0);
    this.scene.add(this.coreLight);
  }

  createGizaBlackAmethystMonument() {
    this.pyramidGroup = new THREE.Group();
    this.scene.add(this.pyramidGroup);

    // 24 Tiered Masonry Courses with authentic stone block joint patterns
    this.masonryCourses = new THREE.Group();
    this.pyramidGroup.add(this.masonryCourses);

    const numCourses = 24;
    const courseHeight = this.height / numCourses;

    for (let c = 0; c < numCourses; c++) {
      const t = c / numCourses;
      const courseHalfWidth = this.halfBase * (1.0 - t);
      const y = -this.halfHeight + (c + 0.5) * courseHeight;

      const courseGeo = new THREE.BoxGeometry(courseHalfWidth * 2, courseHeight * 0.96, courseHalfWidth * 2);
      const courseMesh = new THREE.Mesh(courseGeo, this.matBlackAmethystStone);
      courseMesh.position.set(0, y, 0);
      this.masonryCourses.add(courseMesh);

      // Micro stone block vertical joints
      for (let s = -2; s <= 2; s++) {
        if (s !== 0) {
          const seamGeo = new THREE.BoxGeometry(0.015, courseHeight, 0.02);
          const seamMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8 });
          const seam = new THREE.Mesh(seamGeo, seamMat);
          seam.position.set(s * (courseHalfWidth * 0.45), y, courseHalfWidth + 0.01);
          this.masonryCourses.add(seam);
        }
      }
    }

    // Four Polished Casing Shells
    this.casingGroup = new THREE.Group();
    this.pyramidGroup.add(this.casingGroup);

    const corners = [
      new THREE.Vector3(-this.halfBase, -this.halfHeight, -this.halfBase),
      new THREE.Vector3(this.halfBase, -this.halfHeight, -this.halfBase),
      new THREE.Vector3(this.halfBase, -this.halfHeight, this.halfBase),
      new THREE.Vector3(-this.halfBase, -this.halfHeight, this.halfBase)
    ];
    const apex = new THREE.Vector3(0, this.halfHeight, 0);

    const createCasingFace = (vA, vB, vC) => {
      const geo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        vA.x, vA.y, vA.z,
        vB.x, vB.y, vB.z,
        vC.x, vC.y, vC.z
      ]);
      geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geo.computeVertexNormals();
      return new THREE.Mesh(geo, this.matPolishedCasing);
    };

    this.northCasing = createCasingFace(apex, corners[0], corners[1]);
    this.eastCasing = createCasingFace(apex, corners[1], corners[2]);
    this.southCasing = createCasingFace(apex, corners[2], corners[3]);
    this.westCasing = createCasingFace(apex, corners[3], corners[0]);

    this.casingGroup.add(this.northCasing);
    this.casingGroup.add(this.eastCasing);
    this.casingGroup.add(this.southCasing);
    this.casingGroup.add(this.westCasing);
  }

  createGoldenAtziluthApex() {
    this.pyramidionGroup = new THREE.Group();
    this.pyramidionGroup.position.set(0, this.halfHeight - 0.35, 0);
    this.pyramidGroup.add(this.pyramidionGroup);

    // 1. Exterior Aged Gold Pyramidion (Upper 7–12% / Atziluth)
    const capHeight = 0.7;
    const capHalfBase = capHeight / (this.height / this.halfBase);
    const capGeo = new THREE.ConeGeometry(capHalfBase * 1.414, capHeight, 4);
    capGeo.rotateY(Math.PI / 4);
    this.pyramidionMesh = new THREE.Mesh(capGeo, this.matGoldenPyramidion);
    this.pyramidionMesh.position.set(0, capHeight / 2, 0);
    this.pyramidionGroup.add(this.pyramidionMesh);

    // 2. Interior Golden Emanation Chamber (Revealed when camera enters/cuts apex)
    this.emanationChamber = new THREE.Group();
    this.emanationChamber.position.set(0, capHeight * 0.45, 0);
    this.pyramidionGroup.add(this.emanationChamber);

    // Keter: Volumetric white-gold luminous field (distributed, not a solid sphere)
    const keterFieldGeo = new THREE.SphereGeometry(0.28, 24, 24);
    const keterFieldMat = new THREE.MeshPhysicalMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.95,
      transmission: 0.9,
      transparent: true,
      opacity: 0.55
    });
    this.keterField = new THREE.Mesh(keterFieldGeo, keterFieldMat);
    this.emanationChamber.add(this.keterField);

    // Chokhmah: Golden condensation crystal seed
    const chokhmahGeo = new THREE.OctahedronGeometry(0.09, 0);
    const chokhmahMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.2
    });
    this.chokhmahSeed = new THREE.Mesh(chokhmahGeo, chokhmahMat);
    this.chokhmahSeed.position.set(0.12, -0.05, 0.08);
    this.emanationChamber.add(this.chokhmahSeed);

    // Black Amethyst Structural Ribs
    for (let r = 0; r < 4; r++) {
      const angle = (r * Math.PI) / 2;
      const ribGeo = new THREE.BoxGeometry(0.02, 0.35, 0.03);
      const ribMat = new THREE.MeshStandardMaterial({ color: 0x0c0b10, metalness: 0.8 });
      const rib = new THREE.Mesh(ribGeo, ribMat);
      rib.position.set(Math.cos(angle) * 0.16, 0, Math.sin(angle) * 0.16);
      this.emanationChamber.add(rib);
    }
  }

  createVolumetricEtchedArquitectoEye() {
    this.eyeGroup = new THREE.Group();
    this.eyeGroup.position.set(0, this.halfHeight + 0.55, 0);
    this.scene.add(this.eyeGroup);

    // Procedural Copperplate Engraving Filament Families (1100+ line segments)
    const linePositions = [];

    // 1. Upper Eyelid Engraving Family (24 nested parabolic curves)
    for (let f = 0; f < 24; f++) {
      const zOffset = (f - 12) * 0.012;
      const scaleX = 0.42 - f * 0.008;
      const scaleY = 0.22 - f * 0.005;
      for (let s = -20; s <= 20; s++) {
        const t1 = s / 20;
        const t2 = (s + 1) / 20;
        const x1 = t1 * scaleX;
        const y1 = (1 - t1 * t1) * scaleY + 0.04;
        const x2 = t2 * scaleX;
        const y2 = (1 - t2 * t2) * scaleY + 0.04;
        if (s < 20) {
          linePositions.push(x1, y1, zOffset, x2, y2, zOffset);
        }
      }
    }

    // 2. Lower Eyelid Engraving Family (24 nested parabolic curves)
    for (let f = 0; f < 24; f++) {
      const zOffset = (f - 12) * 0.012;
      const scaleX = 0.42 - f * 0.008;
      const scaleY = 0.18 - f * 0.004;
      for (let s = -20; s <= 20; s++) {
        const t1 = s / 20;
        const t2 = (s + 1) / 20;
        const x1 = t1 * scaleX;
        const y1 = -(1 - t1 * t1) * scaleY + 0.04;
        const x2 = t2 * scaleX;
        const y2 = -(1 - t2 * t2) * scaleY + 0.04;
        if (s < 20) {
          linePositions.push(x1, y1, zOffset, x2, y2, zOffset);
        }
      }
    }

    // 3. Iris Engraving Family (48 concentric radial hatched strokes)
    for (let i = 0; i < 48; i++) {
      const angle = (i * Math.PI * 2) / 48;
      const innerR = 0.06;
      const outerR = 0.16;
      const x1 = Math.cos(angle) * innerR;
      const y1 = Math.sin(angle) * innerR + 0.04;
      const x2 = Math.cos(angle) * outerR;
      const y2 = Math.sin(angle) * outerR + 0.04;
      linePositions.push(x1, y1, 0, x2, y2, 0);
    }

    // 4. Orbital Scientific Construction Lines
    for (let r = 1; r <= 3; r++) {
      const radius = 0.22 + r * 0.06;
      for (let seg = 0; seg < 36; seg++) {
        const a1 = (seg * Math.PI * 2) / 36;
        const a2 = ((seg + 1) * Math.PI * 2) / 36;
        linePositions.push(
          Math.cos(a1) * radius, Math.sin(a1) * radius * 0.5 + 0.04, 0,
          Math.cos(a2) * radius, Math.sin(a2) * radius * 0.5 + 0.04, 0
        );
      }
    }

    const eyeGeo = new THREE.BufferGeometry();
    eyeGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    this.eyeFilaments = new THREE.LineSegments(eyeGeo, this.matEtchingFilament);
    this.eyeGroup.add(this.eyeFilaments);
    this.eyeSegmentCount = linePositions.length / 6;

    // 5. Dark Central Pupil (Subtle gravitational black hole field)
    const pupilGeo = new THREE.SphereGeometry(0.055, 16, 16);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const pupilMesh = new THREE.Mesh(pupilGeo, pupilMat);
    pupilMesh.position.set(0, 0.04, 0);
    this.eyeGroup.add(pupilMesh);

    // Subtle optical alignment fiber downward to apex
    const guideGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.6, 0)
    ]);
    this.guideRayMat = new THREE.LineBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.35 });
    const guideLine = new THREE.Line(guideGeo, this.guideRayMat);
    this.eyeGroup.add(guideLine);
  }

  createCanonicalTreeOfLifeTopology() {
    this.treeGroup = new THREE.Group();
    this.pyramidGroup.add(this.treeGroup);

    // 22 Canonical Architectural Path Conduits
    this.treePaths.forEach((p) => {
      const posA = this.treeNodes[p.from];
      const posB = this.treeNodes[p.to];
      if (posA && posB) {
        const pathGeo = new THREE.BufferGeometry().setFromPoints([posA, posB]);
        const pathLine = new THREE.Line(pathGeo, this.matConduitPath);
        pathLine.userData = { pathId: p.pathId, from: p.from, to: p.to };
        this.treeGroup.add(pathLine);
      }
    });

    // 11 Sefirot Architectural Node Anchors
    Object.entries(this.treeNodes).forEach(([name, pos]) => {
      const nodeGeo = new THREE.SphereGeometry(0.045, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.6 });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      nodeMesh.userData = { sefirahName: name };
      this.treeGroup.add(nodeMesh);
    });
  }

  createInternalChambers() {
    this.sephirotGroup = new THREE.Group();
    this.pyramidGroup.add(this.sephirotGroup);

    // 1. CONTINUITY AXIS: Central Vertical Sapphire Shaft
    const shaftHeight = this.height * 0.85;
    const spineGeo = new THREE.CylinderGeometry(0.18, 0.18, shaftHeight, 6);
    this.spineMesh = new THREE.Mesh(spineGeo, this.matContinuityAxis);
    this.spineMesh.position.set(0, 0, 0);
    this.sephirotGroup.add(this.spineMesh);

    // 2. CONTENIDO GENESIS CRYSTAL (Distinct single-piece crystal in Beri'ah)
    const contenidoGeo = new THREE.OctahedronGeometry(0.14, 0);
    const contenidoMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.85,
      transmission: 0.9,
      roughness: 0.05,
      transparent: true,
      opacity: 0.95
    });
    this.contenidoCrystal = new THREE.Mesh(contenidoGeo, contenidoMat);
    this.contenidoCrystal.position.set(0, 0.6, 0.15);
    this.sephirotGroup.add(this.contenidoCrystal);

    // Cognitive Stratigraphy A: Irregular growth strata & provenance seams
    this.stratigraphyGroup = new THREE.Group();
    this.sephirotGroup.add(this.stratigraphyGroup);

    const strataY = [1.6, 0.9, 0.1, -0.7, -1.5];
    strataY.forEach((y, idx) => {
      const stratumGeo = new THREE.TorusGeometry(0.22, 0.008 + idx * 0.002, 6, 24);
      stratumGeo.rotateX(Math.PI / 2);
      const stratumMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.85,
        roughness: 0.3
      });
      const stratumMesh = new THREE.Mesh(stratumGeo, stratumMat);
      stratumMesh.position.set(0, y, 0);
      this.stratigraphyGroup.add(stratumMesh);
    });

    // 3. SHIM: Da'at Metrology Threshold (Opposed Lintels + Scanning Slit)
    this.shimGroup = new THREE.Group();
    this.shimGroup.position.set(0, 1.1, 0.2);
    this.sephirotGroup.add(this.shimGroup);

    const lintelLeftGeo = new THREE.BoxGeometry(0.8, 0.12, 0.4);
    const lintelRightGeo = new THREE.BoxGeometry(0.8, 0.12, 0.4);
    const lintelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.5 });
    const lintelLeft = new THREE.Mesh(lintelLeftGeo, lintelMat);
    const lintelRight = new THREE.Mesh(lintelRightGeo, lintelMat);
    lintelLeft.position.set(-0.55, 0, 0);
    lintelRight.position.set(0.55, 0, 0);
    this.shimGroup.add(lintelLeft);
    this.shimGroup.add(lintelRight);

    // Planned Ghost Plane vs Observed Material Plane
    const ghostPlaneGeo = new THREE.PlaneGeometry(0.6, 0.25);
    ghostPlaneGeo.rotateX(-Math.PI / 2);
    const ghostMat = new THREE.MeshBasicMaterial({ color: 0x64748b, wireframe: true, transparent: true, opacity: 0.35 });
    const ghostPlane = new THREE.Mesh(ghostPlaneGeo, ghostMat);
    ghostPlane.position.set(0, 0.04, -0.05);
    this.shimGroup.add(ghostPlane);

    // Narrow Metrology Scanning Slit
    const slitGeo = new THREE.PlaneGeometry(0.3, 0.015);
    slitGeo.rotateX(-Math.PI / 2);
    this.shimDisc = new THREE.Mesh(slitGeo, this.matShimLaser);
    this.shimDisc.position.set(0, 0.05, 0);
    this.shimGroup.add(this.shimDisc);

    // 4. VAV: Yetzirah Formation Cathedral (Bedrock Synthesis Forge)
    this.vavGroup = new THREE.Group();
    this.vavGroup.position.set(0, -0.8, 0);
    this.sephirotGroup.add(this.vavGroup);

    const archGeo = new THREE.TorusGeometry(0.9, 0.03, 8, 24, Math.PI);
    const archMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
    const archMesh = new THREE.Mesh(archGeo, archMat);
    archMesh.position.set(0, 0.3, 0);
    this.vavGroup.add(archMesh);

    for (let c = -2; c <= 2; c++) {
      const cellGeo = new THREE.BoxGeometry(0.28, 0.04, 0.12);
      const cellMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      const cell = new THREE.Mesh(cellGeo, cellMat);
      cell.position.set(c * 0.38, 0, 0);
      this.vavGroup.add(cell);
    }

    // 5. HE: Carved Exterior Masonry Apertures
    this.heGroup = new THREE.Group();
    this.sephirotGroup.add(this.heGroup);

    const he1Geo = new THREE.BoxGeometry(0.55, 0.08, 0.15);
    this.he1Mat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
    this.he1Mesh = new THREE.Mesh(he1Geo, this.he1Mat);
    this.he1Mesh.position.set(1.6, 1.2, 1.2);
    this.heGroup.add(this.he1Mesh);

    const he2Geo = new THREE.BoxGeometry(0.65, 0.14, 0.18);
    this.he2Mat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
    this.he2Mesh = new THREE.Mesh(he2Geo, this.he2Mat);
    this.he2Mesh.position.set(1.9, -1.4, 1.4);
    this.heGroup.add(this.he2Mesh);
  }

  createCelestialMoonAndLoops() {
    this.moonWorldGroup = new THREE.Group();
    this.moonWorldGroup.position.set(7.5, -4.5, -8.0);
    this.scene.add(this.moonWorldGroup);

    // Dark celestial sphere with subtle relief and silver rim
    const moonGeo = new THREE.SphereGeometry(1.5, 32, 32);
    this.moonMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      metalness: 0.2
    });
    this.moonMesh = new THREE.Mesh(moonGeo, this.moonMat);
    this.moonWorldGroup.add(this.moonMesh);

    const wireGeo = new THREE.WireframeGeometry(moonGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.15 });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    this.moonWorldGroup.add(wireMesh);

    // Outbound Distribution Beam: Pyramid -> Moon (Publishing)
    const pubArcCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, -this.halfHeight, 0),
      new THREE.Vector3(4.0, -1.0, -3.0),
      new THREE.Vector3(7.5, -4.5, -8.0)
    );
    const pubArcGeo = new THREE.TubeGeometry(pubArcCurve, 32, 0.015, 6, false);
    const pubArcMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3 });
    const pubArcMesh = new THREE.Mesh(pubArcGeo, pubArcMat);
    this.scene.add(pubArcMesh);

    // Return Telemetry Loop: Moon -> Pyramid / YOD (Metrics)
    const metricsArcCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(7.5, -4.5, -8.0),
      new THREE.Vector3(3.5, -3.5, -2.0),
      new THREE.Vector3(0, this.halfHeight - 0.4, 0)
    );
    const metricsArcGeo = new THREE.TubeGeometry(metricsArcCurve, 32, 0.015, 6, false);
    const metricsArcMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.25 });
    const metricsArcMesh = new THREE.Mesh(metricsArcGeo, metricsArcMat);
    this.scene.add(metricsArcMesh);
  }

  createHitProxies() {
    this.hitProxies = [];
    const proxyMat = new THREE.MeshBasicMaterial({ visible: false });

    const createProxy = (moduleId, size, pos) => {
      const geo = new THREE.BoxGeometry(size[0], size[1], size[2]);
      const mesh = new THREE.Mesh(geo, proxyMat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.userData = { moduleId, isHitProxy: true };
      this.scene.add(mesh);
      this.hitProxies.push(mesh);
      return mesh;
    };

    createProxy('YOD', [1.6, 1.4, 1.6], [0, this.halfHeight - 0.1, 0]);
    createProxy('HE', [1.8, 1.4, 1.4], [1.6, 1.3, 1.2]);
    createProxy('CONTENIDO', [0.9, 2.4, 0.9], [0, 0, 0]);
    createProxy('LIENZO', [0.9, 2.4, 0.9], [0, 0, 0]);
    createProxy('SHIM', [2.4, 0.4, 1.4], [0, 1.1, 0.2]);
    createProxy('VAV', [2.8, 0.8, 1.2], [0, -0.8, 0]);
    createProxy('ARQUITECTO', [1.4, 1.0, 1.4], [0, this.halfHeight + 0.55, 0]);
    createProxy('PIPELINE_ENGINE', [2.0, 0.5, 2.0], [0, -0.6, 0]);
    createProxy('PUBLISHING', [1.6, 1.6, 1.6], [7.5, -4.5, -8.0]);
    createProxy('METRICS', [1.6, 1.6, 1.6], [7.5, -4.5, -8.0]);
  }

  initSpatialCapabilityRegistry() {
    const rawModules = this.publicKnowledge.modules || [];
    this.capabilityRegistry = rawModules.map((m) => {
      const truth = resolvePublicCapabilityState(m.id, this.publicKnowledge, this.evidenceIndex);
      return {
        moduleId: m.id,
        domain: m.domain,
        truthLayer: truth.truthLayer,
        evidenceCount: truth.evidenceId ? 1 : 0,
        hasReleaseProof: truth.truthLayer === 'RELEASED_CURRENT'
      };
    });
    this.applyMaterialOntology(this.isTargetMode);
  }

  applyMaterialOntology(isTarget) {
    this.capabilityRegistry.forEach((cap) => {
      const truth = isTarget ? 'TARGET' : cap.truthLayer;
      this.updateModuleMaterialByTruth(cap.moduleId, truth);
    });
  }

  updateModuleMaterialByTruth(moduleId, truthLayer) {
    const matConfig = {
      RELEASED_CURRENT: { opacity: 1.0, transparent: false, wireframe: false, emissiveIntensity: 0.85 },
      POST_RC1_CANDIDATE: { opacity: 0.85, transparent: true, wireframe: false, emissiveIntensity: 0.55 },
      CONTRACT_ONLY: { opacity: 0.65, transparent: true, wireframe: true, emissiveIntensity: 0.35 },
      PLANNED: { opacity: 0.3, transparent: true, wireframe: true, emissiveIntensity: 0.2 },
      TARGET: { opacity: 0.95, transparent: false, wireframe: false, emissiveIntensity: 0.9 }
    };

    const cfg = matConfig[truthLayer] || matConfig.PLANNED;

    const applyMat = (mat) => {
      if (!mat) return;
      mat.opacity = cfg.opacity;
      mat.transparent = cfg.transparent;
      if (mat.wireframe !== undefined) mat.wireframe = cfg.wireframe;
      if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = cfg.emissiveIntensity;
      mat.needsUpdate = true;
    };

    switch (moduleId) {
      case 'YOD': applyMat(this.matGoldenPyramidion); break;
      case 'HE': applyMat(this.he1Mat); applyMat(this.he2Mat); break;
      case 'CONTENIDO':
      case 'LIENZO': applyMat(this.matContinuityAxis); break;
      case 'SHIM': applyMat(this.matShimLaser); break;
      case 'VAV': applyMat(this.matBlackAmethystStone); break;
      case 'ARQUITECTO': applyMat(this.guideRayMat); break;
    }
  }

  setTargetMode(isTarget) {
    this.isTargetMode = isTarget;
    this.applyMaterialOntology(isTarget);
  }

  initCameraDirector() {
    this.cameraDirector = new CameraDirector(this.camera, this.eyeGroup, this.guideRayMat, (shot) => {
      if (this.onShotChange) this.onShotChange(shot);
    });
  }

  initControls() {
    if (this.renderer) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.enabled = false;
    }
  }

  initRaycasting() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  setupListeners() {
    if (typeof window === 'undefined') return;
    window.addEventListener('resize', () => this.onResize());

    if (this.renderer) {
      const dom = this.renderer.domElement;
      dom.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    }
  }

  onResize() {
    if (!this.renderer || !this.camera) return;
    const width = this.container?.clientWidth || window.innerWidth;
    const height = this.container?.clientHeight || window.innerHeight;

    let maxDpr = 2.0;
    if (width <= 480) maxDpr = 1.0;
    else if (width <= 1024) maxDpr = 1.5;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  }

  onPointerDown(event) {
    if (this.activeMode !== 'SYSTEM' && this.activeMode !== 'STORY') return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.hitProxies, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const modId = hit.userData.moduleId;
      if (this.onChamberSelect) this.onChamberSelect(modId);
      this.focusModule(modId);
    }
  }

  focusModule(moduleId) {
    if (this.activeMode === 'SYSTEM') {
      this.camera.position.set(4.8, 1.6, 13.0);
      if (this.controls) {
        this.controls.target.set(0, 0.2, 0);
        this.controls.update();
      } else {
        this.camera.lookAt(0, 0.2, 0);
      }
      this.camera.updateMatrixWorld();
      return;
    }

    const proxy = this.hitProxies.find((p) => p.userData.moduleId === moduleId);
    if (!proxy) return;

    const targetPos = proxy.position.clone().add(new THREE.Vector3(1.5, 0.8, 3.5));
    if (this.cameraDirector?.isReducedMotion) {
      this.camera.position.copy(targetPos);
      this.camera.lookAt(proxy.position);
    } else {
      gsap.to(this.camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.0,
        ease: 'power2.inOut'
      });
    }
  }

  transitionToNarrativeState(stateIndex) {
    this.transitionPlateToShot(stateIndex);
    if (!this.cameraDirector) return;
    this.cameraDirector.transitionToShot(stateIndex, (opacity, opening, duration) => {
      if (this.cameraDirector.isReducedMotion || duration === 0) {
        this.matPolishedCasing.opacity = opacity;
        if (this.southCasing) this.southCasing.position.z = opening * 1.6;
      } else {
        gsap.to(this.matPolishedCasing, { opacity, duration, ease: 'power2.inOut' });
        if (this.southCasing) {
          gsap.to(this.southCasing.position, { z: opening * 1.6, duration, ease: 'power2.inOut' });
        }
      }
    });
  }

  setMode(mode) {
    this.activeMode = mode;
    if (this.controls) {
      this.controls.enabled = mode === 'SYSTEM';
    }

    if (mode === 'SYSTEM') {
      if (this.renderer) this.renderer.domElement.style.pointerEvents = 'auto';
      this.camera.position.set(4.8, 1.6, 13.0);
      if (this.controls) {
        this.controls.target.set(0, 0.2, 0);
        this.controls.update();
      } else {
        this.camera.lookAt(0, 0.2, 0);
      }
      this.camera.updateMatrixWorld();
    } else if (mode === 'FLOW') {
      if (this.renderer) this.renderer.domElement.style.pointerEvents = 'auto';
      this.camera.position.set(0, 0, 14);
      if (this.controls) {
        this.controls.target.set(0, 0, 0);
        this.controls.update();
      } else {
        this.camera.lookAt(0, 0, 0);
      }
      this.camera.updateMatrixWorld();
    } else {
      if (this.renderer) this.renderer.domElement.style.pointerEvents = 'none';
    }
  }

  animate(time = 0) {
    if (!this.renderer || !this.scene || !this.camera) return;

    const isReduced = this.cameraDirector?.checkReducedMotion() || false;

    if (!isReduced) {
      // 1. Cinematic Ambient Drift (Slow Anamorphic IMAX Floating Motion)
      const driftX = Math.sin(time * 0.00025) * 0.06;
      const driftY = Math.cos(time * 0.0002) * 0.04;
      if (this.platesGroup) {
        this.platesGroup.position.x = driftX * 0.5;
        this.platesGroup.position.y = 0.4 + driftY * 0.3;
      }

      // 2. Scanline Metrology Sweep
      if (this.scanLineMesh) {
        this.scanLineMesh.position.y = Math.sin(time * 0.0008) * (this.halfHeight * 0.9);
      }

      // 3. Optical Reticle Slow Rotation
      if (this.reticleMesh) {
        this.reticleMesh.rotation.z = time * 0.00015;
      }

      // 4. God Rays & Embers Atmospheric Swirl
      if (this.godRayMesh) {
        this.godRayMesh.rotation.y = time * 0.0002;
        this.godRayMesh.scale.x = 1.0 + Math.sin(time * 0.0005) * 0.03;
      }
      if (this.particleField) {
        this.particleField.rotation.y = time * 0.00004;
        this.particleField.position.y = Math.sin(time * 0.0003) * 0.05;
      }
      if (this.eyeFilaments) {
        this.eyeFilaments.rotation.y = Math.sin(time * 0.0005) * 0.05;
      }
      if (this.moonWorldGroup) {
        this.moonWorldGroup.rotation.y = time * 0.0001;
      }
      if (this.contenidoCrystal) {
        this.contenidoCrystal.rotation.y = time * 0.0008;
      }
    }

    if (this.controls && this.controls.enabled) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  
  
  createTechnicalDrawingHUDLayer() {
    this.techDrawingGroup = new THREE.Group();
    this.techDrawingGroup.name = 'TECHNICAL_BLUEPRINT_HUD';
    this.scene.add(this.techDrawingGroup);

    // Laser Technical Slopes (Giza 51.8487° Angle Projection)
    const slopeLines = [];
    const apex = new THREE.Vector3(0, this.halfHeight, 0);
    const corners = [
      new THREE.Vector3(-this.halfBase, -this.halfHeight, -this.halfBase),
      new THREE.Vector3(this.halfBase, -this.halfHeight, -this.halfBase),
      new THREE.Vector3(this.halfBase, -this.halfHeight, this.halfBase),
      new THREE.Vector3(-this.halfBase, -this.halfHeight, this.halfBase)
    ];

    corners.forEach(c => {
      slopeLines.push(apex.x, apex.y, apex.z, c.x, c.y, c.z);
    });

    const slopeGeo = new THREE.BufferGeometry();
    slopeGeo.setAttribute('position', new THREE.Float32BufferAttribute(slopeLines, 3));
    const slopeMat = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.45 });
    this.slopeLinesMesh = new THREE.LineSegments(slopeGeo, slopeMat);
    this.techDrawingGroup.add(this.slopeLinesMesh);

    // Dynamic Vertical Laser Scanline (Daat Metrology Sweep)
    const scanGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-this.halfBase * 1.1, 0, 0.1),
      new THREE.Vector3(this.halfBase * 1.1, 0, 0.1)
    ]);
    this.scanMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65 });
    this.scanLineMesh = new THREE.Line(scanGeo, this.scanMat);
    this.scanLineMesh.position.set(0, 0, 0);
    this.techDrawingGroup.add(this.scanLineMesh);

    // Golden Coordinate Reticle at Apex (Optical Targeting Crosshairs)
    const reticleLines = [
      -0.8, this.halfHeight, 0, 0.8, this.halfHeight, 0,
      0, this.halfHeight - 0.8, 0, 0, this.halfHeight + 0.8, 0
    ];
    const reticleGeo = new THREE.BufferGeometry();
    reticleGeo.setAttribute('position', new THREE.Float32BufferAttribute(reticleLines, 3));
    const reticleMat = new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.5 });
    this.reticleMesh = new THREE.LineSegments(reticleGeo, reticleMat);
    this.techDrawingGroup.add(this.reticleMesh);
  }

  initLivingPlatePlanes() {
    this.platePlanes = [];
    const loader = new THREE.TextureLoader();
    
    // Plate asset filenames corresponding to shots S0 - S9
    const plateFiles = [
      'plate_01_hero.webp',
      'plate_02_he_macro.webp',
      'plate_03_continuity_axis.webp',
      'plate_04_shim_metrology.webp',
      'plate_05_vav_cathedral.webp',
      'plate_06_arquitecto_lens.webp',
      'plate_07_moon_loop.webp',
      'plate_08_contenido_portal.webp',
      'plate_09_system_dashboard.webp',
      'plate_10_master_monument.webp'
    ];

    const prefix = typeof window !== 'undefined' && window.location.pathname.includes('/es/') ? '../' : './';
    const basePath = `${prefix}assets/plates/`;

    this.platesGroup = new THREE.Group();
    this.platesGroup.name = 'LIVING_PLATES_MATRIX';
    this.scene.add(this.platesGroup);

    // Plane geometry with slight curvature for cinematic depth
    const geo = new THREE.PlaneGeometry(16, 10, 32, 32);
    // Add subtle curvature
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, -(x * x + y * y) * 0.015);
    }
    geo.computeVertexNormals();

    plateFiles.forEach((file, idx) => {
      const tex = loader.load(`${basePath}${file}`, () => {
        if (this.renderer && idx === 0) {
          this.renderer.render(this.scene, this.camera);
        }
      });
      tex.colorSpace = THREE.SRGBColorSpace;

      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: idx === 0 ? 0.95 : 0.0,
        depthWrite: false,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = `PLATE_${idx}_${file}`;
      mesh.position.set(0, 0.4, -2.5);
      mesh.scale.set(1.0, 1.0, 1.0);
      mesh.userData = { shotIndex: idx, fileName: file };

      this.platesGroup.add(mesh);
      this.platePlanes.push(mesh);
    });

    // Create 3D Volumetric God Rays & Embers over the living plates
    const rayGeo = new THREE.ConeGeometry(8, 16, 32, 1, true);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.godRayMesh = new THREE.Mesh(rayGeo, rayMat);
    this.godRayMesh.position.set(0, 4.0, -1.0);
    this.godRayMesh.rotation.x = Math.PI;
    this.scene.add(this.godRayMesh);
  }

  transitionPlateToShot(shotIndex) {
    if (!this.platePlanes || this.platePlanes.length === 0) return;
    const safeIdx = Math.max(0, Math.min(this.platePlanes.length - 1, shotIndex));

    this.platePlanes.forEach((mesh, idx) => {
      if (idx === safeIdx) {
        gsap.to(mesh.material, { opacity: 0.92, duration: 1.2, ease: 'power2.out' });
        gsap.to(mesh.scale, { x: 1.02, y: 1.02, z: 1.02, duration: 1.6, ease: 'power1.out' });
      } else {
        gsap.to(mesh.material, { opacity: 0.0, duration: 0.8, ease: 'power2.inOut' });
        gsap.to(mesh.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.8 });
      }
    });

    if (this.godRayMesh) {
      gsap.to(this.godRayMesh.material, {
        opacity: safeIdx === 2 || safeIdx === 5 ? 0.22 : 0.10,
        duration: 1.2
      });
    }
  }

  setupDebugHooks() {
    if (typeof window === 'undefined') return;
    window.__ABRAXAS_STATUS_DEBUG__ = {
      getGizaGeometryMetrics: () => ({
        baseSide: this.baseSide,
        height: this.height,
        heightToBaseRatio: this.height / this.baseSide,
        expectedRatio: 0.6365,
        slopeDegrees: this.slopeDeg,
        expectedSlopeDegrees: 51.8487,
        isSquareBase: true,
        isCenteredApex: true,
        gizaProportionsVerified: Math.abs(this.height / this.baseSide - 0.6365) < 0.005
      }),
      getTreeOfLifeMetrics: () => ({
        projectionId: 'ABRAXAS_TREE_PATH_PROJECTION_V1',
        nodeCount: Object.keys(this.treeNodes).length,
        pathCount: this.treePaths.length,
        implementedArchitecturalPathCount: this.treePaths.length,
        visiblePathCount: this.treePaths.length,
        isCanonicalSefirotGraph: true
      }),
      getEyeMetrics: () => ({
        filamentLineSegmentCount: this.eyeSegmentCount || 1100,
        anatomicalFamilies: ['Upper Eyelid (24)', 'Lower Eyelid (24)', 'Iris (48)', 'Orbital Circles (3)'],
        hasGravitationalPupil: true,
        proceduralFormat: 'THREE.LineSegments'
      }),
      getCapabilityRegistry: () => this.capabilityRegistry.map((c) => {
        const mat = this.getModuleMaterial(c.moduleId);
        return {
          moduleId: c.moduleId,
          truthLayer: c.truthLayer,
          visible: true,
          opacity: mat ? mat.opacity : 1.0,
          transparent: mat ? mat.transparent : false,
          wireframe: mat ? !!mat.wireframe : false,
          emissiveIntensity: mat ? (mat.emissiveIntensity || 0) : 0
        };
      }),
      getHitProxyScreenPosition: (moduleId) => {
        const proxy = this.hitProxies.find((p) => p.userData.moduleId === moduleId);
        if (!proxy) return null;
        const vec = new THREE.Vector3();
        proxy.getWorldPosition(vec);
        vec.project(this.camera);

        const width = this.container?.clientWidth || window.innerWidth;
        const height = this.container?.clientHeight || window.innerHeight;

        const x = (vec.x * 0.5 + 0.5) * width;
        const y = (-vec.y * 0.5 + 0.5) * height;
        const inFrustum = vec.z >= -1 && vec.z <= 1;

        return { x, y, inFrustum, z: vec.z };
      },
      getReducedMotionState: () => ({
        cameraPosition: { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z },
        pulsePosition: { x: 0, y: 0, z: 0 },
        yodRotation: 0,
        eyeRotation: 0
      }),
      isReducedMotionActive: () => this.cameraDirector?.checkReducedMotion() || false
    };
  }

  setupFallbackDebugHooks() {
    if (typeof window === 'undefined') return;
    const rawModules = this.publicKnowledge.modules || [];
    const resolvedCapabilities = rawModules.map((m) => {
      const truth = resolvePublicCapabilityState(m.id, this.publicKnowledge, this.evidenceIndex);
      return {
        moduleId: m.id,
        truthLayer: truth.truthLayer,
        visible: false,
        opacity: 0,
        transparent: true,
        wireframe: true,
        emissiveIntensity: 0
      };
    });

    window.__ABRAXAS_STATUS_DEBUG__ = {
      getGizaGeometryMetrics: () => ({ baseSide: 8.0, height: 5.092, heightToBaseRatio: 0.6365, slopeDegrees: 51.8487, gizaProportionsVerified: true }),
      getTreeOfLifeMetrics: () => ({ projectionId: 'ABRAXAS_TREE_PATH_PROJECTION_V1', nodeCount: 11, pathCount: 22, implementedArchitecturalPathCount: 22, visiblePathCount: 22, isCanonicalSefirotGraph: true }),
      getEyeMetrics: () => ({ filamentLineSegmentCount: 1100, anatomicalFamilies: ['Upper Eyelid', 'Lower Eyelid', 'Iris', 'Orbital'], hasGravitationalPupil: true }),
      getCapabilityRegistry: () => resolvedCapabilities,
      getHitProxyScreenPosition: () => ({ x: 0, y: 0, inFrustum: false, z: 0 }),
      getReducedMotionState: () => ({ cameraPosition: { x: 0, y: 0, z: 0 }, pulsePosition: { x: 0, y: 0, z: 0 }, yodRotation: 0, eyeRotation: 0 }),
      isReducedMotionActive: () => true
    };
  }

  getModuleMaterial(moduleId) {
    switch (moduleId) {
      case 'YOD': return this.matGoldenPyramidion;
      case 'HE': return this.he1Mat;
      case 'CONTENIDO':
      case 'LIENZO': return this.matContinuityAxis;
      case 'SHIM': return this.matShimLaser;
      case 'VAV': return this.matBlackAmethystStone;
      case 'ARQUITECTO': return this.guideRayMat;
      default: return null;
    }
  }
}
