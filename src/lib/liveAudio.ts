import { Effect } from '../types';

let audioCtx: AudioContext | null = null;
let micStream: MediaStream | null = null;
let sourceNode: MediaStreamAudioSourceNode | null = null;
let outputGainNode: GainNode | null = null;
let inputGainNode: GainNode | null = null;
let analyserNode: AnalyserNode | null = null;
let recDestNode: MediaStreamAudioDestinationNode | null = null;
let mediaRecorder: MediaRecorder | null = null;
let recordingChunks: Blob[] = [];
let currentEffectNodes: AudioNode[] = [];
let isRunning = false;
let _recording = false;

export function isRecording(): boolean {
  return _recording;
}

export function getLiveAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

export function isLiveRunning(): boolean {
  return isRunning;
}

export function getLiveAnalyser(): AnalyserNode | null {
  return analyserNode;
}

// Build a single effect node from an Effect definition
function buildEffectNode(ctx: AudioContext, effect: Effect): AudioNode[] {
  if (!effect.enabled) return [];

  const p = (name: string, fallback = 50) =>
    (effect.parameters.find((x) => x.name === name)?.value ?? fallback) / 100;
  const pRaw = (name: string, fallback = 50) =>
    effect.parameters.find((x) => x.name === name)?.value ?? fallback;

  const dryWet = (effect.dryWet ?? 50) / 100;

  switch (effect.type) {
    case "distortion":
    case "overdrive": {
      const drive = effect.type === "distortion" ? p("Gain") : p("Drive");
      const tone = p("Tone");
      const wsDrive = ctx.createWaveShaper();
      const k = drive * 400;
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i * 2) / 256 - 1;
        curve[i] = ((Math.PI + k) * x) / (Math.PI + k * Math.abs(x));
      }
      wsDrive.curve = curve;
      wsDrive.oversample = "4x";

      const toneFilter = ctx.createBiquadFilter();
      toneFilter.type = "lowpass";
      toneFilter.frequency.value = 800 + tone * 3200;

      const dryGain = ctx.createGain();
      const wetGain = ctx.createGain();
      dryGain.gain.value = 1 - dryWet;
      wetGain.gain.value = dryWet * 0.5;

      wsDrive.connect(toneFilter);
      toneFilter.connect(wetGain);

      return [wsDrive, wetGain, dryGain];
    }

    case "reverb": {
      const size = p("Size");
      const decay = p("Decay", 60);
      const mix = p("Mix", 40);

      const convolver = ctx.createConvolver();
      const length = Math.floor(ctx.sampleRate * (0.5 + size * 4.5));
      const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 1 + (1 - decay) * 5);
        }
      }
      convolver.buffer = buffer;

      const wetGain = ctx.createGain();
      const dryGain = ctx.createGain();
      wetGain.gain.value = (mix / 100) * dryWet;
      dryGain.gain.value = 1 - dryWet;

      convolver.connect(wetGain);
      return [convolver, wetGain, dryGain];
    }

    case "delay": {
      const timeMs = pRaw("Time", 350);
      const feedback = p("Feedback", 40);
      const mix = p("Mix", 35);

      const delayNode = ctx.createDelay(2.0);
      delayNode.delayTime.value = timeMs / 1000;

      const feedbackGain = ctx.createGain();
      feedbackGain.gain.value = Math.min(feedback, 0.9);

      const wetGain = ctx.createGain();
      const dryGain = ctx.createGain();
      wetGain.gain.value = mix * dryWet;
      dryGain.gain.value = 1 - dryWet;

      delayNode.connect(feedbackGain);
      feedbackGain.connect(delayNode);
      delayNode.connect(wetGain);

      return [delayNode, wetGain, dryGain];
    }

    case "chorus": {
      const rate = p("Rate", 30) * 5;
      const depth = p("Depth", 50) * 0.005;
      const mix = p("Mix", 45);

      const delayNode = ctx.createDelay(0.05);
      delayNode.delayTime.value = 0.02;

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = rate;
      lfoGain.gain.value = depth;
      lfo.connect(lfoGain);
      lfoGain.connect(delayNode.delayTime);
      lfo.start();

      const wetGain = ctx.createGain();
      const dryGain = ctx.createGain();
      wetGain.gain.value = (mix / 100) * dryWet;
      dryGain.gain.value = 1 - dryWet;

      delayNode.connect(wetGain);
      return [delayNode, wetGain, dryGain, lfo];
    }

    case "flanger": {
      const rate = p("Rate", 25) * 2;
      const depth = p("Depth", 55) * 0.003;
      const feedback = p("Feedback", 40) * 0.7;

      const delayNode = ctx.createDelay(0.02);
      delayNode.delayTime.value = 0.005;

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = rate;
      lfoGain.gain.value = depth;
      lfo.connect(lfoGain);
      lfoGain.connect(delayNode.delayTime);
      lfo.start();

      const feedbackGain = ctx.createGain();
      feedbackGain.gain.value = feedback;
      delayNode.connect(feedbackGain);

      const wetGain = ctx.createGain();
      const dryGain = ctx.createGain();
      wetGain.gain.value = dryWet;
      dryGain.gain.value = 1 - dryWet;

      delayNode.connect(wetGain);
      return [delayNode, feedbackGain, wetGain, dryGain, lfo];
    }

    case "phaser": {
      const rate = p("Rate", 35) * 3;

      const allpass = ctx.createBiquadFilter();
      allpass.type = "allpass";
      allpass.frequency.value = 1000;
      allpass.Q.value = 10;

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = rate;
      lfoGain.gain.value = 800;
      lfo.connect(lfoGain);
      lfoGain.connect(allpass.frequency);
      lfo.start();

      const wetGain = ctx.createGain();
      const dryGain = ctx.createGain();
      wetGain.gain.value = dryWet;
      dryGain.gain.value = 1 - dryWet;

      allpass.connect(wetGain);
      return [allpass, wetGain, dryGain, lfo];
    }

    case "compressor": {
      const threshold = -pRaw("Threshold", 40);
      const ratio = pRaw("Ratio", 4);
      const attack = pRaw("Attack", 10) / 1000;
      const release = pRaw("Release", 100) / 1000;

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = threshold;
      comp.ratio.value = ratio;
      comp.attack.value = attack;
      comp.release.value = release;
      return [comp];
    }

    case "eq": {
      const low = (p("Low") - 0.5) * 24;
      const mid = (p("Mid") - 0.5) * 18;
      const high = (p("High") - 0.5) * 18;
      const presence = (p("Presence") - 0.5) * 12;

      const lowShelf = ctx.createBiquadFilter();
      lowShelf.type = "lowshelf";
      lowShelf.frequency.value = 200;
      lowShelf.gain.value = low;

      const midPeak = ctx.createBiquadFilter();
      midPeak.type = "peaking";
      midPeak.frequency.value = 1000;
      midPeak.Q.value = 1;
      midPeak.gain.value = mid;

      const highShelf = ctx.createBiquadFilter();
      highShelf.type = "highshelf";
      highShelf.frequency.value = 4000;
      highShelf.gain.value = high;

      const presencePeak = ctx.createBiquadFilter();
      presencePeak.type = "peaking";
      presencePeak.frequency.value = 3000;
      presencePeak.Q.value = 2;
      presencePeak.gain.value = presence;

      lowShelf.connect(midPeak);
      midPeak.connect(highShelf);
      highShelf.connect(presencePeak);
      return [lowShelf, presencePeak];
    }

    case "tremolo": {
      const rate = p("Rate", 45) * 12;
      const depth = p("Depth", 60) * 0.8;

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const tremoloGain = ctx.createGain();

      lfo.frequency.value = rate;
      lfoGain.gain.value = depth;
      tremoloGain.gain.value = 1;

      lfo.connect(lfoGain);
      lfoGain.connect(tremoloGain.gain);
      lfo.start();

      return [tremoloGain, lfo];
    }

    case "wah": {
      const position = p("Position");
      const range = p("Range", 70);

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 300 + position * range * 2500;
      filter.Q.value = 5;
      return [filter];
    }

    case "octave": {
      const octaveDown = p("Octave Down") > 0.3;
      if (!octaveDown) return [];

      const pitchGain = ctx.createGain();
      pitchGain.gain.value = 0.7;
      return [pitchGain];
    }

    default:
      return [];
  }
}

// Start live audio with effects chain
export async function startLiveInput(
  effects: Effect[],
  inputGain: number,
  outputGain: number
): Promise<void> {
  if (isRunning) await stopLiveInput();

  try {
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        latencyHint: "interactive",
      } as any,
    });

    const ctx = getLiveAudioContext();
    sourceNode = ctx.createMediaStreamSource(micStream);

    inputGainNode = ctx.createGain();
    inputGainNode.gain.value = inputGain / 100;

    outputGainNode = ctx.createGain();
    outputGainNode.gain.value = outputGain / 100;

    analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 1024;
    analyserNode.smoothingTimeConstant = 0.8;

    sourceNode.connect(inputGainNode);

    let lastNode: AudioNode = inputGainNode;
    currentEffectNodes = [];

    // Wire effects in series
    for (const effect of effects) {
      if (!effect.enabled) continue;
      const nodes = buildEffectNode(ctx, effect);
      if (nodes.length === 0) continue;

      const inputOfEffect = nodes[0];
      const outputOfEffect = nodes[nodes.length > 1 ? 1 : 0];

      // If there are dry/wet gain nodes (length >= 3), handle parallel routing
      if (nodes.length >= 3) {
        const wet = nodes[1] as GainNode;
        const dry = nodes[2] as GainNode;
        const merger = ctx.createGain();

        lastNode.connect(inputOfEffect);
        lastNode.connect(dry);

        wet.connect(merger);
        dry.connect(merger);

        lastNode = merger;
      } else {
        lastNode.connect(inputOfEffect);
        lastNode = outputOfEffect;
      }

      currentEffectNodes.push(...nodes);
    }

    recDestNode = ctx.createMediaStreamDestination();

    lastNode.connect(analyserNode);
    analyserNode.connect(outputGainNode);
    outputGainNode.connect(ctx.destination);
    outputGainNode.connect(recDestNode);

    isRunning = true;
  } catch (err) {
    isRunning = false;
    throw err;
  }
}

// Recording
export function startRecording(): void {
  if (!recDestNode || _recording) return;

  recordingChunks = [];
  const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : MediaRecorder.isTypeSupported("audio/webm")
    ? "audio/webm"
    : "audio/ogg";

  mediaRecorder = new MediaRecorder(recDestNode.stream, { mimeType });
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordingChunks.push(e.data);
  };
  mediaRecorder.start(100);
  _recording = true;
}

export function stopRecording(presetName?: string): void {
  if (!mediaRecorder || !_recording) return;
  _recording = false;

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordingChunks, { type: mediaRecorder!.mimeType });
    const ext = blob.type.includes("ogg") ? "ogg" : "webm";
    const name = presetName
      ? `guitarigz-${presetName.replace(/\s+/g, "-").toLowerCase()}.${ext}`
      : `guitarigz-recording.${ext}`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    recordingChunks = [];
  };
  mediaRecorder.stop();
}

// Stop live audio
export async function stopLiveInput(): Promise<void> {
  if (_recording) {
    _recording = false;
    try {
      mediaRecorder?.stop();
    } catch {}
    mediaRecorder = null;
    recordingChunks = [];
  }

  isRunning = false;

  currentEffectNodes.forEach((node) => {
    try {
      if (node instanceof OscillatorNode) node.stop();
      node.disconnect();
    } catch {}
  });
  currentEffectNodes = [];

  try { sourceNode?.disconnect(); } catch {}
  try { inputGainNode?.disconnect(); } catch {}
  try { outputGainNode?.disconnect(); } catch {}
  try { analyserNode?.disconnect(); } catch {}
  try { recDestNode?.disconnect(); } catch {}

  sourceNode = null;
  inputGainNode = null;
  outputGainNode = null;
  analyserNode = null;
  recDestNode = null;

  if (micStream) {
    micStream.getTracks().forEach((t) => t.stop());
    micStream = null;
  }
}

// Update gain levels on the fly
export function updateLiveGains(inputGain: number, outputGain: number): void {
  if (inputGainNode) inputGainNode.gain.value = inputGain / 100;
  if (outputGainNode) outputGainNode.gain.value = outputGain / 100;
}

// Get RMS level from analyser for VU meter
export function getLiveLevel(): number {
  if (!analyserNode) return 0;
  const data = new Float32Array(analyserNode.fftSize);
  analyserNode.getFloatTimeDomainData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
  return Math.sqrt(sum / data.length);
}
