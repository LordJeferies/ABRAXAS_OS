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
    const chapters = document.querySelectorAll('.story-chapter-editorial, .story-chapter-card');

    chapters.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card,
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
      const chapters = document.querySelectorAll('.story-chapter-editorial, .story-chapter-card');
      const viewportCenter = window.innerHeight * 0.45;
      let closestIdx = 0;
      let minDistance = Infinity;

      chapters.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height * 0.5;
        const dist = Math.abs(cardCenter - viewportCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = index;
        }
      });

      if (closestIdx !== this.currentStateIndex) {
        this.applyState(closestIdx);
      }
    };

    window.addEventListener('scroll', this.checkScrollPosition, { passive: true });
    window.addEventListener('resize', this.checkScrollPosition, { passive: true });
  }

  applyState(index) {
    if (index < 0 || index >= NARRATIVE_STATES.length) return;
    this.currentStateIndex = index;
    const state = NARRATIVE_STATES[index];

    // Update central AppState
    if (this.appState) {
      this.appState.storyIndex = index;
      this.appState.storyState = state.id;
      this.appState.cameraShotId = state.id;
      this.appState.activeModule = state.nodeId || 'CORE';
    }

    // CameraDirector shot transition
    this.pyramid.transitionToNarrativeState(index);

    // Update DOM active highlights
    document.querySelectorAll('.story-chapter-editorial, .story-chapter-card').forEach((c, idx) => {
      c.classList.toggle('active-chapter', idx === index);
      c.setAttribute('aria-current', idx === index ? 'step' : 'false');
    });

    // Update Spatial Navigator
    if (this.navigator) {
      const shot = this.pyramid.director ? this.pyramid.director.shots[index] : null;
      this.navigator.updateState(shot, index / (NARRATIVE_STATES.length - 1));
    }
  }

  scrollToChapter(index) {
    const chapters = document.querySelectorAll('.story-chapter-editorial, .story-chapter-card');
    const card = chapters[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = scrollTop + rect.top - (window.innerHeight * 0.35);
    window.scrollTo(0, Math.max(0, targetY));
    window.dispatchEvent(new Event('scroll'));
    ScrollTrigger.update();
  }

  jumpToState(index) {
    this.scrollToChapter(index);
    this.applyState(index);
  }
}
