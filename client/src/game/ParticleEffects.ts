import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Color4 } from "@babylonjs/core/Maths/math.color";

export class ParticleEffects {
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  createRain() {
    const rain = new ParticleSystem("rain", 2500, this.scene);
    rain.particleTexture = new Texture("https://assets.babylonjs.com/textures/flare.png", this.scene);

    rain.emitter = new Vector3(0, 35, 0);
    rain.minEmitBox = new Vector3(-70, 0, -70);
    rain.maxEmitBox = new Vector3(70, 0, 70);

    rain.color1 = new Color4(0.6, 0.7, 1, 0.7);
    rain.color2 = new Color4(0.5, 0.65, 0.95, 0.5);
    rain.minSize = 0.08;
    rain.maxSize = 0.18;
    rain.minLifeTime = 0.6;
    rain.maxLifeTime = 1.1;
    rain.emitRate = 900;

    rain.direction1 = new Vector3(-0.3, -4, -0.3);
    rain.direction2 = new Vector3(0.3, -4, 0.3);
    rain.gravity = new Vector3(0, -9.8, 0);

    rain.start();
    return rain;
  }

  createSnow() {
    const snow = new ParticleSystem("snow", 1800, this.scene);
    snow.particleTexture = new Texture("https://assets.babylonjs.com/textures/flare.png", this.scene);

    snow.emitter = new Vector3(0, 35, 0);
    snow.minEmitBox = new Vector3(-65, 0, -65);
    snow.maxEmitBox = new Vector3(65, 0, 65);

    snow.color1 = new Color4(1, 1, 1, 0.9);
    snow.color2 = new Color4(0.9, 0.95, 1, 0.6);
    snow.minSize = 0.12;
    snow.maxSize = 0.32;
    snow.minLifeTime = 4;
    snow.maxLifeTime = 7;
    snow.emitRate = 350;

    snow.direction1 = new Vector3(-0.6, -1.8, -0.6);
    snow.direction2 = new Vector3(0.6, -1.8, 0.6);
    snow.start();
    return snow;
  }

  createMuzzleFlash(position: Vector3, direction: Vector3) {
    const flash = new ParticleSystem("muzzleFlash", 40, this.scene);
    flash.particleTexture = new Texture("https://assets.babylonjs.com/textures/flare.png", this.scene);

    flash.emitter = position;
    flash.color1 = new Color4(1, 0.85, 0.4, 1);
    flash.color2 = new Color4(1, 0.6, 0.2, 0.8);
    flash.minSize = 0.4;
    flash.maxSize = 1.3;
    flash.minLifeTime = 0.03;
    flash.maxLifeTime = 0.08;
    flash.emitRate = 0;

    flash.direction1 = direction.scale(2);
    flash.direction2 = direction.scale(5);
    flash.start();

    setTimeout(() => flash.dispose(), 100);
  }
}