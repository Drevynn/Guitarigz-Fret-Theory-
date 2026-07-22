import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Upload, FileAudio, Play, Pause, Sparkles, Copy, Download, Check, Music, Volume2, RefreshCw, Send, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NoteName, ScaleType } from '../types';

interface MeasureData {
  measureNumber: number;
  chords: string;
  notesText: string;
  tabAscii: string;
  tip: string;
}

interface TranscriptionResult {
  title: string;
  keySignature: string;
  estimatedBpm: number;
  timeSignature: string;
  tuning: string;
  summary: string;
  chordsIdentified: string[];
  techniquesUsed: string[];
  tabText: string;
  measures: MeasureData[];
}

interface AudioTabTranscriberProps {
  theme: any;
  onSelectKey?: (root: NoteName, scale: ScaleType) => void;
  activeTuningName?: string;
}

// Sample fallback presets for instant testing
const SAMPLE_PRESETS = [
  {
    id: 'acoustic-fingerstyle',
    title: 'Acoustic Fingerstyle Lick in G Major',
    style: 'Acoustic Folk / Travis Picking',
    keySignature: 'G Major',
    estimatedBpm: 110,
    timeSignature: '4/4',
    tuning: 'Standard E A D G B E',
    summary: 'A warm Travis-picking acoustic arpeggiated movement transitioning from G to Cadd9 and Dsus4 with subtle hammer-ons on the B and D strings.',
    chordsIdentified: ['G', 'Cadd9', 'Dsus4', 'Em7'],
    techniquesUsed: ['Travis Picking', 'Hammer-on', 'Pull-off', 'Let Ring'],
    tabText: `e|-------3-------3-------|-------3-------3-------|
B|---0-----0---1-----1---|---3-----3---0-----0---|
G|-----0---------0-------|-----2---------0-------|
D|-----------2-----------|-0---------------------|
A|-------------------3---|-----------2-----------|
E|-3---------------------|-------------------3---|
   m1 (G -> Cadd9)         m2 (Dsus4 -> Em7)`,
    measures: [
      {
        measureNumber: 1,
        chords: 'G -> Cadd9',
        notesText: 'G3 - D4 - G4 - B4 - C4 - E4 - G4',
        tabAscii: `e|-------3-------3-------|\nB|---0-----0---1-----1---|\nG|-----0---------0-------|\nD|-----------2-----------|\nA|-------------------3---|\nE|-3---------------------|`,
        tip: 'Keep your thumb alternating steadily between the low E and D strings while index and middle fingers pluck treble melody notes.'
      },
      {
        measureNumber: 2,
        chords: 'Dsus4 -> Em7',
        notesText: 'D4 - A4 - D5 - F#4 - E3 - B3 - G4',
        tabAscii: `e|-------3-------3-------|\nB|---3-----3---0-----0---|\nG|-----2---------0-------|\nD|-0---------------------|\nA|-----------2-----------|\nE|-------------------3---|`,
        tip: 'Freely let the High E string sustain at fret 3 for a lush modal drone.'
      }
    ]
  },
  {
    id: 'blues-lead-e',
    title: 'Texas Blues Pentatonic Solo Run in E',
    style: 'Electric Blues / Expressive Bends',
    keySignature: 'E Minor',
    estimatedBpm: 92,
    timeSignature: '12/8',
    tuning: 'Standard E A D G B E',
    summary: 'High-octane SRV-style pentatonic box 1 lead lick utilizing full-step bends on the G string, rapid pull-offs to the open B string, and wide vibrato.',
    chordsIdentified: ['E7', 'A7', 'B7'],
    techniquesUsed: ['Full Bend', 'Pull-off', 'Wide Vibrato', 'Rake'],
    tabText: `e|-------12-15p12-------12---------|
B|-----12---------15b17----15-12---|
G|-14b16-------------------------14|
D|---------------------------------|
A|---------------------------------|
E|---------------------------------|
   m1 (Pentatonic Box 1 Lead)`,
    measures: [
      {
        measureNumber: 1,
        chords: 'E7 (I Chord)',
        notesText: 'D4 -> E4 - G4 - E4 - B4 - D5 - E5',
        tabAscii: `e|-------12-15p12-------12---------|\nB|-----12---------15b17----15-12---|\nG|-14b16-------------------------14|\nD|---------------------------------|\nA|---------------------------------|\nE|---------------------------------|`,
        tip: 'Rake softly across muted lower strings before landing the 14th fret G string bend for maximum Texas blues bite.'
      }
    ]
  }
];

export default function AudioTabTranscriber({ theme, onSelectKey, activeTuningName }: AudioTabTranscriberProps) {
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // File upload state
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Processing state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(SAMPLE_PRESETS[0]);
  const [copied, setCopied] = useState(false);
  const [exportedToDaw, setExportedToDaw] = useState(false);

  // Recorder references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Live mic audio level meter
  const [audioLevel, setAudioLevel] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // Start audio recording
  const startRecording = async () => {
    setError(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setUploadedFileName(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      // Meter setup
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMeter = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };
      updateMeter();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // stop tracks
        stream.getTracks().forEach(track => track.stop());
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        setAudioLevel(0);
      };

      mediaRecorder.start(100);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 30) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err: any) {
      console.error('Microphone access error:', err);
      setError('Unable to access microphone. Please check permissions or upload an audio file instead.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setError('File size exceeds 20MB limit. Please upload a smaller audio clip.');
      return;
    }

    setUploadedFileName(file.name);
    setAudioBlob(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setError(null);
  };

  // Convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // strip base64 header (e.g. data:audio/webm;base64,)
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Perform AI Transcription via server route
  const processTranscription = async (blobToTranscribe?: Blob) => {
    const targetBlob = blobToTranscribe || audioBlob;
    if (!targetBlob) {
      setError('Please record audio or upload a guitar file first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base64 = await blobToBase64(targetBlob);
      const res = await fetch('/api/ai/transcribe-guitar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64,
          mimeType: targetBlob.type || 'audio/webm',
          tuningInfo: activeTuningName || 'Standard E A D G B E',
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to transcribe audio.');
      }

      const result: TranscriptionResult = await res.json();
      setTranscription(result);
    } catch (err: any) {
      console.error('Transcription error:', err);
      setError(err.message || 'Error communicating with Gemini audio transcriber.');
    } finally {
      setLoading(false);
    }
  };

  // Playback control
  const togglePlayAudio = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Copy tab text
  const copyTabText = () => {
    if (!transcription) return;
    navigator.clipboard.writeText(
      `TITLE: ${transcription.title}\nKEY: ${transcription.keySignature} | BPM: ${transcription.estimatedBpm} | TUNING: ${transcription.tuning}\n\n${transcription.tabText}\n\nSUMMARY: ${transcription.summary}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download tab as file
  const downloadTab = () => {
    if (!transcription) return;
    const content = `=====================================================
${transcription.title.toUpperCase()}
=====================================================
Key Signature: ${transcription.keySignature}
Estimated BPM: ${transcription.estimatedBpm}
Time Signature: ${transcription.timeSignature}
Tuning: ${transcription.tuning}
Chords: ${transcription.chordsIdentified.join(', ')}
Techniques: ${transcription.techniquesUsed.join(', ')}

-----------------------------------------------------
TABLATURE LITERATURE
-----------------------------------------------------
${transcription.tabText}

-----------------------------------------------------
ANALYSIS & PERFORMANCE TIPS
-----------------------------------------------------
${transcription.summary}

${transcription.measures.map(m => `Measure ${m.measureNumber} (${m.chords}):
${m.notesText}
Tip: ${m.tip}
`).join('\n')}
`;

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${transcription.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_tab.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Export stem to DAW parent frame via postMessage protocol
  const exportStemToDaw = async () => {
    if (!audioBlob || !transcription) return;
    try {
      const base64Data = await blobToBase64(audioBlob);
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'sonar:import',
          audio_blob_base64: `data:${audioBlob.type || 'audio/webm'};base64,${base64Data}`,
          filename: `${transcription.title.replace(/[^a-zA-Z0-9]/g, '_')}_stem.webm`,
          mimetype: audioBlob.type || 'audio/webm',
        }, '*');
      }
      setExportedToDaw(true);
      setTimeout(() => setExportedToDaw(false), 3000);
    } catch (e) {
      console.error('DAW Export failed:', e);
    }
  };

  // Load key onto main fretboard
  const syncKeyToFretboard = () => {
    if (!transcription || !onSelectKey) return;
    const keyParts = transcription.keySignature.split(' ');
    const rootName = keyParts[0] as NoteName;
    const scaleType: ScaleType = keyParts[1]?.toLowerCase().includes('minor') ? 'natural_minor' : 'major';
    onSelectKey(rootName, scaleType);
  };

  return (
    <div className={`space-y-6 ${theme.textPrimary}`}>
      
      {/* 1. Header Banner */}
      <div className={`p-6 rounded-2xl ${theme.panelBg} border ${theme.border} shadow-xl relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className={`p-2 rounded-xl ${theme.badgeBg} ${theme.accentText} border ${theme.border}`}>
                <Music size={20} />
              </span>
              <h2 className="font-display font-black text-xl tracking-tight text-slate-100">
                Guitar Audio-to-Tab Transcriber
              </h2>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full ${theme.badgeBg} ${theme.badgeText} border ${theme.border}`}>
                Powered by Gemini AI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Play your guitar directly into the microphone or upload an audio file. Gemini converts raw fret audio into 6-string ASCII tab literature, detects tempo and key signatures, identifies chords, and breaks down playing techniques step-by-step.
            </p>
          </div>

          {/* Quick preset selector for instant testing */}
          <div className="flex flex-col gap-1 shrink-0">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Try Sample Licks:</span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setTranscription(preset);
                    setAudioBlob(null);
                    setAudioUrl(null);
                    setUploadedFileName(null);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    transcription?.title === preset.title
                      ? theme.btnActive
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {preset.style.split(' / ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Recording & Upload Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card A: Live Microphone Recorder */}
        <div className={`p-5 rounded-2xl ${theme.panelBg} border ${theme.border} flex flex-col justify-between space-y-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className={`${isRecording ? 'text-red-500 animate-pulse' : theme.accentText}`} size={18} />
              <h3 className="font-bold text-sm text-slate-200">Option 1: Record Microphone Input</h3>
            </div>
            {isRecording && (
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/40 text-[11px] font-mono font-bold rounded-md animate-pulse">
                REC 0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 0:30
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Noodle or play a riff on your guitar for 5–20 seconds. Ensure clear string articulation.
          </p>

          {/* Live Audio Level Meter */}
          {isRecording && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Mic Level Meter:</span>
                <span>{audioLevel}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-75"
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
            </div>
          )}

          {/* Record Actions */}
          <div className="flex items-center gap-3 pt-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg ${theme.btnActive}`}
              >
                <Mic size={15} />
                <span>Start Recording Lick</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg animate-bounce"
              >
                <MicOff size={15} />
                <span>Stop Recording</span>
              </button>
            )}
          </div>
        </div>

        {/* Card B: File Upload */}
        <div className={`p-5 rounded-2xl ${theme.panelBg} border ${theme.border} flex flex-col justify-between space-y-4`}>
          <div className="flex items-center gap-2">
            <Upload className={theme.accentText} size={18} />
            <h3 className="font-bold text-sm text-slate-200">Option 2: Upload Audio File</h3>
          </div>

          <p className="text-xs text-slate-400">
            Upload an existing guitar audio recording (.wav, .mp3, .m4a, .webm) up to 20MB.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed ${theme.border} hover:border-amber-500/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950/40 flex flex-col items-center gap-1 group`}
          >
            <FileAudio size={24} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
            <span className="text-xs font-semibold text-slate-300">
              {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Click to browse or drop guitar audio'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">WAV, MP3, WEBM, M4A</span>
          </div>

          {/* Trigger AI Action */}
          <button
            onClick={() => processTranscription()}
            disabled={!audioBlob || loading}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
              audioBlob && !loading
                ? theme.btnActive
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Gemini Analyzing Fret Audio...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Transcribe Recorded/Uploaded Audio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audio Playback Player Bar if audio exists */}
      {audioUrl && (
        <div className={`p-4 rounded-xl bg-slate-950/80 border ${theme.border} flex items-center justify-between gap-4 shadow-inner`}>
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayAudio}
              className={`p-2.5 rounded-xl ${theme.accentBg} text-slate-950 font-bold hover:scale-105 transition-all shadow-md cursor-pointer`}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                {uploadedFileName || 'Recorded Guitar Capture'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Audio ready for AI Tab Literature conversion
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportStemToDaw}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Send size={12} className={exportedToDaw ? 'text-emerald-400' : 'text-slate-400'} />
              <span>{exportedToDaw ? 'Stem Sent to DAW!' : 'Send Stem to DAW'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 font-bold">Dismiss</button>
        </div>
      )}

      {/* Loading overlay indicator */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-8 rounded-2xl ${theme.panelBg} border ${theme.border} text-center space-y-4`}
        >
          <div className="inline-block p-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-spin">
            <Sparkles size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-100">Gemini Neural Audio Engine Transcribing Fretboard...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Detecting transient pitches, identifying chord inversions, and building clean 6-string ASCII tab literature with technique symbols.
          </p>
        </motion.div>
      )}

      {/* 3. Transcription Results Display */}
      {transcription && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Metadata Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-xl bg-slate-950/60 border ${theme.border} text-center space-y-1`}>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Key Signature</span>
              <span className={`text-base font-bold ${theme.accentText}`}>{transcription.keySignature}</span>
              {onSelectKey && (
                <button
                  onClick={syncKeyToFretboard}
                  className="text-[9px] font-mono text-slate-400 hover:text-slate-200 underline block mx-auto cursor-pointer"
                >
                  Load to Fretboard 🎯
                </button>
              )}
            </div>

            <div className={`p-3.5 rounded-xl bg-slate-950/60 border ${theme.border} text-center space-y-1`}>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Estimated Tempo</span>
              <span className="text-base font-bold text-slate-100 font-mono">{transcription.estimatedBpm} BPM</span>
              <span className="text-[9px] font-mono text-slate-400 block">{transcription.timeSignature} Time</span>
            </div>

            <div className={`p-3.5 rounded-xl bg-slate-950/60 border ${theme.border} text-center space-y-1`}>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Target Tuning</span>
              <span className="text-xs font-bold text-slate-200 block truncate">{transcription.tuning}</span>
            </div>

            <div className={`p-3.5 rounded-xl bg-slate-950/60 border ${theme.border} text-center space-y-1`}>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Chords Identified</span>
              <div className="flex flex-wrap justify-center gap-1">
                {transcription.chordsIdentified.map((ch, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-amber-400 font-mono">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Formatted ASCII Tab Literature View */}
          <div className={`p-6 rounded-2xl ${theme.panelBg} border ${theme.border} space-y-4 shadow-xl`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span>{transcription.title}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{transcription.summary}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyTabText}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied!' : 'Copy Tab'}</span>
                </button>

                <button
                  onClick={downloadTab}
                  className={`px-3 py-1.5 rounded-xl ${theme.btnActive} text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm`}
                >
                  <Download size={13} />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            {/* Techniques Tag Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">Techniques:</span>
              {transcription.techniquesUsed.map((tech, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-mono text-emerald-400 whitespace-nowrap">
                  ⚡ {tech}
                </span>
              ))}
            </div>

            {/* Main Tab ASCII Box */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl overflow-x-auto shadow-inner">
              <pre className="font-mono text-xs text-amber-300 leading-relaxed tracking-wider select-all">
                {transcription.tabText}
              </pre>
            </div>
          </div>

          {/* Measure-by-Measure Analysis Breakdown */}
          <div className={`p-6 rounded-2xl ${theme.panelBg} border ${theme.border} space-y-4`}>
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sparkles size={16} className={theme.accentText} />
              <span>Measure Literature Breakdown & Performance Tips</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transcription.measures.map((m) => (
                <div key={m.measureNumber} className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Measure {m.measureNumber}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono rounded">
                      Chords: {m.chords}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850 overflow-x-auto">
                    <pre className="font-mono text-[11px] text-amber-200/90 whitespace-pre">
                      {m.tabAscii}
                    </pre>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Notes:</strong> {m.notesText}
                  </p>
                  <p className="text-[11px] text-amber-400/90 italic bg-amber-500/5 p-2 rounded border border-amber-500/10">
                    💡 <strong>Tech Tip:</strong> {m.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      )}

    </div>
  );
}
