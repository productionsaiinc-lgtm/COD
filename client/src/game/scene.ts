import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { GameWorld } from "./GameWorld";

export interface GameHandle {
  scene: Scene;
  dispose: () => void;
}

export async function createGameScene(engine: Engine, canvas: HTMLCanvasElement): Promise<GameHandle> {
  const scene = new Scene(engine);
  scene.collisionsEnabled = true;

  const camera = new UniversalCamera("camera", new Vector3(0, 1.6, 0), scene);
  camera.attachControl(null);
  camera.inertia = 0.7;
  camera.angularSensibility = 1000;

  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.9;

  // Create ground
  const ground = MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
  const groundMaterial = new StandardMaterial("groundMaterial", scene);
  groundMaterial.emissiveColor = new Color3(0.8, 0.7, 0.6); // Sand color
  ground.material = groundMaterial;

  // Create some simple obstacles
  for (let i = 0; i < 5; i++) {
    const box = MeshBuilder.CreateBox("obstacle", { size: 2 }, scene);
    box.position = new Vector3(Math.random() * 30 - 15, 1, Math.random() * 30 - 15);
    const material = new StandardMaterial("obstacleMaterial", scene);
    material.emissiveColor = new Color3(0.5, 0.5, 0.5); // Gray
    box.material = material;
  }

  // Create game world
  const gameWorld = new GameWorld(scene, camera, canvas);

  // Set up render loop
  let lastFrameTime = performance.now();
  const renderLoop = () => {
    const now = performance.now();
    const deltaTime = Math.min((now - lastFrameTime) / 1000, 0.016); // Cap at 60fps
    lastFrameTime = now;

    gameWorld.update(deltaTime);
  };

  // Store the render loop so we can stop it
  (scene as any).renderLoop = renderLoop;

  return {
    scene,
    dispose: () => {
      gameWorld.dispose();
      scene.dispose();
    },
  };
}
