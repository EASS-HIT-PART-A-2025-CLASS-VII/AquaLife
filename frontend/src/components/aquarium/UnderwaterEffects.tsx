import { createGradient } from './graphics';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

interface LightBeam {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  angle: number;
}

export const createParticle = (canvas: HTMLCanvasElement): Particle => ({
  x: Math.random() * canvas.width,
  y: -10,
  size: Math.random() * 3 + 1,
  speed: Math.random() * 2 + 1,
  opacity: Math.random() * 0.5 + 0.2,
  color: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`
});

export const createLightBeam = (canvas: HTMLCanvasElement): LightBeam => ({
  x: Math.random() * canvas.width,
  y: -100,
  width: Math.random() * 100 + 50,
  height: Math.random() * 200 + 100,
  opacity: Math.random() * 0.1 + 0.05,
  angle: Math.random() * 0.2 - 0.1
});

export const drawUnderwaterEffects = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  particles: Particle[],
  lightBeams: LightBeam[],
  time: number
) => {
  // Draw light beams
  lightBeams.forEach(beam => {
    ctx.save();
    ctx.translate(beam.x, beam.y);
    ctx.rotate(beam.angle);
    
    const gradient = createGradient(
      ctx,
      0, 0,
      0, beam.height,
      `rgba(255, 255, 255, ${beam.opacity})`,
      'rgba(255, 255, 255, 0)'
    );
    
    ctx.fillStyle = gradient;
    ctx.fillRect(-beam.width / 2, 0, beam.width, beam.height);
    ctx.restore();
  });

  // Draw particles
  particles.forEach(particle => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw water surface effect
  const surfaceGradient = createGradient(
    ctx,
    0, 0,
    0, 100,
    'rgba(255, 255, 255, 0.1)',
    'rgba(255, 255, 255, 0)'
  );
  
  ctx.fillStyle = surfaceGradient;
  ctx.fillRect(0, 0, canvas.width, 100);

  // Draw caustic patterns
  const patternCanvas = createCausticPattern(ctx, time);
  if (patternCanvas) {
    const causticPattern = ctx.createPattern(patternCanvas, 'repeat');
    if (causticPattern) {
      ctx.fillStyle = causticPattern;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }
  }
};

const createCausticPattern = (ctx: CanvasRenderingContext2D, time: number) => {
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 200;
  patternCanvas.height = 200;
  const patternCtx = patternCanvas.getContext('2d');
  
  if (!patternCtx) return null;

  // Draw caustic pattern
  patternCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < 5; i++) {
    const x = Math.sin(time * 0.001 + i) * 50 + 100;
    const y = Math.cos(time * 0.001 + i) * 50 + 100;
    patternCtx.beginPath();
    patternCtx.arc(x, y, 20 + Math.sin(time * 0.002 + i) * 10, 0, Math.PI * 2);
    patternCtx.fill();
  }

  return patternCanvas;
};

export const updateUnderwaterEffects = (
  particles: Particle[],
  lightBeams: LightBeam[],
  canvas: HTMLCanvasElement,
  time: number
) => {
  // Update particles
  particles.forEach(particle => {
    particle.y += particle.speed;
    if (particle.y > canvas.height) {
      particle.y = -10;
      particle.x = Math.random() * canvas.width;
    }
  });

  // Update light beams
  lightBeams.forEach(beam => {
    beam.y += 0.5;
    beam.opacity = Math.sin(time * 0.001 + beam.x) * 0.05 + 0.05;
    if (beam.y > canvas.height) {
      beam.y = -100;
      beam.x = Math.random() * canvas.width;
    }
  });
}; 