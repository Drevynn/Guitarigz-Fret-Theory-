/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export default function Metronome() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [subdivision, setSubdivision] = useState(1); // 1 = quarter, 2 = eighths, 4 = sixteenths
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const timerIDRef = useRef<number | null>(null);

  const scheduleNote = (time: number) => {
    const osc = audioContextRef.current!.createOscillator();
    const gainNode = audioContextRef.current!.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioContextRef.current!.destination);

    osc.frequency.value = 880;
    gainNode.gain.value = 0.5;
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    osc.start(time);
    osc.stop(time + 0.1);
  };

  const scheduler = useCallback(() => {
    while (nextNoteTimeRef.current < audioContextRef.current!.currentTime + 0.1) {
      scheduleNote(nextNoteTimeRef.current);
      const secondsPerBeat = 60.0 / bpm / subdivision;
      nextNoteTimeRef.current += secondsPerBeat;
    }
    timerIDRef.current = setTimeout(scheduler, 25) as unknown as number;
  }, [bpm, subdivision]);

  useEffect(() => {
    if (isPlaying) {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      nextNoteTimeRef.current = audioContextRef.current.currentTime;
      scheduler();
    } else {
      if (timerIDRef.current) {
        clearTimeout(timerIDRef.current);
      }
    }

    return () => {
      if (timerIDRef.current) {
        clearTimeout(timerIDRef.current);
      }
    };
  }, [isPlaying, scheduler]);

  return (
    <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col items-center gap-6">
      <h3 className="font-display font-black text-lg text-slate-100 uppercase tracking-wider">
        Metronome
      </h3>

      <div className="flex items-center gap-4 text-4xl font-mono font-bold text-amber-400">
        <button 
          onClick={() => setBpm(b => Math.max(30, b - 1))}
          className="text-slate-500 hover:text-slate-100"
        >
          -
        </button>
        <span>{bpm}</span>
        <button 
          onClick={() => setBpm(b => Math.min(300, b + 1))}
          className="text-slate-500 hover:text-slate-100"
        >
          +
        </button>
      </div>
      <div className="text-slate-500 font-sans text-xs tracking-widest uppercase">BPM</div>

      <div className="flex gap-2">
        {[1, 2, 4].map((sub) => (
          <button
            key={sub}
            onClick={() => setSubdivision(sub)}
            className={`px-4 py-2 rounded-lg font-mono text-sm ${subdivision === sub ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
          >
            x{sub}
          </button>
        ))}
      </div>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase transition-all ${
          isPlaying ? 'bg-rose-500 hover:bg-rose-400' : 'bg-emerald-500 hover:bg-emerald-400'
        }`}
      >
        {isPlaying ? <Square size={16} /> : <Play size={16} />}
        {isPlaying ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}
