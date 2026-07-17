export class Crosshair {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "100";
    document.body.appendChild(this.canvas);

    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    this.ctx = ctx;

    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const size = 20;
    const thickness = 2;

    // Draw crosshair
    this.ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
    this.ctx.lineWidth = thickness;

    // Vertical line
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY - size);
    this.ctx.lineTo(centerX, centerY + size);
    this.ctx.stroke();

    // Horizontal line
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - size, centerY);
    this.ctx.lineTo(centerX + size, centerY);
    this.ctx.stroke();

    // Center dot
    this.ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  dispose() {
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
