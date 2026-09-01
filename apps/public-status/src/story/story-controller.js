import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Explicit 12-Act to 10-Plate Mapping
const ACT_PLATE_MAP = [
  0, // Act 00: Plate 01 (Hero Genesis)
  5, // Act 01: Plate 06 (Optical Port / YOD)
  9, // Act 02: Plate 10 (Master Monument Giza)
  2, // Act 03: Plate 03 (Crystalline Sanctuary)
  3, // Act 04: Plate 04 (SHIM Da'at Metrology)
  8, // Act 05: Plate 09 (Dashboard Telemetry / CAS)
  1, // Act 06: Plate 02 (Exterior Closed Loop)
  7, // Act 07: Plate 08 (HE Assiah Operations)
  4, // Act 08: Plate 05 (VAV Cathedral)
  0, // Act 09: Plate 01 (Hero Synthesis)
  7, // Act 10: Plate 08 (HE Operations)
  6  // Act 11: Plate 07 (Moon & Metrics Helix)
];

export class StoryController {
  constructor(pyramid, navigatorInstance, appState) {
    this.pyramid = pyramid;
    this.navigator = navigatorInstance;
    this.appState = appState;
    this.currentStateIndex = -1;
    this.initScrollTrigger();
    this.initScrollListener();
    this.applyState(0); // Initialize first plate immediately
  }

  initScrollTrigger() {
    const sections = document.querySelectorAll(".story-act-section");
    if (!sections || sections.length === 0) return;

    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => this.applyState(index),
        onEnterBack: () => this.applyState(index)
      });
    });
  }

  initScrollListener() {
    this.checkScrollPosition = () => {
      const sections = document.querySelectorAll(".story-act-section");
      if (!sections || sections.length === 0) return;

      const viewportCenter = window.innerHeight * 0.5;
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

      if (closestIdx !== this.currentStateIndex) {
        this.applyState(closestIdx, false);
      }
    };

    window.addEventListener("scroll", this.checkScrollPosition, { passive: true });
    window.addEventListener("resize", this.checkScrollPosition, { passive: true });
  }

  applyState(index, triggerCameraTransition = true) {
    const sections = document.querySelectorAll(".story-act-section");
    const safeIdx = Math.max(0, Math.min(sections.length > 0 ? sections.length - 1 : 11, index));
    if (this.currentStateIndex === safeIdx) return;
    this.currentStateIndex = safeIdx;

    // Update central AppState
    if (this.appState) {
      this.appState.storyIndex = safeIdx;
      this.appState.storyState = `ACT_${safeIdx}`;
    }

    if (triggerCameraTransition && this.pyramid) {
      this.pyramid.transitionToNarrativeState(safeIdx);
    }

    // Update DOM active highlights
    sections.forEach((s, idx) => {
      s.classList.toggle("active-act", idx === safeIdx);
      s.setAttribute("aria-current", idx === safeIdx ? "step" : "false");
    });

    // Crossfade Layer 0 active plate slide based on explicit Act-to-Plate mapping
    const targetPlateIdx = ACT_PLATE_MAP[safeIdx] !== undefined ? ACT_PLATE_MAP[safeIdx] : (safeIdx % 10);
    const slides = document.querySelectorAll(".plate-slide");
    slides.forEach((slide) => {
      const p = parseInt(slide.dataset.plate, 10);
      if (p === targetPlateIdx) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });

    // Update Spatial Navigator if present
    if (this.navigator && this.pyramid?.cameraDirector) {
      const shot = this.pyramid.cameraDirector.shots[safeIdx];
      if (shot) this.navigator.updateState(shot, safeIdx / (sections.length - 1));
    }
  }

  scrollToAct(index) {
    const sections = document.querySelectorAll(".story-act-section");
    const safeIdx = Math.max(0, Math.min(sections.length - 1, index));
    const section = sections[safeIdx];
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = scrollTop + rect.top - (window.innerHeight * 0.2);
    window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
    window.dispatchEvent(new Event("scroll"));
    ScrollTrigger.update();
  }

  jumpToState(index) {
    this.scrollToAct(index);
    this.applyState(index);
  }
}
