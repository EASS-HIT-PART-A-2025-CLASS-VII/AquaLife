import { Fish } from './types';
import { createGradient } from './graphics';

// Helper functions to determine fish properties
export const getFishSize = (type: Fish['type']): number => {
  switch (type) {
    case 'tropical': return 30;
    case 'angelfish': return 35;
    case 'regular': return 25;
    case 'cleaner': return 20;
    case 'guppy': return 15;
    case 'tetra': return 18;
    case 'nemo': return 32;
    default: return 25;
  }
};

export const getFishSpeed = (type: Fish['type']): number => {
  switch (type) {
    case 'tropical': return 1.2;
    case 'angelfish': return 0.8;
    case 'regular': return 1;
    case 'cleaner': return 1.5;
    case 'guppy': return 1.3;
    case 'tetra': return 1.4;
    case 'nemo': return 1.1;
    default: return 1;
  }
};

const getFishColor = (type: Fish['type']): string => {
  switch (type) {
    case 'tropical': return '#FF6B6B';
    case 'angelfish': return '#4ECDC4';
    case 'regular': return '#45B7D1';
    case 'cleaner': return '#96CEB4';
    case 'guppy': return '#FFEEAD';
    case 'tetra': return '#D4A5A5';
    case 'nemo': return '#FF4500';
    default: return '#45B7D1';
  }
};

const getFishTailWagSpeed = (type: Fish['type']): number => {
  switch (type) {
    case 'tropical': return 0.1;
    case 'angelfish': return 0.05;
    case 'regular': return 0.08;
    case 'cleaner': return 0.12;
    case 'guppy': return 0.15;
    case 'tetra': return 0.13;
    case 'nemo': return 0.09;
    default: return 0.08;
  }
};

const getFishVerticalSpeed = (type: Fish['type']): number => {
  switch (type) {
    case 'tropical': return 0.3;
    case 'angelfish': return 0.2;
    case 'regular': return 0.25;
    case 'cleaner': return 0.35;
    case 'guppy': return 0.4;
    case 'tetra': return 0.38;
    case 'nemo': return 0.28;
    default: return 0.25;
  }
};

export const createFish = (canvas: HTMLCanvasElement, specifiedType?: Fish['type']): Fish => {
  const types: Fish['type'][] = ['tropical', 'angelfish', 'regular', 'cleaner', 'guppy', 'tetra', 'nemo'];
  const type = specifiedType ?? types[Math.floor(Math.random() * types.length)];
  
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * (canvas.height * 0.7),
    size: getFishSize(type),
    speed: getFishSpeed(type),
    direction: Math.random() < 0.5 ? 0 : Math.PI,
    type,
    tailWag: 0,
    tailWagSpeed: getFishTailWagSpeed(type),
    verticalOffset: 0,
    verticalSpeed: getFishVerticalSpeed(type),
    state: 'swimming',
    tilt: 0,
    targetTilt: 0,
    color: getFishColor(type),
    scale: type === 'nemo' ? 1.2 : 1
  };
};

export const drawFish = (ctx: CanvasRenderingContext2D, fish: Fish, time: number) => {
  ctx.save();
  
  // Calculate vertical position with swaying
  const verticalSway = Math.sin(fish.verticalOffset) * 5;
  const y = fish.y + verticalSway;
  
  // Determine if fish is facing right or left
  const isFacingRight = fish.direction === 0;
  
  // Set the transform origin to the fish's center
  ctx.translate(fish.x, y);
  
  // Apply tilt based on vertical movement
  ctx.rotate(fish.tilt);
  
  // If facing left, flip the context horizontally
  if (!isFacingRight) {
    ctx.scale(-1, 1);
  }
  
  if (fish.type === 'nemo') {
    // Draw Nemo fish with enhanced details
    // Body
    ctx.beginPath();
    const nemoGradient = createGradient(
      ctx,
      -fish.size, 0,
      fish.size, 0,
      '#FF4500', // Bright orange
      '#FF6347'  // Tomato
    );
    ctx.fillStyle = nemoGradient;
    ctx.moveTo(fish.size, 0);
    ctx.bezierCurveTo(
      fish.size * 0.8, -fish.size * 0.3,
      fish.size * 0.2, -fish.size * 0.4,
      0, 0
    );
    ctx.bezierCurveTo(
      fish.size * 0.2, fish.size * 0.4,
      fish.size * 0.8, fish.size * 0.3,
      fish.size, 0
    );
    ctx.fill();

    // White stripes with rounded edges
    for (let i = 0; i < 3; i++) {
      const x = fish.size * 0.2 + i * fish.size * 0.2;
      ctx.beginPath();
      ctx.fillStyle = 'white';
      // Create rounded stripe using bezier curves
      ctx.moveTo(x, -fish.size * 0.3);
      ctx.bezierCurveTo(
        x + fish.size * 0.05, -fish.size * 0.3,
        x + fish.size * 0.05, -fish.size * 0.25,
        x + fish.size * 0.1, -fish.size * 0.25
      );
      ctx.lineTo(x + fish.size * 0.1, fish.size * 0.25);
      ctx.bezierCurveTo(
        x + fish.size * 0.05, fish.size * 0.25,
        x + fish.size * 0.05, fish.size * 0.3,
        x, fish.size * 0.3
      );
      ctx.closePath();
      ctx.fill();
    }

    // Dorsal fin with more detail
    ctx.beginPath();
    ctx.fillStyle = '#FF4500';
    ctx.moveTo(fish.size * 0.4, -fish.size * 0.2);
    ctx.bezierCurveTo(
      fish.size * 0.5, -fish.size * 0.5,
      fish.size * 0.6, -fish.size * 0.6,
      fish.size * 0.7, -fish.size * 0.4
    );
    ctx.fill();

    // Tail with more dynamic movement
    const tailWag = Math.sin(fish.tailWag) * 8;
    ctx.beginPath();
    ctx.moveTo(-fish.size * 0.2, 0);
    ctx.lineTo(-fish.size * 0.9 + tailWag, -fish.size * 0.5);
    ctx.lineTo(-fish.size * 0.9 + tailWag, fish.size * 0.5);
    ctx.closePath();
    ctx.fill();

    // Pectoral fins with more detail
    ctx.beginPath();
    ctx.fillStyle = '#FF4500';
    ctx.moveTo(fish.size * 0.3, 0);
    ctx.bezierCurveTo(
      fish.size * 0.4, fish.size * 0.3,
      fish.size * 0.5, fish.size * 0.4,
      fish.size * 0.4, fish.size * 0.2
    );
    ctx.fill();

    // Enhanced eye details
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(fish.size * 0.7, -fish.size * 0.1, fish.size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(fish.size * 0.7, -fish.size * 0.1, fish.size * 0.04, 0, Math.PI * 2);
    ctx.fill();

    // Enhanced shine effect
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.ellipse(fish.size * 0.3, -fish.size * 0.15, fish.size * 0.1, fish.size * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (fish.type === 'cleaner') {
    // Draw cleaner fish
    // Body
    ctx.beginPath();
    ctx.fillStyle = fish.color;
    ctx.moveTo(fish.size, 0);
    ctx.bezierCurveTo(
      fish.size * 0.8, -fish.size * 0.2,
      fish.size * 0.2, -fish.size * 0.3,
      0, 0
    );
    ctx.bezierCurveTo(
      fish.size * 0.2, fish.size * 0.3,
      fish.size * 0.8, fish.size * 0.2,
      fish.size, 0
    );
    ctx.fill();

    // Stripes
    for (let i = 0; i < 3; i++) {
      const x = fish.size * 0.2 + i * fish.size * 0.2;
      ctx.beginPath();
      ctx.moveTo(x, -fish.size * 0.2);
      ctx.lineTo(x, fish.size * 0.2);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Tail
    ctx.beginPath();
    ctx.moveTo(-fish.size * 0.2, 0);
    ctx.lineTo(-fish.size * 0.6 + Math.sin(fish.tailWag) * 3, -fish.size * 0.3);
    ctx.lineTo(-fish.size * 0.6 + Math.sin(fish.tailWag) * 3, fish.size * 0.3);
    ctx.closePath();
    ctx.fill();
  } else if (fish.type === 'guppy') {
    // Draw guppy
    // Body
    ctx.beginPath();
    ctx.fillStyle = fish.color;
    ctx.moveTo(fish.size, 0);
    ctx.bezierCurveTo(
      fish.size * 0.8, -fish.size * 0.15,
      fish.size * 0.2, -fish.size * 0.2,
      0, 0
    );
    ctx.bezierCurveTo(
      fish.size * 0.2, fish.size * 0.2,
      fish.size * 0.8, fish.size * 0.15,
      fish.size, 0
    );
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-fish.size * 0.2, 0);
    ctx.lineTo(-fish.size * 0.8 + Math.sin(fish.tailWag) * 4, -fish.size * 0.3);
    ctx.lineTo(-fish.size * 0.8 + Math.sin(fish.tailWag) * 4, fish.size * 0.3);
    ctx.closePath();
    ctx.fill();
  } else if (fish.type === 'tetra') {
    // Draw tetra
    // Body
    ctx.beginPath();
    ctx.fillStyle = fish.color;
    ctx.moveTo(fish.size, 0);
    ctx.bezierCurveTo(
      fish.size * 0.8, -fish.size * 0.25,
      fish.size * 0.2, -fish.size * 0.3,
      0, 0
    );
    ctx.bezierCurveTo(
      fish.size * 0.2, fish.size * 0.3,
      fish.size * 0.8, fish.size * 0.25,
      fish.size, 0
    );
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-fish.size * 0.2, 0);
    ctx.lineTo(-fish.size * 0.7 + Math.sin(fish.tailWag) * 3, -fish.size * 0.35);
    ctx.lineTo(-fish.size * 0.7 + Math.sin(fish.tailWag) * 3, fish.size * 0.35);
    ctx.closePath();
    ctx.fill();
  } else if (fish.type === 'tropical') {
    // Draw tropical fish
    // Body
    ctx.beginPath();
    ctx.fillStyle = fish.color;
    ctx.moveTo(fish.size, 0);
    ctx.bezierCurveTo(
      fish.size * 0.8, -fish.size * 0.3,
      fish.size * 0.2, -fish.size * 0.4,
      0, 0
    );
    ctx.bezierCurveTo(
      fish.size * 0.2, fish.size * 0.4,
      fish.size * 0.8, fish.size * 0.3,
      fish.size, 0
    );
    ctx.fill();

    // Dorsal fin
    ctx.beginPath();
    ctx.fillStyle = fish.color;
    ctx.moveTo(fish.size * 0.3, -fish.size * 0.2);
    ctx.bezierCurveTo(
      fish.size * 0.4, -fish.size * 0.5,
      fish.size * 0.5, -fish.size * 0.6,
      fish.size * 0.6, -fish.size * 0.3
    );
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-fish.size * 0.2, 0);
    ctx.lineTo(-fish.size * 0.8 + Math.sin(fish.tailWag) * 5, -fish.size * 0.4);
    ctx.lineTo(-fish.size * 0.8 + Math.sin(fish.tailWag) * 5, fish.size * 0.4);
    ctx.closePath();
    ctx.fill();

    // Pectoral fins
    ctx.beginPath();
    ctx.fillStyle = fish.color;
    ctx.moveTo(fish.size * 0.3, 0);
    ctx.bezierCurveTo(
      fish.size * 0.4, fish.size * 0.2,
      fish.size * 0.5, fish.size * 0.3,
      fish.size * 0.4, fish.size * 0.1
    );
    ctx.fill();
  } else if (fish.type === 'angelfish') {
    // Draw angelfish
    // Body
    ctx.beginPath();
    ctx.fillStyle = fish.color;
    ctx.moveTo(fish.size * 0.5, -fish.size * 0.8);
    ctx.bezierCurveTo(
      fish.size * 0.8, -fish.size * 0.9,
      fish.size, -fish.size * 0.5,
      fish.size * 0.8, 0
    );
    ctx.bezierCurveTo(
      fish.size, fish.size * 0.5,
      fish.size * 0.8, fish.size * 0.9,
      fish.size * 0.5, fish.size * 0.8
    );
    ctx.bezierCurveTo(
      fish.size * 0.2, fish.size * 0.7,
      0, fish.size * 0.4,
      -fish.size * 0.2, 0
    );
    ctx.bezierCurveTo(
      0, -fish.size * 0.4,
      fish.size * 0.2, -fish.size * 0.7,
      fish.size * 0.5, -fish.size * 0.8
    );
    ctx.fill();

    // Dorsal fin
    ctx.beginPath();
    ctx.fillStyle = fish.color;
    ctx.moveTo(fish.size * 0.3, -fish.size * 0.8);
    ctx.bezierCurveTo(
      fish.size * 0.4, -fish.size * 1.2,
      fish.size * 0.5, -fish.size * 1.3,
      fish.size * 0.6, -fish.size * 0.9
    );
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-fish.size * 0.2, 0);
    ctx.lineTo(-fish.size * 0.6 + Math.sin(fish.tailWag) * 3, -fish.size * 0.3);
    ctx.lineTo(-fish.size * 0.6 + Math.sin(fish.tailWag) * 3, fish.size * 0.3);
    ctx.closePath();
    ctx.fill();
  } else {
    // Draw regular fish
    // Body
    ctx.beginPath();
    ctx.fillStyle = fish.color;
    ctx.moveTo(fish.size, 0);
    ctx.bezierCurveTo(
      fish.size * 0.8, -fish.size * 0.3,
      fish.size * 0.2, -fish.size * 0.4,
      0, 0
    );
    ctx.bezierCurveTo(
      fish.size * 0.2, fish.size * 0.4,
      fish.size * 0.8, fish.size * 0.3,
      fish.size, 0
    );
    ctx.fill();

    // Dorsal fin
    ctx.beginPath();
    ctx.fillStyle = fish.color;
    ctx.moveTo(fish.size * 0.4, -fish.size * 0.2);
    ctx.bezierCurveTo(
      fish.size * 0.5, -fish.size * 0.4,
      fish.size * 0.6, -fish.size * 0.5,
      fish.size * 0.7, -fish.size * 0.3
    );
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-fish.size * 0.2, 0);
    ctx.lineTo(-fish.size * 0.7 + Math.sin(fish.tailWag) * 5, -fish.size * 0.4);
    ctx.lineTo(-fish.size * 0.7 + Math.sin(fish.tailWag) * 5, fish.size * 0.4);
    ctx.closePath();
    ctx.fill();

    // Pectoral fins
    ctx.beginPath();
    ctx.fillStyle = fish.color;
    ctx.moveTo(fish.size * 0.3, 0);
    ctx.bezierCurveTo(
      fish.size * 0.4, fish.size * 0.2,
      fish.size * 0.5, fish.size * 0.3,
      fish.size * 0.4, fish.size * 0.1
    );
    ctx.fill();
  }

  // Common elements for all fish types
  // Eye (always on top)
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.arc(fish.size * 0.7, -fish.size * 0.1, fish.size * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.arc(fish.size * 0.7, -fish.size * 0.1, fish.size * 0.04, 0, Math.PI * 2);
  ctx.fill();

  // Shine effect (always on top)
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.ellipse(fish.size * 0.3, -fish.size * 0.15, fish.size * 0.1, fish.size * 0.05, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

export const updateFish = (fish: Fish, canvas: HTMLCanvasElement, time: number) => {
  // Initialize direction if not set using nullish coalescing
  fish.direction ??= Math.random() < 0.5 ? 0 : Math.PI;

  // Add gentle vertical swaying
  const verticalOffset = Math.sin(time * 0.001 + fish.verticalOffset) * 2.5;
  
  // Calculate distance to walls
  const margin = fish.size * 2;
  const distanceToLeftWall = fish.x - margin;
  const distanceToRightWall = canvas.width - fish.x - margin;
  
  // Check if fish is approaching walls
  if (distanceToLeftWall < 100 && fish.direction === Math.PI) {
    fish.direction = 0;
    fish.state = 'turning';
  } else if (distanceToRightWall < 100 && fish.direction === 0) {
    fish.direction = Math.PI;
    fish.state = 'turning';
  } else {
    fish.state = 'swimming';
  }
  
  const speedMultiplier = fish.state === 'turning' ? 0.5 : 1;
  fish.x += Math.cos(fish.direction) * fish.speed * speedMultiplier;
  fish.y += verticalOffset * 0.08;

  // Update tail wag and vertical movement
  fish.tailWag += fish.tailWagSpeed * (1.2 + Math.sin(time * 0.001) * 0.3);
  fish.verticalOffset += fish.verticalSpeed * (1.2 + Math.sin(time * 0.002) * 0.3);

  // Calculate and update tilt
  const verticalVelocity = Math.sin(time * 0.001 + fish.verticalOffset) * 2.5 * 0.08;
  const baseTilt = Math.atan2(verticalVelocity, fish.speed) * 0.5;
  
  // Adjust tilt based on direction and state
  if (fish.state === 'turning') {
    fish.targetTilt = fish.direction === 0 ? -0.3 : 0.3;
  } else {
    fish.targetTilt = baseTilt;
  }

  fish.tilt += (fish.targetTilt - fish.tilt) * 0.08;

  // Keep fish within bounds
  if (fish.y < fish.size) {
    fish.y = fish.size;
    fish.targetTilt = Math.min(fish.targetTilt, 0.2);
  } else if (fish.y > canvas.height - fish.size) {
    fish.y = canvas.height - fish.size;
    fish.targetTilt = Math.max(fish.targetTilt, -0.2);
  }

  return fish;
}; 