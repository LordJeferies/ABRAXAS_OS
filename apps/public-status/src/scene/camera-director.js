import * as THREE from 'three';
import gsap from 'gsap';

export class CameraDirector {
  constructor(camera, eyeGroup, guideRayMat, onShotChange = null) {
    this.camera = camera;
    this.eyeGroup = eyeGroup;
    this.guideRayMat = guideRayMat;
    this.onShotChange = onShotChange;
    this.currentShotIndex = 0;
    this.activeTween = null;
    this.isReducedMotion = false;

    this.initShots();
    this.initContinuousSpline();
    this.checkReducedMotion();

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.addEventListener) mq.addEventListener('change', () => this.checkReducedMotion());
      else if (mq.addListener) mq.addListener(() => this.checkReducedMotion());
    }
  }

  checkReducedMotion() {
    if (typeof window === 'undefined') return false;
    this.isReducedMotion = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || !!window.__ABRAXAS_REDUCED_MOTION_FORCE__;
    return this.isReducedMotion;
  }

  initShots() {
    // 10 Distinct Narrative States (S0 to S9) matching all 9 Acts + Final CTA
    this.shots = [
      {
        id: 'S0',
        chapter: '0. PREMISE // GENESIS',
        name: 'HERO',
        label: '0. Genesis: GIZA MONUMENTAL ESTABLISHING',
        nodeId: 'HERO',
        cameraPos: new THREE.Vector3(3.8, -0.4, 12.5),
        cameraTarget: new THREE.Vector3(0, 0.2, 0),
        shellOpening: 0.0,
        shellOpacity: 0.85,
        semanticIntent: 'Giza 51.8487° monumental massing with black basalt stone courses.'
      },
      {
        id: 'S1',
        chapter: '1. ARCHITECTURE // FOUR WORLDS',
        name: 'FOUR_WORLDS',
        label: '1. Architecture: FOUR WORLDS STRATIFICATION',
        nodeId: 'CORE',
        cameraPos: new THREE.Vector3(2.8, 1.2, 9.5),
        cameraTarget: new THREE.Vector3(0, 0.4, 0),
        shellOpening: 0.25,
        shellOpacity: 0.65,
        semanticIntent: 'Stratification across Atziluth, Beriah, Yetzirah, and Assiah.'
      },
      {
        id: 'S2',
        chapter: '2. INTELLIGENCE // SUPERNAL TRIAD',
        name: 'YOD',
        label: '2. Intelligence: GOLDEN ATZILUTH & APEX',
        nodeId: 'YOD',
        cameraPos: new THREE.Vector3(1.6, 2.8, 4.6),
        cameraTarget: new THREE.Vector3(0, 2.4, 0),
        shellOpening: 0.4,
        shellOpacity: 0.35,
        semanticIntent: 'Macro interior inspection of aged electrum apex and luminous chamber.'
      },
      {
        id: 'S3',
        chapter: '3. IDENTITY // CONTINUITY AXIS',
        name: 'CONTENIDO',
        label: '3. Identity: CONTINUITY AXIS & STRATIGRAPHY',
        nodeId: 'CONTENIDO',
        cameraPos: new THREE.Vector3(1.4, 0.6, 4.2),
        cameraTarget: new THREE.Vector3(0, 0.3, 0),
        shellOpening: 0.65,
        shellOpacity: 0.2,
        semanticIntent: 'Vertical sapphire crystalline core with cognitive stratigraphy.'
      },
      {
        id: 'S4',
        chapter: '4. REALITY // DA\'AT METROLOGY',
        name: 'SHIM',
        label: '4. Reality: SHIM METROLOGY THRESHOLD',
        nodeId: 'SHIM',
        cameraPos: new THREE.Vector3(1.5, 0.3, 3.8),
        cameraTarget: new THREE.Vector3(0, 0.2, 0),
        shellOpening: 0.75,
        shellOpacity: 0.15,
        semanticIntent: 'Da\'at metrology threshold scanning planned vs observed discrepancy.'
      },
      {
        id: 'S5',
        chapter: '5. FORMATION // YETZIRAH CATHEDRAL',
        name: 'VAV',
        label: '5. Formation: VAV BEDROCK SYNTHESIS FORGE',
        nodeId: 'VAV',
        cameraPos: new THREE.Vector3(1.2, -1.2, 4.4),
        cameraTarget: new THREE.Vector3(0, -1.3, 0),
        shellOpening: 0.85,
        shellOpacity: 0.12,
        semanticIntent: 'Subterranean formation cathedral with synchronized synthesis architecture.'
      },
      {
        id: 'S6',
        chapter: '6. OPERATION // ASSIAH VISIBILITY',
        name: 'HE',
        label: '6. Operation: HE CARVED EXTERIOR APERTURES',
        nodeId: 'HE',
        cameraPos: new THREE.Vector3(2.4, 0.2, 5.0),
        cameraTarget: new THREE.Vector3(1.8, 0.1, 1.2),
        shellOpening: 0.5,
        shellOpacity: 0.4,
        semanticIntent: 'Carved inspection and operational apertures embedded in pyramid masonry.'
      },
      {
        id: 'S7',
        chapter: '7. EXTERNAL LOOP // THE CELESTIAL MOON',
        name: 'PUBLISHING',
        label: '7. External Loop: THE CELESTIAL MOON & TELEMETRY',
        nodeId: 'PUBLISHING',
        cameraPos: new THREE.Vector3(5.5, -2.2, 8.5),
        cameraTarget: new THREE.Vector3(4.0, -2.5, -4.0),
        shellOpening: 0.3,
        shellOpacity: 0.5,
        semanticIntent: 'Cosmic perspective: outbound distribution beam and return telemetry feedback.'
      },
      {
        id: 'S8',
        chapter: '8. ADAPTATION // DIMENSION A',
        name: 'ADAPTATION',
        label: '8. Adaptation: CLOSED INTELLIGENCE HELIX',
        nodeId: 'CORE',
        cameraPos: new THREE.Vector3(4.0, 0.6, 11.5),
        cameraTarget: new THREE.Vector3(0, 0.2, 0),
        shellOpening: 0.4,
        shellOpacity: 0.45,
        semanticIntent: 'Closed-loop intelligence helix returning empirical evidence to apex.'
      },
      {
        id: 'S9',
        chapter: 'OPERATIONAL CORE // FINAL CTA',
        name: 'OPERATIONAL_CORE',
        label: 'Operational Core: SYSTEM DASHBOARD TRANSITION',
        nodeId: 'CORE',
        cameraPos: new THREE.Vector3(4.6, 1.4, 12.8),
        cameraTarget: new THREE.Vector3(0, 0.2, 0),
        shellOpening: 0.5,
        shellOpacity: 0.4,
        semanticIntent: 'Final operational overview preparing entry to live interactive dashboard.'
      }
    ];
  }

  initContinuousSpline() {
    const posPoints = this.shots.map(s => s.cameraPos);
    const targetPoints = this.shots.map(s => s.cameraTarget);
    this.posSpline = new THREE.CatmullRomCurve3(posPoints);
    this.targetSpline = new THREE.CatmullRomCurve3(targetPoints);
  }

  interpolateContinuousProgress(progress, onShellUpdate = null) {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    
    // Determine closest shot for metadata
    const exactIndex = clampedProgress * (this.shots.length - 1);
    const shotIdx = Math.round(exactIndex);
    const shot = this.shots[shotIdx] || this.shots[0];

    if (this.currentShotIndex !== shotIdx) {
      this.currentShotIndex = shotIdx;
      if (this.onShotChange) this.onShotChange(shot);
    }

    if (this.isReducedMotion) {
      this.camera.position.copy(shot.cameraPos);
      this.camera.lookAt(shot.cameraTarget);
      if (onShellUpdate) onShellUpdate(shot.shellOpacity, shot.shellOpening, 0);
      return;
    }

    // Continuous smooth spline position & look target
    const currentPos = this.posSpline.getPoint(clampedProgress);
    const currentTarget = this.targetSpline.getPoint(clampedProgress);

    this.camera.position.copy(currentPos);
    this.camera.lookAt(currentTarget);

    // Interpolate shell parameters
    const lowerIdx = Math.floor(exactIndex);
    const upperIdx = Math.min(this.shots.length - 1, Math.ceil(exactIndex));
    const segmentT = exactIndex - lowerIdx;

    const lowerShot = this.shots[lowerIdx];
    const upperShot = this.shots[upperIdx];

    const opacity = THREE.MathUtils.lerp(lowerShot.shellOpacity, upperShot.shellOpacity, segmentT);
    const opening = THREE.MathUtils.lerp(lowerShot.shellOpening, upperShot.shellOpening, segmentT);

    if (onShellUpdate) onShellUpdate(opacity, opening, 0);
  }

  transitionToShot(shotIndex, onShellUpdate = null, duration = 1.2) {
    const idx = Math.max(0, Math.min(this.shots.length - 1, shotIndex));
    const targetShot = this.shots[idx];
    this.currentShotIndex = idx;

    if (this.activeTween) {
      this.activeTween.kill();
      this.activeTween = null;
    }

    if (this.isReducedMotion || duration === 0) {
      this.camera.position.copy(targetShot.cameraPos);
      this.camera.lookAt(targetShot.cameraTarget);
      if (onShellUpdate) onShellUpdate(targetShot.shellOpacity, targetShot.shellOpening, 0);
      if (this.onShotChange) this.onShotChange(targetShot);
      return;
    }

    const startPos = this.camera.position.clone();
    const endPos = targetShot.cameraPos;

    this.activeTween = gsap.to(this.camera.position, {
      x: endPos.x,
      y: endPos.y,
      z: endPos.z,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        const t = this.activeTween.progress();
        const curLook = new THREE.Vector3().lerpVectors(this.shots[Math.max(0, idx - 1)].cameraTarget, targetShot.cameraTarget, t);
        this.camera.lookAt(curLook);
      },
      onComplete: () => {
        this.camera.lookAt(targetShot.cameraTarget);
        this.activeTween = null;
      }
    });

    if (onShellUpdate) {
      onShellUpdate(targetShot.shellOpacity, targetShot.shellOpening, duration);
    }

    if (this.onShotChange) {
      this.onShotChange(targetShot);
    }
  }
}
