export interface JoystickState {
  active: boolean;
  x: number;
  y: number;
  angle: number;
  force: number;
}

export class TouchControls {
  private container: HTMLElement;
  private leftJoystick: HTMLElement | null = null;
  private rightJoystick: HTMLElement | null = null;
  private leftKnob: HTMLElement | null = null;
  private rightKnob: HTMLElement | null = null;

  public leftState: JoystickState = { active: false, x: 0, y: 0, angle: 0, force: 0 };
  public rightState: JoystickState = { active: false, x: 0, y: 0, angle: 0, force: 0 };

  private buttons: Map<string, HTMLButtonElement> = new Map();

  constructor(container: HTMLElement) {
    this.container = container;
    this.createLeftJoystick();
    this.createRightJoystick();
    this.createActionButtons();
    this.setupListeners();
  }

  private createLeftJoystick() {
    const joystick = document.createElement('div');
    joystick.style.cssText = `position:absolute;bottom:80px;left:40px;width:130px;height:130px;background:rgba(255,255,255,0.12);border:3px solid rgba(255,255,255,0.35);border-radius:50%;touch-action:none;z-index:1000;`;
    
    const knob = document.createElement('div');
    knob.style.cssText = `position:absolute;top:50%;left:50%;width:50px;height:50px;background:rgba(255,255,255,0.6);border-radius:50%;transform:translate(-50%, -50%);pointer-events:none;`;
    
    joystick.appendChild(knob);
    this.container.appendChild(joystick);
    
    this.leftJoystick = joystick;
    this.leftKnob = knob;
  }

  private createRightJoystick() {
    const joystick = document.createElement('div');
    joystick.style.cssText = `position:absolute;bottom:80px;right:40px;width:130px;height:130px;background:rgba(255,255,255,0.12);border:3px solid rgba(255,255,255,0.35);border-radius:50%;touch-action:none;z-index:1000;`;
    
    const knob = document.createElement('div');
    knob.style.cssText = `position:absolute;top:50%;left:50%;width:50px;height:50px;background:rgba(255,255,255,0.6);border-radius:50%;transform:translate(-50%, -50%);pointer-events:none;`;
    
    joystick.appendChild(knob);
    this.container.appendChild(joystick);
    
    this.rightJoystick = joystick;
    this.rightKnob = knob;
  }

  private createActionButtons() {
    const actions = [
      { name: 'fire', label: 'FIRE', bottom: '200px', right: '30px', color: '#ff4444' },
      { name: 'ads', label: 'ADS', bottom: '140px', right: '30px', color: '#4488ff' },
      { name: 'reload', label: 'RELOAD', bottom: '80px', right: '120px', color: '#ffaa00' },
      { name: 'jump', label: 'JUMP', bottom: '200px', right: '120px', color: '#44ff88' },
    ];

    actions.forEach(action => {
      const btn = document.createElement('button');
      btn.textContent = action.label;
      btn.style.cssText = `position:absolute;bottom:\( {action.bottom};right: \){action.right};padding:16px 24px;font-size:15px;font-weight:bold;background:rgba(30,30,30,0.9);color:white;border:2px solid ${action.color};border-radius:12px;touch-action:none;z-index:1001;`;
      
      btn.addEventListener('touchstart', () => this.handleButtonPress(action.name, true));
      btn.addEventListener('touchend', () => this.handleButtonPress(action.name, false));
      
      this.container.appendChild(btn);
      this.buttons.set(action.name, btn);
    });
  }

  private handleButtonPress(name: string, pressed: boolean) {
    // You can emit events or set flags here
    console.log(`Button ${name}: ${pressed ? 'pressed' : 'released'}`);
    // Example: if (name === 'fire') this.isFiring = pressed;
  }

  private setupListeners() {
    if (this.leftJoystick) {
      this.leftJoystick.addEventListener('touchstart', (e) => this.handleJoystickStart(e, 'left'));
      this.leftJoystick.addEventListener('touchmove', (e) => this.handleJoystickMove(e, 'left'));
      this.leftJoystick.addEventListener('touchend', () => this.handleJoystickEnd('left'));
    }
    if (this.rightJoystick) {
      this.rightJoystick.addEventListener('touchstart', (e) => this.handleJoystickStart(e, 'right'));
      this.rightJoystick.addEventListener('touchmove', (e) => this.handleJoystickMove(e, 'right'));
      this.rightJoystick.addEventListener('touchend', () => this.handleJoystickEnd('right'));
    }
  }

  private handleJoystickStart(e: TouchEvent, side: 'left' | 'right') {
    const state = side === 'left' ? this.leftState : this.rightState;
    state.active = true;
  }

  private handleJoystickMove(e: TouchEvent, side: 'left' | 'right') {
    const joystick = side === 'left' ? this.leftJoystick : this.rightJoystick;
    const knob = side === 'left' ? this.leftKnob : this.rightKnob;
    const state = side === 'left' ? this.leftState : this.rightState;

    if (!joystick || !state.active) return;

    const rect = joystick.getBoundingClientRect();
    const touch = e.touches[0];
    let x = touch.clientX - (rect.left + rect.width / 2);
    let y = touch.clientY - (rect.top + rect.height / 2);

    const max = rect.width / 2;
    const dist = Math.sqrt(x * x + y * y);

    if (dist > max) {
      x = (x / dist) * max;
      y = (y / dist) * max;
    }

    state.x = x / max;
    state.y = y / max;
    state.angle = Math.atan2(y, x);
    state.force = Math.min(dist / max, 1);

    // Move visual knob
    if (knob) {
      knob.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }
  }

  private handleJoystickEnd(side: 'left' | 'right') {
    const state = side === 'left' ? this.leftState : this.rightState;
    const knob = side === 'left' ? this.leftKnob : this.rightKnob;

    state.active = false;
    state.x = 0;
    state.y = 0;
    state.force = 0;

    if (knob) knob.style.transform = `translate(-50%, -50%)`;
  }

  getMovementVector() {
    return { x: this.leftState.x, y: this.leftState.y };
  }

  getLookDelta() {
    return { x: this.rightState.x, y: this.rightState.y };
  }

  dispose() {
    this.buttons.forEach(btn => btn.remove());
    if (this.leftJoystick) this.leftJoystick.remove();
    if (this.rightJoystick) this.rightJoystick.remove();
  }
}