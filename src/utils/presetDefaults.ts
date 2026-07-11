import { Preset, Effect } from '../types';

// Helper to create basic effects with correct default parameters
export function createDefaultEffect(type: string, enabled = true): Effect {
  const id = `${type}-${Math.random().toString(36).substr(2, 9)}`;

  switch (type) {
    case 'distortion':
      return {
        id,
        name: 'Distortion Pedal',
        type: 'distortion',
        enabled,
        dryWet: 100,
        parameters: [
          { name: 'Gain', value: 65, min: 0, max: 100, unit: '%' },
          { name: 'Tone', value: 50, min: 0, max: 100, unit: '%' },
        ],
      };
    case 'overdrive':
      return {
        id,
        name: 'Tube Overdrive',
        type: 'overdrive',
        enabled,
        dryWet: 100,
        parameters: [
          { name: 'Drive', value: 45, min: 0, max: 100, unit: '%' },
          { name: 'Tone', value: 60, min: 0, max: 100, unit: '%' },
        ],
      };
    case 'delay':
      return {
        id,
        name: 'Tape Delay',
        type: 'delay',
        enabled,
        dryWet: 35,
        parameters: [
          { name: 'Time', value: 380, min: 50, max: 1500, unit: 'ms' },
          { name: 'Feedback', value: 40, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 35, min: 0, max: 100, unit: '%' },
        ],
      };
    case 'reverb':
      return {
        id,
        name: 'Hall Reverb',
        type: 'reverb',
        enabled,
        dryWet: 40,
        parameters: [
          { name: 'Size', value: 75, min: 0, max: 100, unit: '%' },
          { name: 'Decay', value: 60, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 40, min: 0, max: 100, unit: '%' },
        ],
      };
    case 'chorus':
      return {
        id,
        name: 'Stereo Chorus',
        type: 'chorus',
        enabled,
        dryWet: 45,
        parameters: [
          { name: 'Rate', value: 35, min: 0, max: 100, unit: '%' },
          { name: 'Depth', value: 50, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 45, min: 0, max: 100, unit: '%' },
        ],
      };
    case 'flanger':
      return {
        id,
        name: 'Jet Flanger',
        type: 'flanger',
        enabled,
        dryWet: 50,
        parameters: [
          { name: 'Rate', value: 25, min: 0, max: 100, unit: '%' },
          { name: 'Depth', value: 55, min: 0, max: 100, unit: '%' },
          { name: 'Feedback', value: 40, min: 0, max: 100, unit: '%' },
        ],
      };
    case 'phaser':
      return {
        id,
        name: 'Phase 90',
        type: 'phaser',
        enabled,
        dryWet: 50,
        parameters: [
          { name: 'Rate', value: 30, min: 0, max: 100, unit: '%' },
        ],
      };
    case 'compressor':
      return {
        id,
        name: 'Sustain Comp',
        type: 'compressor',
        enabled,
        dryWet: 100,
        parameters: [
          { name: 'Threshold', value: 40, min: 0, max: 100, unit: 'dB' },
          { name: 'Ratio', value: 4, min: 1, max: 20, unit: ':1' },
          { name: 'Attack', value: 10, min: 1, max: 100, unit: 'ms' },
          { name: 'Release', value: 100, min: 10, max: 1000, unit: 'ms' },
        ],
      };
    case 'eq':
      return {
        id,
        name: 'Graphic EQ',
        type: 'eq',
        enabled,
        dryWet: 100,
        parameters: [
          { name: 'Low', value: 55, min: 0, max: 100, unit: '%' },
          { name: 'Mid', value: 45, min: 0, max: 100, unit: '%' },
          { name: 'High', value: 60, min: 0, max: 100, unit: '%' },
          { name: 'Presence', value: 50, min: 0, max: 100, unit: '%' },
        ],
      };
    case 'tremolo':
      return {
        id,
        name: 'Pulsar Tremolo',
        type: 'tremolo',
        enabled,
        dryWet: 100,
        parameters: [
          { name: 'Rate', value: 40, min: 0, max: 100, unit: '%' },
          { name: 'Depth', value: 60, min: 0, max: 100, unit: '%' },
        ],
      };
    case 'wah':
      return {
        id,
        name: 'Cry Baby Wah',
        type: 'wah',
        enabled,
        dryWet: 100,
        parameters: [
          { name: 'Position', value: 30, min: 0, max: 100, unit: '%' },
          { name: 'Range', value: 70, min: 0, max: 100, unit: '%' },
        ],
      };
    case 'octave':
      return {
        id,
        name: 'Octave Divider',
        type: 'octave',
        enabled,
        dryWet: 70,
        parameters: [
          { name: 'Octave Down', value: 50, min: 0, max: 100, unit: '%' },
        ],
      };
    default:
      throw new Error(`Unknown effect type: ${type}`);
  }
}

export const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'clean-ambient',
    name: 'Dreamy Ambient Space',
    description: 'Ultra-lush ambient sound with compressor, chorus, tape delay, and massive hall reverb.',
    category: 'Ambient',
    effects: [
      createDefaultEffect('compressor', true),
      {
        ...createDefaultEffect('chorus', true),
        parameters: [
          { name: 'Rate', value: 20, min: 0, max: 100, unit: '%' },
          { name: 'Depth', value: 60, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 50, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('delay', true),
        dryWet: 45,
        parameters: [
          { name: 'Time', value: 450, min: 50, max: 1500, unit: 'ms' },
          { name: 'Feedback', value: 55, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 40, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('reverb', true),
        dryWet: 65,
        parameters: [
          { name: 'Size', value: 90, min: 0, max: 100, unit: '%' },
          { name: 'Decay', value: 80, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 70, min: 0, max: 100, unit: '%' },
        ],
      },
    ],
  },
  {
    id: 'srv-blues',
    name: 'Texas Blues Crunch',
    description: 'Dynamic Overdrive, EQ scoop, and pulsing tremolo. Perfect for expressive blues licks.',
    category: 'Blues',
    effects: [
      {
        ...createDefaultEffect('overdrive', true),
        parameters: [
          { name: 'Drive', value: 55, min: 0, max: 100, unit: '%' },
          { name: 'Tone', value: 65, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('eq', true),
        parameters: [
          { name: 'Low', value: 60, min: 0, max: 100, unit: '%' },
          { name: 'Mid', value: 35, min: 0, max: 100, unit: '%' },
          { name: 'High', value: 65, min: 0, max: 100, unit: '%' },
          { name: 'Presence', value: 55, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('reverb', true),
        dryWet: 25,
        parameters: [
          { name: 'Size', value: 45, min: 0, max: 100, unit: '%' },
          { name: 'Decay', value: 40, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 30, min: 0, max: 100, unit: '%' },
        ],
      },
    ],
  },
  {
    id: 'heavy-metal',
    name: 'High-Gain Metallica',
    description: 'Thick scooped-mid distortion boosted by overdrive, with a graphic EQ to tighten low end.',
    category: 'Metal',
    effects: [
      {
        ...createDefaultEffect('overdrive', true),
        parameters: [
          { name: 'Drive', value: 25, min: 0, max: 100, unit: '%' },
          { name: 'Tone', value: 70, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('distortion', true),
        parameters: [
          { name: 'Gain', value: 80, min: 0, max: 100, unit: '%' },
          { name: 'Tone', value: 55, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('eq', true),
        parameters: [
          { name: 'Low', value: 75, min: 0, max: 100, unit: '%' },
          { name: 'Mid', value: 20, min: 0, max: 100, unit: '%' },
          { name: 'High', value: 70, min: 0, max: 100, unit: '%' },
          { name: 'Presence', value: 65, min: 0, max: 100, unit: '%' },
        ],
      },
    ],
  },
  {
    id: 'gilmour-lead',
    name: 'Comfortably Pink Lead',
    description: 'Singing lead sustain using compressor, high distortion, and tape delay. Iconic stadium tone.',
    category: 'Lead',
    effects: [
      createDefaultEffect('compressor', true),
      {
        ...createDefaultEffect('distortion', true),
        parameters: [
          { name: 'Gain', value: 75, min: 0, max: 100, unit: '%' },
          { name: 'Tone', value: 45, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('delay', true),
        dryWet: 35,
        parameters: [
          { name: 'Time', value: 440, min: 50, max: 1500, unit: 'ms' },
          { name: 'Feedback', value: 45, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 35, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('reverb', true),
        dryWet: 30,
        parameters: [
          { name: 'Size', value: 60, min: 0, max: 100, unit: '%' },
          { name: 'Decay', value: 50, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 35, min: 0, max: 100, unit: '%' },
        ],
      },
    ],
  },
  {
    id: 'clean-jazz',
    name: 'Liquid Jazz Triad',
    description: 'Clean acoustic-style tone with warm EQ, smooth compressor, and subtle chorus.',
    category: 'Jazz',
    effects: [
      {
        ...createDefaultEffect('compressor', true),
        parameters: [
          { name: 'Threshold', value: 25, min: 0, max: 100, unit: 'dB' },
          { name: 'Ratio', value: 3, min: 1, max: 20, unit: ':1' },
          { name: 'Attack', value: 15, min: 1, max: 100, unit: 'ms' },
          { name: 'Release', value: 150, min: 10, max: 1000, unit: 'ms' },
        ],
      },
      {
        ...createDefaultEffect('eq', true),
        parameters: [
          { name: 'Low', value: 65, min: 0, max: 100, unit: '%' },
          { name: 'Mid', value: 55, min: 0, max: 100, unit: '%' },
          { name: 'High', value: 40, min: 0, max: 100, unit: '%' },
          { name: 'Presence', value: 35, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('chorus', true),
        dryWet: 20,
        parameters: [
          { name: 'Rate', value: 15, min: 0, max: 100, unit: '%' },
          { name: 'Depth', value: 35, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 25, min: 0, max: 100, unit: '%' },
        ],
      },
    ],
  },
];
