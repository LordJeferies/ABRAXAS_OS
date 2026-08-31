import React, { useState } from 'react';

export type StudioScreen = 'HOME' | 'CREATE_NEW' | 'TRANSFORM' | 'LIBRARY' | 'TREE_CONTROL' | 'STATUS';

interface CreatorStudioHomeProps {
  onSelectScreen: (screen: StudioScreen) => void;
  activeScreen: StudioScreen;
}

export const CreatorStudioHome: React.FC<CreatorStudioHomeProps> = ({ onSelectScreen, activeScreen }) => {
  return (
    <div style={{ padding: '24px', background: '#0a0a0c', color: '#f5f5f7', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #d4af37 0%, #f3e5ab 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
            A
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em' }}>ABRAXAS OS CREATOR STUDIO</h1>
            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Autonomous Creative Operating System V6.0</p>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onSelectScreen('HOME')} style={{ background: activeScreen === 'HOME' ? 'rgba(255,255,255,0.15)' : 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            Home
          </button>
          <button onClick={() => onSelectScreen('LIBRARY')} style={{ background: activeScreen === 'LIBRARY' ? 'rgba(255,255,255,0.15)' : 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            Project Library
          </button>
          <button onClick={() => onSelectScreen('TREE_CONTROL')} style={{ background: activeScreen === 'TREE_CONTROL' ? 'rgba(255,255,255,0.15)' : 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#d4af37', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            Tree Of Life Center
          </button>
        </nav>
      </header>

      <main>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {/* Card 1: Create New */}
          <div onClick={() => onSelectScreen('CREATE_NEW')} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'transform 0.2s' }}>
            <span style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}>✨</span>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#fff' }}>CREATE NEW CONTENT</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
              Manifest complete creative media from raw idea, product concept, or strategic objective.
            </p>
          </div>

          {/* Card 2: Transform Existing */}
          <div onClick={() => onSelectScreen('TRANSFORM')} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'transform 0.2s' }}>
            <span style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}>⚡</span>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#fff' }}>TRANSFORM EXISTING</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
              Apply motion, kinetic subtitles, hook enhancement, or full structural restructuring to existing video.
            </p>
          </div>

          {/* Card 3: Project Library */}
          <div onClick={() => onSelectScreen('LIBRARY')} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'transform 0.2s' }}>
            <span style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}>📁</span>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#fff' }}>PROJECT LIBRARY</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
              Access persistent projects, CAS artifact addresses, revision stratigraphy and publish receipts.
            </p>
          </div>

          {/* Card 4: System Status */}
          <div onClick={() => onSelectScreen('TREE_CONTROL')} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', cursor: 'pointer', transition: 'transform 0.2s' }}>
            <span style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}>🏛️</span>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#fff' }}>SYSTEM CONTROL</h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
              Inspect live Tree of Life Sephiroth states, memory stratigraphy, neural events and guardian health.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
