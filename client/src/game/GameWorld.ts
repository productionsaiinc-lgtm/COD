import { Scene } from "@babylonjs/core/scene";
import { Vector3, Color4 } from "@babylonjs/core/Maths/math";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { TouchControls } from "./TouchControls";
import { GameModeManager } from "./GameModeManager";
import { WeaponSystem } from "./WeaponSystem";
import { ClassSystem } from "./ClassSystem";
import { BattleRoyaleManager } from "./BattleRoyaleManager";
import { ZombiesManager } from "./ZombiesManager";
import { DominationMode } from "./DominationMode";
import { KillConfirmedMode } from "./KillConfirmedMode";
import { DogTag } from "./DogTag";
import { ObjectiveMarker } from "./ObjectiveMarker";
import { Scoreboard } from "./Scoreboard";
import { ProgressionSystem } from "./ProgressionSystem";

export class GameWorld {
  private scene: Scene;
  private player: Player | null = null;
  private enemies: Enemy[] = [];
  private dogTags: DogTag[] = [];
  private objectiveMarkers: ObjectiveMarker[] = [];

  private touchControls: TouchControls;
  private gameModeManager: GameModeManager;
  private weaponSystem: WeaponSystem;
  private classSystem: ClassSystem;
  private brManager: BattleRoyaleManager;
  private zombiesManager: ZombiesManager;
  private dominationMode: DominationMode | null = null;
  private killConfirmedMode: KillConfirmedMode | null = null;
  private scoreboard: Scoreboard;
  private progression: ProgressionSystem;

  private camera: UniversalCamera;
  private canvas: HTMLCanvasElement;
  private isFiring = false;

  constructor(scene: Scene, camera: UniversalCamera, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvas;

    this.touchControls = new TouchControls(document.body);
    this.gameModeManager = new GameModeManager('team_deathmatch');
    this.weaponSystem = new WeaponSystem();
    this.classSystem = new ClassSystem();
    this.brManager = new BattleRoyaleManager();
    this.zombiesManager = new ZombiesManager();
    this.scoreboard = new Scoreboard();
    this.progression = new ProgressionSystem();

    this.initializeGame();
    this.setupMobileButtons();
    this.createSnowParticles();
  }

  private initializeGame() {
    this.player = new Player(this.camera, this.scene, null as any);

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const pos = new Vector3(Math.cos(angle) * 10, 1, Math.sin(angle) * 10);
      this.enemies.push(new Enemy(this.scene, pos, this.player));
    }

    const mode = this.gameModeManager.getCurrentMode();

    if (mode === 'domination') this.dominationMode = new DominationMode(this.gameModeManager);
    if (mode === 'kill_confirmed') this.killConfirmedMode = new KillConfirmedMode(this.gameModeManager);
    if (mode === 'battle_royale') this.brManager.startMatch();
    if (mode === 'zombies') this.zombiesManager.startWave();
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
    snow.minSize = 0.08;
    snow.maxSize = 0.3;
    snow.emitRate = 600;
    snow.direction1 = new Vector3(-0.8, -2.5, -0.8);
    snow.direction2 = new Vector3(0.8, -2.5, 0.8);
    snow.gravity = new Vector3(0, -2, 0);
    snow.start();
  }

  update(deltaTime: number) {
    if (!this.player) return;
    this.player.update(deltaTime);

    const move = this.touchControls.getMovementVector();
    const look = this.touchControls.getLookDelta();

    if (move.x !== 0 || move.y !== 0) {
      const forward = this.camera.getDirection(Vector3.Forward());
      const right = this.camera.getDirection(Vector3.Right());
      const dir = forward.scale(move.y).add(right.scale(move.x)).normalize();
      this.player.applyMovement(dir);
    }

    if (look.x !== 0 || look.y !== 0) {
      this.player.applyLook(look.x * 0.04, look.y * 0.04);
    }

    if (this.isFiring) {
      const weapon = this.player.getWeapon();
      weapon.fire(this.camera.position, this.camera.getDirection(Vector3.Forward()));
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(deltaTime, this.player);
      if (!enemy.isAlive()) {
        if (this.killConfirmedMode) this.killConfirmedMode.onEnemyKilled(this.scene, enemy.getPosition());
        this.scoreboard.addKill();
        this.progression.addXP(50);
        enemy.dispose();
        this.enemies.splice(i, 1);
      }
    }

    const playerPos = this.player.getPosition();

    for (let i = this.dogTags.length - 1; i >= 0; i--) {
      const tag = this.dogTags[i];
      tag.update(playerPos, () => {
        this.scoreboard.addKill();
        this.progression.addXP(25);
      });
      if (tag.collected) this.dogTags.splice(i, 1);
    }

    if (this.killConfirmedMode) this.killConfirmedMode.update(playerPos);
    if (this.dominationMode) this.dominationMode.update(playerPos);

    const weapon = this.player.getWeapon();
    // HUD update would go here
  }

  dispose() {
    this.touchControls.dispose();
    this.enemies.forEach(e => e.dispose());
    this.dogTags.forEach(d => d.dispose());
  }
}