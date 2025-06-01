'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { ContractService } from '../blockchain/contract';
import { ClaimInfoModal } from '../components/ClaimInfoModal';
import { useAccount } from 'wagmi';
import ConnectButton from '../components/ConnectButton';

interface NFTAttribute {
  trait_type: string;
  value: string;
}

interface NFTMetadata {
  name: string;
  attributes: NFTAttribute[];
}

export default function Home() {
  const { isConnected } = useAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gloopImageSrc, setGloopImageSrc] = useState<string | null>(null);
  const [isClaimInfoOpen, setIsClaimInfoOpen] = useState(false);

  useEffect(() => {
    const contractService = ContractService.getInstance();
  }, []);

  useEffect(() => {
    const canvas = document.getElementById('radar') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 500;
    canvas.height = 500;

    const gloopData = document.getElementById('gloopData')!;
    const gloopText = document.getElementById('gloopText')!;
    const gloopImage = document.getElementById('gloopImage') as HTMLImageElement;
    const backgroundVideo = document.getElementById('backgroundVideo') as HTMLVideoElement;

    let angle = 0;
    let scanning = false;
    let gloopFound = false;
    let gloopRadius = 150;
    let gloopAngle = Math.random() * Math.PI * 2;
    let waveRadius = 0;
    let waveOpacity = 1;
    let showDetails = false;

    const loader = document.createElement('div');
    loader.innerText = 'Minting...';
    loader.style.position = 'absolute';
    loader.style.top = '72%';
    loader.style.left = '50%';
    loader.style.transform = 'translate(-50%, -50%)';
    loader.style.color = '#ca2456';
    loader.style.fontWeight = 'bold';
    loader.style.display = 'none';
    document.body.appendChild(loader);

    function drawRadar() {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
      ctx.lineWidth = 0.5;
      const gridSpacing = 30;
      for (let x = -canvas.width / 2; x <= canvas.width / 2; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, -canvas.height / 2);
        ctx.lineTo(x, canvas.height / 2);
        ctx.stroke();
      }
      for (let y = -canvas.height / 2; y <= canvas.height / 2; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(-canvas.width / 2, y);
        ctx.lineTo(canvas.width / 2, y);
        ctx.stroke();
      }

      // Glow nas linhas principais
      ctx.save();
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#0f0';
      ctx.strokeStyle = '#0f0';
      ctx.lineWidth = 2;
      [50, 100, 150, 200].forEach((r) => {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();

      // Ticks nos círculos
      ctx.save();
      ctx.strokeStyle = '#0f0';
      ctx.lineWidth = 1;
      for (let angle = 0; angle < 360; angle += 10) {
        const rad = angle * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(190 * Math.cos(rad), 190 * Math.sin(rad));
        ctx.lineTo(200 * Math.cos(rad), 200 * Math.sin(rad));
        ctx.stroke();
      }
      ctx.restore();

      // Números nos ângulos principais
      ctx.save();
      ctx.fillStyle = '#0f0';
      ctx.font = '14px Courier New';
      [0, 90, 180, 270].forEach((deg) => {
        const rad = deg * Math.PI / 180;
        const radius = (deg === 0 || deg === 180) ? 220 : 210;
        let x = radius * Math.cos(rad);
        let y = radius * Math.sin(rad);
        ctx.fillText(`${deg}°`, x - 12, y + 6);
      });
      ctx.restore();

      // Desenha a faixa de sombra (sweep)
      const sweepAngle = Math.PI / 6;
      const sweepStart = angle - sweepAngle / 2;
      const sweepEnd = angle + sweepAngle / 2;

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 200);
      gradient.addColorStop(0, 'rgba(0,255,0,0.4)');
      gradient.addColorStop(1, 'rgba(0,255,0,0)');

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 200, sweepStart, sweepEnd);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(200 * Math.cos(angle), 200 * Math.sin(angle));
      ctx.stroke();

      if (gloopFound) {
        const gloopX = gloopRadius * Math.cos(gloopAngle);
        const gloopY = gloopRadius * Math.sin(gloopAngle);

        ctx.beginPath();
        ctx.arc(gloopX, gloopY, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#ca2456';
        ctx.fill();

        if (waveRadius < 100) {
          waveRadius += 2;
          waveOpacity = 1 - (waveRadius / 100);
          
          ctx.beginPath();
          ctx.arc(gloopX, gloopY, waveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(202, 36, 86, ${waveOpacity})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          waveRadius = 0;
          waveOpacity = 1;
        }

        for (let i = 1; i <= 3; i++) {
          ctx.beginPath();
          ctx.arc(gloopX, gloopY, 10 + i * 10, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(202, 36, 86, ${0.2 * (4 - i)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function animate() {
      if (scanning) {
        angle += 0.05;
        if (angle > Math.PI * 2) angle = 0;
      }
      drawRadar();
      requestAnimationFrame(animate);
    }
    animate();

    const mintButton = document.getElementById('mintButton')!;
    mintButton.addEventListener('click', async () => {
      if (!isConnected) {
        setError('Please connect your wallet first');
        return;
      }

      setIsMinting(true);
      loader.style.display = 'block';
      scanning = true;
      gloopFound = false;

      if (backgroundVideo) {
        backgroundVideo.play();
      }

      try {
        const contractService = ContractService.getInstance();
        const tx = await contractService.mintNFT();
        await tx.wait();

        setTimeout(async () => {
          loader.style.display = 'none';
          scanning = false;
          gloopFound = true;
          setIsMinting(false);

          if (backgroundVideo) {
            backgroundVideo.pause();
          }

          const randomIndex = Math.floor(Math.random() * 777) + 1;
          
          try {
            const [imageResponse, jsonResponse] = await Promise.all([
              fetch(`https://bafybeib7csyrxilyuwmo2jhczl7hccztwhha7ti4f3u7kcsptuyohtkglq.ipfs.w3s.link/gloop${randomIndex}.png`),
              fetch(`https://bafybeihl6hcb6xu4df5vsrkyw35c33dnmpgdh3u2b2zxpjojgvd6v5wh4q.ipfs.w3s.link/Gloop${randomIndex}.json`)
            ]);

            if (!imageResponse.ok || !jsonResponse.ok) {
              throw new Error('Failed to fetch NFT data');
            }

            const jsonData = await jsonResponse.json() as NFTMetadata;
            setGloopImageSrc(URL.createObjectURL(await imageResponse.blob()));

            function formatLabel(label: string) {
              return label.toUpperCase();
            }
            function formatValue(value: string) {
              if (!value) return 'Unknown';
              return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            }
            gloopText.innerHTML = `
              <div style='margin-bottom: 10px;'><strong style="font-size:1.1rem;">${formatLabel('NAME')}:</strong> ${formatValue(jsonData.name)}<div style='width:100%;height:2px;background:#0f0;margin:4px 0 0 0'></div></div>
              <div style='margin-bottom: 10px;'><strong style="font-size:1.1rem;">${formatLabel('BACKGROUND')}:</strong> ${formatValue(jsonData.attributes?.find((attr: NFTAttribute) => attr.trait_type === 'Background')?.value || '')}<div style='width:100%;height:2px;background:#0f0;margin:4px 0 0 0'></div></div>
              <div style='margin-bottom: 10px;'><strong style="font-size:1.1rem;">${formatLabel('TEXTURE')}:</strong> ${formatValue(jsonData.attributes?.find((attr: NFTAttribute) => attr.trait_type === 'Texture')?.value || '')}<div style='width:100%;height:2px;background:#0f0;margin:4px 0 0 0'></div></div>
              <div style='margin-bottom: 10px;'><strong style="font-size:1.1rem;">${formatLabel('BODY')}:</strong> ${formatValue(jsonData.attributes?.find((attr: NFTAttribute) => attr.trait_type === 'Body')?.value || '')}<div style='width:100%;height:2px;background:#0f0;margin:4px 0 0 0'></div></div>
              <div style='margin-bottom: 10px;'><strong style="font-size:1.1rem;">${formatLabel('MOUTH')}:</strong> ${formatValue(jsonData.attributes?.find((attr: NFTAttribute) => attr.trait_type === 'Mouth')?.value || '')}<div style='width:100%;height:2px;background:#0f0;margin:4px 0 0 0'></div></div>
              <div style='margin-bottom: 10px;'><strong style="font-size:1.1rem;">${formatLabel('EYES')}:</strong> ${formatValue(jsonData.attributes?.find((attr: NFTAttribute) => attr.trait_type === 'Eyes')?.value || '')}<div style='width:100%;height:2px;background:#0f0;margin:4px 0 0 0'></div></div>
            `;

            gloopData.style.display = 'flex';
          } catch (error) {
            console.error('Error fetching NFT data:', error);
            gloopText.innerText = 'Error loading NFT data. Please try again.';
            gloopData.style.display = 'flex';
          }
        }, 3000);
      } catch (error: any) {
        setError(error.message || 'Failed to mint NFT');
        loader.style.display = 'none';
        scanning = false;
        setIsMinting(false);
      }
    });

    // WAVE SIGNAL
    const waveSignal = document.getElementById('waveSignal') as HTMLCanvasElement;
    if (waveSignal) {
      const ctxWave = waveSignal.getContext('2d')!;
      let t = 0;
      function drawWave() {
        ctxWave.clearRect(0, 0, 120, 40);
        ctxWave.strokeStyle = '#0f0';
        ctxWave.lineWidth = 2;
        ctxWave.beginPath();
        for (let x = 0; x < 120; x++) {
          const y = 20 + 15 * Math.sin((x / 120) * 4 * Math.PI + t);
          if (x === 0) ctxWave.moveTo(x, y);
          else ctxWave.lineTo(x, y);
        }
        ctxWave.stroke();
        t += 0.1;
        requestAnimationFrame(drawWave);
      }
      drawWave();
    }
  }, [isConnected]);

  return (
    <>
      <Head>
        <title>The Gloop - NFT Radar Mint</title>
      </Head>

      <video
        id="backgroundVideo"
        muted
        loop
        playsInline
        style={{
          position: 'fixed',
          right: 0,
          bottom: 0,
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          zIndex: -1,
          objectFit: 'cover'
        }}
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img 
          src="/images/logo.png" 
          className="icon radiation" 
          alt="logo" 
          style={{ height: '200px', width: 'auto', position: 'absolute', top: '-20px', left: '40px', cursor: 'pointer', zIndex: 1002, opacity: 1 }}
          onMouseEnter={() => {
            const lore = document.getElementById('gloop-lore-box');
            if (lore) lore.style.opacity = '1';
          }}
          onMouseLeave={() => {
            const lore = document.getElementById('gloop-lore-box');
            setTimeout(() => {
              if (lore && !lore.matches(':hover')) lore.style.opacity = '0';
            }, 50);
          }}
        />
        {/* Info Icon */}
        <button
          onClick={() => setIsClaimInfoOpen(true)}
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
          }}
          aria-label="Show claim info"
        >
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="19" cy="19" r="19" fill="#ca2456" />
            <text x="19" y="26" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#fff" fontFamily="monospace">i</text>
          </svg>
        </button>
      </div>
      {/* Lore box */}
      <div
        id="gloop-lore-box"
        style={{
          position: 'fixed',
          left: 40,
          top: 210,
          zIndex: 2000,
          background: 'rgba(10,10,10,0.85)',
          color: '#ededed',
          fontFamily: 'Courier New, Courier, monospace',
          fontSize: '0.92rem',
          borderRadius: '10px',
          padding: '10px 14px',
          maxWidth: '300px',
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)',
          opacity: 0,
          pointerEvents: 'auto',
          transition: 'opacity 0.3s',
          lineHeight: 1.5,
        }}
        onMouseEnter={() => {
          const lore = document.getElementById('gloop-lore-box');
          if (lore) lore.style.opacity = '1';
        }}
        onMouseLeave={() => {
          const lore = document.getElementById('gloop-lore-box');
          const logo = document.querySelector('.icon.radiation');
          setTimeout(() => {
            if (logo && lore && !logo.matches(':hover')) lore.style.opacity = '0';
          }, 50);
        }}
      >
        <b style={{ color: '#0f0', fontWeight: 'bold', fontSize: '1.1rem' }}>The Gloop</b><br/>
        A collection of 777 mutant microorganisms, altered by radiation in the post-apocalyptic world of MonSprouts.<br/><br/>
        There are 15 character types with various traits, hidden and waiting to be minted on the Monad testnet. They're chaotic, unpredictable, and may one day evolve into MonSprouts.<br/><br/>
        By collecting a Gloop, you're contributing to this vision!<br/>
        Share your Gloop and tag us on <a href="https://x.com/monsprout" target="_blank" rel="noopener noreferrer" style={{ color: '#0f0', textDecoration: 'none', fontWeight: 'bold' }}><span style={{fontSize:'1.1em',fontWeight:'bold'}}>𝕏</span></a>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        position: 'fixed', top: 24, right: 32, zIndex: 1001
      }}>
        <ConnectButton />
      </div>

      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(202, 36, 86, 0.9)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90vh', marginTop: '40px' }}>
        <canvas id="radar"></canvas>
        <button 
          id="mintButton" 
          disabled={!isConnected || isMinting}
          style={{ 
            backgroundColor: '#ca2456', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            cursor: (!isConnected || isMinting) ? 'not-allowed' : 'pointer',
            marginTop: '20px',
            opacity: (!isConnected || isMinting) ? 0.7 : 1
          }}
        >
          {isMinting ? 'Minting...' : 'Mint Gloop'}
        </button>
      </div>

      <div id="gloopData" style={{ position: 'absolute', top: 'calc(50% - 300px)', left: 'calc(50% + 300px)', background: 'rgba(0, 0, 0, 0.5)', color: '#0f0', padding: '15px', borderRadius: '10px', fontFamily: "'Courier New', Courier, monospace", fontSize: '1rem', display: 'none', flexDirection: 'column', alignItems: 'center', height: 'auto', minWidth: '320px', minHeight: '420px' }}>
        <div style={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>
          <span style={{ fontFamily: "'Courier New', Courier, monospace", fontWeight: 'bold', fontSize: '1.5rem', color: '#0f0', letterSpacing: '2px' }}>RESEARCH REPORT</span>
          <div style={{ width: '100%', height: '2px', background: '#0f0', margin: '4px 0 10px 0' }} />
        </div>
        <img id="gloopImage" src={gloopImageSrc ?? undefined} alt="Gloop" style={{ width: '120px', height: '120px', marginBottom: '10px', border: '2px solid #0f0', background: '#222' }} />
        <div id="gloopText" style={{ width: '100%' }}></div>
      </div>

      <footer style={{ position: 'fixed', bottom: '10px', width: '100%', textAlign: 'center', fontFamily: "'Courier New', Courier, monospace", color: '#ca2456', fontWeight: 'bold' }}>
        Created by <a href="https://x.com/monsprout" target="_blank" style={{ color: '#ca2456', textDecoration: 'none' }}>Monsprout</a>
      </footer>

      <div style={{
        position: 'fixed', top: '80%', left: 100, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateY(-50%)'
      }}>
        <svg width="32" height="40" viewBox="0 0 32 40" style={{ marginBottom: 8 }}>
          <g>
            <circle cx="16" cy="32" r="4" fill="#0f0" stroke="#0f0" strokeWidth="1" />
            <rect x="14" y="10" width="4" height="22" fill="#0f0" />
            <path d="M16 8 Q16 2 24 8" stroke="#0f0" strokeWidth="1" fill="none" />
            <path d="M16 8 Q16 2 8 8" stroke="#0f0" strokeWidth="1" fill="none" />
            <path d="M16 4 Q16 -4 28 8" stroke="#0f0" strokeWidth="0.7" fill="none" />
            <path d="M16 4 Q16 -4 4 8" stroke="#0f0" strokeWidth="0.7" fill="none" />
          </g>
        </svg>
        <div style={{
          width: 10, height: 60, background: 'linear-gradient(to top, #ca2456 30%, #0f0 100%)',
          border: '1px solid #0f0', borderRadius: 5
        }} />
      </div>

      <div style={{
        position: 'fixed', bottom: 60, left: 60, zIndex: 10
      }}>
        <canvas id="waveSignal" width={120} height={40} />
      </div>

      <div style={{
        position: 'fixed', bottom: 40, right: 20, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <svg width="160" height="54">
          <rect x="20" y="10" width="120" height="12" fill="#0f0" stroke="#0f0" strokeWidth="2" />
          <rect x="20" y="10" width="24" height="12" fill="#ca2456" stroke="#0f0" strokeWidth="2" />
          <rect x="44" y="10" width="24" height="12" fill="#0f0" stroke="#0f0" strokeWidth="2" />
          <rect x="68" y="10" width="24" height="12" fill="#ca2456" stroke="#0f0" strokeWidth="2" />
          <rect x="92" y="10" width="24" height="12" fill="#0f0" stroke="#0f0" strokeWidth="2" />
          <rect x="116" y="10" width="24" height="12" fill="#ca2456" stroke="#0f0" strokeWidth="2" />
          <text x="20" y="38" fill="#0f0" fontSize="12" fontFamily="'Courier New', Courier, monospace" textAnchor="middle">0</text>
          <text x="44" y="38" fill="#0f0" fontSize="12" fontFamily="'Courier New', Courier, monospace" textAnchor="middle">20</text>
          <text x="68" y="38" fill="#0f0" fontSize="12" fontFamily="'Courier New', Courier, monospace" textAnchor="middle">40</text>
          <text x="92" y="38" fill="#0f0" fontSize="12" fontFamily="'Courier New', Courier, monospace" textAnchor="middle">60</text>
          <text x="116" y="38" fill="#0f0" fontSize="12" fontFamily="'Courier New', Courier, monospace" textAnchor="middle">80</text>
          <text x="140" y="38" fill="#0f0" fontSize="12" fontFamily="'Courier New', Courier, monospace" textAnchor="middle">100</text>
        </svg>
      </div>

      <ClaimInfoModal isOpen={isClaimInfoOpen} onClose={() => setIsClaimInfoOpen(false)} />
    </>
  );
}
