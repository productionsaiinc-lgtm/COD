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

  // Create ground with better terrain
  const ground = MeshBuilder.CreateGround("ground", { width: 100, height: 100, subdivisions: 20 }, scene);
  const groundMaterial = new StandardMaterial("groundMaterial", scene);
  groundMaterial.emissiveColor = new Color3(0.85, 0.75, 0.65); // Sand color
  ground.material = groundMaterial;

  // Create buildings (boxes with different sizes)
  const buildingPositions = [
    { x: -20, z: -20, size: 3 },
    { x: 20, z: -20, size: 4 },
    { x: -20, z: 20, size: 2 },
    { x: 20, z: 20, size: 3.5 },
    { x: 0, z: 0, size: 2.5 },
  ];

  for (const pos of buildingPositions) {
    const building = MeshBuilder.CreateBox(`building_${pos.x}_${pos.z}`, { size: pos.size }, scene);
    building.position = new Vector3(pos.x, pos.size / 2, pos.z);
    const material = new StandardMaterial(`buildingMaterial_${pos.x}`, scene);
    material.emissiveColor = new Color3(0.6, 0.55, 0.5); // Tan/brown
    building.material = material;
  }

  // Add trees (cylinders for trunks, spheres for foliage)
  const treePositions = [
    { x: -30, z: -30 },
    { x: 30, z: -30 },
    { x: -30, z: 30 },
    { x: 30, z: 30 },
    { x: -15, z: 0 },
    { x: 15, z: 0 },
  ];

  for (const pos of treePositions) {
    // Tree trunk
    const trunk = MeshBuilder.CreateCylinder(`trunk_${pos.x}_${pos.z}`, { height: 3, diameter: 0.5 }, scene);
    trunk.position = new Vector3(pos.x, 1.5, pos.z);
    const trunkMaterial = new StandardMaterial(`trunkMaterial_${pos.x}`, scene);
    trunkMaterial.emissiveColor = new Color3(0.4, 0.3, 0.2); // Brown
    trunk.material = trunkMaterial;

    // Tree foliage
    const foliage = MeshBuilder.CreateSphere(`foliage_${pos.x}_${pos.z}`, { diameter: 4 }, scene);
    foliage.position = new Vector3(pos.x, 4, pos.z);
    const foliageMaterial = new StandardMaterial(`foliageMaterial_${pos.x}`, scene);
    foliageMaterial.emissiveColor = new Color3(0.5, 0.7, 0.3); // Green
    foliage.material = foliageMaterial;
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
