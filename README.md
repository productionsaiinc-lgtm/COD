# COD Mobile FPS - Babylon.js

A browser-based first-person shooter inspired by Call of Duty Mobile, built with Babylon.js, TypeScript, Vite + React.

## Features Implemented

- Mobile-first touch controls (virtual joysticks + action buttons)
- Multiple game modes (Team Deathmatch, Kill Confirmed, Domination)
- Weapon system with 3D model support
- Dynamic weather (rain, snow, fog)
- Dynamic clouds
- PBR terrain with texture splatting
- Procedural terrain generation + normal map baking
- Particle effects (rain, snow, muzzle flash)
- Dynamic shadows + HDR lighting
- Volumetric fog
- Post-processing (bloom, tone mapping)
- Scoreboard + basic progression
- LOD system for performance
- Mobile optimizations

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm (recommended)

### Installation
```bash
pnpm install
```

### Development
```bash
pnpm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production
```bash
pnpm run build
```

## Deployment

This project is configured for easy deployment on **Render**:

1. Connect your GitHub repo to Render
2. Use these settings:
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `node dist/index.js`
   - **Environment**: Node

## Project Structure

```
client/src/game/
├── GameWorld.ts          # Main game loop + systems integration
├── scene.ts              # Babylon.js scene setup + rendering
├── TouchControls.ts        # Mobile virtual joysticks + buttons
├── Weapon.ts               # 3D weapon class
├── ParticleEffects.ts      # Rain, snow, muzzle flash
├── WeatherSystem.ts        # Dynamic weather
├── CloudSystem.ts          # Animated clouds
├── AdvancedPBRTerrain.ts   # PBR + texture splatting
├── TerrainGenerator.ts     # Procedural terrain
├── NormalMapBaker.ts       # Generate normal maps from height
├── LODManager.ts           # Level of Detail system
└── ...
```

## Roadmap

See `TODO.md` for current progress and remaining features.

## License
MIT