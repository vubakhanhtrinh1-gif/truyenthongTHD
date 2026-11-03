/**
 * Procedural Heritage Ambient Sound Engine
 * Uses Web Audio API for calm, museum-grade atmospheric resonance without external asset dependencies
 */

class EntranceAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];

  constructor() {
    // Start muted by default to respect browser policies and user comfort
    this.isMuted = true;
  }

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.droneGain.connect(this.masterGain);

      this.startAmbientDrone();
    } catch (e) {
      console.warn('Web Audio not supported or failed to initialize:', e);
    }
  }

  private startAmbientDrone() {
    if (!this.ctx || !this.droneGain) return;

    // Frequencies: 55Hz (A1), 82.4Hz (E2), 110Hz (A2) - Warm open fifth chord
    const freqs = [55.0, 82.41, 110.0, 164.81];

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.droneGain) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260 + idx * 80, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.18 / (idx + 1), this.ctx.currentTime);

      // Subtle slow pitch LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.03, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.droneGain);

      osc.start();
      this.oscillators.push(osc);
    });

    this.isRunning = true;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.ctx) {
      this.initContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.45;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.4);
    }
    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  /**
   * Sound cue when user hovers over the interactive entrance gate
   */
  public playGateHover() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Harmonic overtone: 440Hz sliding slightly to 493.88Hz
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(493.88, now + 1.2);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(520, now);
      filter.Q.setValueAtTime(3.5, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 2.0);
    } catch (e) {
      // Audio cue fail-safe
    }
  }

  /**
   * Sound cue when entering the gateway
   */
  public playGateEnter() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;

      // Chord: 220Hz (A3), 277.18Hz (C#4), 329.63Hz (E4), 440Hz (A4)
      const chord = [220.0, 277.18, 329.63, 440.0, 659.25];

      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.01, now + 2.5);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800 + idx * 200, now);

        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.6 + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.12);
        osc.stop(now + 3.2);
      });
    } catch (e) {
      // Fail-safe
    }
  }

  public dispose() {
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.oscillators = [];
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export const entranceAudio = new EntranceAudioEngine();
