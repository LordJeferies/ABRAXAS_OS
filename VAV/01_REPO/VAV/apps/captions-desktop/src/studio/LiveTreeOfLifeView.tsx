import React, { useState } from 'react';
import { MODULE_IDENTITIES, ModuleIdentity } from './ModuleVisualIdentity';

export const LiveTreeOfLifeView: React.FC = () => {
  const sephirothList = Object.values(MODULE_IDENTITIES);
  const [selectedModule, setSelectedModule] = useState<ModuleIdentity>(sephirothList[0]);
  const [activeAnimIndex, setActiveAnimIndex] = useState<number>(0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', padding: '24px', background: '#0a0a0c', color: '#f5f5f7', minHeight: '80vh', fontFamily: '-apple-system, sans-serif' }}>
      {/* Visual Tree Canvas */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#d4af37', margin: 0 }}>LIVE TREE OF LIFE SEPHIROTHIC MATRIX</h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0' }}>Click any Sephirah to inspect technical invariants, current processes and code locations.</p>
          </div>
          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '100px', background: 'rgba(52, 199, 89, 0.2)', color: '#34c759', fontWeight: 600 }}>
            DAAT GATE: LOCKED (0 GAPS)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sephirothList.map((m, idx) => {
            const isSelected = selectedModule.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedModule(m)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? `1px solid ${m.color}` : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: isSelected ? `0 0 16px ${m.glowColor}` : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '20px' }}>{m.icon}</span>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: m.color, display: 'block' }}>
                      {m.sefirah} &bull; {m.name}
                    </span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                      {m.purpose}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'monospace' }}>
                  ONLINE
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Inspector Panel */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${selectedModule.color}`, borderRadius: '12px', padding: '24px', boxShadow: `0 0 20px ${selectedModule.glowColor}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '32px' }}>{selectedModule.icon}</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '20px', color: selectedModule.color }}>{selectedModule.sefirah}</h3>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{selectedModule.name}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
          <div>
            <strong style={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Symbolic Purpose</strong>
            <p style={{ margin: '4px 0 0 0', color: '#fff', lineHeight: 1.4 }}>{selectedModule.purpose}</p>
          </div>

          <div>
            <strong style={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Technical Operating Role</strong>
            <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>{selectedModule.technicalRole}</p>
          </div>

          <div>
            <strong style={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Canonical Code Location</strong>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: selectedModule.color, background: 'rgba(0,0,0,0.5)', padding: '6px 10px', borderRadius: '6px', display: 'block', marginTop: '4px' }}>
              {selectedModule.codeLocation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
