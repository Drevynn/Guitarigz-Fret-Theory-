import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Mic, MicOff, Download, Circle, Radio } from 'lucide-react';
import {
  startLiveInput,
  stopLiveInput,
  isLiveRunning,
  startRecording,
  stopRecording,
  isRecording,
  getLiveLevel,
  updateLiveGains,
} from '../lib/liveAudio';
import { Effect } from '../types';

interface LiveInputProps {
  effectsChain: Effect[];
  presetName?: string;
}

export default function LiveInput({ effectsChain, presetName }: LiveInputProps) {
  const [active, setActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [inputGain, setInputGain] = useState(50);
  const [outputGain, setOutputGain] = useState(70);
  const [vuLevel, setVuLevel] = useState(0);
  const [tempo, setTempo] = useState(120);
  const [metronomePlaying, setMetronomePlaying] = useState(false);

  const levelIntervalRef = useRef<number | null>(null);
  const metronomeIntervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synchronize active and gains on the fly
  useEffect(() => {
    if (active) {
      updateLiveGains(inputGain, outputGain);
    }
  }, [inputGain, outputGain, active]);

  // Synchronize effect chain changes in real time
  useEffect(() => {
    if (active) {
      // Re-boot the signal chain with new pedals/parameters
      startLiveInput(effectsChain, inputGain, outputGain).catch((e) => {
        console.error("Failed to start live input", e);
        setActive(false);
      });
    }
  }, [effectsChain, active]);

  // VU meter polling loop
  useEffect(() => {
    if (active) {
      levelIntervalRef.current = window.setInterval(() => {
        const raw = getLiveLevel();
        // Exponential smoothing for gorgeous VU dynamics
        setVuLevel((prev) => prev * 0.4 + raw * 0.6);
      }, 50);
    } else {
      setVuLevel(0);
      if (levelIntervalRef.current) {
        clearInterval(levelIntervalRef.current);
      }
    }
    return () => {
      if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
    };
  }, [active]);

  const handleToggleLive = async () => {
    if (active) {
      await stopLiveInput();
      setActive(false);
      setRecording(false);
    } else {
      try {
        await startLiveInput(effectsChain, inputGain, outputGain);
        setActive(true);
      } catch (err: any) {
        alert(
          "Microphone input access is required for real-time processing. Please allow browser mic permissions in your page header.\n\n" +
            err.message
        );
      }
    }
  };

  const handleToggleRecord = () => {
    if (!active) {
      alert("Please activate the Live Audio FX Link prior to recording.");
      return;
    }

    if (recording) {
      stopRecording(presetName);
      setRecording(false);
    } else {
      startRecording();
      setRecording(true);
    }
  };

  // Metronome audio synthesizer using standard Oscillators
  const playMetronomeTick = (time: number, isDownbeat: boolean) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(isDownbeat ? 1000 : 600, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  };

  const handleToggleMetronome = () => {
    if (metronomePlaying) {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
      setMetronomePlaying(false);
    } else {
      const intervalMs = (60 / tempo) * 1000;
      let beatCount = 0;

      // Immediately play first beat
      playMetronomeTick(0, beatCount === 0);
      beatCount = (beatCount + 1) % 4;

      metronomeIntervalRef.current = window.setInterval(() => {
        playMetronomeTick(0, beatCount === 0);
        beatCount = (beatCount + 1) % 4;
      }, intervalMs);

      setMetronomePlaying(true);
    }
  };

  // Update metronome tempo in real-time
  useEffect(() => {
    if (metronomePlaying) {
      // Restart interval with new tempo
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
      const intervalMs = (60 / tempo) * 1000;
      let beatCount = 0;
      metronomeIntervalRef.current = window.setInterval(() => {
        playMetronomeTick(0, beatCount === 0);
        beatCount = (beatCount + 1) % 4;
      }, intervalMs);
    }
  }, [tempo]);

  useEffect(() => {
    return () => {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    };
  }, []);

  // VU meter gradient bars
  const vuBarCount = 14;
  const activeBars = Math.min(vuBarCount, Math.floor(vuLevel * 25));

  return (
    <div className="bg-slate-950/40 border border-slate-850 rounded-3xl p-6 flex flex-col gap-6 shadow-md relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-850 pb-4">
        <div className="flex items-center gap-2">
          <Radio className={`h-4 w-4 ${active ? 'text-amber-500 animate-pulse' : 'text-slate-500'}`} />
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-200">
            Signal Input & DAW Sync
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${active ? 'bg-amber-500 shadow-lg shadow-amber-500/50' : 'bg-slate-800'}`} />
          <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
            {active ? 'Link Active' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Toggle + VUMeters */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <button
            onClick={handleToggleLive}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 border transition-all cursor-pointer ${
              active
                ? 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400 shadow-lg shadow-amber-500/10 active:scale-[0.98]'
                : 'bg-slate-900 text-slate-350 border-slate-800 hover:bg-slate-850 hover:text-slate-100 active:scale-[0.98]'
            }`}
          >
            {active ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            <span>{active ? 'Live Audio Connected' : 'Connect Guitar Mic'}</span>
          </button>

          {/* Graphical VU Level Indicator */}
          <div className="flex flex-col gap-1.5 bg-slate-950/60 border border-slate-850/80 p-3 rounded-xl">
            <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase tracking-widest">
              <span>VU Meter</span>
              <span className={vuLevel > 0.4 ? 'text-amber-500 font-bold' : ''}>
                {Math.round(vuLevel * 100)} dB
              </span>
            </div>
            <div className="flex gap-1 h-3 items-center">
              {Array.from({ length: vuBarCount }).map((_, i) => {
                const isActive = i < activeBars;
                // Green-Yellow-Red dynamic VU spectrum
                let colorClass = 'bg-slate-800';
                if (isActive) {
                  if (i < 8) colorClass = 'bg-emerald-500 shadow-sm shadow-emerald-500/30';
                  else if (i < 11) colorClass = 'bg-amber-500 shadow-sm shadow-amber-500/30';
                  else colorClass = 'bg-rose-500 shadow-sm shadow-rose-500/30';
                }
                return (
                  <div
                    key={i}
                    className={`flex-1 h-full rounded-sm transition-all duration-75 ${colorClass}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Input/Output Slider Gains */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              <span>Input Threshold</span>
              <span className="text-amber-500">{inputGain}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={inputGain}
              onChange={(e) => setInputGain(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              <span>Master Level</span>
              <span className="text-amber-500">{outputGain}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={outputGain}
              onChange={(e) => setOutputGain(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* Recording & Metronome */}
        <div className="lg:col-span-3 flex sm:flex-row lg:flex-col gap-3 h-full">
          {/* Record Pedal Output */}
          <button
            onClick={handleToggleRecord}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              recording
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20 active:scale-95 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200 active:scale-95'
            }`}
            title="Record your custom session and auto-download high quality WebM files"
          >
            <Circle className={`h-3 w-3 ${recording ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{recording ? 'Recording...' : 'Record Jam'}</span>
          </button>

          {/* Metronome loop trigger */}
          <div className="flex-1 flex gap-2">
            <button
              onClick={handleToggleMetronome}
              className={`py-3 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 flex-1 cursor-pointer ${
                metronomePlaying
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {metronomePlaying ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3 fill-slate-400" />}
              <span>Metronome</span>
            </button>

            {/* Tempo BPM adjuster */}
            <input
              type="number"
              min="40"
              max="240"
              value={tempo}
              onChange={(e) => setTempo(Math.max(40, Math.min(240, Number(e.target.value))))}
              className="w-16 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs font-mono font-bold text-amber-500 focus:outline-none focus:border-amber-500"
              title="Tempo BPM"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
