import React, { useState } from 'react';
import { CreatorStudioHome, StudioScreen } from './CreatorStudioHome';
import { LiveTreeOfLifeView } from './LiveTreeOfLifeView';
import { ProjectWorkspaceView } from './ProjectWorkspaceView';

export const CreatorStudioApp: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<StudioScreen>('HOME');

  return (
    <div>
      {activeScreen === 'HOME' && (
        <CreatorStudioHome
          activeScreen={activeScreen}
          onSelectScreen={(screen) => setActiveScreen(screen)}
        />
      )}

      {activeScreen === 'TREE_CONTROL' && (
        <div>
          <div style={{ padding: '12px 24px', background: '#050507', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setActiveScreen('HOME')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
              &larr; Back to Studio Home
            </button>
            <span style={{ color: '#d4af37', fontWeight: 600 }}>ABRAXAS OS &bull; SEPHIROTHIC CONTROL CENTER</span>
          </div>
          <LiveTreeOfLifeView />
        </div>
      )}

      {activeScreen === 'LIBRARY' && (
        <div>
          <div style={{ padding: '12px 24px', background: '#050507', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setActiveScreen('HOME')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
              &larr; Back to Studio Home
            </button>
            <span style={{ color: '#d4af37', fontWeight: 600 }}>PROJECT WORKSPACE &bull; CAS REVISION REGISTRY</span>
          </div>
          <ProjectWorkspaceView />
        </div>
      )}
    </div>
  );
};
