/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { NoteName, Tuning, ChordType } from '../types';
import { CHORD_VOICINGS, getAbsoluteVoicingPoints, getNoteIndex } from '../utils/theory';
import { playStrum } from '../utils/audio';
import { Layers, Volume2, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ChordBuilderProps {
  activeRoot: NoteName;
  activeTuning: Tuning;
  onSelectVoicingPoints: (
    points: { stringIndex: number; fret: number; fingering?: string; isRoot?: boolean }[] | null
  ) => void;
  activeVoicingPoints: { stringIndex: number; fret: number; fingering?: string; isRoot?: boolean }[] | null;
}

export default function ChordBuilder({
  activeRoot,
  activeTuning,
  onSelectVoicingPoints,
  activeVoicingPoints,
}: ChordBuilderProps) {
  const [chordColor, setChordColor] = useState<ChordType>('maj');
  const [selectedPositionIdx, setSelectedPositionIdx] = useState<number>(0);

  const voicingDb = CHORD_VOICINGS[chordColor] || CHORD_VOICINGS['maj'];
  const activePosition = voicingDb.positions[selectedPositionIdx] || voicingDb.positions[0];

  // Resolve absolute points transposed to modern root note
  const absolutePoints = getAbsoluteVoicingPoints(
    voicingDb,
    selectedPositionIdx,
    activeRoot,
    activeTuning
  );

  // Sync to App state
  useEffect(() => {
    // Whenever root, flavor, or CAGED shape shifts, automatically broadcast coordinates
    onSelectVoicingPoints(absolutePoints);
  }, [chordColor, selectedPositionIdx, activeRoot, activeTuning]);

  const handleStrumVoicing = () => {
    // Collect active midi values filtering out muted strings (-1)
    const midiNotes: number[] = [];
    absolutePoints.forEach(point => {
      if (point.fret !== -1) {
        const openStringMidi = activeTuning.notes[point.stringIndex];
        const absoluteMidiNote = openStringMidi + point.fret;
        midiNotes.push(absoluteMidiNote);
      }
    });
    playStrum(midiNotes, 'down');
  };

  const getFretRange = () => {
    const frets = absolutePoints.filter(p => p.fret > 0).map(p => p.fret);
    if (frets.length === 0) return 'Open position';
    const min = Math.min(...frets);
    const max = Math.max(...frets);
    if (min === max) return `Fret ${min}`;
    return `Frets ${min} - ${max}`;
  };

  // Helper description tips for shapes
  const getShapeGuide = (shapeName: string) => {
    switch (shapeName) {
      case 'Open C Shape':
        return 'Intermediate folk voicing. Keep string 1 (High e) open and ring finger firm on the 5th string (A).';
      case 'Open A Shape':
        return 'Standard and punchy. Triple fretting adjacent strings 2, 3, and 4 on the second fret. Avoid strumming string 6.';
      case 'Barre E Shape':
        return 'The classic full 6-string barre. Index finger acts as a capotasto spanning the root fret. Incredible for punchy garage rock!';
      case 'Barre Am Shape':
        return 'A rich minor barre form. Sits on the 5th string root. Index finger barres across strings 1 through 5.';
      case 'Open Em Shape':
        return 'Beginners absolute best friend. Lush, deep, E-minor texture utilizing only two fingers on strings 4 and 5.';
      case 'Barre E7 Shape':
        return 'Funky Blues staple. Lifts the pinky from the E major barre layout to expose a dominant flat 7 harmonic degree.';
      default:
        return 'A classic versatile position. Take care to mute strings labeled with red ✕ marks.';
    }
  };

  return (
    <div className="flex flex-col w-full bg-slate-950/40 border border-slate-850 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Absolute faint background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(245,158,11,0.02)_0%,transparent_60%)] pointer-events-none" />

      {/* Header title */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-850 z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-550 border border-amber-500/20">
            <Layers size={17} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm tracking-tight flex items-center gap-2">
              CAGED Voicing Guide
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 max-w-sm">
              Study absolute shape voicings for <span className="font-bold text-amber-500">{activeRoot} {voicingDb.chordName}</span>.
            </p>
          </div>
        </div>

        {/* Chord Color Type Selector */}
        <div className="flex gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl items-center shadow-inner">
          {(['maj', 'min', 'dom7'] as ChordType[]).map((type) => (
            <button
              key={type}
              id={`tab-chord-builder-${type}`}
              onClick={() => {
                setChordColor(type);
                setSelectedPositionIdx(0);
              }}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                chordColor === type
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type === 'maj' ? 'Major' : type === 'min' ? 'Minor' : 'Dom 7'}
            </button>
          ))}
        </div>
      </div>

      {/* Shapes and finger diagram columns */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start mt-2">
        {/* Left side: Position List Selection */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold text-slate-450 tracking-wider uppercase mb-1">
            Choose Fretboard Shape Position
          </div>

          <div className="flex flex-col gap-2">
            {voicingDb.positions.map((pos, idx) => {
              const active = selectedPositionIdx === idx;
              return (
                <button
                  key={pos.name}
                  id={`btn-caged-shape-${idx}`}
                  onClick={() => setSelectedPositionIdx(idx)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-left transition-all ${
                    active
                      ? 'bg-slate-905 border-amber-500 shadow-lg text-slate-200 ring-1 ring-amber-500/50'
                      : 'bg-slate-900/40 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-sans font-bold text-xs">
                    {pos.name}
                    <div className="text-[10px] font-mono text-slate-450 font-normal mt-0.5">
                      Span: {getFretRange()}
                    </div>
                  </div>
                  {active && (
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/25 text-amber-400 border border-amber-500/30 font-black animate-pulse">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick instructions panel */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-850 flex gap-2.5">
            <HelpCircle size={15} className="text-amber-500/80 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-semibold text-slate-350 uppercase tracking-wide">
                Guitarist Coach Advice
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                {getShapeGuide(activePosition.name)}
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Mini-Chord Diagram & Strum play */}
        <div className="flex flex-col items-center bg-slate-900 p-5 rounded-2xl border border-slate-850 max-w-[240px] w-full self-center md:self-stretch justify-between">
          <div className="text-xs font-bold text-slate-450 uppercase text-center mb-2 tracking-wide font-sans">
            Mini Finger Map
          </div>

          {/* Mini SVG Grid representation */}
          <div className="w-[120px] h-[140px] relative my-2">
            <svg viewBox="0 0 100 120" className="w-full h-full stroke-slate-700">
              {/* String vertical lines */}
              {Array.from({ length: 6 }).map((_, i) => (
                <line
                  key={i}
                  x1={10 + i * 16}
                  y1={15}
                  x2={10 + i * 16}
                  y2={105}
                  strokeWidth={1 + (5 - i) * 0.4}
                />
              ))}

              {/* Fret horizontal lines */}
              {Array.from({ length: 5 }).map((_, i) => (
                <line
                  key={i}
                  x1={10}
                  y1={15 + i * 22}
                  x2={90}
                  y2={15 + i * 22}
                  className={i === 0 ? 'stroke-slate-400 stroke-2' : 'stroke-slate-750'}
                />
              ))}

              {/* Fingering points overlays */}
              {absolutePoints.map((point, index) => {
                const xVal = 10 + point.stringIndex * 16;
                
                if (point.fret === -1) {
                  // Muted string drawing
                  return (
                    <text
                      key={index}
                      x={xVal}
                      y={10}
                      textAnchor="middle"
                      className="fill-red-500 text-[10px] font-sans font-bold"
                    >
                      ✕
                    </text>
                  );
                }
                
                if (point.fret === 0) {
                  // Open string circle
                  return (
                    <circle
                      key={index}
                      cx={xVal}
                      cy={8}
                      r="3.5"
                      className="fill-none stroke-slate-400 stroke-1"
                    />
                  );
                }

                // Fingered note
                const minFret = Math.min(...absolutePoints.filter(p => p.fret > 0).map(p => p.fret));
                const relativeLocationMultiplier = minFret > 2 ? point.fret - minFret + 1 : point.fret;
                
                const yVal = 15 + (relativeLocationMultiplier - 0.5) * 22;

                return (
                  <g key={index}>
                    <circle
                      cx={xVal}
                      cy={yVal}
                      r="6"
                      className={`${
                        point.isRoot
                          ? 'fill-amber-500 stroke-none'
                          : 'fill-slate-800 stroke-slate-650 stroke-[0.5px]'
                      }`}
                    />
                    {point.fingering && (
                      <text
                        x={xVal}
                        y={yVal + 3}
                        textAnchor="middle"
                        className={`text-[8px] font-mono font-black border-none ${
                          point.isRoot ? 'fill-slate-950 font-black' : 'fill-slate-300'
                        }`}
                      >
                        {point.fingering}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <button
            id="btn-strum-chord-builder"
            onClick={handleStrumVoicing}
            className="w-full flex items-center justify-center gap-2 bg-amber-550/15 hover:bg-amber-550/25 border border-amber-500/30 text-amber-500 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md mt-4"
          >
            <Volume2 size={14} />
            Strum Voicing
          </button>
        </div>
      </div>
    </div>
  );
}
