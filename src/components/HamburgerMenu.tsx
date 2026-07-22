import React, { useState } from 'react';
import {
  Menu,
  X,
  Sparkles,
  GitBranch,
  Compass,
  Layers,
  GraduationCap,
  Mic,
  Link,
  Volume2,
  VolumeX,
  Sliders,
  LogOut,
  User,
  Music,
  ShoppingBag,
  Zap,
  Globe,
  Palette,
  ShieldCheck
} from 'lucide-react';
import { NoteName, ScaleType } from '../types';

interface HamburgerMenuProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
  themeId: string;
  setThemeId: (themeId: string) => void;
  themes: Array<{ id: string; name: string; dotBackground: string }>;
  instrument: 'guitar' | 'bass-4' | 'bass-5';
  onChangeInstrument: (inst: 'guitar' | 'bass-4' | 'bass-5') => void;
  muted: boolean;
  onToggleMute: () => void;
  activeRoot: NoteName;
  activeScale: ScaleType;
  onSelectKey: (root: NoteName, scale: ScaleType) => void;
}

export default function HamburgerMenu({
  activeTab,
  setActiveTab,
  user,
  onLogout,
  themeId,
  setThemeId,
  themes,
  instrument,
  onChangeInstrument,
  muted,
  onToggleMute,
  activeRoot,
  activeScale,
  onSelectKey,
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const baseNavItems = [
    { id: 'fretboard', label: 'Fretboard Visualizer', icon: Sparkles, desc: 'Interactive scale & chord map' },
    { id: 'studio', label: 'AI Studio Rack FX', icon: Zap, desc: 'Tube amps, pedalboard & AI Roadie' },
    { id: 'progressions', label: 'Progression Loops', icon: GitBranch, desc: 'Chord progressions & audio synth' },
    { id: 'fifths', label: 'Circle of Fifths', icon: Compass, desc: 'Key harmony & modulation wheel' },
    { id: 'caged', label: 'CAGED Voicings', icon: Layers, desc: 'Position shapes & triad maps' },
    { id: 'quiz', label: 'Fretboard Trainer', icon: GraduationCap, desc: 'Interactive note identification quiz' },
    { id: 'transcribe', label: 'Audio Transcriber', icon: Mic, desc: 'Microphone tab & chord detector' },
    { id: 'plugin', label: 'DAW Plugin Bridge', icon: Link, desc: 'VST / Web MIDI sync bridge' },
    { id: 'store', label: 'Store & Upgrades', icon: ShoppingBag, desc: 'Guitarigz Pro & bass addons' },
  ];

  const navItems = user?.email === 'admin@guitarigz.xyz'
    ? [{ id: 'admin', label: 'Admin Operations', icon: ShieldCheck, desc: 'guitarigz.xyz admin console' }, ...baseNavItems]
    : baseNavItems;

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      {/* Minimalist Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-750 hover:border-amber-500 rounded-2xl text-slate-100 flex items-center justify-center cursor-pointer transition-all shadow-md group"
        aria-label="Toggle navigation menu"
        title="Open App Navigation Menu"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-amber-400 animate-spinOnce" />
        ) : (
          <div className="flex flex-col gap-1 w-5 h-5 items-center justify-center">
            <span className="w-4 h-0.5 bg-amber-400 rounded-full group-hover:w-5 transition-all" />
            <span className="w-5 h-0.5 bg-slate-200 rounded-full" />
            <span className="w-3 h-0.5 bg-amber-400 rounded-full group-hover:w-5 transition-all" />
          </div>
        )}
      </button>

      {/* Slide-over Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Hamburger Slide-Out Drawer Panel */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-slate-950/95 border-l border-amber-500/30 text-slate-100 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto backdrop-blur-md animate-slideLeft">
          
          {/* Header Inside Drawer */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-500 text-slate-950 rounded-xl">
                  <Sparkles size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-sm tracking-tight text-amber-400 uppercase">
                    Guitarigz.xyz
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">
                    Music Suite Navigation
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-400 hover:text-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Navigation Tabs List */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-2 mb-1">
                Workspace Sections
              </span>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left p-2.5 rounded-2xl transition-all flex items-center gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-400 font-bold shadow-sm'
                        : 'hover:bg-slate-900 border border-transparent text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">{item.label}</span>
                      <span className="text-[9px] text-slate-400 line-clamp-1">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Instrument & Audio Controls */}
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-850">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-2">
                Instrument & Audio
              </span>

              <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1 border border-slate-800 rounded-xl">
                <button
                  onClick={() => onChangeInstrument('guitar')}
                  className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                    instrument === 'guitar' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Guitar
                </button>
                <button
                  onClick={() => onChangeInstrument('bass-4')}
                  className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                    instrument === 'bass-4' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Bass (4-Str)
                </button>
                <button
                  onClick={() => onChangeInstrument('bass-5')}
                  className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                    instrument === 'bass-5' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Bass (5-Str)
                </button>
              </div>

              <button
                onClick={onToggleMute}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  {muted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-amber-400" />}
                  <span>Audio Engine</span>
                </span>
                <span className={`text-[10px] font-mono font-bold ${muted ? 'text-red-400' : 'text-amber-400'}`}>
                  {muted ? 'MUTED' : 'ACTIVE'}
                </span>
              </button>
            </div>

            {/* Quick Theme Selector in Drawer */}
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-850">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-2 flex items-center gap-1">
                <Palette size={12} className="text-amber-500" />
                <span>Theme Aesthetics</span>
              </span>

              <div className="grid grid-cols-2 gap-1.5">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setThemeId(t.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                      themeId === t.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ background: t.dotBackground }} />
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Account Footer inside Drawer */}
          <div className="pt-4 border-t border-slate-850 flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-xs font-bold">
                {user?.name.charAt(0).toUpperCase() || 'G'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-100">{user?.name}</span>
                <span className="text-[9px] font-mono text-slate-500 truncate max-w-[130px]">{user?.email}</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 rounded-xl cursor-pointer transition-colors"
              title="Log out"
            >
              <LogOut size={14} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
