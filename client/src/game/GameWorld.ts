import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { InputManager } from "./InputManager";
import { UIManager } from "./UIManager";
import { HUDOverlay } from "./HUDOverlay";
import { WeaponModel } from "./WeaponModel";
import { TouchControls } from "./TouchControls";
import { GameModeManager } from "./GameModeManager";
import { WeaponSystem } from "./WeaponSystem";
import { ClassSystem } from "./ClassSystem";
import { BattleRoyaleManager } from "./BattleRoyaleManager";
import { ZombiesManager } from "./ZombiesManager";

export class GameWorld {
  private scene: Scene;
  private player: Player | null = null;
  private enemies: Enemy[] = [];
  private inputManager: InputManager;
  private uiManager: UIManager;
  private hudOverlay: HUDOverlay;
  private touchControls: TouchControls;
  private gameModeManager: GameModeManager;
  private weaponSystem: WeaponSystem;
  private classSystem: ClassSystem;
  private brManager: BattleRoyaleManager;
  private zombiesManager: ZombiesManager;
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
  }

  private initializeGame() {
    this.player = new Player(this.camera, this.scene, this.inputManager);

    // Spawn some enemies
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const position = new Vector3(Math.cos(angle) * 8, 1, Math.sin(angle) * 8);
      const enemy = new Enemy(this.scene, position, this.player);
      this.enemies.push(enemy);
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

    // Firing (you can connect this to a Fire button later)
    if (this.isFiring) {
      const weapon = this.player.getWeapon();
      weapon.fire(this.camera.position, this.camera.getDirection(Vector3.Forward()));
    }

    // Update enemies
    this.enemies.forEach(enemy => enemy.update(deltaTime, this.player!));

    // Update HUD
    const weapon = this.player.getWeapon();
    this.hudOverlay.setHealth(this.player.getHealth(), this.player.getMaxHealth());
    this.hudOverlay.setAmmo(weapon.getAmmo().current, weapon.getAmmo().total);
    this.hudOverlay.draw();
  }

  dispose() {
    this.touchControls.dispose();
    this.enemies.forEach(e => e.dispose());
  }
}