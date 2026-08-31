import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NARRATIVE_STATES } from './states.js';

gsap.registerPlugin(ScrollTrigger);

export class StoryController {
  constructor(pyramid, navigatorInstance, appState) {
    this.pyramid = pyramid;
    this.navigator = navigatorInstance;
    this.appState = appState;
    this.currentStateIndex = 0;
    this.initScrollTrigger();
    this.initScrollListener();
  }

  initScrollTrigger() {
    const sections = document.querySelectorAll('.story-act-section');
    if (!sections || sections.length === 0) return;

    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => this.applyState(index),
        onEnterBack: () => this.applyState(index)
      });
    });
  }

  initScrollListener() {
    this.checkScrollPosition = () => {
      if (this.appState && this.appState.mode !== 'STORY') return;
      const sections = document.querySelectorAll('.story-act-section');
      if (!sections || sections.length === 0) return;

      const viewportCenter = window.innerHeight * 0.45;
      let closestIdx = 0;
      let minDistance = Infinity;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height * 0.5;
        const dist = Math.abs(sectionCenter - viewportCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = index;
        }
      });

      // Calculate total page scroll progress for continuous spline interpolation
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY || window.pageYOffset;
      const progress = docHeight > 0 ? currentScroll / docHeight : 0;

      if (this.pyramid && this.pyramid.cameraDirector) {
        this.pyramid.cameraDirector.interpolateContinuousProgress(progress, (opacity, opening) => {
          if (this.pyramid.matPolishedCasing) this.pyramid.matPolishedCasing.opacity = opacity;
          if (this.pyramid.southCasing) this.pyramid.southCasing.position.z = opening * 1.6;
        });
      }

      if (closestIdx !== this.currentStateIndex) {
        this.applyState(closestIdx, false);
      }
    };

    window.addEventListener('scroll', this.checkScrollPosition, { passive: true });
    window.addEventListener('resize', this.checkScrollPosition, { passive: true });
  }

  applyState(index, triggerCameraTransition = true) {
    const safeIdx = Math.max(0, Math.min(NARRATIVE_STATES.length - 1, index));
    this.currentStateIndex = safeIdx;
    const state = NARRATIVE_STATES[safeIdx];

    // Update central AppState
    if (this.appState) {
      this.appState.storyIndex = safeIdx;
      this.appState.storyState = state.id;
      this.appState.cameraShotId = state.id;
      this.appState.activeModule = state.focusedNode || 'CORE';
    }

    if (triggerCameraTransition && this.pyramid) {
      this.pyramid.transitionToNarrativeState(safeIdx);
    }

    // Update DOM active highlights
    document.querySelectorAll('.story-act-section').forEach((s, idx) => {
      s.classList.toggle('active-act', idx === safeIdx);
      s.setAttribute('aria-current', idx === safeIdx ? 'step' : 'false');
    });

    // Crossfade Layer 0 active plate slide
    document.querySelectorAll('.plate-slide').forEach((slide, idx) => {
      slide.classList.toggle('active', idx === safeIdx);
    });

    // Update Spatial Navigator
    if (this.navigator && this.pyramid?.cameraDirector) {
      const shot = this.pyramid.cameraDirector.shots[safeIdx];
      this.navigator.updateState(shot, safeIdx / (NARRATIVE_STATES.length - 1));
    }
  }

  scrollToAct(index) {
    const sections = document.querySelectorAll('.story-act-section');
    const safeIdx = Math.max(0, Math.min(sections.length - 1, index));
    const section = sections[safeIdx];
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = scrollTop + rect.top - (window.innerHeight * 0.2);
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    window.dispatchEvent(new Event('scroll'));
    ScrollTrigger.update();
  }

  jumpToState(index) {
    this.scrollToAct(index);
    this.applyState(index);
  }
}
