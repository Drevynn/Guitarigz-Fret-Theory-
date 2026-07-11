/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NoteName =
  | 'C'
  | 'C#'
  | 'Db'
  | 'D'
  | 'D#'
  | 'Eb'
  | 'E'
  | 'F'
  | 'F#'
  | 'Gb'
  | 'G'
  | 'G#'
  | 'Ab'
  | 'A'
  | 'A#'
  | 'Bb'
  | 'B';

export type ScaleType =
  | 'major'
  | 'natural_minor'
  | 'harmonic_minor'
  | 'melodic_minor'
  | 'pentatonic_major'
  | 'pentatonic_minor'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'locrian'
  | 'blues_minor';

export type ChordType =
  | 'maj'
  | 'min'
  | 'dim'
  | 'aug'
  | 'maj7'
  | 'min7'
  | 'dom7'
  | 'min7b5';

export interface Tuning {
  id: string;
  name: string;
  notes: number[]; // MIDI note values from High string (Index 0) to Low string (Index 5)
}

export interface FretNode {
  stringIndex: number; // 0 (String 1, highest string, e) to 5 (String 6, lowest string, E)
  fretIndex: number;   // 0 (Open string) to MaxFrets (e.g. 15 or 24)
  noteName: string;
  pitch: number;       // MIDI pitch
  intervalName: string; // Interval relative to the active root note (e.g., 'R', 'b3', '5')
  isRoot: boolean;
  isScaleNote: boolean;
  isChordNote: boolean;
}

export interface ChordProgression {
  id: string;
  name: string;
  description: string;
  key: NoteName;
  romanNumerals: string[]; // e.g. ["I", "vi", "IV", "V"]
  chords: {
    root: NoteName;
    type: ChordType;
    label: string; // e.g., "Cmaj7"
  }[];
}

export interface ChordShapeShapePoint {
  stringIndex: number;
  fret: number; // -1 if muted, 0 if open, >0 for frets
  fingering?: string; // '1', '2', '3', '4', 'T'
  isRoot?: boolean;
}

export interface ChordVoicing {
  chordName: string;
  positions: {
    name: string; // CAGED shape or style (e.g. "A Shape", "E Shape")
    points: ChordShapeShapePoint[];
  }[];
}

export interface QuizQuestion {
  id: string;
  type: 'locate_note' | 'identify_interval' | 'spell_scale' | 'chord_construction';
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  contextData: any; // Context for drawing (e.g., target note, target fret/string)
}

// Myrigz Integration Types
export type EffectType =
  | 'distortion'
  | 'overdrive'
  | 'delay'
  | 'reverb'
  | 'chorus'
  | 'flanger'
  | 'phaser'
  | 'compressor'
  | 'eq'
  | 'wah'
  | 'tremolo'
  | 'octave';

export interface EffectParameter {
  name: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
}

export interface Effect {
  id: string;
  name: string;
  type: EffectType;
  enabled: boolean;
  parameters: EffectParameter[];
  dryWet: number; // 0-100
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  category: string;
  effects: Effect[];
  favorite?: boolean;
}

export const PRESET_CATEGORIES = [
  'Clean',
  'Crunch',
  'High Gain',
  'Lead',
  'Acoustic',
  'Ambient',
  'Blues',
  'Metal',
  'Jazz',
  'AI Generated'
] as const;

export type PresetCategory = (typeof PRESET_CATEGORIES)[number];

