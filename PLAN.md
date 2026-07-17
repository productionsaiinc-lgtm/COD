# Game Plan: COD Mobile - Battle Royale FPS

## Risk Tasks

### 1. First-Person Camera and Pointer Lock
- **Why isolated:** Implementing a robust first-person camera with accurate mouse-look and browser pointer-lock can be challenging, especially ensuring compatibility across different browsers and handling user gestures for activation. Pointer-lock can silently fail in certain embedded contexts, requiring careful error handling and fallback mechanisms.
- **Approach:** Implement a basic first-person camera using Babylon.js's UniversalCamera. Integrate the browser's Pointer Lock API, ensuring it activates on user interaction (e.g., first click on the canvas). Handle `pointerlockchange` and `pointerlockerror` events to provide a smooth user experience. Test thoroughly in various browser environments.
- **Verify:**
  - Camera movement is smooth and responsive to mouse input.
  - Pointer lock engages and disengages correctly on user interaction.
  - No unexpected camera jumps or disorientations.
  - Game remains playable if pointer lock fails (e.g., mouse cursor remains visible but still controls camera).

### 2. Player and Enemy Animations
- **Why isolated:** Implementing multi-directional character animations (idle, walk, run, shoot) with smooth transitions between states is complex. Issues often arise with incorrect frame playback for directions, stuttering transitions, or animation blending problems, especially when integrating with movement and combat systems.
- **Approach:** Define a clear animation state machine for the player and enemies (e.g., Idle, Walk, Run, Shoot, Death). Use Babylon.js's animation blending capabilities to ensure smooth transitions between states. Implement a system to map player input and enemy AI state to the correct animation playback. Start with simple placeholder animations and refine as assets become available.
- **Verify:**
  - Player character animations (idle, walk, run, shoot) play correctly based on input.
  - Transitions between animation states are smooth and natural.
  - Enemy animations (walk, attack, death) are triggered appropriately by AI.
  - No animation glitches, popping, or incorrect frame displays.

### 3. Enemy AI and Pathfinding
- **Why isolated:** Developing intelligent enemy AI that can navigate a complex open-world environment, avoid obstacles, and engage the player effectively is a significant challenge. Pathfinding algorithms can be computationally intensive and prone to issues like getting stuck, taking inefficient routes, or failing to adapt to dynamic changes in the environment.
- **Approach:** Utilize a simplified navigation mesh (navmesh) for enemy pathfinding. Implement a basic state machine for enemy behavior (e.g., Patrol, Chase, Attack, Flee). For initial implementation, use simple obstacle avoidance (e.g., raycasting) and direct pathfinding to the player. Later, explore Babylon.js's `recastjs` plugin for more robust navmesh generation and pathfinding if needed.
- **Verify:**
  - Enemies can move around the environment without getting stuck.
  - Enemies correctly detect and chase the player within a defined range.
  - Enemies engage the player in combat (e.g., fire weapon) when in range.
  - Enemies react to being shot (e.g., flinch, die animation).

## Main Build

This section outlines the core systems and features that will be built, assuming the isolated risk tasks are handled.

- **Core FPS Mechanics:** Implement player movement (walk, run, jump), weapon firing, reloading, and hit detection.
- **Open-World Environment:** Construct a large, textured 3D environment based on the visual target, including terrain, buildings, and props.
- **HUD Elements:** Display health bar, ammo counter, minimap, compass, and kill feed as per the reference image.
- **Basic Combat System:** Implement damage calculation, player and enemy health, and death states.
- **Mobile Controls:** Design and implement on-screen joysticks and buttons for mobile input.

- **Assets needed:**
  - **Textures:** Desert sand, concrete, rusted metal, brick, weapon metal.
  - **UI Elements:** Crosshair, health bar, ammo display, minimap, kill feed, compass.
  - **Environmental Props:** Ammunition crates, supply drops, concrete barriers, destroyed vehicles, building rubble.
  - **Character & Weapon Models:** Simplified 3D assault rifle model, basic soldier model for enemies.
  - **Effects:** Muzzle flash, hit effects, dust particles.

- **Verify:**
  - Player movement (forward, backward, strafe, jump) is fluid and responsive.
  - Weapon firing and reloading animations are synchronized with input.
  - Projectiles (or raycasts) correctly register hits on enemies.
  - UI elements are correctly positioned, readable, and update dynamically (e.g., ammo count, health).
  - Environment loads without missing textures or visual artifacts.
  - Game runs smoothly with acceptable frame rates on target devices.
  - Gameplay flow matches the description (spawn, move, find enemies, engage).
  - No visual glitches, clipping, or placeholder assets.
  - No browser console errors during capture.
  - reference.png consistency: color palette, scale, camera angle, visual density.
  - **Presentation proof bundle:** Latest final-attempt folder under `screenshots/result/{N}/`
    - Record from the running Vite dev server at `http://127.0.0.1:5173` through `scripts/capture.mjs video` (Playwright + Chrome/Chromium). Default duration is 15s; extend to 30s only when needed for coverage.
    - `{N}` is a simple integer counter; increment it for each new final attempt
    - Store both `video.webm` (browser recording) and `video.mp4` (ffmpeg re-encode) in that folder
    - **3D:** scripted camera path or orbit, deliberate lighting, post-processing where it earns its cost
