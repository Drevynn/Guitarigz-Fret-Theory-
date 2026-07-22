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
    id: 'blues-overdrive',
    name: 'Blues Overdrive',
    description: 'Classic Texas tube distortion with mid-range hump, warm optical compressor, and organic spring reverb.',
    category: 'Blues',
    favorite: true,
    effects: [
      {
        ...createDefaultEffect('compressor', true),
        parameters: [
          { name: 'Threshold', value: 30, min: 0, max: 100, unit: 'dB' },
          { name: 'Ratio', value: 3.5, min: 1, max: 20, unit: ':1' },
          { name: 'Attack', value: 20, min: 1, max: 100, unit: 'ms' },
          { name: 'Release', value: 120, min: 10, max: 1000, unit: 'ms' },
        ],
      },
      {
        ...createDefaultEffect('overdrive', true),
        parameters: [
          { name: 'Drive', value: 58, min: 0, max: 100, unit: '%' },
          { name: 'Tone', value: 62, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('eq', true),
        parameters: [
          { name: 'Low', value: 55, min: 0, max: 100, unit: '%' },
          { name: 'Mid', value: 68, min: 0, max: 100, unit: '%' },
          { name: 'High', value: 58, min: 0, max: 100, unit: '%' },
          { name: 'Presence', value: 52, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('reverb', true),
        dryWet: 30,
        parameters: [
          { name: 'Size', value: 45, min: 0, max: 100, unit: '%' },
          { name: 'Decay', value: 38, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 30, min: 0, max: 100, unit: '%' },
        ],
      },
    ],
  },
  {
    id: 'clean-jazz',
    name: 'Clean Jazz Warmth',
    description: 'Ultra-smooth archtop jazz tone with subtle compression, warm rolled-off EQ, and transparent chorus.',
    category: 'Jazz',
    favorite: true,
    effects: [
      {
        ...createDefaultEffect('compressor', true),
        parameters: [
          { name: 'Threshold', value: 22, min: 0, max: 100, unit: 'dB' },
          { name: 'Ratio', value: 2.8, min: 1, max: 20, unit: ':1' },
          { name: 'Attack', value: 25, min: 1, max: 100, unit: 'ms' },
          { name: 'Release', value: 180, min: 10, max: 1000, unit: 'ms' },
        ],
      },
      {
        ...createDefaultEffect('eq', true),
        parameters: [
          { name: 'Low', value: 68, min: 0, max: 100, unit: '%' },
          { name: 'Mid', value: 58, min: 0, max: 100, unit: '%' },
          { name: 'High', value: 38, min: 0, max: 100, unit: '%' },
          { name: 'Presence', value: 30, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('chorus', true),
        dryWet: 18,
        parameters: [
          { name: 'Rate', value: 18, min: 0, max: 100, unit: '%' },
          { name: 'Depth', value: 30, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 20, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('reverb', true),
        dryWet: 25,
        parameters: [
          { name: 'Size', value: 50, min: 0, max: 100, unit: '%' },
          { name: 'Decay', value: 45, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 25, min: 0, max: 100, unit: '%' },
        ],
      },
    ],
  },
  {
    id: 'clean-ambient',
    name: 'Dreamy Ambient Space',
    description: 'Lush atmospheric pad with compressor, shimmering chorus, long tape delay, and deep hall reverb.',
    category: 'Ambient',
    favorite: true,
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
          { name: 'Time', value: 480, min: 50, max: 1500, unit: 'ms' },
          { name: 'Feedback', value: 60, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 45, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('reverb', true),
        dryWet: 70,
        parameters: [
          { name: 'Size', value: 92, min: 0, max: 100, unit: '%' },
          { name: 'Decay', value: 85, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 75, min: 0, max: 100, unit: '%' },
        ],
      },
    ],
  },
  {
    id: 'heavy-metal',
    name: 'Thrash Metal Chug',
    description: 'Scooped high-gain distortion with overdrive boost and graphic EQ to eliminate low-end mud.',
    category: 'Metal',
    effects: [
      {
        ...createDefaultEffect('overdrive', true),
        parameters: [
          { name: 'Drive', value: 22, min: 0, max: 100, unit: '%' },
          { name: 'Tone', value: 75, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('distortion', true),
        parameters: [
          { name: 'Gain', value: 82, min: 0, max: 100, unit: '%' },
          { name: 'Tone', value: 52, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('eq', true),
        parameters: [
          { name: 'Low', value: 75, min: 0, max: 100, unit: '%' },
          { name: 'Mid', value: 22, min: 0, max: 100, unit: '%' },
          { name: 'High', value: 72, min: 0, max: 100, unit: '%' },
          { name: 'Presence', value: 68, min: 0, max: 100, unit: '%' },
        ],
      },
    ],
  },
  {
    id: 'funk-groove',
    name: '70s Funk Envelope Wah',
    description: 'Snappy rhythmic wah envelope filter, punchy optical compression, and fluttering tremolo.',
    category: 'Crunch',
    effects: [
      {
        ...createDefaultEffect('compressor', true),
        parameters: [
          { name: 'Threshold', value: 45, min: 0, max: 100, unit: 'dB' },
          { name: 'Ratio', value: 5, min: 1, max: 20, unit: ':1' },
          { name: 'Attack', value: 5, min: 1, max: 100, unit: 'ms' },
          { name: 'Release', value: 80, min: 10, max: 1000, unit: 'ms' },
        ],
      },
      {
        ...createDefaultEffect('wah', true),
        parameters: [
          { name: 'Position', value: 55, min: 0, max: 100, unit: '%' },
          { name: 'Range', value: 85, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('tremolo', true),
        dryWet: 40,
        parameters: [
          { name: 'Rate', value: 55, min: 0, max: 100, unit: '%' },
          { name: 'Depth', value: 45, min: 0, max: 100, unit: '%' },
        ],
      },
    ],
  },
  {
    id: 'acoustic-sparkle',
    name: 'Acoustic Folk Sparkle',
    description: 'Bright piezo acoustic simulation with gentle studio compression, high-frequency EQ boost, and subtle room reverb.',
    category: 'Acoustic',
    effects: [
      {
        ...createDefaultEffect('compressor', true),
        parameters: [
          { name: 'Threshold', value: 28, min: 0, max: 100, unit: 'dB' },
          { name: 'Ratio', value: 2.5, min: 1, max: 20, unit: ':1' },
          { name: 'Attack', value: 12, min: 1, max: 100, unit: 'ms' },
          { name: 'Release', value: 140, min: 10, max: 1000, unit: 'ms' },
        ],
      },
      {
        ...createDefaultEffect('eq', true),
        parameters: [
          { name: 'Low', value: 45, min: 0, max: 100, unit: '%' },
          { name: 'Mid', value: 48, min: 0, max: 100, unit: '%' },
          { name: 'High', value: 75, min: 0, max: 100, unit: '%' },
          { name: 'Presence', value: 68, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('chorus', true),
        dryWet: 15,
        parameters: [
          { name: 'Rate', value: 12, min: 0, max: 100, unit: '%' },
          { name: 'Depth', value: 25, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 15, min: 0, max: 100, unit: '%' },
        ],
      },
      {
        ...createDefaultEffect('reverb', true),
        dryWet: 30,
        parameters: [
          { name: 'Size', value: 40, min: 0, max: 100, unit: '%' },
          { name: 'Decay', value: 35, min: 0, max: 100, unit: '%' },
          { name: 'Mix', value: 30, min: 0, max: 100, unit: '%' },
        ],
      },
    ],
  },
  {
    id: 'gilmour-lead',
    name: 'Comfortably Stadium Lead',
    description: 'Singing lead sustain using compressor, high distortion, and tape delay. Iconic stadium solo tone.',
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
];
