/**
 * Grand Lobby Sound Engine - Audio disabled per system requirements
 */

class LobbyAudioEngine {
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

  public playPedestalInspect() {}
  public playGateApproach() {}
  public playGatewayProximity() {}
  public playPortalTeleport() {}
  public playMapInspect() {}
  public dispose() {}
}

export const lobbyAudio = new LobbyAudioEngine();
