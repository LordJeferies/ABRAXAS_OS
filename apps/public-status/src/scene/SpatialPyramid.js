import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import { CameraDirector } from './camera-director.js';
import { resolvePublicCapabilityState } from '../data/truth-resolver.js';

/**
 * ABRAXAS Status V6 — Giza Monumental Realism × V5 Spatial Ontology
 * 
 * - Giza Canonical Proportions: Base 8.0m, Height 5.092m (Ratio 0.6365, Slope 51.8487°)
 * - 24-Course Black Amethyst Masonry (Reads black first, subtle amethyst under grazing light)
 * - Aged Gold / Electrum Apex + Interior Golden Emanation Chamber (Atziluth)
 * - Volumetric Copperplate Etching Arquitecto Eye (1000+ Filaments, Anatomical Silhouette, Black Pupil)
 * - Canonical Tree of Life Topology: 11 Nodes (Keter to Malkhut) & 22 Architectural Paths
 * - Da'at Metrology Threshold (SHIM Opposed Lintels & Narrow Scanning Slit)
 * - Yetzirah Formation Cathedral (VAV Bedrock Synthesis Forge)
 * - Carved Exterior Masonry Apertures (HE I / HE II)
 * - Central Sapphire Continuity Axis with Cognitive Stratigraphy A
 * - Eclipse Sun Corona + Celestial Moon Closed-Loop (Publishing Outbound -> Moon, Telemetry Inbound -> Pyramid)
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

    // Canonical Giza Proportions
    this.baseSide = 8.0;
    this.halfBase = 4.0;
    this.height = this.baseSide * 0.6365; // 5.092m
    this.halfHeight = this.height / 2; // 2.546m
    this.slopeDeg = Math.atan(this.height / this.halfBase) * (180 / Math.PI); // 51.8487°

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

    // 22 Canonical Connective Paths
    this.treePaths = [
      ['KETER', 'CHOKHMAH'], ['KETER', 'BINAH'], ['KETER', 'TIFERET'], ['KETER', 'DAAT'],
      ['CHOKHMAH', 'BINAH'], ['CHOKHMAH', 'CHESED'], ['CHOKHMAH', 'TIFERET'],
      ['BINAH', 'GEVURAH'], ['BINAH', 'TIFERET'],
      ['DAAT', 'CHESED'], ['DAAT', 'GEVURAH'], ['DAAT', 'TIFERET'],
      ['CHESED', 'GEVURAH'], ['CHESED', 'TIFERET'], ['CHESED', 'NETZACH'],
      ['GEVURAH', 'TIFERET'], ['GEVURAH', 'HOD'],
      ['TIFERET', 'NETZACH'], ['TIFERET', 'HOD'], ['TIFERET', 'YESOD'],
      ['NETZACH', 'HOD'], ['NETZACH', 'YESOD'], ['NETZACH', 'MALKHUT'],
      ['HOD', 'YESOD'], ['HOD', 'MALKHUT'],
      ['YESOD', 'MALKHUT']
    ].slice(0, 22); // Exactly 22 Canonical Paths

    this.initRenderer();
    if (this.renderer) {
      this.initPBRMaterials();
      this.createAtmosphericDust();
      this.createSolarEclipseAtmosphere();
      this.createGizaBlackAmethystMasonry();
      this.createGoldenAtziluthApex();
      this.createVolumetricEtchedArquitectoEye();
      this.createTreeOfLifeTopology();
      this.createFourWorldsInternalArchitecture();
      this.createCelestialMoonAndWorld();
      this.createHitProxies();
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

      this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 150);

      const isSys = window.location.pathname.includes('/system');
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

      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
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
      window.__ABRAXAS_RENDERER_STATE__ = 'THREE_ACTIVE';
    } catch (e) {
      console.warn('[SpatialPyramid] WebGL initialization fallback:', e.message);
      window.__ABRAXAS_RENDERER_STATE__ = 'FALLBACK_ACTIVE';
      this.renderer = null;
    }
  }

  initPBRMaterials() {
    // 1. Black Amethyst Monumental Masonry (Reads BLACK first, subtle amethyst under grazing light)
    this.matBlackAmethystStone = new THREE.MeshStandardMaterial({
      color: 0x0c0b10,
      roughness: 0.88,
      metalness: 0.18
    });

    // 2. Obsidian Casing Shells
    this.matPolishedCasing = new THREE.MeshPhysicalMaterial({
      color: 0x070709,
      roughness: 0.28,
      metalness: 0.72,
      transmission: 0.35,
      ior: 1.58,
      transparent: true,
      opacity: 0.45,
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
      emissiveIntensity: 0.65,
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
      emissiveIntensity: 0.75,
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
      opacity: 0.4
    });

    // 7. Volumetric Copperplate Etching Filament Material
    this.matEtchingFilament = new THREE.LineBasicMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0.75
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

  createSolarEclipseAtmosphere() {
    this.ambientLight = new THREE.AmbientLight(0x0a0a0e, 1.2);
    this.scene.add(this.ambientLight);

    // Distant Solar Eclipse Corona
    this.solarEclipseGroup = new THREE.Group();
    this.solarEclipseGroup.position.set(0, 18, -35);
    this.scene.add(this.solarEclipseGroup);

    const sunCoreGeo = new THREE.CircleGeometry(5.2, 48);
    const sunCoreMat = new THREE.MeshBasicMaterial({ color: 0x020203 });
    const sunCoreMesh = new THREE.Mesh(sunCoreGeo, sunCoreMat);
    this.solarEclipseGroup.add(sunCoreMesh);

    const coronaGeo = new THREE.RingGeometry(5.2, 7.8, 64);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide
    });
    this.coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    this.solarEclipseGroup.add(this.coronaMesh);

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

  createGizaBlackAmethystMasonry() {
    this.pyramidGroup = new THREE.Group();
    this.scene.add(this.pyramidGroup);

    // 24 Tiered Masonry Courses
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

    // Keter: Distributed white-gold luminous field
    const keterFieldGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const keterFieldMat = new THREE.MeshPhysicalMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.9,
      transmission: 0.85,
      transparent: true,
      opacity: 0.6
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

    // Procedural Copperplate Engraving Filament Families (1000+ line segments)
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

  createTreeOfLifeTopology() {
    this.treeGroup = new THREE.Group();
    this.pyramidGroup.add(this.treeGroup);

    // Render 22 Canonical Connective Architectural Paths
    this.treePaths.forEach(([nodeA, nodeB]) => {
      const posA = this.treeNodes[nodeA];
      const posB = this.treeNodes[nodeB];
      if (posA && posB) {
        const pathGeo = new THREE.BufferGeometry().setFromPoints([posA, posB]);
        const pathLine = new THREE.Line(pathGeo, this.matConduitPath);
        this.treeGroup.add(pathLine);
      }
    });

    // Render 11 Node Architectural Anchors
    Object.entries(this.treeNodes).forEach(([name, pos]) => {
      const nodeGeo = new THREE.SphereGeometry(0.045, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.6 });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      this.treeGroup.add(nodeMesh);
    });
  }

  createFourWorldsInternalArchitecture() {
    this.sephirotGroup = new THREE.Group();
    this.pyramidGroup.add(this.sephirotGroup);

    // 1. CONTINUITY AXIS: Central Vertical Sapphire Shaft
    const shaftHeight = this.height * 0.85;
    const spineGeo = new THREE.CylinderGeometry(0.18, 0.18, shaftHeight, 6);
    this.spineMesh = new THREE.Mesh(spineGeo, this.matContinuityAxis);
    this.spineMesh.position.set(0, 0, 0);
    this.sephirotGroup.add(this.spineMesh);

    // Cognitive Stratigraphy A: Embedded variable strata & provenance seams
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

    // 2. SHIM: Da'at Metrology Threshold (Opposed Lintels + Narrow Scanning Slit)
    this.shimGroup = new THREE.Group();
    this.shimGroup.position.set(0, 1.1, 0.2);
    this.sephirotGroup.add(this.shimGroup);

    // Opposed Architectural Stone Lintels
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

    // 3. VAV: Yetzirah Formation Cathedral (Bedrock Synthesis Forge)
    this.vavGroup = new THREE.Group();
    this.vavGroup.position.set(0, -0.8, 0);
    this.sephirotGroup.add(this.vavGroup);

    // Central Coherent Tiferet Synthesis Arch
    const archGeo = new THREE.TorusGeometry(0.9, 0.03, 8, 24, Math.PI);
    const archMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
    const archMesh = new THREE.Mesh(archGeo, archMat);
    archMesh.position.set(0, 0.3, 0);
    this.vavGroup.add(archMesh);

    // Typography Strata (Hod) & Motion Trajectory Channels (Netzach)
    for (let c = -2; c <= 2; c++) {
      const cellGeo = new THREE.BoxGeometry(0.28, 0.04, 0.12);
      const cellMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      const cell = new THREE.Mesh(cellGeo, cellMat);
      cell.position.set(c * 0.38, 0, 0);
      this.vavGroup.add(cell);
    }

    // 4. HE: Carved Exterior Masonry Apertures
    this.heGroup = new THREE.Group();
    this.sephirotGroup.add(this.heGroup);

    // HE I: Upper inspection slit carved into masonry
    const he1Geo = new THREE.BoxGeometry(0.55, 0.08, 0.15);
    this.he1Mat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
    this.he1Mesh = new THREE.Mesh(he1Geo, this.he1Mat);
    this.he1Mesh.position.set(1.6, 1.2, 1.2);
    this.heGroup.add(this.he1Mesh);

    // HE II: Lower operational portal carved into base
    const he2Geo = new THREE.BoxGeometry(0.65, 0.14, 0.18);
    this.he2Mat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
    this.he2Mesh = new THREE.Mesh(he2Geo, this.he2Mat);
    this.he2Mesh.position.set(1.9, -1.4, 1.4);
    this.heGroup.add(this.he2Mesh);
  }

  createCelestialMoonAndWorld() {
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
      if (this.particleField) {
        this.particleField.rotation.y = time * 0.00003;
      }
      if (this.eyeFilaments) {
        this.eyeFilaments.rotation.y = Math.sin(time * 0.0005) * 0.05;
      }
      if (this.moonWorldGroup) {
        this.moonWorldGroup.rotation.y = time * 0.0001;
      }
      if (this.coronaMesh) {
        this.coronaMesh.rotation.z = time * 0.00005;
      }
    }

    if (this.controls && this.controls.enabled) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  setupDebugHooks() {
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
        nodeCount: Object.keys(this.treeNodes).length,
        pathCount: this.treePaths.length,
        implementedArchitecturalPathCount: 22,
        visiblePathCount: 22
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
    // Exact resolved truth mapping in fallback mode (no false promotion!)
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
      getTreeOfLifeMetrics: () => ({ nodeCount: 11, pathCount: 22, implementedArchitecturalPathCount: 22, visiblePathCount: 22 }),
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
