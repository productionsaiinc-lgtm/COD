import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Scene } from "@babylonjs/core/scene";

export class ObjectiveMarker {
  public mesh: Mesh;
  public position: Vector3;
  public owner: number = 0; // 0 = neutral, 1 = player, 2 = enemy
  public progress: number = 0;

  constructor(scene: Scene, position: Vector3) {
    this.position = position.clone();

    this.mesh = MeshBuilder.CreateCylinder("objective", { height: 2.2, diameter: 1.8 }, scene);
    this.mesh.position = this.position;

    const material = new StandardMaterial("objMat", scene);
    material.diffuseColor = new Color3(0.9, 0.85, 0.2); // Neutral yellow
    material.emissiveColor = new Color3(0.3, 0.3, 0.1);
    this.mesh.material = material;
  }

  update(playerPosition: Vector3, onCapture?: (owner: number) => void) {
    const distance = Vector3.Distance(this.position, playerPosition);

    if (distance < 4) {
      this.progress += 1.5;
      if (this.progress >= 100 && this.owner !== 1) {
        this.owner = 1;
        this.progress = 0;

        const material = this.mesh.material as StandardMaterial;
        material.diffuseColor = new Color3(0.2, 0.4, 1); // Blue for player team

        if (onCapture) onCapture(1);
      }
    }
  }
}