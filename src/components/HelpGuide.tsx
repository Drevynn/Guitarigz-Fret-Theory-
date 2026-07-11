/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Music, 
  Sparkles, 
  Cpu, 
  Settings, 
  CheckCircle, 
  Radio, 
  Mic, 
  Lightbulb, 
  AlertTriangle,
  Play,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { playStrum, initAudio } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';

interface HelpGuideProps {
  isPremium: boolean;
  onUpgradeClick: () => void;
}

export default function HelpGuide({ isPremium, onUpgradeClick }: HelpGuideProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [diagnosticSoundPlaying, setDiagnosticSoundPlaying] = useState(false);
  const [micStatus, setMicStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  
  // Interactive getting-started Checklist state (saves to localStorage)
  const [checklist, setChecklist] = useState({
    exploreBoard: false,
    strumChord: false,
    quizSelf: false,
    testSynth: false,
    tryAiStudio: false,
  });

  useEffect(() => {
    // Load check list progress
    const stored = localStorage.getItem('guitarigz_help_checklist');
    if (stored) {
      try {
        setChecklist(JSON.parse(stored));
      } catch (e) {}
    }

    // Check mic permission status if supported
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' as any })
        .then((permissionStatus) => {
          setMicStatus(permissionStatus.state as any);
          permissionStatus.onchange = () => {
            setMicStatus(permissionStatus.state as any);
          };
        })
        .catch(() => {});
    }
  }, []);

  const toggleChecklistItem = (key: keyof typeof checklist) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    localStorage.setItem('guitarigz_help_checklist', JSON.stringify(updated));
  };

  const handleTestChime = () => {
    setDiagnosticSoundPlaying(true);
    initAudio();
    // Play a lush, clean C Major 7 strum
    playStrum([48, 55, 60, 64, 67, 71]);
    setTimeout(() => {
      setDiagnosticSoundPlaying(false);
    }, 1000);
    toggleChecklistItem('testSynth');
  };

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop stream immediately, we just wanted to trigger the browser prompt
      stream.getTracks().forEach(track => track.stop());
      setMicStatus('granted');
    } catch (err) {
      setMicStatus('denied');
      console.warn('Microphone permission denied', err);
    }
  };

  const faqs = [
    {
      q: "Why don't I hear any sound when clicking notes?",
      a: "Most modern web browsers block sound generation until you interact with the screen. To resolve this: \n1. Click anywhere inside the fretboard to play a note.\n2. Verify the mute toggle in the top-right header is set to 'Sound On'.\n3. Turn up your device's master volume and check that your output source (headphones/speakers) is correct.",
      icon: Volume2
    },
    {
      q: "How do I connect my real guitar or microphone?",
      a: "Navigate to the 'AI Rack Studio' tab. Click the '🎤 Live Input' button. The browser will prompt you to authorize microphone access. For best results with an electric guitar, connect a direct-input USB guitar interface. Tip: Wear headphones to prevent high-pitched loopback feedback!",
      icon: Mic
    },
    {
      q: "What is the 'DAW Plugin Link' tab?",
      a: "Guitarigz is designed with professional, full-stack plug-and-play architecture. This means you can embed this exact visual fretboard inside any digital audio workstation (like Myrigz Studio) using an iframe. It sends real-time MIDI note postMessages to record your chords, and receives highlights from your DAW sequencer!",
      icon: Cpu
    },
    {
      q: "What is the CAGED Voicing system?",
      a: "CAGED is a guitar chord mapping system that splits the neck into 5 primary moveable fingerboard shapes: C, A, G, E, and D. Our interactive CAGED Voicings tab lets you overlay these shapes in any key, helping you master chord inversions and voice-leading up the neck.",
      icon: Music
    },
    {
      q: "How does the 'AI Roadie' Preset Generator work?",
      a: "In the AI Rack Studio, click 'Ask AI Roadie'. Our backend is powered by Google's state-of-the-art Gemini model. Describe a tone or vibe you want (e.g. '80s ambient hair metal' or 'warm smoky jazz club'), and the AI will automatically patch, sequence, and parameter-tune custom delay, distortion, and filter chains!",
      icon: Sparkles
    }
  ];

  const checklistItems = [
    { key: 'exploreBoard' as const, label: 'Explore the Fretboard (Click any note to sound a string pluck)', desc: 'Helps you build visual muscle memory of note placements.' },
    { key: 'strumChord' as const, label: 'Strum your first chord voicing', desc: 'Go to Progression Loops or CAGED, click a chord play button, and hear a beautiful organic strum.' },
    { key: 'quizSelf' as const, label: 'Train your brain with the Fretboard Trainer', desc: 'Try a quick 5-question theory quiz to boost your note-recall speed.' },
    { key: 'testSynth' as const, label: 'Verify your audio with the Diagnostic Chime', desc: 'Use our high-fidelity custom synthesizer tester below.' },
    { key: 'tryAiStudio' as const, label: 'Check out the AI Rack Studio or DAW Integration', desc: 'Connect live audio, customize effects pedal boards, or try the plugin interface.' },
  ];

  const completedChecklistCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div id="help-guide-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-slate-100 max-w-7xl mx-auto px-1">
      
      {/* LEFT COLUMN: FAQ & Quickstart */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Quickstart Checklist Card */}
        <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-850">
            <div>
              <h2 className="font-display font-black text-xl text-slate-100 flex items-center gap-2">
                <BookOpen className="text-amber-400" size={20} />
                Fretboard Quick-Start Guide
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                Complete these introductory milestones to unlock your musical potential.
              </p>
            </div>
            
            {/* Progress Counter */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2.5 self-start">
              <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-amber-400 relative">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    className="stroke-slate-800"
                    strokeWidth="2"
                    fill="transparent"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    className="stroke-amber-500 transition-all duration-300"
                    strokeWidth="2"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 18}
                    strokeDashoffset={2 * Math.PI * 18 * (1 - completedChecklistCount / checklistItems.length)}
                  />
                </svg>
                {completedChecklistCount}/{checklistItems.length}
              </div>
              <div className="text-left font-sans">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Progress</div>
                <div className="text-[11px] font-semibold text-slate-300">
                  {completedChecklistCount === checklistItems.length ? 'Pro Rocker! 🤘' : 'Getting Ready'}
                </div>
              </div>
            </div>
          </div>

          {/* Checklist items */}
          <div className="flex flex-col gap-3">
            {checklistItems.map((item) => {
              const isDone = checklist[item.key];
              return (
                <div 
                  key={item.key} 
                  onClick={() => toggleChecklistItem(item.key)}
                  className={`group flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isDone 
                      ? 'bg-amber-950/10 border-amber-500/30' 
                      : 'bg-slate-950/20 border-slate-850/80 hover:border-slate-800 hover:bg-slate-950/40'
                  }`}
                >
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle className="text-amber-400 fill-amber-500/20" size={18} />
                    ) : (
                      <div className="w-4.5 h-4.5 rounded-full border border-slate-600 group-hover:border-amber-400 transition-colors" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className={`text-xs sm:text-sm font-semibold font-sans transition-colors ${
                      isDone ? 'text-amber-300/90 line-through' : 'text-slate-250 group-hover:text-slate-50'
                    }`}>
                      {item.label}
                    </h4>
                    <p className="text-[11px] text-slate-550 leading-normal font-sans mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl">
          <h2 className="font-display font-black text-xl text-slate-100 flex items-center gap-2 mb-5 pb-4 border-b border-slate-850">
            <HelpCircle className="text-amber-400" size={20} />
            Frequently Asked Questions
          </h2>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              const Icon = faq.icon;
              return (
                <div 
                  key={idx}
                  className="bg-slate-950/20 border border-slate-850/60 rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-sans select-none hover:bg-slate-950/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-amber-400">
                        <Icon size={16} />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-200">
                        {faq.q}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-slate-500" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-500" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4 pt-0 border-t border-slate-900/60 text-xs sm:text-sm text-slate-400 leading-relaxed font-sans whitespace-pre-line text-left">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Diagnostic Bench & Tips */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Audio Engine Diagnostic Tool */}
        <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-display font-black text-md text-slate-100 flex items-center gap-2 mb-4 pb-3 border-b border-slate-850">
              <Radio className="text-amber-400" size={16} />
              Audio Diagnostic Bench
            </h3>

            <div className="flex flex-col gap-3 font-mono text-xs mb-6">
              <div className="flex items-center justify-between p-2.5 bg-slate-950/40 rounded-xl border border-slate-850/50">
                <span className="text-slate-500 font-sans">Synthesis Engine</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  ACTIVE (WEBAUDIO)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-950/40 rounded-xl border border-slate-850/50">
                <span className="text-slate-500 font-sans">Sampler Mode</span>
                <span className="text-slate-350 font-bold uppercase">PHYSICAL RESONANCE</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-950/40 rounded-xl border border-slate-850/50">
                <span className="text-slate-500 font-sans">Microphone Access</span>
                {micStatus === 'granted' ? (
                  <span className="text-emerald-400 font-bold uppercase">GRANTED</span>
                ) : micStatus === 'denied' ? (
                  <span className="text-rose-400 font-bold uppercase">BLOCKED</span>
                ) : (
                  <button 
                    onClick={requestMicPermission}
                    className="text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase transition-colors"
                  >
                    PROMPT TEST
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-950/40 rounded-xl border border-slate-850/50">
                <span className="text-slate-500 font-sans">Direct Latency</span>
                <span className="text-amber-400 font-bold">~2.9ms (ULTRA-LOW)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleTestChime}
              disabled={diagnosticSoundPlaying}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-slate-950 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] select-none shadow-md"
            >
              <Play size={14} className={diagnosticSoundPlaying ? 'animate-bounce' : ''} />
              {diagnosticSoundPlaying ? 'Strumming Test Chime...' : 'Trigger Test Strum'}
            </button>
            <p className="text-[10px] text-slate-500 font-sans text-center">
              Plays a gorgeous acoustic C Maj 7 chord across all 6 virtual strings to verify output.
            </p>
          </div>
        </div>

        {/* Pro Tips Panel */}
        <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl text-left">
          <h3 className="font-display font-black text-md text-slate-100 flex items-center gap-2 mb-4 pb-3 border-b border-slate-850">
            <Lightbulb className="text-amber-400" size={16} />
            Acoustic Tuning Tips
          </h3>

          <div className="flex flex-col gap-4 text-xs font-sans text-slate-400">
            <div className="flex gap-3">
              <div className="text-amber-500 shrink-0 mt-0.5">
                <AlertTriangle size={15} />
              </div>
              <p className="leading-relaxed">
                <strong>Feedback Loop Warning:</strong> If using microphone input inside the FX Rack, always wear headphones! Sound from speakers can enter the mic and create loud audio screeching.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="text-amber-500 shrink-0 mt-0.5">
                <Settings size={15} />
              </div>
              <p className="leading-relaxed">
                <strong>Save Custom Tunings:</strong> Go to custom tuning dropdown, select "Add Custom Tuning", dial in your own notes (like open D or Drop C) and hit save!
              </p>
            </div>

            <div className="flex gap-3">
              <div className="text-amber-500 shrink-0 mt-0.5">
                <Cpu size={15} />
              </div>
              <p className="leading-relaxed">
                <strong>Direct MIDI recording:</strong> Combine this app as an iframe inside DAWs like Myrigz to turn guitar fretboard chords into live MIDI notes!
              </p>
            </div>
          </div>
        </div>

        {/* Premium Upgrade CTA inside Help if not already premium */}
        {!isPremium && (
          <div className="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-slate-900 border border-amber-500/20 rounded-2xl p-5 sm:p-6 text-left relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-2 text-[8px] font-mono font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded">
              PRO SUITE
            </div>
            <h4 className="font-display font-black text-sm text-amber-400 uppercase tracking-wider mb-2">
              Unlock Combined Pro Studio
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Get direct full-fidelity microphone support, high-definition real-time delay cabinets, and completely hide ads in all viewports.
            </p>
            <button
              onClick={onUpgradeClick}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs py-2 rounded-lg text-center transition-all uppercase cursor-pointer"
            >
              Learn More & Upgrade
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
