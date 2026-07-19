import { Scene } from "@babylonjs/core/scene";
import { Vector3, Color4 } from "@babylonjs/core/Maths/math";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
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
    this.createSnowParticles();
  }

  private initializeGame() {
    this.player = new Player(this.camera, this.scene, this.inputManager);

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
    const fireBtn = document.createElement('button');
    fireBtn.textContent = 'FIRE';
    fireBtn.style.cssText = `position:absolute;bottom:200px;right:30px;padding:18px 26px;font-size:16px;font-weight:bold;background:rgba(200,30,30,0.95);color:white;border:3px solid #ff5555;border-radius:12px;z-index:1002;`;
    document.body.appendChild(fireBtn);
    fireBtn.addEventListener('touchstart', () => this.isFiring = true);
    fireBtn.addEventListener('touchend', () => this.isFiring = false);

    const jumpBtn = document.createElement('button');
    jumpBtn.textContent = 'JUMP';
    jumpBtn.style.cssText = `position:absolute;bottom:200px;right:140px;padding:16px 22px;font-size:15px;font-weight:bold;background:rgba(30,140,70,0.95);color:white;border:3px solid #44ff88;border-radius:12px;z-index:1002;`;
    document.body.appendChild(jumpBtn);
    jumpBtn.addEventListener('touchstart', () => { if (this.player) this.player.jump(); });

    const reloadBtn = document.createElement('button');
    reloadBtn.textContent = 'RELOAD';
    reloadBtn.style.cssText = `position:absolute;bottom:80px;right:140px;padding:14px 20px;font-size:14px;font-weight:bold;background:rgba(200,130,40,0.95);color:white;border:3px solid #ffaa44;border-radius:12px;z-index:1002;`;
    document.body.appendChild(reloadBtn);
    reloadBtn.addEventListener('touchstart', () => { if (this.player) this.player.getWeapon().reload(); });
  }

  private createSnowParticles() {
    const snow = new ParticleSystem("snow", 4000, this.scene);
    snow.particleTexture = new Texture("https://assets.babylonjs.com/textures/flare.png", this.scene);

    snow.emitter = new Vector3(0, 40, 0);
    snow.minEmitBox = new Vector3(-100, 0, -100);
    snow.maxEmitBox = new Vector3(100, 0, 100);

    snow.color1 = new Color4(1, 1, 1, 0.9);
    snow.color2 = new Color4(0.9, 0.95, 1, 0.6);
    snow.colorDead = new Color4(1, 1, 1, 0);

    snow.minSize = 0.08;
    snow.maxSize = 0.3;
    snow.minLifeTime = 4;
    snow.maxLifeTime = 7;
    snow.emitRate = 600;

    snow.direction1 = new Vector3(-0.8, -2.5, -0.8);
    snow.direction2 = new Vector3(0.8, -2.5, 0.8);
    snow.gravity = new Vector3(0, -2, 0);
    snow.start();
  }

  public createMuzzleFlash(position: Vector3, direction: Vector3) {
    const flash = new ParticleSystem("muzzleFlash", 60, this.scene);
    flash.particleTexture = new Texture("https://assets.babylonjs.com/textures/flare.png", this.scene);

    flash.emitter = position;
    flash.color1 = new Color4(1, 0.9, 0.5, 1);
    flash.color2 = new Color4(1, 0.6, 0.2, 1);
    flash.colorDead = new Color4(1, 0.3, 0, 0);

    flash.minSize = 0.4;
    flash.maxSize = 1.4;
    flash.minLifeTime = 0.04;
    flash.maxLifeTime = 0.1;
    flash.emitRate = 0;

    flash.direction1 = direction.scale(4);
    flash.direction2 = direction.scale(8);
    flash.start();

    setTimeout(() => flash.dispose(), 120);
  }

  update(deltaTime: number) {
    if (!this.player) return;

    this.player.update(deltaTime);

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

    if (this.isFiring) {
      const weapon = this.player.getWeapon();
      weapon.fire(this.camera.position, this.camera.getDirection(Vector3.Forward()));
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(deltaTime, this.player);

      if (!enemy.isAlive()) {
        const dogTag = new DogTag(this.scene, enemy.getPosition());
        this.dogTags.push(dogTag);
        enemy.dispose();
        this.enemies.splice(i, 1);
      }
    }

    const playerPos = this.player.getPosition();

    for (let i = this.dogTags.length - 1; i >= 0; i--) {
      const tag = this.dogTags[i];
      tag.update(playerPos, () => {
        this.gameModeManager.addScore("player", 1);
      });
      if (tag.collected) this.dogTags.splice(i, 1);
    }

    if (this.dominationMode) {
      this.objectiveMarkers.forEach(marker => marker.update(playerPos));
    }

    const weapon = this.player.getWeapon();
    this.hudOverlay.setHealth(this.player.getHealth(), this.player.getMaxHealth());
    this.hudOverlay.setAmmo(weapon.getAmmo().current, weapon.getAmmo().total);
    this.hudOverlay.draw();
  }

  dispose() {
    this.touchControls.dispose();
    this.enemies.forEach(e => e.dispose());
    this.dogTags.forEach(d => d.dispose());
    this.objectiveMarkers.forEach(o => o.dispose());
  }
}