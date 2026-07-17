import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { InputManager } from "./InputManager";
import { UIManager } from "./UIManager";
import { Crosshair } from "./Crosshair";

export class GameWorld {
  private scene: Scene;
  private player: Player | null = null;
  private enemies: Enemy[] = [];
  private inputManager: InputManager;
  private uiManager: UIManager;
  private crosshair: Crosshair;
  private camera: UniversalCamera;
  private canvas: HTMLCanvasElement;
  private isFiring = false;

  constructor(scene: Scene, camera: UniversalCamera, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvas;
    this.inputManager = new InputManager(canvas);
    this.uiManager = new UIManager(scene);
    this.crosshair = new Crosshair();

    // Set up mouse button listeners
    document.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        this.isFiring = true;
      }
    });
    document.addEventListener("mouseup", (e) => {
      if (e.button === 0) {
        this.isFiring = false;
      }
    });

    this.initializeGame();
  }

  private initializeGame() {
    // Create player
    this.player = new Player(this.camera, this.scene, this.inputManager);

    // Spawn some enemies
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const distance = 5;
      const position = new Vector3(Math.cos(angle) * distance, 1, Math.sin(angle) * distance);
      const enemy = new Enemy(this.scene, position, this.player);
      this.enemies.push(enemy);
    }
  }

  update(deltaTime: number) {
    if (!this.player) return;

    // Update player
    this.player.update(deltaTime);

    // Handle weapon firing
    if (this.isFiring) {
      const weapon = this.player.getWeapon();
      weapon.fire(this.player.getCamera().position, this.player.getCamera().getDirection(Vector3.Forward()));
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(deltaTime, this.player);

      if (!enemy.isAlive()) {
        enemy.dispose();
        this.enemies.splice(i, 1);
      }
    }

    // Update weapon
    const weapon = this.player.getWeapon();
    weapon.update(deltaTime);

    // Check collisions between projectiles and enemies
    const projectiles = weapon.getProjectiles();
    for (const projectile of projectiles) {
      for (const enemy of this.enemies) {
        if (this.checkCollision(projectile.getPosition(), enemy.getPosition())) {
          enemy.takeDamage(projectile.getDamage());
          // Remove projectile on hit
          const index = projectiles.indexOf(projectile);
          if (index > -1) {
            projectile.dispose();
            projectiles.splice(index, 1);
          }
          break;
        }
      }
    }

    // Update UI
    this.uiManager.updateHealth(this.player.getHealth(), this.player.getMaxHealth());
    this.uiManager.updateAmmo(weapon.getAmmo().current, weapon.getAmmo().total);
    this.uiManager.updateMinimap(this.player.getCamera().position, this.enemies.map((e) => e.getPosition()));

    // Draw crosshair
    this.crosshair.draw();
  }

  private checkCollision(pos1: Vector3, pos2: Vector3, distance = 0.5): boolean {
    return Vector3.Distance(pos1, pos2) < distance;
  }

  dispose() {
    if (this.player) {
      this.player.dispose();
    }
    for (const enemy of this.enemies) {
      enemy.dispose();
    }
    this.inputManager.dispose();
    this.uiManager.dispose();
    this.crosshair.dispose();
  }
}
