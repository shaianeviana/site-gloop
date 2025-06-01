import React from 'react';

interface ClaimInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const criteria = [
  {
    img: 'https://ipfs.io/ipfs/bafkreiav75ywogvwguofsmtcv7rbuwqjoovg54rlvqyg3nowwp3sgbkglu',
    title: 'Monsprout Friends NFT',
    desc: 'You must have purchased a Monsprout Friends NFT by 05/31/2025 to be eligible for the WL.',
  },
  {
    img: '/images/draw.jpg',
    title: 'Drawing Sessions',
    desc: 'You must have participated in Monsprout drawing sessions to be eligible for the WL.',
  },
  {
    img: '/images/raffle.jpg',
    title: 'Community Raffles',
    desc: 'WL can also be obtained through raffles held by Twitter profiles of Monad community members and by Monsprout partner NFT Discords.',
  },
];

export const ClaimInfoModal: React.FC<ClaimInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div style={{
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
    }}>
      <div style={{
        background: 'rgba(26, 26, 26, 0.92)',
        borderRadius: 28,
        padding: '48px 72px 40px 72px',
        minWidth: 900,
        maxWidth: 1200,
        boxShadow: 'none',
        border: 'none',
        position: 'relative',
        color: '#ededed',
        fontFamily: 'Courier New, Courier, monospace',
      }}>
        <button onClick={onClose} style={{
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
        }}>&times;</button>
        <h2 style={{ color: '#0f0', fontWeight: 'normal', fontSize: '2rem', marginBottom: 10, textAlign: 'center', letterSpacing: 1 }}>Claim Eligibility</h2>
        <div style={{ color: '#fff', textAlign: 'center', fontSize: 16, marginBottom: 16, opacity: 0.85 }}>
          Check if you meet any of the criteria below to be eligible for the whitelist (WL):
        </div>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginBottom: 8 }}>
          {criteria.map((c, i) => {
            return (
              <React.Fragment key={i}>
                <div style={{
                  background: '#23202e',
                  borderRadius: 18,
                  border: '2.5px solid #0f0',
                  width: 220,
                  minHeight: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 18,
                  boxShadow: 'none',
                  transition: 'transform 0.2s',
                }}>
                  <img src={c.img} alt={c.title} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12, marginBottom: 16, border: '2px solid #0f0', background: '#fff' }} />
                  <div style={{ color: '#0f0', fontWeight: 'normal', fontSize: 18, marginBottom: 10, textAlign: 'center', letterSpacing: 0.5, width: '100%' }}>{c.title}</div>
                  <div style={{ fontSize: 14, color: '#ededed', textAlign: 'center', opacity: 0.95, width: '100%' }}>
                    {i === 0 ? "You must have purchased a Monsprout Friends NFT by 05/31/2025 to be eligible for the WL. (one WL per wallet)" :
                      i === 1 ? "You must have participated in Monsprout drawing sessions to be eligible for the WL. (one WL per wallet)" :
                      c.desc}
                  </div>
                </div>
                {i < criteria.length - 1 && (
                  <div style={{ alignSelf: 'center', color: '#0f0', fontSize: 16, fontWeight: 'normal', margin: '0 8px', minWidth: 24, textAlign: 'center' }}>or</div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{
          color: '#ca2456',
          textAlign: 'center',
          fontSize: 14,
          margin: '32px auto 0 auto',
          opacity: 0.95,
          fontWeight: 'bold',
          width: (220 * 3 + 64 * 2) + 'px',
          maxWidth: (220 * 3 + 64 * 2) + 'px',
        }}>
          <b>Attention:</b> These criteria are only for The Gloop collection on Monad testnet. <br />If we launch another collection on testnet in the future, the criteria may change.
        </div>
      </div>
    </div>
  );
}; 