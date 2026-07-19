import { DogTag } from "./DogTag";
import { GameModeManager } from "./GameModeManager";

export class KillConfirmedMode {
  private dogTags: DogTag[] = [];
  private teamScores = { 1: 0, 2: 0 };
  private playerTeam = 1;

  constructor(private gameModeManager: GameModeManager) {}

  onEnemyKilled(scene: any, position: any) {
    const dogTag = new DogTag(scene, position);
    this.dogTags.push(dogTag);
  }

  update(playerPosition: any, onDogTagCollected: (team: number) => void) {
    for (let i = this.dogTags.length - 1; i >= 0; i--) {
      const tag = this.dogTags[i];

      tag.update(playerPosition, () => {
        this.teamScores[this.playerTeam] += 1;
        onDogTagCollected(this.playerTeam);
        tag.collected = true;
      });

      if (tag.collected) {
        tag.dispose?.();
        this.dogTags.splice(i, 1);
      }
    }
  }

  getScores() {
    return this.teamScores;
  }

  getDogTags() {
    return this.dogTags;
  }
}