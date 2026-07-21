import { Vector3 } from "@babylonjs/core/Maths/math.vector";

export class LODManager {
  private playerPosition: Vector3;

  constructor(playerPosition: Vector3) {
    this.playerPosition = playerPosition;
  }

  update(playerPos: Vector3) {
    this.playerPosition = playerPos;
  }

  getLODLevel(distance: number): number {
    if (distance < 30) return 0;      // High detail
    if (distance < 70) return 1;      // Medium
    if (distance < 150) return 2;     // Low
    return 3;                         // Very low / hidden
  }

  shouldShow(distance: number, maxDistance = 200): boolean {
    return distance < maxDistance;
  }
}