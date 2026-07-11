import React, { useRef, useEffect } from 'react';
import { getLiveAnalyser, isLiveRunning } from '../lib/liveAudio';

export default function WaveformVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      // Clear the canvas
      ctx.fillStyle = '#020617'; // slate-950
      ctx.fillRect(0, 0, width, height);

      const analyser = getLiveAnalyser();
      const running = isLiveRunning();

      if (!running || !analyser) {
        // Draw standard resting horizontal line
        ctx.strokeStyle = '#334155'; // slate-700
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Draw ambient glow pulse
        ctx.fillStyle = '#475569'; // slate-600
        ctx.font = '10px monospace';
        ctx.fillText('STANDBY • READY', 15, height - 12);
        return;
      }

      // Analyser exists and is running
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);
      analyser.getFloatTimeDomainData(dataArray);

      // Draw subtle background grids
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 1; i < 4; i++) {
        const y = (height / 4) * i;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Plot waveform
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)'; // amber-500
      ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Normalize float value from [-1, 1] to canvas height [0, height]
        const v = dataArray[i];
        const y = (v + 1) * (height / 2);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Reset shadows
      ctx.shadowBlur = 0;

      // Vibe metadata display
      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px monospace';
      ctx.fillText('LIVE SIGNAL ANALYSER • RUNNING', 15, height - 12);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative w-full h-24 rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-950">
      <canvas
        ref={canvasRef}
        width={600}
        height={96}
        className="w-full h-full block"
      />
    </div>
  );
}
