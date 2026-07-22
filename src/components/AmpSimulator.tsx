import React, { useState } from 'react';
import { Volume2, Power, Disc, Zap, Sliders, ChevronDown, Sparkles, Check, Info } from 'lucide-react';
import { AMP_MODELS, AmpModel, AmpKnob } from '../utils/ampModels';

interface AmpSimulatorProps {
  selectedAmpId?: string;
  onAmpChange?: (amp: AmpModel) => void;
  onMessage?: (msg: string) => void;
}

export default function AmpSimulator({ selectedAmpId, onAmpChange, onMessage }: AmpSimulatorProps) {
  const [activeAmpIndex, setActiveAmpIndex] = useState(0);
  const [currentAmpsState, setCurrentAmpsState] = useState<AmpModel[]>(AMP_MODELS);
  const [powerOn, setPowerOn] = useState(true);
  const [standby, setStandby] = useState(false);
  const [selectedCabinet, setSelectedCabinet] = useState<string>(AMP_MODELS[0].defaultCabinet);
  const [showAmpMenu, setShowAmpMenu] = useState(false);

  const activeAmp = currentAmpsState[activeAmpIndex];

  // Handle switching amp head
  const handleSelectAmp = (index: number) => {
    setActiveAmpIndex(index);
    const newAmp = currentAmpsState[index];
    setSelectedCabinet(newAmp.defaultCabinet);
    setShowAmpMenu(false);
    if (onAmpChange) onAmpChange(newAmp);
    if (onMessage) onMessage(`Switched active tube amplifier head to: ${newAmp.name} (${newAmp.brandImitation})`);
  };

  // Handle Knob parameter tweaking
  const handleKnobChange = (knobId: string, newValue: number) => {
    const updatedAmps = [...currentAmpsState];
    const ampToUpdate = { ...updatedAmps[activeAmpIndex] };
    ampToUpdate.knobs = ampToUpdate.knobs.map((k) =>
      k.id === knobId ? { ...k, value: parseFloat(newValue.toFixed(1)) } : k
    );
    updatedAmps[activeAmpIndex] = ampToUpdate;
    setCurrentAmpsState(updatedAmps);
  };

  // Handle Switch option toggling
  const handleSwitchToggle = (switchId: string) => {
    const updatedAmps = [...currentAmpsState];
    const ampToUpdate = { ...updatedAmps[activeAmpIndex] };
    ampToUpdate.switches = ampToUpdate.switches.map((s) => {
      if (s.id === switchId) {
        const nextOptIndex = (s.activeOptionIndex + 1) % s.options.length;
        if (onMessage) {
          onMessage(`${ampToUpdate.name} [${s.label}] toggled to: ${s.options[nextOptIndex]}`);
        }
        return { ...s, activeOptionIndex: nextOptIndex };
      }
      return s;
    });
    updatedAmps[activeAmpIndex] = ampToUpdate;
    setCurrentAmpsState(updatedAmps);
  };

  return (
    <div className={`rounded-3xl border shadow-xl transition-all duration-500 overflow-hidden relative ${activeAmp.theme.bgClass} ${activeAmp.theme.borderClass}`}>
      {/* Top Amp Chassis Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur flex flex-wrap items-center justify-between gap-3">
        {/* Amp Selection Dropdown / Badges */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowAmpMenu(!showAmpMenu)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-amber-500 rounded-2xl text-xs font-bold text-slate-100 flex items-center gap-2 cursor-pointer transition-all shadow-md"
            >
              <Zap className="h-4 w-4 text-amber-500" />
              <span>{activeAmp.name}</span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                {activeAmp.brandImitation}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${showAmpMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu of Amp Models */}
            {showAmpMenu && (
              <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-750 rounded-2xl p-2 shadow-2xl z-50 flex flex-col gap-1 backdrop-blur-md animate-fadeIn">
                <div className="px-3 py-1.5 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                    Select Tube Amp Head
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">5 Models</span>
                </div>
                {currentAmpsState.map((amp, idx) => {
                  const isCurrent = idx === activeAmpIndex;
                  return (
                    <button
                      key={amp.id}
                      onClick={() => handleSelectAmp(idx)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex flex-col gap-1 cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-100">{amp.name}</span>
                        {isCurrent && <Check size={12} className="text-amber-400" />}
                      </div>
                      <span className="text-[10px] font-medium text-amber-400/90">{amp.brandImitation}</span>
                      <span className="text-[9px] text-slate-400 line-clamp-1">{amp.genreFocus}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/60 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400">Tolex Style:</span>
            <span className="text-[10px] font-semibold text-slate-200">{activeAmp.theme.tolexPattern}</span>
          </div>
        </div>

        {/* Master Power & Standby Switches */}
        <div className="flex items-center gap-3">
          {/* Cabinet Impulse Selector */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Disc className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase hidden md:inline">
              Cabinet IR:
            </span>
            <select
              value={selectedCabinet}
              onChange={(e) => {
                setSelectedCabinet(e.target.value);
                if (onMessage) onMessage(`Cabinet IR changed to: ${e.target.value}`);
              }}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer max-w-[180px] truncate"
            >
              {activeAmp.availableCabinets.map((cab) => (
                <option key={cab} value={cab} className="bg-slate-900 text-slate-200">
                  {cab}
                </option>
              ))}
            </select>
          </div>

          {/* Glowing Power Jewel Indicator */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${powerOn ? activeAmp.theme.lightColor : 'bg-slate-800'}`} />
            <button
              onClick={() => {
                setPowerOn(!powerOn);
                if (onMessage) onMessage(`Amp Power ${!powerOn ? 'Engaged' : 'Muted'}`);
              }}
              className={`text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                powerOn ? 'text-slate-200 hover:text-amber-400' : 'text-slate-600'
              }`}
            >
              {powerOn ? 'PWR ON' : 'PWR OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Amp Faceplate & Knobs Control Deck */}
      <div className={`p-6 flex flex-col gap-6 relative ${activeAmp.theme.panelClass}`}>
        {/* Amp Tagline Banner */}
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className={`h-4 w-4 ${activeAmp.theme.accentColor}`} />
            <p className={`text-xs font-medium ${activeAmp.theme.textColor}`}>
              {activeAmp.tagline}
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
            Target: {activeAmp.genreFocus}
          </span>
        </div>

        {/* Rotary Dial / Slider Controls Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {activeAmp.knobs.map((knob) => (
            <div
              key={knob.id}
              className="bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-3.5 flex flex-col items-center justify-between gap-3 shadow-inner group transition-all"
            >
              <div className="flex flex-col items-center gap-0.5 w-full">
                <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-amber-400 transition-colors uppercase tracking-wider text-center truncate w-full">
                  {knob.label}
                </span>
                <span className="text-xs font-black font-mono text-slate-100">
                  {knob.value}
                </span>
              </div>

              {/* Rotary Control Visual Dial representation */}
              <div className="relative w-12 h-12 flex items-center justify-center my-1">
                <div className={`w-10 h-10 rounded-full border-2 border-slate-700 shadow-md flex items-center justify-center relative transition-transform ${activeAmp.theme.knobColor}`}>
                  {/* Indicator notch pointing according to knob value */}
                  <div
                    className="absolute w-1 h-4 bg-amber-500 rounded-full top-1 transition-transform"
                    style={{
                      transformOrigin: 'bottom center',
                      transform: `rotate(${((knob.value - knob.min) / (knob.max - knob.min)) * 260 - 130}deg)`,
                    }}
                  />
                </div>
              </div>

              {/* Range Input Slider */}
              <input
                type="range"
                min={knob.min}
                max={knob.max}
                step={knob.step || 0.1}
                value={knob.value}
                disabled={!powerOn}
                onChange={(e) => handleKnobChange(knob.id, parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none disabled:opacity-30"
              />
            </div>
          ))}
        </div>

        {/* Toggle Switches Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Sliders size={12} className="text-amber-500" />
              <span>Amp Circuit Switches:</span>
            </span>

            {activeAmp.switches.map((sw) => (
              <button
                key={sw.id}
                onClick={() => handleSwitchToggle(sw.id)}
                disabled={!powerOn}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-750 hover:border-amber-500/50 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
              >
                <span className="text-slate-400 text-[10px] uppercase font-mono">{sw.label}:</span>
                <span className="text-amber-400 font-bold">{sw.options[sw.activeOptionIndex]}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
            <Info size={12} />
            <span>Tone Model: 24-bit Tube Emulation + Cabinet Convolver</span>
          </div>
        </div>
      </div>
    </div>
  );
}
