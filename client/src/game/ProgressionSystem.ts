export class ProgressionSystem {
  private playerLevel = 1;
  private weaponXP = new Map<string, number>();

  addXP(amount: number) {
    console.log(`[Progression] Gained ${amount} XP`);
  }

  levelUpWeapon(weaponId: string) {
    const current = this.weaponXP.get(weaponId) || 0;
    this.weaponXP.set(weaponId, current + 100);
  }

  getPlayerLevel() {
    return this.playerLevel;
  }
}
