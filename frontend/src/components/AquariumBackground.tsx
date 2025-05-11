import React, { useEffect, useRef } from 'react';

interface Fish {
  x: number;
  y: number;
  speed: number;
  direction: number;
  size: number;
  color: string;
}

export const AquariumBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fishesRef = useRef<Fish[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    console.log('AquariumBackground mounted');
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log('Canvas resized:', canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create initial fish
    const createFish = (): Fish => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 2 + Math.random() * 3,
      direction: Math.random() * Math.PI * 2,
      size: 30 + Math.random() * 40,
      color: `hsl(${Math.random() * 60 + 180}, 80%, 60%)`,
    });

    // Initialize fish
    fishesRef.current = Array.from({ length: 15 }, createFish);
    console.log('Fish created:', fishesRef.current.length);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#60a5fa'); // Surface water
      gradient.addColorStop(0.5, '#3b82f6'); // Middle water
      gradient.addColorStop(1, '#1e3a8a'); // Deep water
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some bubbles
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = (canvas.height + Math.random() * 100) % canvas.height;
        const size = 2 + Math.random() * 4;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      }

      // Update and draw fish
      fishesRef.current.forEach((fish) => {
        // Update position
        fish.x += Math.cos(fish.direction) * fish.speed;
        fish.y += Math.sin(fish.direction) * fish.speed;

        // Bounce off walls with smoother transitions
        if (fish.x < 0) {
          fish.x = 0;
          fish.direction = Math.PI - fish.direction + (Math.random() - 0.5) * 0.5;
        } else if (fish.x > canvas.width) {
          fish.x = canvas.width;
          fish.direction = Math.PI - fish.direction + (Math.random() - 0.5) * 0.5;
        }
        if (fish.y < 0) {
          fish.y = 0;
          fish.direction = -fish.direction + (Math.random() - 0.5) * 0.5;
        } else if (fish.y > canvas.height) {
          fish.y = canvas.height;
          fish.direction = -fish.direction + (Math.random() - 0.5) * 0.5;
        }

        // Random direction changes
        if (Math.random() < 0.02) {
          fish.direction += (Math.random() - 0.5) * 0.5;
        }

        // Draw fish
        ctx.save();
        ctx.translate(fish.x, fish.y);
        ctx.rotate(fish.direction);
        
        // Fish body
        ctx.beginPath();
        ctx.fillStyle = fish.color;
        ctx.ellipse(0, 0, fish.size, fish.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Add shine effect
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.ellipse(fish.size / 4, -fish.size / 4, fish.size / 8, fish.size / 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.beginPath();
        ctx.moveTo(-fish.size, 0);
        ctx.lineTo(-fish.size - 15, -fish.size / 2);
        ctx.lineTo(-fish.size - 15, fish.size / 2);
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(fish.size / 2, -fish.size / 4, fish.size / 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(fish.size / 2, -fish.size / 4, fish.size / 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      console.log('AquariumBackground unmounting');
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      style={{ zIndex: -1 }}
    />
  );
}; 