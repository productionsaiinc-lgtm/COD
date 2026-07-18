# Assets

## Art Direction

**Visual Target Reference:** `/manus-storage/cod_game_reference_e4b178c2.png`

The game features a modern tactical military aesthetic inspired by Call of Duty Mobile. The art direction emphasizes:

- **Aesthetic:** Modern tactical FPS with high-contrast lighting and desaturated earth tones

# Assets

## Art Direction

**Visual Target Reference:** Modern tactical military aesthetic inspired by Call of Duty Mobile.

The game should feel grounded but optimized for mobile — clean, readable, and responsive on small screens.

### Core Visual Pillars
- Tactical Realism with mobile clarity
- High visibility for enemies and objectives
- Mobile-first UI and controls
- Fast visual feedback

## Environment

### Map Types
| Type              | Size   | Main Modes                     |
|-------------------|--------|--------------------------------|
| Small Arena       | Small  | TDM, Kill Confirmed, Gun Game  |
| Medium Urban      | Medium | Domination, Hardpoint, S&D     |
| Large Open World  | Large  | Battle Royale                  |

### Needed Environment Assets
- Ground textures (sand, concrete, grass, asphalt, mud)
- Buildings (apartments, warehouses, bunkers)
- Props (crates, cars, barriers, containers, sandbags)
- Foliage (trees, bushes, grass)
- Battle Royale: Airplane, supply drops, watchtowers

## Characters & Classes

| Class     | Visual Style             | Special Features             |
|-----------|--------------------------|------------------------------|
| Medic     | White/green accents      | Revive + healing abilities   |
| Ninja     | Dark/stealth             | Silent movement              |
| Defender  | Heavy armor              | Extra protection + shield    |
| Assault   | Standard tactical        | Balanced                     |

**Enemies (Zombies):** Basic walkers, runners, armored zombies, bosses.

## Weapons

**Current Categories:**
- **Assault Rifles**: AK-117, M4, AK-47, KN-44, DR-H, Grau 5.56
- **SMGs**: QQ9, CBR4, Fennec, Switchblade, PP19 Bizon
- **LMGs**: Holger, RPD, Chopper
- **Snipers**: DL Q33, Locus, HDR
- **Shotguns**: KRM, BY15
- **Pistols**: MW11, .50 GS
- **Launchers**: FHJ, SMRS

**Attachment Types:**
Optics, Muzzle, Barrel, Stock, Underbarrel, Magazine, Laser, Rear Grip

## UI / HUD (Mobile Optimized)

**Required Elements:**
- Large Health + Armor bar
- Big Ammo counter
- Virtual Left Joystick (Movement)
- Virtual Right Joystick (Look/Camera)
- Action Buttons: Fire, ADS, Reload, Jump, Sprint, Crouch/Prone
- Minimap + Compass
- Kill Feed
- Objective markers (for Domination, Hardpoint, etc.)

## Effects & VFX

- Muzzle flash (per weapon)
- Bullet impacts + blood
- Hit markers
- Explosions and smoke
- Safe zone border effect (Battle Royale)
- Supply drop + airdrop effects
- Revive/healing effects

## Audio

**Priority Sounds:**
- Weapon fire (normal + suppressed)
- Reload animations
- Footsteps (different surfaces)
- Hit and death sounds
- Objective capture sounds
- Safe zone warning
- Zombie sounds

## Current Status (as of July 18, 2026)

| Category                | Status          | Notes |
|-------------------------|------------------|-------|
| Core Game Loop          | Good             | GameWorld + Player + Weapon base done |
| Game Modes              | Good             | GameModeManager implemented |
| Weapons + Attachments   | Code Ready       | Full WeaponSystem + Gunsmith logic done |
| Classes System          | Code Ready       | Medic, Ninja, Defender implemented |
| Battle Royale Core      | Started          | Safe zone + basic systems |
| Zombies Mode            | Started          | Wave system working |
| Touch Controls          | In Progress      | Virtual joysticks being added |
| UI / HUD                | Partial          | Basic HUD exists, needs mobile polish |
| Progression             | Basic            | XP system foundation exists |
| 3D Models & Art         | Needed           | Most visual assets still missing |
| Audio                   | Placeholder      | AudioManager created |
| Effects & VFX           | Basic            | Needs expansion |

## Next Priority Assets to Create

1. **Mobile Touch Controls** (Virtual joysticks + action buttons) — Highest priority
2. Weapon 3D models + LODs
3. Attachment models (visible on weapons)
4. Character class models (Medic, Ninja, Defender)
5. Battle Royale loot models + airdrop
6. Safe zone visual effect
7. Improved muzzle flashes and impact effects
8. Minimap and objective marker visuals

## Technical Requirements (Mobile)

- LOD system for all 3D assets
- Compressed textures (ASTC / ETC2)
- Target: Stable 60fps on mid-range Android/iOS devices
- Touch targets minimum \~44px
- Optimized draw calls

---
- **Color Palette:** Desaturated military colors (sand, concrete gray, dark green), with accent colors (bright green for friendly UI, red for enemies/danger, yellow for objectives)
- **Perspective:** First-person view with weapon visible in lower right corner
- **Atmosphere:** Desert/urban warzone with dust particles, overcast lighting, tactical military tone
- **Visual Density:** Clean, sharp digital rendering with clear object separation (not photorealistic)
- **Lighting:** High-contrast tactical lighting with clear shadows and highlights

## Generated Assets

| Asset | Purpose | URL | Status |
|-------|---------|-----|--------|
| Game Reference | Visual target for art direction | `/manus-storage/cod_game_reference_e4b178c2.png` | Generated |
| Sand Texture | Desert ground tiling texture | `/manus-storage/sand_texture_453684b6.png` | Generated |
| Concrete Texture | Urban ground tiling texture | `/manus-storage/concrete_texture_24f4cb4a.png` | Generated |
| Crosshair UI | Tactical crosshair overlay | `/manus-storage/crosshair_ui_a148d89b.png` | Generated |
| Ammo Counter BG | Ammo display background | `/manus-storage/ammo_counter_bg_526d2443.png` | Generated |
| Health Bar BG | Health bar background | `/manus-storage/health_bar_bg_4e259867.png` | Generated |

## Asset Generation Plan

### Textures & Materials
- [x] Desert sand ground texture (tiling) - `/manus-storage/sand_texture_453684b6.png`
- [x] Concrete/asphalt urban ground texture (tiling) - `/manus-storage/concrete_texture_24f4cb4a.png`
- [ ] Rusted metal texture (for vehicles/barriers)
- [ ] Brick/concrete wall texture
- [ ] Weapon metal texture (tactical finish)

### UI Elements
- [x] Crosshair (red/white tactical style) - `/manus-storage/crosshair_ui_a148d89b.png`
- [x] Health bar background - `/manus-storage/health_bar_bg_4e259867.png`
- [x] Ammo counter display - `/manus-storage/ammo_counter_bg_526d2443.png`
- [ ] Minimap background
- [ ] Kill feed background
- [ ] Compass needle and background

### Environmental Props
- [ ] Ammunition crate (wooden/metal)
- [ ] Supply drop container
- [ ] Concrete barrier/sandbag
- [ ] Destroyed vehicle wreckage
- [ ] Building rubble pieces

### Character & Weapon Assets
- [ ] Soldier silhouette (for enemies)
- [ ] Assault rifle model (simplified 3D)
- [ ] Muzzle flash effect

### Skybox & Environment
- [ ] Desert sky texture
- [ ] Distant mountains/horizon
- [ ] Dust particle effect texture
