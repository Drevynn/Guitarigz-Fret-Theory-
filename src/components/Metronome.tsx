/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Sparkles, Volume2, Music, Drum, RotateCcw, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { playKick, playSnare, playHiHat, playClap, playTom, initAudio } from '../utils/audio';

type Mode = 'drum_machine' | 'metronome';

interface DrumPattern {
  id: string;
  name: string;
  genre: string;
  bpm: number;
  kick: boolean[];
  snare: boolean[];
  hihat: boolean[];
  clap: boolean[];
  tom: boolean[];
}

const LYRIA_DRUM_PATTERNS: DrumPattern[] = [
  {
    id: 'rock_8_beat',
    name: 'Standard Rock 8-Beat',
    genre: 'Rock / Pop',
    bpm: 116,
    kick:  [true,  false, false, false, true,  false, false, false, true,  false, false, false, true,  false, false, false],
    snare: [false, false, false, false, true,  false, false, false, false, false, false, false, true,  false, false, false],
    hihat: [true,  false, true,  false, true,  false, true,  false, true,  false, true,  false, true,  false, true,  false],
    clap:  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    tom:   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  },
  {
    id: 'funk_shuffle',
    name: 'Funk Shuffle & Ghost Snares',
    genre: 'Funk / R&B',
    bpm: 98,
    kick:  [true,  false, false, true,  false, false, true,  false, true,  false, false, true,  false, false, true,  false],
    snare: [false, false, false, false, true,  false, false, true,  false, false, true,  false, true,  false, false, false],
    hihat: [true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true],
    clap:  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    tom:   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  },
  {
    id: 'hiphop_boombap',
    name: 'Hip-Hop Boom Bap',
    genre: 'Hip-Hop / Lo-Fi',
    bpm: 90,
    kick:  [true,  false, false, false, false, false, true,  false, false, false, true,  false, false, false, false, false],
    snare: [false, false, false, false, true,  false, false, false, false, false, false, false, true,  false, false, false],
    hihat: [true,  false, true,  true,  true,  false, true,  false, true,  false, true,  true,  true,  false, true,  false],
    clap:  [false, false, false, false, true,  false, false, false, false, false, false, false, true,  false, false, false],
    tom:   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  },
  {
    id: 'pop_four_floor',
    name: 'Pop 4-on-the-Floor',
    genre: 'Pop / Dance',
    bpm: 124,
    kick:  [true,  false, false, false, true,  false, false, false, true,  false, false, false, true,  false, false, false],
    snare: [false, false, false, false, true,  false, false, false, false, false, false, false, true,  false, false, false],
    hihat: [false, false, true,  false, false, false, true,  false, false, false, true,  false, false, false, true,  false],
    clap:  [false, false, false, false, true,  false, false, false, false, false, false, false, true,  false, false, false],
    tom:   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
  },
  {
    id: 'reggae_onedrop',
    name: 'Reggae One-Drop',
    genre: 'Reggae / Dub',
    bpm: 82,
    kick:  [false, false, false, false, false, false, false, false, true,  false, false, false, false, false, false, false],
    snare: [false, false, false, false, false, false, false, false, true,  false, false, false, false, false, false, false],
    hihat: [true,  false, true,  false, true,  false, true,  false, true,  false, true,  false, true,  false, true,  false],
    clap:  [false, false, false, false, false, false, false, false, true,  false, false, false, false, false, false, false],
    tom:   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, true,  false],
  }
];

export default function Metronome() {
  const [mode, setMode] = useState<Mode>('drum_machine');
  const [bpm, setBpm] = useState(116);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activePatternId, setActivePatternId] = useState<string>(LYRIA_DRUM_PATTERNS[0].id);

  // Drum Machine Pattern States (16 steps each)
  const [kickPattern, setKickPattern] = useState<boolean[]>(LYRIA_DRUM_PATTERNS[0].kick);
  const [snarePattern, setSnarePattern] = useState<boolean[]>(LYRIA_DRUM_PATTERNS[0].snare);
  const [hihatPattern, setHihatPattern] = useState<boolean[]>(LYRIA_DRUM_PATTERNS[0].hihat);
  const [clapPattern, setClapPattern] = useState<boolean[]>(LYRIA_DRUM_PATTERNS[0].clap);
  const [tomPattern, setTomPattern] = useState<boolean[]>(LYRIA_DRUM_PATTERNS[0].tom);

  // Metronome Mode State
  const [subdivision, setSubdivision] = useState(1); // 1 = 4ths, 2 = 8ths, 4 = 16ths

  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  // Load a Lyria Preset
  const handleSelectPattern = (patternId: string) => {
    const pat = LYRIA_DRUM_PATTERNS.find(p => p.id === patternId);
    if (!pat) return;
    setActivePatternId(patternId);
    setBpm(pat.bpm);
    setKickPattern([...pat.kick]);
    setSnarePattern([...pat.snare]);
    setHihatPattern([...pat.hihat]);
    setClapPattern([...pat.clap]);
    setTomPattern([...pat.tom]);
  };

  // Toggle step
  const toggleStep = (track: 'kick' | 'snare' | 'hihat' | 'clap' | 'tom', stepIdx: number) => {
    if (track === 'kick') {
      const copy = [...kickPattern];
      copy[stepIdx] = !copy[stepIdx];
      setKickPattern(copy);
      if (copy[stepIdx]) playKick(0, 0.9);
    } else if (track === 'snare') {
      const copy = [...snarePattern];
      copy[stepIdx] = !copy[stepIdx];
      setSnarePattern(copy);
      if (copy[stepIdx]) playSnare(0, 0.8);
    } else if (track === 'hihat') {
      const copy = [...hihatPattern];
      copy[stepIdx] = !copy[stepIdx];
      setHihatPattern(copy);
      if (copy[stepIdx]) playHiHat(0, true, 0.6);
    } else if (track === 'clap') {
      const copy = [...clapPattern];
      copy[stepIdx] = !copy[stepIdx];
      setClapPattern(copy);
      if (copy[stepIdx]) playClap(0, 0.7);
    } else if (track === 'tom') {
      const copy = [...tomPattern];
      copy[stepIdx] = !copy[stepIdx];
      setTomPattern(copy);
      if (copy[stepIdx]) playTom(0, 'mid', 0.8);
    }
  };

  // Step Sequencer Playback Loop
  useEffect(() => {
    if (isPlaying) {
      initAudio();

      // 16th note duration in ms
      const intervalMs = (60 / bpm / 4) * 1000;

      const runStep = () => {
        const step = stepRef.current;
        setCurrentStep(step);

        if (mode === 'drum_machine') {
          // Play active drum sounds for this step
          if (kickPattern[step]) playKick(0, 0.95);
          if (snarePattern[step]) playSnare(0, 0.85);
          if (hihatPattern[step]) playHiHat(0, step % 4 !== 2, 0.6); // Open hi-hat on offbeats
          if (clapPattern[step]) playClap(0, 0.75);
          if (tomPattern[step]) playTom(0, step < 8 ? 'mid' : 'low', 0.8);
        } else {
          // Classic Metronome Mode with distinct click pitches
          const isQuarterBeat = step % 4 === 0;
          const isDownbeatOne = step === 0;

          if (isDownbeatOne) {
            // Downbeat 1: High crisp woodblock accent (1200Hz)
            playTom(0, 'high', 0.9);
          } else if (isQuarterBeat) {
            // Beat 2, 3, 4: Mid woodblock (800Hz)
            playTom(0, 'mid', 0.6);
          } else if (subdivision > 1) {
            // Subdivisions
            playHiHat(0, true, 0.3);
          }
        }

        stepRef.current = (stepRef.current + 1) % 16;
      };

      // Initial immediate trigger
      runStep();

      timerRef.current = setInterval(runStep, intervalMs) as unknown as number;
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      stepRef.current = 0;
      setCurrentStep(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, bpm, mode, kickPattern, snarePattern, hihatPattern, clapPattern, tomPattern, subdivision]);

  return (
    <div className="bg-slate-950/60 border border-slate-850 rounded-3xl p-6 backdrop-blur-md shadow-2xl flex flex-col gap-6 text-left">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-2">
            <Drum className="text-amber-400" size={20} />
            <h3 className="font-display font-black text-lg text-slate-100 uppercase tracking-wider">
              Lyria AI Drum Machine & Metronome
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time synthesized WebAudio drum voices with distinct kick sub-thumps, snare wire snaps & hi-hat sizzle.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('drum_machine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'drum_machine' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={14} />
            <span>Lyria Drum Beat</span>
          </button>
          <button
            onClick={() => setMode('metronome')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'metronome' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Music size={14} />
            <span>Classic Metronome</span>
          </button>
        </div>
      </div>

      {/* BPM Tempo Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setBpm(b => Math.max(40, b - 5))}
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-lg flex items-center justify-center transition-all"
          >
            -5
          </button>
          <button 
            onClick={() => setBpm(b => Math.max(40, b - 1))}
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-base flex items-center justify-center transition-all"
          >
            -1
          </button>
          
          <div className="flex flex-col items-center px-4">
            <span className="font-mono text-4xl font-black text-amber-400 tracking-tight">{bpm}</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">BEATS PER MINUTE</span>
          </div>

          <button 
            onClick={() => setBpm(b => Math.min(260, b + 1))}
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-base flex items-center justify-center transition-all"
          >
            +1
          </button>
          <button 
            onClick={() => setBpm(b => Math.min(260, b + 5))}
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-lg flex items-center justify-center transition-all"
          >
            +5
          </button>
        </div>

        {/* Play/Stop Master Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-8 py-3.5 rounded-2xl font-display font-black text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
            isPlaying ? 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-rose-500/20' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
          }`}
        >
          {isPlaying ? <Square size={18} className="fill-slate-950" /> : <Play size={18} className="fill-slate-950" />}
          <span>{isPlaying ? 'STOP LOOP' : 'START DRUM LOOP'}</span>
        </button>
      </div>

      {mode === 'drum_machine' ? (
        <div className="flex flex-col gap-5">
          {/* Lyria Preset Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" />
              <span>Lyria AI Genre Drum Grooves:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {LYRIA_DRUM_PATTERNS.map((pat) => (
                <button
                  key={pat.id}
                  onClick={() => handleSelectPattern(pat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    activePatternId === pat.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {pat.name}
                </button>
              ))}
            </div>
          </div>

          {/* 16-Step Sequencer Grid */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 overflow-x-auto flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span>DRUM VOICE</span>
              <span className="text-amber-400/90 font-bold">16-STEP GRID PATTERN (CLICK PADS TO TOGGLE)</span>
            </div>

            {/* Kick Track */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => playKick(0, 0.95)}
                className="w-24 shrink-0 px-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-bold font-mono text-left flex items-center justify-between"
                title="Click to test Kick Drum"
              >
                <span>🔴 Kick</span>
                <Volume2 size={12} />
              </button>
              <div className="flex gap-1.5 flex-1 min-w-[360px]">
                {kickPattern.map((active, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleStep('kick', idx)}
                    className={`flex-1 h-9 rounded-md transition-all border ${
                      active
                        ? isPlaying && currentStep === idx
                          ? 'bg-red-400 border-white ring-2 ring-red-400 shadow-lg scale-105'
                          : 'bg-red-500/80 border-red-400 shadow-md'
                        : isPlaying && currentStep === idx
                          ? 'bg-slate-700 border-amber-400'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Snare Track */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => playSnare(0, 0.85)}
                className="w-24 shrink-0 px-2 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs font-bold font-mono text-left flex items-center justify-between"
                title="Click to test Snare Drum"
              >
                <span>🔵 Snare</span>
                <Volume2 size={12} />
              </button>
              <div className="flex gap-1.5 flex-1 min-w-[360px]">
                {snarePattern.map((active, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleStep('snare', idx)}
                    className={`flex-1 h-9 rounded-md transition-all border ${
                      active
                        ? isPlaying && currentStep === idx
                          ? 'bg-cyan-300 border-white ring-2 ring-cyan-400 shadow-lg scale-105'
                          : 'bg-cyan-500/80 border-cyan-400 shadow-md'
                        : isPlaying && currentStep === idx
                          ? 'bg-slate-700 border-amber-400'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Hi-Hat Track */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => playHiHat(0, true, 0.6)}
                className="w-24 shrink-0 px-2 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-bold font-mono text-left flex items-center justify-between"
                title="Click to test Hi-Hat"
              >
                <span>🟡 Hi-Hat</span>
                <Volume2 size={12} />
              </button>
              <div className="flex gap-1.5 flex-1 min-w-[360px]">
                {hihatPattern.map((active, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleStep('hihat', idx)}
                    className={`flex-1 h-9 rounded-md transition-all border ${
                      active
                        ? isPlaying && currentStep === idx
                          ? 'bg-amber-300 border-white ring-2 ring-amber-400 shadow-lg scale-105'
                          : 'bg-amber-500/80 border-amber-400 shadow-md'
                        : isPlaying && currentStep === idx
                          ? 'bg-slate-700 border-amber-400'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Clap Track */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => playClap(0, 0.75)}
                className="w-24 shrink-0 px-2 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-xs font-bold font-mono text-left flex items-center justify-between"
                title="Click to test Handclap"
              >
                <span>🟣 Clap</span>
                <Volume2 size={12} />
              </button>
              <div className="flex gap-1.5 flex-1 min-w-[360px]">
                {clapPattern.map((active, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleStep('clap', idx)}
                    className={`flex-1 h-9 rounded-md transition-all border ${
                      active
                        ? isPlaying && currentStep === idx
                          ? 'bg-purple-300 border-white ring-2 ring-purple-400 shadow-lg scale-105'
                          : 'bg-purple-500/80 border-purple-400 shadow-md'
                        : isPlaying && currentStep === idx
                          ? 'bg-slate-700 border-amber-400'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Tom Track */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => playTom(0, 'mid', 0.8)}
                className="w-24 shrink-0 px-2 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold font-mono text-left flex items-center justify-between"
                title="Click to test Tom Drum"
              >
                <span>🟢 Tom</span>
                <Volume2 size={12} />
              </button>
              <div className="flex gap-1.5 flex-1 min-w-[360px]">
                {tomPattern.map((active, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleStep('tom', idx)}
                    className={`flex-1 h-9 rounded-md transition-all border ${
                      active
                        ? isPlaying && currentStep === idx
                          ? 'bg-emerald-300 border-white ring-2 ring-emerald-400 shadow-lg scale-105'
                          : 'bg-emerald-500/80 border-emerald-400 shadow-md'
                        : isPlaying && currentStep === idx
                          ? 'bg-slate-700 border-amber-400'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Classic Metronome View */
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Subdivisions:</span>
            {[1, 2, 4].map((sub) => (
              <button
                key={sub}
                onClick={() => setSubdivision(sub)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                  subdivision === sub
                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sub === 1 ? 'Quarter Notes (1/4)' : sub === 2 ? 'Eighth Notes (1/8)' : 'Sixteenths (1/16)'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4 w-full max-w-md">
            {[0, 1, 2, 3].map((beatIdx) => {
              const isActiveBeat = isPlaying && Math.floor(currentStep / 4) === beatIdx;
              return (
                <div
                  key={beatIdx}
                  className={`h-20 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    isActiveBeat
                      ? beatIdx === 0
                        ? 'bg-amber-500 border-amber-300 text-slate-950 scale-105 shadow-xl shadow-amber-500/30'
                        : 'bg-emerald-500 border-emerald-300 text-slate-950 scale-105 shadow-xl shadow-emerald-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="font-mono text-2xl font-black">{beatIdx + 1}</span>
                  <span className="text-[9px] font-mono font-bold uppercase">
                    {beatIdx === 0 ? 'ACCENT 1' : 'BEAT'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
