/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { NoteName, ScaleType, ChordType } from '../types';
import { getSpelledNoteName, getNoteIndex, CHORD_FORMULAS } from '../utils/theory';
import { playStrum } from '../utils/audio';
import { Play, Pause, SkipForward, Music4, Info, Sliders, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ProgressionsProps {
  activeKey: NoteName;
  activeScale: ScaleType;
  useFlats: boolean;
  onFilterChord: (root: NoteName | null, type: ChordType | null) => void;
  selectedChordRoot: NoteName | null;
  selectedChordType: ChordType | null;
}

interface ProgressionFormula {
  id: string;
  name: string;
  description: string;
  isMinorKey: boolean;
  steps: {
    degreeLabel: string; // e.g. "I", "ii", "vi", "VI"
    semitones: number;   // Semitones relative to active root
    chordType: ChordType;
  }[];
}

const PRESET_PROGRESSIONS: ProgressionFormula[] = [
  {
    id: 'pop_vi_iv_i_v',
    name: 'Standard Pop Vibe (I - V - vi - IV)',
    description: 'The absolute king of progressions. Used in thousands of classic pop and rock anthems.',
    isMinorKey: false,
    steps: [
      { degreeLabel: 'I', semitones: 0, chordType: 'maj' },
      { degreeLabel: 'V', semitones: 7, chordType: 'maj' },
      { degreeLabel: 'vi', semitones: 9, chordType: 'min' },
      { degreeLabel: 'IV', semitones: 5, chordType: 'maj' },
    ]
  },
  {
    id: 'jazz_ii_v_i',
    name: 'Jazz Cadence (ii7 - V7 - Imaj7)',
    description: 'The foundational pillar of jazz harmony and voice leading. Employs lush seventh chords.',
    isMinorKey: false,
    steps: [
      { degreeLabel: 'ii7', semitones: 2, chordType: 'min7' },
      { degreeLabel: 'V7', semitones: 7, chordType: 'dom7' },
      { degreeLabel: 'Imaj7', semitones: 0, chordType: 'maj7' },
      { degreeLabel: 'Imaj7', semitones: 0, chordType: 'maj7' },
    ]
  },
  {
    id: 'andalusian',
    name: 'Andalusian Cadence (i - VII - VI - V)',
    description: 'A gorgeous, flamenco-colored minor key descend. Exudes dark, dramatic and moving textures.',
    isMinorKey: true,
    steps: [
      { degreeLabel: 'i', semitones: 0, chordType: 'min' },
      { degreeLabel: 'VII', semitones: 10, chordType: 'maj' },
      { degreeLabel: 'VI', semitones: 8, chordType: 'maj' },
      { degreeLabel: 'V', semitones: 7, chordType: 'maj' }, // Major V is standard leading tone in minor keys
    ]
  },
  {
    id: 'blues_12_bar',
    name: '12-Bar Blues (I7 - IV7 - V7)',
    description: 'Classic rhythm & blues structure utilizing driving dominant 7 chords. Great for solos!',
    isMinorKey: false,
    steps: [
      { degreeLabel: 'I7', semitones: 0, chordType: 'dom7' },
      { degreeLabel: 'I7', semitones: 0, chordType: 'dom7' },
      { degreeLabel: 'IV7', semitones: 5, chordType: 'dom7' },
      { degreeLabel: 'I7', semitones: 0, chordType: 'dom7' },
      { degreeLabel: 'V7', semitones: 7, chordType: 'dom7' },
      { degreeLabel: 'IV7', semitones: 5, chordType: 'dom7' },
    ]
  },
  {
    id: 'rnb_neo_soul',
    name: 'Neo-Soul Vibe (Imaj7 - III7 - vi7 - IVmaj7)',
    description: 'Lush, soulful chord shifts utilizing a secondary dominant (III7) that resolves to the minor vi.',
    isMinorKey: false,
    steps: [
      { degreeLabel: 'Imaj7', semitones: 0, chordType: 'maj7' },
      { degreeLabel: 'III7', semitones: 4, chordType: 'dom7' },
      { degreeLabel: 'vi7', semitones: 9, chordType: 'min7' },
      { degreeLabel: 'IVmaj7', semitones: 5, chordType: 'maj7' },
    ]
  }
];

export default function Progressions({
  activeKey,
  activeScale,
  useFlats,
  onFilterChord,
  selectedChordRoot,
  selectedChordType,
}: ProgressionsProps) {
  const [activeProgId, setActiveProgId] = useState<string>(PRESET_PROGRESSIONS[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [bpm, setBpm] = useState<number>(90);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeProg = PRESET_PROGRESSIONS.find(p => p.id === activeProgId) || PRESET_PROGRESSIONS[0];

  // Helper: Generates a list of absolute chords for the current progression and transpose key
  const getCalculatedChords = () => {
    const parentRootIndex = getNoteIndex(activeKey);
    return activeProg.steps.map(step => {
      const pitch = parentRootIndex + step.semitones;
      const spelledRoot = getSpelledNoteName(pitch, useFlats);
      
      // Determine user-friendly label
      let formulaSuffix = '';
      if (step.chordType === 'min') formulaSuffix = 'm';
      else if (step.chordType === 'dim') formulaSuffix = 'dim';
      else if (step.chordType === 'aug') formulaSuffix = 'aug';
      else if (step.chordType === 'maj7') formulaSuffix = 'maj7';
      else if (step.chordType === 'min7') formulaSuffix = 'm7';
      else if (step.chordType === 'dom7') formulaSuffix = '7';
      else if (step.chordType === 'min7b5') formulaSuffix = 'm7♭5';

      return {
        root: spelledRoot,
        type: step.chordType,
        degreeLabel: step.degreeLabel,
        fullLabel: `${spelledRoot}${formulaSuffix}`
      };
    });
  };

  const calculatedChords = getCalculatedChords();

  // Handle chord play strum
  const triggerChordStrum = (root: NoteName, type: ChordType) => {
    const rootIndex = getNoteIndex(root);
    const intervals = CHORD_FORMULAS[type].intervals;

    // Build MIDI notes representing a standard guitar voicing
    // Voicing pattern: [Root in low register, 5th, octave root, 3rd, 5th]
    let voicingMidiNotes: number[] = [];
    
    // Choose appropriate bass register
    const rootMidi = rootIndex + (rootIndex < 4 ? 48 : 36); // MIDI 36 = C2, MIDI 48 = C3

    // Simple voicing logic: 
    // - Low Root
    // - 5th or 3rd above
    if (type === 'maj' || type === 'maj7' || type === 'dom7') {
      voicingMidiNotes = [
        rootMidi, 
        rootMidi + 7, 
        rootMidi + 12, 
        rootMidi + 16, 
        rootMidi + 19
      ];
      if (type === 'maj7') voicingMidiNotes.push(rootMidi + 23);
      if (type === 'dom7') voicingMidiNotes.push(rootMidi + 22);
    } else if (type === 'min' || type === 'min7') {
      voicingMidiNotes = [
        rootMidi, 
        rootMidi + 7, 
        rootMidi + 12, 
        rootMidi + 15, 
        rootMidi + 19
      ];
      if (type === 'min7') voicingMidiNotes.push(rootMidi + 22);
    } else if (type === 'dim' || type === 'min7b5') {
      voicingMidiNotes = [
        rootMidi, 
        rootMidi + 6, 
        rootMidi + 12, 
        rootMidi + 15, 
        rootMidi + 18
      ];
    } else if (type === 'aug') {
      voicingMidiNotes = [
        rootMidi, 
        rootMidi + 8, 
        rootMidi + 12, 
        rootMidi + 16, 
        rootMidi + 20
      ];
    }

    playStrum(voicingMidiNotes, 'down');
  };

  // Step sequencer loop core
  useEffect(() => {
    if (isPlaying) {
      const stepDurationMs = (60 / bpm) * 1000 * 2; // Each chord gets 2 beats representing standard measure
      
      const runStep = () => {
        // Compute active step
        const step = calculatedChords[currentStepIdx];
        if (step) {
          onFilterChord(step.root, step.type);
          triggerChordStrum(step.root, step.type);
        }

        // Increment or wrap around
        setCurrentStepIdx(prev => (prev + 1) % calculatedChords.length);
      };

      // Run immediately
      runStep();

      timerRef.current = setInterval(() => {
        const step = calculatedChords[currentStepIdx];
        if (step) {
          onFilterChord(step.root, step.type);
          triggerChordStrum(step.root, step.type);
        }
        setCurrentStepIdx(prev => (prev + 1) % calculatedChords.length);
      }, stepDurationMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentStepIdx, activeProgId, bpm, activeKey, useFlats]);

  // Handle progression switch reset
  const handleProgressionSelect = (id: string) => {
    setActiveProgId(id);
    setIsPlaying(false);
    setCurrentStepIdx(0);
    onFilterChord(null, null); // Clear filters
  };

  const handleStepClick = (idx: number, chord: typeof calculatedChords[0]) => {
    setIsPlaying(false);
    setCurrentStepIdx(idx);
    
    // Toggle filter
    const isCurrentlySelected = selectedChordRoot === chord.root && selectedChordType === chord.type;
    if (isCurrentlySelected) {
      onFilterChord(null, null);
    } else {
      onFilterChord(chord.root, chord.type);
      triggerChordStrum(chord.root, chord.type);
    }
  };

  const toggleSequence = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const getNotesInChord = (chord: typeof calculatedChords[0]) => {
    const formulas = CHORD_FORMULAS[chord.type];
    const baseIdx = getNoteIndex(chord.root);
    return formulas.intervals.map(semitones => {
      const spelled = getSpelledNoteName(baseIdx + semitones, useFlats);
      return spelled;
    }).join(', ');
  };

  return (
    <div className="flex flex-col w-full bg-slate-950/40 border border-slate-850 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
      {/* Dynamic faint background grid lines */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-5 border-b border-slate-850">
        <div>
          <h3 className="font-semibold text-slate-100 text-sm tracking-tight flex items-center gap-2">
            Chord Progression Flow
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 max-w-sm">
            Transposed live directly to <span className="font-bold text-amber-500">{activeKey} Major</span>. Perfect for training voice transitions.
          </p>
        </div>

        {/* Progression Selector Dropdown */}
        <div className="flex items-center gap-3">
          <select
            id="select-progression"
            value={activeProgId}
            onChange={(e) => handleProgressionSelect(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-250 hover:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer min-w-[200px]"
          >
            {PRESET_PROGRESSIONS.map((prog) => (
              <option key={prog.id} value={prog.id}>
                {prog.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description readout box */}
      <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-850 flex gap-3 items-start mb-6">
        <Info className="text-amber-500/80 mt-0.5 shrink-0" size={16} />
        <div>
          <h4 className="text-xs font-semibold text-slate-200">
            {activeProg.name}
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
            {activeProg.description}
          </p>
        </div>
      </div>

      {/* Interactive horizontal flow tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {calculatedChords.map((chord, idx) => {
          const isSelected = selectedChordRoot === chord.root && selectedChordType === chord.type;
          const isCurrentSequencerStep = isPlaying && ((currentStepIdx - 1 + calculatedChords.length) % calculatedChords.length) === idx;

          return (
            <motion.div
              key={idx}
              id={`step-${idx}`}
              onClick={() => handleStepClick(idx, chord)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative cursor-pointer rounded-2xl p-4 border flex flex-col items-center justify-center transition-all duration-300 ${
                isCurrentSequencerStep
                  ? 'bg-amber-550/15 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.15)] ring-1 ring-amber-500'
                  : isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                  : 'bg-slate-900/50 hover:bg-slate-900 border-slate-850 hover:border-slate-750'
              }`}
            >
              <div className="absolute top-2 left-3 font-mono text-[9px] text-slate-500 tracking-wider">
                {chord.degreeLabel}
              </div>

              {/* Strum shortcut play icon */}
              <button
                id={`strum-chord-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerChordStrum(chord.root, chord.type);
                }}
                className="absolute top-2 right-3 p-1 rounded hover:bg-slate-800 text-slate-450 hover:text-amber-500 transition-colors"
                title="Listen Chord Voice"
              >
                <Volume2 size={11} />
              </button>

              <div className="text-xl font-black text-slate-200 mt-2 font-sans">
                {chord.fullLabel}
              </div>

              <div className="text-[9px] font-mono text-slate-400 mt-2 text-center bg-slate-950/40 px-2 py-0.5 rounded border border-slate-900">
                Spelling: {getNotesInChord(chord)}
              </div>

              {/* Active dots indicators */}
              {isCurrentSequencerStep && (
                <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Synthesizer player control dashboard */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/40 rounded-2xl p-4 border border-slate-850">
        <div className="flex items-center gap-3">
          <button
            id="btn-play-flow"
            onClick={toggleSequence}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 shadow ${
              isPlaying
                ? 'bg-red-650 hover:bg-red-600 text-white shadow-red-950/20'
                : 'bg-amber-550 hover:bg-amber-500 text-slate-950 shadow-amber-950/25'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={14} className="fill-white stroke-none" />
                Pause Sequence
              </>
            ) : (
              <>
                <Play size={14} className="fill-slate-950" />
                Play Progression
              </>
            )}
          </button>

          <button
            id="btn-step-forward"
            disabled={isPlaying}
            onClick={() => {
              const nextIdx = (currentStepIdx + 1) % calculatedChords.length;
              setCurrentStepIdx(nextIdx);
              const chord = calculatedChords[nextIdx];
              onFilterChord(chord.root, chord.type);
              triggerChordStrum(chord.root, chord.type);
            }}
            className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
              isPlaying
                ? 'opacity-30 cursor-not-allowed border-slate-800 text-slate-600'
                : 'bg-slate-850 hover:bg-slate-800 border-slate-800 hover:text-slate-200 text-slate-300'
            }`}
            title="Step chord forward"
          >
            <SkipForward size={14} />
          </button>
        </div>

        {/* BPM Tempo slider controls */}
        <div className="flex items-center gap-4 w-full sm:w-auto shrink-0 pr-2">
          <div className="flex items-center gap-2 text-slate-350 text-xs">
            <Sliders size={13} className="text-slate-450" />
            <span className="font-medium">Tempo:</span>
            <span className="font-mono text-amber-505 font-bold">{bpm}</span>
            <span className="text-[10px] text-slate-500">BPM</span>
          </div>

          <input
            id="input-progression-bpm"
            type="range"
            min="50"
            max="160"
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="w-28 sm:w-32 h-1.5 rounded-lg appearance-none bg-slate-800 cursor-pointer accent-amber-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
