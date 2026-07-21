import { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

export class TerrainGenerator {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  generateTerrain(size: number = 200, subdivisions: number = 64, heightScale: number = 8): Mesh {
    const ground = MeshBuilder.CreateGround("proceduralTerrain", {
      width: size,
      height: size,
      subdivisions: subdivisions,
    }, this.scene);

    const positions = ground.getVerticesData("position")!;
    const indices = ground.getIndices()!;

    const noise = (x: number, z: number): number => {
      return Math.sin(x * 0.1) * Math.cos(z * 0.1) * 0.5 +
             Math.sin(x * 0.05 + z * 0.03) * 0.8;
    };

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      positions[i + 1] = noise(x, z) * heightScale;
    }

    const vertexData = new VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.applyToMesh(ground, true);

    const material = new StandardMaterial("terrainMat", this.scene);
    material.diffuseColor = new Color3(0.4, 0.35, 0.25);
    ground.material = material;

    return ground;
  }
}