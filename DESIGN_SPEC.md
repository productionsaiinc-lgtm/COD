# COD Mobile Game - Design Specification

## Reference Analysis

### Image 1: Main Menu/Lobby Screen
- **Soldier Character**: Center-focused with realistic tactical gear
- **Weapon Display**: Detailed weapon model with attachments visible
- **UI Layout**: 
  - Top bar: Player level, currency, notifications
  - Right panel: Battle Pass, Featured items, Store
  - Left panel: Mission info, Event details
  - Bottom bar: Navigation (Store, Loadout, Weapons, etc.)
- **Color Scheme**: Dark background with purple/blue accents
- **Visual Style**: Modern, tactical, professional

### Image 2: In-Game Gameplay
- **First-Person View**: Weapon prominently displayed in bottom-right corner
- **Environment**: Desert/urban landscape with buildings, vehicles, trees
- **HUD Elements**:
  - **Top-Left**: Health indicator (100/100)
  - **Top-Right**: Ammo counter (30/120)
  - **Bottom-Left**: Minimap with player position and enemies
  - **Bottom-Center**: Ammo/Magazine counter (5/6, 30/30)
  - **Right Side**: Equipment slots, ability icons
  - **Top-Center**: Compass/radar
  - **Center**: Red tactical crosshair
  - **Right Side**: Kill feed, team info, featured items
- **Visual Style**: Clean, readable, tactical

## Implementation Plan

### HUD Layout
```
┌─────────────────────────────────────────────────────────┐
│ Health (100/100)        Compass/Radar        Ammo (30/120)│
│                                                           │
│                                                           │
│                    [3D GAME VIEW]                        │
│                                                           │
│                                                           │
│ Minimap          Equipment Slots        Kill Feed       │
│ [Mini]           [Eq1][Eq2][Eq3]       [Kills]         │
└─────────────────────────────────────────────────────────┘
```

### Key Features to Implement
1. **Enhanced HUD**: Proper positioning of all UI elements
2. **Improved Environment**: Better terrain, buildings, vehicles
3. **Weapon Model**: Visible weapon in first-person view
4. **Compass**: Directional indicator at top
5. **Equipment System**: Ability slots on right side
6. **Kill Feed**: Real-time kill notifications
7. **Minimap**: Tactical map with enemy positions
8. **Ammo Display**: Magazine and total ammo counter

### Color Palette
- **Primary**: Dark gray/charcoal (#1a1a1a)
- **Accent**: Tactical green (#4ade80) or blue (#3b82f6)
- **Health**: Red (#ef4444)
- **Ammo**: Yellow/Gold (#fbbf24)
- **Text**: White (#ffffff)
- **Background**: Semi-transparent dark (#000000aa)

### Typography
- **Headers**: Bold, large (24-32px)
- **Body**: Regular, medium (14-16px)
- **Numbers**: Monospace, bold (16-20px)
