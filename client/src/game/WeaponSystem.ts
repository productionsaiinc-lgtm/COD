export interface Attachment {
  id: string;
  name: string;
  type: string;
  stats: { damage?: number; fireRate?: number; accuracy?: number; mobility?: number };
}

export class Weapon {
  constructor(
    public id: string,
    public name: string,
    public baseDamage: number,
    public baseFireRate: number,
    public attachments: Attachment[] = []
  ) {}

  getCurrentStats() {
    let damage = this.baseDamage;
    let fireRate = this.baseFireRate;
    let accuracy = 70;
    let mobility = 80;

    this.attachments.forEach(att => {
      if (att.stats.damage) damage += att.stats.damage;
      if (att.stats.fireRate) fireRate += att.stats.fireRate;
      if (att.stats.accuracy) accuracy += att.stats.accuracy;
      if (att.stats.mobility) mobility += att.stats.mobility;
    });

    return { damage, fireRate, accuracy, mobility };
  }

  addAttachment(attachment: Attachment) {
    if (!this.attachments.find(a => a.id === attachment.id)) {
      this.attachments.push(attachment);
    }
  }
}

export class WeaponSystem {
  private weapons = new Map<string, Weapon>();
  private attachments = new Map<string, Attachment>();

  constructor() {
    this.registerWeapons();
    this.registerAttachments();
  }

  private registerWeapons() {
    this.weapons.set('ak117', new Weapon('ak117', 'AK-117', 28, 0.08));
    this.weapons.set('m4', new Weapon('m4', 'M4', 26, 0.09));
    this.weapons.set('qq9', new Weapon('qq9', 'QQ9', 22, 0.06));
    this.weapons.set('dlq33', new Weapon('dlq33', 'DL Q33', 85, 1.2));
  }

  private registerAttachments() {
    this.attachments.set('red-dot', { id: 'red-dot', name: 'Red Dot', type: 'optic', stats: { accuracy: 12 } });
    this.attachments.set('compensator', { id: 'compensator', name: 'Compensator', type: 'muzzle', stats: { accuracy: 8 } });
    this.attachments.set('extended-mag', { id: 'extended-mag', name: 'Extended Mag', type: 'magazine', stats: { mobility: -5 } });
  }

  getWeapon(id: string) { return this.weapons.get(id); }
  getAttachment(id: string) { return this.attachments.get(id); }
}
