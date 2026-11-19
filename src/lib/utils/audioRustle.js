import { triggerHaptic } from './haptics.js';

let audioCtx = null;

/**
 * Synthesizes a realistic paper page flip rustle using the Web Audio API.
 * Pure mathematical synthesis, requiring 0 external audio assets.
 * @param {boolean} isSoundEnabled
 */
export async function playPageFlipSound(isSoundEnabled = true) {
  triggerHaptic('selection');
  if (!isSoundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }
    const duration = 0.14;
    const bufferSize = Math.floor(audioCtx.sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - progress, 2.2);
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(700, audioCtx.currentTime + duration);
    filter.Q.setValueAtTime(1.5, audioCtx.currentTime);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.22, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start();
  } catch (err) {
    // Audio autoplay or context restriction
  }
}
