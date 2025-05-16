export interface Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  wobble: number;
  wobbleSpeed: number;
  wobbleOffset: number;
}

export const createBubble = (canvas: HTMLCanvasElement): Bubble => {
  const size = Math.random() * 4 + 2; // Random size between 2-6
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + size,
    size,
    speed: Math.random() * 1 + 0.5, // Random speed between 0.5-1.5
    wobble: 0,
    wobbleSpeed: Math.random() * 0.02 + 0.01,
    wobbleOffset: Math.random() * Math.PI * 2
  };
};

export const drawBubble = (ctx: CanvasRenderingContext2D, bubble: Bubble) => {
  ctx.save();
  
  // Draw bubble with gradient for shine effect
  const gradient = ctx.createRadialGradient(
    bubble.x - bubble.size * 0.3,
    bubble.y - bubble.size * 0.3,
    bubble.size * 0.1,
    bubble.x,
    bubble.y,
    bubble.size
  );
  
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  
  ctx.beginPath();
  ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Add shine effect
  ctx.beginPath();
  ctx.arc(
    bubble.x - bubble.size * 0.3,
    bubble.y - bubble.size * 0.3,
    bubble.size * 0.2,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fill();
  
  ctx.restore();
};

export const updateBubble = (bubble: Bubble, canvas: HTMLCanvasElement, time: number) => {
  // Move bubble upward
  bubble.y -= bubble.speed;
  
  // Add wobble effect
  bubble.wobble = Math.sin(time * bubble.wobbleSpeed + bubble.wobbleOffset) * 2;
  bubble.x += bubble.wobble * 0.1;
  
  // Reset bubble if it goes off screen
  if (bubble.y < -bubble.size) {
    bubble.y = canvas.height + bubble.size;
    bubble.x = Math.random() * canvas.width;
  }
  
  return bubble;
}; 