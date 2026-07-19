export type GameMode = 
  | 'team_deathmatch' | 'domination' | 'kill_confirmed' | 'hardpoint'
  | 'search_destroy' | 'gun_game' | 'free_for_all' | 'capture_the_flag'
  | 'headquarters' | 'battle_royale' | 'zombies';

export class GameModeManager {
  private currentMode: GameMode = 'team_deathmatch';
  private scores = new Map<string, number>();
  private config: any;

  constructor(mode: GameMode = 'team_deathmatch') {
    this.setMode(mode);
  }

  setMode(mode: GameMode) {
    this.currentMode = mode;
    this.scores.clear();
    this.config = this.getConfig(mode);
  }

  private getConfig(mode: GameMode) {
    const configs: any = {
      team_deathmatch: { name: 'Team Deathmatch', maxPlayers: 12, teamBased: true, scoreLimit: 75 },
      domination: { name: 'Domination', maxPlayers: 12, teamBased: true, hasObjectives: true, scoreLimit: 150 },
      kill_confirmed: { name: 'Kill Confirmed', maxPlayers: 12, teamBased: true, hasObjectives: true, scoreLimit: 65 },
      battle_royale: { name: 'Battle Royale', maxPlayers: 100, teamBased: false, hasRespawn: false },
      free_for_all: { name: 'Free For All', maxPlayers: 8, teamBased: false, scoreLimit: 30 },
      zombies: { name: 'Zombies', maxPlayers: 4, teamBased: false, hasRespawn: true },
    };
    return configs[mode] || configs.team_deathmatch;
  }

  addScore(id: string, amount: number) {
    this.scores.set(id, (this.scores.get(id) || 0) + amount);
  }

  getCurrentMode() { return this.currentMode; }
  getConfig() { return this.config; }
}
