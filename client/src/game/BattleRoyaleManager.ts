export class BattleRoyaleManager {
  private safeZone = { x: 0, z: 0, radius: 800 };

  startMatch() {
    console.log('[BR] Match started');
    this.startSafeZoneShrink();
  }

  private startSafeZoneShrink() {
    setInterval(() => {
      if (this.safeZone.radius > 50) {
        this.safeZone.radius *= 0.82;
        console.log(`[BR] Safe zone: ${Math.floor(this.safeZone.radius)}m`);
      }
    }, 40000);
  }

  isPlayerInSafeZone(position: { x: number; z: number }) {
    const dx = position.x - this.safeZone.x;
    const dz = position.z - this.safeZone.z;
    return Math.sqrt(dx * dx + dz * dz) <= this.safeZone.radius;
  }
}
