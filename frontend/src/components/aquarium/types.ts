import { Bubble } from './Bubbles';
import { Caustic } from './GlassEffects';

export interface Position {
  x: number;
  y: number;
}

export interface BaseCreature {
  x: number;
  y: number;
  speed: number;
  direction: number;
  size: number;
  color: string;
  type: string;
  scale: number;
}

export interface Fish extends BaseCreature {
  type: 'tropical' | 'angelfish' | 'regular' | 'cleaner' | 'guppy' | 'tetra' | 'nemo';
  tailWag: number;
  tailWagSpeed: number;
  verticalOffset: number;
  verticalSpeed: number;
  state: 'idle' | 'swimming' | 'turning';
  tilt: number;
  targetTilt: number;
  targetX?: number;
  targetY?: number;
}

export interface PistolShrimp extends BaseCreature {
  type: 'pistol';
  antennaOffset: number;
  clawOpen: number;
}

export interface Crab extends BaseCreature {
  type: 'crab';
  state: 'idle' | 'walking';
  targetX?: number;
  targetY?: number;
  legOffset: number;
  clawOpen: number;
}

export interface Plant {
  x: number;
  y: number;
  height: number;
  type: 'fern' | 'grass' | 'carpet' | 'lily' | 'reed' | 'bush';
  color: string;
  swayOffset: number;
  scale: number;
}

interface LightRay {
  x: number;
  y: number;
  width: number;
  speed: number;
  opacity: number;
}

export interface Shark {
  x: number;
  y: number;
  speed: number;
  direction: number;
  size: number;
  type: 'baby' | 'aquarium';
  tailWag: number;
  tailWagSpeed: number;
  verticalOffset: number;
  verticalSpeed: number;
  tilt: number;
  targetTilt: number;
  scale: number;
  state: 'idle' | 'swimming' | 'turning';
}

export interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

export interface LightBeam {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  angle: number;
}

export interface SmallCreature extends BaseCreature {
  type: 'shrimp' | 'crab' | 'starfish' | 'urchin';
  state: 'idle' | 'moving' | 'hiding';
  targetX?: number;
  targetY?: number;
  legOffset: number;
  clawOpen: number;
  rotation: number;
  spikes: number;
  color: string;
  scale: number;
}

export interface FoodParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  type: 'flakes' | 'pellets' | 'live';
  targetFish?: Fish | null;
  eaten: boolean;
}

export interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

export interface SeaFloorElement {
  type: 'sand' | 'rock' | 'shell' | 'treasure';
  x: number;
  y: number;
  size: number;
  speed: number;
  offset: number;
  sparkle: boolean;
}

export interface AquariumState {
  fish: Fish[];
  sharks: Shark[];
  lastTime: number;
  bubbles: Bubble[];
  lightRays: LightRay[];
  caustics: Caustic[];
  particles: Particle[];
  lightBeams: LightBeam[];
  smallCreatures: SmallCreature[];
  foodParticles: FoodParticle[];
  ripples: Ripple[];
  temperature: number;
  isDaytime: boolean;
  dayNightCycle: number;
} 