export class Scoreboard {
  private kills = 0;
  private deaths = 0;
  private assists = 0;

  addKill() {
    this.kills++;
  }

  addDeath() {
    this.deaths++;
  }

  getStats() {
    return {
      kills: this.kills,
      deaths: this.deaths,
      assists: this.assists,
      kdr: this.deaths > 0 ? (this.kills / this.deaths).toFixed(2) : this.kills,
    };
  }

  reset() {
    this.kills = 0;
    this.deaths = 0;
    this.assists = 0;
  }
}