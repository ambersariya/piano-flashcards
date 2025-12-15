import * as Tone from "tone";

// --- Tone.js sound ---
const synth = new Tone.Synth({
  oscillator: { type: "sine" },
  envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.8 },
}).toDestination();

export async function ensureAudioStarted(): Promise<void> {
  if (Tone.context.state !== "running") {
    await Tone.start();
  }
}

export function playMidi(midi: number): void {
  const freq = Tone.Frequency(midi, "midi").toFrequency();
  synth.triggerAttackRelease(freq, "8n");
}
