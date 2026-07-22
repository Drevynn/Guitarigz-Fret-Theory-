import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, AlertCircle, ArrowLeft, ArrowRight, RotateCcw, Volume2, HelpCircle, Zap } from 'lucide-react';
import { Effect, Preset, PresetCategory, PRESET_CATEGORIES } from '../types';
import { DEFAULT_PRESETS, createDefaultEffect } from '../utils/presetDefaults';
import PresetSidebar from './PresetSidebar';
import WaveformVisualizer from './WaveformVisualizer';
import LiveInput from './LiveInput';
import EffectModule from './EffectModule';
import AiToneDialog from './AiToneDialog';
import AmpSimulator from './AmpSimulator';

export default function GuitarigzStudio() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [activePreset, setActivePreset] = useState<Preset | null>(null);
  const [effectsChain, setEffectsChain] = useState<Effect[]>([]);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [aiRoadieMessage, setAiRoadieMessage] = useState<string | null>(
    'Welcome to the Guitarigz Rack FX Lab! Select a preset on the left or connect your guitar microphone to start jamming in real-time.'
  );

  // Load presets from LocalStorage or seed with defaults
  useEffect(() => {
    const stored = localStorage.getItem('guitarigz_presets');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPresets(parsed);
        if (parsed.length > 0) {
          setActivePreset(parsed[0]);
          setEffectsChain(parsed[0].effects);
        }
      } catch (e) {
        setPresets(DEFAULT_PRESETS);
        setActivePreset(DEFAULT_PRESETS[0]);
        setEffectsChain(DEFAULT_PRESETS[0].effects);
      }
    } else {
      setPresets(DEFAULT_PRESETS);
      localStorage.setItem('guitarigz_presets', JSON.stringify(DEFAULT_PRESETS));
      setActivePreset(DEFAULT_PRESETS[0]);
      setEffectsChain(DEFAULT_PRESETS[0].effects);
    }
  }, []);

  // Save custom preset
  const handleSaveCurrentPreset = (name: string, category: PresetCategory) => {
    const newPreset: Preset = {
      id: `custom-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description: `Custom rig built on ${new Date().toLocaleDateString()} featuring ${effectsChain.length} effects.`,
      category,
      effects: [...effectsChain],
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem('guitarigz_presets', JSON.stringify(updated));
    setActivePreset(newPreset);
    setAiRoadieMessage(`Custom rig "${name}" saved to your tone deck!`);
  };

  // Toggle favorite status on preset
  const handleToggleFavorite = (id: string) => {
    const updated = presets.map((p) =>
      p.id === id ? { ...p, favorite: !p.favorite } : p
    );
    setPresets(updated);
    localStorage.setItem('guitarigz_presets', JSON.stringify(updated));
    if (activePreset && activePreset.id === id) {
      setActivePreset({ ...activePreset, favorite: !activePreset.favorite });
    }
  };

  // Delete custom preset
  const handleDeletePreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    localStorage.setItem('guitarigz_presets', JSON.stringify(updated));

    if (activePreset && activePreset.id === id && updated.length > 0) {
      setActivePreset(updated[0]);
      setEffectsChain(updated[0].effects);
    }
  };

  // Import presets deck from JSON
  const handleImportPresets = (imported: Preset[]) => {
    const combined = [...imported, ...presets.filter((p) => !imported.some((imp) => imp.id === p.id))];
    setPresets(combined);
    localStorage.setItem('guitarigz_presets', JSON.stringify(combined));
    if (imported.length > 0) {
      setActivePreset(imported[0]);
      setEffectsChain(imported[0].effects);
    }
    setAiRoadieMessage(`Successfully imported ${imported.length} custom presets to your library!`);
  };

  // Reset presets to default factory presets
  const handleResetDefaults = () => {
    setPresets(DEFAULT_PRESETS);
    localStorage.setItem('guitarigz_presets', JSON.stringify(DEFAULT_PRESETS));
    setActivePreset(DEFAULT_PRESETS[0]);
    setEffectsChain(DEFAULT_PRESETS[0].effects);
    setAiRoadieMessage('Presets library restored to factory default genre rigs.');
  };

  // Select preset from sidebar
  const handleSelectPreset = (preset: Preset) => {
    setActivePreset(preset);
    setEffectsChain(preset.effects);
    setAiRoadieMessage(`Loaded preset rig: "${preset.name}". Enjoy the vibes!`);
  };

  // Update specific effect in the active chain
  const handleEffectChange = (index: number, updatedEffect: Effect) => {
    const updatedChain = [...effectsChain];
    updatedChain[index] = updatedEffect;
    setEffectsChain(updatedChain);
  };

  // Remove effect from active chain
  const handleRemoveEffect = (index: number) => {
    const updatedChain = effectsChain.filter((_, i) => i !== index);
    setEffectsChain(updatedChain);
  };

  // Move effect left in chain series
  const handleMoveLeft = (index: number) => {
    if (index === 0) return;
    const updatedChain = [...effectsChain];
    const temp = updatedChain[index];
    updatedChain[index] = updatedChain[index - 1];
    updatedChain[index - 1] = temp;
    setEffectsChain(updatedChain);
  };

  // Move effect right in chain series
  const handleMoveRight = (index: number) => {
    if (index === effectsChain.length - 1) return;
    const updatedChain = [...effectsChain];
    const temp = updatedChain[index];
    updatedChain[index] = updatedChain[index + 1];
    updatedChain[index + 1] = temp;
    setEffectsChain(updatedChain);
  };

  // Add a new pedal to the active chain series
  const handleAddEffect = (type: string) => {
    if (effectsChain.length >= 6) {
      alert('Maximum chain length is 6 pedals to maintain low-latency signal fidelity.');
      return;
    }
    const newEffect = createDefaultEffect(type);
    setEffectsChain([...effectsChain, newEffect]);
  };

  // Apply AI Generated Tone Response
  const handleLoadGeneratedTone = (effects: Effect[], name: string, description: string) => {
    const aiPreset: Preset = {
      id: `ai-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description: 'AI Generated Rig Snapshot',
      category: 'AI Generated',
      effects,
    };

    setPresets([aiPreset, ...presets]);
    setActivePreset(aiPreset);
    setEffectsChain(effects);
    setAiRoadieMessage(description);
  };

  // Inline AI Tweak state
  const [inlineAiPrompt, setInlineAiPrompt] = useState('');
  const [inlineAiLoading, setInlineAiLoading] = useState(false);

  // Handle inline AI tweaking/generation
  const handleInlineAiTweak = async (promptToUse?: string) => {
    const textPrompt = (promptToUse || inlineAiPrompt).trim();
    if (!textPrompt) return;

    setInlineAiLoading(true);
    setAiRoadieMessage(`AI Roadie is tweaking pedals for: "${textPrompt}"...`);

    try {
      const response = await fetch('/api/ai/generate-tone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textPrompt }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to tweak guitar rig.');
      }

      const data = await response.json();
      if (data.effects && Array.isArray(data.effects)) {
        handleLoadGeneratedTone(data.effects, data.presetName || 'AI Tweaked Rig', data.message || 'Pedal FX updated according to your request!');
        setInlineAiPrompt('');
      }
    } catch (err: any) {
      console.error('Inline AI tweak error:', err);
      setAiRoadieMessage(`Error tweaking pedals: ${err.message || 'Try again'}`);
    } finally {
      setInlineAiLoading(false);
    }
  };

  // Available pedal types to add
  const addablePedals = [
    { type: 'distortion', label: 'Distortion' },
    { type: 'overdrive', label: 'Overdrive' },
    { type: 'compressor', label: 'Compressor' },
    { type: 'eq', label: 'EQ' },
    { type: 'chorus', label: 'Chorus' },
    { type: 'phaser', label: 'Phaser' },
    { type: 'flanger', label: 'Flanger' },
    { type: 'tremolo', label: 'Tremolo' },
    { type: 'wah', label: 'Wah' },
    { type: 'octave', label: 'Octave' },
    { type: 'delay', label: 'Delay' },
    { type: 'reverb', label: 'Reverb' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-2">
      {/* Visualizer & Rig Title Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500 animate-pulse" />
          <h2 className="font-display font-black text-base uppercase tracking-wider shimmer-text">
            Visualize Virtual Amp Rigs & FX Stomp Chain
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400 uppercase hidden sm:inline">
          Live Tube Emulation + DSP Pedals
        </span>
      </div>

      {/* Dynamic Waveform Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visualizer and Live Settings panel */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <WaveformVisualizer />
        </div>

        {/* AI Roadie Chat Log Panel */}
        <div className="lg:col-span-4 h-24 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-3 overflow-hidden shadow-inner items-start relative">
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1 flex flex-col justify-between h-full min-w-0">
            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider">
              AI Roadie Log:
            </span>
            <p className="text-[10px] text-slate-300 leading-relaxed font-medium truncate-lines-3 select-text select-none overflow-y-auto pr-1">
              {aiRoadieMessage}
            </p>
          </div>
          <button
            onClick={() => setShowAiDialog(true)}
            className="absolute right-3 top-3 px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[9px] font-bold rounded-lg uppercase tracking-wide cursor-pointer"
          >
            AI Stomp
          </button>
        </div>
      </div>

      {/* Main Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Preset Sidebar - Column 4 */}
        <div className="lg:col-span-4 h-[580px]">
          <PresetSidebar
            presets={presets}
            activePresetId={activePreset?.id ?? null}
            onSelectPreset={handleSelectPreset}
            onToggleFavorite={handleToggleFavorite}
            onSaveCurrentPreset={handleSaveCurrentPreset}
            onDeletePreset={handleDeletePreset}
            onImportPresets={handleImportPresets}
            onResetDefaults={handleResetDefaults}
          />
        </div>

        {/* Dynamic Series Pedalboard + Adder Panel - Column 8 */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-h-[580px]">
          {/* Tube Amplifier Head & Cabinet Unit */}
          <AmpSimulator onMessage={(msg) => setAiRoadieMessage(msg)} />

          {/* Active effects stomp deck */}
          <div className="bg-slate-950/40 border border-slate-850 rounded-3xl p-6 flex flex-col gap-6 shadow-md flex-1 relative overflow-hidden">
            {/* Header / Adder triggers */}
            <div className="flex flex-col gap-4 border-b border-slate-850 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-amber-500" />
                  <h3 className="font-display font-black text-sm uppercase tracking-wider text-slate-200">
                    Series Signal Pedalboard
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  CH: {effectsChain.length} / 6 PEDALS
                </span>
              </div>

              {/* AI Natural Language FX Tweaker Bar */}
              <div className="p-3 bg-slate-900/90 border border-amber-500/30 rounded-2xl flex flex-col gap-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wide shrink-0">
                    AI Pedal Tweaker:
                  </span>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleInlineAiTweak();
                    }}
                    className="flex-1 flex gap-2"
                  >
                    <input
                      type="text"
                      value={inlineAiPrompt}
                      onChange={(e) => setInlineAiPrompt(e.target.value)}
                      placeholder="e.g., 'Add heavy Hendrix fuzz with tape delay', 'Give me dynamic SRV blues overdrive', 'Make it a lush clean ambient space'..."
                      disabled={inlineAiLoading}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-slate-100 placeholder:text-slate-500 px-3 py-1.5 rounded-xl font-medium focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={inlineAiLoading || !inlineAiPrompt.trim()}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        inlineAiPrompt.trim() && !inlineAiLoading
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {inlineAiLoading ? (
                        <>
                          <RotateCcw className="h-3 w-3 animate-spin" />
                          <span>Tweaking...</span>
                        </>
                      ) : (
                        <span>Tweak FX</span>
                      )}
                    </button>
                  </form>
                </div>

                {/* Quick AI Tweak preset chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase">Quick Tweaks:</span>
                  {[
                    { label: '🔥 Heavy Distortion & Delay', prompt: 'Heavy high-gain distortion with tight noise gate and 350ms tape delay' },
                    { label: '🎸 Texas SRV Blues', prompt: 'Warm tube overdrive with mid boost, subtle spring reverb, and compressor' },
                    { label: '🌊 Ambient Dreamy Space', prompt: 'Lush slow stereo chorus with massive hall reverb and dotted 8th delay' },
                    { label: '✨ 80s Synth Funk', prompt: 'Funky envelope filter wah with fast phaser and punchy compressor' },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      disabled={inlineAiLoading}
                      onClick={() => handleInlineAiTweak(chip.prompt)}
                      className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-amber-400 text-[10px] font-semibold rounded-lg transition-all cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Pedal Select bar */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mr-1.5">
                  STOMP ADDER:
                </span>
                {addablePedals.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handleAddEffect(item.type)}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-350 hover:text-amber-500 text-[10px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-2.5 w-2.5 text-slate-500" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic series list of effects modules */}
            {effectsChain.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 border border-dashed border-slate-850 rounded-2xl gap-3">
                <span className="text-3xl">🎸</span>
                <div className="text-center">
                  <h4 className="text-sm font-bold text-slate-300">Your pedalboard is bare!</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Stomp some pedal triggers above or choose an AI Generator prompt to build your active audio signal chain.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {effectsChain.map((fx, idx) => (
                  <div key={fx.id} className="relative flex flex-col gap-2 shrink-0 snap-start group">
                    {/* Arrange tools above pedal */}
                    <div className="flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/60 rounded-xl py-1">
                      <button
                        onClick={() => handleMoveLeft(idx)}
                        disabled={idx === 0}
                        className="p-1 hover:text-amber-500 text-slate-500 disabled:opacity-20 cursor-pointer"
                        title="Move left in chain order"
                      >
                        <ArrowLeft size={11} />
                      </button>
                      <span className="text-[9px] font-mono font-bold text-slate-400">
                        STAGE {idx + 1}
                      </span>
                      <button
                        onClick={() => handleMoveRight(idx)}
                        disabled={idx === effectsChain.length - 1}
                        className="p-1 hover:text-amber-500 text-slate-500 disabled:opacity-20 cursor-pointer"
                        title="Move right in chain order"
                      >
                        <ArrowRight size={11} />
                      </button>
                    </div>

                    <EffectModule
                      effect={fx}
                      onChange={(updated) => handleEffectChange(idx, updated)}
                      onRemove={() => handleRemoveEffect(idx)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Connected microphone activation panel */}
          <LiveInput effectsChain={effectsChain} presetName={activePreset?.name} />
        </div>
      </div>

      {/* AI Roadie Dialog overlay */}
      {showAiDialog && (
        <AiToneDialog
          onLoadGeneratedTone={handleLoadGeneratedTone}
          onClose={() => setShowAiDialog(false)}
        />
      )}
    </div>
  );
}
