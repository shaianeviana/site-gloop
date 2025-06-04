import { useEffect, useRef } from 'react';

interface WaveSignalProps {
  style?: React.CSSProperties;
}

const WaveSignal: React.FC<WaveSignalProps> = ({ style }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let t = 0;
    let animationFrame: number;
    function drawWave() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, 120, 40);
      ctx.strokeStyle = '#0f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < 120; x++) {
        const y = 20 + 15 * Math.sin((x / 120) * 4 * Math.PI + t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      t += 0.1;
      animationFrame = requestAnimationFrame(drawWave);
    }
    drawWave();
    return () => cancelAnimationFrame(animationFrame);
  }, []);
  return <canvas ref={canvasRef} width={120} height={40} style={style} />;
};

export default WaveSignal; 