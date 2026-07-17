import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Player } from "./Player";

export class Enemy {
  private scene: Scene;
  private mesh: any;
  private position: Vector3;
  private health = 50;
  private maxHealth = 50;
  private moveSpeed = 0.08;
  private attackRange = 3;
  private attackCooldown = 2;
  private lastAttackTime = 0;
  private player: Player;
  private detectionRange = 10;

  constructor(scene: Scene, position: Vector3, player: Player) {
    this.scene = scene;
    this.position = position.clone();
    this.player = player;

    // Create enemy mesh (cube for now)
    this.mesh = MeshBuilder.CreateBox("enemy", { size: 0.8 }, scene);
    this.mesh.position = this.position.clone();

    // Create enemy material
    const material = new StandardMaterial("enemyMaterial", scene);
    material.emissiveColor = new Color3(1, 0, 0);
    this.mesh.material = material;
  }

  update(deltaTime: number, player: Player) {
    const playerPos = player.getCamera().position;
    const distanceToPlayer = Vector3.Distance(this.position, playerPos);

    // Check if player is in detection range
    if (distanceToPlayer < this.detectionRange) {
      // Move towards player
      const direction = playerPos.subtract(this.position).normalize();
      this.position.addInPlace(direction.scale(this.moveSpeed));

      // Attack if in range
      if (distanceToPlayer < this.attackRange) {
        const now = performance.now() / 1000;
        if (now - this.lastAttackTime > this.attackCooldown) {
          this.attack(player);
          this.lastAttackTime = now;
        }
      }
    }

    // Update mesh position
    this.mesh.position = this.position.clone();
  }

  private attack(player: Player) {
    // Deal damage to player
    player.takeDamage(10);
  }

  takeDamage(amount: number) {
    this.health = Math.max(0, this.health - amount);
  }

  getHealth(): number {
    return this.health;
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  getPosition(): Vector3 {
    return this.position.clone();
  }

  dispose() {
    this.mesh.dispose();
  }
}
