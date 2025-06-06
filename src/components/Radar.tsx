import { useEffect, useRef } from 'react';

interface RadarProps {
  scanning: boolean;
  gloopFound: boolean;
  style?: React.CSSProperties;
}

// Função para obter tamanho responsivo
const getRadarSize = () => {
  if (typeof window !== 'undefined' && window.innerWidth < 600) {
    // Set radar to 76% of original size (500px) on mobile
    return 380; // 76% de 500px, mais próximo do quadrado desenhado
  }
  return 500;
};

const Radar: React.FC<RadarProps> = ({ scanning, gloopFound, style }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const angleRef = useRef(0);
  const waveRadiusRef = useRef(0);
  const waveOpacityRef = useRef(1);
  
  useEffect(() => {
    const size = getRadarSize();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let gloopRadius = size * 0.3;
    let gloopAngle = Math.random() * Math.PI * 2;

    function drawRadar() {
      if (!ctx || !canvas) return;
      ctx.save();
      ctx.translate(canvas.width / (2 * dpr), canvas.height / (2 * dpr));
      ctx.clearRect(-canvas.width / (2 * dpr), -canvas.height / (2 * dpr), canvas.width / dpr, canvas.height / dpr);

      // Grid
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
      ctx.lineWidth = 0.5;
      const gridSpacing = size / 16.6;
      for (let x = -canvas.width / (2 * dpr); x <= canvas.width / (2 * dpr); x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, -canvas.height / (2 * dpr));
        ctx.lineTo(x, canvas.height / (2 * dpr));
        ctx.stroke();
      }
      for (let y = -canvas.height / (2 * dpr); y <= canvas.height / (2 * dpr); y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(-canvas.width / (2 * dpr), y);
        ctx.lineTo(canvas.width / (2 * dpr), y);
        ctx.stroke();
      }

      // Glow nas linhas principais
      ctx.save();
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#0f0';
      ctx.strokeStyle = '#0f0';
      ctx.lineWidth = 2;
      [size * 0.1, size * 0.2, size * 0.3, size * 0.4].forEach((r) => {
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
        ctx.moveTo((size * 0.38) * Math.cos(rad), (size * 0.38) * Math.sin(rad));
        ctx.lineTo((size * 0.4) * Math.cos(rad), (size * 0.4) * Math.sin(rad));
        ctx.stroke();
      }
      ctx.restore();

      // Números nos ângulos principais
      ctx.save();
      ctx.fillStyle = '#0f0';
      ctx.font = `${size * 0.028}px Courier New`;
      [0, 90, 180, 270].forEach((deg) => {
        const rad = deg * Math.PI / 180;
        const radius = (deg === 0 || deg === 180) ? size * 0.44 : size * 0.42;
        let x = radius * Math.cos(rad);
        let y = radius * Math.sin(rad);
        ctx.fillText(`${deg}°`, x - size * 0.024, y + size * 0.012);
      });
      ctx.restore();

      // Desenha a faixa de sombra (sweep)
      if (scanning) {
        const sweepAngle = Math.PI / 6;
        const sweepStart = angleRef.current - sweepAngle / 2;
        const sweepEnd = angleRef.current + sweepAngle / 2;

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.4);
        gradient.addColorStop(0, 'rgba(0,255,0,0.4)');
        gradient.addColorStop(1, 'rgba(0,255,0,0)');

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, size * 0.4, sweepStart, sweepEnd);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo((size * 0.4) * Math.cos(angleRef.current), (size * 0.4) * Math.sin(angleRef.current));
        ctx.stroke();
      }

      if (gloopFound) {
        const gloopX = gloopRadius * Math.cos(gloopAngle);
        const gloopY = gloopRadius * Math.sin(gloopAngle);

        ctx.beginPath();
        ctx.arc(gloopX, gloopY, size * 0.02, 0, Math.PI * 2);
        ctx.fillStyle = '#ca2456';
        ctx.fill();

        if (waveRadiusRef.current < size * 0.2) {
          waveRadiusRef.current += size * 0.005;
          waveOpacityRef.current = 1 - (waveRadiusRef.current / (size * 0.2));
          ctx.beginPath();
          ctx.arc(gloopX, gloopY, waveRadiusRef.current, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(202, 36, 86, ${waveOpacityRef.current})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          waveRadiusRef.current = 0;
          waveOpacityRef.current = 1;
        }

        for (let i = 1; i <= 3; i++) {
          ctx.beginPath();
          ctx.arc(gloopX, gloopY, size * 0.02 + i * size * 0.02, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(202, 36, 86, ${0.2 * (4 - i)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function animate() {
      if (scanning) {
        angleRef.current += 0.05;
        if (angleRef.current > Math.PI * 2) angleRef.current = 0;
      }
      drawRadar();
      animationRef.current = requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scanning, gloopFound]);

  const size = getRadarSize();
  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size} 
      style={{ 
        width: size, 
        height: size, 
        maxWidth: '100vw', 
        maxHeight: '100vw', 
        aspectRatio: '1 / 1',
        ...style 
      }} 
    />
  );
};

export default Radar; 