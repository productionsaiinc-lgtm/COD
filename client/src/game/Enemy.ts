import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Player } from "./Player";

export class Enemy {
  private mesh: Mesh;
  private health: number = 100;
  private speed: number = 0.06;
  private attackRange: number = 2.5;
  private lastAttackTime: number = 0;

  constructor(scene: Scene, position: Vector3, private player: Player) {
    this.mesh = MeshBuilder.CreateBox("enemy", { size: 1.8 }, scene);
    this.mesh.position = position.clone();

    const material = new StandardMaterial("enemyMat", scene);
    material.diffuseColor = new Color3(0.85, 0.2, 0.2);
    this.mesh.material = material;
  }

  update(deltaTime: number, player: Player) {
    if (!this.isAlive()) return;

    const playerPos = player.getPosition();
    const direction = playerPos.subtract(this.mesh.position).normalize();

    // Simple pathfinding / movement toward player
    this.mesh.position = this.mesh.position.add(direction.scale(this.speed));

    // Attack player when close
    const distance = Vector3.Distance(this.mesh.position, playerPos);
    if (distance < this.attackRange) {
      const now = Date.now();
      if (now - this.lastAttackTime > 1200) {
        player.takeDamage(12);
        this.lastAttackTime = now;
      }
    }

    // Face the player
    this.mesh.lookAt(playerPos);
  }

  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
    }
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  getPosition(): Vector3 {
    return this.mesh.position;
  }

  dispose() {
    if (this.mesh) this.mesh.dispose();
  }
}