/**
 * Entrance Sound Engine - Audio disabled per system requirements
 */

class EntranceAudioEngine {
  private isMuted: boolean = true;

  constructor() {
    this.isMuted = true;
  }

  public ensureRunning() {}

  public toggleMute(): boolean {
    return true;
  }

  public getMutedState(): boolean {
    return true;
  }

  public playGateApproach() {}
  public playGateHover() {}
  public playGateEnter() {}
  public dispose() {}
}

export const entranceAudio = new EntranceAudioEngine();
