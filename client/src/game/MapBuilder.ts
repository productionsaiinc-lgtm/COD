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

    // ============================================
    // ADD YOUR MODELS HERE
    // Format: ["name", "/models/filename.glb", new Vector3(x, y, z), scale]
    // ============================================
    const modelsToLoad = [
      // Terrain
      ["terrain", "/models/terrain.glb", new Vector3(0, 0, 0), 1.0],

      // Buildings
      ["building_large_01", "/models/building_large.glb", new Vector3(-55, 0, -45), 1.3],
      ["building_large_02", "/models/building_large.glb", new Vector3(45, 0, -50), 1.25],
      ["building_medium_01", "/models/building_medium.glb", new Vector3(50, 0, 35), 1.2],
      ["building_medium_02", "/models/building_medium.glb", new Vector3(-40, 0, 55), 1.15],

      // Trees
      ["tree_01", "/models/tree.glb", new Vector3(-75, 0, -55), 1.6],
      ["tree_02", "/models/tree.glb", new Vector3(70, 0, 50), 1.5],
      ["tree_03", "/models/tree.glb", new Vector3(-20, 0, 65), 1.4],
      ["tree_04", "/models/tree.glb", new Vector3(60, 0, -40), 1.55],

      // Props / Cover (uncomment when you add the files)
      // ["crate_01", "/models/crate.glb", new Vector3(20, 0, -25), 1.5],
      // ["sandbag_01", "/models/sandbag.glb", new Vector3(-30, 0, 10), 1.2],
    ];

    // Load all models
    for (const [name, path, position, scale] of modelsToLoad) {
      await this.assetManager.loadModel(
        name as string,
        path as string,
        position as Vector3,
        scale as number
      );
    }

    console.log("[MapBuilder] All 3D models loaded successfully!");
  }
}