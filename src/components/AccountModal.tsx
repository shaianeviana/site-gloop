import React from 'react';
import { WalletType } from '../blockchain/wallet';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletType: WalletType | null;
  walletAddress: string | null;
  onDisconnect: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, walletType, walletAddress, onDisconnect }) => {
  if (!isOpen) return null;

  const getWalletIcon = () => {
    if (walletType === 'metamask') return '/images/metamask.svg';
    if (walletType === 'phantom') return '/images/phantom.svg';
    if (walletType === 'backpack') return '/images/backpack.svg';
    return '';
  };

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
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{
          color: '#0f0',
          fontFamily: "'Courier New', Courier, monospace",
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '1.5rem'
        }}>
          Wallet Connected
        </h2>
        {walletType && (
          <img src={getWalletIcon()} alt={walletType} style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', padding: 4 }} />
        )}
        <div style={{
          background: 'transparent',
          color: '#0f0',
          border: 'none',
          borderRadius: '8px',
          padding: '0.5rem 1.2rem',
          fontFamily: "'Courier New', Courier, monospace",
          fontWeight: 'normal',
          fontSize: '1.1rem',
          letterSpacing: '1px',
          textAlign: 'center',
          wordBreak: 'break-all',
          marginTop: 8,
          marginBottom: 16,
        }}>
          {walletAddress}
        </div>
        <button
          onClick={onDisconnect}
          style={{
            background: 'transparent',
            color: '#0f0',
            border: '1.5px solid #0f0',
            padding: '1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: "'Courier New', Courier, monospace",
            fontWeight: 'normal',
            width: '100%',
            marginBottom: '1rem',
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,255,0,0.08)'; e.currentTarget.style.color = '#0f0'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0f0'; }}
        >
          Desconectar
        </button>
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            color: '#0f0',
            border: '1px solid #0f0',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            fontFamily: "'Courier New', Courier, monospace",
            fontWeight: 'normal',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 255, 0, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}; 