/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Global AudioContext holder
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isMutedNode = false;
let noiseBuffer: AudioBuffer | null = null;

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
    noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }
  return noiseBuffer;
}

export function initAudio() {
  if (audioCtx) return;
  
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    // Setup master volume limit & limiter
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.5, audioCtx.currentTime); // Standard comfortable volume
    
    const limiter = audioCtx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-12, audioCtx.currentTime);
    limiter.knee.setValueAtTime(4, audioCtx.currentTime);
    limiter.ratio.setValueAtTime(12, audioCtx.currentTime);
    limiter.attack.setValueAtTime(0.003, audioCtx.currentTime);
    limiter.release.setValueAtTime(0.08, audioCtx.currentTime);

    masterGain.connect(limiter);
    limiter.connect(audioCtx.destination);
    
    console.log('Audio Engine initialized successfully');
  } catch (error) {
    console.error('Failed to initialize AudioContext', error);
  }
}

export function toggleAudioMute(): boolean {
  isMutedNode = !isMutedNode;
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(isMutedNode ? 0 : 0.5, audioCtx.currentTime);
  }
  return isMutedNode;
}

export function isAudioMuted(): boolean {
  return isMutedNode;
}

/**
 * Convert MIDI pitch class to frequency
 */
export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Plays a single synthesized guitar pluck node
 */
export function playNote(midi: number, delay = 0, duration = 0.8) {
  initAudio();
  if (!audioCtx || !masterGain || isMutedNode) return;

  // Resume context if browser suspended it (standard autoplays security)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const startTime = audioCtx.currentTime + delay;
  const freq = midiToFreq(midi);

  // 1. Triangular sub wave for woody acoustic resonance
  const oscBody = audioCtx.createOscillator();
  oscBody.type = 'triangle';
  oscBody.frequency.setValueAtTime(freq, startTime);

  // 2. Sine wave offset for metal string brightness bite
  const oscBite = audioCtx.createOscillator();
  oscBite.type = 'sine';
  oscBite.frequency.setValueAtTime(freq * 2.0, startTime); // One octave harmonic spike

  // Dynamic low pass tone filter sweep (Karplus-Strong approximation)
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(freq * 6, startTime);
  filter.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + 0.15);
  filter.Q.setValueAtTime(1, startTime);

  // Gain Envelopes
  const gainBody = audioCtx.createGain();
  const gainBite = audioCtx.createGain();

  // Attack-Decay-Sustain envelope for acoustic plucks
  gainBody.gain.setValueAtTime(0, startTime);
  gainBody.gain.linearRampToValueAtTime(0.35, startTime + 0.005); // Rapid attack
  gainBody.gain.exponentialRampToValueAtTime(0.05, startTime + 0.2); // Decay decay
  gainBody.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Soft sustain-release

  gainBite.gain.setValueAtTime(0, startTime);
  gainBite.gain.linearRampToValueAtTime(0.12, startTime + 0.004); // Metallic strike instant ping
  gainBite.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08); // Pluck decays incredibly fast

  // Hook everything up
  oscBody.connect(gainBody);
  oscBite.connect(gainBite);

  gainBody.connect(filter);
  gainBite.connect(filter);

  filter.connect(masterGain);

  // Start & Stop triggers
  oscBody.start(startTime);
  oscBite.start(startTime);

  oscBody.stop(startTime + duration + 0.1);
  oscBite.stop(startTime + duration + 0.1);
}

/**
 * Strum a list of notes with a short delay in between
 */
export function playStrum(midiNotes: number[], direction: 'down' | 'up' = 'down') {
  if (midiNotes.length === 0) return;
  
  // Sort from low to high for downstrum, high to low for upstrum
  const sortedNotes = [...midiNotes].filter(m => m > 0);
  if (direction === 'down') {
    sortedNotes.sort((a, b) => a - b);
  } else {
    sortedNotes.sort((a, b) => b - a);
  }

  sortedNotes.forEach((midi, idx) => {
    // 40ms strum spacing creates a lush organic sweep
    playNote(midi, idx * 0.045, 1.2);
  });
}

/**
 * Play synthesized Kick Drum with sub-bass drop and attack punch
 */
export function playKick(timeOffset = 0, volume = 0.8) {
  initAudio();
  if (!audioCtx || !masterGain || isMutedNode) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime + timeOffset;

  // Pitch sweep oscillator: 160Hz -> 35Hz
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.exponentialRampToValueAtTime(35, now + 0.08);

  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  // Transient punch click
  const clickOsc = audioCtx.createOscillator();
  const clickGain = audioCtx.createGain();
  clickOsc.type = 'triangle';
  clickOsc.frequency.setValueAtTime(300, now);
  clickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.02);
  clickGain.gain.setValueAtTime(volume * 0.4, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

  osc.connect(gain);
  clickOsc.connect(clickGain);

  gain.connect(masterGain);
  clickGain.connect(masterGain);

  osc.start(now);
  clickOsc.start(now);

  osc.stop(now + 0.5);
  clickOsc.stop(now + 0.05);
}

/**
 * Play synthesized Snare Drum with body tone + noise snare wires
 */
export function playSnare(timeOffset = 0, volume = 0.7) {
  initAudio();
  if (!audioCtx || !masterGain || isMutedNode) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime + timeOffset;

  // 1. Snare Body tone: pitch drop 180Hz -> 80Hz
  const bodyOsc = audioCtx.createOscillator();
  const bodyGain = audioCtx.createGain();
  bodyOsc.type = 'triangle';
  bodyOsc.frequency.setValueAtTime(180, now);
  bodyOsc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

  bodyGain.gain.setValueAtTime(volume * 0.7, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  bodyOsc.connect(bodyGain);
  bodyGain.connect(masterGain);

  // 2. Snare Wires: High-passed white noise buffer
  const buffer = getNoiseBuffer(audioCtx);
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = buffer;

  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.setValueAtTime(1200, now);

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(volume * 0.9, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);

  bodyOsc.start(now);
  noiseSource.start(now);

  bodyOsc.stop(now + 0.2);
  noiseSource.stop(now + 0.25);
}

/**
 * Play synthesized Hi-Hat (Closed / Open)
 */
export function playHiHat(timeOffset = 0, isClosed = true, volume = 0.5) {
  initAudio();
  if (!audioCtx || !masterGain || isMutedNode) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime + timeOffset;
  const duration = isClosed ? 0.05 : 0.3;

  const buffer = getNoiseBuffer(audioCtx);
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(7500, now);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume * 0.8, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  noiseSource.start(now);
  noiseSource.stop(now + duration + 0.05);
}

/**
 * Play synthesized Handclap
 */
export function playClap(timeOffset = 0, volume = 0.6) {
  initAudio();
  if (!audioCtx || !masterGain || isMutedNode) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime + timeOffset;
  const buffer = getNoiseBuffer(audioCtx);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1100, now);
  filter.Q.setValueAtTime(1.2, now);

  // Staggered burst attack (3 micro bursts)
  [0, 0.011, 0.022].forEach((offset) => {
    const source = audioCtx!.createBufferSource();
    source.buffer = buffer;

    const gain = audioCtx!.createGain();
    gain.gain.setValueAtTime(volume * 0.7, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.02);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain!);

    source.start(now + offset);
    source.stop(now + offset + 0.03);
  });

  // Final main tail burst
  const tailSource = audioCtx.createBufferSource();
  tailSource.buffer = buffer;
  const tailGain = audioCtx.createGain();
  tailGain.gain.setValueAtTime(volume * 0.8, now + 0.033);
  tailGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  tailSource.connect(filter);
  filter.connect(tailGain);
  tailGain.connect(masterGain);

  tailSource.start(now + 0.033);
  tailSource.stop(now + 0.25);
}

/**
 * Play synthesized Tom
 */
export function playTom(timeOffset = 0, pitch: 'low' | 'mid' | 'high' = 'mid', volume = 0.7) {
  initAudio();
  if (!audioCtx || !masterGain || isMutedNode) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime + timeOffset;
  const startFreq = pitch === 'low' ? 90 : pitch === 'mid' ? 135 : 190;
  const endFreq = startFreq * 0.45;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.15);

  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 0.4);
}

