import React, { useState, useEffect } from 'react';
import { Sparkles, X, Wand2, ArrowRight, HelpCircle } from 'lucide-react';
import { Effect } from '../types';

interface AiToneDialogProps {
  onLoadGeneratedTone: (effects: Effect[], name: string, desc: string) => void;
  onClose: () => void;
}

export default function AiToneDialog({ onLoadGeneratedTone, onClose }: AiToneDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingPhrase, setLoadingPhrase] = useState('Booting up the AI Roadie...');

  // Dynamic loading phrases for guitar players
  const loadingPhrases = [
    'Warming up the tube amplifiers...',
    'Chaining patch cables to the pedalboard...',
    'Wiping down the fretboard...',
    'Tuning standard standard E strings...',
    'Adjusting bias voltages on vacuum tubes...',
    'Stomping on true bypass footswitches...',
    'Matching gain stages & headroom levels...',
    'Routing stereo signal outputs...',
  ];

  useEffect(() => {
    let interval: number;
    if (loading) {
      let index = 0;
      interval = window.setInterval(() => {
        setLoadingPhrase(loadingPhrases[index]);
        index = (index + 1) % loadingPhrases.length;
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please describe your target tone first!');
      return;
    }

    setError('');
    setLoading(true);
    setLoadingPhrase('Contacting the AI Tone Architect...');

    try {
      const response = await fetch('/api/ai/generate-tone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to connect to the guitar tech lab.');
      }

      const data = await response.json();
      if (!data.effects || !Array.isArray(data.effects)) {
        throw new Error('AI returned an incomplete rig design. Try again!');
      }

      // Load tone into active FX chain
      onLoadGeneratedTone(data.effects, data.presetName, data.message);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating your sound.');
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    { text: 'Hendrix Fuzz', prompt: 'Vintage screaming Marshall crunch with heavy 60s fuzz, warm lows, and a touch of room delay.' },
    { text: 'Comfortably Pink', prompt: 'Sustained singing high-gain solo tone with smooth compressor, warm distortion, tape delay, and massive hall reverb.' },
    { text: 'Acoustic Clean', prompt: 'Bright glass acoustic simulation utilizing deep graphic EQ, subtle slow chorus, and dry short plate reverb.' },
    { text: 'Modern Djent', prompt: 'Tight percussive modern heavy metal crunch with sharp compression, heavy drive booster, and high gate presence.' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden flex flex-col">
        {/* Top glow decoration */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-amber-400 to-transparent" />

        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 animate-pulse">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-slate-100">
                AI Roadie Sound Studio
              </h3>
              <p className="text-[10px] font-mono text-slate-500 uppercase">
                Describe the tone, we dial the gear
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-100 transition-colors border border-slate-850"
          >
            <X size={14} />
          </button>
        </div>

        {/* Form area */}
        <form onSubmit={handleGenerate} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-start gap-2">
              <span className="font-bold shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Tone Description Prompt
            </label>
            <textarea
              placeholder="e.g. Give me a classic rock warm blues tone with a Tube Screamer drive, subtle stereo chorus, and dynamic tape delay..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              className="w-full h-28 bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-amber-500/80 rounded-2xl p-4 text-xs font-semibold text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all resize-none shadow-inner leading-relaxed"
            />
          </div>

          {/* Preset templates */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Quick Tech Recommendations:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((p) => (
                <button
                  key={p.text}
                  type="button"
                  disabled={loading}
                  onClick={() => setPrompt(p.prompt)}
                  className="px-3 py-2 bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-350 hover:text-amber-500 text-[11px] font-bold rounded-xl transition-all cursor-pointer"
                >
                  {p.text}
                </button>
              ))}
            </div>
          </div>

          {/* Submit or Loading */}
          <div className="mt-2 border-t border-slate-850 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
              <HelpCircle className="h-3 w-3" />
              <span>Double-click dials on the board to reset</span>
            </div>

            {loading ? (
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono font-bold text-amber-500 animate-pulse">
                  {loadingPhrase}
                </span>
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <button
                type="submit"
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-550 active:scale-95 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-amber-500/15 cursor-pointer"
              >
                <span>Stomp AI Tone</span>
                <Wand2 size={12} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
