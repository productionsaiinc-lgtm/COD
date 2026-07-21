import { Scene } from "@babylonjs/core/scene";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";

export class NormalMapBaker {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  generateNormalMap(width: number, height: number, heightData: number[][], strength = 1.0): Texture {
    const texture = new DynamicTexture("generatedNormalMap", { width, height }, this.scene, false);
    const context = texture.getContext();

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const left   = heightData[y]?.[x - 1] ?? heightData[y][x];
        const right  = heightData[y]?.[x + 1] ?? heightData[y][x];
        const top    = heightData[y - 1]?.[x] ?? heightData[y][x];
        const bottom = heightData[y + 1]?.[x] ?? heightData[y][x];

        const dx = (right - left) * strength;
        const dy = (bottom - top) * strength;

        const len = Math.sqrt(dx * dx + dy * dy + 1);
        const nx = dx / len;
        const ny = dy / len;
        const nz = 1 / len;

        const r = Math.floor((nx * 0.5 + 0.5) * 255);
        const g = Math.floor((ny * 0.5 + 0.5) * 255);
        const b = Math.floor((nz * 0.5 + 0.5) * 255);

        context.fillStyle = `rgb(${r},${g},${b})`;
        context.fillRect(x, y, 1, 1);
      }
    }

    texture.update();
    return texture;
  }
}