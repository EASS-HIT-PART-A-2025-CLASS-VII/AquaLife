export const shadeColor = (color: string, percent: number) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(String(R * (100 + percent) / 100));
  G = parseInt(String(G * (100 + percent) / 100));
  B = parseInt(String(B * (100 + percent) / 100));

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
};

export const createGradient = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color1: string, color2: string) => {
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
};

export const createRadialGradient = (ctx: CanvasRenderingContext2D, x: number, y: number, r1: number, r2: number, color1: string, color2: string) => {
  const gradient = ctx.createRadialGradient(x, y, r1, x, y, r2);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
};

export const getRandomColor = (hue: number, range: number = 60) => {
  return `hsl(${hue + Math.random() * range}, 80%, 60%)`;
};

export const getRandomPosition = (canvas: HTMLCanvasElement) => {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
  };
};

export const handleWallCollision = (creature: { x: number; y: number; direction: number }, canvas: HTMLCanvasElement) => {
  if (creature.x < 0) {
    creature.x = 0;
    creature.direction = Math.PI - creature.direction + (Math.random() - 0.5) * 0.3;
  } else if (creature.x > canvas.width) {
    creature.x = canvas.width;
    creature.direction = Math.PI - creature.direction + (Math.random() - 0.5) * 0.3;
  }
  if (creature.y < 0) {
    creature.y = 0;
    creature.direction = -creature.direction + (Math.random() - 0.5) * 0.3;
  } else if (creature.y > canvas.height - 150) {
    creature.y = canvas.height - 150;
    creature.direction = -creature.direction + (Math.random() - 0.5) * 0.3;
  }
}; 