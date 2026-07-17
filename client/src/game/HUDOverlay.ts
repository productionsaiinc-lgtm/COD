export class HUDOverlay {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private health: number = 100;
  private maxHealth: number = 100;
  private ammo: number = 30;
  private maxAmmo: number = 120;
  private magazine: number = 30;
  private maxMagazine: number = 30;
  private kills: number = 0;
  private deaths: number = 0;
  private compass: number = 0; // 0-360 degrees

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "1000";
    this.canvas.style.display = "block";
    document.body.appendChild(this.canvas);

    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    this.ctx = ctx;

    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }

  setHealth(current: number, max: number) {
    this.health = current;
    this.maxHealth = max;
  }

  setAmmo(current: number, magazine: number, maxMagazine: number, total: number) {
    this.ammo = total;
    this.maxAmmo = total;
    this.magazine = magazine;
    this.maxMagazine = maxMagazine;
  }

  setCompass(rotation: number) {
    this.compass = (rotation * 180) / Math.PI;
  }

  setKills(kills: number, deaths: number) {
    this.kills = kills;
    this.deaths = deaths;
  }

  draw() {
    try {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const w = this.canvas.width;
      const h = this.canvas.height;
      const padding = 20;

      // Draw health indicator (top-left)
      this.drawHealthBar(padding, padding);

      // Draw ammo counter (top-right)
      this.drawAmmoCounter(w - 200, padding);

      // Draw compass (top-center)
      this.drawCompass(w / 2 - 50, padding + 40);

      // Draw minimap (bottom-left)
      this.drawMinimap(padding, h - 150);

      // Draw equipment slots (bottom-right)
      this.drawEquipmentSlots(w - 200, h - 100);

      // Draw kill feed (right side)
      this.drawKillFeed(w - 250, h / 2 - 100);

      // Draw center crosshair
      this.drawCrosshair(w / 2, h / 2);
    } catch (e) {
      console.error("HUD rendering error:", e);
    }
  }

  private drawHealthBar(x: number, y: number) {
    const width = 200;
    const height = 30;
    const healthPercent = this.health / this.maxHealth;

    // Background
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    this.ctx.fillRect(x, y, width, height);

    // Border
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);

    // Health bar
    const healthColor = healthPercent > 0.3 ? "#4ade80" : "#ef4444";
    this.ctx.fillStyle = healthColor;
    this.ctx.fillRect(x + 2, y + 2, (width - 4) * healthPercent, height - 4);

    // Text
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "bold 14px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`${Math.floor(this.health)} / ${this.maxHealth}`, x + width / 2, y + 20);
  }

  private drawAmmoCounter(x: number, y: number) {
    const width = 180;
    const height = 30;

    // Background
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    this.ctx.fillRect(x, y, width, height);

    // Border
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);

    // Text
    this.ctx.fillStyle = "#fbbf24";
    this.ctx.font = "bold 16px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`${this.magazine} / ${this.maxMagazine}`, x + width / 2, y + 20);

    // Total ammo
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "12px Arial";
    this.ctx.fillText(`Total: ${this.ammo}`, x + width / 2, y + 35);
  }

  private drawCompass(x: number, y: number) {
    const radius = 40;

    // Background circle
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Border
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();

    // Cardinal directions
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "bold 12px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    // N
    this.ctx.fillText("N", x, y - radius + 15);
    // S
    this.ctx.fillText("S", x, y + radius - 15);
    // E
    this.ctx.fillText("E", x + radius - 15, y);
    // W
    this.ctx.fillText("W", x - radius + 15, y);

    // Direction indicator
    const angle = (this.compass * Math.PI) / 180;
    this.ctx.strokeStyle = "#4ade80";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + Math.sin(angle) * (radius - 10), y - Math.cos(angle) * (radius - 10));
    this.ctx.stroke();
  }

  private drawMinimap(x: number, y: number) {
    const size = 120;

    // Background
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fillRect(x, y, size, size);

    // Border
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, size, size);

    // Grid
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const pos = (size / 4) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(x + pos, y);
      this.ctx.lineTo(x + pos, y + size);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(x, y + pos);
      this.ctx.lineTo(x + size, y + pos);
      this.ctx.stroke();
    }

    // Player position (center)
    this.ctx.fillStyle = "#4ade80";
    this.ctx.beginPath();
    this.ctx.arc(x + size / 2, y + size / 2, 5, 0, Math.PI * 2);
    this.ctx.fill();

    // Label
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "12px Arial";
    this.ctx.textAlign = "left";
    this.ctx.fillText("MINIMAP", x + 5, y + size + 15);
  }

  private drawEquipmentSlots(x: number, y: number) {
    const slotSize = 40;
    const spacing = 10;
    const slots = 3;

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    this.ctx.font = "12px Arial";
    this.ctx.textAlign = "center";

    for (let i = 0; i < slots; i++) {
      const slotX = x + i * (slotSize + spacing);

      // Slot background
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      this.ctx.fillRect(slotX, y, slotSize, slotSize);

      // Slot border
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(slotX, y, slotSize, slotSize);

      // Slot number
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillText(`${i + 1}`, slotX + slotSize / 2, y + slotSize / 2 + 5);
    }
  }

  private drawKillFeed(x: number, y: number) {
    const width = 200;
    const height = 60;

    // Background
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    this.ctx.fillRect(x, y, width, height);

    // Border
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);

    // Title
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "bold 12px Arial";
    this.ctx.textAlign = "left";
    this.ctx.fillText("KILL FEED", x + 10, y + 15);

    // Stats
    this.ctx.font = "12px Arial";
    this.ctx.fillText(`Kills: ${this.kills}`, x + 10, y + 35);
    this.ctx.fillText(`Deaths: ${this.deaths}`, x + 10, y + 50);
  }

  private drawCrosshair(x: number, y: number) {
    const size = 20;
    const thickness = 2;

    this.ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
    this.ctx.lineWidth = thickness;

    // Vertical line
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - size);
    this.ctx.lineTo(x, y + size);
    this.ctx.stroke();

    // Horizontal line
    this.ctx.beginPath();
    this.ctx.moveTo(x - size, y);
    this.ctx.lineTo(x + size, y);
    this.ctx.stroke();

    // Center dot
    this.ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
    this.ctx.beginPath();
    this.ctx.arc(x, y, 3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  dispose() {
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
