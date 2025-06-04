import { useEffect, useRef } from 'react';

interface RadarProps {
  scanning: boolean;
  gloopFound: boolean;
  style?: React.CSSProperties;
}

const Radar: React.FC<RadarProps> = ({ scanning, gloopFound, style }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Radar state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 500;
    canvas.height = 500;

    let angle = 0;
    let gloopRadius = 150;
    let gloopAngle = Math.random() * Math.PI * 2;
    let waveRadius = 0;
    let waveOpacity = 1;
    let animationFrame: number;

    function drawRadar() {
      if (!ctx || !canvas) return;
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
      animationFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [scanning, gloopFound]);

  return <canvas ref={canvasRef} style={style} />;
};

export default Radar; 