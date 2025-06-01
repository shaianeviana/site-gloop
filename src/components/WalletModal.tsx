import React from 'react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletType: 'metamask' | 'phantom' | 'backpack') => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onSelectWallet }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(26, 26, 26, 0.92)',
        padding: '2rem',
        borderRadius: '10px',
        width: '400px',
        border: 'none',
        boxShadow: 'none'
      }}>
        <h2 style={{
          color: '#0f0',
          fontFamily: "'Courier New', Courier, monospace",
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '1.5rem'
        }}>
          Select Wallet
        </h2>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <button
            onClick={() => onSelectWallet('metamask')}
            style={{
              background: 'transparent',
              color: '#0f0',
              border: '1.5px solid #0f0',
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: 'bold',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,255,0,0.08)'; e.currentTarget.style.color = '#0f0'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0f0'; }}
          >
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              marginRight: 12,
              padding: 4,
              overflow: 'hidden',
            }}>
              <img src="/images/metamask.svg" alt="MetaMask" style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '50%' }} />
            </span>
            MetaMask
          </button>

          <button
            onClick={() => onSelectWallet('phantom')}
            style={{
              background: 'transparent',
              color: '#0f0',
              border: '1.5px solid #0f0',
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: 'bold',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,255,0,0.08)'; e.currentTarget.style.color = '#0f0'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0f0'; }}
          >
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              marginRight: 12,
              padding: 4,
              overflow: 'hidden',
            }}>
              <img src="/images/phantom.svg" alt="Phantom" style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '50%' }} />
            </span>
            Phantom
          </button>

          <button
            onClick={() => onSelectWallet('backpack')}
            style={{
              background: 'transparent',
              color: '#0f0',
              border: '1.5px solid #0f0',
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontFamily: "'Courier New', Courier, monospace",
              fontWeight: 'bold',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,255,0,0.08)'; e.currentTarget.style.color = '#0f0'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0f0'; }}
          >
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
              marginRight: 12,
              padding: 4,
              overflow: 'hidden',
            }}>
              <img src="/images/backpack.svg" alt="Backpack" style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '50%' }} />
            </span>
            Backpack
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            color: '#0f0',
            border: '1px solid #0f0',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '1rem',
            width: '100%',
            fontFamily: "'Courier New', Courier, monospace",
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 255, 0, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}; 