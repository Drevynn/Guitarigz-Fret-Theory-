/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Global AudioContext holder
let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isMutedNode = false;

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
