import React, { useRef, useEffect, useState } from 'react';

interface LoreBoxProps {
  style?: React.CSSProperties;
  className?: string;
  visible?: boolean;
}

const LoreBox: React.FC<LoreBoxProps> = ({ style, className, visible }) => {
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
        left: 40,
        top: isMobile ? 126 : 210, // 40% reduction on mobile
        zIndex: 2000,
        background: 'rgba(0, 0, 0, 0.5)',
        color: '#ededed',
        fontFamily: 'Courier New, Courier, monospace',
        fontSize: '0.92rem',
        borderRadius: '10px',
        padding: '10px 14px',
        maxWidth: '300px',
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)',
        opacity: visible ? 1 : 0,
        pointerEvents: 'auto',
        transition: 'opacity 0.3s',
        lineHeight: 1.5,
        ...style,
      }}
    >
      <b style={{ color: '#0f0', fontWeight: 'bold', fontSize: '1.1rem' }}>The Gloop</b><br />
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