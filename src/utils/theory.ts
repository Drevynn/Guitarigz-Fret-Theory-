/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NoteName, ScaleType, ChordType, Tuning, FretNode, ChordVoicing } from '../types';

export const CHROMATIC_NOTES_SHARP: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const CHROMATIC_NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export const STANDARD_TUNINGS: Tuning[] = [
  { id: 'standard', name: 'Standard Tuning (EADGBE)', notes: [64, 59, 55, 50, 45, 40] }, // E4, B3, G3, D3, A2, E2
  { id: 'drop_d', name: 'Drop D (DADGBE)', notes: [64, 59, 55, 50, 45, 38] }, // Low D2
  { id: 'dadgad', name: 'DADGAD', notes: [62, 57, 55, 50, 45, 38] }, // D4, A3, G3, D3, A2, D2
  { id: 'half_down', name: 'Half-Step Down (Eb Ab Db Gb Bb Eb)', notes: [63, 58, 54, 49, 44, 39] },
  { id: 'open_g', name: 'Open G (DGDGBD)', notes: [62, 59, 55, 50, 43, 38] }, // D4, B3, G3, D3, G2, D2
  { id: 'open_d', name: 'Open D (DADF#AD)', notes: [62, 57, 54, 50, 45, 38] },
];

export const BASS_4_TUNINGS: Tuning[] = [
  { id: 'bass_standard', name: 'Standard Bass (EADG)', notes: [43, 38, 33, 28] }, // G2, D2, A1, E1
  { id: 'bass_drop_d', name: 'Drop D Bass (DADG)', notes: [43, 38, 33, 26] }, // G2, D2, A1, D1
  { id: 'bass_half_down', name: 'Half-Step Down Bass (Eb Ab Db Gb)', notes: [42, 37, 32, 27] },
];

export const BASS_5_TUNINGS: Tuning[] = [
  { id: 'bass_5_standard', name: 'Standard 5-String Bass (BEADG)', notes: [43, 38, 33, 28, 23] }, // G2, D2, A1, E1, B0
  { id: 'bass_5_high_c', name: 'High-C 5-String Bass (EADGC)', notes: [48, 43, 38, 33, 28] }, // C3, G2, D2, A1, E1
];

export const SCALE_FORMULAS: Record<ScaleType, { name: string; intervals: number[]; labelMap: string[] }> = {
  major: {
    name: 'Major (Ionian)',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    labelMap: ['R', '2', '3', '4', '5', '6', '7']
  },
  natural_minor: {
    name: 'Natural Minor (Aeolian)',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    labelMap: ['R', '2', 'b3', '4', '5', 'b6', 'b7']
  },
  harmonic_minor: {
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    labelMap: ['R', '2', 'b3', '4', '5', 'b6', '7']
  },
  melodic_minor: {
    name: 'Melodic Minor',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    labelMap: ['R', '2', 'b3', '4', '5', '6', '7']
  },
  pentatonic_major: {
    name: 'Major Pentatonic',
    intervals: [0, 2, 4, 7, 9],
    labelMap: ['R', '2', '3', '5', '6']
  },
  pentatonic_minor: {
    name: 'Minor Pentatonic',
    intervals: [0, 3, 5, 7, 10],
    labelMap: ['R', 'b3', '4', '5', 'b7']
  },
  dorian: {
    name: 'Dorian Mode',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    labelMap: ['R', '2', 'b3', '4', '5', '6', 'b7']
  },
  phrygian: {
    name: 'Phrygian Mode',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    labelMap: ['R', 'b2', 'b3', '4', '5', 'b6', 'b7']
  },
  lydian: {
    name: 'Lydian Mode',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    labelMap: ['R', '2', '3', '#4', '5', '6', '7']
  },
  mixolydian: {
    name: 'Mixolydian Mode',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    labelMap: ['R', '2', '3', '4', '5', '6', 'b7']
  },
  locrian: {
    name: 'Locrian Mode',
    intervals: [0, 1, 3, 5, 6, 8, 10],
    labelMap: ['R', 'b2', 'b3', '4', 'b5', 'b6', 'b7']
  },
  blues_minor: {
    name: 'Minor Blues',
    intervals: [0, 3, 5, 6, 7, 10],
    labelMap: ['R', 'b3', '4', 'b5', '5', 'b7']
  }
};

export const CHORD_FORMULAS: Record<ChordType, { name: string; intervals: number[]; labelMap: string[] }> = {
  maj: {
    name: 'Major Triad',
    intervals: [0, 4, 7],
    labelMap: ['R', '3', '5']
  },
  min: {
    name: 'Minor Triad',
    intervals: [0, 3, 7],
    labelMap: ['R', 'b3', '5']
  },
  dim: {
    name: 'Diminished Triad',
    intervals: [0, 3, 6],
    labelMap: ['R', 'b3', 'b5']
  },
  aug: {
    name: 'Augmented Triad',
    intervals: [0, 4, 8],
    labelMap: ['R', '3', '#5']
  },
  maj7: {
    name: 'Major 7th',
    intervals: [0, 4, 7, 11],
    labelMap: ['R', '3', '5', '7']
  },
  min7: {
    name: 'Minor 7th',
    intervals: [0, 3, 7, 10],
    labelMap: ['R', 'b3', '5', 'b7']
  },
  dom7: {
    name: 'Dominant 7th',
    intervals: [0, 4, 7, 10],
    labelMap: ['R', '3', '5', 'b7']
  },
  min7b5: {
    name: 'Minor 7th Flat 5',
    intervals: [0, 3, 6, 10],
    labelMap: ['R', 'b3', 'b5', 'b7']
  }
};

// Interval representations by semitone offset from Root
export const INTERVAL_NAMES_SHARP = ['R', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
export const INTERVAL_NAMES_FLAT = ['R', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];

/**
 * Returns index of a note in the chromatic scale
 */
export function getNoteIndex(note: string): number {
  const normalized = note.toUpperCase();
  const indexSharp = CHROMATIC_NOTES_SHARP.findIndex(n => n.toUpperCase() === normalized);
  if (indexSharp !== -1) return indexSharp;
  const indexFlat = CHROMATIC_NOTES_FLAT.findIndex(n => n.toUpperCase() === normalized);
  if (indexFlat !== -1) return indexFlat;
  return 0;
}

/**
 * Clean notation mapper based on user choice
 */
export function getSpelledNoteName(pitch: number, useFlats: boolean): NoteName {
  const normalizedIndex = ((pitch % 12) + 12) % 12;
  const notesList = useFlats ? CHROMATIC_NOTES_FLAT : CHROMATIC_NOTES_SHARP;
  return notesList[normalizedIndex] as NoteName;
}

/**
 * Determines whether a specific pitch/note spelling matches standard flat keys
 */
export function keyPrefersFlats(key: NoteName): boolean {
  return ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Fm', 'Bbm', 'Ebm', 'Abm'].includes(key);
}

/**
 * Get scale notes pitches
 */
export function getScaleIntervals(scaleType: ScaleType): number[] {
  return SCALE_FORMULAS[scaleType].intervals;
}

/**
 * Returns intervals in key and spelled note names for a given scale setup
 */
export function getScaleNotesSpelling(root: NoteName, scaleType: ScaleType, useFlats: boolean): { name: NoteName; interval: string; isRoot: boolean }[] {
  const rootIndex = getNoteIndex(root);
  const formula = SCALE_FORMULAS[scaleType];
  
  return formula.intervals.map((semitones, idx) => {
    const pitch = rootIndex + semitones;
    const name = getSpelledNoteName(pitch, useFlats);
    const interval = formula.labelMap[idx];
    return {
      name,
      interval,
      isRoot: semitones === 0
    };
  });
}

/**
 * Returns notes pitches for a given chord setup
 */
export function getChordNotesSpelling(root: NoteName, chordType: ChordType, useFlats: boolean): { name: NoteName; interval: string; isRoot: boolean }[] {
  const rootIndex = getNoteIndex(root);
  const formula = CHORD_FORMULAS[chordType];
  
  return formula.intervals.map((semitones, idx) => {
    const pitch = rootIndex + semitones;
    const name = getSpelledNoteName(pitch, useFlats);
    const interval = formula.labelMap[idx];
    return {
      name,
      interval,
      isRoot: semitones === 0
    };
  });
}

/**
 * Generates notes of all frets for a specific tuning
 */
export function generateFretboardNodes(
  tuning: Tuning,
  maxFrets: number,
  root: NoteName,
  scaleType: ScaleType,
  chordRoot: NoteName | null,
  chordType: ChordType | null,
  useFlats: boolean
): FretNode[][] {
  const rootIndex = getNoteIndex(root);
  const scaleIntervals = SCALE_FORMULAS[scaleType].intervals;
  
  let chordIntervals: number[] = [];
  let chordRootIndex = 0;
  if (chordRoot && chordType) {
    chordIntervals = CHORD_FORMULAS[chordType].intervals;
    chordRootIndex = getNoteIndex(chordRoot);
  }

  // Iterate over each string
  return tuning.notes.map((openMidi, stringIdx) => {
    const stringNodes: FretNode[] = [];
    
    for (let fretIdx = 0; fretIdx <= maxFrets; fretIdx++) {
      const pitch = openMidi + fretIdx;
      const noteName = getSpelledNoteName(pitch, useFlats);
      const noteOffsetFromRoot = ((pitch - rootIndex) % 12 + 12) % 12;
      
      const isRoot = noteOffsetFromRoot === 0;
      const scaleIndex = scaleIntervals.indexOf(noteOffsetFromRoot);
      const isScaleNote = scaleIndex !== -1;
      
      let isChordNote = false;
      let intervalName = '';

      if (isScaleNote) {
        intervalName = SCALE_FORMULAS[scaleType].labelMap[scaleIndex];
      } else {
        const intervalList = useFlats ? INTERVAL_NAMES_FLAT : INTERVAL_NAMES_SHARP;
        intervalName = intervalList[noteOffsetFromRoot];
      }

      if (chordRoot && chordType) {
        const chordOffsetFromRoot = ((pitch - chordRootIndex) % 12 + 12) % 12;
        const chordIdx = chordIntervals.indexOf(chordOffsetFromRoot);
        if (chordIdx !== -1) {
          isChordNote = true;
          // When highlighting a chord, let the interval display be relative to chord root!
          intervalName = CHORD_FORMULAS[chordType].labelMap[chordIdx];
        }
      }

      stringNodes.push({
        stringIndex: stringIdx,
        fretIndex: fretIdx,
        noteName,
        pitch,
        intervalName,
        isRoot: chordRoot ? (noteName === chordRoot) : isRoot,
        isScaleNote,
        isChordNote
      });
    }
    
    return stringNodes;
  });
}

/**
 * Suggested voicings for specific chords (CAGED shapes or beginner chord boxes)
 * String 1 is Index 0 (High e), String 6 is Index 5 (Low E)
 */
export const CHORD_VOICINGS: Record<string, ChordVoicing> = {
  'maj': {
    chordName: 'Major',
    positions: [
      {
        name: 'Open C Shape',
        points: [
          { stringIndex: 0, fret: 0 }, // High e
          { stringIndex: 1, fret: 1, fingering: '1' }, // C
          { stringIndex: 2, fret: 0 }, // G
          { stringIndex: 3, fret: 2, fingering: '2' }, // E
          { stringIndex: 4, fret: 3, fingering: '3', isRoot: true }, // C root
          { stringIndex: 5, fret: -1 }, // Muted Low E
        ]
      },
      {
        name: 'Open A Shape',
        points: [
          { stringIndex: 0, fret: 0 },
          { stringIndex: 1, fret: 2, fingering: '3' },
          { stringIndex: 2, fret: 2, fingering: '2' },
          { stringIndex: 3, fret: 2, fingering: '1' },
          { stringIndex: 4, fret: 0, isRoot: true },
          { stringIndex: 5, fret: -1 },
        ]
      },
      {
        name: 'Barre E Shape',
        points: [
          { stringIndex: 0, fret: 1, fingering: '1' },
          { stringIndex: 1, fret: 1, fingering: '1' },
          { stringIndex: 2, fret: 2, fingering: '2' },
          { stringIndex: 3, fret: 3, fingering: '4' },
          { stringIndex: 4, fret: 3, fingering: '3' },
          { stringIndex: 5, fret: 1, fingering: '1', isRoot: true },
        ]
      },
      {
        name: 'Open G Shape',
        points: [
          { stringIndex: 0, fret: 3, fingering: '4' },
          { stringIndex: 1, fret: 0 },
          { stringIndex: 2, fret: 0 },
          { stringIndex: 3, fret: 0 },
          { stringIndex: 4, fret: 2, fingering: '1' },
          { stringIndex: 5, fret: 3, fingering: '2', isRoot: true },
        ]
      },
      {
        name: 'Barre A Shape',
        points: [
          { stringIndex: 0, fret: 3, fingering: '1' },
          { stringIndex: 1, fret: 5, fingering: '4' },
          { stringIndex: 2, fret: 5, fingering: '3' },
          { stringIndex: 3, fret: 5, fingering: '2' },
          { stringIndex: 4, fret: 3, fingering: '1', isRoot: true },
          { stringIndex: 5, fret: -1 },
        ]
      }
    ]
  },
  'min': {
    chordName: 'Minor',
    positions: [
      {
        name: 'Open Am Shape',
        points: [
          { stringIndex: 0, fret: 0 },
          { stringIndex: 1, fret: 1, fingering: '1' },
          { stringIndex: 2, fret: 2, fingering: '3' },
          { stringIndex: 3, fret: 2, fingering: '2' },
          { stringIndex: 4, fret: 0, isRoot: true },
          { stringIndex: 5, fret: -1 },
        ]
      },
      {
        name: 'Open Em Shape',
        points: [
          { stringIndex: 0, fret: 0 },
          { stringIndex: 1, fret: 0 },
          { stringIndex: 2, fret: 0 },
          { stringIndex: 3, fret: 2, fingering: '3' },
          { stringIndex: 4, fret: 2, fingering: '2' },
          { stringIndex: 5, fret: 0, isRoot: true },
        ]
      },
      {
        name: 'Barre Em Shape',
        points: [
          { stringIndex: 0, fret: 1, fingering: '1' },
          { stringIndex: 1, fret: 1, fingering: '1' },
          { stringIndex: 2, fret: 1, fingering: '1' },
          { stringIndex: 3, fret: 3, fingering: '4' },
          { stringIndex: 4, fret: 3, fingering: '3' },
          { stringIndex: 5, fret: 1, fingering: '1', isRoot: true },
        ]
      },
      {
        name: 'Barre Am Shape',
        points: [
          { stringIndex: 0, fret: 3, fingering: '1' },
          { stringIndex: 1, fret: 4, fingering: '2' },
          { stringIndex: 2, fret: 5, fingering: '4' },
          { stringIndex: 3, fret: 5, fingering: '3' },
          { stringIndex: 4, fret: 3, fingering: '1', isRoot: true },
          { stringIndex: 5, fret: -1 },
        ]
      }
    ]
  },
  'dom7': {
    chordName: 'Dominant 7th',
    positions: [
      {
        name: 'Open A7 Shape',
        points: [
          { stringIndex: 0, fret: 3, fingering: '4' },
          { stringIndex: 1, fret: 2, fingering: '2' },
          { stringIndex: 2, fret: 0 },
          { stringIndex: 3, fret: 2, fingering: '1' },
          { stringIndex: 4, fret: 0, isRoot: true },
          { stringIndex: 5, fret: -1 },
        ]
      },
      {
        name: 'Open E7 Shape',
        points: [
          { stringIndex: 0, fret: 0 },
          { stringIndex: 1, fret: 3, fingering: '4' },
          { stringIndex: 2, fret: 1, fingering: '1' },
          { stringIndex: 3, fret: 0 },
          { stringIndex: 4, fret: 2, fingering: '2' },
          { stringIndex: 5, fret: 0, isRoot: true },
        ]
      },
      {
        name: 'Barre E7 Shape',
        points: [
          { stringIndex: 0, fret: 1, fingering: '1' },
          { stringIndex: 1, fret: 1, fingering: '1' },
          { stringIndex: 2, fret: 2, fingering: '2' },
          { stringIndex: 3, fret: 1, fingering: '1' },
          { stringIndex: 4, fret: 3, fingering: '3' },
          { stringIndex: 5, fret: 1, fingering: '1', isRoot: true },
        ]
      }
    ]
  }
};

/**
 * Transpose points of a relative voicing to a target absolute key fret offset.
 * e.g., transposing Am Barre chord at fret 5 to another key root.
 */
export function getAbsoluteVoicingPoints(
  voicing: ChordVoicing,
  positionIndex: number,
  rootNote: NoteName,
  tuning: Tuning
): { stringIndex: number; fret: number; fingering?: string; isRoot?: boolean }[] {
  const position = voicing.positions[positionIndex];
  if (!position) return [];

  // Find root point in the template voicing
  const relativeRootPoint = position.points.find(p => p.isRoot);
  if (!relativeRootPoint) return position.points;

  // Find index of absolute root note on guitar fretboard string of relative root
  const tunerOpenMidi = tuning.notes[relativeRootPoint.stringIndex];
  const targetRootIndex = getNoteIndex(rootNote);
  
  // Find closest fret starting from 0 on that string representing the note
  let fretOffset = 0;
  for (let f = relativeRootPoint.fret; f < relativeRootPoint.fret + 12; f++) {
    const pitch = tunerOpenMidi + relativeRootPoint.fret + fretOffset;
    if ((pitch % 12) === targetRootIndex) {
      break;
    }
    fretOffset++;
  }

  // Adjust all points relative to fretOffset
  // Safe limits to prevent overflow or negative fret values
  return position.points.map(p => {
    if (p.fret === -1) {
      return { ...p };
    }
    const relativeFret = p.fret - relativeRootPoint.fret;
    const finalFret = relativeRootPoint.fret + relativeFret + fretOffset;
    
    // Safely wrap notes that fall negative
    const boundedFret = finalFret < 0 ? finalFret + 12 : finalFret;

    return {
      ...p,
      fret: boundedFret
    };
  });
}
