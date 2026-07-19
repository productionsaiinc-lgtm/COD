export interface Class {
  id: string;
  name: string;
  description: string;
  perks: string[];
  ability?: string;
}

export class ClassSystem {
  private classes = new Map<string, Class>();

  constructor() {
    this.registerClasses();
  }

  private registerClasses() {
    this.classes.set('medic', {
      id: 'medic',
      name: 'Medic',
      description: 'Revive teammates faster and heal over time',
      perks: ['quick-revive', 'healing-aura'],
      ability: 'Deploy Medic Drone',
    });

    this.classes.set('ninja', {
      id: 'ninja',
      name: 'Ninja',
      description: 'Silent movement and increased mobility',
      perks: ['dead-silence', 'lightweight'],
      ability: 'Smoke Grenade',
    });

    this.classes.set('defender', {
      id: 'defender',
      name: 'Defender',
      description: 'Extra armor and reduced damage',
      perks: ['flak-jacket', 'toughness'],
      ability: 'Deploy Shield',
    });
  }

  getClass(id: string) {
    return this.classes.get(id);
  }
}
