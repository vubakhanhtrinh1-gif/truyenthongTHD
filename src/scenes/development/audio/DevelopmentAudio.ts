/**
 * Zone 2 Development Room Audio Engine - Audio disabled per system requirements
 */

class DevelopmentAudioEngine {
  private isMuted: boolean = true;
  private isNarrating: boolean = false;

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

  public playClick() {}
  public playExhibitInspect() {}
  public playBronzeBell() {}
  public playTeleport() {}

  public startNarration(
    _text: string,
    _lang: 'vi' | 'en' = 'vi',
    onEnd?: () => void
  ) {
    if (onEnd) onEnd();
  }

  public stopNarration() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isNarrating = false;
  }

  public isCurrentlyNarrating(): boolean {
    return false;
  }
}

export const developmentAudio = new DevelopmentAudioEngine();
