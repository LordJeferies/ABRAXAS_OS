import * as THREE from 'three';
import gsap from 'gsap';

export class CameraDirector {
  constructor(camera, eyeGroup, guideRayMat, onShotChange = null) {
    this.camera = camera;
    this.eyeGroup = eyeGroup;
    this.guideRayMat = guideRayMat;
    this.onShotChange = onShotChange;
    this.cameraTarget = new THREE.Vector3(0, 0, 0);
    this.currentShotIndex = 0;
    this.activeTween = null;
    this.isReducedMotion = false;

    this.initShots();
    this.checkReducedMotion();

    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.addEventListener) mq.addEventListener('change', () => this.checkReducedMotion());
      else if (mq.addListener) mq.addListener(() => this.checkReducedMotion());
    }
  }

  checkReducedMotion() {
    this.isReducedMotion = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || !!window.__ABRAXAS_REDUCED_MOTION_FORCE__;
    return this.isReducedMotion;
  }

  initShots() {
    // 12 Catmull-Rom directed camera narrative states (S0 to S11)
    // Desktop composition: pyramid centered-right / centered with negative space for typography
    this.shots = [
      {
        id: 'S0',
        chapter: '0. GENESIS',
        name: 'HERO',
        label: '0. Genesis: HERO',
        nodeId: 'HERO',
        positionCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(1.5, -2.5, 14),
          new THREE.Vector3(1.0, -1.8, 12)
        ]),
        targetCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -0.5, 0),
          new THREE.Vector3(0, 0, 0)
        ]),
        fov: 45,
        shellFaceOpening: 0.0, // Fully closed sculpture
        shellOpacity: 0.32,
        activeLabel: null,
        semanticIntent: 'Establish distant monumental silhouette with clear left negative space for headline.'
      },
      {
        id: 'S1',
        chapter: '1. TOPOLOGY',
        name: 'OVERVIEW',
        label: '1. Topology: OVERVIEW',
        nodeId: 'OVERVIEW',
        positionCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(1.0, -1.8, 12),
          new THREE.Vector3(1.5, 2.5, 11),
          new THREE.Vector3(1.8, 4.0, 10)
        ]),
        targetCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 1.0, 0)
        ]),
        fov: 48,
        shellFaceOpening: 0.15,
        shellOpacity: 0.28,
        activeLabel: 'ARQUITECTO',
        semanticIntent: 'Elevated panoramic framing of spatial pyramid and observing Eye of Arquitecto.'
      },
      {
        id: 'S2',
        chapter: '2. INTELLIGENCE',
        name: 'YOD',
        label: '2. Intelligence: YOD',
        nodeId: 'YOD',
        positionCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(1.8, 4.0, 10),
          new THREE.Vector3(1.2, 5.8, 6.5),
          new THREE.Vector3(1.0, 6.5, 4.2)
        ]),
        targetCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 1.0, 0),
          new THREE.Vector3(0, 5.5, 0)
        ]),
        fov: 38,
        shellFaceOpening: 0.1,
        shellOpacity: 0.22,
        activeLabel: 'YOD',
        semanticIntent: 'Close inspection of originating intelligence apex crystal.'
      },
      {
        id: 'S3',
        chapter: '3. INTENT',
        name: 'HE_I',
        label: '3. Intent: HE I',
        nodeId: 'HE1',
        positionCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(1.0, 6.5, 4.2),
          new THREE.Vector3(2.4, 5.0, 4.6),
          new THREE.Vector3(3.0, 4.4, 3.8)
        ]),
        targetCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 5.5, 0),
          new THREE.Vector3(1.5, 3.8, 1.2)
        ]),
        fov: 42,
        shellFaceOpening: 0.5, // Front face begins peeling open
        shellOpacity: 0.18,
        activeLabel: 'HE_I',
        semanticIntent: 'Front window opening to reveal He operations intent chamber.'
      },
      {
        id: 'S4',
        chapter: '4. IDENTITY',
        name: 'LIENZO_SPINE',
        label: '4. Identity: LIENZO',
        nodeId: 'LIENZO',
        positionCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(3.0, 4.4, 3.8),
          new THREE.Vector3(2.2, 3.0, 3.5),
          new THREE.Vector3(1.4, 2.2, 3.2)
        ]),
        targetCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(1.5, 3.8, 1.2),
          new THREE.Vector3(0, 2.0, 0)
        ]),
        fov: 36,
        shellFaceOpening: 0.75, // Deep interior exposure
        shellOpacity: 0.12,
        activeLabel: 'LIENZO',
        semanticIntent: 'Penetrate inner chamber to expose vertical crystalline identity spine and revision rings.'
      },
      {
        id: 'S5',
        chapter: '5. REALITY',
        name: 'SHIM',
        label: '5. Reality: SHIM',
        nodeId: 'SHIM',
        positionCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(1.4, 2.2, 3.2),
          new THREE.Vector3(1.8, 1.5, 3.0),
          new THREE.Vector3(2.0, 0.9, 2.8)
        ]),
        targetCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 2.0, 0),
          new THREE.Vector3(0, 0.8, 0)
        ]),
        fov: 35,
        shellFaceOpening: 0.85,
        shellOpacity: 0.10,
        activeLabel: 'SHIM',
        semanticIntent: 'Transverse planar inspection of Shim reality membrane and missing beat gap detection.'
      },
      {
        id: 'S6',
        chapter: '6. EMBODIMENT',
        name: 'VAV',
        label: '6. Embodiment: VAV',
        nodeId: 'VAV',
        positionCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(2.0, 0.9, 2.8),
          new THREE.Vector3(1.5, 0.0, 3.0),
          new THREE.Vector3(1.2, -0.6, 3.2)
        ]),
        targetCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0.8, 0),
          new THREE.Vector3(0, -0.8, -0.5)
        ]),
        fov: 38,
        shellFaceOpening: 0.85,
        shellOpacity: 0.10,
        activeLabel: 'VAV',
        semanticIntent: 'Focus on illuminated multi-track forge for non-destructive cuts and Remotion rendering.'
      },
      {
        id: 'S7',
        chapter: '7. RAILS & COMPUTE',
        name: 'PIPELINE_AI',
        label: '7. Rails & Compute: PIPELINE',
        nodeId: 'PIPELINE',
        positionCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(1.2, -0.6, 3.2),
          new THREE.Vector3(2.4, -0.8, 3.4),
          new THREE.Vector3(2.2, -1.3, 3.6)
        ]),
        targetCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -0.8, -0.5),
          new THREE.Vector3(0, -1.0, 0)
        ]),
        fov: 42,
        shellFaceOpening: 0.6,
        shellOpacity: 0.18,
        activeLabel: null,
        semanticIntent: 'Lateral sweep inspecting modular routing rails and AI compute field.'
      },
      {
        id: 'S8',
        chapter: '8. MANIFESTATION',
        name: 'HE_II',
        label: '8. Manifestation: HE II',
        nodeId: 'HE2',
        positionCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(2.2, -1.3, 3.6),
          new THREE.Vector3(2.6, -1.8, 3.9),
          new THREE.Vector3(2.8, -2.1, 4.1)
        ]),
        targetCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -1.0, 0),
          new THREE.Vector3(1.8, -2.2, 1.5)
        ]),
        fov: 44,
        shellFaceOpening: 0.5,
        shellOpacity: 0.20,
        activeLabel: 'HE_II',
        semanticIntent: 'Lower front observatory framing QA review gates and release dispatch.'
      },
      {
        id: 'S9',
        chapter: '9. DISTRIBUTION',
        name: 'PUBLISHING',
        label: '9. Distribution: PUBLISHING',
        nodeId: 'PUBLISHING',
        positionCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(2.8, -2.1, 4.1),
          new THREE.Vector3(1.6, -2.5, 4.4),
          new THREE.Vector3(0.5, -2.9, 4.6)
        ]),
        targetCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(1.8, -2.2, 1.5),
          new THREE.Vector3(0, -2.8, 3.2)
        ]),
        fov: 45,
        shellFaceOpening: 0.35,
        shellOpacity: 0.24,
        activeLabel: null,
        semanticIntent: 'Outbound tracking shot along multi-channel platform distribution portals.'
      },
      {
        id: 'S10',
        chapter: '10. LEARNING FEEDBACK',
        name: 'METRICS_LOOP',
        label: '10. Learning Feedback: METRICS',
        nodeId: 'METRICS',
        positionCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.5, -2.9, 4.6),
          new THREE.Vector3(-0.8, -3.6, 5.4),
          new THREE.Vector3(0.4, -4.0, 6.2)
        ]),
        targetCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -2.8, 3.2),
          new THREE.Vector3(0, 1.0, 0)
        ]),
        fov: 50,
        shellFaceOpening: 0.2,
        shellOpacity: 0.28,
        activeLabel: 'METRICS',
        semanticIntent: 'Base telemetry plane returning metrics loop upward to apex.'
      },
      {
        id: 'S11',
        chapter: '11. PROVENANCE',
        name: 'RESOLVED_CLOSE',
        label: '11. Provenance: RESOLVED',
        nodeId: 'RESOLVED',
        positionCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.4, -4.0, 6.2),
          new THREE.Vector3(1.2, -2.5, 11),
          new THREE.Vector3(2.0, -1.0, 16)
        ]),
        targetCurve: new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 1.0, 0),
          new THREE.Vector3(0, 0.5, 0),
          new THREE.Vector3(0, 0, 0)
        ]),
        fov: 46,
        shellFaceOpening: 0.0, // Closed resolved sculpture
        shellOpacity: 0.32,
        activeLabel: null,
        semanticIntent: 'Pullback establishing fully resolved, closed-loop system constellation.'
      }
    ];
  }

  transitionToShot(index, onShellUpdate = null) {
    if (index < 0 || index >= this.shots.length) return;
    this.currentShotIndex = index;
    const shot = this.shots[index];
    const isReduced = this.checkReducedMotion();

    if (this.activeTween) {
      this.activeTween.kill();
      this.activeTween = null;
    }
    gsap.killTweensOf(this.camera.position);
    gsap.killTweensOf(this.camera);

    const endPos = shot.positionCurve.getPoint(1.0);
    const endTarget = shot.targetCurve.getPoint(1.0);

    if (isReduced) {
      // Immediate deterministic snap
      this.camera.position.copy(endPos);
      this.cameraTarget.copy(endTarget);
      this.camera.lookAt(this.cameraTarget);
      this.camera.fov = shot.fov;
      this.camera.updateProjectionMatrix();

      if (onShellUpdate) onShellUpdate(shot.shellOpacity, shot.shellFaceOpening, 0);
      if (this.onShotChange) this.onShotChange(shot);
      return;
    }

    const duration = 1.2;

    gsap.to(this.camera, {
      fov: shot.fov,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => this.camera.updateProjectionMatrix()
    });

    if (onShellUpdate) {
      onShellUpdate(shot.shellOpacity, shot.shellFaceOpening, duration);
    }

    const progressObj = { t: 0 };
    this.activeTween = gsap.to(progressObj, {
      t: 1.0,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        const pt = shot.positionCurve.getPoint(progressObj.t);
        this.camera.position.copy(pt);

        const trg = shot.targetCurve.getPoint(progressObj.t);
        this.cameraTarget.copy(trg);
        this.camera.lookAt(this.cameraTarget);

        if (this.eyeGroup) {
          const lookVec = new THREE.Vector3(trg.x, trg.y, trg.z).sub(this.eyeGroup.position).normalize();
          this.eyeGroup.rotation.x = Math.atan2(-lookVec.y, Math.sqrt(lookVec.x * lookVec.x + lookVec.z * lookVec.z)) * 0.4;
          this.eyeGroup.rotation.y = Math.atan2(lookVec.x, lookVec.z);
        }
      },
      onComplete: () => {
        if (this.onShotChange) this.onShotChange(shot);
      }
    });
  }
}
