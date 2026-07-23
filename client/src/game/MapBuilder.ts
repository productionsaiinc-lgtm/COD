import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { AssetManager } from "./AssetManager";

export class MapBuilder {
  private scene: Scene;
  private assetManager: AssetManager;

  constructor(scene: Scene) {
    this.scene = scene;
    this.assetManager = new AssetManager(scene);
  }

  async buildMap() {
    console.log("[MapBuilder] Loading 3D assets...");

    // === Terrain (optional) ===
    await this.assetManager.loadModel(
      "terrain",
      "/models/terrain.glb",
      new Vector3(0, 0, 0),
      1
    );

    // === Buildings ===
    await this.assetManager.loadModel(
      "building_large",
      "/models/building_large.glb",
      new Vector3(-55, 0, -45),
      1.3
    );

    await this.assetManager.loadModel(
      "building_medium",
      "/models/building_medium.glb",
      new Vector3(50, 0, 35),
      1.2
    );

    // === Trees ===
    await this.assetManager.loadModel(
      "tree_1",
      "/models/tree.glb",
      new Vector3(-75, 0, -55),
      1.6
    );

    await this.assetManager.loadModel(
      "tree_2",
      "/models/tree.glb",
      new Vector3(70, 0, 50),
      1.4
    );

    console.log("[MapBuilder] All models loaded successfully!");
  }
}