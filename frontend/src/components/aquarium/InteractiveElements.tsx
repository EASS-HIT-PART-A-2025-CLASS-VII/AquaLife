import { FoodParticle, Ripple, Fish } from './types';

const getFoodParticleSize = (type: FoodParticle['type']): number => {
  switch (type) {
    case 'flakes': return 3;
    case 'pellets': return 5;
    case 'live': return 4;
    default: return 3;
  }
};

export const createFoodParticle = (canvas: HTMLCanvasElement, x: number, y: number): FoodParticle => {
  const types: FoodParticle['type'][] = ['flakes', 'pellets', 'live'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  return {
    x,
    y,
    size: getFoodParticleSize(type),
    speed: type === 'live' ? 0.8 : 0.3,
    type,
    targetFish: null,
    eaten: false
  };
};

export const createRipple = (x: number, y: number): Ripple => {
  return {
    x,
    y,
    radius: 0,
    maxRadius: 80,
    opacity: 0.7,
    speed: 3
  };
};

export const drawFoodParticle = (ctx: CanvasRenderingContext2D, food: FoodParticle) => {
  if (food.eaten) return;

  ctx.save();
  ctx.translate(food.x, food.y);

  switch (food.type) {
    case 'flakes':
      drawFlake(ctx, food.size);
      break;
    case 'pellets':
      drawPellet(ctx, food.size);
      break;
    case 'live':
      drawLiveFood(ctx, food.size);
      break;
  }

  ctx.restore();
};

const drawFlake = (ctx: CanvasRenderingContext2D, size: number) => {
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fill();
};

const drawPellet = (ctx: CanvasRenderingContext2D, size: number) => {
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fillStyle = '#8B4513';
  ctx.fill();
};

const drawLiveFood = (ctx: CanvasRenderingContext2D, size: number) => {
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(size, 0, 0, size);
  ctx.quadraticCurveTo(-size, 0, 0, -size);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
};

export const drawRipple = (ctx: CanvasRenderingContext2D, ripple: Ripple) => {
  ctx.beginPath();
  ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity})`;
  ctx.lineWidth = 3;
  ctx.stroke();
};

export const updateFoodParticle = (food: FoodParticle, canvas: HTMLCanvasElement, fish: Fish[]) => {
  if (food.eaten) return;

  // Sink food particles
  food.y += food.speed;

  // Remove if out of bounds
  if (food.y > canvas.height) {
    food.eaten = true;
    return;
  }

  // Find nearest fish if not already targeted
  if (!food.targetFish) {
    let nearestFish: Fish | null = null;
    let minDistance = Infinity;

    fish.forEach(f => {
      const dx = f.x - food.x;
      const dy = f.y - food.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < minDistance) {
        minDistance = distance;
        nearestFish = f;
      }
    });

    if (minDistance < 100) {
      food.targetFish = nearestFish;
    }
  }

  // Move towards target fish if exists
  if (food.targetFish) {
    const dx = food.targetFish.x - food.x;
    const dy = food.targetFish.y - food.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 10) {
      food.eaten = true;
      return;
    }

    food.x += (dx / distance) * food.speed;
    food.y += (dy / distance) * food.speed;
  }
};

export const updateRipple = (ripple: Ripple) => {
  ripple.radius += ripple.speed;
  ripple.opacity -= 0.015;

  return ripple.opacity > 0;
}; 