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
    // 6 Giza Proportional Narrative States (S0 to S5)
    this.shots = [
      {
        id: 'S0',
        chapter: '0. GENESIS',
        name: 'HERO',
        label: '0. Genesis: GIZA MONUMENTAL COVER',
        nodeId: 'HERO',
        cameraPos: new THREE.Vector3(3.6, -0.4, 12.0),
        cameraTarget: new THREE.Vector3(0, 0.2, 0),
        shellOpening: 0.0,
        shellOpacity: 0.45,
        semanticIntent: 'Giza 51.84° monumental massing with dark basalt stone courses and editorial negative space.'
      },
      {
        id: 'S1',
        chapter: '1. ARCHITECTURE',
        name: 'YOD',
        label: '1. Intelligence: APEX PYRAMIDION & ARQUITECTO',
        nodeId: 'YOD',
        cameraPos: new THREE.Vector3(1.8, 3.2, 5.2),
        cameraTarget: new THREE.Vector3(0, 2.546, 0),
        shellOpening: 0.2,
        shellOpacity: 0.4,
        semanticIntent: 'Macro inspection of summit pyramidion and optical sapphire gimbal.'
      },
      {
        id: 'S2',
        chapter: '2. IDENTITY',
        name: 'LIENZO',
        label: '2. Identity: LIENZO VERTICAL SHAFT',
        nodeId: 'LIENZO',
        cameraPos: new THREE.Vector3(1.2, 0.8, 4.4),
        cameraTarget: new THREE.Vector3(0, 0.4, 0),
        shellOpening: 0.6,
        shellOpacity: 0.2,
        semanticIntent: 'Interior cutaway into vertical hexagonal crystal shaft and revision strata rings.'
      },
      {
        id: 'S3',
        chapter: '3. REALITY',
        name: 'SHIM',
        label: '3. Reality: SHIM METROLOGY CHAMBER',
        nodeId: 'SHIM',
        cameraPos: new THREE.Vector3(1.6, 0.4, 4.0),
        cameraTarget: new THREE.Vector3(0, 0.1, 0),
        shellOpening: 0.8,
        shellOpacity: 0.15,
        semanticIntent: 'Transverse metrology chamber with laser scanning plane measuring planned vs observed.'
      },
      {
        id: 'S4',
        chapter: '4. PRODUCTION',
        name: 'VAV',
        label: '4. Production: VAV SUBTERRANEAN FORGE',
        nodeId: 'VAV',
        cameraPos: new THREE.Vector3(1.4, -1.0, 4.6),
        cameraTarget: new THREE.Vector3(0, -1.4, 0),
        shellOpening: 0.9,
        shellOpacity: 0.15,
        semanticIntent: 'Subterranean bedrock forge with three parallel execution tracks.'
      },
      {
        id: 'S5',
        chapter: '5. CLOSURE',
        name: 'RESOLVED',
        label: '5. Closure: CLOSED-LOOP ECOSYSTEM',
        nodeId: 'CORE',
        cameraPos: new THREE.Vector3(4.2, 0.4, 14.0),
        cameraTarget: new THREE.Vector3(0, -0.4, 0),
        shellOpening: 0.3,
        shellOpacity: 0.45,
        semanticIntent: 'Monumental pull-back revealing closed loop between Giza monument and digital world sphere.'
      }
    ];
  }

  transitionToShot(shotIndex, onUpdateFacet = null) {
    const isReduced = this.checkReducedMotion();
    const targetShot = this.shots[Math.min(shotIndex, this.shots.length - 1)] || this.shots[0];
    this.currentShotIndex = shotIndex;

    if (this.activeTween) {
      this.activeTween.kill();
    }

    if (isReduced) {
      this.camera.position.copy(targetShot.cameraPos);
      this.camera.lookAt(targetShot.cameraTarget);
      if (onUpdateFacet) {
        onUpdateFacet(targetShot.shellOpacity, targetShot.shellOpening, 0);
      }
      if (this.onShotChange) this.onShotChange(targetShot);
      return;
    }

    const duration = 1.4;
    const tl = gsap.timeline({
      onUpdate: () => {
        this.camera.lookAt(targetShot.cameraTarget);
      },
      onComplete: () => {
        if (this.onShotChange) this.onShotChange(targetShot);
      }
    });

    tl.to(this.camera.position, {
      x: targetShot.cameraPos.x,
      y: targetShot.cameraPos.y,
      z: targetShot.cameraPos.z,
      duration,
      ease: 'power2.inOut'
    }, 0);

    if (onUpdateFacet) {
      onUpdateFacet(targetShot.shellOpacity, targetShot.shellOpening, duration);
    }

    this.activeTween = tl;
  }
}
