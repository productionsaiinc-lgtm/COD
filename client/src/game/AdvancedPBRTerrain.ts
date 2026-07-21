import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

export class AdvancedPBRTerrain {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  applyAdvancedTerrain(terrain: Mesh, options: {
    grassAlbedo: string;
    grassNormal: string;
    rockAlbedo: string;
    rockNormal: string;
    sandAlbedo: string;
    sandNormal: string;
    snowAlbedo?: string;
    snowNormal?: string;
  }) {
    const material = new ShaderMaterial("advancedPBRTerrain", this.scene, {
      vertex: "advancedTerrain",
      fragment: "advancedTerrain",
    }, {
      attributes: ["position", "normal", "uv"],
      uniforms: ["worldViewProjection", "grassAlbedo", "grassNormal", "rockAlbedo", "rockNormal", "sandAlbedo", "sandNormal", "snowAlbedo", "snowNormal"],
    });

    material.setTexture("grassAlbedo", new Texture(options.grassAlbedo, this.scene));
    material.setTexture("grassNormal", new Texture(options.grassNormal, this.scene));
    material.setTexture("rockAlbedo", new Texture(options.rockAlbedo, this.scene));
    material.setTexture("rockNormal", new Texture(options.rockNormal, this.scene));
    material.setTexture("sandAlbedo", new Texture(options.sandAlbedo, this.scene));
    material.setTexture("sandNormal", new Texture(options.sandNormal, this.scene));

    if (options.snowAlbedo && options.snowNormal) {
      material.setTexture("snowAlbedo", new Texture(options.snowAlbedo, this.scene));
      material.setTexture("snowNormal", new Texture(options.snowNormal, this.scene));
    }

    terrain.material = material;
    console.log("[AdvancedPBRTerrain] PBR + Splatting applied");
  }
}