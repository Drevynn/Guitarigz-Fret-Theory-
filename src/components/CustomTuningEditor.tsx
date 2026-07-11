import React from 'react';
import { Play, Volume2, ShieldAlert, ArrowUpCircle, ArrowDownCircle, RotateCcw } from 'lucide-react';
import { NoteName } from '../types';
import { CHROMATIC_NOTES_SHARP, CHROMATIC_NOTES_FLAT, getSpelledNoteName, getNoteIndex } from '../utils/theory';
import { playNote } from '../utils/audio';

interface CustomTuningEditorProps {
  customNotes: number[]; // From String 1 (index 0, high) to String N (index N-1, low)
  onChangeNotes: (notes: number[]) => void;
  useFlats: boolean;
  instrument: 'guitar' | 'bass-4' | 'bass-5';
}

export default function CustomTuningEditor({
  customNotes,
  onChangeNotes,
  useFlats,
  instrument,
}: CustomTuningEditorProps) {
  const notesList = useFlats ? CHROMATIC_NOTES_FLAT : CHROMATIC_NOTES_SHARP;

  // Helper: break midi number into NoteName and Octave
  const parseMidi = (midi: number): { noteName: NoteName; octave: number } => {
    const noteName = getSpelledNoteName(midi, useFlats);
    const octave = Math.floor(midi / 12) - 1;
    return { noteName, octave };
  };

  // Helper: build midi number from NoteName and Octave
  const buildMidi = (noteName: NoteName, octave: number): number => {
    const noteIndex = getNoteIndex(noteName);
    return (octave + 1) * 12 + noteIndex;
  };

  const handleStringChange = (stringIndex: number, newNoteName: NoteName, newOctave: number) => {
    const updated = [...customNotes];
    const newMidi = buildMidi(newNoteName, newOctave);
    updated[stringIndex] = newMidi;
    onChangeNotes(updated);
    
    // Play sound immediately to provide acoustic validation of the shift
    playNote(newMidi, 0, 0.8);
  };

  const handlePlayString = (midi: number) => {
    playNote(midi, 0, 0.8);
  };

  // Quick Action: Shift entire instrument up or down a semitone
  const handleShiftAll = (semitones: number) => {
    const updated = customNotes.map(midi => {
      const nextMidi = midi + semitones;
      // Clamp to valid MIDI note range (12 to 96)
      return Math.min(Math.max(nextMidi, 12), 96);
    });
    onChangeNotes(updated);
  };

  const handleResetToStandard = () => {
    if (instrument === 'bass-4') {
      onChangeNotes([43, 38, 33, 28]);
    } else if (instrument === 'bass-5') {
      onChangeNotes([43, 38, 33, 28, 23]);
    } else {
      onChangeNotes([64, 59, 55, 50, 45, 40]);
    }
  };

  return (
    <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-5 mb-6 text-left relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-3 mb-4">
        <div>
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Custom Tuning Workshop
          </h4>
          <p className="text-[10.5px] text-slate-450 mt-0.5">
            Manually calibrate the exact pitch for each individual string. Perfect for studying custom chords or alternate modal tunings.
          </p>
        </div>

        {/* Global helpers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleShiftAll(1)}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-mono text-slate-300 hover:text-slate-100 transition-all flex items-center gap-1 cursor-pointer"
            title="Transpose entire guitar up a half step"
          >
            <ArrowUpCircle size={11} className="text-amber-500" />
            <span>Transpose +1</span>
          </button>
          <button
            onClick={() => handleShiftAll(-1)}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-mono text-slate-300 hover:text-slate-100 transition-all flex items-center gap-1 cursor-pointer"
            title="Transpose entire guitar down a half step"
          >
            <ArrowDownCircle size={11} className="text-amber-500" />
            <span>Transpose -1</span>
          </button>
          <button
            onClick={handleResetToStandard}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-mono text-slate-300 hover:text-slate-100 transition-all flex items-center gap-1 cursor-pointer"
            title="Reset to standard EADGBE notes"
          >
            <RotateCcw size={11} className="text-slate-500" />
            <span>Reset (EADGBE)</span>
          </button>
        </div>
      </div>

      {/* Strings Row Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {customNotes.map((midi, idx) => {
          const { noteName, octave } = parseMidi(midi);
          const stringNum = idx + 1;
          const isHigh = idx === 0;
          const isLow = idx === 5;

          return (
            <div 
              key={idx}
              className="bg-slate-900/40 border border-slate-850/60 hover:border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono font-bold text-slate-550 uppercase tracking-wider">
                  String {stringNum} {isHigh ? '(High)' : isLow ? '(Low)' : ''}
                </span>
                <span className="text-xs font-mono font-bold text-slate-200 mt-0.5">
                  {noteName}{octave} <span className="text-[10px] text-slate-500 font-normal">(MIDI {midi})</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Note Selector */}
                <select
                  value={noteName}
                  onChange={(e) => handleStringChange(idx, e.target.value as NoteName, octave)}
                  className="bg-slate-950 border border-slate-850 text-slate-100 font-mono text-xs px-2 py-1 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {notesList.map((note) => (
                    <option key={note} value={note}>{note}</option>
                  ))}
                </select>

                {/* Octave Selector */}
                <select
                  value={octave}
                  onChange={(e) => handleStringChange(idx, noteName, parseInt(e.target.value))}
                  className="bg-slate-950 border border-slate-850 text-slate-100 font-mono text-xs px-2 py-1 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map((oct) => (
                    <option key={oct} value={oct}>Oct {oct}</option>
                  ))}
                </select>

                {/* Play preview */}
                <button
                  onClick={() => handlePlayString(midi)}
                  className="p-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-450 hover:text-amber-500 rounded-lg transition-all cursor-pointer"
                  title={`Play String ${stringNum} pitch`}
                >
                  <Volume2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
