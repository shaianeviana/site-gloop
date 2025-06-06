import React from 'react';

interface NFTAttribute {
  trait_type: string;
  value: string;
}

interface NFTMetadata {
  name: string;
  attributes: NFTAttribute[];
  image: string;
}

interface ResearchReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  gloopMetadata: NFTMetadata | null;
  formatValue: (value: string) => string;
}

export const ResearchReportModal: React.FC<ResearchReportModalProps> = ({ isOpen, onClose, gloopMetadata, formatValue }) => {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.7)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'rgba(26, 26, 26, 0.92)',
          borderRadius: 28,
          padding: '48px 32px 40px 32px',
          minWidth: 340,
          maxWidth: 400,
          boxShadow: 'none',
          border: 'none',
          position: 'relative',
          color: '#0f0',
          fontFamily: 'Courier New, Courier, monospace',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 24,
            background: 'transparent',
            border: 'none',
            color: '#0f0',
            fontSize: 32,
            fontWeight: 'bold',
            cursor: 'pointer',
            lineHeight: 1,
            zIndex: 10,
          }}
          aria-label="Close Research Report"
        >
          &times;
        </button>
        <div style={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#0f0', letterSpacing: '2px' }}>RESEARCH REPORT</span>
          <div style={{ width: '100%', height: '2px', background: '#0f0', margin: '4px 0 10px 0' }} />
        </div>
        {gloopMetadata && (
          <>
            <img
              src={gloopMetadata.image}
              alt="Gloop"
              style={{ width: '120px', height: '120px', marginBottom: '10px', border: '2px solid #0f0', background: '#222', borderRadius: 12 }}
            />
            <div style={{ width: '100%' }}>
              <div><b>NAME:</b> {formatValue(gloopMetadata.name)}</div>
              <div style={{ width: '100%', height: '2px', background: '#0f0', margin: '2px 0 10px 0' }} />
              {gloopMetadata.attributes.map(attr => (
                <div key={attr.trait_type}>
                  <b>{attr.trait_type.toUpperCase()}:</b> {formatValue(attr.value)}
                  <div style={{ width: '100%', height: '2px', background: '#0f0', margin: '2px 0 10px 0' }} />
                </div>
              ))}
              <div style={{ marginTop: '20px', textAlign: 'center', color: '#0f0' }}>
                <div style={{ marginBottom: '10px' }}>mint successfully!</div>
                <div style={{ marginBottom: '10px' }}>hey explorer, you found one</div>
                <div style={{ marginBottom: '10px' }}>of the 777 gloops, thanks!</div>
                <div>signed by @monsprout</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 