export interface AmpKnob {
  id: string;
  label: string;
  value: number; // 0 to 10 or 0 to 100
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export interface AmpModel {
  id: string;
  name: string;
  brandImitation: string; // e.g., 'British Marshall Style', 'Caravan Fender Style', etc.
  tagline: string;
  genreFocus: string;
  theme: {
    bgClass: string;
    panelClass: string;
    borderClass: string;
    accentColor: string;
    textColor: string;
    knobColor: string;
    lightColor: string;
    tolexPattern: string;
  };
  defaultCabinet: string;
  availableCabinets: string[];
  knobs: AmpKnob[];
  switches: {
    id: string;
    label: string;
    options: string[];
    activeOptionIndex: number;
  }[];
}

export const AMP_MODELS: AmpModel[] = [
  {
    id: 'british-lead-100',
    name: 'British Lead 100',
    brandImitation: 'Marshall JCM / Plexi 100W',
    tagline: 'Iconic gold-faceplate British stack crunch & raw rock punch.',
    genreFocus: 'Hard Rock, Classic Rock, Heavy Blues',
    theme: {
      bgClass: 'bg-gradient-to-b from-amber-950/80 via-slate-950 to-slate-950',
      panelClass: 'bg-gradient-to-r from-amber-600/20 via-amber-500/30 to-amber-600/20',
      borderClass: 'border-amber-500/40',
      accentColor: 'text-amber-400',
      textColor: 'text-amber-100',
      knobColor: 'bg-amber-400 border-amber-600 text-slate-950',
      lightColor: 'bg-amber-500 shadow-amber-500/80 animate-pulse',
      tolexPattern: 'Black Grain Tolex with Gold Anodized Metal Panel',
    },
    defaultCabinet: '4x12 Vintage 1960 Greenbacks',
    availableCabinets: [
      '4x12 Vintage 1960 Greenbacks',
      '4x12 Creamback Heritage 75W',
      '2x12 Open-Back Celestion G12M',
      'Direct Studio Line (Cab Bypass)',
    ],
    knobs: [
      { id: 'gain', label: 'Pre-Amp Gain', value: 7.5, min: 0, max: 10, step: 0.1 },
      { id: 'bass', label: 'Bass', value: 6.0, min: 0, max: 10, step: 0.1 },
      { id: 'mid', label: 'Middle', value: 7.0, min: 0, max: 10, step: 0.1 },
      { id: 'treble', label: 'Treble', value: 6.5, min: 0, max: 10, step: 0.1 },
      { id: 'presence', label: 'Presence', value: 6.8, min: 0, max: 10, step: 0.1 },
      { id: 'master', label: 'Master Vol', value: 8.0, min: 0, max: 10, step: 0.1 },
    ],
    switches: [
      { id: 'sensitivity', label: 'Input Jack', options: ['Low Sens (-6dB)', 'High Sens (Lead)'], activeOptionIndex: 1 },
      { id: 'bright', label: 'Bright Cap', options: ['Normal', 'Bright Boost'], activeOptionIndex: 1 },
    ],
  },
  {
    id: 'caravan-twin-65',
    name: 'Caravan Twin Reverb',
    brandImitation: "Fender Twin Reverb '65",
    tagline: 'Crystalline sparkling clean, infinite headroom & dynamic glass.',
    genreFocus: 'Clean Jazz, Surf, Country, Indietronica',
    theme: {
      bgClass: 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950',
      panelClass: 'bg-gradient-to-r from-slate-300/20 via-slate-100/30 to-slate-300/20',
      borderClass: 'border-slate-400/40',
      accentColor: 'text-cyan-300',
      textColor: 'text-slate-100',
      knobColor: 'bg-slate-200 border-slate-400 text-slate-950',
      lightColor: 'bg-cyan-400 shadow-cyan-400/80 animate-pulse',
      tolexPattern: 'Blackface Silver SKIRT Faceplate with Red Jewel Bulb',
    },
    defaultCabinet: '2x12 Jensen C12K Twin',
    availableCabinets: [
      '2x12 Jensen C12K Twin',
      '1x12 Fender Special Design C12N',
      '4x10 Oxford Reverb Tweed Cab',
      'Direct Studio Line (Cab Bypass)',
    ],
    knobs: [
      { id: 'gain', label: 'Volume', value: 4.2, min: 0, max: 10, step: 0.1 },
      { id: 'bass', label: 'Bass', value: 6.5, min: 0, max: 10, step: 0.1 },
      { id: 'mid', label: 'Middle', value: 5.0, min: 0, max: 10, step: 0.1 },
      { id: 'treble', label: 'Treble', value: 7.8, min: 0, max: 10, step: 0.1 },
      { id: 'reverb', label: 'Spring Reverb', value: 4.0, min: 0, max: 10, step: 0.1 },
      { id: 'master', label: 'Master Vol', value: 7.5, min: 0, max: 10, step: 0.1 },
    ],
    switches: [
      { id: 'bright', label: 'Bright Switch', options: ['Off', 'On (+3dB Treble)'], activeOptionIndex: 1 },
      { id: 'vibrato', label: 'Channel', options: ['Normal', 'Vibrato & Reverb'], activeOptionIndex: 1 },
    ],
  },
  {
    id: 'american-dual-recto',
    name: 'American Dual Recto',
    brandImitation: 'Mesa Boogie Dual Rectifier 100W',
    tagline: 'Thunderous low-end chug, tight gain scoop & brutal high-gain metal.',
    genreFocus: 'Metalcore, Modern Metal, Thrash, Nu-Metal',
    theme: {
      bgClass: 'bg-gradient-to-b from-red-950/80 via-slate-950 to-slate-950',
      panelClass: 'bg-gradient-to-r from-slate-700/40 via-slate-500/50 to-slate-700/40',
      borderClass: 'border-red-500/50',
      accentColor: 'text-red-400',
      textColor: 'text-red-100',
      knobColor: 'bg-zinc-800 border-zinc-600 text-slate-100',
      lightColor: 'bg-red-600 shadow-red-600/80 animate-pulse',
      tolexPattern: 'Aluminum Diamond Treadplate & Black Steel Mesh',
    },
    defaultCabinet: '4x12 Recto Armor Celestion V30',
    availableCabinets: [
      '4x12 Recto Armor Celestion V30',
      '4x12 Oversized Metal Grill Cab',
      '2x12 Horizontal Recto V30',
      'Direct Studio Line (Cab Bypass)',
    ],
    knobs: [
      { id: 'gain', label: 'Gain', value: 8.5, min: 0, max: 10, step: 0.1 },
      { id: 'bass', label: 'Bass', value: 7.5, min: 0, max: 10, step: 0.1 },
      { id: 'mid', label: 'Middle', value: 3.5, min: 0, max: 10, step: 0.1 },
      { id: 'treble', label: 'Treble', value: 7.0, min: 0, max: 10, step: 0.1 },
      { id: 'presence', label: 'Presence', value: 7.5, min: 0, max: 10, step: 0.1 },
      { id: 'master', label: 'Master Vol', value: 8.2, min: 0, max: 10, step: 0.1 },
    ],
    switches: [
      { id: 'channel', label: 'Voicing Mode', options: ['Clean', 'Raw', 'Vintage', 'Modern (Red)'], activeOptionIndex: 3 },
      { id: 'rectifier', label: 'Rectification', options: ['Silicon Diode', 'Vacuum Tubes'], activeOptionIndex: 0 },
    ],
  },
  {
    id: 'citrus-rocker-50',
    name: 'Citrus Rocker 50',
    brandImitation: 'Orange Rockerverb 50W',
    tagline: 'Thick fuzzy tube overdrive, warm saturated midrange & vintage bloom.',
    genreFocus: 'Fuzz Rock, Doom Metal, Psychedelic, Indie Garage',
    theme: {
      bgClass: 'bg-gradient-to-b from-orange-950/80 via-slate-950 to-slate-950',
      panelClass: 'bg-gradient-to-r from-orange-600/30 via-orange-500/40 to-orange-600/30',
      borderClass: 'border-orange-500/50',
      accentColor: 'text-orange-400',
      textColor: 'text-orange-100',
      knobColor: 'bg-orange-500 border-orange-700 text-slate-950',
      lightColor: 'bg-orange-500 shadow-orange-500/80 animate-pulse',
      tolexPattern: 'Vibrant Orange Tolex & Cream Woven Basketweave Cloth',
    },
    defaultCabinet: '2x12 Citrus PPC212 Open Back',
    availableCabinets: [
      '2x12 Citrus PPC212 Open Back',
      '4x12 PPC412 Vintage 30s',
      '1x12 Citrus Compact Studio',
      'Direct Studio Line (Cab Bypass)',
    ],
    knobs: [
      { id: 'gain', label: 'Dirty Gain', value: 7.8, min: 0, max: 10, step: 0.1 },
      { id: 'bass', label: 'Bass', value: 6.8, min: 0, max: 10, step: 0.1 },
      { id: 'mid', label: 'Middle', value: 8.0, min: 0, max: 10, step: 0.1 },
      { id: 'treble', label: 'Treble', value: 5.5, min: 0, max: 10, step: 0.1 },
      { id: 'shape', label: 'Shape / Contour', value: 6.0, min: 0, max: 10, step: 0.1 },
      { id: 'master', label: 'Master Vol', value: 7.8, min: 0, max: 10, step: 0.1 },
    ],
    switches: [
      { id: 'power', label: 'Power Output', options: ['Half Power (25W)', 'Full Power (50W)'], activeOptionIndex: 1 },
      { id: 'channel', label: 'Channel', options: ['Natural Clean', 'Dirty Tube'], activeOptionIndex: 1 },
    ],
  },
  {
    id: 'class-a-chime-30',
    name: 'Class-A Chime 30',
    brandImitation: 'Vox AC30 Top Boost',
    tagline: 'Jangle top-boost chime, British invasion brilliance & Class-A breakup.',
    genreFocus: 'Jangle Pop, Britpop, Alternative, Indie Rock',
    theme: {
      bgClass: 'bg-gradient-to-b from-emerald-950/80 via-slate-950 to-slate-950',
      panelClass: 'bg-gradient-to-r from-emerald-600/20 via-emerald-500/30 to-emerald-600/20',
      borderClass: 'border-emerald-500/40',
      accentColor: 'text-emerald-300',
      textColor: 'text-emerald-100',
      knobColor: 'bg-zinc-900 border-emerald-500 text-emerald-300',
      lightColor: 'bg-emerald-400 shadow-emerald-400/80 animate-pulse',
      tolexPattern: 'Diamond Lattice Green/Gold Lattice Fret Cloth',
    },
    defaultCabinet: '2x12 Alnico Blue Bulldogs',
    availableCabinets: [
      '2x12 Alnico Blue Bulldogs',
      '2x12 Greenback AC30 Cab',
      '1x12 Silver Bell Class-A',
      'Direct Studio Line (Cab Bypass)',
    ],
    knobs: [
      { id: 'gain', label: 'Top Boost Vol', value: 6.2, min: 0, max: 10, step: 0.1 },
      { id: 'cut', label: 'Tone Cut', value: 4.5, min: 0, max: 10, step: 0.1 },
      { id: 'bass', label: 'Bass', value: 5.5, min: 0, max: 10, step: 0.1 },
      { id: 'treble', label: 'Treble', value: 7.5, min: 0, max: 10, step: 0.1 },
      { id: 'tremSpeed', label: 'Tremolo Speed', value: 3.0, min: 0, max: 10, step: 0.1 },
      { id: 'master', label: 'Master Vol', value: 8.0, min: 0, max: 10, step: 0.1 },
    ],
    switches: [
      { id: 'topboost', label: 'Circuit', options: ['Normal Channel', 'Top Boost Engaged'], activeOptionIndex: 1 },
      { id: 'brilliance', label: 'Brilliance Switch', options: ['Off', 'On'], activeOptionIndex: 1 },
    ],
  },
];
