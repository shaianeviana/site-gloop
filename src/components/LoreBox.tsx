import React, { useRef, useEffect, useState } from 'react';

interface LoreBoxProps {
  style?: React.CSSProperties;
  className?: string;
  visible?: boolean;
  onClose?: () => void;
}

const LoreBox: React.FC<LoreBoxProps> = ({ style, className, visible, onClose }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 600);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.style.opacity = visible ? '1' : '0';
    }
  }, [visible]);

  return (
    <div
      ref={boxRef}
      className={className}
      style={{
        position: 'fixed',
        left: isMobile ? '20px' : 40,
        top: isMobile ? '144px' : 210,
        transform: isMobile ? 'none' : 'none',
        zIndex: 2000,
        background: isMobile ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)',
        color: '#ededed',
        fontFamily: 'Courier New, Courier, monospace',
        fontSize: isMobile ? '0.814rem' : '0.92rem',
        borderRadius: '10px',
        padding: isMobile ? '8px 11px' : '10px 14px',
        maxWidth: isMobile ? '90%' : '300px',
        width: isMobile ? '90%' : 'auto',
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)',
        opacity: visible ? 1 : 0,
        pointerEvents: 'auto',
        transition: 'opacity 0.3s',
        lineHeight: 1.5,
        ...style,
      }}
    >
      {isMobile && onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: 'transparent',
            border: 'none',
            color: '#0f0',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
            zIndex: 2001,
          }}
          aria-label="Fechar"
        >
          ×
        </button>
      )}
      <b style={{ color: '#0f0', fontWeight: 'bold', fontSize: isMobile ? '0.968rem' : '1.1rem' }}>The Gloop</b><br />
      A collection of 777 mutant microorganisms, altered by radiation in the post-apocalyptic world of MonSprouts.<br /><br />
      There are 15 character types with various traits, hidden and waiting to be minted on the Monad testnet. They're chaotic, unpredictable, and may one day evolve into MonSprouts.<br /><br />
      By collecting a Gloop, you're contributing to this vision!<br />
      Share your Gloop and tag us on{' '}
      <a
        href="https://x.com/monsprout"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#0f0', textDecoration: 'none', fontWeight: 'bold' }}
      >
        <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>𝕏</span>
      </a>
    </div>
  );
};

export default LoreBox; 