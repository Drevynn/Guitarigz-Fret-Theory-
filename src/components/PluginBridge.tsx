import { useState, useEffect, useRef } from 'react';
import { NoteName, ScaleType, Tuning } from '../types';
import {
  Link,
  Terminal,
  Cpu,
  Play,
  Pause,
  Copy,
  Check,
  CheckCircle,
  AlertCircle,
  Power,
  Music,
  Globe,
  RefreshCw,
  SlidersHorizontal,
  Wifi,
  WifiOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { playNote } from '../utils/audio';

// Interface defining the log items
interface LogEntry {
  id: string;
  time: string;
  direction: 'in' | 'out';
  type: string;
  details: string;
}

interface PluginBridgeProps {
  // Configured state from App.tsx
  instrument: 'guitar' | 'bass-4' | 'bass-5';
  handleInstrumentChange: (inst: 'guitar' | 'bass-4' | 'bass-5') => void;
  activeRoot: NoteName;
  activeScale: ScaleType;
  handleSelectKey: (root: NoteName, scale: ScaleType) => void;
  activeTuning: Tuning;
  setActiveTuningId: (id: string) => void;
  setCustomTuningNotes: (notes: number[]) => void;
  
  // Audio state & triggers
  muted: boolean;
  setMuted: (muted: boolean) => void;
  
  // Callback for when notes are triggered externally (MIDI or Simulator)
  onExternalNoteOn: (midi: number) => void;
  onExternalNoteOff: (midi: number) => void;
  externalActiveNotes: number[];
}

export default function PluginBridge({
  instrument,
  handleInstrumentChange,
  activeRoot,
  activeScale,
  handleSelectKey,
  activeTuning,
  setActiveTuningId,
  setCustomTuningNotes,
  muted,
  setMuted,
  onExternalNoteOn,
  onExternalNoteOff,
  externalActiveNotes
}: PluginBridgeProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isIframe, setIsIframe] = useState<boolean>(false);
  const [dawConnected, setDawConnected] = useState<boolean>(false);
  const [copiableCodeLang, setCopiableCodeLang] = useState<'js' | 'react'>('js');
  const [copied, setCopied] = useState<boolean>(false);
  
  // DAW Simulator States
  const [simBpm, setSimBpm] = useState<number>(120);
  const [simIsPlaying, setSimIsPlaying] = useState<boolean>(false);
  const [simActiveStep, setSimActiveStep] = useState<number>(0);
  const [simAudioRouting, setSimAudioRouting] = useState<'both' | 'internal' | 'host'>('both');
  
  // Web MIDI states
  const [midiSupported, setMidiSupported] = useState<boolean>(false);
  const [midiInputs, setMidiInputs] = useState<string[]>([]);
  const [activeMidiInput, setActiveMidiInput] = useState<string>('none');
  
  const logsEndRef = useRef<HTMLDivElement>(null);
  const stepTimerRef = useRef<number | null>(null);

  // Check if running inside an iframe
  useEffect(() => {
    const isWindowIframe = window.parent !== window;
    setIsIframe(isWindowIframe);
    
    // Auto-connect if we detect we're inside an iframe as a plugin
    if (isWindowIframe) {
      setDawConnected(true);
      addLog('in', 'DAW_DETECTED', 'Loaded inside DAW iframe. Awaiting handshake...');
      
      // Send initial connect signal to parent DAW
      window.parent.postMessage({
        source: 'guitarigz-plugin',
        type: 'PLUGIN_READY',
        capabilities: {
          instruments: ['guitar', 'bass-4', 'bass-5'],
          features: ['polyphonic-playback', 'scale-highlights', 'chord-voicings', 'custom-tuning']
        }
      }, '*');
      addLog('out', 'PLUGIN_READY', 'Capabilities packet sent to DAW host');
    }
  }, []);

  // Set up message listeners for parent postMessage triggers (The Plugin API)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Validate source if needed, but for plugin integration we accept postMessage from parents
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      
      // Check if this message is intended for the guitarigz plugin
      if (data.target !== 'guitarigz-plugin' && !data.type?.startsWith('DAW_')) return;
      
      const timestamp = new Date().toLocaleTimeString() + '.' + String(new Date().getMilliseconds()).padStart(3, '0');
      
      switch (data.type) {
        case 'DAW_CONNECT':
          setDawConnected(true);
          addLog('in', 'DAW_CONNECT', `Handshake received from DAW: "${data.dawName || 'Unknown DAW'}"`);
          // Reply with connected
          event.source?.postMessage({
            source: 'guitarigz-plugin',
            type: 'PLUGIN_CONNECTED',
            status: 'ready'
          }, event.origin as any);
          addLog('out', 'PLUGIN_CONNECTED', 'Handshake acknowledgment returned');
          break;
          
        case 'DAW_NOTE_ON':
          if (data.midi) {
            onExternalNoteOn(data.midi);
            addLog('in', 'DAW_NOTE_ON', `Pitch: ${data.midi} | Velocity: ${data.velocity || 127}`);
          }
          break;
          
        case 'DAW_NOTE_OFF':
          if (data.midi) {
            onExternalNoteOff(data.midi);
            addLog('in', 'DAW_NOTE_OFF', `Pitch: ${data.midi}`);
          }
          break;
          
        case 'DAW_SET_KEY':
          if (data.root && data.scaleType) {
            handleSelectKey(data.root, data.scaleType);
            addLog('in', 'DAW_SET_KEY', `Updated Global key to: ${data.root} ${data.scaleType}`);
          }
          break;
          
        case 'DAW_SET_INSTRUMENT':
          if (['guitar', 'bass-4', 'bass-5'].includes(data.instrument)) {
            handleInstrumentChange(data.instrument);
            addLog('in', 'DAW_SET_INSTRUMENT', `Switched instrument to: ${data.instrument}`);
          }
          break;
          
        case 'DAW_SET_TUNING':
          if (data.tuningId) {
            if (data.tuningId === 'custom' && Array.isArray(data.customNotes)) {
              setCustomTuningNotes(data.customNotes);
              setActiveTuningId('custom');
              addLog('in', 'DAW_SET_TUNING', `Configured Custom Tuning: [${data.customNotes.join(', ')}]`);
            } else {
              setActiveTuningId(data.tuningId);
              addLog('in', 'DAW_SET_TUNING', `Applied Tuning preset: ${data.tuningId}`);
            }
          }
          break;
          
        case 'DAW_SYNC_TEMPO':
          setSimBpm(data.bpm || 120);
          setSimIsPlaying(!!data.isPlaying);
          addLog('in', 'DAW_SYNC_TEMPO', `Sync BPM: ${data.bpm || 120} | Playhead: ${data.isPlaying ? 'PLAY' : 'PAUSED'}`);
          break;
          
        default:
          addLog('in', data.type || 'UNKNOWN', JSON.stringify(data));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleInstrumentChange, handleSelectKey, setActiveTuningId, setCustomTuningNotes, onExternalNoteOn, onExternalNoteOff]);

  // Web MIDI API setup
  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      setMidiSupported(true);
      navigator.requestMIDIAccess()
        .then((access) => {
          const inputs = Array.from(access.inputs.values());
          setMidiInputs(inputs.map(i => i.name || 'Generic MIDI Device'));
          
          if (inputs.length > 0) {
            setActiveMidiInput(inputs[0].name || 'Device 1');
            
            // Set up MIDI note listeners
            inputs.forEach((input) => {
              input.onmidimessage = (message) => {
                const [command, note, velocity] = message.data;
                const cmdType = command & 0xf0;
                
                if (cmdType === 144 && velocity > 0) { // Note on
                  onExternalNoteOn(note);
                  addLog('in', 'MIDI_KEYBOARD_NOTE_ON', `Pitch: ${note} | Vel: ${velocity} (${input.name})`);
                  
                  // Forward as plugin trigger back to DAW parent as well!
                  if (window.parent !== window) {
                    window.parent.postMessage({
                      source: 'guitarigz-plugin',
                      type: 'PLUGIN_NOTE_PLAYED',
                      midi: note,
                      velocity: velocity
                    }, '*');
                  }
                } else if (cmdType === 128 || (cmdType === 144 && velocity === 0)) { // Note off
                  onExternalNoteOff(note);
                  addLog('in', 'MIDI_KEYBOARD_NOTE_OFF', `Pitch: ${note} (${input.name})`);
                }
              };
            });
          }
        })
        .catch(() => {
          setMidiSupported(false);
        });
    }
  }, [onExternalNoteOn, onExternalNoteOff]);

  // DAW Step Sequencer Simulation Loop
  useEffect(() => {
    if (simIsPlaying) {
      const stepDurationMs = (60000 / simBpm) / 2; // Eighth notes
      
      const tick = () => {
        setSimActiveStep(prev => {
          const next = (prev + 1) % 16;
          
          // Trigger a beautiful melodic guitar/bass arpeggio sequence based on scale notes!
          // We can calculate notes relative to the active scale root
          const scaleRootMidi = getRootMidi(activeRoot, instrument);
          const chordIntervals = [0, 4, 7, 11, 12, 16, 19, 23]; // Major 7th arpeggio map
          const bassIntervals = [0, 7, 12, 5, 0, 7, 12, 10]; // Cool bass line intervals
          
          const stepNoteIndex = next % 8;
          let offset = instrument.startsWith('bass') 
            ? bassIntervals[stepNoteIndex] 
            : chordIntervals[stepNoteIndex];
            
          let finalMidi = scaleRootMidi + offset;
          
          // Trigger notes on specific steps to make a rhythmic loop
          const rhythmGrid = [true, false, true, false, true, true, false, true, true, false, true, false, true, true, false, false];
          if (rhythmGrid[next]) {
            // Trigger note on
            if (simAudioRouting !== 'host') {
              playNote(finalMidi, 0, 0.4);
            }
            onExternalNoteOn(finalMidi);
            
            // Record simulated incoming message
            addLog('in', 'SIMULATED_NOTE_ON', `Step: ${next + 1} | Pitch: ${finalMidi} | Freq: ${Math.round(440 * Math.pow(2, (finalMidi-69)/12))}Hz`);
            
            // Simulate postMessage out
            if (window.parent !== window) {
              window.parent.postMessage({
                source: 'guitarigz-plugin',
                type: 'PLUGIN_NOTE_PLAYED',
                midi: finalMidi,
                step: next
              }, '*');
            }
            
            // Auto off shortly
            setTimeout(() => {
              onExternalNoteOff(finalMidi);
            }, 180);
          }
          
          return next;
        });
        
        stepTimerRef.current = window.setTimeout(tick, stepDurationMs);
      };
      
      stepTimerRef.current = window.setTimeout(tick, stepDurationMs);
    } else {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
        stepTimerRef.current = null;
      }
    }
    
    return () => {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
      }
    };
  }, [simIsPlaying, simBpm, activeRoot, instrument, simAudioRouting, onExternalNoteOn, onExternalNoteOff]);

  // Helper to get MIDI number for root
  const getRootMidi = (root: NoteName, inst: 'guitar' | 'bass-4' | 'bass-5'): number => {
    const rootOffsets: Record<NoteName, number> = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
      'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };
    const offset = rootOffsets[root];
    if (inst === 'bass-4' || inst === 'bass-5') {
      return 28 + offset; // Bass low octave (E1 is MIDI 28)
    }
    return 40 + offset; // Guitar low octave (E2 is MIDI 40)
  };

  const addLog = (direction: 'in' | 'out', type: string, details: string) => {
    const timestamp = new Date().toLocaleTimeString() + '.' + String(new Date().getMilliseconds()).padStart(3, '0');
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      time: timestamp,
      direction,
      type,
      details
    };
    setLogs(prev => {
      const next = [...prev, newEntry];
      // Keep last 100 entries
      if (next.length > 100) next.shift();
      return next;
    });
  };

  // Scroll to bottom of logs automatically
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const clearLogs = () => {
    setLogs([]);
  };

  const handleCopyCode = () => {
    const code = copiableCodeLang === 'js' ? jsCode : reactCode;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Copiable javascript code snippets
  const jsCode = `// 1. Load Guitarigz Fretboard inside your DAW as an Iframe
const iframe = document.createElement('iframe');
iframe.src = "https://ais-pre-ws7h5dacpe6bf4xt3bdagk-186944557149.us-west1.run.app";
iframe.style.width = "100%";
iframe.style.height = "650px";
iframe.style.border = "none";
document.body.appendChild(iframe);

// 2. LISTEN to MIDI Note-Out played inside the Guitarigz Plugin (Fret clicks, chord strumming)
window.addEventListener('message', (event) => {
  const data = event.data;
  if (data.source === 'guitarigz-plugin') {
    if (data.type === 'PLUGIN_NOTE_PLAYED') {
      console.log(\`[DAW Recorded Note] Pitch: \${data.midi} | String: \${data.stringIndex}\`);
      // --> Pass this to your DAW's synth, piano roll, or drum machine recorder!
      triggerSynthInDaw(data.midi, data.velocity || 127);
    }
  }
});

// 3. SEND Note-In / Commands into the Plugin (Highlights notes, plays internal synth)
function triggerPluginNote(midi, velocity = 127, isOn = true) {
  iframe.contentWindow.postMessage({
    target: 'guitarigz-plugin',
    type: isOn ? 'DAW_NOTE_ON' : 'DAW_NOTE_OFF',
    midi: midi,
    velocity: velocity
  }, '*');
}

// 4. SYNC DAW States (BPM, Scale, Key Tuning) into the Plugin
function syncDawToPlugin(bpm, keyRoot, scale) {
  iframe.contentWindow.postMessage({
    target: 'guitarigz-plugin',
    type: 'DAW_SET_KEY',
    root: keyRoot, // e.g. "G"
    scaleType: scale // e.g. "aeolian"
  }, '*');
}`;

  const reactCode = `import React, { useRef, useEffect } from 'react';

export function GuitarigzDawPlugin() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Send Note On to Fretboard plugin
  const sendNoteToPlugin = (midiPitch: number, isNoteOn: boolean) => {
    iframeRef.current?.contentWindow?.postMessage({
      target: 'guitarigz-plugin',
      type: isNoteOn ? 'DAW_NOTE_ON' : 'DAW_NOTE_OFF',
      midi: midiPitch,
      velocity: 100
    }, '*');
  };

  useEffect(() => {
    // Listen for recorded notes coming OUT of the fretboard
    const handlePluginOutput = (e: MessageEvent) => {
      const data = e.data;
      if (data.source === 'guitarigz-plugin') {
        if (data.type === 'PLUGIN_NOTE_PLAYED') {
          console.log("Guitarigz chord/fret clicked:", data.midi);
          // Play in DAW host synth
        }
      }
    };

    window.addEventListener('message', handlePluginOutput);
    return () => window.removeEventListener('message', handlePluginOutput);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="https://ais-pre-ws7h5dacpe6bf4xt3bdagk-186944557149.us-west1.run.app"
      className="w-full h-[680px] rounded-2xl border border-slate-800"
      title="Guitarigz DAW Plugin"
    />
  );
}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1.2fr] gap-6" id="plugin-bridge-workspace">
      
      {/* LEFT COLUMN: Controls & Integration Hub */}
      <div className="flex flex-col gap-6">
        
        {/* Connection status header */}
        <div className="bg-slate-950/40 p-5 rounded-3xl border border-slate-850 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl flex items-center justify-center ${
              dawConnected 
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' 
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
            }`}>
              {dawConnected ? <Wifi size={24} /> : <WifiOff size={24} />}
            </div>
            
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h4 className="font-display font-black text-sm tracking-wide uppercase text-slate-100">
                  DAW Plugin Connection State
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider uppercase ${
                  dawConnected 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/10 text-amber-450 border border-amber-500/20'
                }`}>
                  {dawConnected ? 'CONNECTED TO HOST' : 'STANDALONE MODE'}
                </span>
              </div>
              
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isIframe 
                  ? "Plugin loaded inside parent frame host. Web postMessage API is fully synchronized."
                  : "Running standalone. Use the Simulator below to test how your DAW will control this plugin."
                }
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isIframe && (
              <button
                onClick={() => setDawConnected(!dawConnected)}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
                  dawConnected
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Power size={13} />
                {dawConnected ? 'Disconnect DAW' : 'Connect DAW'}
              </button>
            )}
          </div>
        </div>

        {/* 1. Interactive DAW Simulator Playground */}
        <div className="bg-slate-950/40 p-6 rounded-3xl border border-slate-850 shadow-xl flex flex-col gap-5 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-850">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350">
                Live DAW Simulator & Test Deck
              </h4>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-850 rounded-xl text-[10px] text-slate-500 font-mono">
              <span>MIDI Status:</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-emerald-400 font-bold uppercase">Ready</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Launch the mock DAW sequencer loop to send custom arpeggios, sync BPM playheads, and trigger active notes into the visual fretboard. You can adjust settings dynamically below:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-850/60">
            {/* Playback Controls */}
            <div className="flex flex-col gap-3 justify-center">
              <div className="text-xs font-semibold text-slate-400">Sequencer Status:</div>
              <div className="flex items-center gap-3">
                <button
                  id="sim-play-pause"
                  onClick={() => setSimIsPlaying(!simIsPlaying)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs shadow transition-all cursor-pointer ${
                    simIsPlaying
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-450'
                  }`}
                >
                  {simIsPlaying ? (
                    <>
                      <Pause size={14} className="fill-red-400" />
                      Pause Loop
                    </>
                  ) : (
                    <>
                      <Play size={14} className="fill-slate-950" />
                      Run DAW Loop
                    </>
                  )}
                </button>
                
                <div className="flex items-center justify-center px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl font-mono text-xs font-bold text-slate-200">
                  Step: <span className="text-amber-500 ml-1.5">{simIsPlaying ? simActiveStep + 1 : '--'}</span>
                </div>
              </div>
            </div>

            {/* BPM & Tempo Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold">Simulated DAW BPM:</span>
                <span className="font-mono text-amber-500 font-bold">{simBpm} BPM</span>
              </div>
              <div className="flex items-center gap-3">
                <SlidersHorizontal size={14} className="text-slate-500" />
                <input
                  id="bpm-slider"
                  type="range"
                  min="60"
                  max="200"
                  value={simBpm}
                  onChange={(e) => setSimBpm(parseInt(e.target.value))}
                  className="flex-1 accent-amber-500 h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Audio Router */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400">Audio Routing Mode:</label>
              <select
                id="select-audio-routing"
                value={simAudioRouting}
                onChange={(e: any) => setSimAudioRouting(e.target.value)}
                className="bg-slate-900 border border-slate-850 px-3 py-2 rounded-xl text-xs text-slate-250 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="both">Both (Play Synth & Relay MIDI Out)</option>
                <option value="internal">Internal Sound Synthesis Only</option>
                <option value="host">External DAW Host MIDI Relay Only</option>
              </select>
            </div>

            {/* Web MIDI input listener */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400">Web MIDI Input Device:</label>
              <div className="relative">
                {midiSupported ? (
                  <select
                    id="select-midi-device"
                    value={activeMidiInput}
                    onChange={(e) => setActiveMidiInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-850 px-3 py-2 rounded-xl text-xs text-slate-250 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
                    disabled={midiInputs.length === 0}
                  >
                    {midiInputs.length === 0 ? (
                      <option value="none">No MIDI keyboards found</option>
                    ) : (
                      midiInputs.map((input, idx) => (
                        <option key={idx} value={input}>{input}</option>
                      ))
                    )}
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-slate-900 border border-slate-850/40 rounded-xl text-xs text-slate-500">
                    Web MIDI is disabled/not supported
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick interactive trigger keys for manual testing */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400">Trigger Mock DAW Fretboard Hits:</span>
            <div className="flex flex-wrap gap-2">
              {[48, 52, 55, 59, 60, 64, 67, 71].map((midi) => {
                const isPressed = externalActiveNotes.includes(midi);
                return (
                  <button
                    key={midi}
                    onMouseDown={() => {
                      if (simAudioRouting !== 'host') playNote(midi, 0, 0.8);
                      onExternalNoteOn(midi);
                      addLog('in', 'MANUAL_DAW_NOTE_ON', `Pitch: ${midi}`);
                    }}
                    onMouseUp={() => {
                      onExternalNoteOff(midi);
                    }}
                    onMouseLeave={() => {
                      if (isPressed) onExternalNoteOff(midi);
                    }}
                    className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all duration-150 select-none cursor-pointer ${
                      isPressed
                        ? 'bg-amber-500 border-amber-400 text-slate-950 scale-95 shadow-inner'
                        : 'bg-slate-900 border-slate-850 hover:border-slate-750 text-slate-300'
                    }`}
                  >
                    MIDI {midi}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Integration Code Box */}
        <div className="bg-slate-950/40 p-6 rounded-3xl border border-slate-850 shadow-xl flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-slate-850">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350">
                DAW Integration Code Blueprint
              </h4>
            </div>
            
            <div className="flex bg-slate-900 p-0.5 border border-slate-800 rounded-lg">
              <button
                onClick={() => setCopiableCodeLang('js')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition-all ${
                  copiableCodeLang === 'js' ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                Vanilla JS
              </button>
              <button
                onClick={() => setCopiableCodeLang('react')}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition-all ${
                  copiableCodeLang === 'react' ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                React code
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Ready to plug Guitarigz into your custom DAW project? Simply embed this application as an iframe and use standard window postMessage handlers as structured below:
          </p>

          <div className="relative">
            <pre className="p-4 bg-slate-950 border border-slate-900 rounded-2xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[320px] scrollbar-thin leading-relaxed">
              <code>{copiableCodeLang === 'js' ? jsCode : reactCode}</code>
            </pre>
            
            <button
              onClick={handleCopyCode}
              className="absolute top-3 right-3 p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-all shadow-md cursor-pointer"
              title="Copy Integration Code"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Terminal Log Monitor */}
      <div className="flex flex-col">
        <div className="bg-slate-950/60 p-6 rounded-3xl border border-slate-850/80 shadow-2xl flex flex-col h-full min-h-[500px] text-left">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-850">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-amber-500 animate-pulse" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350">
                Bridge Web Message Log Feed
              </h4>
            </div>
            
            <button
              onClick={clearLogs}
              className="text-[10px] font-mono px-2.5 py-1 hover:bg-slate-900 border border-slate-850 rounded-lg text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
            >
              Clear Log Feed
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans mt-3">
            Real-time telemetry trace monitor. Watch as MIDI signals, handshake packets, and chord event logs flow securely through the window bridge:
          </p>

          {/* Terminal stream */}
          <div className="flex-1 bg-slate-950 border border-slate-900 rounded-2xl p-4 font-mono text-[11px] text-slate-400 overflow-y-auto mt-4 max-h-[580px] flex flex-col gap-2.5 scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-900/60 shadow-inner">
            {logs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-2">
                <Terminal size={24} className="opacity-40" />
                <span>Log feed is empty. Trigger some DAW keys or notes to trace live activities!</span>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="border-b border-slate-900/40 pb-2 leading-normal">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-600 font-mono">{log.time}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider ${
                      log.direction === 'in'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/10'
                    }`}>
                      {log.direction === 'in' ? '→ INCOMING' : '← OUTGOING'}
                    </span>
                  </div>
                  <div className="flex items-start gap-1">
                    <span className="text-amber-500/90 font-bold">{log.type}</span>
                    <span className="text-slate-350">{log.details}</span>
                  </div>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>

          <div className="mt-4 p-3.5 bg-slate-900/40 rounded-xl border border-slate-850/60 flex items-start gap-2 text-xs">
            <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-left leading-normal text-slate-400 font-sans">
              <strong>Fully Sandalone & Pluggable:</strong> By building a native postMessage layer, this identical code acts as an absolute standalone app, or compiles instantly as a multi-instance client inside your host DAW!
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
