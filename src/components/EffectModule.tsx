import React from 'react';
import { Power, Settings, SlidersHorizontal } from 'lucide-react';
import { Effect } from '../types';
import KnobControl from './KnobControl';

interface EffectModuleProps {
  effect: Effect;
  onChange: (updated: Effect) => void;
  onRemove: () => void;
}

export default function EffectModule({ effect, onChange, onRemove }: EffectModuleProps) {
  // Define custom visual skins for each effect type
  const skins: Record<string, {
    bg: string;
    border: string;
    labelColor: string;
    ledActive: string;
    ledInactive: string;
    styleLabel: string;
  }> = {
    distortion: {
      bg: 'bg-gradient-to-b from-orange-550 to-orange-700',
      border: 'border-orange-500 shadow-orange-950/40',
      labelColor: 'text-orange-100',
      ledActive: 'bg-red-500 shadow-red-500/80',
      ledInactive: 'bg-red-950',
      styleLabel: 'font-display font-black tracking-widest text-slate-900 uppercase',
    },
    overdrive: {
      bg: 'bg-gradient-to-b from-emerald-600 to-emerald-800',
      border: 'border-emerald-550 shadow-emerald-950/40',
      labelColor: 'text-emerald-100',
      ledActive: 'bg-amber-400 shadow-amber-400/80',
      ledInactive: 'bg-emerald-950',
      styleLabel: 'font-sans font-black italic tracking-wider text-slate-950 uppercase',
    },
    delay: {
      bg: 'bg-gradient-to-b from-slate-700 to-slate-900',
      border: 'border-slate-650 shadow-slate-950/40',
      labelColor: 'text-sky-300',
      ledActive: 'bg-sky-400 shadow-sky-400/80',
      ledInactive: 'bg-slate-950',
      styleLabel: 'font-mono font-bold tracking-widest text-sky-400 uppercase',
    },
    reverb: {
      bg: 'bg-gradient-to-b from-indigo-900 to-slate-950',
      border: 'border-indigo-850 shadow-indigo-950/50',
      labelColor: 'text-indigo-200',
      ledActive: 'bg-fuchsia-400 shadow-fuchsia-400/80',
      ledInactive: 'bg-indigo-950',
      styleLabel: 'font-serif italic font-bold tracking-wide text-indigo-300 uppercase',
    },
    chorus: {
      bg: 'bg-gradient-to-b from-sky-550 to-sky-700',
      border: 'border-sky-500 shadow-sky-950/40',
      labelColor: 'text-sky-100',
      ledActive: 'bg-amber-400 shadow-amber-400/80',
      ledInactive: 'bg-sky-950',
      styleLabel: 'font-sans font-black tracking-widest text-slate-950 uppercase',
    },
    flanger: {
      bg: 'bg-gradient-to-b from-violet-600 to-violet-850',
      border: 'border-violet-550 shadow-violet-950/40',
      labelColor: 'text-violet-100',
      ledActive: 'bg-red-400 shadow-red-400/80',
      ledInactive: 'bg-violet-950',
      styleLabel: 'font-mono font-black tracking-wider text-slate-950 uppercase',
    },
    phaser: {
      bg: 'bg-gradient-to-b from-rose-600 to-rose-800',
      border: 'border-rose-550 shadow-rose-950/40',
      labelColor: 'text-rose-100',
      ledActive: 'bg-amber-400 shadow-amber-400/80',
      ledInactive: 'bg-rose-950',
      styleLabel: 'font-sans font-bold tracking-widest text-slate-950 uppercase',
    },
    compressor: {
      bg: 'bg-gradient-to-b from-teal-700 to-teal-900',
      border: 'border-teal-650 shadow-teal-950/40',
      labelColor: 'text-teal-200',
      ledActive: 'bg-yellow-400 shadow-yellow-400/80',
      ledInactive: 'bg-teal-950',
      styleLabel: 'font-mono font-bold tracking-wider text-teal-400 uppercase',
    },
    eq: {
      bg: 'bg-gradient-to-b from-slate-800 to-slate-950',
      border: 'border-slate-700 shadow-black/40',
      labelColor: 'text-amber-500',
      ledActive: 'bg-emerald-500 shadow-emerald-500/80',
      ledInactive: 'bg-slate-900',
      styleLabel: 'font-mono font-semibold tracking-widest text-slate-400 uppercase',
    },
    tremolo: {
      bg: 'bg-gradient-to-b from-fuchsia-700 to-fuchsia-900',
      border: 'border-fuchsia-650 shadow-fuchsia-950/40',
      labelColor: 'text-fuchsia-200',
      ledActive: 'bg-red-400 shadow-red-400/80',
      ledInactive: 'bg-fuchsia-950',
      styleLabel: 'font-display font-black tracking-wider text-slate-950 uppercase',
    },
    wah: {
      bg: 'bg-gradient-to-b from-zinc-700 to-zinc-900',
      border: 'border-zinc-650 shadow-zinc-950/40',
      labelColor: 'text-zinc-300',
      ledActive: 'bg-amber-500 shadow-amber-500/80',
      ledInactive: 'bg-zinc-950',
      styleLabel: 'font-serif font-black italic tracking-widest text-zinc-150 uppercase',
    },
    octave: {
      bg: 'bg-gradient-to-b from-red-700 to-red-950',
      border: 'border-red-600 shadow-red-950/50',
      labelColor: 'text-red-200',
      ledActive: 'bg-yellow-300 shadow-yellow-300/80',
      ledInactive: 'bg-red-950',
      styleLabel: 'font-display font-black tracking-widest text-slate-900 uppercase',
    },
  };

  const skin = skins[effect.type] || skins.distortion;

  const handleToggle = () => {
    onChange({
      ...effect,
      enabled: !effect.enabled,
    });
  };

  const handleParamChange = (name: string, value: number) => {
    onChange({
      ...effect,
      parameters: effect.parameters.map((p) =>
        p.name === name ? { ...p, value } : p
      ),
    });
  };

  const handleDryWetChange = (val: number) => {
    onChange({
      ...effect,
      dryWet: val,
    });
  };

  return (
    <div
      className={`relative w-48 rounded-3xl border-2 p-5 flex flex-col justify-between shadow-xl transition-all ${skin.bg} ${skin.border} ${
        effect.enabled ? 'scale-100' : 'opacity-70 scale-98 hover:opacity-90'
      }`}
    >
      {/* Top row: Footswitch LED & Bypass switches */}
      <div className="flex items-center justify-between mb-4">
        {/* Bypass Indicator LED */}
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2.5 h-2.5 rounded-full border border-black/40 transition-all ${
              effect.enabled ? skin.ledActive : skin.ledInactive
            }`}
          />
          <span className="text-[8px] font-mono font-bold text-black/60 uppercase tracking-widest">
            {effect.enabled ? 'ACTIVE' : 'BYPASS'}
          </span>
        </div>

        {/* Remove pedal button */}
        <button
          onClick={onRemove}
          className="text-[9px] font-mono font-bold text-black/50 hover:text-black/90 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md border border-black/10 transition-colors"
          title="Disconnect from chain"
        >
          DISCONNECT
        </button>
      </div>

      {/* Pedal Brand/Vibe title text */}
      <div className="text-center mb-6">
        <h4 className={`text-xs ${skin.styleLabel}`}>{effect.name}</h4>
      </div>

      {/* Middle row: Interactive parameter knobs */}
      <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-4 items-center justify-center mb-6">
        {effect.parameters.map((param) => (
          <KnobControl
            key={param.name}
            label={param.name}
            value={param.value}
            min={param.min}
            max={param.max}
            unit={param.unit}
            size="sm"
            disabled={!effect.enabled}
            onChange={(val) => handleParamChange(param.name, val)}
          />
        ))}

        {/* Dry/Wet blend level control */}
        <KnobControl
          label="Blend"
          value={effect.dryWet ?? 50}
          min={0}
          max={100}
          unit="%"
          size="sm"
          disabled={!effect.enabled}
          onChange={handleDryWetChange}
        />
      </div>

      {/* Bottom footswitch stomp button */}
      <div className="flex flex-col items-center">
        {/* Metal Stomp button circle */}
        <button
          onClick={handleToggle}
          className={`w-11 h-11 rounded-full border-2 border-slate-700 bg-gradient-to-b from-slate-400 to-slate-600 active:from-slate-500 active:to-slate-700 flex items-center justify-center shadow-md cursor-pointer transform active:scale-92 transition-all ${
            effect.enabled ? 'ring-2 ring-white/10' : ''
          }`}
          title={effect.enabled ? 'Bypass stompbox' : 'Activate stompbox'}
        >
          <div className="w-8 h-8 rounded-full border border-slate-500 bg-gradient-to-b from-slate-550 to-slate-450 flex items-center justify-center">
            <Power className="h-3 w-3 text-slate-800" />
          </div>
        </button>
        <span className="text-[8px] font-mono font-black text-black/40 mt-1 uppercase tracking-widest">
          Stomp
        </span>
      </div>
    </div>
  );
}
