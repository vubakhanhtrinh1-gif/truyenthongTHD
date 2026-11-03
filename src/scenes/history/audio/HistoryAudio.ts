/**
 * History Room Procedural Ambient Sound Engine
 * Synthesizes deep archival resonance, warm wood reverberation, and interactive acoustic cues
 */

class HistoryAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];

  constructor() {
    this.isMuted = false;
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.42, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.startWarmArchivalDrone();
    } catch (e) {
      console.warn('History Audio failed to initialize:', e);
    }
  }

  private startWarmArchivalDrone() {
    if (!this.ctx || !this.ambientGain) return;

    // Frequencies representing historical gravitas: D2 (73.42Hz), A2 (110Hz), D3 (146.83Hz), F#3 (185Hz)
    const freqs = [73.42, 110.0, 146.83, 185.0];

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.ambientGain) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260 + idx * 60, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.1 / (idx + 1), this.ctx.currentTime);

      // Subtle slow pitch drift
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.04 + idx * 0.015, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      osc.start();
      this.oscillators.push(osc);
    });
  }

  public ensureRunning() {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.42, this.ctx.currentTime, 0.08);
    }
    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  /**
   * Sound effect when inspecting an exhibit or document
   */
  public playExhibitInspect() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(392, now); // G4
      osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.25); // D5

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // ignore
    }
  }

  /**
   * Sound effect on UI button click or teleport
   */
  public playClick() {
    this.playExhibitInspect();
  }

  /**
   * Sound effect when stepping into a new historical zone
   */
  public playZoneChime() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(293.66, now); // D4
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.18); // A4

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // ignore
    }
  }
}

export const historyAudio = new HistoryAudioEngine();
