/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { NoteName, ScaleType, ChordType, Tuning } from './types';
import Fretboard from './components/Fretboard';
import CircleOfFifths from './components/CircleOfFifths';
import Progressions from './components/Progressions';
import ChordBuilder from './components/ChordBuilder';
import TheoryQuiz from './components/TheoryQuiz';
import LandingPage from './components/LandingPage';
import GuitarigzStudio from './components/GuitarigzStudio';
import UpgradeScreen from './components/UpgradeScreen';
import AdBanner from './components/AdBanner';
import CustomTuningEditor from './components/CustomTuningEditor';
import PluginBridge from './components/PluginBridge';
import HelpGuide from './components/HelpGuide';
import Metronome from './components/Metronome';
import { STANDARD_TUNINGS, BASS_4_TUNINGS, BASS_5_TUNINGS, SCALE_FORMULAS, CHROMATIC_NOTES_SHARP, keyPrefersFlats } from './utils/theory';
import { initAudio, toggleAudioMute, isAudioMuted, playNote } from './utils/audio';
import {
  Volume2,
  VolumeX,
  Compass,
  GitBranch,
  Layers,
  GraduationCap,
  Sparkles,
  RotateCcw,
  BookOpen,
  Info,
  LogOut,
  Link,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const THEMES = [
  {
    id: 'amber',
    name: 'Classic Amber',
    dotBackground: 'linear-gradient(135deg, #f59e0b, #d97706)',
    primaryBg: 'bg-slate-950',
    secondaryBg: 'bg-slate-900',
    panelBg: 'bg-slate-900/60',
    border: 'border-slate-800',
    borderButton: 'border-slate-800',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    accentText: 'text-amber-500',
    accentTextDark: 'text-amber-600',
    accentBg: 'bg-amber-500',
    accentHoverBg: 'bg-amber-600',
    logoGradient: 'bg-gradient-to-r from-amber-400 to-amber-600',
    titleGradient: 'bg-gradient-to-r from-slate-100 via-amber-100 to-amber-400',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-450',
    glowCircles: ['bg-amber-500/5', 'bg-emerald-500/5'],
    highlightClass: 'text-amber-500',
    tabActive: 'border-amber-500 text-slate-50',
    tabIcon: 'text-amber-500',
    btnActive: 'bg-[linear-gradient(135deg,#f59e0b,#d97706)] text-slate-950 font-black shadow-lg shadow-amber-950/20'
  },
  {
    id: 'emerald',
    name: 'Theory & Flow',
    dotBackground: 'linear-gradient(135deg, #10b981, #059669)',
    primaryBg: 'bg-zinc-950',
    secondaryBg: 'bg-zinc-900',
    panelBg: 'bg-zinc-900/60',
    border: 'border-zinc-800',
    borderButton: 'border-zinc-800',
    textPrimary: 'text-zinc-100',
    textSecondary: 'text-zinc-400',
    accentText: 'text-emerald-500',
    accentTextDark: 'text-emerald-600',
    accentBg: 'bg-emerald-500',
    accentHoverBg: 'bg-emerald-600',
    logoGradient: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
    titleGradient: 'bg-gradient-to-r from-zinc-100 via-emerald-100 to-emerald-400',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    glowCircles: ['bg-emerald-500/5', 'bg-indigo-500/5'],
    highlightClass: 'text-emerald-500',
    tabActive: 'border-emerald-500 text-zinc-50',
    tabIcon: 'text-emerald-500',
    btnActive: 'bg-[linear-gradient(135deg,#10b981,#059669)] text-slate-950 font-black shadow-lg shadow-emerald-950/20'
  },
  {
    id: 'vintage',
    name: 'Vintage Tweed',
    dotBackground: 'linear-gradient(135deg, #d97706, #78350f)',
    primaryBg: 'bg-stone-900',
    secondaryBg: 'bg-stone-950',
    panelBg: 'bg-stone-950/60',
    border: 'border-stone-800/80',
    borderButton: 'border-stone-800/80',
    textPrimary: 'text-stone-100',
    textSecondary: 'text-stone-400',
    accentText: 'text-amber-500',
    accentTextDark: 'text-amber-600',
    accentBg: 'bg-amber-600',
    accentHoverBg: 'bg-amber-700',
    logoGradient: 'bg-gradient-to-r from-amber-500 to-amber-700',
    titleGradient: 'bg-gradient-to-r from-stone-100 via-amber-100 to-amber-500',
    badgeBg: 'bg-amber-600/15',
    badgeText: 'text-amber-450',
    glowCircles: ['bg-amber-600/5', 'bg-yellow-600/5'],
    highlightClass: 'text-amber-500',
    tabActive: 'border-amber-600 text-stone-100',
    tabIcon: 'text-amber-600',
    btnActive: 'bg-[linear-gradient(135deg,#d97706,#78350f)] text-slate-950 font-black shadow-lg shadow-amber-950/20'
  },
  {
    id: 'crimson',
    name: 'Prismatic Cyber',
    dotBackground: 'linear-gradient(135deg, #f43f5e, #e11d48)',
    primaryBg: 'bg-neutral-950',
    secondaryBg: 'bg-neutral-900',
    panelBg: 'bg-neutral-900/60',
    border: 'border-neutral-800',
    borderButton: 'border-neutral-800',
    textPrimary: 'text-neutral-100',
    textSecondary: 'text-neutral-450',
    accentText: 'text-rose-500',
    accentTextDark: 'text-rose-600',
    accentBg: 'bg-rose-500',
    accentHoverBg: 'bg-rose-600',
    logoGradient: 'bg-gradient-to-r from-rose-500 to-rose-600',
    titleGradient: 'bg-gradient-to-r from-neutral-100 via-rose-100 to-rose-400',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-450',
    glowCircles: ['bg-rose-500/5', 'bg-cyan-500/5'],
    highlightClass: 'text-rose-500',
    tabActive: 'border-rose-500 text-neutral-50',
    tabIcon: 'text-rose-500',
    btnActive: 'bg-[linear-gradient(135deg,#f43f5e,#e11d48)] text-slate-950 font-black shadow-lg shadow-rose-950/20'
  },
  {
    id: 'onyx',
    name: 'Obsidian Onyx',
    dotBackground: 'linear-gradient(135deg, #4b5563, #1f2937)',
    primaryBg: 'bg-slate-950',
    secondaryBg: 'bg-slate-900',
    panelBg: 'bg-slate-900/60',
    border: 'border-slate-800',
    borderButton: 'border-slate-800',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-455',
    accentText: 'text-slate-300',
    accentTextDark: 'text-slate-400',
    accentBg: 'bg-slate-700',
    accentHoverBg: 'bg-slate-600',
    logoGradient: 'bg-gradient-to-r from-slate-400 to-slate-600',
    titleGradient: 'bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400',
    badgeBg: 'bg-slate-800/40',
    badgeText: 'text-slate-300',
    glowCircles: ['bg-slate-700/5', 'bg-slate-500/5'],
    highlightClass: 'text-slate-300',
    tabActive: 'border-slate-400 text-slate-100',
    tabIcon: 'text-slate-400',
    btnActive: 'bg-[linear-gradient(135deg,#4b5563,#1f2937)] text-slate-950 font-black shadow-lg shadow-slate-950/20'
  }
];

export default function App() {
  // Theme state
  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem('guitarigz_theme') || 'amber';
  });

  useEffect(() => {
    localStorage.setItem('guitarigz_theme', themeId);
  }, [themeId]);

  // Authentication & session state
  const [user, setUser] = useState<{ email: string; name: string } | null>(() => {
    const cached = localStorage.getItem('guitar_theory_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const handleStartSession = (email: string, name: string) => {
    const newUser = { email, name };
    localStorage.setItem('guitar_theory_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('guitar_theory_user');
    setUser(null);
  };

  // Pricing & Subscription tier state: free Fret & Theory extension vs Guitarigz Fret & Theory combined upsell
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem('guitarigz_premium') === 'true';
  });

  const handleUpgradeComplete = () => {
    localStorage.setItem('guitarigz_premium', 'true');
    setIsPremium(true);
  };

  const handleDowngradeReset = () => {
    localStorage.setItem('guitarigz_premium', 'false');
    setIsPremium(false);
    if (activeTab === 'studio') {
      setActiveTab('progressions');
    }
  };

  // 1. Shared state coordinates
  const [activeRoot, setActiveRoot] = useState<NoteName>('C');
  const [activeScale, setActiveScale] = useState<ScaleType>('major');
  
  // Accidental preference (Flats vs Sharps)
  const [useFlats, setUseFlats] = useState<boolean>(false);
  
  // Audio state
  const [muted, setMuted] = useState<boolean>(false);

  // Fretboard layout preferences
  const [instrument, setInstrument] = useState<'guitar' | 'bass-4' | 'bass-5'>('guitar');
  const [activeTuningId, setActiveTuningId] = useState<string>('standard');
  const [customTuningNotes, setCustomTuningNotes] = useState<number[]>([64, 59, 55, 50, 45, 40]);
  const [maxFrets, setMaxFrets] = useState<number>(15);
  const [leftHanded, setLeftHanded] = useState<boolean>(false);
  const [fretboardDisplayMode, setFretboardDisplayMode] = useState<'notes' | 'intervals'>('notes');

  // Interactive Overlays
  const [activeChordRoot, setActiveChordRoot] = useState<NoteName | null>(null);
  const [activeChordType, setActiveChordType] = useState<ChordType | null>(null);
  const [activeVoicingPoints, setActiveVoicingPoints] = useState<
    { stringIndex: number; fret: number; fingering?: string; isRoot?: boolean }[] | null
  >(null);

  // Active dashboard view tab
  const [activeTab, setActiveTab] = useState<'progressions' | 'fifths' | 'caged' | 'quiz' | 'studio' | 'plugin' | 'guide' | 'metronome'>('progressions');

  // External active MIDI/DAW note tracking
  const [externalActiveNotes, setExternalActiveNotes] = useState<number[]>([]);

  const handleExternalNoteOn = (midi: number) => {
    setExternalActiveNotes(prev => prev.includes(midi) ? prev : [...prev, midi]);
  };

  const handleExternalNoteOff = (midi: number) => {
    setExternalActiveNotes(prev => prev.filter(n => n !== midi));
  };

  // Instrument switcher
  const handleInstrumentChange = (newInst: 'guitar' | 'bass-4' | 'bass-5') => {
    setInstrument(newInst);
    setActiveVoicingPoints(null); // Clear voicings
    
    let defaultTuningId = 'standard';
    let defaultNotes = [64, 59, 55, 50, 45, 40];
    
    if (newInst === 'bass-4') {
      defaultTuningId = 'bass_standard';
      defaultNotes = [43, 38, 33, 28];
    } else if (newInst === 'bass-5') {
      defaultTuningId = 'bass_5_standard';
      defaultNotes = [43, 38, 33, 28, 23];
    }
    
    setActiveTuningId(defaultTuningId);
    setCustomTuningNotes(defaultNotes);
  };

  const getTuningsList = () => {
    if (instrument === 'bass-4') return BASS_4_TUNINGS;
    if (instrument === 'bass-5') return BASS_5_TUNINGS;
    return STANDARD_TUNINGS;
  };
  const activeTuningsList = getTuningsList();

  // Sync sharp/flat setting to root selection preference natively
  useEffect(() => {
    setUseFlats(keyPrefersFlats(activeRoot));
  }, [activeRoot]);

  if (!user) {
    return <LandingPage onStartSession={handleStartSession} />;
  }

  // Handle tuning id lookup
  const activeTuning = activeTuningId === 'custom'
    ? { id: 'custom', name: 'Custom Tuning', notes: customTuningNotes }
    : (activeTuningsList.find(t => t.id === activeTuningId) || activeTuningsList[0]);

  const handleSelectKey = (root: NoteName, scaleType: ScaleType) => {
    setActiveRoot(root);
    setActiveScale(scaleType);
    
    // Clear custom chord filters or CAGED overlays when root key changes
    setActiveChordRoot(null);
    setActiveChordType(null);
    setActiveVoicingPoints(null);
  };

  const handleFilterChord = (chordRoot: NoteName | null, chordType: ChordType | null) => {
    setActiveChordRoot(chordRoot);
    setActiveChordType(chordType);
    if (chordRoot) {
      // Clear chord builder overlay to avoid visual conflicts
      setActiveVoicingPoints(null);
    }
  };

  const handleAudioInit = () => {
    initAudio();
    const isMutedNow = toggleAudioMute();
    setMuted(isMutedNow);
  };

  const resetAllFilters = () => {
    setActiveRoot('C');
    setActiveScale('major');
    setActiveChordRoot(null);
    setActiveChordType(null);
    setActiveVoicingPoints(null);
  };

  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];

  return (
    <div className={`min-h-screen ${theme.secondaryBg} ${theme.textPrimary} flex flex-col relative overflow-x-hidden font-sans transition-colors duration-300`}>
      {/* Immersive ambient glowing circles in outer container */}
      <div className={`absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full ${theme.glowCircles[0]} blur-[120px] pointer-events-none z-0 animate-ambient`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full ${theme.glowCircles[1]} blur-[120px] pointer-events-none z-0 animate-ambient`} />

      {/* 1. Header Toolbar Banner */}
      <header className={`border-b ${theme.border} ${theme.primaryBg}/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 shadow-sm transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo element */}
          <div className="flex items-center gap-3">
            <div className={`p-2 ${theme.logoGradient} rounded-2xl text-slate-950 shadow-md border border-white/10`}>
              <Sparkles size={20} className="fill-slate-950" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1 className={`font-display font-black text-lg tracking-tight uppercase bg-gradient-to-r ${theme.titleGradient} bg-clip-text text-transparent`}>
                  Guitarigz: Fret & Theory
                </h1>
                
                 {isPremium ? (
                  <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 ${theme.badgeBg} border ${theme.border} rounded-full ${theme.badgeText} text-[9px] font-bold font-mono tracking-wider uppercase`}>
                    {instrument.startsWith('bass') ? 'Bass Edition' : 'Combined Pro'}
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-slate-400 text-[9px] font-bold font-mono tracking-wider uppercase">
                    Free Extension
                  </span>
                )}
              </div>
              <p className="text-[10px] font-mono tracking-widest text-slate-450 uppercase mt-0.5">
                {instrument.startsWith('bass') ? 'Guitarigz Bass & Groove Suite' : 'Guitarigz Music Suite • Unlimited'}
              </p>
            </div>
          </div>

          {/* Key selector and Tuning configurations */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center md:justify-end">
            
            {/* Real-time Visual Theme Selector */}
            <div className={`flex items-center gap-1.5 p-1 bg-slate-900/40 border ${theme.border} rounded-xl shadow-inner`}>
              <span className="text-[10px] font-mono px-2 text-slate-400">Theme:</span>
              <div className="flex items-center gap-1.5 px-1">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setThemeId(t.id)}
                    className={`w-4.5 h-4.5 rounded-full border transition-all duration-200 hover:scale-110 flex items-center justify-center relative group ${
                      themeId === t.id ? 'ring-2 ring-slate-100 border-transparent scale-105 shadow-md' : 'border-slate-700'
                    }`}
                    style={{ background: t.dotBackground }}
                    title={t.name}
                  >
                    {/* Tooltip */}
                    <span className="absolute bottom-[-32px] left-1/2 transform -translate-x-1/2 bg-slate-950 text-slate-100 text-[9px] font-mono py-0.5 px-1.5 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap border border-slate-800">
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* User profile segment */}
            <div className={`flex items-center gap-2 bg-slate-900/40 border ${theme.border} rounded-xl px-2.5 py-1 shadow-inner`}>
              <span className={`w-5 h-5 rounded-lg ${theme.badgeBg} border ${theme.border} ${theme.accentText} flex items-center justify-center text-[10px]`}>
                {instrument.startsWith('bass') ? '🎻' : '🎸'}
              </span>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                  {instrument.startsWith('bass') ? 'Bassist' : 'Guitarist'}
                </span>
                <span className="text-xs font-bold text-slate-200 leading-tight">{user?.name}</span>
              </div>
              <button
                id="btn-logout"
                onClick={handleLogout}
                className="ml-1 p-1 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                title="Sign out of theory workspace"
              >
                <LogOut size={12} />
              </button>
            </div>

            {/* Quick Master Root Selector */}
            <div className={`flex items-center gap-1.5 p-1 bg-slate-900/40 border ${theme.border} rounded-xl`}>
              <span className="text-[10px] font-mono px-2 text-slate-400">Root:</span>
              <select
                id="select-master-root"
                value={activeRoot}
                onChange={(e) => handleSelectKey(e.target.value as NoteName, activeScale)}
                className={`bg-slate-950 border ${theme.border} ${theme.accentText} font-bold px-2.5 py-1 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer`}
              >
                {CHROMATIC_NOTES_SHARP.map((note) => (
                  <option key={note} value={note}>{note}</option>
                ))}
              </select>
            </div>

            {/* Quick Scale Selector */}
            <div className={`flex items-center gap-1.5 p-1 bg-slate-900/40 border ${theme.border} rounded-xl`}>
              <span className="text-[10px] font-mono px-2 text-slate-400">Scale:</span>
              <select
                id="select-master-scale"
                value={activeScale}
                onChange={(e) => handleSelectKey(activeRoot, e.target.value as ScaleType)}
                className={`bg-slate-950 border ${theme.border} ${theme.textPrimary} font-medium px-2.5 py-1 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer`}
              >
                {Object.entries(SCALE_FORMULAS).map(([key, formula]) => (
                  <option key={key} value={key}>{formula.name}</option>
                ))}
              </select>
            </div>

            {/* Audio volume toggling button */}
            <button
              id="btn-master-mute"
              onClick={handleAudioInit}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center shadow-sm ${
                muted
                  ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/15'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-350 hover:text-slate-200'
              }`}
              title={muted ? 'Unmute guitar sounds' : 'Mute guitar sounds'}
            >
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            {/* Reset all overlays utility */}
            <button
              id="btn-master-reset"
              onClick={resetAllFilters}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-250 transition-all flex items-center justify-center shadow-sm"
              title="Reset scale overlays and views"
            >
              <RotateCcw size={14} />
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Content Board Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 z-10 flex flex-col gap-6">

        {/* Dynamic educational notice */}
        <div className={`bg-slate-950/20 rounded-2xl p-4 border ${theme.border} flex items-start gap-3`}>
          <BookOpen className={`${theme.accentText} mt-0.5 shrink-0`} size={16} />
          <div>
            <span className="text-xs font-bold text-slate-200">Interactive Studio: </span>
            <span className="text-xs text-slate-400 font-sans leading-relaxed">
              Explore the fretboard of <span className="font-bold text-slate-200">{activeRoot} {SCALE_FORMULAS[activeScale].name}</span>. Tuning is configured to <span className={`font-bold ${theme.accentText}`}>{activeTuning.name}</span>. Try clicking strings to hear pitch tones, or click lower modules to overlay complex CAGED voicings or scale progressions dynamically.
            </span>
          </div>
        </div>

        {/* Instrument Selector Segmented Control */}
        <div className={`flex flex-col sm:flex-row items-center justify-between bg-slate-950/40 border ${theme.border}/60 p-4 rounded-2xl gap-4`}>
          <div className="flex flex-col text-left">
            <h4 className={`text-xs font-mono font-bold ${theme.accentText} uppercase tracking-wider`}>
              Core Instrument Target
            </h4>
            <p className="text-[11px] text-slate-450 mt-0.5">
              Switch fretboard configurations between standard guitar layouts and multi-string bass modules.
            </p>
          </div>

          <div className={`flex bg-slate-900/60 p-1 border ${theme.border}/80 rounded-xl items-center shadow-inner`}>
            <button
              onClick={() => handleInstrumentChange('guitar')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                instrument === 'guitar'
                  ? theme.btnActive
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <span>🎸 Guitar (6-Str)</span>
            </button>
            <button
              onClick={() => handleInstrumentChange('bass-4')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                instrument === 'bass-4'
                  ? theme.btnActive
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <span>🎻 Bass (4-Str)</span>
            </button>
            <button
              onClick={() => handleInstrumentChange('bass-5')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                instrument === 'bass-5'
                  ? theme.btnActive
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <span>🎻 Bass (5-Str)</span>
            </button>
          </div>
        </div>

        {/* Fretboard Settings Bar */}
        <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Tuning Preset */}
            <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-850 px-2.5 py-1.5 rounded-xl text-xs text-slate-350 shadow-inner">
              <span className="font-mono text-[10px] text-slate-500">Tuner:</span>
              <select
                id="select-tuning-presets"
                value={activeTuningId}
                onChange={(e) => {
                  const val = e.target.value;
                  setActiveTuningId(val);
                  setActiveVoicingPoints(null); // Clear voicings as tunings shift
                  if (val !== 'custom') {
                    const preset = activeTuningsList.find(t => t.id === val);
                    if (preset) {
                      setCustomTuningNotes(preset.notes);
                    }
                  }
                }}
                className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer pr-1 font-semibold"
              >
                {activeTuningsList.map(t => (
                  <option key={t.id} value={t.id}>{t.name.split(' (')[0]}</option>
                ))}
                <option value="custom">Custom Tuning ⚙️</option>
              </select>
            </div>

            {/* Display Modes (Notes / Intervals toggle) */}
            <div className="flex bg-slate-900/60 p-1 border border-slate-850 rounded-xl items-center shadow-inner">
              <button
                id="btn-display-notes"
                onClick={() => setFretboardDisplayMode('notes')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  fretboardDisplayMode === 'notes'
                    ? 'bg-slate-800 text-slate-100 shadow'
                    : 'text-slate-450 hover:text-slate-200'
                }`}
              >
                Note Names
              </button>
              <button
                id="btn-display-intervals"
                onClick={() => setFretboardDisplayMode('intervals')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  fretboardDisplayMode === 'intervals'
                    ? 'bg-slate-800 text-slate-100 shadow'
                    : 'text-slate-450 hover:text-slate-200'
                }`}
              >
                Scale Intervals
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Left Handed toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
              <input
                id="checkbox-lefty"
                type="checkbox"
                checked={leftHanded}
                onChange={(e) => setLeftHanded(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-1 focus:ring-amber-500 focus:ring-offset-slate-900 cursor-pointer"
              />
              <span className="text-slate-350 font-semibold">Left-Handed Orientation</span>
            </label>

            {/* Fret count selector */}
            <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-850 px-2.5 py-1.5 rounded-xl text-xs text-slate-350 shadow-inner">
              <span className="font-mono text-[10px] text-slate-500">Frets:</span>
              <select
                id="select-max-frets"
                value={maxFrets}
                onChange={(e) => setMaxFrets(parseInt(e.target.value))}
                className="bg-transparent border-none text-slate-250 focus:outline-none cursor-pointer pr-1 font-bold"
              >
                <option value={12}>12 Frets (Octave)</option>
                <option value={15}>15 Frets (Classic)</option>
                <option value={21}>21 Frets (Standard)</option>
                <option value={24}>24 Frets (Soloist)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Custom Tuning Editor */}
        {activeTuningId === 'custom' && (
          <CustomTuningEditor
            customNotes={customTuningNotes}
            onChangeNotes={setCustomTuningNotes}
            useFlats={useFlats}
            instrument={instrument}
          />
        )}

        {/* 3. The Grand Fretboard Board */}
        <section className="relative z-10 w-full" id="fretboard-main-section">
          <Fretboard
            activeRoot={activeRoot}
            activeScale={activeScale}
            chordRoot={activeChordRoot}
            chordType={activeChordType}
            activeTuning={activeTuning}
            maxFrets={maxFrets}
            leftHanded={leftHanded}
            displayMode={fretboardDisplayMode}
            useFlats={useFlats}
            onPlayNode={(midi) => {
              playNote(midi, 0, 1.0);
              if (window.parent !== window) {
                window.parent.postMessage({
                  source: 'guitarigz-plugin',
                  type: 'PLUGIN_NOTE_PLAYED',
                  midi: midi,
                  timestamp: Date.now()
                }, '*');
              }
            }}
            voicingPoints={activeVoicingPoints}
            externalActiveNotes={externalActiveNotes}
            activeThemeId={themeId}
          />
        </section>

        {/* 4. Sub-Visualizers Navigation Tabs Slider */}
        <section className="flex flex-col gap-4 mt-2">
          {/* Tabs header bar */}
          <div className={`flex border-b ${theme.border} items-end justify-between overflow-x-auto pb-0.5 scrollbar-thin scrollbar-track-transparent`}>
            <div className="flex gap-2 min-w-[450px]">
              {/* Tab: Progressions */}
              <button
                id="tab-progressions"
                onClick={() => {
                  setActiveTab('progressions');
                  setActiveVoicingPoints(null); // release chord builder locks
                }}
                className={`py-3.5 px-4 font-display font-bold text-xs tracking-wide uppercase border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'progressions'
                    ? theme.tabActive
                    : `border-transparent ${theme.textSecondary} hover:text-slate-200 hover:border-slate-800`
                }`}
              >
                <GitBranch size={14} className={activeTab === 'progressions' ? theme.tabIcon : 'text-slate-500'} />
                Progression Loops
              </button>

              {/* Tab: Circle of Fifths */}
              <button
                id="tab-fifths"
                onClick={() => {
                  setActiveTab('fifths');
                  setActiveVoicingPoints(null); // release chord builder locks
                }}
                className={`py-3.5 px-4 font-display font-bold text-xs tracking-wide uppercase border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'fifths'
                    ? theme.tabActive
                    : `border-transparent ${theme.textSecondary} hover:text-slate-200 hover:border-slate-800`
                }`}
              >
                <Compass size={14} className={activeTab === 'fifths' ? theme.tabIcon : 'text-slate-500'} />
                Circle of Fifths
              </button>

              {/* Tab: CAGED Shapes */}
              <button
                id="tab-caged"
                onClick={() => {
                  setActiveTab('caged');
                  handleFilterChord(null, null); // remove progressions filter
                }}
                className={`py-3.5 px-4 font-display font-bold text-xs tracking-wide uppercase border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'caged'
                    ? theme.tabActive
                    : `border-transparent ${theme.textSecondary} hover:text-slate-200 hover:border-slate-800`
                }`}
              >
                <Layers size={14} className={activeTab === 'caged' ? theme.tabIcon : 'text-slate-500'} />
                CAGED Voicings
              </button>

              {/* Tab: Theory Quiz */}
              <button
                id="tab-quiz"
                onClick={() => {
                  setActiveTab('quiz');
                  setActiveVoicingPoints(null); // release chord builder locks
                }}
                className={`py-3.5 px-4 font-display font-bold text-xs tracking-wide uppercase border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'quiz'
                    ? theme.tabActive
                    : `border-transparent ${theme.textSecondary} hover:text-slate-200 hover:border-slate-800`
                }`}
              >
                <GraduationCap size={14} className={activeTab === 'quiz' ? theme.tabIcon : 'text-slate-500'} />
                Fretboard Trainer
              </button>

              {/* Tab: AI Rack Studio */}
              <button
                id="tab-studio"
                onClick={() => {
                  setActiveTab('studio');
                  setActiveVoicingPoints(null); // release chord builder locks
                }}
                className={`py-3.5 px-4 font-display font-bold text-xs tracking-wide uppercase border-b-2 transition-all flex items-center gap-2 relative ${
                  activeTab === 'studio'
                    ? theme.tabActive
                    : `border-transparent ${theme.textSecondary} hover:text-slate-200 hover:border-slate-800`
                }`}
              >
                <Sparkles size={14} className={activeTab === 'studio' ? theme.tabIcon : 'text-slate-500'} />
                <span>AI Rack Studio</span>
                {!isPremium && (
                  <span className={`text-[8px] font-mono font-black ${theme.badgeText} ${theme.badgeBg} px-1 rounded-sm border ${theme.border}`}>
                    PRO 🔒
                  </span>
                )}
              </button>

              {/* Tab: DAW Plugin Link */}
              <button
                id="tab-plugin-bridge"
                onClick={() => {
                  setActiveTab('plugin');
                  setActiveVoicingPoints(null); // release chord builder locks
                }}
                className={`py-3.5 px-4 font-display font-bold text-xs tracking-wide uppercase border-b-2 transition-all flex items-center gap-2 relative ${
                  activeTab === 'plugin'
                    ? theme.tabActive
                    : `border-transparent ${theme.textSecondary} hover:text-slate-200 hover:border-slate-800`
                }`}
              >
                <Link size={14} className={activeTab === 'plugin' ? theme.tabIcon : 'text-slate-500'} />
                <span>🔌 DAW Plugin Link</span>
              </button>

              {/* Tab: Help & Guide */}
              <button
                id="tab-help-guide"
                onClick={() => {
                  setActiveTab('guide');
                  setActiveVoicingPoints(null); // release chord builder locks
                }}
                className={`py-3.5 px-4 font-display font-bold text-xs tracking-wide uppercase border-b-2 transition-all flex items-center gap-2 relative ${
                  activeTab === 'guide'
                    ? theme.tabActive
                    : `border-transparent ${theme.textSecondary} hover:text-slate-200 hover:border-slate-800`
                }`}
              >
                <BookOpen size={14} className={activeTab === 'guide' ? theme.tabIcon : 'text-slate-500'} />
                <span>📖 Help & Guide</span>
              </button>

              {/* Tab: Metronome */}
              <button
                id="tab-metronome"
                onClick={() => {
                  setActiveTab('metronome');
                  setActiveVoicingPoints(null); // release chord builder locks
                }}
                className={`py-3.5 px-4 font-display font-bold text-xs tracking-wide uppercase border-b-2 transition-all flex items-center gap-2 relative ${
                  activeTab === 'metronome'
                    ? theme.tabActive
                    : `border-transparent ${theme.textSecondary} hover:text-slate-200 hover:border-slate-800`
                }`}
              >
                <Settings size={14} className={activeTab === 'metronome' ? theme.tabIcon : 'text-slate-500'} />
                <span>⏱ Metronome</span>
              </button>
            </div>
            
            {/* status feedback text */}
            <div className={`hidden sm:inline-block pb-3 pr-2 text-[10px] font-mono ${theme.textSecondary} select-none`}>
              Active Key: <span className={`font-bold ${theme.accentText}`}>{activeRoot} {SCALE_FORMULAS[activeScale].name}</span>
            </div>
          </div>

          {/* Active Tab rendering layout panel */}
          <div className="relative mt-2" id="tab-content-portal">
            <AnimatePresence mode="wait">
              {activeTab === 'progressions' && (
                <motion.div
                  key="progressions-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Progressions
                    activeKey={activeRoot}
                    activeScale={activeScale}
                    useFlats={useFlats}
                    onFilterChord={handleFilterChord}
                    selectedChordRoot={activeChordRoot}
                    selectedChordType={activeChordType}
                  />
                </motion.div>
              )}

              {activeTab === 'fifths' && (
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
                  <motion.div
                    key="fifths-wheel"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                  >
                    <CircleOfFifths
                      activeRoot={activeRoot}
                      activeScale={activeScale}
                      onSelectKey={handleSelectKey}
                    />
                  </motion.div>
                  
                  {/* Circle explanation panel */}
                  <div className="bg-slate-950/40 p-6 rounded-3xl border border-slate-850 flex flex-col gap-4 self-stretch justify-between shadow-xl">
                    <div className="flex items-center gap-2 pb-3 border-b border-slate-850">
                      <Info size={16} className="text-amber-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350">
                        The Circle of Fifths Theory Lesson
                      </h4>
                    </div>
                    
                    <div className="text-xs text-slate-400 leading-relaxed font-sans flex flex-col gap-3">
                      <p>
                        The <strong>Circle of Fifths</strong> is a spatial diagram organizing the 12 chromatic pitches according to perfect fifth intervals (7 semitones). Following the ring <em>clockwise</em> moves up by a perfect fifth (e.g. C to G), and moving <em>counter-clockwise</em> goes down by fifths (or up by perfect fourths).
                      </p>
                      <p>
                        <strong>Harmonic Distance:</strong> Slices adjacent to each other on the wheel share almost identical notes. For example, G major possesses only a single sharp (F#), differing from C major (0 sharps) by just a single note. This proximity makes adjacencies ideal destinations for smooth musical key modulations.
                      </p>
                      <p>
                        <strong>Relative Key Relationship:</strong> Every Major key possesses a Relative Minor key nested directly in the inner ring (which begins on the 6th degree of the major scale). They share the identical key signature (overlapping sharps/flats spelling group).
                      </p>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-850 text-xs font-mono text-slate-450 mt-4 leading-normal">
                      <div className="text-amber-450 font-bold mb-1">Interactive Experiment:</div>
                      Select different adjacent major slices (e.g. C major, then G major, then D major) in sequence and look at the fretboard at the top. Notice how the visual notes move subtly by just one node shift at a time!
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'caged' && (
                <motion.div
                  key="caged-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChordBuilder
                    activeRoot={activeRoot}
                    activeTuning={activeTuning}
                    onSelectVoicingPoints={setActiveVoicingPoints}
                    activeVoicingPoints={activeVoicingPoints}
                  />
                </motion.div>
              )}

              {activeTab === 'quiz' && (
                <motion.div
                  key="quiz-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TheoryQuiz
                    activeKey={activeRoot}
                    activeScale={activeScale}
                    activeTuning={activeTuning}
                    useFlats={useFlats}
                  />
                </motion.div>
              )}

              {activeTab === 'studio' && (
                <motion.div
                  key="studio-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {isPremium ? (
                    <GuitarigzStudio />
                  ) : (
                    <UpgradeScreen 
                      onUpgradeComplete={handleUpgradeComplete} 
                      userName={user?.name} 
                    />
                  )}
                </motion.div>
              )}

              {activeTab === 'plugin' && (
                <motion.div
                  key="plugin-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <PluginBridge
                    instrument={instrument}
                    handleInstrumentChange={handleInstrumentChange}
                    activeRoot={activeRoot}
                    activeScale={activeScale}
                    handleSelectKey={handleSelectKey}
                    activeTuning={activeTuning}
                    setActiveTuningId={setActiveTuningId}
                    setCustomTuningNotes={setCustomTuningNotes}
                    muted={muted}
                    setMuted={setMuted}
                    onExternalNoteOn={handleExternalNoteOn}
                    onExternalNoteOff={handleExternalNoteOff}
                    externalActiveNotes={externalActiveNotes}
                  />
                </motion.div>
              )}

              {activeTab === 'guide' && (
                <motion.div
                  key="guide-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <HelpGuide
                    isPremium={isPremium}
                    onUpgradeClick={() => setActiveTab('studio')}
                  />
                </motion.div>
              )}

              {activeTab === 'metronome' && (
                <motion.div
                  key="metronome-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Metronome />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ad Banner for free extension tier users */}
          {!isPremium && activeTab !== 'studio' && activeTab !== 'plugin' && activeTab !== 'guide' && activeTab !== 'metronome' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <AdBanner onUpgradeClick={() => setActiveTab('studio')} />
            </motion.div>
          )}
        </section>

      </main>

      {/* 5. Footer panel */}
      <footer className="border-t border-slate-850 bg-slate-950/80 backdrop-blur-md px-6 py-6 text-center text-xs text-slate-500 mt-12 z-10 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>Guitarigz Fret & Theory Studio © {new Date().getFullYear()}</span>
            <span className="hidden sm:inline text-slate-800">•</span>
            {isPremium ? (
              <button 
                onClick={handleDowngradeReset}
                className="text-[10px] text-amber-500/80 hover:text-amber-400 font-mono underline cursor-pointer"
                title="Reset simulation to Free ad-supported mode"
              >
                Reset to Free Extension Mode
              </button>
            ) : (
              <button 
                onClick={handleUpgradeComplete}
                className="text-[10px] text-amber-500/80 hover:text-amber-400 font-mono underline cursor-pointer"
                title="Force activate Premium combined suite"
              >
                Simulate Premium Upgrade
              </button>
            )}
          </div>
          <span className="flex items-center gap-1">
            Build clean, secure Web Audio synthesis systems • Handcrafted in Google AI Studio
          </span>
        </div>
      </footer>
    </div>
  );
}
