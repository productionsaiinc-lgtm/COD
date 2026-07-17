import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Matrix } from "@babylonjs/core/Maths/math";
import { Quaternion } from "@babylonjs/core/Maths/math";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Scene } from "@babylonjs/core/scene";
import { InputManager } from "./InputManager";
import { Weapon } from "./Weapon";

export class Player {
  private camera: UniversalCamera;
  private scene: Scene;
  private inputManager: InputManager;
  private weapon: Weapon;

  private health = 100;
  private maxHealth = 100;
  private velocity = Vector3.Zero();
  private moveSpeed = 0.15;
  private jumpForce = 0.3;
  private isJumping = false;
  private gravity = 0.01;

  private yaw = 0;
  private pitch = 0;
  private mouseSensitivity = 0.002;

  constructor(camera: UniversalCamera, scene: Scene, inputManager: InputManager) {
    this.camera = camera;
    this.scene = scene;
    this.inputManager = inputManager;

    // Initialize weapon
    this.weapon = new Weapon(scene);

    // Disable default camera controls
    this.camera.attachControl(null);
  }

  update(deltaTime: number) {
    this.handleInput();
    this.updateMovement(deltaTime);
    this.updateCamera();
  }

  private handleInput() {
    // Movement input
    const moveDirection = Vector3.Zero();

    if (this.inputManager.isKeyDown("w")) {
      moveDirection.addInPlace(this.camera.getDirection(Vector3.Forward()));
    }
    if (this.inputManager.isKeyDown("s")) {
      moveDirection.addInPlace(this.camera.getDirection(Vector3.Backward()));
    }
    if (this.inputManager.isKeyDown("a")) {
      moveDirection.addInPlace(this.camera.getDirection(Vector3.Left()));
    }
    if (this.inputManager.isKeyDown("d")) {
      moveDirection.addInPlace(this.camera.getDirection(Vector3.Right()));
    }

    // Normalize and apply speed
    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      moveDirection.scaleInPlace(this.moveSpeed);
      this.velocity.x = moveDirection.x;
      this.velocity.z = moveDirection.z;
    } else {
      this.velocity.x *= 0.9;
      this.velocity.z *= 0.9;
    }

    // Jump
    if (this.inputManager.isKeyDown(" ") && !this.isJumping) {
      this.velocity.y = this.jumpForce;
      this.isJumping = true;
    }

    // Weapon firing (mouse click) - detect via mousedown event
    // Note: This will be handled via a separate mouse event listener

    // Weapon reload (R key)
    if (this.inputManager.isKeyDown("r")) {
      this.weapon.reload();
    }

    // Store reference for external mouse event handling
    (this as any).fireWeapon = () => {
      this.weapon.fire(this.camera.position, this.camera.getDirection(Vector3.Forward()));
    };
  }

  private updateMovement(deltaTime: number) {
    // Apply gravity
    this.velocity.y -= this.gravity;

    // Clamp falling speed
    if (this.velocity.y < -0.3) {
      this.velocity.y = -0.3;
    }

    // Update camera position
    this.camera.position.addInPlace(this.velocity);

    // Simple ground collision (y = 0)
    if (this.camera.position.y <= 1.6) {
      this.camera.position.y = 1.6;
      this.velocity.y = 0;
      this.isJumping = false;
    }
  }

  private updateCamera() {
    // Get mouse delta for camera rotation
    const mouseDelta = this.inputManager.getMouseDelta();

    // Update yaw and pitch
    this.yaw += mouseDelta.x * this.mouseSensitivity;
    this.pitch += mouseDelta.y * this.mouseSensitivity;

    // Clamp pitch to prevent flipping
    this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));

    // Create rotation quaternion from yaw and pitch
    const rotationMatrix = Matrix.RotationYawPitchRoll(this.yaw, this.pitch, 0);
    const quaternion = Quaternion.FromRotationMatrix(rotationMatrix);
    this.camera.rotationQuaternion = quaternion;
  }

  takeDamage(amount: number) {
    this.health = Math.max(0, this.health - amount);
  }

  heal(amount: number) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  getHealth(): number {
    return this.health;
  }

  getMaxHealth(): number {
    return this.maxHealth;
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  getWeapon(): Weapon {
    return this.weapon;
  }

  getCamera(): UniversalCamera {
    return this.camera;
  }

  dispose() {
    this.weapon.dispose();
  }
}
