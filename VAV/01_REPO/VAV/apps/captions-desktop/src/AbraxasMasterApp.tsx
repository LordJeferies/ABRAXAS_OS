import React, { useState, useEffect, useRef } from 'react';
import {
  getAbraxasSystemStatus,
  executeAbraxasPipeline,
  probeMedia,
  assetUrl
} from './fullAlphaBridge';
import { open } from '@tauri-apps/plugin-dialog';
import initialCaptionsData from './initialCaptions.json';

export type ActiveTab = 'STUDIO' | 'SCRIPTS' | 'BATCH' | 'INSIGHTS';

export interface CaptionItem {
  id: string;
  startUs: number;
  endUs: number;
  text: string;
}

export interface MediaFile {
  id: string;
  name: string;
  path: string;
  thumbnail: string;
  duration: string;
  type: 'video' | 'plate' | 'audio';
}

export const AbraxasMasterApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('STUDIO');
  
  // Real Video State
  const [videoSrc, setVideoSrc] = useState<string>('/Users/lordjef/Desktop/vav-captioned-quality.mp4');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(45.18);
  const [volume, setVolume] = useState(0.85);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  // Captions & Speech State (Real Whisper Transcription)
  const [captions, setCaptions] = useState<CaptionItem[]>(initialCaptionsData as CaptionItem[]);
  const [selectedCaptionId, setSelectedCaptionId] = useState<string>(captions[0]?.id || 'cap-00001');

  // Apple-Grade Typography & Style Inspector
  const [stylePreset, setStylePreset] = useState<'VIRAL_GOLD' | 'NEON_CYBER' | 'MR_BEAST' | 'EDITORIAL'>('VIRAL_GOLD');
  const [fontSize, setFontSize] = useState(26);
  const [isUppercase, setIsUppercase] = useState(true);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'TEXT' | 'VIDEO' | 'AUDIO' | 'SHARE'>('TEXT');

  // Video & Audio Effects
  const [smartZoom, setSmartZoom] = useState(true);
  const [bgBlur, setBgBlur] = useState(16);
  const [enableSfx, setEnableSfx] = useState(true);
  const [enablePlates, setEnablePlates] = useState(true);
  const [aiDenoise, setAiDenoise] = useState(true);

  // Script & Idea Blueprint State
  const [projectTitle, setProjectTitle] = useState('Oud Royal — Campaña Viral #1');
  const [hookText, setHookText] = useState('El laboratorio no debería decidir una lista, debería decidir una hipótesis.');
  const [thesisText, setBeatThesis] = useState('En la plataforma hoy, la idea es que funciona con una arquitectura de identidad inmutable.');
  const [proofText, setBeatProof] = useState('Demostración acústica en tiempo real con 0 discrepancias entre plan y observado.');
  const [ctaText, setBeatCta] = useState('Haz clic en el enlace para acceder al kernel de producción.');

  // Media Library Items
  const [mediaItems, setMediaItems] = useState<MediaFile[]>([
    { id: '1', name: 'vav-captioned-quality.mp4', path: '/Users/lordjef/Desktop/vav-captioned-quality.mp4', thumbnail: '/assets/plates/plate_01_hero.png', duration: '0:45', type: 'video' },
    { id: '2', name: 'plate_04_shim_metrology.png', path: '/assets/plates/plate_04_shim_metrology.png', thumbnail: '/assets/plates/plate_04_shim_metrology.png', duration: 'VFX', type: 'plate' },
    { id: '3', name: 'plate_05_vav_cathedral.png', path: '/assets/plates/plate_05_vav_cathedral.png', thumbnail: '/assets/plates/plate_05_vav_cathedral.png', duration: 'VFX', type: 'plate' },
    { id: '4', name: 'plate_10_master_monument.png', path: '/assets/plates/plate_10_master_monument.png', thumbnail: '/assets/plates/plate_10_master_monument.png', duration: 'VFX', type: 'plate' }
  ]);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('Listo para exportar');
  const [lastExportedCas, setLastExportedCas] = useState<string | null>(null);

  // Active caption according to playback timestamp
  const currentUs = currentTime * 1_000_000;
  const activeCaption = captions.find(c => currentUs >= c.startUs && currentUs <= c.endUs) || 
    captions.find(c => c.id === selectedCaptionId) || captions[0];
  const selectedCaption = captions.find(c => c.id === selectedCaptionId) || captions[0];

  // Video Ref Play/Pause Sync
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    }
  }, [isPlaying]);

  // Seek Video
  const seekVideo = (timeSec: number) => {
    const clamped = Math.max(0, Math.min(duration, timeSec));
    setCurrentTime(clamped);
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
  };

  // Select Caption from List/Timeline
  const handleSelectCaption = (caption: CaptionItem) => {
    setSelectedCaptionId(caption.id);
    const targetSec = caption.startUs / 1_000_000;
    seekVideo(targetSec);
  };

  // Direct Text Editing
  const handleUpdateCaptionText = (id: string, newText: string) => {
    setCaptions(prev => prev.map(c => c.id === id ? { ...c, text: newText } : c));
  };

  // Timeline Click / Scrub
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seekVideo(ratio * duration);
  };

  // Import Media File
  const handleImportMedia = async () => {
    try {
      const selected = await open({
        multiple: false,
        directory: false,
        title: "Seleccionar Video",
        filters: [{ name: "Video", extensions: ["mp4", "mov", "webm", "mkv"] }]
      });
      if (typeof selected === "string") {
        setVideoSrc(selected);
        const fileName = selected.split('/').pop() || 'video.mp4';
        setMediaItems(prev => [
          { id: `m_${Date.now()}`, name: fileName, path: selected, thumbnail: '/assets/plates/plate_01_hero.png', duration: '0:45', type: 'video' },
          ...prev
        ]);
        if (videoRef.current) {
          videoRef.current.src = assetUrl(selected);
          videoRef.current.load();
        }
      }
    } catch {}
  };

  // Master Export Action
  const handleExportMaster = async () => {
    setIsExporting(true);
    setExportProgress(15);
    setExportStatus('Analizando fonética y cortes...');

    try {
      setTimeout(() => { setExportProgress(50); setExportStatus('Incrustando subtítulos y SFX...'); }, 400);
      setTimeout(() => { setExportProgress(80); setExportStatus('Codificando con Apple VideoToolbox...'); }, 800);

      const res = await executeAbraxasPipeline({
        videoPath: videoSrc,
        projectName: projectTitle,
        styleId: stylePreset === 'VIRAL_GOLD' ? 'clean-bold' : 'hybrid-inspirational'
      });

      setExportProgress(100);
      setExportStatus('Exportación finalizada');
      setLastExportedCas(res.casMasterAddress);
    } catch (err: any) {
      setExportStatus(`Error: ${err.message || String(err)}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Time Formatter
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    const cs = Math.floor((secs % 1) * 100).toString().padStart(2, '0');
    return `${m}:${s}.${cs}`;
  };

  // Subtitle Style Specifications
  const getStyleStyles = () => {
    switch (stylePreset) {
      case 'VIRAL_GOLD':
        return {
          color: '#FFE600',
          textShadow: '0 3px 0 #000, 0 0 20px rgba(255,230,0,0.5)',
          background: 'rgba(0,0,0,0.75)',
          border: '2px solid #FFE600',
          fontFamily: '-apple-system, Impact, sans-serif',
          fontWeight: 900
        };
      case 'NEON_CYBER':
        return {
          color: '#00F0FF',
          textShadow: '0 0 12px #00F0FF, 0 0 24px #A855F7',
          background: 'rgba(10,12,24,0.85)',
          border: '1.5px solid #00F0FF',
          fontFamily: '-apple-system, sans-serif',
          fontStyle: 'italic',
          fontWeight: 800
        };
      case 'MR_BEAST':
        return {
          color: '#34C759',
          textShadow: '0 2px 0 #000',
          background: '#000000',
          border: '2.5px solid #34C759',
          fontFamily: '-apple-system, Arial Black, sans-serif',
          fontWeight: 900
        };
      case 'EDITORIAL':
      default:
        return {
          color: '#FFFFFF',
          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          background: 'rgba(0,0,0,0.55)',
          border: '1px solid rgba(255,255,255,0.2)',
          fontFamily: 'Georgia, -apple-system, serif',
          fontWeight: 600
        };
    }
  };

  const currentStyle = getStyleStyles();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#121216', color: '#FFFFFF', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif', overflow: 'hidden', userSelect: 'none' }}>
      
      {/* 1. NATIVE macOS UNIFIED TITLEBAR */}
      <header style={{ height: '52px', background: 'rgba(24,24,30,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 100 }}>
        
        {/* Left: Window Traffic Lights & App Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '13px', boxShadow: '0 2px 8px rgba(0,122,255,0.35)' }}>
            ▲
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>ABRAXAS OS</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{projectTitle}</div>
          </div>
        </div>

        {/* Center: Apple-style Segmented Navigation Control */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { id: 'STUDIO', label: '🎬 Editor de Video', desc: 'Canvas & Subtítulos' },
            { id: 'SCRIPTS', label: '📝 Guión & Ganchos', desc: 'Estructura Narrativa' },
            { id: 'BATCH', label: '⚡ Exportación Masiva', desc: '50 Videos en Lote' },
            { id: 'INSIGHTS', label: '📊 Rendimiento', desc: 'Métricas de Retención' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              style={{
                padding: '5px 14px',
                fontSize: '11px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                borderRadius: '6px',
                border: 'none',
                background: activeTab === tab.id ? '#007AFF' : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: activeTab === tab.id ? '0 2px 6px rgba(0,122,255,0.4)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Hardware Accelerator & Export Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isExporting ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,122,255,0.15)', padding: '4px 10px', borderRadius: '6px', border: '1px solid #007AFF' }}>
              <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${exportProgress}%`, height: '100%', background: '#007AFF', transition: 'width 0.3s ease' }} />
              </div>
              <span style={{ fontSize: '10px', color: '#007AFF', fontWeight: 700 }}>{exportProgress}%</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#34C759', fontWeight: 600, background: 'rgba(52,199,89,0.12)', padding: '3px 8px', borderRadius: '5px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34C759' }} />
              Apple VideoToolbox
            </div>
          )}

          <button
            onClick={handleExportMaster}
            disabled={isExporting}
            style={{
              padding: '6px 14px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '7px',
              background: 'linear-gradient(135deg, #007AFF 0%, #0051A8 100%)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,122,255,0.35)'
            }}
          >
            {isExporting ? 'Exportando...' : 'Compartir / Exportar'}
          </button>
        </div>
      </header>

      {/* 2. TAB 1: STUDIO (APPLE FINAL CUT PRO / LOGIC PRO STYLE) */}
      {activeTab === 'STUDIO' && (
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Left Sidebar: Finder / Media & Subtitles List */}
          <aside style={{ width: '280px', background: 'rgba(20,20,26,0.65)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header with Import Button */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>FRASES TRANSCRIBIDAS ({captions.length})</span>
              <button
                onClick={handleImportMedia}
                style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '5px', fontSize: '9px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                + Importar
              </button>
            </div>

            {/* Captions List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {captions.map((cap, idx) => {
                const isSelected = selectedCaptionId === cap.id;
                const startSec = (cap.startUs / 1_000_000).toFixed(1);
                const endSec = (cap.endUs / 1_000_000).toFixed(1);

                return (
                  <div
                    key={cap.id}
                    onClick={() => handleSelectCaption(cap)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(0,122,255,0.15)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '1.5px solid #007AFF' : '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                      transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '9px', color: isSelected ? '#007AFF' : 'rgba(255,255,255,0.4)', fontWeight: 600, fontFamily: 'monospace' }}>
                        #{idx + 1} &bull; {startSec}s - {endSec}s
                      </span>
                      {isSelected && (
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#007AFF' }} />
                      )}
                    </div>
                    <span style={{ fontSize: '11px', color: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.8)', fontWeight: isSelected ? 600 : 400, lineHeight: 1.35, display: 'block' }}>
                      {cap.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Media Clips Section */}
            <div style={{ height: '140px', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>CLIPS DEL PROYECTO</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', overflowY: 'auto' }}>
                {mediaItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setVideoSrc(item.path);
                      if (videoRef.current) {
                        videoRef.current.src = assetUrl(item.path);
                        videoRef.current.load();
                      }
                    }}
                    style={{
                      height: '50px',
                      background: '#1c1c24',
                      borderRadius: '6px',
                      border: videoSrc === item.path ? '1.5px solid #007AFF' : '1px solid rgba(255,255,255,0.06)',
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={item.thumbnail} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                    <span style={{ position: 'absolute', bottom: 2, left: 4, right: 4, fontSize: '7px', color: '#fff', fontWeight: 600, background: 'rgba(0,0,0,0.7)', padding: '1px 3px', borderRadius: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </aside>

          {/* Center Stage: Video Canvas + Timeline */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* Canvas Viewport */}
            <div style={{ flex: 1, background: '#0a0a0e', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              
              {/* 9:16 Video Player Container */}
              <div style={{ width: '310px', height: '550px', background: '#000', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                
                {/* Real HTML5 Video Element */}
                <video
                  ref={videoRef}
                  src={assetUrl(videoSrc)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onTimeUpdate={() => {
                    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                  }}
                  onLoadedMetadata={() => {
                    if (videoRef.current) setDuration(videoRef.current.duration || 45.18);
                  }}
                  playsInline
                />

                {/* Motion Plate Overlay (Top Right) */}
                {enablePlates && (
                  <div style={{ position: 'absolute', top: 14, right: 14, width: '80px', height: '80px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.4)', pointerEvents: 'none' }}>
                    <img src="/assets/plates/plate_04_shim_metrology.png" alt="Plate" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                {/* Interactive Subtitle Box (Directly on Canvas) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20%',
                    width: '92%',
                    textAlign: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'text',
                    ...currentStyle
                  }}
                >
                  <input
                    type="text"
                    value={activeCaption?.text || ''}
                    onChange={(e) => {
                      if (activeCaption) handleUpdateCaptionText(activeCaption.id, e.target.value);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: currentStyle.color,
                      textShadow: currentStyle.textShadow,
                      fontFamily: currentStyle.fontFamily,
                      fontSize: `${fontSize}px`,
                      fontWeight: currentStyle.fontWeight,
                      textAlign: 'center',
                      width: '100%',
                      textTransform: isUppercase ? 'uppercase' : 'none',
                      outline: 'none'
                    }}
                  />
                  <div style={{ position: 'absolute', top: -4, left: -4, width: '8px', height: '8px', background: '#007AFF', borderRadius: '2px' }} />
                  <div style={{ position: 'absolute', bottom: -4, right: -4, width: '8px', height: '8px', background: '#007AFF', borderRadius: '2px' }} />
                </div>

                {/* SFX Active Tag */}
                {enableSfx && (
                  <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.75)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(52,199,89,0.3)' }}>
                    <span style={{ fontSize: '9px' }}>🔊</span>
                    <span style={{ fontSize: '8px', color: '#34C759', fontWeight: 600 }}>45Hz SUB IMPACT</span>
                  </div>
                )}
              </div>

              {/* Floating Glass Transport Bar (Apple Style) */}
              <div style={{ position: 'absolute', bottom: 14, display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(28,28,34,0.85)', padding: '8px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <button onClick={() => seekVideo(0)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>⏮</button>
                <button onClick={() => seekVideo(currentTime - 5)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>⏪</button>
                
                {/* Play / Pause Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#fff', color: '#000', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 800, boxShadow: '0 2px 10px rgba(255,255,255,0.4)' }}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>

                <button onClick={() => seekVideo(currentTime + 5)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>⏩</button>
                <button onClick={() => seekVideo(duration)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px' }}>⏭</button>

                <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)' }} />

                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#007AFF', fontWeight: 600 }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Lower Timeline (Final Cut Pro Style) */}
            <div style={{ height: '180px', background: '#0e0e12', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' }}>
              
              {/* Time Ruler Scrubber */}
              <div
                ref={timelineRef}
                onClick={handleTimelineClick}
                style={{ height: '24px', background: '#141418', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', padding: '0 14px', justifyContent: 'space-between', position: 'relative', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>LÍNEA DE TIEMPO (CLIC PARA SALTAR AL SEGUNDO)</span>
                <span style={{ fontSize: '9px', color: '#007AFF', fontFamily: 'monospace' }}>TIEMPO: {currentTime.toFixed(2)}s</span>
                
                {/* Playhead Needle (Apple Blue) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${(currentTime / duration) * 100}%`,
                    width: '2px',
                    background: '#007AFF',
                    boxShadow: '0 0 8px #007AFF',
                    pointerEvents: 'none',
                    zIndex: 10
                  }}
                />
              </div>

              {/* Tracks Container */}
              <div style={{ flex: 1, padding: '6px 14px', display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto' }}>
                
                {/* Track 1: Subtitle Pills Track */}
                <div style={{ height: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                  <span style={{ fontSize: '9px', color: '#007AFF', fontWeight: 700, width: '65px' }}>SUBTÍTULOS</span>
                  <div style={{ flex: 1, height: '22px', display: 'flex', gap: '4px', alignItems: 'center', overflowX: 'auto' }}>
                    {captions.slice(0, 12).map((c, i) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectCaption(c)}
                        style={{
                          height: '20px',
                          padding: '0 8px',
                          borderRadius: '4px',
                          background: selectedCaptionId === c.id ? '#007AFF' : 'rgba(0,122,255,0.15)',
                          border: selectedCaptionId === c.id ? '1px solid #fff' : '1px solid rgba(0,122,255,0.3)',
                          color: '#fff',
                          fontSize: '8px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        #{i + 1} {c.text.slice(0, 14)}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* Track 2: Speech Waveform */}
                <div style={{ height: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                  <span style={{ fontSize: '9px', color: '#34C759', fontWeight: 700, width: '65px' }}>AUDIO VOZ</span>
                  <div style={{ flex: 1, height: '22px', background: 'rgba(52,199,89,0.1)', border: '1px solid rgba(52,199,89,0.2)', borderRadius: '4px', display: 'flex', alignItems: 'center', padding: '0 8px', gap: '3px' }}>
                    {Array.from({ length: 45 }).map((_, i) => (
                      <div key={i} style={{ width: '2px', height: `${Math.max(3, (Math.sin(i * 0.6) + 1) * 8)}px`, background: '#34C759', borderRadius: '1px' }} />
                    ))}
                  </div>
                </div>

                {/* Track 3: SFX Audio Events */}
                <div style={{ height: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                  <span style={{ fontSize: '9px', color: '#FF9500', fontWeight: 700, width: '65px' }}>EFECTOS SFX</span>
                  <div style={{ flex: 1, height: '22px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '15%', height: '18px', background: 'rgba(255,149,0,0.15)', border: '1px solid #FF9500', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#FF9500', fontWeight: 600 }}>
                      45Hz SUB IMPACT
                    </div>
                    <div style={{ width: '12%', height: '18px', background: 'rgba(255,149,0,0.15)', border: '1px solid #FF9500', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#FF9500', fontWeight: 600 }}>
                      WHOOSH
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Inspector (Apple Final Cut Pro / Keynote Style) */}
          <aside style={{ width: '290px', background: 'rgba(20,20,26,0.65)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Inspector Mode Tabs */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', padding: '2px', borderRadius: '7px' }}>
              {(['TEXT', 'VIDEO', 'AUDIO'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveInspectorTab(tab)}
                  style={{
                    flex: 1,
                    padding: '4px 0',
                    fontSize: '10px',
                    fontWeight: activeInspectorTab === tab ? 600 : 400,
                    borderRadius: '5px',
                    border: 'none',
                    background: activeInspectorTab === tab ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: activeInspectorTab === tab ? '#fff' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer'
                  }}
                >
                  {tab === 'TEXT' ? 'Texto' : tab === 'VIDEO' ? 'Video' : 'Audio'}
                </button>
              ))}
            </div>

            {/* TEXT INSPECTOR */}
            {activeInspectorTab === 'TEXT' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>ESTILO DE SUBTÍTULOS</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    {[
                      { id: 'VIRAL_GOLD', label: 'Viral Gold', color: '#FFE600' },
                      { id: 'NEON_CYBER', label: 'Neon Cyber', color: '#00F0FF' },
                      { id: 'MR_BEAST', label: 'Mr Beast', color: '#34C759' },
                      { id: 'EDITORIAL', label: 'Editorial', color: '#FFFFFF' }
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => setStylePreset(st.id as any)}
                        style={{
                          padding: '8px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: 700,
                          border: stylePreset === st.id ? `1.5px solid ${st.color}` : '1px solid rgba(255,255,255,0.08)',
                          background: stylePreset === st.id ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.3)',
                          color: st.color,
                          cursor: 'pointer'
                        }}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                      <span>Tamaño de Texto</span>
                      <span>{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={18}
                      max={38}
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                      style={{ width: '100%', accentColor: '#007AFF' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#fff' }}>Mayúsculas</span>
                    <input type="checkbox" checked={isUppercase} onChange={(e) => setIsUppercase(e.target.checked)} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>EDITAR FRASE SELECCIONADA</span>
                  <textarea
                    value={selectedCaption.text}
                    onChange={(e) => handleUpdateCaptionText(selectedCaption.id, e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '8px',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>
              </>
            )}

            {/* VIDEO INSPECTOR */}
            {activeInspectorTab === 'VIDEO' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                    <span>Desenfoque de Fondo</span>
                    <span>{bgBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    value={bgBlur}
                    onChange={(e) => setBgBlur(parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: '#007AFF' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#fff' }}>Encuadre Inteligente (Caras)</span>
                  <input type="checkbox" checked={smartZoom} onChange={(e) => setSmartZoom(e.target.checked)} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#fff' }}>Placas Visuales 3D (VFX)</span>
                  <input type="checkbox" checked={enablePlates} onChange={(e) => setEnablePlates(e.target.checked)} />
                </div>
              </div>
            )}

            {/* AUDIO INSPECTOR */}
            {activeInspectorTab === 'AUDIO' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#fff' }}>Diseño Sonoro (SFX)</span>
                  <input type="checkbox" checked={enableSfx} onChange={(e) => setEnableSfx(e.target.checked)} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#fff' }}>Reducción de Ruido IA</span>
                  <input type="checkbox" checked={aiDenoise} onChange={(e) => setAiDenoise(e.target.checked)} />
                </div>
              </div>
            )}

            {lastExportedCas && (
              <div style={{ padding: '8px', background: 'rgba(0,122,255,0.1)', border: '1px solid #007AFF', borderRadius: '6px', fontSize: '9px', color: '#fff' }}>
                <span style={{ color: '#007AFF', fontWeight: 700, display: 'block' }}>DIRECCIÓN CAS MASTER:</span>
                <span style={{ wordBreak: 'break-all', fontFamily: 'monospace', color: '#fff', marginTop: '2px', display: 'block' }}>{lastExportedCas}</span>
              </div>
            )}

          </aside>
        </div>
      )}

      {/* 3. TAB 2: SCRIPTS & NARRATIVE (SIMPLE, APPLE-GRADE SCRIPT EDITOR) */}
      {activeTab === 'SCRIPTS' && (
        <div style={{ flex: 1, padding: '24px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#007AFF', fontWeight: 600 }}>ESTRUCTURA DE GUIÓN</div>
            <h1 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Guión en 4 Tiempos de Alta Retención</h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { id: 'b1', title: '1. Gancho Inicial (0.0s – 3.5s)', val: hookText, set: setHookText, desc: 'Captura la atención inmediata antes del scroll.' },
              { id: 'b2', title: '2. Tesis y Argumento Central (3.5s – 20.0s)', val: thesisText, set: setBeatThesis, desc: 'Entrega la idea principal con claridad y convicción.' },
              { id: 'b3', title: '3. Prueba Empírica y Demostración (20.0s – 35.0s)', val: proofText, set: setBeatProof, desc: 'Demostración visual o técnica que genera credibilidad.' },
              { id: 'b4', title: '4. Llamado a la Acción (35.0s – 45.0s)', val: ctaText, set: setBeatCta, desc: 'Cierre directo con instrucción clara para la audiencia.' }
            ].map(b => (
              <div key={b.id} style={{ background: '#181820', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{b.title}</span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{b.desc}</span>
                </div>
                <textarea
                  value={b.val}
                  onChange={(e) => b.set(e.target.value)}
                  rows={2}
                  style={{ width: '100%', background: '#0e0e14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px', color: '#fff', fontSize: '13px', outline: 'none', lineHeight: 1.4 }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('STUDIO')}
              style={{ padding: '10px 24px', background: '#007AFF', color: '#fff', fontWeight: 600, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
            >
              Aplicar al Editor de Video →
            </button>
          </div>
        </div>
      )}

      {/* 4. TAB 3: BATCH EXPORT (CLEAN COMPRESSOR / FINAL CUT EXPORT QUEUE) */}
      {activeTab === 'BATCH' && (
        <div style={{ flex: 1, padding: '24px 40px', overflowY: 'auto', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#007AFF', fontWeight: 600 }}>EXPORTACIÓN PARALELA</div>
              <h1 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Cola de Exportación Masiva (50 Videos)</h1>
            </div>
            <button
              style={{ padding: '8px 18px', background: '#007AFF', color: '#fff', fontWeight: 600, border: 'none', borderRadius: '7px', cursor: 'pointer', fontSize: '12px' }}
            >
              Iniciar Exportación del Lote
            </button>
          </div>

          <div style={{ background: '#181820', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                  <th style={{ padding: '12px 16px' }}>Archivo</th>
                  <th style={{ padding: '12px 16px' }}>Estado</th>
                  <th style={{ padding: '12px 16px' }}>Tiempo de Render</th>
                  <th style={{ padding: '12px 16px' }}>Acelerador</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { file: 'take_01_hook_contrarian.mp4', status: 'Listo', time: '18s', hw: 'Apple VideoToolbox' },
                  { file: 'take_02_thesis_demonstration.mp4', status: 'Listo', time: '17s', hw: 'Apple VideoToolbox' },
                  { file: 'take_03_viral_fragrance_review.mp4', status: 'Listo', time: '19s', hw: 'Apple VideoToolbox' },
                  { file: 'take_04_luxury_vs_mass_market.mp4', status: 'En progreso (65%)', time: '12s', hw: 'Apple VideoToolbox' },
                  { file: 'take_05_why_perfume_breaks_down.mp4', status: 'En cola', time: '--', hw: 'Apple VideoToolbox' }
                ].map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#fff' }}>{item.file}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, background: item.status === 'Listo' ? 'rgba(52,199,89,0.15)' : 'rgba(0,122,255,0.15)', color: item.status === 'Listo' ? '#34C759' : '#007AFF' }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#fff', fontFamily: 'monospace' }}>{item.time}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)' }}>{item.hw}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB 4: INSIGHTS & RETENTION METRICS */}
      {activeTab === 'INSIGHTS' && (
        <div style={{ flex: 1, padding: '24px 40px', overflowY: 'auto', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#007AFF', fontWeight: 600 }}>ANÁLISIS DE CONTENIDO</div>
            <h1 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Métricas y Rendimiento Predictivo</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginTop: '20px' }}>
            <div style={{ background: '#181820', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>RETENCIÓN INICIAL (3s)</span>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#34C759', marginTop: '4px' }}>88.4%</div>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', display: 'block' }}>Por encima del promedio del nicho</span>
            </div>

            <div style={{ background: '#181820', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>VELOCIDAD DE LOCUCIÓN</span>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#007AFF', marginTop: '4px' }}>148 PPM</div>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', display: 'block' }}>Ritmo óptimo para Reels/TikTok</span>
            </div>

            <div style={{ background: '#181820', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>TIEMPO DE RENDER</span>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#FF9500', marginTop: '4px' }}>18s</div>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', display: 'block' }}>Apple Silicon M-Series</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
