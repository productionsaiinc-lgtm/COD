import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Scene } from "@babylonjs/core/scene";

export class DogTag {
  public mesh: Mesh;
  public position: Vector3;
  public collected: boolean = false;

  constructor(scene: Scene, position: Vector3) {
    this.position = position.clone();

    this.mesh = MeshBuilder.CreateBox("dogtag", { width: 0.35, height: 0.55, depth: 0.08 }, scene);
    this.mesh.position = this.position;

    const material = new StandardMaterial("dogtagMat", scene);
    material.diffuseColor = new Color3(0.95, 0.8, 0.2);
    material.emissiveColor = new Color3(0.4, 0.3, 0.1);
    this.mesh.material = material;
  }

  update(playerPosition: Vector3, onCollect: () => void) {
    if (this.collected) return;

    const distance = Vector3.Distance(this.position, playerPosition);
    if (distance < 1.8) {
      this.collected = true;
      onCollect();
      this.mesh.dispose();
    }

    // Bobbing animation
    this.mesh.position.y = this.position.y + Math.sin(Date.now() / 280) * 0.12;
  }
}