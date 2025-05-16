export interface Caustic {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  angle: number;
}

export const createCaustic = (canvas: HTMLCanvasElement): Caustic => {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 100 + 50,
    speed: Math.random() * 0.5 + 0.2,
    opacity: Math.random() * 0.05 + 0.02,
    angle: Math.random() * Math.PI * 2
  };
};

export const drawGlassEffects = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  caustics: Caustic[],
  time: number
) => {
  // Draw glass border
  ctx.save();
  const borderGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  borderGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  borderGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
  borderGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
  
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  // Draw caustics
  caustics.forEach(caustic => {
    ctx.save();
    ctx.translate(caustic.x, caustic.y);
    ctx.rotate(caustic.angle);
    
    const gradient = ctx.createLinearGradient(-caustic.size, 0, caustic.size, 0);
    gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${caustic.opacity})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, caustic.size, caustic.size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Draw glass reflection at the top
  ctx.save();
  const reflectionGradient = ctx.createLinearGradient(0, 0, 0, 100);
  reflectionGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  reflectionGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = reflectionGradient;
  ctx.fillRect(0, 0, canvas.width, 100);
  ctx.restore();

  // Draw subtle glass highlights
  ctx.save();
  const highlightGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = highlightGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
};

export const updateCaustics = (caustics: Caustic[], canvas: HTMLCanvasElement, time: number) => {
  caustics.forEach(caustic => {
    // Move caustics
    caustic.y += caustic.speed;
    caustic.x += Math.sin(time * 0.001 + caustic.angle) * 0.5;
    
    // Rotate caustics slowly
    caustic.angle += 0.001;
    
    // Reset caustics that go off screen
    if (caustic.y > canvas.height + caustic.size) {
      caustic.y = -caustic.size;
      caustic.x = Math.random() * canvas.width;
    }
  });
  
  return caustics;
}; 