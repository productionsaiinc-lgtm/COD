import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { TextBlock } from "@babylonjs/gui/2D/controls/textBlock";
import { Rectangle } from "@babylonjs/gui/2D/controls/rectangle";
import { Color3 } from "@babylonjs/core/Maths/math.color";

export class UIManager {
  private scene: Scene;
  private advancedTexture: AdvancedDynamicTexture;
  private healthText: TextBlock;
  private ammoText: TextBlock;
  private minimapCanvas: HTMLCanvasElement;

  constructor(scene: Scene) {
    this.scene = scene;

    // Create advanced dynamic texture for 2D UI
    this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    // Create health display
    const healthPanel = new Rectangle("healthPanel");
    healthPanel.width = "200px";
    healthPanel.height = "50px";
    healthPanel.left = -10;
    healthPanel.top = 10;
    healthPanel.horizontalAlignment = 0; // Left
    healthPanel.verticalAlignment = -1; // Top
    healthPanel.background = "rgba(0, 0, 0, 0.5)";
    (healthPanel as any).borderColor = "green";
    (healthPanel as any).borderWidth = 2;
    this.advancedTexture.addControl(healthPanel);

    this.healthText = new TextBlock("healthText", "Health: 100/100");
    this.healthText.fontSize = 16;
    this.healthText.color = "lime";
    this.healthText.textHorizontalAlignment = 0; // Left
    healthPanel.addControl(this.healthText);

    // Create ammo display
    const ammoPanel = new Rectangle("ammoPanel");
    ammoPanel.width = "200px";
    ammoPanel.height = "50px";
    ammoPanel.left = 10;
    ammoPanel.top = 10;
    ammoPanel.horizontalAlignment = 1; // Right
    ammoPanel.verticalAlignment = -1; // Top
    ammoPanel.background = "rgba(0, 0, 0, 0.5)";
    (ammoPanel as any).borderColor = "yellow";
    (ammoPanel as any).borderWidth = 2;
    this.advancedTexture.addControl(ammoPanel);

    this.ammoText = new TextBlock("ammoText", "Ammo: 30/120");
    this.ammoText.fontSize = 16;
    this.ammoText.color = "yellow";
    this.ammoText.textHorizontalAlignment = 0; // Left
    ammoPanel.addControl(this.ammoText);

    // Create minimap placeholder
    this.minimapCanvas = document.createElement("canvas");
    this.minimapCanvas.width = 150;
    this.minimapCanvas.height = 150;
    this.minimapCanvas.style.position = "absolute";
    this.minimapCanvas.style.right = "10px";
    this.minimapCanvas.style.bottom = "10px";
    this.minimapCanvas.style.border = "2px solid cyan";
    this.minimapCanvas.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    document.body.appendChild(this.minimapCanvas);
  }

  updateHealth(current: number, max: number) {
    this.healthText.text = `Health: ${Math.ceil(current)}/${max}`;
  }

  updateAmmo(current: number, total: number) {
    this.ammoText.text = `Ammo: ${current}/${total}`;
  }

  updateMinimap(playerPos: Vector3, enemyPositions: Vector3[]) {
    const ctx = this.minimapCanvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);

    // Draw grid
    ctx.strokeStyle = "rgba(0, 255, 0, 0.2)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const pos = (i / 5) * this.minimapCanvas.width;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, this.minimapCanvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(this.minimapCanvas.width, pos);
      ctx.stroke();
    }

    // Draw player
    const scale = 15; // pixels per unit
    const centerX = this.minimapCanvas.width / 2;
    const centerY = this.minimapCanvas.height / 2;

    ctx.fillStyle = "lime";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw enemies
    ctx.fillStyle = "red";
    for (const enemyPos of enemyPositions) {
      const relX = (enemyPos.x - playerPos.x) * scale;
      const relZ = (enemyPos.z - playerPos.z) * scale;

      const mapX = centerX + relX;
      const mapY = centerY + relZ;

      // Clamp to minimap bounds
      if (mapX >= 0 && mapX <= this.minimapCanvas.width && mapY >= 0 && mapY <= this.minimapCanvas.height) {
        ctx.beginPath();
        ctx.arc(mapX, mapY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  dispose() {
    if (this.minimapCanvas.parentNode) {
      this.minimapCanvas.parentNode.removeChild(this.minimapCanvas);
    }
    this.advancedTexture.dispose();
  }
}
