import React from 'react';

export const ProjectWorkspaceView: React.FC = () => {
  return (
    <div style={{ padding: '24px', background: '#0a0a0c', color: '#f5f5f7', minHeight: '80vh', fontFamily: '-apple-system, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#d4af37', fontWeight: 700, letterSpacing: '0.05em' }}>ACTIVE PROJECT WORKSPACE</span>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '22px' }}>Oud Royal Extrait — TikTok Viral Campaign</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ padding: '6px 14px', borderRadius: '6px', background: 'rgba(212,175,55,0.15)', color: '#d4af37', fontSize: '13px', fontWeight: 600, border: '1px solid #d4af37' }}>
            SEFIRAH: MALKHUT
          </span>
          <span style={{ padding: '6px 14px', borderRadius: '6px', background: 'rgba(52,199,89,0.2)', color: '#34c759', fontSize: '13px', fontWeight: 600 }}>
            STATUS: 100% COMPLETE
          </span>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Timeline & Preview Panel */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: '#d4af37', marginBottom: '16px' }}>GENERATED ASSET PIPELINE</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span>🎬 Master Render Video (1080x1920 60fps AV1)</span>
              <span style={{ color: '#34c759' }}>CERTIFIED</span>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span>📜 Kinetic Subtitles (Word-level ASS/SRT/VTT)</span>
              <span style={{ color: '#34c759' }}>COMPILED</span>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span>✨ Remotion Motion Manifest (4 Dynamic Layers)</span>
              <span style={{ color: '#34c759' }}>SYNTHESIZED</span>
            </div>
            <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span>📦 Sovereign Package (cas://7197210...abraxas)</span>
              <span style={{ color: '#34c759' }}>MANIFESTED</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations & Retention Panel */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', color: '#d4af37', marginBottom: '16px' }}>AI CREATIVE INTELLIGENCE</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>HOOK SCORE</span>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#38bdf8' }}>94 / 100</div>
            </div>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>PREDICTED 3S RETENTION</span>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#34c759' }}>92.4%</div>
            </div>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>LEARNED HEURISTIC</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#fff', lineHeight: 1.4 }}>
                Question hook in opening 2.4s drives a 1.15x multiplier over baseline direct statements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
