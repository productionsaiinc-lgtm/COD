import { Scene } from "@babylonjs/core/scene";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

export type WeatherType = "clear" | "rain" | "snow" | "fog";

export class WeatherSystem {
  private scene: Scene;
  private currentWeather: WeatherType = "clear";
  private rainSystem: ParticleSystem | null = null;
  private snowSystem: ParticleSystem | null = null;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  setWeather(type: WeatherType) {
    this.currentWeather = type;
    this.clearWeatherEffects();

    switch (type) {
      case "rain":
        this.startRain();
        this.scene.fogMode = 2;
        this.scene.fogDensity = 0.015;
        break;
      case "snow":
        this.startSnow();
        this.scene.fogMode = 2;
        this.scene.fogDensity = 0.008;
        break;
      case "fog":
        this.scene.fogMode = 2;
        this.scene.fogDensity = 0.04;
        break;
      case "clear":
      default:
        this.scene.fogMode = 0;
        break;
    }
  }

  private startRain() {
    this.rainSystem = new ParticleSystem("rain", 3000, this.scene);
    this.rainSystem.particleTexture = new Texture("https://assets.babylonjs.com/textures/flare.png", this.scene);
    this.rainSystem.emitter = new Vector3(0, 40, 0);
    this.rainSystem.minEmitBox = new Vector3(-80, 0, -80);
    this.rainSystem.maxEmitBox = new Vector3(80, 0, 80);
    this.rainSystem.color1 = new Color3(0.6, 0.7, 1);
    this.rainSystem.minSize = 0.1;
    this.rainSystem.maxSize = 0.25;
    this.rainSystem.emitRate = 800;
    this.rainSystem.direction1 = new Vector3(-0.2, -3, -0.2);
    this.rainSystem.direction2 = new Vector3(0.2, -3, 0.2);
    this.rainSystem.start();
  }

  private startSnow() {
    this.snowSystem = new ParticleSystem("snow", 2500, this.scene);
    this.snowSystem.particleTexture = new Texture("https://assets.babylonjs.com/textures/flare.png", this.scene);
    this.snowSystem.emitter = new Vector3(0, 40, 0);
    this.snowSystem.minEmitBox = new Vector3(-80, 0, -80);
    this.snowSystem.maxEmitBox = new Vector3(80, 0, 80);
    this.snowSystem.color1 = new Color3(1, 1, 1);
    this.snowSystem.minSize = 0.1;
    this.snowSystem.maxSize = 0.35;
    this.snowSystem.emitRate = 400;
    this.snowSystem.direction1 = new Vector3(-0.5, -1.5, -0.5);
    this.snowSystem.direction2 = new Vector3(0.5, -1.5, 0.5);
    this.snowSystem.start();
  }

  private clearWeatherEffects() {
    if (this.rainSystem) { this.rainSystem.dispose(); this.rainSystem = null; }
    if (this.snowSystem) { this.snowSystem.dispose(); this.snowSystem = null; }
  }

  getCurrentWeather(): WeatherType { return this.currentWeather; }
}