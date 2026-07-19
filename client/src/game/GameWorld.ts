import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { InputManager } from "./InputManager";
import { UIManager } from "./UIManager";
import { HUDOverlay } from "./HUDOverlay";
import { TouchControls } from "./TouchControls";
import { GameModeManager } from "./GameModeManager";
import { WeaponSystem } from "./WeaponSystem";
import { ClassSystem } from "./ClassSystem";
import { BattleRoyaleManager } from "./BattleRoyaleManager";
import { ZombiesManager } from "./ZombiesManager";
import { DominationMode } from "./DominationMode";
import { DogTag } from "./DogTag";
import { ObjectiveMarker } from "./ObjectiveMarker";

export class GameWorld {
  private scene: Scene;
  private player: Player | null = null;
  private enemies: Enemy[] = [];
  private dogTags: DogTag[] = [];
  private objectiveMarkers: ObjectiveMarker[] = [];

  private inputManager: InputManager;
  private uiManager: UIManager;
  private hudOverlay: HUDOverlay;
  private touchControls: TouchControls;

  // Core Systems
  private gameModeManager: GameModeManager;
  private weaponSystem: WeaponSystem;
  private classSystem: ClassSystem;
  private brManager: BattleRoyaleManager;
  private zombiesManager: ZombiesManager;
  private dominationMode: DominationMode | null = null;

  private camera: UniversalCamera;
  private canvas: HTMLCanvasElement;
  private isFiring = false;

  constructor(scene: Scene, camera: UniversalCamera, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvas;

    this.inputManager = new InputManager(canvas);
    this.uiManager = new UIManager(scene);
    this.hudOverlay = new HUDOverlay();
    this.touchControls = new TouchControls(document.body);

    this.gameModeManager = new GameModeManager('team_deathmatch');
    this.weaponSystem = new WeaponSystem();
    this.classSystem = new ClassSystem();
    this.brManager = new BattleRoyaleManager();
    this.zombiesManager = new ZombiesManager();

    this.initializeGame();
    this.setupMobileButtons();
  }

  private initializeGame() {
    this.player = new Player(this.camera, this.scene, this.inputManager);

    // Spawn enemies
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const position = new Vector3(Math.cos(angle) * 10, 1, Math.sin(angle) * 10);
      const enemy = new Enemy(this.scene, position, this.player);
      this.enemies.push(enemy);
    }

    const mode = this.gameModeManager.getCurrentMode();

    if (mode === 'domination') {
      this.dominationMode = new DominationMode(this.gameModeManager);
      this.dominationMode.initializeObjectives(this.scene);
    }

    if (mode === 'battle_royale') {
      this.brManager.startMatch();
    }

    if (mode === 'zombies') {
      this.zombiesManager.startWave();
    }
  }

  private setupMobileButtons() {
    // FIRE
    const fireBtn = document.createElement('button');
    fireBtn.textContent = 'FIRE';
    fireBtn.style.cssText = `position:absolute;bottom:200px;right:30px;padding:18px 26px;font-size:16px;font-weight:bold;background