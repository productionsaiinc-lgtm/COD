import { ObjectiveMarker } from "./ObjectiveMarker"; // We'll create this next if needed
import { GameModeManager } from "./GameModeManager";

export class DominationMode {
  private objectives: any[] = [];
  private teamScores = { 1: 0, 2: 0 };
  private captureRate = 1;

  constructor(private gameModeManager: GameModeManager) {}

  initializeObjectives(scene: any) {
    // Create 3 capture points
    this.objectives = [
      { id: 1, position: { x: -15, z: -15 }, owner: 0, progress: 0 },
      { id: 2, position: { x: 0, z: 0 }, owner: 0, progress: 0 },
      { id: 3, position: { x: 15, z: 15 }, owner: 0, progress: 0 },
    ];

    console.log("[Domination] 3 objectives initialized");
  }

  update(playerPosition: any, playerTeam: number = 1) {
    this.objectives.forEach(obj => {
      const distance = Math.sqrt(
        Math.pow(playerPosition.x - obj.position.x, 2) +
        Math.pow(playerPosition.z - obj.position.z, 2)
      );

      if (distance < 5) {
        // Player is capturing
        if (obj.owner !== playerTeam) {
          obj.progress += this.captureRate;
          if (obj.progress >= 100) {
            obj.owner = playerTeam;
            obj.progress = 0;
            this.teamScores[playerTeam] += 10;
            console.log(`[Domination] Team ${playerTeam} captured point ${obj.id}`);
          }
        }
      }
    });
  }

  getScores() {
    return this.teamScores;
  }

  getObjectives() {
    return this.objectives;
  }
}