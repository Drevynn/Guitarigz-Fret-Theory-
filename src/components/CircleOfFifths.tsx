/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NoteName, ScaleType } from '../types';
import { motion } from 'motion/react';

interface CircleOfFifthsProps {
  activeRoot: NoteName;
  activeScale: ScaleType;
  onSelectKey: (root: NoteName, scaleType: ScaleType) => void;
}

export default function CircleOfFifths({ activeRoot, activeScale, onSelectKey }: CircleOfFifthsProps) {
  // Ordered clockwise starting at 12 o'clock
  const majorKeys: NoteName[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
  const minorKeys: string[] = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'];

  const width = 320;
  const height = 320;
  const centerX = width / 2;
  const centerY = height / 2;

  const renderSlices = (isOuter: boolean) => {
    const keys = isOuter ? majorKeys : minorKeys;
    const innerRadius = isOuter ? 100 : 55;
    const outerRadius = isOuter ? 145 : 98;

    return keys.map((key, index) => {
      // 12 slices of 30 degrees. 0 index is C (top, 12 o'clock, which is -90 deg in standard polar coordinates)
      const angleStep = 30;
      const startAngleDeg = index * angleStep - 90 - 15; // Shift back 15 degrees to center the text
      const endAngleDeg = startAngleDeg + angleStep;

      const startRad = (startAngleDeg * Math.PI) / 180;
      const endRad = (endAngleDeg * Math.PI) / 180;

      // Outer border coordinates
      const x1_outer = centerX + outerRadius * Math.cos(startRad);
      const y1_outer = centerY + outerRadius * Math.sin(startRad);
      const x2_outer = centerX + outerRadius * Math.cos(endRad);
      const y2_outer = centerY + outerRadius * Math.sin(endRad);

      // Inner border coordinates
      const x1_inner = centerX + innerRadius * Math.cos(endRad);
      const y1_inner = centerY + innerRadius * Math.sin(endRad);
      const x2_inner = centerX + innerRadius * Math.cos(startRad);
      const y2_inner = centerY + innerRadius * Math.sin(startRad);

      const pathData = `
        M ${x1_outer} ${y1_outer}
        A ${outerRadius} ${outerRadius} 0 0 1 ${x2_outer} ${y2_outer}
        L ${x1_inner} ${y1_inner}
        A ${innerRadius} ${innerRadius} 0 0 0 ${x2_inner} ${y2_inner}
        Z
      `;

      // Text position is centered in the slice
      const textAngleRad = ((index * angleStep - 90) * Math.PI) / 180;
      const textRadius = (innerRadius + outerRadius) / 2;
      const textX = centerX + textRadius * Math.cos(textAngleRad);
      const textY = centerY + textRadius * Math.sin(textAngleRad) + 5; // offset font baseline

      // Check current key highlight
      const rawKey = key.replace('m', '') as NoteName;
      const isMinorKeyType = key.endsWith('m');
      
      const isActive = isMinorKeyType
        ? (activeRoot === rawKey && (activeScale === 'natural_minor' || activeScale === 'pentatonic_minor'))
        : (activeRoot === rawKey && (activeScale === 'major' || activeScale === 'pentatonic_major'));

      return (
        <g
          key={key}
          className="cursor-pointer group transition-all duration-300"
          id={`circle-slice-${key}`}
          onClick={() => {
            const correspondingScale: ScaleType = isMinorKeyType ? 'natural_minor' : 'major';
            onSelectKey(rawKey, correspondingScale);
          }}
        >
          {/* Slice segment background */}
          <path
            d={pathData}
            className={`transition-colors duration-200 fill-none stroke-slate-800/60 stroke-[1.5px] ${
              isActive
                ? 'fill-amber-500/80 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                : 'hover:fill-slate-800/40 fill-slate-900/60'
            }`}
          />
          {/* Note name string text */}
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            className={`font-sans select-none pointer-events-none font-bold text-xs transition-colors duration-200 ${
              isActive
                ? 'fill-slate-950 font-black'
                : 'fill-slate-300 group-hover:fill-amber-400'
            }`}
          >
            {key}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="flex flex-col items-center bg-slate-950/40 backdrop-blur-md rounded-3xl p-6 border border-slate-850 shadow-2xl relative overflow-hidden group">
      {/* Absolute faint decorative background rings */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.04)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="flex justify-between items-center w-full mb-4">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-400 font-sans">
          Circle of Fifths
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-800/50">
          Modulator
        </span>
      </div>

      <div className="relative flex justify-center items-center w-full h-[320px]">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="drop-shadow-lg scale-95 sm:scale-100 transition-all duration-300"
        >
          {/* Inner ambient hub center dot */}
          <circle
            cx={centerX}
            cy={centerY}
            r="50"
            className="fill-slate-950 stroke-slate-800/40 stroke-2"
          />
          
          <g>
            {/* Draw outer sector slices (Major keys) */}
            {renderSlices(true)}
            {/* Draw inner sector slices (Minor keys) */}
            {renderSlices(false)}
          </g>

          {/* Central status readout */}
          <g className="pointer-events-none select-none">
            <text
              x={centerX}
              y={centerY - 6}
              textAnchor="middle"
              className="fill-slate-450 text-[10px] uppercase font-mono font-bold tracking-widest"
            >
              Key
            </text>
            <text
              x={centerX}
              y={centerY + 16}
              textAnchor="middle"
              className="fill-amber-450 text-xl font-sans font-black tracking-tight"
            >
              {activeRoot}
              <tspan className="text-xs uppercase ml-0.5 text-slate-400">
                {activeScale.includes('minor') ? 'm' : ''}
              </tspan>
            </text>
          </g>
        </svg>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-400 text-center max-w-[260px] font-sans">
        Click **outer slices** for Major keys, and **inner slices** for Relative Minor keys. Neighboring slices correspond to keys sharing the most overlapping chord voicings.
      </p>
    </div>
  );
}
