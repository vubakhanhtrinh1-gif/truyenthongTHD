/**
 * History Room Procedural Ambient Sound Engine
 * Synthesizes deep archival resonance, warm wood reverberation, and interactive acoustic cues
 */

class HistoryAudioEngine {
  private isMuted: boolean = true;

  constructor() {
    this.isMuted = true;
  }

  public ensureRunning() {
    // Disabled - zero AudioContext/CPU usage
  }

  public toggleMute(): boolean {
    return true;
  }

  public getMutedState(): boolean {
    return true;
  }

  public playExhibitInspect() {}
  public playClick() {}
  public playZoneChime() {}
  public playTeleport() {}
}

export const historyAudio = new HistoryAudioEngine();
