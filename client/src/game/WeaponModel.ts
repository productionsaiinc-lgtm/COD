import { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";

export class WeaponModel {
  private weaponGroup: TransformNode;
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this.weaponGroup = new TransformNode("weaponGroup", scene);
    this.createWeaponModel();
  }

  private createWeaponModel() {
    // Create rifle body (main barrel)
    const barrel = MeshBuilder.CreateCylinder("barrel", { height: 0.6, diameter: 0.08 }, this.scene);
    barrel.position = new Vector3(0.3, -0.2, 0);
    const barrelMaterial = new StandardMaterial("barrelMaterial", this.scene);
    barrelMaterial.emissiveColor = new Color3(0.2, 0.2, 0.2); // Dark gray
    barrel.material = barrelMaterial;
    barrel.parent = this.weaponGroup;

    // Create stock (rear part)
    const stock = MeshBuilder.CreateBox("stock", { width: 0.1, height: 0.15, depth: 0.3 }, this.scene);
    stock.position = new Vector3(-0.15, -0.1, 0);
    const stockMaterial = new StandardMaterial("stockMaterial", this.scene);
    stockMaterial.emissiveColor = new Color3(0.3, 0.25, 0.2); // Brown
    stock.material = stockMaterial;
    stock.parent = this.weaponGroup;

    // Create magazine
    const magazine = MeshBuilder.CreateBox("magazine", { width: 0.08, height: 0.25, depth: 0.12 }, this.scene);
    magazine.position = new Vector3(0.1, -0.35, 0);
    const magazineMaterial = new StandardMaterial("magazineMaterial", this.scene);
    magazineMaterial.emissiveColor = new Color3(0.1, 0.1, 0.1); // Black
    magazine.material = magazineMaterial;
    magazine.parent = this.weaponGroup;

    // Create scope mount
    const scopeMount = MeshBuilder.CreateBox("scopeMount", { width: 0.06, height: 0.08, depth: 0.15 }, this.scene);
    scopeMount.position = new Vector3(0.15, 0.05, 0);
    const scopeMaterial = new StandardMaterial("scopeMaterial", this.scene);
    scopeMaterial.emissiveColor = new Color3(0.15, 0.15, 0.15); // Dark gray
    scopeMount.material = scopeMaterial;
    scopeMount.parent = this.weaponGroup;

    // Create grip
    const grip = MeshBuilder.CreateBox("grip", { width: 0.08, height: 0.2, depth: 0.08 }, this.scene);
    grip.position = new Vector3(0.05, -0.15, 0);
    const gripMaterial = new StandardMaterial("gripMaterial", this.scene);
    gripMaterial.emissiveColor = new Color3(0.4, 0.35, 0.3); // Tan
    grip.material = gripMaterial;
    grip.parent = this.weaponGroup;

    // Position the weapon group in the bottom-right of the screen
    this.weaponGroup.position = new Vector3(0.5, -0.3, 1);
    this.weaponGroup.rotation.y = -0.3;
    this.weaponGroup.rotation.z = 0.1;
  }

  getGroup(): TransformNode {
    return this.weaponGroup;
  }

  update(deltaTime: number) {
    // Add subtle bobbing animation
    this.weaponGroup.position.y = -0.3 + Math.sin(Date.now() * 0.003) * 0.02;
  }

  dispose() {
    this.weaponGroup.dispose();
  }
}
