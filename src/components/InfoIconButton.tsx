import React from 'react';

interface InfoIconButtonProps {
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
  'aria-label'?: string;
}

const InfoIconButton: React.FC<InfoIconButtonProps> = ({ onClick, style, className, 'aria-label': ariaLabel }) => (
  <button
    onClick={onClick}
    style={{
      background: 'none',
      border: 'none',
      padding: 0,
      marginLeft: 8,
      cursor: 'pointer',
      position: 'absolute',
      top: 30,
      left: 260,
      zIndex: 1003,
      display: 'flex',
      alignItems: 'center',
      ...style,
    }}
    className={className}
    aria-label={ariaLabel || 'Show claim info'}
  >
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="19" cy="19" r="19" fill="#ca2456" />
      <text x="19" y="26" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#fff" fontFamily="monospace">i</text>
    </svg>
  </button>
);

export default InfoIconButton; 