import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { GameWorld } from "./GameWorld";

export function createGameScene() {
  const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
  
  if (!canvas) {
    console.error("Canvas with id 'game-canvas' not found!");
    return;
  }

  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  // Camera
  const camera = new UniversalCamera("camera", new Vector3(0, 1.7, 0), scene);
  camera.attachControl(canvas, true);

  // Basic Light
  new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Initialize your game world
  const gameWorld = new GameWorld(scene, camera, canvas);

  // Render loop
  engine.runRenderLoop(() => {
    scene.render();
    gameWorld.update(0.016);
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    engine.resize();
  });

  console.log("Game scene initialized successfully");
}