export class ZombiesManager {
  private wave = 1;
  private zombiesAlive = 0;

  startWave() {
    this.zombiesAlive = 20 + (this.wave * 8);
    console.log(`[Zombies] Wave ${this.wave} started with ${this.zombiesAlive} zombies`);
  }

  zombieKilled() {
    this.zombiesAlive--;
    if (this.zombiesAlive <= 0) {
      this.wave++;
      setTimeout(() => this.startWave(), 5000);
    }
  }

  getCurrentWave() {
    return this.wave;
  }
}
