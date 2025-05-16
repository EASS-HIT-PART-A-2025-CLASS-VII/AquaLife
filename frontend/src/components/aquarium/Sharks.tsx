import { Shark } from './types';
import { createGradient } from './graphics';

export const createShark = (canvas: HTMLCanvasElement): Shark => {
  const type = Math.random() < 0.5 ? 'baby' : 'aquarium';
  
  const baseSize = type === 'baby' ? 40 : 60;
  const size = baseSize + Math.random() * 10;
  
  // Create zones for better distribution
  const zoneWidth = canvas.width / 2;
  const zoneHeight = canvas.height / 2;
  const zoneX = Math.floor(Math.random() * 2);
  const zoneY = Math.floor(Math.random() * 2);
  
  // Position shark within their zone with margins
  const margin = size * 2;
  const x = zoneX * zoneWidth + margin + Math.random() * (zoneWidth - margin * 2);
  const y = zoneY * zoneHeight + margin + Math.random() * (zoneHeight - margin * 2);
  
  return {
    x,
    y,
    speed: type === 'baby' ? 1.5 : 1,
    direction: Math.random() < 0.5 ? 0 : Math.PI,
    size,
    type,
    tailWag: 0,
    tailWagSpeed: 0.03 + Math.random() * 0.02,
    verticalOffset: 0,
    verticalSpeed: 0.005 + Math.random() * 0.005,
    tilt: 0,
    targetTilt: 0,
    scale: 0.8 + Math.random() * 0.4,
    state: 'idle'
  };
};

export const drawShark = (ctx: CanvasRenderingContext2D, shark: Shark, time: number) => {
  ctx.save();
  
  // Calculate vertical position with more pronounced swaying
  const verticalSway = Math.sin(shark.verticalOffset) * 4;
  const y = shark.y + verticalSway;
  
  // Determine if shark is facing right or left
  const isFacingRight = shark.direction === 0;
  
  // Set the transform origin to the shark's center
  ctx.translate(shark.x, y);
  
  // Apply tilt based on vertical movement
  ctx.rotate(shark.tilt);
  
  // If facing left, flip the context horizontally
  if (!isFacingRight) {
    ctx.scale(-1, 1);
  }
  
  if (shark.type === 'baby') {
    // Draw baby shark with enhanced details
    // Body
    ctx.beginPath();
    const babySharkGradient = createGradient(
      ctx,
      -shark.size, 0,
      shark.size, 0,
      '#E8E8E8', // Light silver
      '#D0D0D0'  // Slightly darker silver
    );
    ctx.fillStyle = babySharkGradient;
    ctx.moveTo(shark.size, 0);
    ctx.bezierCurveTo(
      shark.size * 0.8, -shark.size * 0.2,
      shark.size * 0.2, -shark.size * 0.3,
      0, 0
    );
    ctx.bezierCurveTo(
      shark.size * 0.2, shark.size * 0.3,
      shark.size * 0.8, shark.size * 0.2,
      shark.size, 0
    );
    ctx.fill();

    // Add subtle pattern
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 1;
    ctx.moveTo(shark.size * 0.2, -shark.size * 0.1);
    ctx.lineTo(shark.size * 0.8, -shark.size * 0.1);
    ctx.stroke();

    // Dorsal fin with more detail
    ctx.beginPath();
    ctx.fillStyle = '#D0D0D0';
    ctx.moveTo(shark.size * 0.4, -shark.size * 0.2);
    ctx.bezierCurveTo(
      shark.size * 0.5, -shark.size * 0.4,
      shark.size * 0.6, -shark.size * 0.5,
      shark.size * 0.7, -shark.size * 0.3
    );
    ctx.fill();

    // Tail with more dynamic movement
    const tailWag = Math.sin(shark.tailWag) * 6;
    ctx.beginPath();
    ctx.moveTo(-shark.size * 0.2, 0);
    ctx.lineTo(-shark.size * 0.8 + tailWag, -shark.size * 0.4);
    ctx.lineTo(-shark.size * 0.8 + tailWag, shark.size * 0.4);
    ctx.closePath();
    ctx.fill();

    // Pectoral fins with more detail
    ctx.beginPath();
    ctx.fillStyle = '#D0D0D0';
    ctx.moveTo(shark.size * 0.3, 0);
    ctx.bezierCurveTo(
      shark.size * 0.4, shark.size * 0.2,
      shark.size * 0.5, shark.size * 0.3,
      shark.size * 0.4, shark.size * 0.1
    );
    ctx.fill();
  } else {
    // Draw aquarium shark with enhanced details
    // Body with more pronounced shape
    ctx.beginPath();
    const sharkGradient = createGradient(
      ctx,
      -shark.size, 0,
      shark.size, 0,
      '#2C3E50', // Dark blue-gray
      '#34495E'  // Lighter blue-gray
    );
    ctx.fillStyle = sharkGradient;
    ctx.moveTo(shark.size, 0);
    ctx.bezierCurveTo(
      shark.size * 0.8, -shark.size * 0.3,
      shark.size * 0.2, -shark.size * 0.4,
      0, 0
    );
    ctx.bezierCurveTo(
      shark.size * 0.2, shark.size * 0.4,
      shark.size * 0.8, shark.size * 0.3,
      shark.size, 0
    );
    ctx.fill();

    // Add subtle pattern
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(44, 62, 80, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.moveTo(shark.size * 0.2, -shark.size * 0.15);
    ctx.lineTo(shark.size * 0.8, -shark.size * 0.15);
    ctx.stroke();

    // Dorsal fin with more detail
    ctx.beginPath();
    ctx.fillStyle = '#2C3E50';
    ctx.moveTo(shark.size * 0.4, -shark.size * 0.2);
    ctx.bezierCurveTo(
      shark.size * 0.5, -shark.size * 0.5,
      shark.size * 0.6, -shark.size * 0.6,
      shark.size * 0.7, -shark.size * 0.4
    );
    ctx.fill();

    // Tail with more dynamic movement
    const tailWag = Math.sin(shark.tailWag) * 8;
    ctx.beginPath();
    ctx.moveTo(-shark.size * 0.2, 0);
    ctx.lineTo(-shark.size * 0.9 + tailWag, -shark.size * 0.5);
    ctx.lineTo(-shark.size * 0.9 + tailWag, shark.size * 0.5);
    ctx.closePath();
    ctx.fill();

    // Pectoral fins with more detail
    ctx.beginPath();
    ctx.fillStyle = '#2C3E50';
    ctx.moveTo(shark.size * 0.3, 0);
    ctx.bezierCurveTo(
      shark.size * 0.4, shark.size * 0.3,
      shark.size * 0.5, shark.size * 0.4,
      shark.size * 0.4, shark.size * 0.2
    );
    ctx.fill();
  }

  // Enhanced eye details
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.arc(shark.size * 0.7, -shark.size * 0.1, shark.size * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.arc(shark.size * 0.7, -shark.size * 0.1, shark.size * 0.04, 0, Math.PI * 2);
  ctx.fill();

  // Enhanced shine effect
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.ellipse(shark.size * 0.3, -shark.size * 0.15, shark.size * 0.1, shark.size * 0.05, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

const calculateTargetTilt = (state: Shark['state'], direction: number, baseTilt: number): number => {
  if (state === 'turning') {
    return baseTilt + (direction === 0 ? -0.3 : 0.3);
  }
  return baseTilt;
};

export const updateShark = (shark: Shark, canvas: HTMLCanvasElement, time: number) => {
  // Initialize direction if not set
  shark.direction ??= Math.random() < 0.5 ? 0 : Math.PI;

  // Add more pronounced vertical swaying for sharks
  const verticalOffset = Math.sin(time * 0.001 + shark.verticalOffset) * 2.5;
  
  // Calculate distance to walls
  const margin = shark.size * 2;
  const distanceToLeftWall = shark.x - margin;
  const distanceToRightWall = canvas.width - shark.x - margin;
  
  if (distanceToLeftWall < 100 && shark.direction === Math.PI) {
    shark.direction = 0;
    shark.state = 'turning';
  } else if (distanceToRightWall < 100 && shark.direction === 0) {
    shark.direction = Math.PI;
    shark.state = 'turning';
  } else {
    shark.state = 'swimming';
  }
  
  const speedMultiplier = shark.state === 'turning' ? 0.5 : 1;
  shark.x += Math.cos(shark.direction) * shark.speed * speedMultiplier;
  shark.y += verticalOffset * 0.08;

  // Update tail and vertical movement
  shark.tailWag += shark.tailWagSpeed * (1.2 + Math.sin(time * 0.001) * 0.3);
  shark.verticalOffset += shark.verticalSpeed * (1.2 + Math.sin(time * 0.002) * 0.3);

  // Calculate and update tilt
  const verticalVelocity = Math.sin(time * 0.001 + shark.verticalOffset) * 2.5 * 0.08;
  const baseTilt = Math.atan2(verticalVelocity, shark.speed) * 0.5;
  shark.targetTilt = calculateTargetTilt(shark.state, shark.direction, baseTilt);

  shark.tilt += (shark.targetTilt - shark.tilt) * 0.08;

  // Keep shark within bounds
  if (shark.y < shark.size) {
    shark.y = shark.size;
    shark.targetTilt = Math.min(shark.targetTilt, 0.2);
  } else if (shark.y > canvas.height - shark.size) {
    shark.y = canvas.height - shark.size;
    shark.targetTilt = Math.max(shark.targetTilt, -0.2);
  }

  return shark;
}; 