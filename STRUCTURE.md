# Game Architecture: COD Mobile - Battle Royale FPS

## Core Principles

- **Composition over Inheritance:** Game entities will be built by composing reusable components (e.g., `HealthComponent`, `WeaponComponent`, `AIComponent`) rather than deep inheritance hierarchies.
- **Clear Ownership:** Gameplay objects (e.g., `Player`, `Enemy`, `Projectile`) will own their corresponding Babylon.js nodes and manage their lifecycle.
- **Framework Agnostic Gameplay Logic:** Core game logic will reside in plain TypeScript classes under `client/src/game/`, minimizing direct React coupling.
- **Event-Driven Communication:** Use an event bus or similar mechanism for loose coupling between different game systems (e.g., `PlayerHitEvent`, `EnemyDiedEvent`).

## Top-Level Modules and Classes

### `client/src/game/`

- **`scene.ts`**: Entry point for the Babylon.js scene. Contains `createGameScene` function responsible for initializing the Babylon engine, scene, camera, and lights. It will also orchestrate the creation and management of `GameWorld`.
  - `createGameScene(engine, canvas): Promise<GameHandle>`: Initializes the Babylon.js scene and returns a `GameHandle` for cleanup.
  - `GameHandle`: Interface with `scene: Scene` and `dispose: () => void`.

- **`GameWorld.ts`**: Manages the overall game state, entities, and game loop. Responsible for spawning players, enemies, and props, and updating their states.
  - `constructor(scene: Scene)`: Initializes the game world with the Babylon.js scene.
  - `update(deltaTime: number)`: Main game loop update method.
  - `addEntity(entity: GameEntity)`: Adds a game entity to the world.
  - `removeEntity(entity: GameEntity)`: Removes a game entity from the world.

- **`Player.ts`**: Represents the player character. Manages player input, movement, weapon handling, and health.
  - `constructor(gameWorld: GameWorld, scene: Scene, camera: UniversalCamera)`: Initializes the player.
  - `update(deltaTime: number)`: Updates player state based on input.
  - `handleInput()`: Processes player input.
  - `shoot()`: Handles weapon firing.

- **`Enemy.ts`**: Represents an AI-controlled enemy. Manages AI behavior, movement, and combat.
  - `constructor(gameWorld: GameWorld, scene: Scene, position: Vector3)`: Initializes an enemy.
  - `update(deltaTime: number)`: Updates enemy AI and movement.
  - `attack()`: Handles enemy attack logic.

- **`Weapon.ts`**: Represents a weapon in the game. Manages firing mechanics, ammunition, and visual effects.
  - `constructor(scene: Scene, parentMesh: AbstractMesh)`: Attaches the weapon to a parent mesh (e.g., player's hand).
  - `fire()`: Fires the weapon, creating projectiles or raycasts.
  - `reload()`: Handles weapon reloading.

- **`Projectile.ts`**: Represents a projectile fired from a weapon. Manages its movement, collision detection, and lifetime.
  - `constructor(scene: Scene, position: Vector3, direction: Vector3)`: Initializes a projectile.
  - `update(deltaTime: number)`: Updates projectile position and checks for collisions.

- **`InputManager.ts`**: Handles all user input (keyboard, mouse, touch) and provides a normalized interface for game systems.
  - `constructor(canvas: HTMLCanvasElement)`: Initializes input listeners.
  - `isKeyDown(key: string): boolean`
  - `getMouseDelta(): { x: number, y: number }`
  - `onPointerLockChange(callback: (locked: boolean) => void)`

- **`UIManager.ts`**: Manages the display and updates of all HUD elements.
  - `constructor(scene: Scene)`: Initializes UI elements (e.g., health bar, ammo counter).
  - `updateHealth(health: number)`
  - `updateAmmo(current: number, total: number)`
  - `updateMinimap(playerPos: Vector3, enemies: Vector3[])`

## Data Structures

- **`GameEntity` Interface:** Defines common properties and methods for all game objects (e.g., `id`, `mesh`, `update`, `dispose`).
- **`HealthComponent`:** Reusable component for entities with health.
- **`PhysicsComponent`:** Encapsulates physics behavior for entities.

## Asset Management

- **`AssetManager.ts`**: (Future consideration) Manages loading and caching of game assets (textures, models, sounds). For now, assets will be loaded directly where needed.

## Dependencies

- **Babylon.js:** Core 3D engine.
- **React:** For hosting the Babylon.js canvas and UI.
- **Tailwind CSS:** For styling React components and UI.

## Flow of Control

1. `main.tsx` renders `App.tsx`.
2. `App.tsx` renders `GameCanvas.tsx`.
3. `GameCanvas.tsx` initializes Babylon.js `Engine` and calls `createGameScene`.
4. `createGameScene` sets up the `Scene`, `Camera`, `Light`, and creates an instance of `GameWorld`.
5. `GameWorld` then creates `Player`, `Enemy` instances, and other game entities.
6. The Babylon.js render loop calls `GameWorld.update()` every frame, which in turn updates all active game entities.
7. `InputManager` listens for user input and `UIManager` updates the HUD.
