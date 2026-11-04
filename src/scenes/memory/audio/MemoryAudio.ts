/**
 * Memory Audio Engine - Audio disabled per system requirements
 */

class MemoryAudioEngine {
  public ensureRunning() {}

  public toggleMute(): boolean {
    return true;
  }

  public getMuted(): boolean {
    return true;
  }

  public playPhotoInspect() {}
  public playEssayInspect() {}
  public playDoorReturn() {}
}

export const memoryAudio = new MemoryAudioEngine();
