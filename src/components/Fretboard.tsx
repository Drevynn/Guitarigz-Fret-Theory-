/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { NoteName, ScaleType, ChordType, Tuning, FretNode } from '../types';
import { generateFretboardNodes, CHROMATIC_NOTES_SHARP } from '../utils/theory';
import { Music, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FretboardProps {
  activeRoot: NoteName;
  activeScale: ScaleType;
  chordRoot: NoteName | null;
  chordType: ChordType | null;
  activeTuning: Tuning;
  maxFrets: number;
  leftHanded: boolean;
  displayMode: 'notes' | 'intervals';
  useFlats: boolean;
  onPlayNode: (midi: number) => void;
  voicingPoints?: { stringIndex: number; fret: number; fingering?: string; isRoot?: boolean }[] | null;
  highlightSecondaryScale?: ScaleType | null; // For modal comparisons!
  externalActiveNotes?: number[];
  activeThemeId?: string;
}

export default function Fretboard({
  activeRoot,
  activeScale,
  chordRoot,
  chordType,
  activeTuning,
  maxFrets,
  leftHanded,
  displayMode,
  useFlats,
  onPlayNode,
  voicingPoints = null,
  externalActiveNotes = [],
  activeThemeId = 'amber'
}: FretboardProps) {
  const [hoveredNode, setHoveredNode] = useState<FretNode | null>(null);
  const [hideInactiveNotes, setHideInactiveNotes] = useState<boolean>(false);

  // Generate our detailed grid of nodes
  const fretboardMatrix = generateFretboardNodes(
    activeTuning,
    maxFrets,
    activeRoot,
    activeScale,
    chordRoot,
    chordType,
    useFlats
  );

  // Standard fret markers: Single dots on 3, 5, 7, 9, 15, 17, 19, 21. Double dots on 12, 24.
  const hasMarker = (fret: number) => [3, 5, 7, 9, 15, 17, 19, 21].includes(fret);
  const hasDoubleMarker = (fret: number) => [12, 24].includes(fret);

  // Helper to reverse an array if leftHanded is active
  const orderFrets = <T,>(arr: T[]): T[] => {
    return leftHanded ? [...arr].reverse() : arr;
  };

  // Build range of fret indexes
  const fretIndices = Array.from({ length: maxFrets + 1 }, (_, i) => i);

  // Check if a fret-and-string point is highlighted by an active custom chord voicing template
  const getVoicingMatch = (stringIndex: number, fretIndex: number) => {
    if (!voicingPoints) return null;
    return voicingPoints.find(p => p.stringIndex === stringIndex && p.fret === fretIndex);
  };

  // Determine String labels (top to bottom standard High E index 0 to Low E index 5)
  const getStringLabel = (stringIdx: number) => {
    const openMidi = activeTuning.notes[stringIdx];
    const pitchClass = openMidi % 12;
    return CHROMATIC_NOTES_SHARP[pitchClass];
  };

  // Thickest strings at the bottom (highest string index), thinnest at the top
  const getStringThickness = (stringIdx: number) => {
    const totalStrings = activeTuning.notes.length;
    // Return thickness in px
    return 1 + (totalStrings - 1 - stringIdx) * 0.7;
  };

  return (
    <div className="flex flex-col w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Decorative ambient subtle background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(245,158,11,0.03)_0%,transparent_50%)] pointer-events-none" />

      {/* Control panel header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800/60 z-10">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl border ${
            activeThemeId === 'emerald'
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              : activeThemeId === 'crimson'
              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
              : activeThemeId === 'vintage'
              ? 'bg-amber-600/10 text-amber-600 border-amber-600/20'
              : activeThemeId === 'onyx'
              ? 'bg-slate-700/10 text-slate-300 border-slate-650/20'
              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
          }`}>
            <Music size={18} id="icon-fretboard-music" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm tracking-tight flex items-center gap-2">
              Fretboard Visualizer
              {voicingPoints ? (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeThemeId === 'emerald'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : activeThemeId === 'crimson'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : activeThemeId === 'vintage'
                    ? 'bg-amber-600/20 text-amber-500 border-amber-600/30'
                    : activeThemeId === 'onyx'
                    ? 'bg-slate-700/20 text-slate-300 border-slate-650/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                } animate-pulse`}>
                  Chord Shape Locked
                </span>
              ) : chordRoot && chordType ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Chord Notes Filtered
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                  Scale Highlighted
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans font-medium">
              Tuning: <span className={`font-mono ${
                activeThemeId === 'emerald' ? 'text-emerald-500' :
                activeThemeId === 'crimson' ? 'text-rose-500' :
                activeThemeId === 'vintage' ? 'text-amber-600' :
                activeThemeId === 'onyx' ? 'text-slate-300' :
                'text-amber-500'
              }`}>{activeTuning.name}</span>
            </p>
          </div>
        </div>

        {/* Local Display toggles */}
        <div className="flex items-center gap-3">
          <button
            id="btn-hide-inactive"
            onClick={() => setHideInactiveNotes(!hideInactiveNotes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all duration-300 ${
              hideInactiveNotes
                ? activeThemeId === 'emerald'
                  ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/30 font-bold'
                  : activeThemeId === 'crimson'
                  ? 'bg-rose-500/10 text-rose-450 border-rose-500/30 font-bold'
                  : activeThemeId === 'vintage'
                  ? 'bg-amber-600/10 text-amber-500 border-amber-600/30 font-bold'
                  : activeThemeId === 'onyx'
                  ? 'bg-slate-700/10 text-slate-300 border-slate-650/30 font-bold'
                  : 'bg-amber-500/10 text-amber-450 border-amber-500/30 font-bold'
                : 'bg-slate-850 hover:bg-slate-800 text-slate-350 border-slate-800/80 hover:text-slate-200'
            }`}
          >
            {hideInactiveNotes ? (
              <>
                <EyeOff size={13} />
                Focused Views
              </>
            ) : (
              <>
                <Eye size={13} />
                Show All Notes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Fretboard Frame with wood composite aesthetic */}
      <div className="relative w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-800/60">
        <div className="min-w-[850px] relative mt-2 pt-2 select-none">
          {/* Wood neck trim styling */}
          <div className="absolute inset-0 bg-slate-950/80 rounded-lg border-y-2 border-slate-800 shadow-inner z-0 pointer-events-none" />

          {/* Fretboard grid content */}
          <div className="relative z-10 grid grid-cols-[auto_1fr] items-center gap-0">
            {/* 1. Open string tuner indicator labels */}
            <div className="flex flex-col pr-4 pl-1 border-r border-slate-750/50 justify-between h-[180px] py-2 z-20">
              {fretboardMatrix.map((_, stringIdx) => (
                <div
                  key={stringIdx}
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-850 border border-slate-750 text-[10px] font-mono font-bold text-slate-350 hover:text-amber-450 cursor-pointer shadow"
                  onClick={() => {
                    const openNode = fretboardMatrix[stringIdx][0];
                    if (openNode) onPlayNode(openNode.pitch);
                  }}
                  title={`Open String ${stringIdx + 1}: Play Pitch`}
                >
                  {getStringLabel(stringIdx)}
                </div>
              ))}
            </div>

            {/* 2. Scrollable Neck Area */}
            <div className="relative h-[200px]">
              {/* Scale highlight track marker rows behind nodes */}
              <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between py-2.5 h-[180px] pointer-events-none">
                {Array.from({ length: activeTuning.notes.length }).map((_, i) => (
                  <div
                    key={i}
                    style={{ height: `${getStringThickness(i)}px` }}
                    className="w-full bg-slate-800/80 opacity-70 z-0 shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                  />
                ))}
              </div>

              {/* Fret marker dot overlays */}
              <div className="absolute inset-y-0 left-0 right-0 flex justify-between h-[180px] py-1 pointer-events-none z-0">
                {orderFrets(fretIndices).map((fret) => {
                  if (fret === 0) return <div key={fret} className="flex-1" />;
                  return (
                    <div
                      key={fret}
                      className="flex-1 flex flex-col items-center justify-center relative border-r border-slate-800/40"
                    >
                      {hasMarker(fret) && (
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-800 opacity-60 self-center border border-slate-700/30" />
                      )}
                      {hasDoubleMarker(fret) && (
                        <div className="flex flex-col gap-6 items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 opacity-60 border border-slate-700/30" />
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 opacity-60 border border-slate-700/30" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Fret wire overlay dividers */}
              <div className="absolute inset-y-0 left-0 right-0 flex justify-between z-15 pointer-events-none h-[180px] py-1.5">
                {orderFrets(fretIndices).map((fret) => {
                  return (
                    <div
                      key={fret}
                      className={`flex-1 border-r flex flex-col justify-between h-full relative ${
                        fret === 0
                          ? 'border-r-4 border-slate-500' // Fretboard NUT representation
                          : 'border-r-2 border-slate-650 shadow-[1px_0_1px_rgba(0,0,0,0.7)]' // Stainless steel silver fret wires
                      }`}
                    >
                      {/* Wood micro texture shadow next to fret wire */}
                      <div className="absolute top-0 bottom-0 -left-[1.5px] w-[1px] bg-slate-950 opacity-50" />
                    </div>
                  );
                })}
              </div>

              {/* Note nodes grid matrix trigger overlay */}
              <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between py-2 h-[180px] z-20">
                {fretboardMatrix.map((stringNodes, stringIdx) => (
                  <div key={stringIdx} className="flex-1 flex justify-between relative h-full items-center">
                    {orderFrets(stringNodes).map((node) => {
                      const voicingMatch = getVoicingMatch(node.stringIndex, node.fretIndex);
                      const isVPoint = voicingMatch !== null;
                      const isMutedVPoint = isVPoint && voicingMatch?.fret === -1;
                      
                      const isExternallyTriggered = externalActiveNotes.includes(node.pitch);
                      
                      // Handle focus layout states
                      const satisfiesHighlight = voicingPoints
                        ? (isVPoint && !isMutedVPoint)
                        : (chordRoot && chordType)
                        ? node.isChordNote
                        : (node.isScaleNote || isExternallyTriggered);

                      const isActiveRoot = voicingPoints
                        ? voicingMatch?.isRoot
                        : node.isRoot;

                      const isDimmed = hideInactiveNotes && !satisfiesHighlight;

                      return (
                        <div
                          key={node.fretIndex}
                          id={`node-${node.stringIndex}-${node.fretIndex}`}
                          onMouseEnter={() => setHoveredNode(node)}
                          onMouseLeave={() => setHoveredNode(null)}
                          onClick={() => {
                            if (!isMutedVPoint) {
                              onPlayNode(node.pitch);
                            }
                          }}
                          className="flex-1 flex items-center justify-center h-full relative group/node cursor-pointer z-20"
                        >
                          {/* Muted marker indicator in CAGED voicings */}
                          {voicingPoints && isVPoint && isMutedVPoint ? (
                            <div className="relative text-red-500 font-sans font-black text-xs mix-blend-screen scale-110 drop-shadow">
                              ✕
                            </div>
                          ) : (
                            <AnimatePresence mode="popLayout">
                              {satisfiesHighlight && (
                                <motion.div
                                  initial={{ scale: 0.7, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.7, opacity: 0 }}
                                  transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] font-sans font-bold shadow-lg shadow-black/40 border border-slate-900 transition-all duration-300 ${
                                    isExternallyTriggered
                                      ? 'bg-[linear-gradient(135deg,#06b6d4,#0284c7)] text-slate-950 font-black scale-115 drop-shadow-[0_0_12px_rgba(6,182,212,0.95)] border-cyan-400 ring-2 ring-cyan-400/20'
                                      : isActiveRoot
                                      ? activeThemeId === 'emerald'
                                        ? 'bg-[linear-gradient(135deg,#10b981,#059669)] text-slate-950 font-black scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.55)] border-emerald-400'
                                        : activeThemeId === 'crimson'
                                        ? 'bg-[linear-gradient(135deg,#f43f5e,#e11d48)] text-slate-950 font-black scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.55)] border-rose-450'
                                        : activeThemeId === 'vintage'
                                        ? 'bg-[linear-gradient(135deg,#d97706,#78350f)] text-slate-950 font-black scale-110 drop-shadow-[0_0_8px_rgba(217,119,6,0.55)] border-amber-500'
                                        : activeThemeId === 'onyx'
                                        ? 'bg-[linear-gradient(135deg,#6b7280,#374151)] text-slate-950 font-black scale-110 drop-shadow-[0_0_8px_rgba(107,114,128,0.55)] border-slate-400'
                                        : 'bg-[linear-gradient(135deg,#f59e0b,#d97706)] text-slate-950 font-black scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.55)] border-amber-400'
                                      : voicingPoints
                                      ? activeThemeId === 'emerald'
                                        ? 'bg-emerald-400/20 text-emerald-500 border-emerald-500/50'
                                        : activeThemeId === 'crimson'
                                        ? 'bg-rose-400/20 text-rose-500 border-rose-500/50'
                                        : activeThemeId === 'vintage'
                                        ? 'bg-amber-500/20 text-amber-600 border-amber-600/50'
                                        : activeThemeId === 'onyx'
                                        ? 'bg-slate-400/20 text-slate-300 border-slate-500/50'
                                        : 'bg-amber-400/20 text-amber-500 border-amber-500/50'
                                      : (chordRoot && chordType)
                                      ? 'bg-[linear-gradient(135deg,#10b981,#059669)] text-slate-50 font-black border-emerald-400'
                                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
                                  }`}
                                >
                                  {voicingPoints && voicingMatch?.fingering ? (
                                    <span className="font-mono text-xs">{voicingMatch.fingering}</span>
                                  ) : displayMode === 'notes' ? (
                                    node.noteName
                                  ) : (
                                    node.intervalName
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          )}

                          {/* Hover preview marker for non-highlighted notes */}
                          {!satisfiesHighlight && !isDimmed && (
                            <div className="w-5 h-5 rounded-full bg-slate-800/40 border border-slate-700/10 flex items-center justify-center opacity-0 group-hover/node:opacity-100 transition-opacity duration-200 shadow-md">
                              <span className="text-[9px] font-sans font-medium text-slate-400">
                                {displayMode === 'notes' ? node.noteName : node.intervalName}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Fret Labels Footer Row */}
          <div className="grid grid-cols-[auto_1fr] items-center gap-0 mt-2 z-25 relative">
            {/* spacer */}
            <div className="w-10" />
            <div className="flex justify-between w-full h-6 relative">
              {orderFrets(fretIndices).map((fret) => {
                const isDouble = hasDoubleMarker(fret);
                const isSingle = hasMarker(fret);
                return (
                  <div
                    key={fret}
                    className="flex-1 flex flex-col items-center justify-start text-[10px] font-mono font-bold text-slate-450"
                  >
                    <span className={isDouble || isSingle ? (
                      activeThemeId === 'emerald' ? 'text-emerald-500/80 font-black' :
                      activeThemeId === 'crimson' ? 'text-rose-500/80 font-black' :
                      activeThemeId === 'vintage' ? 'text-amber-600/80 font-black' :
                      activeThemeId === 'onyx' ? 'text-slate-300/80 font-black' :
                      'text-amber-500/80 font-black'
                    ) : ''}>
                      {fret === 0 ? 'Nut' : fret}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend and stats footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-4 border-t border-slate-800/60 z-10 text-xs">
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full border inline-block shadow-sm ${
              activeThemeId === 'emerald' ? 'bg-[linear-gradient(135deg,#10b981,#059669)] border-emerald-400' :
              activeThemeId === 'crimson' ? 'bg-[linear-gradient(135deg,#f43f5e,#e11d48)] border-rose-400' :
              activeThemeId === 'vintage' ? 'bg-[linear-gradient(135deg,#d97706,#78350f)] border-amber-500' :
              activeThemeId === 'onyx' ? 'bg-[linear-gradient(135deg,#6b7280,#374151)] border-slate-400' :
              'bg-[linear-gradient(135deg,#f59e0b,#d97706)] border-amber-400'
            }`} />
            <span className="text-slate-400 font-medium font-sans">Root Note</span>
          </div>

          {!voicingPoints && chordRoot && chordType && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[linear-gradient(135deg,#10b981,#059669)] border border-emerald-400 inline-block shadow-sm" />
              <span className="text-slate-400 font-medium font-sans">Chord Note ({chordRoot} {chordType})</span>
            </div>
          )}

          {!voicingPoints && (!chordRoot || !chordType) && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700 inline-block shadow-sm" />
              <span className="text-slate-400 font-medium font-sans">Scale Intervals</span>
            </div>
          )}

          {voicingPoints && (
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full inline-block shadow-sm flex items-center justify-center text-[8px] font-bold ${
                activeThemeId === 'emerald' ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' :
                activeThemeId === 'crimson' ? 'bg-rose-500/20 border border-rose-500/50 text-rose-450' :
                activeThemeId === 'vintage' ? 'bg-amber-600/20 border border-amber-600/50 text-amber-500' :
                activeThemeId === 'onyx' ? 'bg-slate-700/20 border border-slate-650/50 text-slate-300' :
                'bg-amber-400/25 border border-amber-500/50 text-amber-500'
              }`}>
                1
              </span>
              <span className="text-slate-400 font-medium font-sans">Fingerings (1=Idx, 2=Mid, 3=Ring, 4=Pinky, T=Thumb)</span>
            </div>
          )}
        </div>

        {/* Dynamic status coordinates hover popover readout */}
        <div className="h-6 flex items-center">
          <AnimatePresence mode="wait">
            {hoveredNode ? (
              <motion.div
                key="coordinate-bar"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[10px] font-mono text-slate-400 bg-slate-850 px-3 py-1 rounded-lg border border-slate-800/80 shadow flex items-center gap-2"
              >
                <span>String {hoveredNode.stringIndex + 1}</span>
                <span className="text-slate-600">|</span>
                <span>Fret {hoveredNode.fretIndex}</span>
                <span className="text-slate-600">|</span>
                <span className={
                  activeThemeId === 'emerald' ? 'text-emerald-450 font-bold' :
                  activeThemeId === 'crimson' ? 'text-rose-450 font-bold' :
                  activeThemeId === 'vintage' ? 'text-amber-550 font-bold' :
                  activeThemeId === 'onyx' ? 'text-slate-300 font-bold' :
                  'text-amber-500 font-bold'
                }>{hoveredNode.noteName}</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-450">MIDI {hoveredNode.pitch}</span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-500 font-bold">Int: {hoveredNode.intervalName}</span>
              </motion.div>
            ) : (
              <span key="no-hover" className="text-[10px] font-mono text-slate-500 select-none">
                Hover over fret nodes for details • Click string 1-6 tuner circles to listen
              </span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
