import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { GameWorld } from "./GameWorld";

export interface GameHandle {
  scene: Scene;
  dispose: () => void;
}

export async function createGameScene(engine: Engine, canvas: HTMLCanvasElement): Promise<GameHandle> {
  const scene = new Scene(engine);
  scene.collisionsEnabled = true;

  // Set a nice sky color so we don't have pure black
  scene.clearColor = new Color4(0.55, 0.65, 0.85, 1);

  const camera = new UniversalCamera("camera", new Vector3(0, 1.6, -8), scene);
  camera.attachControl(canvas, true);   // FIXED: was passing null

  // Better lighting
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.9;
  light.diffuse = new Color3(1, 0.95, 0.85);

  // Simple ground so we have something visible
  const ground = MeshBuilder.CreateGround("ground", { width: 200, height: 200 }, scene);
  const groundMat = new PBRMaterial("groundMat", scene);
  groundMat.albedoColor = new Color3(0.65, 0.55, 0.45);
  groundMat.roughness = 0.9;
  ground.material = groundMat;

  const gameWorld = new GameWorld(scene, camera, canvas);

  // Rendering pipeline (can be heavy on some devices)
  const pipeline = new DefaultRenderingPipeline("pipeline", true, scene, [camera]);

  pipeline.bloomEnabled = true;
  pipeline.bloomThreshold = 0.65;
  pipeline.bloomWeight = 0.5;

  pipeline.imageProcessingEnabled = true;
  pipeline.imageProcessing.contrast = 1.1;
  pipeline.imageProcessing.exposure = 1.05;
  pipeline.imageProcessing.toneMappingEnabled = true;

  engine.runRenderLoop(() => {
    scene.render();
    gameWorld.update(0.016);
  });

  return {
    scene,
    dispose: () => {
      gameWorld.dispose();
      scene.dispose();
    },
  };
}