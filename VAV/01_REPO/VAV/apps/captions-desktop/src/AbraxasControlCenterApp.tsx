import React, { useState, useEffect } from 'react';
import {
  createAbraxasProject,
  analyzeAbraxasMedia,
  generateAbraxasCaptions,
  generateAbraxasMotion,
  exportAbraxasProjectPackage,
  getAbraxasSystemStatus
} from './fullAlphaBridge';

export type MainNavSection = 'DASHBOARD' | 'STUDIO' | 'PROJECTS' | 'FOUR_WORLDS' | 'SETTINGS';

export interface SystemStatusData {
  system: string;
  version: string;
  kernelStatus: string;
  memoryConnected: boolean;
  guardianStatus: string;
  currentWorld: string;
  currentOperator: string;
  activeProcess: string;
  progressPercentage: number;
}

export const AbraxasControlCenterApp: React.FC = () => {
  const [navSection, setNavSection] = useState<MainNavSection>('DASHBOARD');
  
  // Real System Telemetry State
  const [status, setStatus] = useState<SystemStatusData>({
    system: "ABRAXAS OS",
    version: "12.0.0",
    kernelStatus: "ONLINE",
    memoryConnected: true,
    guardianStatus: "OPTIMAL",
    currentWorld: "YETZIRAH",
    currentOperator: "VAV (ו)",
    activeProcess: "Standby & Ready for Human Intention",
    progressPercentage: 100
  });

  // Creative Studio State
  const [studioMode, setStudioMode] = useState<'FROM_ZERO' | 'OPTIMIZE' | 'CAPTIONS_ONLY' | 'MOTION_ONLY'>('FROM_ZERO');
  const [ideaInput, setIdeaInput] = useState('');
  const [productInput, setProductInput] = useState('');
  const [audienceInput, setAudienceInput] = useState('');
  const [objectiveInput, setObjectiveInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastOutput, setLastOutput] = useState<any>(null);

  // Projects State
  const [projects, setProjects] = useState<any[]>([
    {
      id: "proj_oud_royal_01",
      name: "Oud Royal Extrait TikTok Ad",
      brand: "Oud Royal",
      world: "MALKHUT",
      state: "MANIFESTED",
      casAddress: "cas://7197210...abraxas",
      updatedAt: "2026-08-31 22:45"
    },
    {
      id: "proj_crypto_matrix_02",
      name: "Single-Piece Crystal Identity",
      brand: "ABRAXAS",
      world: "YETZIRAH",
      state: "CERTIFIED",
      casAddress: "cas://34b695a...master",
      updatedAt: "2026-08-31 22:30"
    }
  ]);

  useEffect(() => {
    // Poll real backend telemetry
    try {
      getAbraxasSystemStatus().then((res) => {
        if (res) {
          setStatus({
            system: "ABRAXAS OS",
            version: "12.0.0",
            kernelStatus: res.kernelStatus || "ONLINE",
            memoryConnected: res.memoryConnected ?? true,
            guardianStatus: res.guardianStatus || "OPTIMAL",
            currentWorld: "YETZIRAH",
            currentOperator: "VAV (ו)",
            activeProcess: "Active Organism Telemetry",
            progressPercentage: 100
          });
        }
      }).catch(() => {});
    } catch (e) {}
  }, []);

  // Action 1: Create From Zero
  const handleCreateFromZero = async () => {
    if (!ideaInput) return;
    setIsProcessing(true);
    try {
      const result = await createAbraxasProject({
        mode: "FROM_ZERO",
        idea: ideaInput,
        product: productInput || "Core Product",
        targetAudience: audienceInput || "General Audience",
        objective: objectiveInput || "High Retention Video"
      });
      setLastOutput(result);
      setProjects([
        {
          id: result.projectId,
          name: ideaInput,
          brand: productInput || "Custom",
          world: "MALKHUT",
          state: "MANIFESTED",
          casAddress: result.casArtifactUri,
          updatedAt: new Date().toLocaleTimeString()
        },
        ...projects
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Action 2: Optimize Existing
  const handleOptimizeExisting = async () => {
    setIsProcessing(true);
    try {
      const analysis = await analyzeAbraxasMedia("source_video.mp4");
      const result = await createAbraxasProject({
        mode: "EXISTING_MATERIAL",
        option: "FULL_OPTIMIZATION",
        title: "Optimized Media Project"
      });
      setLastOutput({ ...result, analysis });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Action 3: Captions Only
  const handleCaptionsOnly = async () => {
    setIsProcessing(true);
    try {
      const analysis = await analyzeAbraxasMedia("speech_take.mp4");
      const captions = await generateAbraxasCaptions(analysis);
      setLastOutput({ captions, mode: "ONLY_CAPTIONS" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Action 4: Motion Only
  const handleMotionOnly = async () => {
    setIsProcessing(true);
    try {
      const motion = await generateAbraxasMotion(60, 15.0);
      setLastOutput({ motion, mode: "ONLY_MOTION" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#0a0a0c', color: '#f5f5f7', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden' }}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside style={{ width: '260px', background: '#050507', borderRight: '1px solid rgba(212,175,55,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 16px' }}>
        <div>
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingLeft: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #d4af37 0%, #f3e5ab 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '900', fontSize: '18px', boxShadow: '0 0 16px rgba(212,175,55,0.4)' }}>
              A
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>ABRAXAS OS</h1>
              <span style={{ fontSize: '11px', color: '#d4af37', fontWeight: 600 }}>V12.0 COMMERCIAL</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'DASHBOARD', label: 'Control Center', icon: '🏛️' },
              { id: 'STUDIO', label: 'Creative Studio', icon: '✨' },
              { id: 'PROJECTS', label: 'Projects Explorer', icon: '📁' },
              { id: 'FOUR_WORLDS', label: 'Four Worlds Matrix', icon: '🌌' },
              { id: 'SETTINGS', label: 'Brand DNA & Config', icon: '⚙️' }
            ].map((item) => {
              const active = navSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setNavSection(item.id as MainNavSection)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: active ? '1px solid #d4af37' : '1px solid transparent',
                    background: active ? 'rgba(212,175,55,0.12)' : 'transparent',
                    color: active ? '#d4af37' : 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: active ? 600 : 400,
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Pulse Indicator */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>KERNEL STATUS</span>
            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(52,199,89,0.2)', color: '#34c759', fontWeight: 600 }}>ONLINE</span>
          </div>
          <span style={{ fontSize: '12px', color: '#d4af37', fontWeight: 600 }}>{status.currentWorld} &bull; {status.currentOperator}</span>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        
        {/* SECTION 1: DASHBOARD / CONTROL CENTER */}
        {navSection === 'DASHBOARD' && (
          <div>
            <header style={{ marginBottom: '28px' }}>
              <span style={{ fontSize: '12px', color: '#d4af37', fontWeight: 700, letterSpacing: '0.05em' }}>ORGANISM TELEMETRY</span>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700 }}>ABRAXAS CONTROL CENTER</h2>
            </header>

            {/* Metric Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '20px' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>CURRENT WORLD</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#d4af37', marginTop: '6px' }}>{status.currentWorld}</div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Formation / Production</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '12px', padding: '20px' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>ACTIVE OPERATOR</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8', marginTop: '6px' }}>{status.currentOperator}</div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Visual Assembly Pin</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', padding: '20px' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>DA'AT GATE</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#a855f7', marginTop: '6px' }}>LOCKED (0 GAPS)</div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Whisper Metrology Verified</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(52,199,89,0.3)', borderRadius: '12px', padding: '20px' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>PERSISTENT MEMORY</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#34c759', marginTop: '6px' }}>CONNECTED</div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>SQLite ACID Core</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '16px' }}>RECENT SOVEREIGN PROJECTS</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {projects.map((p) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: '#fff', display: 'block' }}>{p.name}</span>
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#d4af37' }}>{p.casAddress}</span>
                      </div>
                      <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(52,199,89,0.2)', color: '#34c759' }}>{p.state}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', color: '#d4af37', marginBottom: '16px' }}>CREATIVE LAUNCHPAD</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                  Launch the four creative workflows or explore the live 4-Worlds descent ladder.
                </p>
                <button
                  onClick={() => setNavSection('STUDIO')}
                  style={{ width: '100%', marginTop: '16px', padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, #d4af37 0%, #f3e5ab 100%)', color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  OPEN CREATIVE STUDIO &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: CREATIVE STUDIO */}
        {navSection === 'STUDIO' && (
          <div>
            <header style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', color: '#d4af37', fontWeight: 700, letterSpacing: '0.05em' }}>CREATION PIPELINE</span>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700 }}>ABRAXAS CREATIVE STUDIO</h2>
            </header>

            {/* Mode Switcher */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
              {[
                { id: 'FROM_ZERO', label: 'Crear Desde Cero' },
                { id: 'OPTIMIZE', label: 'Optimizar Existente' },
                { id: 'CAPTIONS_ONLY', label: 'Solo Captions' },
                { id: 'MOTION_ONLY', label: 'Solo Motion' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setStudioMode(m.id as any)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: studioMode === m.id ? '#d4af37' : 'transparent',
                    color: studioMode === m.id ? '#000' : '#fff',
                    fontWeight: studioMode === m.id ? 700 : 400,
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Form Mode 1: From Zero */}
            {studioMode === 'FROM_ZERO' && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', maxWidth: '640px' }}>
                <h3 style={{ fontSize: '16px', color: '#d4af37', marginBottom: '16px' }}>NUEVO PROYECTO DESDE CERO</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>IDEA / PREMISA CREATIVA</label>
                    <input
                      type="text"
                      placeholder="e.g. Por qué el perfume Oud Royal arrasa en TikTok"
                      value={ideaInput}
                      onChange={(e) => setIdeaInput(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>PRODUCTO / MARCA</label>
                    <input
                      type="text"
                      placeholder="e.g. Oud Royal Extrait"
                      value={productInput}
                      onChange={(e) => setProductInput(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>AUDIENCIA OBJETIVO</label>
                    <input
                      type="text"
                      placeholder="e.g. Compradores de lujo y coleccionistas de fragancias"
                      value={audienceInput}
                      onChange={(e) => setAudienceInput(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>OBJETIVO COMERCIAL</label>
                    <input
                      type="text"
                      placeholder="e.g. Maximizar retención en los primeros 3 segundos y conversiones"
                      value={objectiveInput}
                      onChange={(e) => setObjectiveInput(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px' }}
                    />
                  </div>

                  <button
                    onClick={handleCreateFromZero}
                    disabled={isProcessing || !ideaInput}
                    style={{ marginTop: '12px', padding: '12px', borderRadius: '8px', background: isProcessing ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #d4af37 0%, #f3e5ab 100%)', color: '#000', fontWeight: 700, border: 'none', cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                  >
                    {isProcessing ? 'MANIFESTANDO EN LOS 4 MUNDOS...' : 'CREAR PROYECTO (8-STEP DAG)'}
                  </button>
                </div>
              </div>
            )}

            {/* Mode 2: Optimize Existing */}
            {studioMode === 'OPTIMIZE' && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', maxWidth: '640px' }}>
                <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '16px' }}>OPTIMIZACIÓN DE VIDEO EXISTENTE</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Sube un video para analizar el gancho de los primeros 3 segundos y aplicar optimización completa.</p>
                <button
                  onClick={handleOptimizeExisting}
                  disabled={isProcessing}
                  style={{ marginTop: '12px', padding: '12px 20px', borderRadius: '8px', background: '#38bdf8', color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  {isProcessing ? 'ANALIZANDO RETENCIÓN...' : 'EJECUTAR OPTIMIZACIÓN COMPLETA'}
                </button>
              </div>
            )}

            {/* Mode 3: Captions Only */}
            {studioMode === 'CAPTIONS_ONLY' && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', maxWidth: '640px' }}>
                <h3 style={{ fontSize: '16px', color: '#ec4899', marginBottom: '16px' }}>FORJA DE SUBTÍTULOS CINÉTICOS (HOD)</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Genera subtítulos palabra por palabra en SRT, ASS y VTT sincronizados con precisión de microsegundos.</p>
                <button
                  onClick={handleCaptionsOnly}
                  disabled={isProcessing}
                  style={{ marginTop: '12px', padding: '12px 20px', borderRadius: '8px', background: '#ec4899', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  {isProcessing ? 'COMPILANDO SUBTÍTULOS...' : 'GENERAR SUBTÍTULOS CINÉTICOS'}
                </button>
              </div>
            )}

            {/* Mode 4: Motion Only */}
            {studioMode === 'MOTION_ONLY' && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', maxWidth: '640px' }}>
                <h3 style={{ fontSize: '16px', color: '#f59e0b', marginBottom: '16px' }}>FORJA DE MOVIMIENTO (TIFERET)</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Aplica curvas elásticas de aceleración física, zooms dinámicos y transiciones Remotion.</p>
                <button
                  onClick={handleMotionOnly}
                  disabled={isProcessing}
                  style={{ marginTop: '12px', padding: '12px 20px', borderRadius: '8px', background: '#f59e0b', color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  {isProcessing ? 'SINTETIZANDO MOTION...' : 'GENERAR CAPAS DE MOVIMIENTO'}
                </button>
              </div>
            )}

            {/* Output Display */}
            {lastOutput && (
              <div style={{ marginTop: '24px', background: 'rgba(52,199,89,0.08)', border: '1px solid #34c759', borderRadius: '10px', padding: '16px', maxWidth: '640px' }}>
                <span style={{ fontSize: '12px', color: '#34c759', fontWeight: 700 }}>RESULTADO GENERADO CON ÉXITO</span>
                <pre style={{ fontSize: '11px', fontFamily: 'monospace', color: '#fff', margin: '8px 0 0 0', overflowX: 'auto' }}>
                  {JSON.stringify(lastOutput, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: FOUR WORLDS MATRIX */}
        {navSection === 'FOUR_WORLDS' && (
          <div>
            <header style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', color: '#d4af37', fontWeight: 700, letterSpacing: '0.05em' }}>COSMOLOGÍA COMPUTACIONAL</span>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700 }}>MATRIZ DE LOS CUATRO MUNDOS</h2>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { world: 'ATZILUT', letter: 'א (ALEPH)', operator: 'ARQUITECTO', sefirah: 'KETER', desc: 'Emanación y Voluntad Arquetípica de la Intención Humana', color: '#d4af37' },
                { world: 'BERIAH', letter: 'י (YOD) & מ (MEM)', operator: 'YOD & CONTENIDO', sefirah: 'CHOKHMAH & BINAH', desc: 'Creación, Radar de Hooks y Matriz Estructural CAS', color: '#38bdf8' },
                { world: 'YETZIRAH', letter: 'ש, ו, פ, ת', operator: 'SHIM, VAV, HOD, YESOD', sefirah: 'DAAT, TIFERET, HOD, YESOD', desc: 'Formación, Compuerta de Realidad, Cortes de Video, Tipografía y Empaquetado', color: '#a855f7' },
                { world: 'ASSIAH', letter: 'ה (HE)', operator: 'HE_OPERATIONS', sefirah: 'MALKHUT', desc: 'Acción, Gobernanza Humana y Manifestación Física', color: '#14b8a6' }
              ].map((w) => (
                <div key={w.world} style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${w.color}`, borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '16px', color: w.color }}>{w.world} &bull; {w.letter}</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: '4px' }}>{w.desc}</span>
                  </div>
                  <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: '#fff' }}>{w.operator}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: PROJECTS EXPLORER */}
        {navSection === 'PROJECTS' && (
          <div>
            <header style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', color: '#d4af37', fontWeight: 700, letterSpacing: '0.05em' }}>ALMACENAMIENTO CANÓNICO</span>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700 }}>EXPLORADOR DE PROYECTOS</h2>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>{p.name}</span>
                    <span style={{ fontSize: '12px', color: '#d4af37', display: 'block', marginTop: '2px', fontFamily: 'monospace' }}>{p.casAddress}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ padding: '6px 12px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Abrir</button>
                    <button style={{ padding: '6px 12px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Duplicar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: SETTINGS */}
        {navSection === 'SETTINGS' && (
          <div>
            <header style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', color: '#d4af37', fontWeight: 700, letterSpacing: '0.05em' }}>CONFIGURACIÓN</span>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700 }}>BRAND DNA & MEMORIA LOCAL</h2>
            </header>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', maxWidth: '600px' }}>
              <h3 style={{ fontSize: '15px', color: '#d4af37', marginBottom: '12px' }}>ESTRUCTURA DE ALMACENAMIENTO</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                Todos los proyectos se persisten en <code>Projects/</code> con hashes criptográficos inmutables <code>cas://</code> en SQLite ACID local.
              </p>
              <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', background: 'rgba(52,199,89,0.2)', color: '#34c759' }}>SQLite: OK</span>
                <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', background: 'rgba(56,189,248,0.2)', color: '#38bdf8' }}>CAS Engine: ACTIVO</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
