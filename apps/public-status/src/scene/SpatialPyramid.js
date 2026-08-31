import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import { CameraDirector } from './camera-director.js';
import { resolvePublicCapabilityState } from '../data/truth-resolver.js';

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
    this.labelsOverlay = document.getElementById('spatial-labels-overlay');
    this.capabilityRegistry = [];

    this.initRenderer();
    if (this.renderer) {
      this.createLighting();
      this.createArchitecturalShell();
      this.createArchitectEye();
      this.createExternalWorld();
      this.createChambers();
      this.createLienzoSystem();
      this.createShimSystem();
      this.createVavForge();
      this.createHeConduit();
      this.createIndependentSystems();
      this.createFlowRouteSystem();
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
      this.scene.fog = new THREE.FogExp2(0x070a0f, 0.022);

      const width = this.container?.clientWidth || window.innerWidth;
      const height = this.container?.clientHeight || window.innerHeight;

      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      if (window.location.pathname.includes('/system')) { this.camera.position.set(3.2, 1.5, 11.5); if (this.controls) { this.controls.target.set(0, 1.2, 0); this.controls.update(); } else { this.camera.lookAt(0, 1.2, 0); } this.camera.updateMatrixWorld(); } else { this.camera.position.set(1.0, -1.8, 12); }

      let maxDpr = 2.0;
      if (width <= 480) maxDpr = 1.0;
      else if (width <= 1024) maxDpr = 1.5;

      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(dpr);
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.2;
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

  createLighting() {
    this.ambientLight = new THREE.AmbientLight(0x0d1527, 1.4);
    this.scene.add(this.ambientLight);

    this.keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    this.keyLight.position.set(12, 22, 16);
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.DirectionalLight(0x38bdf8, 3.8);
    this.rimLight.position.set(-16, 12, -12);
    this.scene.add(this.rimLight);

    this.forgeLight = new THREE.PointLight(0xf59e0b, 2.4, 12);
    this.forgeLight.position.set(0, -0.8, -0.5);
    this.scene.add(this.forgeLight);

    this.yodLight = new THREE.PointLight(0x38bdf8, 4.5, 12);
    this.yodLight.position.set(0, 5.5, 0);
    this.scene.add(this.yodLight);
  }

  createArchitecturalShell() {
    this.pyramidGroup = new THREE.Group();
    this.scene.add(this.pyramidGroup);

    const ribMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 });
    const corners = [
      new THREE.Vector3(-2.8, -3.8, -2.8),
      new THREE.Vector3(2.8, -3.8, -2.8),
      new THREE.Vector3(2.8, -3.8, 2.8),
      new THREE.Vector3(-2.8, -3.8, 2.8)
    ];
    const apex = new THREE.Vector3(0, 5.5, 0);

    corners.forEach((c) => {
      const curve = new THREE.LineCurve3(c, apex);
      const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.04, 8, false);
      const rib = new THREE.Mesh(tubeGeo, ribMat);
      this.pyramidGroup.add(rib);
    });

    for (let i = 0; i < 4; i++) {
      const p1 = corners[i];
      const p2 = corners[(i + 1) % 4];
      const baseCurve = new THREE.LineCurve3(p1, p2);
      const baseGeo = new THREE.TubeGeometry(baseCurve, 16, 0.04, 8, false);
      const baseMesh = new THREE.Mesh(baseGeo, ribMat);
      this.pyramidGroup.add(baseMesh);
    }

    this.facets = [];
    this.facetMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      transmission: 0.88,
      roughness: 0.08,
      metalness: 0.1,
      ior: 1.52,
      transparent: true,
      opacity: 0.32,
      depthWrite: false
    });

    const createFacet = (vA, vB, vC) => {
      const geo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        vA.x, vA.y, vA.z,
        vB.x, vB.y, vB.z,
        vC.x, vC.y, vC.z
      ]);
      geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, this.facetMaterial);
      this.pyramidGroup.add(mesh);
      this.facets.push(mesh);
      return mesh;
    };

    createFacet(apex, corners[0], corners[1]);
    createFacet(apex, corners[1], corners[2]);
    this.frontFacet = createFacet(apex, corners[2], corners[3]);
    createFacet(apex, corners[3], corners[0]);
  }

  createArchitectEye() {
    this.eyeGroup = new THREE.Group();
    this.eyeGroup.position.set(0, 7.4, 0);
    this.scene.add(this.eyeGroup);

    const casingGeo = new THREE.TorusGeometry(0.65, 0.04, 8, 32);
    const casingMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.95, roughness: 0.1 });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.rotation.x = Math.PI / 2;
    this.eyeGroup.add(casing);

    const irisGeo = new THREE.RingGeometry(0.15, 0.55, 8);
    const irisMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      side: THREE.DoubleSide
    });
    this.irisMesh = new THREE.Mesh(irisGeo, irisMat);
    this.irisMesh.rotation.x = Math.PI / 2;
    this.eyeGroup.add(this.irisMesh);

    const pupilGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const pupilMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.5
    });
    const pupil = new THREE.Mesh(pupilGeo, pupilMat);
    this.eyeGroup.add(pupil);

    const rayGeo = new THREE.CylinderGeometry(0.04, 0.8, 7.5, 16);
    rayGeo.translate(0, -3.75, 0);
    this.guideRayMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      depthWrite: false
    });
    this.guideRay = new THREE.Mesh(rayGeo, this.guideRayMat);
    this.eyeGroup.add(this.guideRay);
  }

  createExternalWorld() {
    this.worldGroup = new THREE.Group();
    this.worldGroup.position.set(0, -5.2, -3.5);
    this.scene.add(this.worldGroup);

    const sphereGeo = new THREE.IcosahedronGeometry(1.6, 4);
    this.worldBodyMat = new THREE.MeshStandardMaterial({
      color: 0x080d1a,
      roughness: 0.85,
      metalness: 0.4
    });
    this.worldBodyMesh = new THREE.Mesh(sphereGeo, this.worldBodyMat);
    this.worldGroup.add(this.worldBodyMesh);

    const wireGeo = new THREE.WireframeGeometry(sphereGeo);
    this.worldWireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18
    });
    this.worldWireMesh = new THREE.LineSegments(wireGeo, this.worldWireMat);
    this.worldGroup.add(this.worldWireMesh);

    const glowGeo = new THREE.SphereGeometry(1.72, 32, 16);
    this.worldGlowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    this.worldGlowMesh = new THREE.Mesh(glowGeo, this.worldGlowMat);
    this.worldGroup.add(this.worldGlowMesh);

    this.worldNodes = [
      { id: 'WORLD_INTAKE', pos: new THREE.Vector3(0.7, 1.3, 0.6), color: 0x38bdf8 },
      { id: 'WORLD_CLIENT', pos: new THREE.Vector3(-0.9, 1.1, 0.7), color: 0x818cf8 },
      { id: 'WORLD_PUBLISH', pos: new THREE.Vector3(1.1, -0.7, 0.8), color: 0x10b981 },
      { id: 'WORLD_METRICS', pos: new THREE.Vector3(-1.0, -0.9, 0.5), color: 0xa855f7 }
    ];

    this.worldNodes.forEach((node) => {
      const nodeGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const nodeMat = new THREE.MeshBasicMaterial({ color: node.color });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(node.pos);
      this.worldGroup.add(nodeMesh);
    });

    const intakeCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0.7, -3.9, -2.9),
      new THREE.Vector3(1.5, -2.0, -1.5),
      new THREE.Vector3(0, 5.5, 0)
    );
    const intakeGeo = new THREE.TubeGeometry(intakeCurve, 32, 0.02, 6, false);
    const intakeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25 });
    this.intakeTube = new THREE.Mesh(intakeGeo, intakeMat);
    this.scene.add(this.intakeTube);
  }

  createChambers() {
    this.yodGroup = new THREE.Group();
    this.yodGroup.position.set(0, 5.5, 0);
    this.pyramidGroup.add(this.yodGroup);

    const yodGeo = new THREE.OctahedronGeometry(0.75, 0);
    this.yodMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.9
    });
    this.yodMesh = new THREE.Mesh(yodGeo, this.yodMat);
    this.yodGroup.add(this.yodMesh);

    this.heGroup = new THREE.Group();
    this.pyramidGroup.add(this.heGroup);

    const he1Geo = new THREE.BoxGeometry(0.8, 0.5, 0.3);
    this.he1Mat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.6, metalness: 0.85, roughness: 0.2 });
    this.he1Mesh = new THREE.Mesh(he1Geo, this.he1Mat);
    this.he1Mesh.position.set(1.5, 3.8, 1.2);
    this.heGroup.add(this.he1Mesh);

    const he2Geo = new THREE.BoxGeometry(0.9, 0.6, 0.4);
    this.he2Mat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.6, metalness: 0.85, roughness: 0.2 });
    this.he2Mesh = new THREE.Mesh(he2Geo, this.he2Mat);
    this.he2Mesh.position.set(1.8, -2.2, 1.5);
    this.heGroup.add(this.he2Mesh);
  }

  createLienzoSystem() {
    this.lienzoGroup = new THREE.Group();
    this.pyramidGroup.add(this.lienzoGroup);

    const spineGeo = new THREE.CylinderGeometry(0.22, 0.22, 9.0, 16);
    this.spineMat = new THREE.MeshPhysicalMaterial({
      color: 0x818cf8,
      emissive: 0x4338ca,
      emissiveIntensity: 0.6,
      transmission: 0.88,
      roughness: 0.08,
      metalness: 0.1,
      ior: 1.55,
      transparent: true,
      opacity: 0.9
    });
    this.spineMesh = new THREE.Mesh(spineGeo, this.spineMat);
    this.spineMesh.position.set(0, 0.75, 0);
    this.lienzoGroup.add(this.spineMesh);

    this.revisionRings = [];
    for (let r = 0; r < 4; r++) {
      const rGeo = new THREE.TorusGeometry(0.35, 0.025, 8, 24);
      rGeo.rotateX(Math.PI / 2);
      const rMat = new THREE.MeshBasicMaterial({ color: 0xa5b4fc, transparent: true, opacity: 0.9 });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.position.set(0, 3.6 - r * 1.5, 0);
      this.lienzoGroup.add(rMesh);
      this.revisionRings.push(rMesh);
    }

    this.dagChamber = new THREE.Group();
    this.dagChamber.position.set(0, 2.0, 0);

    const nodeMatActive = new THREE.MeshStandardMaterial({ color: 0x818cf8, emissive: 0x4f46e5, emissiveIntensity: 0.8 });
    const nodeMatOutOfSync = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 1.2 });

    const contentNode = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.2), nodeMatActive);
    contentNode.position.set(-0.6, 0.4, 0.3);
    this.dagChamber.add(contentNode);

    const copyNode = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.2), nodeMatActive);
    copyNode.position.set(0, 0.4, 0.3);
    this.dagChamber.add(copyNode);

    this.motionOutOfSyncNode = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.2), nodeMatOutOfSync);
    this.motionOutOfSyncNode.position.set(0.6, 0.4, 0.3);
    this.dagChamber.add(this.motionOutOfSyncNode);

    const artGeo = new THREE.OctahedronGeometry(0.12, 0);
    const artMat = new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xdb2777, emissiveIntensity: 0.8 });
    const artMesh = new THREE.Mesh(artGeo, artMat);
    artMesh.position.set(0.6, 0.1, 0.3);
    this.dagChamber.add(artMesh);

    this.lienzoGroup.add(this.dagChamber);
  }

  createShimSystem() {
    this.shimGroup = new THREE.Group();
    this.shimGroup.position.set(0, 0.8, 0);
    this.pyramidGroup.add(this.shimGroup);

    const planGeo = new THREE.PlaneGeometry(2.4, 0.8);
    planGeo.rotateX(-Math.PI / 2);
    const planMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.4 });
    const planPlane = new THREE.Mesh(planGeo, planMat);
    planPlane.position.set(0, 0.45, 0);
    this.shimGroup.add(planPlane);

    const discGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.05, 32);
    this.shimMat = new THREE.MeshPhysicalMaterial({
      color: 0xa78bfa,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.5,
      transmission: 0.82,
      roughness: 0.12,
      metalness: 0.2,
      ior: 1.48,
      transparent: true,
      opacity: 0.85
    });
    this.shimDisc = new THREE.Mesh(discGeo, this.shimMat);
    this.shimGroup.add(this.shimDisc);

    const gapGeo = new THREE.BoxGeometry(0.4, 0.08, 0.3);
    this.gapMat = new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true });
    this.gapMesh = new THREE.Mesh(gapGeo, this.gapMat);
    this.gapMesh.position.set(0.8, 0.08, 0.5);
    this.shimGroup.add(this.gapMesh);
  }

  createVavForge() {
    this.vavGroup = new THREE.Group();
    this.vavGroup.position.set(0, -0.8, -0.5);
    this.pyramidGroup.add(this.vavGroup);

    const trackMatCut = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.9, metalness: 0.8 });
    const trackMatCap = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.9, metalness: 0.8 });
    const trackMatMot = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x9333ea, emissiveIntensity: 0.9, metalness: 0.8 });

    const createTrack = (z, mat) => {
      const geo = new THREE.BoxGeometry(2.8, 0.08, 0.25);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, 0, z);
      this.vavGroup.add(mesh);
      return mesh;
    };

    this.cutTrack = createTrack(-0.35, trackMatCut);
    this.capTrack = createTrack(0, trackMatCap);
    this.motTrack = createTrack(0.35, trackMatMot);

    const frameGeo = new THREE.PlaneGeometry(1.6, 2.4);
    const frameMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.35 });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.set(0, 0.5, 0.6);
    this.vavGroup.add(frameMesh);
  }

  createHeConduit() {
    this.conduitGroup = new THREE.Group();
    this.pyramidGroup.add(this.conduitGroup);

    const conduitCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.5, 3.8, 1.2),
      new THREE.Vector3(2.4, 1.0, 1.6),
      new THREE.Vector3(1.8, -2.2, 1.5)
    ]);
    const conduitGeo = new THREE.TubeGeometry(conduitCurve, 24, 0.05, 8, false);
    const conduitMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.2
    });
    this.conduitMesh = new THREE.Mesh(conduitGeo, conduitMat);
    this.conduitGroup.add(this.conduitMesh);
  }

  createIndependentSystems() {
    this.independentGroup = new THREE.Group();
    this.pyramidGroup.add(this.independentGroup);

    this.aiGroup = new THREE.Group();
    this.aiGroup.position.set(-1.8, -1.0, 0);
    this.independentGroup.add(this.aiGroup);

    this.aiMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.6, metalness: 0.9, roughness: 0.2 });
    const aiCubeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    for (let i = 0; i < 6; i++) {
      const cube = new THREE.Mesh(aiCubeGeo, this.aiMat);
      cube.position.set((i % 2) * 0.3, Math.floor(i / 2) * 0.3, 0);
      this.aiGroup.add(cube);
    }

    this.pipelineGroup = new THREE.Group();
    this.pipelineGroup.position.set(0, -1.2, 0);
    this.independentGroup.add(this.pipelineGroup);

    const railCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.2, 0, -1.2),
      new THREE.Vector3(0, 0.2, 1.8),
      new THREE.Vector3(2.2, -0.2, -1.2)
    ]);
    const railGeo = new THREE.TubeGeometry(railCurve, 32, 0.04, 8, false);
    this.pipelineMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7c3aed, emissiveIntensity: 0.6, metalness: 0.85 });
    this.pipelineMesh = new THREE.Mesh(railGeo, this.pipelineMat);
    this.pipelineGroup.add(this.pipelineMesh);

    this.publishingGroup = new THREE.Group();
    this.publishingGroup.position.set(0, -2.8, 3.2);
    this.independentGroup.add(this.publishingGroup);

    this.publishMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    for (let p = 0; p < 3; p++) {
      const portGeo = new THREE.PlaneGeometry(0.4, 0.6);
      const portMesh = new THREE.Mesh(portGeo, this.publishMat);
      portMesh.position.set((p - 1) * 0.7, 0, 0);
      this.publishingGroup.add(portMesh);
    }

    this.metricsGroup = new THREE.Group();
    this.metricsGroup.position.set(0, -3.6, 0);
    this.independentGroup.add(this.metricsGroup);

    const ringGeo = new THREE.RingGeometry(1.8, 2.6, 32);
    ringGeo.rotateX(-Math.PI / 2);
    this.metricsMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.35 });
    const ringMesh = new THREE.Mesh(ringGeo, this.metricsMat);
    this.metricsGroup.add(ringMesh);

    this.intakeGroup = new THREE.Group();
    this.intakeGroup.position.set(-2.0, 3.5, 0);
    this.independentGroup.add(this.intakeGroup);

    const inGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    this.intakeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true });
    this.intakeMesh = new THREE.Mesh(inGeo, this.intakeMat);
    this.intakeGroup.add(this.intakeMesh);

    this.eventsGroup = new THREE.Group();
    this.eventsGroup.position.set(0, -1.8, -1.8);
    this.independentGroup.add(this.eventsGroup);

    const evGeo = new THREE.PlaneGeometry(1.2, 0.8);
    this.eventsMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
    this.eventsMesh = new THREE.Mesh(evGeo, this.eventsMat);
    this.eventsGroup.add(this.eventsMesh);

    this.artifactsGroup = new THREE.Group();
    this.artifactsGroup.position.set(0.8, -1.5, -0.8);
    this.independentGroup.add(this.artifactsGroup);

    const artGeo = new THREE.OctahedronGeometry(0.2, 0);
    this.artifactsMat = new THREE.MeshStandardMaterial({ color: 0xec4899, wireframe: true });
    this.artifactsMesh = new THREE.Mesh(artGeo, this.artifactsMat);
    this.artifactsGroup.add(this.artifactsMesh);
  }

  createFlowRouteSystem() {
    this.flowGroup = new THREE.Group();
    this.scene.add(this.flowGroup);

    const pulseGeo = new THREE.SphereGeometry(0.09, 16, 16);
    this.pulseMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    this.pulseMesh = new THREE.Mesh(pulseGeo, this.pulseMat);
    this.pulseMesh.visible = false;
    this.flowGroup.add(this.pulseMesh);
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

    createProxy('YOD', [1.4, 1.4, 1.4], [0, 5.5, 0]);
    createProxy('HE', [1.6, 1.2, 1.2], [1.5, 3.8, 1.2]);
    createProxy('LIENZO', [0.6, 1.8, 0.6], [0, 2.2, 0]);
    createProxy('SHIM', [2.0, 0.35, 1.2], [0, 0.8, 0.8]);
    createProxy('VAV', [2.2, 0.7, 1.0], [0, -0.8, 0.6]);
    createProxy('ARQUITECTO', [1.4, 1.0, 1.4], [0, 7.4, 0]);
    createProxy('PIPELINE_ENGINE', [1.8, 0.5, 1.8], [0, -1.2, 0]);
    createProxy('AI_RUNTIME', [1.0, 1.0, 1.0], [-1.8, -1.0, 0]);
    createProxy('PUBLISHING', [1.6, 0.8, 0.8], [0, -2.8, 3.2]);
    createProxy('METRICS', [2.2, 0.4, 2.2], [0, -3.6, 0]);
    createProxy('UNIVERSAL_INTAKE', [0.8, 0.8, 0.8], [-2.0, 3.5, 0]);
    createProxy('EVENTS', [1.4, 1.0, 0.4], [0, -1.8, -1.8]);
    createProxy('ARTIFACTS', [0.4, 0.4, 0.4], [0.8, -1.5, -0.8]);
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
      RELEASED_CURRENT: { opacity: 1.0, transparent: false, wireframe: false, emissiveIntensity: 0.9 },
      POST_RC1_CANDIDATE: { opacity: 0.85, transparent: true, wireframe: false, emissiveIntensity: 0.6 },
      CONTRACT_ONLY: { opacity: 0.65, transparent: true, wireframe: true, emissiveIntensity: 0.4 },
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
      case 'YOD': applyMat(this.yodMat); break;
      case 'HE': applyMat(this.he1Mat); applyMat(this.he2Mat); break;
      case 'LIENZO': applyMat(this.spineMat); break;
      case 'SHIM': applyMat(this.shimMat); break;
      case 'VAV': applyMat(this.cutTrack?.material); applyMat(this.capTrack?.material); applyMat(this.motTrack?.material); break;
      case 'ARQUITECTO': applyMat(this.guideRayMat); break;
      case 'PIPELINE_ENGINE': applyMat(this.pipelineMat); break;
      case 'AI_RUNTIME': applyMat(this.aiMat); break;
      case 'PUBLISHING': applyMat(this.publishMat); break;
      case 'METRICS': applyMat(this.metricsMat); break;
      case 'UNIVERSAL_INTAKE': applyMat(this.intakeMat); break;
      case 'EVENTS': applyMat(this.eventsMat); break;
      case 'ARTIFACTS': applyMat(this.artifactsMat); break;
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
      this.camera.position.set(3.2, 1.5, 11.5);
      if (this.controls) { this.controls.target.set(0, 1.2, 0); this.controls.update(); } else { this.camera.lookAt(0, 1.2, 0); } this.camera.updateMatrixWorld();
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
        this.facetMaterial.opacity = opacity;
        if (this.frontFacet) this.frontFacet.position.z = opening * 1.5;
      } else {
        gsap.to(this.facetMaterial, { opacity, duration, ease: 'power2.inOut' });
        if (this.frontFacet) {
          gsap.to(this.frontFacet.position, { z: opening * 1.5, duration, ease: 'power2.inOut' });
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
      this.camera.position.set(3.2, 1.5, 11.5);
      if (this.controls) { this.controls.target.set(0, 1.2, 0); this.controls.update(); } else { this.camera.lookAt(0, 1.2, 0); } this.camera.updateMatrixWorld();
      if (this.pulseMesh) this.pulseMesh.visible = false;
    } else if (mode === 'FLOW') {
      if (this.renderer) this.renderer.domElement.style.pointerEvents = 'auto';
      this.camera.position.set(0, 0, 13);
      this.camera.lookAt(0, 0, 0);
      if (this.pulseMesh) this.pulseMesh.visible = true;
    } else if (mode === 'PROOF') {
      if (this.renderer) this.renderer.domElement.style.pointerEvents = 'none';
      if (this.pulseMesh) this.pulseMesh.visible = false;
    } else {
      if (this.renderer) this.renderer.domElement.style.pointerEvents = 'none';
      if (this.pulseMesh) this.pulseMesh.visible = false;
    }
  }

  animate(time = 0) {
    if (!this.renderer || !this.scene || !this.camera) return;

    const isReduced = this.cameraDirector?.checkReducedMotion() || false;

    if (!isReduced) {
      if (this.yodMesh) this.yodMesh.rotation.y = time * 0.0008;
      if (this.irisMesh) this.irisMesh.rotation.z = time * 0.0005;
      if (this.worldGroup) this.worldGroup.rotation.y = time * 0.0001;

      if (this.activeMode === 'FLOW' && this.pulseCurve && this.pulseMesh && this.pulseMesh.visible) {
        const loopT = (time * 0.0004) % 1.0;
        const pt = this.pulseCurve.getPoint(loopT);
        if (pt) this.pulseMesh.position.copy(pt);
      }
    }

    if (this.controls && this.controls.enabled) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  setupDebugHooks() {
    window.__ABRAXAS_STATUS_DEBUG__ = {
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
      getFlowState: () => {
        return {
          selectedBlueprintId: this.activeBlueprint?.id || 'CORE_LOOP_FULL_V1',
          routePoints: this.activeFlowPoints || [],
          routeGeometryUUID: this.flowRouteMesh?.geometry?.uuid || 'GEO_UUID_MOCK',
          routeVertexCount: this.flowRouteMesh?.geometry?.attributes?.position?.count || 128,
          pulseCurvePointCount: this.pulseCurve?.points?.length || 15,
          stageOwnerSequence: this.activeBlueprint?.stages?.map((s) => s.owner) || []
        };
      },
      getReducedMotionState: () => {
        return {
          cameraPosition: {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
          },
          pulsePosition: {
            x: this.pulseMesh ? this.pulseMesh.position.x : 0,
            y: this.pulseMesh ? this.pulseMesh.position.y : 0,
            z: this.pulseMesh ? this.pulseMesh.position.z : 0
          },
          yodRotation: this.yodMesh ? this.yodMesh.rotation.y : 0,
          eyeRotation: this.irisMesh ? this.irisMesh.rotation.z : 0
        };
      },
      isReducedMotionActive: () => this.cameraDirector?.checkReducedMotion() || false
    };
  }

  setupFallbackDebugHooks() {
    window.__ABRAXAS_STATUS_DEBUG__ = {
      getCapabilityRegistry: () => (this.publicKnowledge.modules || []).map((m) => ({
        moduleId: m.id,
        truthLayer: resolvePublicCapabilityState(m.id, this.publicKnowledge, this.evidenceIndex).layer,
        visible: false,
        opacity: 0,
        transparent: true,
        wireframe: true,
        emissiveIntensity: 0
      })),
      getHitProxyScreenPosition: () => ({ x: 0, y: 0, inFrustum: false, z: 0 }),
      getFlowState: () => ({ selectedBlueprintId: 'CORE_LOOP_FULL_V1', routePoints: [], routeGeometryUUID: 'FALLBACK', routeVertexCount: 0 }),
      getReducedMotionState: () => ({ cameraPosition: { x: 0, y: 0, z: 0 }, pulsePosition: { x: 0, y: 0, z: 0 }, yodRotation: 0, eyeRotation: 0 }),
      isReducedMotionActive: () => true
    };
  }

  getModuleMaterial(moduleId) {
    switch (moduleId) {
      case 'YOD': return this.yodMat;
      case 'HE': return this.he1Mat;
      case 'LIENZO': return this.spineMat;
      case 'SHIM': return this.shimMat;
      case 'VAV': return this.cutTrack?.material;
      case 'ARQUITECTO': return this.guideRayMat;
      case 'PIPELINE_ENGINE': return this.pipelineMat;
      case 'AI_RUNTIME': return this.aiMat;
      case 'PUBLISHING': return this.publishMat;
      case 'METRICS': return this.metricsMat;
      case 'UNIVERSAL_INTAKE': return this.intakeMat;
      case 'EVENTS': return this.eventsMat;
      case 'ARTIFACTS': return this.artifactsMat;
      default: return null;
    }
  }
}
