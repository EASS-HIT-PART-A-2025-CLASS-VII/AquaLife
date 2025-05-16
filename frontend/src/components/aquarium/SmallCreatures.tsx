import { SmallCreature } from './types';

const getCreatureSize = (type: SmallCreature['type']): number => {
  switch (type) {
    case 'shrimp': return 15;
    case 'crab': return 20;
    case 'starfish': return 25;
    case 'urchin': return 18;
    default: return 15;
  }
};

const getCreatureSpeed = (type: SmallCreature['type']): number => {
  switch (type) {
    case 'shrimp': return 0.5;
    case 'crab': return 0.3;
    case 'starfish': return 0.2;
    case 'urchin': return 0;
    default: return 0;
  }
};

export const createSmallCreature = (canvas: HTMLCanvasElement): SmallCreature => {
  const types: SmallCreature['type'][] = ['shrimp', 'crab', 'starfish', 'urchin'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const colors = {
    shrimp: '#FFB6C1',
    crab: '#FF6B6B',
    starfish: '#FFD700',
    urchin: '#4B0082'
  };
  
  return {
    x: Math.random() * canvas.width,
    y: canvas.height - getCreatureSize(type) - Math.random() * 50,
    size: getCreatureSize(type),
    speed: getCreatureSpeed(type),
    direction: Math.random() > 0.5 ? 1 : -1,
    type,
    state: 'idle',
    legOffset: 0,
    clawOpen: 0,
    rotation: 0,
    spikes: type === 'urchin' ? Math.floor(Math.random() * 5) + 8 : 0,
    color: colors[type],
    scale: 1
  };
};

export const drawSmallCreature = (ctx: CanvasRenderingContext2D, creature: SmallCreature, timestamp: number) => {
  ctx.save();
  ctx.translate(creature.x, creature.y);
  
  if (creature.direction === -1) {
    ctx.scale(-1, 1);
  }

  switch (creature.type) {
    case 'shrimp':
      drawShrimp(ctx, creature, timestamp);
      break;
    case 'crab':
      drawCrab(ctx, creature, timestamp);
      break;
    case 'starfish':
      drawStarfish(ctx, creature, timestamp);
      break;
    case 'urchin':
      drawUrchin(ctx, creature);
      break;
  }

  ctx.restore();
};

const drawShrimp = (ctx: CanvasRenderingContext2D, creature: SmallCreature, timestamp: number) => {
  const { size, legOffset } = creature;
  
  // Body
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(size * 0.5, -size * 0.2, size, 0);
  ctx.quadraticCurveTo(size * 0.5, size * 0.2, 0, 0);
  ctx.fillStyle = '#FFB6C1';
  ctx.fill();

  // Legs
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI / 3) + legOffset;
    ctx.beginPath();
    ctx.moveTo(size * 0.3, 0);
    ctx.lineTo(
      size * 0.3 + Math.cos(angle) * size * 0.4,
      Math.sin(angle) * size * 0.4
    );
    ctx.strokeStyle = '#FFB6C1';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Antennae
  ctx.beginPath();
  ctx.moveTo(size * 0.2, -size * 0.1);
  ctx.quadraticCurveTo(size * 0.4, -size * 0.3, size * 0.6, -size * 0.2);
  ctx.strokeStyle = '#FFB6C1';
  ctx.lineWidth = 1;
  ctx.stroke();
};

const drawCrab = (ctx: CanvasRenderingContext2D, creature: SmallCreature, timestamp: number) => {
  const { size, clawOpen } = creature;
  
  // Body
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = '#FF6B6B';
  ctx.fill();

  // Claws
  const clawSize = size * 0.3;
  ctx.save();
  ctx.translate(size * 0.4, 0);
  ctx.rotate(clawOpen || 0);
  ctx.beginPath();
  ctx.arc(0, 0, clawSize, 0, Math.PI);
  ctx.strokeStyle = '#FF6B6B';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // Legs
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI / 4) + creature.legOffset;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(
      Math.cos(angle) * size * 0.6,
      Math.sin(angle) * size * 0.6
    );
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};

const drawStarfish = (ctx: CanvasRenderingContext2D, creature: SmallCreature, timestamp: number) => {
  const { size, rotation } = creature;
  
  ctx.rotate(rotation || 0);
  
  // Star shape
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const x = Math.cos(angle) * size;
    const y = Math.sin(angle) * size;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.strokeStyle = '#DAA520';
  ctx.lineWidth = 2;
  ctx.stroke();
};

const drawUrchin = (ctx: CanvasRenderingContext2D, creature: SmallCreature) => {
  const { size, spikes } = creature;
  
  // Body
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#4B0082';
  ctx.fill();

  // Spikes
  for (let i = 0; i < spikes; i++) {
    const angle = (i * Math.PI * 2) / spikes;
    const length = size * 0.6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(
      Math.cos(angle) * length,
      Math.sin(angle) * length
    );
    ctx.strokeStyle = '#4B0082';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};

export const updateSmallCreature = (creature: SmallCreature, canvas: HTMLCanvasElement, timestamp: number) => {
  if (creature.type === 'urchin') return; // Urchins don't move

  // Update leg/claw animations
  creature.legOffset = Math.sin(timestamp * 0.005) * 0.5;
  if (creature.type === 'crab') {
    creature.clawOpen = Math.sin(timestamp * 0.003) * 0.3;
  }
  if (creature.type === 'starfish') {
    creature.rotation = Math.sin(timestamp * 0.002) * 0.2;
  }

  // Movement logic
  if (creature.state === 'moving') {
    creature.x += creature.speed * creature.direction;
    
    // Boundary checking
    if (creature.x < creature.size || creature.x > canvas.width - creature.size) {
      creature.direction *= -1;
      creature.state = 'idle';
    }
  } else if (Math.random() < 0.01) {
    creature.state = 'moving';
  }

  // Random state changes
  if (Math.random() < 0.005) {
    creature.state = creature.state === 'idle' ? 'moving' : 'idle';
  }
}; 