import React, { useState } from 'react';
import { AbraxasControlCenterApp } from './AbraxasControlCenterApp';
import { App as LegacyEditorApp } from './App';

export const RootApp: React.FC = () => {
  const [viewMode, setViewMode] = useState<'CONTROL_CENTER' | 'TIMELINE_EDITOR'>('CONTROL_CENTER');

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Global Top Banner Switcher */}
      <div style={{ position: 'absolute', top: 12, right: 16, zIndex: 9999, display: 'flex', gap: 6, background: 'rgba(0,0,0,0.8)', padding: '4px 8px', borderRadius: 20, border: '1px solid rgba(212,175,55,0.4)', backdropFilter: 'blur(10px)' }}>
        <button
          onClick={() => setViewMode('CONTROL_CENTER')}
          style={{
            padding: '4px 10px',
            fontSize: '11px',
            borderRadius: '12px',
            border: 'none',
            background: viewMode === 'CONTROL_CENTER' ? '#d4af37' : 'transparent',
            color: viewMode === 'CONTROL_CENTER' ? '#000' : '#fff',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          ORGANISM STUDIO
        </button>
        <button
          onClick={() => setViewMode('TIMELINE_EDITOR')}
          style={{
            padding: '4px 10px',
            fontSize: '11px',
            borderRadius: '12px',
            border: 'none',
            background: viewMode === 'TIMELINE_EDITOR' ? '#d4af37' : 'transparent',
            color: viewMode === 'TIMELINE_EDITOR' ? '#000' : '#fff',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          TIMELINE EDITOR
        </button>
      </div>

      {viewMode === 'CONTROL_CENTER' ? <AbraxasControlCenterApp /> : <LegacyEditorApp />}
    </div>
  );
};
