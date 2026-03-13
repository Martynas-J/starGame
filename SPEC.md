# Cosmic Clicker - Game Specification

## Theme
A cosmic/space themed clicker game where players click on celestial entities to collect cosmic energy and unlock new realms.

## Core Features
1. **Main Clickable Element**: A cosmic orb that evolves as you progress
2. **Energy Currency**: Collect "Cosmic Energy" by clicking
3. **Upgrades System**: Purchase upgrades to increase click power and passive income
4. **Realms Progression**: Unlock new cosmic realms as you progress
5. **Particle Effects**: Visual feedback on click
6. **Auto-save**: Game state saved to localStorage

## Game Mechanics
- Base click value: 1 energy
- Click value increases with upgrades
- Passive income (energy per second) from upgrades
- Each realm unlock adds multiplier bonuses

## Visual Style
- Dark cosmic theme with neon accents
- Animated background with stars
- Glowing effects on interactive elements
- Smooth transitions and hover effects

## Components
1. **Header**: Shows current energy and stats
2. **Main Click Area**: Large clickable cosmic orb with evolution stages
3. **Upgrades Panel**: List of purchasable upgrades
4. **Realms Panel**: Shows unlocked/progress realms

## Upgrade Types
1. **Click Power**: Increases energy per click
2. **Cosmic Rift**: Passive energy per second
3. **Energy Multiplier**: Multiplies all gains
4. **Lucky Stars**: Chance for bonus energy

## Realm Progression
1. **Starter Realm** (0-1000 energy): Basic cosmic orb
2. **Nebula Realm** (1000-10000): Nebula cloud orb - 2x multiplier
3. **Supernova Realm** (10000-100000): Supernova orb - 5x multiplier
4. **Black Hole Realm** (100000+): Black hole orb - 10x multiplier
