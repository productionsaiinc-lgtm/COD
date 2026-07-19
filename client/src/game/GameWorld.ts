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

export class GameWorld {
  private scene: Scene;
  private player: Player | null = null;
  private enemies: Enemy[] = [];
  private inputManager: InputManager;
  private uiManager: UIManager;
  private hudOverlay: HUDOverlay;
  private touchControls: TouchControls;

  // Systems
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

    // Initialize all systems
    this.gameModeManager = new GameModeManager('team_deathmatch');
    this.weaponSystem = new WeaponSystem();
    this.classSystem = new ClassSystem();
    this.brManager = new BattleRoyaleManager();
    this.zombiesManager = new ZombiesManager();

    this.initializeGame();
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

    // Initialize mode-specific systems
    const currentMode = this.gameModeManager.getCurrentMode();

    if (currentMode === 'domination') {
      this.dominationMode = new DominationMode(this.gameModeManager);
      this.dominationMode.initializeObjectives(this.scene);
    }

    if (currentMode === 'battle_royale') {
      this.brManager.startMatch();
    }

    if (currentMode === 'zombies') {
      this.zombiesManager.startWave();
    }
  }

  update(deltaTime: number) {
    if (!this.player) return;

    this.player.update(deltaTime);

    // === Touch Controls ===
    const moveVector = this.touchControls.getMovementVector();
    const lookDelta = this.touchControls.getLookDelta();

    if (moveVector.x !== 0 || moveVector.y !== 0) {
      const forward = this.camera.getDirection(Vector3.Forward());
      const right = this.camera.getDirection(Vector3.Right());
      const moveDir = forward.scale(moveVector.y).add(right.scale(moveVector.x)).normalize();
      this.player.applyMovement(moveDir);
    }

    if (lookDelta.x !== 0 || lookDelta.y !== 0) {
      this.player.applyLook(lookDelta.x * 0.04, lookDelta.y * 0.04);
    }

    // Firing
    if (this.isFiring) {
      const weapon = this.player.getWeapon();
      weapon.fire(this.camera.position, this.camera.getDirection(Vector3.Forward()));
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(deltaTime, this.player);

      if (!enemy.isAlive()) {
        enemy.dispose();
        this.enemies.splice(i, 1);
      }
    }

    // Mode-specific updates
    const currentMode = this.gameModeManager.getCurrentMode();

    if (currentMode === 'domination' && this.dominationMode) {
      this.dominationMode.update(this.player.getPosition(), 1);
    }

    // Update HUD
    const weapon = this.player.getWeapon();
    this.hudOverlay.setHealth(this.player.getHealth(), this.player.getMaxHealth());
    this.hudOverlay.setAmmo(weapon.getAmmo().current, weapon.getAmmo().total);
    this.hudOverlay.draw();
  }

  // Public methods
  setFiring(firing: boolean) {
    this.isFiring = firing;
  }

  getPlayer() {
    return this.player;
  }

  getGameModeManager() {
    return this.gameModeManager;
  }

  dispose() {
    this.touchControls.dispose();
    this.enemies.forEach(e => e.dispose());
  }
}