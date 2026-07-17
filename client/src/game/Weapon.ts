import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { Projectile } from "./Projectile";

export class Weapon {
  private scene: Scene;
  private ammo = 120;
  private maxAmmo = 120;
  private clipSize = 30;
  private currentClip = 30;
  private fireRate = 0.1; // seconds between shots
  private lastFireTime = 0;
  private projectiles: Projectile[] = [];

  constructor(scene: Scene) {
    this.scene = scene;
  }

  fire(position: Vector3, direction: Vector3) {
    const now = performance.now() / 1000;

    // Check if enough time has passed since last shot
    if (now - this.lastFireTime < this.fireRate) {
      return;
    }

    // Check if we have ammo
    if (this.currentClip <= 0) {
      return;
    }

    // Create projectile
    const projectile = new Projectile(this.scene, position.clone(), direction.clone());
    this.projectiles.push(projectile);

    // Update ammo
    this.currentClip--;
    this.lastFireTime = now;
  }

  reload() {
    if (this.ammo > 0 && this.currentClip < this.clipSize) {
      const ammoNeeded = this.clipSize - this.currentClip;
      const ammoToUse = Math.min(ammoNeeded, this.ammo);
      this.currentClip += ammoToUse;
      this.ammo -= ammoToUse;
    }
  }

  update(deltaTime: number) {
    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update(deltaTime);

      if (projectile.isExpired()) {
        projectile.dispose();
        this.projectiles.splice(i, 1);
      }
    }
  }

  getAmmo(): { current: number; total: number } {
    return { current: this.currentClip, total: this.ammo };
  }

  getProjectiles(): Projectile[] {
    return this.projectiles;
  }

  dispose() {
    for (const projectile of this.projectiles) {
      projectile.dispose();
    }
    this.projectiles = [];
  }
}
