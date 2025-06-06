'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { ClaimInfoModal } from '../components/ClaimInfoModal';
import { client, contract } from '../../public/lib/thirdweb';
import { ConnectButton,  useSendTransaction, useActiveAccount} from "thirdweb/react";
import { claimTo } from "thirdweb/extensions/erc721";
import { getClaimedTokenId, getMetadataFromTokenId } from '@/lib/getTokenId';
import { darkTheme } from "thirdweb/react";
import { createWallet } from 'thirdweb/wallets';
import Radar from '../components/Radar';
import WaveSignal from '../components/WaveSignal';
import LoreBox from '../components/LoreBox';
import InfoIconButton from '../components/InfoIconButton';


interface NFTAttribute {
  trait_type: string;
  value: string;
}

interface NFTMetadata {
  name: string;
  attributes: NFTAttribute[];
  image: string;
}

function formatValue(value: string) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export default function Home() {
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending, data, error } =  useSendTransaction();
  const [isMinting, setIsMinting] = useState(false);
  const [gloopImageSrc, setGloopImageSrc] = useState<string | null>(null);
  const [isClaimInfoOpen, setIsClaimInfoOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [gloopFound, setGloopFound] = useState(false);
  const [gloopMetadata, setGloopMetadata] = useState<NFTMetadata | null>(null);
  const [showResearchReport, setShowResearchReport] = useState(false);
  const [loreVisible, setLoreVisible] = useState(false);
  const [mobileRadarSmall, setMobileRadarSmall] = useState(false);
  
  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    createWallet("io.rabby"),
    createWallet("io.zerion.wallet"),
  ];
  
  function claim() {
    console.log('MINT BUTTON CLICKED', { isMinting, disabled: isMinting });
    console.log("Account in claim:", account);
    if (!account) {
      // Trigger wallet connection
      const connectButton = document.querySelector('appkit-button[data-connect]') as HTMLElement;
      if (connectButton) {
        connectButton.click();
      }
      return;
    }
    
    // Reset states first
    setGloopFound(false);
    setScanning(false);
    setIsMinting(true);
    
    // Force a small delay to ensure state updates
    setTimeout(() => {
      setScanning(true);
      
      // Check if mobile and set radar size
      if (typeof window !== 'undefined' && window.innerWidth < 600) {
        setMobileRadarSmall(true);
      }

      // Start animation and show pink ball after 2 seconds
      setTimeout(() => {
        setScanning(false);
        setGloopFound(true);
        setIsMinting(false);
        // Pause background video when pink ball is found
        const backgroundVideo = document.getElementById('backgroundVideo') as HTMLVideoElement | null;
        if (backgroundVideo) {
          backgroundVideo.pause();
        }
      }, 2000);
    }, 100);

    // Play background video
    const backgroundVideo = document.getElementById('backgroundVideo') as HTMLVideoElement | null;
    if (backgroundVideo) {
      backgroundVideo.play();
    }

    const transaction = claimTo({
      contract,
      to: account.address,
      quantity: 1n,
      from: account.address,
    });

    console.log("Transaction:", transaction);

    sendTransaction(transaction);
  }

  // Add useEffect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setMobileRadarSmall(true);
      } else {
        setMobileRadarSmall(false);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isPending && data) {
      const tx = data.transactionHash;
      const fetchTokenData = async () => {
        try {
          const tokenId = await getClaimedTokenId(tx);
          const metadata = await getMetadataFromTokenId(Number(tokenId));
          setGloopMetadata(metadata);
          setGloopImageSrc(metadata?.image ?? null);
          setShowResearchReport(true);
        } catch (err) {
          console.error("Erro ao obter token ID:", err);
        }
      };
      fetchTokenData();
    }
  }, [isPending, data]);

  useEffect(() => {
    if (error) {
      setIsMinting(false);
      setScanning(false);
      setGloopFound(false);
    }
  }, [error]);

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
        poster="/fallback.png"
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
          onMouseEnter={() => setLoreVisible(true)}
          onMouseLeave={() => setTimeout(() => setLoreVisible(false), 50)}
        />
        <InfoIconButton onClick={() => setIsClaimInfoOpen(true)} aria-label="Show claim info" />
      </div>
      {/* Lore box */}
      <LoreBox 
        visible={loreVisible} 
        style={typeof window !== 'undefined' && window.innerWidth < 600 ? { top: 59 } : {}} 
      />

      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        position: 'fixed', top: 24, right: 32, zIndex: 1001
      }}>
        <ConnectButton
          client={client}
          theme={darkTheme({
            colors: {
              primaryButtonBg: "hsl(342, 70%, 47%)",
              primaryButtonText: "hsl(227, 100%, 100%)",
              secondaryButtonBg: "hsl(233, 12%, 15%)",
              secondaryButtonText: "hsl(120, 100%, 50%)",
              secondaryText: "hsl(0, 27%, 98%)",
              primaryText: "hsl(120, 100%, 50%)",
              secondaryButtonHoverBg: "hsl(226, 17%, 89%)",
              connectedButtonBg: "hsl(342, 69%, 47%)",
              connectedButtonBgHover: "hsl(342, 70%, 47%)",
            },
          })}
          connectModal={{ size: "compact" }}
          wallets={wallets}
        />
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
          {error.message}
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '90vh', 
        marginTop: '40px',
        position: 'relative',
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}>
        <Radar 
          scanning={scanning} 
          gloopFound={gloopFound} 
          style={{}} 
        />
        <button 
          id="mintButton" 
          disabled={isMinting}
          onClick={claim}
          style={{ 
            backgroundColor: '#ca2456', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            cursor: isMinting ? 'not-allowed' : 'pointer',
            marginTop: '20px',
            opacity: isMinting ? 0.7 : 1,
            transition: 'all 0.3s ease',
            fontSize: '1.2rem',
            borderRadius: '8px',
            minWidth: '200px',
            zIndex: 1001,
            position: 'relative',
          }}
        >
          {!account ? 'Connect Wallet' : isMinting ? 'Minting...' : 'Mint Gloop'}
        </button>
      </div>

      <div
        id="gloopData"
        style={{
          position: 'absolute', top: 'calc(50% - 324px)', left: 'calc(50% + 300px)', background: 'rgba(0, 0, 0, 0.5)', color: '#0f0', padding: '15px', borderRadius: '10px', fontFamily: "'Courier New', Courier, monospace", fontSize: '1rem',
          display: showResearchReport ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          height: 'auto',
          minWidth: '320px',
          minHeight: '420px'
        }}
      >
        <div style={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>
          <span style={{ fontFamily: "'Courier New', Courier, monospace", fontWeight: 'bold', fontSize: '1.5rem', color: '#0f0', letterSpacing: '2px' }}>RESEARCH REPORT</span>
          <div style={{ width: '100%', height: '2px', background: '#0f0', margin: '4px 0 10px 0' }} />
        </div>
        {gloopMetadata && (
          <>
            <img
              id="gloopImage"
              src={gloopMetadata.image}
              alt="Gloop"
              style={{ width: '120px', height: '120px', marginBottom: '10px', border: '2px solid #0f0', background: '#222' }}
            />
            <div id="gloopText" style={{ width: '100%' }}>
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

      <footer style={{ position: 'fixed', bottom: '10px', width: '100%', textAlign: 'center', fontFamily: "'Courier New', Courier, monospace", color: '#ca2456', fontWeight: 'bold' }}>
        Created by <a href="https://x.com/monsprout" target="_blank" style={{ color: '#ca2456', textDecoration: 'none' }}>Monsprout</a>
      </footer>

      <div
        className="antenna-mobile"
        style={{
          position: 'fixed', top: '80%', left: 100, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateY(-50%)'
        }}
      >
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

      <div
        className="wave-mobile"
        style={{
          position: 'fixed', bottom: 45, left: 72, zIndex: 10
        }}
      >
        <WaveSignal />
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
          <text x="44" y="38" fill="#0f0" fontSize="12" fontFamily="'Courier New', Courier, monospace" textAnchor="middle">2m</text>
          <text x="68" y="38" fill="#0f0" fontSize="12" fontFamily="'Courier New', Courier, monospace" textAnchor="middle">4m</text>
          <text x="92" y="38" fill="#0f0" fontSize="12" fontFamily="'Courier New', Courier, monospace" textAnchor="middle">6m</text>
          <text x="116" y="38" fill="#0f0" fontSize="12" fontFamily="'Courier New', Courier, monospace" textAnchor="middle">8m</text>
          <text x="140" y="38" fill="#0f0" fontSize="12" fontFamily="'Courier New', Courier, monospace" textAnchor="middle">10m</text>
        </svg>
      </div>

      <ClaimInfoModal isOpen={isClaimInfoOpen} onClose={() => setIsClaimInfoOpen(false)} />
    </>
  );
}


