import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
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

  const camera = new UniversalCamera("camera", new Vector3(0, 1.6, 0), scene);
  camera.attachControl(null);

  // Better lighting
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.85;
  light.diffuse = new Color3(1, 0.95, 0.9);

  // Ground with better material
  const ground = MeshBuilder.CreateGround("ground", { width: 200, height: 200 }, scene);
  const groundMat = new PBRMaterial("groundMat", scene);
  groundMat.albedoColor = new Color3(0.75, 0.65, 0.55);
  groundMat.metallic = 0.1;
  groundMat.roughness = 0.85;
  ground.material = groundMat;

  const gameWorld = new GameWorld(scene, camera, canvas);

  // === Phase 3: Advanced Rendering Pipeline ===
  const pipeline = new DefaultRenderingPipeline("pipeline", true, scene, [camera]);
  
  // Bloom (makes bright areas glow nicely)
  pipeline.bloomEnabled = true;
  pipeline.bloomThreshold = 0.7;
  pipeline.bloomWeight = 0.6;
  pipeline.bloomKernel = 64;

  // Sharpen
  pipeline.sharpenEnabled = true;
  pipeline.sharpen.amount = 0.3;

  // Color grading (cinematic feel)
  pipeline.imageProcessingEnabled = true;
  pipeline.imageProcessing.contrast = 1.15;
  pipeline.imageProcessing.exposure = 1.1;
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