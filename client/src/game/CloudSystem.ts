import { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

export class CloudSystem {
  private scene: Scene;
  private cloudLayers: Mesh[] = [];
  private speeds: number[] = [];

  constructor(scene: Scene) {
    this.scene = scene;
    this.createCloudLayers();
  }

  private createCloudLayers() {
    const cloud1 = MeshBuilder.CreatePlane("clouds1", { size: 800 }, this.scene);
    cloud1.position = new Vector3(0, 180, 0);
    cloud1.rotation.x = Math.PI / 2;

    const mat1 = new StandardMaterial("cloudMat1", this.scene);
    mat1.diffuseTexture = new Texture("https://assets.babylonjs.com/textures/cloud.png", this.scene);
    mat1.diffuseTexture.hasAlpha = true;
    mat1.useAlphaFromDiffuseTexture = true;
    mat1.backFaceCulling = false;
    cloud1.material = mat1;

    this.cloudLayers.push(cloud1);
    this.speeds.push(0.008);

    const cloud2 = MeshBuilder.CreatePlane("clouds2", { size: 600 }, this.scene);
    cloud2.position = new Vector3(0, 120, 0);
    cloud2.rotation.x = Math.PI / 2;

    const mat2 = new StandardMaterial("cloudMat2", this.scene);
    mat2.diffuseTexture = new Texture("https://assets.babylonjs.com/textures/cloud.png", this.scene);
    mat2.diffuseTexture.hasAlpha = true;
    mat2.useAlphaFromDiffuseTexture = true;
    mat2.backFaceCulling = false;
    cloud2.material = mat2;

    this.cloudLayers.push(cloud2);
    this.speeds.push(0.025);
  }

  update() {
    this.cloudLayers.forEach((cloud, index) => {
      cloud.position.x += this.speeds[index];
      if (cloud.position.x > 400) cloud.position.x = -400;
    });
  }

  setCloudDensity(density: number) {
    this.cloudLayers.forEach(cloud => {
      if (cloud.material) {
        (cloud.material as StandardMaterial).alpha = Math.max(0.3, Math.min(1, density));
      }
    });
  }
}