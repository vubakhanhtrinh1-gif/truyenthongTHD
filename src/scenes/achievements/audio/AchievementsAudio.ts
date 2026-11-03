/**
 * Zone 3 Achievements Room Procedural Ambient & Acoustic Engine
 * Generates warm golden heroic ambiance, triumphant resonance, and interactive sound cues.
 * Also provides an integrated Vietnamese Speech Narration Audio Tour.
 */

class AchievementsAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isNarrating: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.isMuted = false;
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.startWarmTriumphHarmonics();
    } catch (e) {
      console.warn('Achievements Audio failed to initialize:', e);
    }
  }

  public ensureRunning() {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private startWarmTriumphHarmonics() {
    if (!this.ctx || !this.ambientGain) return;

    // Frequencies representing victory, honors, and heritage triumph:
    // C3 (130.81Hz), G3 (196.00Hz), C4 (261.63Hz), E4 (329.63Hz)
    const freqs = [130.81, 196.0, 261.63, 329.63];

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.ambientGain) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320 + idx * 60, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.1 / (idx + 1), this.ctx.currentTime);

      // Subtle slow frequency swell
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.04 + idx * 0.015, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      osc.start();
      this.oscillators.push(osc);
    });
  }

  public toggleMute(): boolean {
    this.ensureRunning();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.45, now + 0.15);
    }
    if (this.isMuted && this.isNarrating) {
      this.stopNarration();
    }
    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  public playClick() {
    this.ensureRunning();
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.045);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.045);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playBronzeBell() {
    this.ensureRunning();
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    // Resonant golden gong / bell for awards
    const freqs = [392.0, 783.99, 1174.66];
    freqs.forEach((f, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.18 / (i + 1), this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.8);
    });
  }

  public playExhibitInspect() {
    this.ensureRunning();
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  public playTeleport() {
    this.ensureRunning();
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(840, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.26);
  }

  public startNarration(text: string, lang: 'vi' | 'en' = 'vi', onEnd?: () => void) {
    if (!('speechSynthesis' in window)) return;
    this.stopNarration();

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.lang = lang === 'vi' ? 'vi-VN' : 'en-US';
    this.currentUtterance.rate = 0.95;
    this.currentUtterance.pitch = 1.0;

    this.currentUtterance.onend = () => {
      this.isNarrating = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance.onerror = () => {
      this.isNarrating = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.isNarrating = true;
    window.speechSynthesis.speak(this.currentUtterance);
  }

  public stopNarration() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isNarrating = false;
    this.currentUtterance = null;
  }

  public getIsNarrating(): boolean {
    return this.isNarrating;
  }
}

export const achievementsAudio = new AchievementsAudioEngine();
