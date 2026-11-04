/**
 * Achievements Audio Engine - Audio disabled per system requirements
 */

class AchievementsAudioEngine {
  public ensureRunning() {}

  public toggleMute(): boolean {
    return true;
  }

  public getMutedState(): boolean {
    return true;
  }

  public playClick() {}
  public playTrophyInspect() {}
  public playTriumphantChime() {}
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
  }

  public isCurrentlyNarrating(): boolean {
    return false;
  }
}

export const achievementsAudio = new AchievementsAudioEngine();
