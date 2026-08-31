import { SpatialPyramid } from './scene/SpatialPyramid.js';
import { StoryController } from './story/story-controller.js';
import { SpatialNavigator } from './ui/navigator.js';
import { ModuleDossierModal } from './ui/dossiers.js';
import { ModeManager } from './ui/modes.js';
import { PublicArchitectUI } from './ui/public-architect.js';
import './styles.css';

async function initPublicStatus() {
  const isSystemPage = window.location.pathname.includes('/system');
  const isFlowPage = window.location.pathname.includes('/flow');
  const isProofPage = window.location.pathname.includes('/proof');

  let defaultMode = 'STORY';
  if (isSystemPage) defaultMode = 'SYSTEM';
  else if (isFlowPage) defaultMode = 'FLOW';
  else if (isProofPage) defaultMode = 'PROOF';

  const appState = {
    mode: defaultMode,
    storyIndex: 0,
    storyState: 'S0',
    cameraShotId: 'S0',
    activeModule: 'HERO',
    selectedBlueprintId: 'CORE_LOOP_FULL_V1',
    truthView: 'CURRENT'
  };
  window.__ABRAXAS_APP_STATE__ = appState;

  let publicKnowledge = { modules: [], qaPairs: [] };
  let blueprintsData = [];
  let evidenceData = [];

  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  let depth = 0;
  if (window.location.pathname.endsWith('/index.html')) {
    depth = Math.max(0, pathSegments.length - 1);
  } else if (window.location.pathname.endsWith('/')) {
    depth = pathSegments.length;
  } else if (pathSegments.length > 0) {
    depth = Math.max(0, pathSegments.length - 1);
  }
  const prefix = depth > 0 ? '../'.repeat(depth) : './';

  // Current Locale Detection
  const currentLocale = document.documentElement.lang || (window.location.pathname.includes('/es/') ? 'es' : 'en');

  // 1. Fetch public truth datasets
  try {
    const [pkRes, bpRes, evRes] = await Promise.all([
      fetch(`${prefix}public-knowledge.json`),
      fetch(`${prefix}pipeline-blueprints.json`),
      fetch(`${prefix}evidence-index.json`)
    ]);

    if (pkRes.ok) publicKnowledge = await pkRes.json();
    if (bpRes.ok) {
      const bpJson = await bpRes.json();
      blueprintsData = bpJson.blueprints || [];
    }
    if (evRes.ok) {
      const evJson = await evRes.json();
      evidenceData = evJson.items || [];
    }
  } catch (e) {
    console.warn('[Status V6] Fetching public datasets fallback:', e.message);
  }

  // 2. Initialize Dossier Modal if container exists
  const dossierContainer = document.getElementById('dossier-modal-mount');
  let dossierModal = null;
  if (dossierContainer) {
    dossierModal = new ModuleDossierModal(dossierContainer, publicKnowledge.modules || []);
  }

  // 3. Initialize 3D Spatial Canvas if present
  const canvasContainer = document.getElementById('spatial-pyramid-container') || document.getElementById('spatial-canvas-container');
  let pyramid = null;
  let navigatorInstance = null;

  if (canvasContainer) {
    pyramid = new SpatialPyramid(
      canvasContainer,
      (moduleId) => {
        if (window.__ABRAXAS_MODE_MANAGER__) {
          window.__ABRAXAS_MODE_MANAGER__.selectModule(moduleId);
        }
        if (dossierModal) {
          dossierModal.open(moduleId);
        }
        window.location.hash = `#system/${moduleId.toLowerCase()}`;
      },
      (shot) => {
        appState.cameraShotId = shot.id;
        appState.activeModule = shot.nodeId || 'CORE';
        if (navigatorInstance) navigatorInstance.updateState(shot, appState.storyIndex / 11);
      },
      publicKnowledge,
      { items: evidenceData }
    );

    if (defaultMode === 'SYSTEM') {
      pyramid.setMode('SYSTEM');
    } else if (defaultMode === 'FLOW') {
      pyramid.setMode('FLOW');
    }

    // 4. Initialize Navigator if present
    const navContainer = document.getElementById('navigator-mount');
    let storyController = null;
    if (navContainer) {
      navigatorInstance = new SpatialNavigator(navContainer, (stateIdx) => {
        if (storyController) storyController.jumpToState(stateIdx);
      });
    }

    // 5. Initialize Story Controller on landing
    if (document.querySelector('.story-scroll-container') || document.querySelector('.story-act-section')) {
      storyController = new StoryController(pyramid, navigatorInstance, appState);
      window.__ABRAXAS_STORY_CONTROLLER__ = storyController;
    }

    // 6. Initialize Modes Manager
    const modeManager = new ModeManager(pyramid, dossierModal, blueprintsData, publicKnowledge.modules || [], evidenceData, appState);
    window.__ABRAXAS_MODE_MANAGER__ = modeManager;

    if (defaultMode !== 'STORY') {
      modeManager.switchMode(defaultMode);
    }

    // 7. Animation Render Loop with Visibility Pause
    let animationFrameId = null;
    function loop(time) {
      if (document.visibilityState !== 'hidden' && pyramid.activeMode !== 'PROOF') {
        pyramid.animate(time);
      }
      animationFrameId = requestAnimationFrame(loop);
    }
    animationFrameId = requestAnimationFrame(loop);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(loop);
      }
    });
  }

  // 8. Initialize Public Architect Engine
  const architectUI = new PublicArchitectUI(pyramid, publicKnowledge.qaPairs || [], dossierModal, publicKnowledge.modules || []);
  window.__ABRAXAS_PUBLIC_ARCHITECT__ = architectUI;

  const drawerEl = document.getElementById('public-architect-drawer') || document.getElementById('architect-drawer');
  
  window.__ABRAXAS_OPEN_ARCHITECT__ = () => {
    if (drawerEl) {
      drawerEl.classList.add('open');
      drawerEl.setAttribute('aria-hidden', 'false');
      const input = document.getElementById('architect-query-input');
      if (input) input.focus();
    }
  };

  window.__ABRAXAS_CLOSE_ARCHITECT__ = () => {
    if (drawerEl) {
      drawerEl.classList.remove('open');
      drawerEl.setAttribute('aria-hidden', 'true');
    }
  };

  window.__ABRAXAS_QUERY_ARCHITECT__ = (query) => {
    if (!query || !query.trim()) return;
    const res = architectUI.resolveIntent(query);

    const card = document.getElementById('architect-response-container');
    const topicEl = document.getElementById('architect-response-topic');
    const textEl = document.getElementById('architect-response-text');
    const metaEl = document.getElementById('architect-response-meta');

    if (card && topicEl && textEl) {
      card.style.display = 'block';
      topicEl.textContent = `TOPIC: ${res.title} [${res.moduleId || 'SYSTEM'}]`;
      const ans = (currentLocale === 'es' && res.answerEs) ? res.answerEs : res.answerEn;
      textEl.textContent = ans;
      if (metaEl) metaEl.textContent = currentLocale === 'es' ? 'Autoridad Determinista: Grafo de Conocimiento YOD • Estado: RC1 VERIFICADO' : 'Deterministic Authority: YOD Knowledge Graph • Status: VERIFIED_RC1';
    }

    if (res.node && pyramid && pyramid.focusModule) {
      pyramid.focusModule(res.node);
    }
  };

  // Wire drawer query input and suggestion chips
  const queryInput = document.getElementById('architect-query-input');
  const querySubmit = document.getElementById('architect-query-submit');
  if (querySubmit && queryInput) {
    querySubmit.addEventListener('click', () => {
      window.__ABRAXAS_QUERY_ARCHITECT__(queryInput.value);
    });
    queryInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        window.__ABRAXAS_QUERY_ARCHITECT__(queryInput.value);
      }
    });
  }

  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q') || chip.textContent;
      if (queryInput) queryInput.value = q;
      window.__ABRAXAS_QUERY_ARCHITECT__(q);
    });
  });

  // Dedicated Ask Page Execution Handler
  window.__ABRAXAS_EXECUTE_PAGE_QUERY__ = () => {
    const pInput = document.getElementById('ask-page-query-input');
    const pCard = document.getElementById('ask-page-response-container');
    const pTopic = document.getElementById('ask-page-response-topic');
    const pText = document.getElementById('ask-page-response-text');

    if (pInput && pInput.value.trim() && pCard && pTopic && pText) {
      const res = architectUI.resolveIntent(pInput.value);
      pCard.style.display = 'block';
      pTopic.textContent = `TOPIC: ${res.title} [${res.moduleId || 'SYSTEM'}]`;
      pText.textContent = (currentLocale === 'es' && res.answerEs) ? res.answerEs : res.answerEn;
    }
  };

  const askPageInput = document.getElementById('ask-page-query-input');
  if (askPageInput) {
    askPageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        window.__ABRAXAS_EXECUTE_PAGE_QUERY__();
      }
    });
  }

  // 9. Deep Link Hash Router
  function handleHash() {
    const rawHash = window.location.hash.toLowerCase().replace('#', '');
    if (!rawHash) return;

    const parts = rawHash.split('/');
    const mode = parts[0];
    const subTarget = parts[1];

    if (mode === 'system' && window.__ABRAXAS_MODE_MANAGER__) {
      window.__ABRAXAS_MODE_MANAGER__.switchMode('SYSTEM');
      if (subTarget) {
        window.__ABRAXAS_MODE_MANAGER__.selectModule(subTarget.toUpperCase());
      }
    } else if (mode === 'flow' && window.__ABRAXAS_MODE_MANAGER__) {
      window.__ABRAXAS_MODE_MANAGER__.switchMode('FLOW');
      if (subTarget) {
        window.__ABRAXAS_MODE_MANAGER__.selectBlueprint(subTarget.toUpperCase());
      }
    }
  }

  window.addEventListener('hashchange', handleHash);
  if (window.location.hash) handleHash();

  return true;
}

window.__ABRAXAS_READY__ = initPublicStatus();
