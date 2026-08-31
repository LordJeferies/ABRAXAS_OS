import React, { useState } from 'react';

export interface SefirahNode {
  sefirah: string;
  name: string;
  meaning: string;
  technicalFunction: string;
  activeModule: string;
  input: string;
  output: string;
  status: string;
}

export const TreeOfLifeControlCenter: React.FC = () => {
  const sephiroth: SefirahNode[] = [
    { sefirah: 'KETER', name: 'Primordial Intention', meaning: 'The root purpose of the creative act', technicalFunction: 'Natural language intention deconstruction', activeModule: 'ARQUITECTO', input: 'Human prompt', output: 'Structured Intent', status: 'ONLINE' },
    { sefirah: 'CHOKHMAH', name: 'Creative Spark', meaning: 'The insight flash and angle of attack', technicalFunction: 'Opportunity scoring & hook taxonomy', activeModule: 'YOD', input: 'Structured Intent', output: 'Ranked Hooks', status: 'ACTIVE' },
    { sefirah: 'BINAH', name: 'Matrix & Structure', meaning: 'The permanent crystal spine', technicalFunction: 'Immutable CAS DAG stratigraphy', activeModule: 'CONTENIDO', input: 'Hook hypothesis', output: 'Lienzo Entity', status: 'ACTIVE' },
    { sefirah: 'DAAT', name: 'Reality Metrology', meaning: 'Empirical verification abyss', technicalFunction: 'Whisper vs script verification gate', activeModule: 'SHIM', input: 'Audio stream & beats', output: 'Daat Certificate', status: 'VERIFIED' },
    { sefirah: 'TIFERET', name: 'Formation Forge', meaning: 'Radiant harmony and visual synthesis', technicalFunction: 'Lossless video cuts & Remotion renders', activeModule: 'VAV', input: 'Verified Lienzo', output: 'cas://master-cut', status: 'MANIFESTED' },
    { sefirah: 'HOD', name: 'Splendor & Typography', meaning: 'Word-level kinetic cadence', technicalFunction: 'Kinetic typography subtitle compiler', activeModule: 'VAV_CAPTIONS', input: 'Whisper words', output: 'Subtitles', status: 'MANIFESTED' },
    { sefirah: 'YESOD', name: 'Foundation & Bundle', meaning: 'Unified master integration', technicalFunction: 'Master CAS package registry', activeModule: 'INTEGRATION', input: 'All layers', output: 'CAS Delivery Bundle', status: 'MANIFESTED' },
    { sefirah: 'MALKHUT', name: 'Kingdom & Manifestation', meaning: 'Distribution in sovereign reality', technicalFunction: 'Operations desk review & publishing', activeModule: 'HE', input: 'CAS bundle & Approval', output: 'Publish Receipts', status: 'MANIFESTED' },
  ];

  const [selectedNode, setSelectedNode] = useState<SefirahNode>(sephiroth[0]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', padding: '24px', background: '#0a0a0c', color: '#f5f5f7', minHeight: '80vh', fontFamily: '-apple-system, sans-serif' }}>
      {/* Left: Tree visualization */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#d4af37', marginBottom: '16px', letterSpacing: '-0.01em' }}>LIVE TREE OF LIFE SEPHIROTH MATRIX</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sephiroth.map((node) => (
            <div
              key={node.sefirah}
              onClick={() => setSelectedNode(node)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: selectedNode.sefirah === node.sefirah ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                border: selectedNode.sefirah === node.sefirah ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#d4af37', width: '90px' }}>{node.sefirah}</span>
                <span style={{ fontSize: '14px', color: '#fff' }}>{node.name}</span>
              </div>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(52, 199, 89, 0.2)', color: '#34c759' }}>
                {node.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Inspector Detail Panel */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#d4af37' }}>{selectedNode.sefirah}</h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{selectedNode.name}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
          <div>
            <strong style={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '11px' }}>SYMBOLIC MEANING</strong>
            <span>{selectedNode.meaning}</span>
          </div>
          <div>
            <strong style={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '11px' }}>TECHNICAL FUNCTION</strong>
            <span>{selectedNode.technicalFunction}</span>
          </div>
          <div>
            <strong style={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '11px' }}>ACTIVE OPERATOR MODULE</strong>
            <span style={{ color: '#d4af37', fontWeight: 600 }}>{selectedNode.activeModule}</span>
          </div>
          <div>
            <strong style={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '11px' }}>INGRESS INPUT</strong>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#a1a1aa' }}>{selectedNode.input}</span>
          </div>
          <div>
            <strong style={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '11px' }}>EGRESS OUTPUT</strong>
            <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#a1a1aa' }}>{selectedNode.output}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
