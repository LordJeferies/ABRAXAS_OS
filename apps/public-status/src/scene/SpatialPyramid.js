import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import { CameraDirector } from './camera-director.js';
import { resolvePublicCapabilityState } from '../data/truth-resolver.js';

/**
 * ABRAXAS Monumental Giza Realism × Sephirot Tree of Life Architecture
 * Giza Massing: Base 8.0m, Height 5.092m (Ratio 0.6365, Slope 51.8487°)
 * Dark Basalt Stone + Golden Apex Pyramidion (YOD Supernal Triad)
 * Holographic Etched Arquitecto + Solar Eclipse + Moon Publisher/Metrics
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
    this.activeBlueprint = null;
    this.capabilityRegistry = [];
    this.clock = new THREE.Clock();

    // Canonical Giza Proportions (Verified Reference)
    this.baseSide = 8.0;
    this.halfBase = 4.0;
    this.height = this.baseSide * 0.6365; // 5.092
    this.halfHeight = this.height / 2; // 2.546
    this.slopeDeg = Math.atan(this.height / this.halfBase) * (180 / Math.PI); // 51.8487°

    this.initRenderer();
    if (this.renderer) {
      this.initPBRMaterials();
      this.createAtmosphericEclipseDust();
      this.createSolarEclipseLighting();
      this.createGizaBasaltMasonry();
      this.createGoldenApexPyramidion();
      this.createHolographicEtchedArquitecto();
      this.createSephirotInternalArchitecture();
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
      this.scene.fog = new THREE.FogExp2(0x050507, 0.02);

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
    // 1. Dark Basalt / Graphite Stone (Giza Masonry Courses)
    this.matBasaltStone = new THREE.MeshStandardMaterial({
      color: 0x111114,
      roughness: 0.88,
      metalness: 0.12
    });

    // 2. Polished Obsidian Casing Shell
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

    // 3. Golden Apex Capstone (Pyramidion / YOD Supernal Triad)
    this.matGoldenPyramidion = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xb45309,
      emissiveIntensity: 0.65,
      roughness: 0.18,
      metalness: 0.94
    });

    // 4. Lienzo Central Crystalline Spine (Keter-to-Malkhut Axis)
    this.matLienzoCrystal = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      transmission: 0.95,
      roughness: 0.04,
      metalness: 0.08,
      ior: 1.65,
      transparent: true,
      opacity: 0.9
    });

    // 5. Shim Metrology Laser Plane (Da'at / Gevurah Judgment)
    this.matShimLaser = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.55,
      transmission: 0.88,
      roughness: 0.06,
      metalness: 0.15,
      ior: 1.52,
      transparent: true,
      opacity: 0.82
    });

    // 6. Tree of Life Energy Conduits (22 Sephirot Paths)
    this.matSephirotPath = new THREE.LineBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.35
    });

    // 7. Holographic Etching Material for Arquitecto
    this.matHoloEtching = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
  }

  createAtmosphericEclipseDust() {
    this.particleGroup = new THREE.Group();
    this.scene.add(this.particleGroup);

    const count = 1400;
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
      size: 0.032,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });

    this.particleField = new THREE.Points(geo, mat);
    this.particleGroup.add(this.particleField);
  }

  createSolarEclipseLighting() {
    // 1. Ambient Penumbra Base
    this.ambientLight = new THREE.AmbientLight(0x0a0a0e, 1.15);
    this.scene.add(this.ambientLight);

    // 2. Solar Corona Disk (The Absolute Energy Source)
    this.solarEclipseGroup = new THREE.Group();
    this.solarEclipseGroup.position.set(0, 18, -35);
    this.scene.add(this.solarEclipseGroup);

    // Dark Sun Core
    const sunCoreGeo = new THREE.CircleGeometry(5.2, 48);
    const sunCoreMat = new THREE.MeshBasicMaterial({ color: 0x020203 });
    const sunCoreMesh = new THREE.Mesh(sunCoreGeo, sunCoreMat);
    this.solarEclipseGroup.add(sunCoreMesh);

    // Radiant Corona Ring
    const coronaGeo = new THREE.RingGeometry(5.2, 7.8, 64);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    this.coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    this.solarEclipseGroup.add(this.coronaMesh);

    // 3. High-Contrast Solar Key Light
    this.solarKeyLight = new THREE.DirectionalLight(0xffedd5, 4.8);
    this.solarKeyLight.position.set(4, 20, 16);
    this.scene.add(this.solarKeyLight);

    // 4. Cool Astral Rim Light
    this.astralRimLight = new THREE.DirectionalLight(0x94a3b8, 3.6);
    this.astralRimLight.position.set(-18, 8, -14);
    this.scene.add(this.astralRimLight);

    // 5. Internal YOD / Lienzo Core Light
    this.coreLight = new THREE.PointLight(0x38bdf8, 3.8, 10);
    this.coreLight.position.set(0, 0.4, 0);
    this.scene.add(this.coreLight);
  }

  createGizaBasaltMasonry() {
    this.pyramidGroup = new THREE.Group();
    this.scene.add(this.pyramidGroup);

    // 24 Tiered Masonry Courses (Massive Dark Basalt Blocks)
    this.masonryCourses = new THREE.Group();
    this.pyramidGroup.add(this.masonryCourses);

    const numCourses = 24;
    const courseHeight = this.height / numCourses; // ~0.212m per course

    for (let c = 0; c < numCourses; c++) {
      const t = c / numCourses;
      const courseHalfWidth = this.halfBase * (1.0 - t);
      const y = -this.halfHeight + (c + 0.5) * courseHeight;

      const courseGeo = new THREE.BoxGeometry(courseHalfWidth * 2, courseHeight * 0.96, courseHalfWidth * 2);
      const courseMesh = new THREE.Mesh(courseGeo, this.matBasaltStone);
      courseMesh.position.set(0, y, 0);
      this.masonryCourses.add(courseMesh);

      // Micro stone joints along block courses
      for (let s = -2; s <= 2; s++) {
        if (s !== 0) {
          const seamGeo = new THREE.BoxGeometry(0.015, courseHeight, 0.02);
          const seamMat = new THREE.MeshStandardMaterial({ color: 0x262626, metalness: 0.8 });
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
    this.southCasing = createCasingFace(apex, corners[2], corners[3]); // Front Shell
    this.westCasing = createCasingFace(apex, corners[3], corners[0]);

    this.casingGroup.add(this.northCasing);
    this.casingGroup.add(this.eastCasing);
    this.casingGroup.add(this.southCasing);
    this.casingGroup.add(this.westCasing);
  }

  createGoldenApexPyramidion() {
    this.pyramidionGroup = new THREE.Group();
    this.pyramidionGroup.position.set(0, this.halfHeight - 0.35, 0);
    this.pyramidGroup.add(this.pyramidionGroup);

    // Golden Pyramidion Capstone (Where YOD inhabits the Supernal Triad)
    const capHeight = 0.7;
    const capHalfBase = capHeight / (this.height / this.halfBase);
    const capGeo = new THREE.ConeGeometry(capHalfBase * 1.414, capHeight, 4);
    capGeo.rotateY(Math.PI / 4);
    this.pyramidionMesh = new THREE.Mesh(capGeo, this.matGoldenPyramidion);
    this.pyramidionMesh.position.set(0, capHeight / 2, 0);
    this.pyramidionGroup.add(this.pyramidionMesh);

    // Three Supernal Triad Glyphs (Keter, Chokhmah, Binah)
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const sphereGeo = new THREE.SphereGeometry(0.04, 12, 12);
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const triadNode = new THREE.Mesh(sphereGeo, sphereMat);
      triadNode.position.set(Math.cos(angle) * 0.18, capHeight * 0.6, Math.sin(angle) * 0.18);
      this.pyramidionGroup.add(triadNode);
    }
  }

  createHolographicEtchedArquitecto() {
    this.eyeGroup = new THREE.Group();
    this.eyeGroup.position.set(0, this.halfHeight + 0.55, 0);
    this.scene.add(this.eyeGroup);

    // 1. Concentric Etched Holographic Rings (Etching Style Optical Graticule)
    for (let r = 1; r <= 3; r++) {
      const ringGeo = new THREE.RingGeometry(r * 0.14, r * 0.14 + 0.012, 32);
      const ringMesh = new THREE.Mesh(ringGeo, this.matHoloEtching);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.set(0, (r - 2) * 0.06, 0);
      this.eyeGroup.add(ringMesh);
    }

    // 2. Optical Sapphire Observation Lens
    const lensGeo = new THREE.SphereGeometry(0.28, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      transmission: 0.95,
      roughness: 0.02,
      ior: 1.7
    });
    this.lensMesh = new THREE.Mesh(lensGeo, lensMat);
    this.lensMesh.position.set(0, -0.12, 0);
    this.lensMesh.rotation.x = Math.PI;
    this.eyeGroup.add(this.lensMesh);

    // 3. Etched Reticle Crosshairs
    const lineMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 });
    const hLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.45, 0, 0), new THREE.Vector3(0.45, 0, 0)]);
    const vLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -0.45), new THREE.Vector3(0, 0, 0.45)]);
    const hLine = new THREE.Line(hLineGeo, lineMat);
    const vLine = new THREE.Line(vLineGeo, lineMat);
    this.eyeGroup.add(hLine);
    this.eyeGroup.add(vLine);

    // 4. Downward Collimated Alignment Laser Beam
    const beamGeo = new THREE.CylinderGeometry(0.015, 0.45, this.height + 0.6, 16);
    beamGeo.translate(0, -(this.height + 0.6) / 2, 0);
    this.guideRayMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.25,
      depthWrite: false
    });
    this.guideRay = new THREE.Mesh(beamGeo, this.guideRayMat);
    this.eyeGroup.add(this.guideRay);
  }

  createSephirotInternalArchitecture() {
    this.sephirotGroup = new THREE.Group();
    this.pyramidGroup.add(this.sephirotGroup);

    // 1. LIENZO: Central Axial Crystalline Shaft (Keter to Malkhut Axis)
    const shaftHeight = this.height * 0.88;
    const spineGeo = new THREE.CylinderGeometry(0.2, 0.2, shaftHeight, 6);
    this.spineMesh = new THREE.Mesh(spineGeo, this.matLienzoCrystal);
    this.spineMesh.position.set(0, 0, 0);
    this.sephirotGroup.add(this.spineMesh);

    // 4 Vertical Titanium Clamping Rails
    for (let r = 0; r < 4; r++) {
      const angle = (r * Math.PI) / 2;
      const railGeo = new THREE.BoxGeometry(0.025, shaftHeight, 0.04);
      const railMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(Math.cos(angle) * 0.22, 0, Math.sin(angle) * 0.22);
      this.sephirotGroup.add(rail);
    }

    // 5 Encoded Revision Strata Rings
    this.revisionRings = [];
    for (let i = 0; i < 5; i++) {
      const ringGeo = new THREE.TorusGeometry(0.3, 0.014, 8, 32);
      ringGeo.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.85,
        metalness: 0.9
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(0, 1.8 - i * 0.9, 0);
      this.sephirotGroup.add(ringMesh);
      this.revisionRings.push(ringMesh);
    }

    // 2. SHIM: Da'at & Gevurah / Chesed Metrology Chamber (Transverse Scanning Gallery)
    this.shimGroup = new THREE.Group();
    this.shimGroup.position.set(0, 0.3, 0);
    this.sephirotGroup.add(this.shimGroup);

    const discGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.035, 32);
    this.shimDisc = new THREE.Mesh(discGeo, this.matShimLaser);
    this.shimGroup.add(this.shimDisc);

    // Metrology Alignment Grid
    const gridGeo = new THREE.PlaneGeometry(2.1, 0.85);
    gridGeo.rotateX(-Math.PI / 2);
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.4 });
    const gridPlane = new THREE.Mesh(gridGeo, gridMat);
    gridPlane.position.set(0, 0.025, 0.25);
    this.shimGroup.add(gridPlane);

    // Missing Gap Inspection Metrology Box
    const gapGeo = new THREE.BoxGeometry(0.3, 0.045, 0.2);
    const gapMat = new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true });
    this.gapMesh = new THREE.Mesh(gapGeo, gapMat);
    this.gapMesh.position.set(0.65, 0.035, 0.3);
    this.shimGroup.add(this.gapMesh);

    // 3. VAV: Tiferet Synthesis Forge (Heart of the Tree)
    this.vavGroup = new THREE.Group();
    this.vavGroup.position.set(0, -1.2, -0.2);
    this.sephirotGroup.add(this.vavGroup);

    const createTrack = (z, color, emissive) => {
      const group = new THREE.Group();
      const railGeo = new THREE.BoxGeometry(2.7, 0.05, 0.15);
      const railMat = new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: 0.85, metalness: 0.9, roughness: 0.2 });
      const rail = new THREE.Mesh(railGeo, railMat);
      group.add(rail);

      for (let c = -3; c <= 3; c++) {
        const cellGeo = new THREE.BoxGeometry(0.15, 0.03, 0.09);
        const cellMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.95 });
        const cell = new THREE.Mesh(cellGeo, cellMat);
        cell.position.set(c * 0.36, 0.03, 0);
        group.add(cell);
      }

      group.position.set(0, 0, z);
      this.vavGroup.add(group);
      return rail;
    };

    this.cutTrack = createTrack(-0.32, 0xf59e0b, 0xd97706);
    this.capTrack = createTrack(0, 0x38bdf8, 0x0284c7);
    this.motTrack = createTrack(0.32, 0xa855f7, 0x9333ea);

    // 4. HE: Malkhut (The Manifested Kingdom / Public Interface)
    this.heGroup = new THREE.Group();
    this.sephirotGroup.add(this.heGroup);

    const hePortalGeo = new THREE.BoxGeometry(0.7, 0.45, 0.28);
    this.he1Mat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.55, metalness: 0.88 });
    this.he1Mesh = new THREE.Mesh(hePortalGeo, this.he1Mat);
    this.he1Mesh.position.set(1.6, 1.3, 1.2);
    this.heGroup.add(this.he1Mesh);

    const he2PortalGeo = new THREE.BoxGeometry(0.8, 0.55, 0.32);
    this.he2Mat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.55, metalness: 0.88 });
    this.he2Mesh = new THREE.Mesh(he2PortalGeo, this.he2Mat);
    this.he2Mesh.position.set(1.9, -1.3, 1.4);
    this.heGroup.add(this.he2Mesh);

    // 5. Connecting Sephirot Energy Paths
    const pathPoints = [
      new THREE.Vector3(0, this.halfHeight - 0.4, 0), // Keter
      new THREE.Vector3(0, 0.3, 0), // Da'at / Shim
      new THREE.Vector3(0, -1.2, 0), // Tiferet / Vav
      new THREE.Vector3(1.9, -1.3, 1.4) // Malkhut / He
    ];
    const pathCurve = new THREE.CatmullRomCurve3(pathPoints);
    const pathGeo = new THREE.TubeGeometry(pathCurve, 32, 0.025, 8, false);
    const pathMesh = new THREE.Mesh(pathGeo, this.matSephirotPath);
    this.sephirotGroup.add(pathMesh);
  }

  createCelestialMoonAndWorld() {
    this.moonWorldGroup = new THREE.Group();
    this.moonWorldGroup.position.set(7.5, -4.5, -8.0);
    this.scene.add(this.moonWorldGroup);

    // 1. The Moon (Publisher & Observability Feedback Body)
    const moonGeo = new THREE.SphereGeometry(1.6, 32, 32);
    this.moonMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.82,
      metalness: 0.3
    });
    this.moonMesh = new THREE.Mesh(moonGeo, this.moonMat);
    this.moonWorldGroup.add(this.moonMesh);

    // Monochromatic Wireframe & Atmospheric Rim
    const wireGeo = new THREE.WireframeGeometry(moonGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.18 });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    this.moonWorldGroup.add(wireMesh);

    // 2. Publisher Outbound Flow Nodes & Metrics Inbound Loops
    this.moonNodes = [
      { id: 'PUBLISHER_DISPATCH', pos: new THREE.Vector3(0.7, 1.2, 0.6), color: 0x38bdf8 },
      { id: 'METRICS_FEEDBACK', pos: new THREE.Vector3(-0.8, -0.9, 0.8), color: 0x10b981 }
    ];

    this.moonNodes.forEach((n) => {
      const sGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const sMat = new THREE.MeshBasicMaterial({ color: n.color });
      const sMesh = new THREE.Mesh(sGeo, sMat);
      sMesh.position.copy(n.pos);
      this.moonWorldGroup.add(sMesh);
    });

    // 3. Outbound Flow Arcs from Moon to Pyramid World Base
    const pubArcCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(7.5 + 0.7, -4.5 + 1.2, -8.0 + 0.6),
      new THREE.Vector3(4.0, -1.0, -3.0),
      new THREE.Vector3(0, -this.halfHeight, 0)
    );
    const pubArcGeo = new THREE.TubeGeometry(pubArcCurve, 32, 0.02, 6, false);
    const pubArcMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });
    const pubArcMesh = new THREE.Mesh(pubArcGeo, pubArcMat);
    this.scene.add(pubArcMesh);

    // 4. Return Metrics Telemetry Loop Arc
    const metricsArcCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, -this.halfHeight, 0),
      new THREE.Vector3(3.5, -4.0, -2.0),
      new THREE.Vector3(7.5 - 0.8, -4.5 - 0.9, -8.0 + 0.8)
    );
    const metricsArcGeo = new THREE.TubeGeometry(metricsArcCurve, 32, 0.02, 6, false);
    const metricsArcMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.35 });
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
    createProxy('LIENZO', [0.9, 2.4, 0.9], [0, 0, 0]);
    createProxy('SHIM', [2.4, 0.4, 1.4], [0, 0.3, 0.4]);
    createProxy('VAV', [2.8, 0.8, 1.2], [0, -1.2, 0.3]);
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
        truthLayer: truth.layer,
        evidenceCount: truth.evidenceCount,
        hasReleaseProof: truth.hasReleaseProof
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
      case 'LIENZO': applyMat(this.matLienzoCrystal); break;
      case 'SHIM': applyMat(this.matShimLaser); break;
      case 'VAV': applyMat(this.cutTrack?.material); applyMat(this.capTrack?.material); applyMat(this.motTrack?.material); break;
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
      if (this.lensMesh) this.lensMesh.rotation.z = time * 0.0004;
      if (this.moonWorldGroup) this.moonWorldGroup.rotation.y = time * 0.0001;
      if (this.coronaMesh) this.coronaMesh.rotation.z = time * 0.00005;
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
        eyeRotation: this.lensMesh ? this.lensMesh.rotation.z : 0
      }),
      isReducedMotionActive: () => this.cameraDirector?.checkReducedMotion() || false
    };
  }

  setupFallbackDebugHooks() {
    window.__ABRAXAS_STATUS_DEBUG__ = {
      getGizaGeometryMetrics: () => ({ baseSide: 8.0, height: 5.092, heightToBaseRatio: 0.6365, slopeDegrees: 51.8487, gizaProportionsVerified: true }),
      getCapabilityRegistry: () => (this.publicKnowledge.modules || []).map((m) => ({ moduleId: m.id, truthLayer: 'RELEASED_CURRENT', visible: false, opacity: 0, transparent: true, wireframe: true, emissiveIntensity: 0 })),
      getHitProxyScreenPosition: () => ({ x: 0, y: 0, inFrustum: false, z: 0 }),
      getReducedMotionState: () => ({ cameraPosition: { x: 0, y: 0, z: 0 }, pulsePosition: { x: 0, y: 0, z: 0 }, yodRotation: 0, eyeRotation: 0 }),
      isReducedMotionActive: () => true
    };
  }

  getModuleMaterial(moduleId) {
    switch (moduleId) {
      case 'YOD': return this.matGoldenPyramidion;
      case 'HE': return this.he1Mat;
      case 'LIENZO': return this.matLienzoCrystal;
      case 'SHIM': return this.matShimLaser;
      case 'VAV': return this.cutTrack?.material;
      case 'ARQUITECTO': return this.guideRayMat;
      default: return null;
    }
  }
}
