/**
 * Timeline Audio Engine - Audio disabled per system requirements
 */

class TimelineAudioEngine {
  public ensureRunning() {}

  public toggleMute(): boolean {
    return true;
  }

  public getMuted(): boolean {
    return true;
  }

  public playMilestoneSelect() {}
  public playChapterSlide() {}
  public playDoorReturn() {}
}

export const timelineAudio = new TimelineAudioEngine();
