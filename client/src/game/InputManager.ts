export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private mouseX = 0;
  private mouseY = 0;
  private prevMouseX = 0;
  private prevMouseY = 0;
  private pointerLocked = false;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupListeners();
  }

  private setupListeners() {
    // Keyboard events
    window.addEventListener("keydown", (e) => {
      this.keys.set(e.key.toLowerCase(), true);
    });

    window.addEventListener("keyup", (e) => {
      this.keys.set(e.key.toLowerCase(), false);
    });

    // Mouse movement
    document.addEventListener("mousemove", (e) => {
      if (this.pointerLocked) {
        // Use movementX/Y for pointer-locked mouse
        this.mouseX += e.movementX || 0;
        this.mouseY += e.movementY || 0;
      } else {
        // Use clientX/Y for normal mouse
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      }
    });

    // Pointer lock
    this.canvas.addEventListener("click", () => {
      this.canvas.requestPointerLock = this.canvas.requestPointerLock || (this.canvas as any).mozRequestPointerLock;
      this.canvas.requestPointerLock?.();
    });

    document.addEventListener("pointerlockchange", () => {
      this.pointerLocked = document.pointerLockElement === this.canvas;
    });

    document.addEventListener("mozpointerlockchange", () => {
      this.pointerLocked = (document as any).mozPointerLockElement === this.canvas;
    });

    // Pointer lock error
    document.addEventListener("pointerlockerror", () => {
      console.warn("Pointer lock request failed");
    });
  }

  isKeyDown(key: string): boolean {
    return this.keys.get(key.toLowerCase()) ?? false;
  }

  getMouseDelta(): { x: number; y: number } {
    if (this.pointerLocked) {
      // Return accumulated movement and reset
      const deltaX = this.mouseX - this.prevMouseX;
      const deltaY = this.mouseY - this.prevMouseY;
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
      return { x: deltaX, y: deltaY };
    }
    const deltaX = this.mouseX - this.prevMouseX;
    const deltaY = this.mouseY - this.prevMouseY;
    return { x: deltaX, y: deltaY };
  }

  getMousePosition(): { x: number; y: number } {
    return { x: this.mouseX, y: this.mouseY };
  }

  isPointerLockedState(): boolean {
    return this.pointerLocked;
  }

  dispose() {
    // Clean up event listeners if needed
  }
}
