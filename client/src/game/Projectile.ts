import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";

export class Projectile {
  private scene: Scene;
  private mesh: any;
  private position: Vector3;
  private direction: Vector3;
  private speed = 0.5;
  private lifetime = 5; // seconds
  private age = 0;
  private damage = 10;

  constructor(scene: Scene, position: Vector3, direction: Vector3) {
    this.scene = scene;
    this.position = position.clone();
    this.direction = direction.normalize();

    // Create a small sphere for the projectile
    this.mesh = MeshBuilder.CreateSphere("projectile", { diameter: 0.1 }, scene);
    this.mesh.position = this.position.clone();

    // Create a material for the projectile
    const material = new StandardMaterial("projectileMaterial", scene);
    material.emissiveColor = new Color3(1, 0.8, 0);
    this.mesh.material = material;
  }

  update(deltaTime: number) {
    // Move projectile
    this.position.addInPlace(this.direction.scale(this.speed));
    this.mesh.position = this.position.clone();

    // Update age
    this.age += deltaTime;
  }

  isExpired(): boolean {
    return this.age >= this.lifetime;
  }

  getPosition(): Vector3 {
    return this.position.clone();
  }

  getDirection(): Vector3 {
    return this.direction.clone();
  }

  getDamage(): number {
    return this.damage;
  }

  dispose() {
    this.mesh.dispose();
  }
}
