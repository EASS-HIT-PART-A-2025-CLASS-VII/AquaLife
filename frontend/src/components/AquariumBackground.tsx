import React, { useEffect, useRef, useState } from 'react';

interface Fish {
  x: number;
  y: number;
  speed: number;
  direction: number;
  size: number;
  color: string;
  type: 'regular' | 'tropical' | 'angelfish';
  tailWag: number;
  tailWagSpeed: number;
  verticalOffset: number;
  verticalSpeed: number;
  scale: number;
}

interface Coral {
  x: number;
  y: number;
  type: 'tall' | 'medium' | 'short' | 'moss' | 'fern' | 'grass' | 'carpet' | 'lily' | 'reed' | 'bush';
  color: string;
  size: number;
  swayOffset: number;
  segments: number;
  detail: number;
  height: number;
}

export const AquariumBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fishesRef = useRef<Fish[]>([]);
  const coralsRef = useRef<Coral[]>([]);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize audio
  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.3; // Set initial volume to 30%
    audioRef.current = audio;

    // Load and play ambient sounds
    const loadAudio = async () => {
      try {
        console.log('Loading aquarium ambient sound...');
        // Updated path to match the actual file name
        audio.src = '/sounds/aquarium-ambient.mp3.wav';
        
        // Add event listeners for debugging
        audio.addEventListener('canplaythrough', () => {
          console.log('Audio loaded and ready to play');
        });
        
        audio.addEventListener('error', (e) => {
          console.error('Audio error:', e);
        });

        await audio.play();
        console.log('Audio playback started');
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    };

    loadAudio();

    // Cleanup
    return () => {
      if (audioRef.current) {
        console.log('Cleaning up audio...');
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Toggle mute function
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

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

    // Create initial fish with different types
    const createFish = (): Fish => {
      const type = Math.random() < 0.3 ? 'tropical' : Math.random() < 0.5 ? 'angelfish' : 'regular';
      const baseSize = type === 'tropical' ? 20 : type === 'angelfish' ? 35 : 30;
      const size = baseSize + Math.random() * 20;
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: (type === 'tropical' ? 2 : type === 'angelfish' ? 1 : 1.5) + Math.random(),
        direction: Math.random() * Math.PI * 2,
        size,
        color: type === 'tropical' 
          ? `hsl(${Math.random() * 60 + 300}, 80%, 60%)` 
          : type === 'angelfish'
          ? `hsl(${Math.random() * 60 + 180}, 80%, 60%)`
          : `hsl(${Math.random() * 60 + 200}, 80%, 60%)`,
        type,
        tailWag: 0,
        tailWagSpeed: 0.05 + Math.random() * 0.1,
        verticalOffset: 0,
        verticalSpeed: 0.01 + Math.random() * 0.02,
        scale: 0.8 + Math.random() * 0.4
      };
    };

    // Create corals
    const createCoral = (): Coral => {
      const type = Math.random() < 0.15 ? 'tall' : 
                  Math.random() < 0.3 ? 'medium' : 
                  Math.random() < 0.45 ? 'short' : 
                  Math.random() < 0.55 ? 'fern' :
                  Math.random() < 0.65 ? 'grass' :
                  Math.random() < 0.75 ? 'moss' :
                  Math.random() < 0.85 ? 'lily' :
                  Math.random() < 0.92 ? 'reed' :
                  Math.random() < 0.98 ? 'carpet' : 'bush';
      
      const colors = {
        tall: ['#1B5E20', '#2E7D32', '#388E3C'],
        medium: ['#33691E', '#558B2F', '#689F38'],
        short: ['#1B5E20', '#2E7D32', '#388E3C'],
        fern: ['#2E7D32', '#388E3C', '#43A047'],
        grass: ['#558B2F', '#689F38', '#7CB342'],
        moss: ['#1B5E20', '#2E7D32', '#388E3C'],
        carpet: ['#33691E', '#558B2F', '#689F38'],
        lily: ['#2E7D32', '#388E3C', '#43A047'],
        reed: ['#558B2F', '#689F38', '#7CB342'],
        bush: ['#1B5E20', '#2E7D32', '#388E3C']
      };
      
      return {
        x: Math.random() * canvas.width,
        y: canvas.height - 20, // Ensure plants start from the sand
        type,
        color: colors[type][Math.floor(Math.random() * colors[type].length)],
        size: type === 'tall' ? 40 + Math.random() * 30 : 
              type === 'medium' ? 30 + Math.random() * 20 : 
              type === 'short' ? 20 + Math.random() * 15 :
              type === 'fern' ? 25 + Math.random() * 20 :
              type === 'grass' ? 15 + Math.random() * 10 :
              type === 'moss' ? 20 + Math.random() * 15 :
              type === 'lily' ? 35 + Math.random() * 25 :
              type === 'reed' ? 12 + Math.random() * 8 :
              type === 'bush' ? 30 + Math.random() * 20 :
              30 + Math.random() * 20,
        swayOffset: Math.random() * Math.PI * 2,
        segments: type === 'tall' ? 5 + Math.floor(Math.random() * 3) : 
                 type === 'medium' ? 4 + Math.floor(Math.random() * 2) : 
                 type === 'short' ? 3 + Math.floor(Math.random() * 2) :
                 type === 'fern' ? 6 + Math.floor(Math.random() * 3) :
                 type === 'grass' ? 8 + Math.floor(Math.random() * 4) :
                 type === 'moss' ? 4 + Math.floor(Math.random() * 2) :
                 type === 'lily' ? 3 + Math.floor(Math.random() * 2) :
                 type === 'reed' ? 12 + Math.floor(Math.random() * 4) :
                 type === 'bush' ? 5 + Math.floor(Math.random() * 3) :
                 5 + Math.floor(Math.random() * 3),
        detail: 0.3 + Math.random() * 0.4,
        height: type === 'tall' ? 150 + Math.random() * 100 : 
                type === 'medium' ? 100 + Math.random() * 50 : 
                type === 'short' ? 50 + Math.random() * 30 :
                type === 'fern' ? 80 + Math.random() * 40 :
                type === 'grass' ? 30 + Math.random() * 20 :
                type === 'moss' ? 20 + Math.random() * 15 :
                type === 'lily' ? 40 + Math.random() * 20 :
                type === 'reed' ? 120 + Math.random() * 60 :
                type === 'bush' ? 45 + Math.random() * 25 :
                40 + Math.random() * 30
      };
    };

    // Initialize fish and corals
    fishesRef.current = Array.from({ length: 20 }, createFish);
    coralsRef.current = Array.from({ length: 15 }, createCoral);
    console.log('Fish created:', fishesRef.current.length);

    // Draw coral based on type
    const drawCoral = (ctx: CanvasRenderingContext2D, coral: Coral, time: number) => {
      ctx.save();
      ctx.translate(coral.x, coral.y);
      
      // Slower swaying motion
      const sway = Math.sin(time * 0.00005 + coral.swayOffset) * 1.5;
      ctx.rotate(sway * 0.003);

      // Add shadow under the plant
      ctx.beginPath();
      ctx.ellipse(0, coral.size * 0.1, coral.size * 0.3, coral.size * 0.1, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fill();

      if (coral.type === 'tall') {
        // Draw tall aquarium plant
        const drawLeaf = (x: number, y: number, angle: number, size: number) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          
          // Leaf shape
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(
            size * 0.3, -size * 0.1,
            size * 0.7, -size * 0.05,
            size, 0
          );
          ctx.bezierCurveTo(
            size * 0.7, size * 0.05,
            size * 0.3, size * 0.1,
            0, 0
          );
          
          const gradient = ctx.createLinearGradient(0, -size * 0.1, 0, size * 0.1);
          gradient.addColorStop(0, coral.color);
          gradient.addColorStop(1, shadeColor(coral.color, -20));
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Leaf vein
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(size * 0.8, 0);
          ctx.strokeStyle = shadeColor(coral.color, -30);
          ctx.lineWidth = 1;
          ctx.stroke();
          
          ctx.restore();
        };

        // Draw stem
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          coral.size * 0.1, -coral.height * 0.3,
          coral.size * 0.05, -coral.height * 0.7,
          0, -coral.height
        );
        ctx.strokeStyle = shadeColor(coral.color, -40);
        ctx.lineWidth = coral.size * 0.08;
        ctx.stroke();

        // Add leaves along the stem
        for (let i = 0; i < coral.segments; i++) {
          const y = -coral.height * (i / coral.segments);
          const leafSize = coral.size * (1 - i / coral.segments * 0.3);
          const angle = (Math.sin(time * 0.0002 + i) * 0.1) + (i % 2 === 0 ? 0.2 : -0.2);
          drawLeaf(0, y, angle, leafSize);
        }

      } else if (coral.type === 'medium') {
        // Draw medium aquarium plant
        const drawLeaf = (x: number, y: number, angle: number, size: number) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          
          // Leaf shape
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(
            size * 0.4, -size * 0.15,
            size * 0.8, -size * 0.1,
            size, 0
          );
          ctx.bezierCurveTo(
            size * 0.8, size * 0.1,
            size * 0.4, size * 0.15,
            0, 0
          );
          
          const gradient = ctx.createLinearGradient(0, -size * 0.15, 0, size * 0.15);
          gradient.addColorStop(0, coral.color);
          gradient.addColorStop(1, shadeColor(coral.color, -20));
          ctx.fillStyle = gradient;
          ctx.fill();
          
          ctx.restore();
        };

        // Draw stem
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          coral.size * 0.15, -coral.height * 0.3,
          coral.size * 0.1, -coral.height * 0.7,
          0, -coral.height
        );
        ctx.strokeStyle = shadeColor(coral.color, -40);
        ctx.lineWidth = coral.size * 0.1;
        ctx.stroke();

        // Add leaves
        for (let i = 0; i < coral.segments; i++) {
          const y = -coral.height * (i / coral.segments);
          const leafSize = coral.size * (1 - i / coral.segments * 0.2);
          const angle = (Math.sin(time * 0.0002 + i) * 0.15) + (i % 2 === 0 ? 0.3 : -0.3);
          drawLeaf(0, y, angle, leafSize);
        }

      } else if (coral.type === 'short') {
        // Draw short aquarium plant
        const drawLeaf = (x: number, y: number, angle: number, size: number) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          
          // Leaf shape
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(
            size * 0.5, -size * 0.2,
            size * 0.9, -size * 0.15,
            size, 0
          );
          ctx.bezierCurveTo(
            size * 0.9, size * 0.15,
            size * 0.5, size * 0.2,
            0, 0
          );
          
          const gradient = ctx.createLinearGradient(0, -size * 0.2, 0, size * 0.2);
          gradient.addColorStop(0, coral.color);
          gradient.addColorStop(1, shadeColor(coral.color, -20));
          ctx.fillStyle = gradient;
          ctx.fill();
          
          ctx.restore();
        };

        // Draw stem
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          coral.size * 0.2, -coral.height * 0.3,
          coral.size * 0.15, -coral.height * 0.7,
          0, -coral.height
        );
        ctx.strokeStyle = shadeColor(coral.color, -40);
        ctx.lineWidth = coral.size * 0.12;
        ctx.stroke();

        // Add leaves
        for (let i = 0; i < coral.segments; i++) {
          const y = -coral.height * (i / coral.segments);
          const leafSize = coral.size * (1 - i / coral.segments * 0.1);
          const angle = (Math.sin(time * 0.0002 + i) * 0.2) + (i % 2 === 0 ? 0.4 : -0.4);
          drawLeaf(0, y, angle, leafSize);
        }

      } else if (coral.type === 'fern') {
        // Draw fern plant
        const drawFernLeaf = (x: number, y: number, angle: number, size: number) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          
          // Fern leaf shape
          ctx.beginPath();
          ctx.moveTo(0, 0);
          for (let i = 0; i < 5; i++) {
            const t = i / 4;
            const px = size * t;
            const py = Math.sin(t * Math.PI) * size * 0.3;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.bezierCurveTo(
            size * 0.8, size * 0.2,
            size * 0.6, size * 0.1,
            size * 0.4, 0
          );
          ctx.bezierCurveTo(
            size * 0.6, -size * 0.1,
            size * 0.8, -size * 0.2,
            size, 0
          );
          
          const gradient = ctx.createLinearGradient(0, -size * 0.2, 0, size * 0.2);
          gradient.addColorStop(0, coral.color);
          gradient.addColorStop(1, shadeColor(coral.color, -20));
          ctx.fillStyle = gradient;
          ctx.fill();
          
          ctx.restore();
        };

        // Draw fern structure
        for (let i = 0; i < coral.segments; i++) {
          const y = -coral.height * (i / coral.segments);
          const size = coral.size * (1 - i / coral.segments * 0.2);
          const angle = (Math.sin(time * 0.00005 + i) * 0.1) + (i % 2 === 0 ? 0.2 : -0.2);
          drawFernLeaf(0, y, angle, size);
        }
      } else if (coral.type === 'grass') {
        // Draw grass
        const drawGrassBlade = (x: number, y: number, angle: number, size: number) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(
            size * 0.2, -size * 0.8,
            size * 0.1, -size * 0.9,
            0, -size
          );
          
          const gradient = ctx.createLinearGradient(0, 0, 0, -size);
          gradient.addColorStop(0, coral.color);
          gradient.addColorStop(1, shadeColor(coral.color, -20));
          ctx.strokeStyle = gradient;
          ctx.lineWidth = size * 0.1;
          ctx.stroke();
          
          ctx.restore();
        };

        // Draw grass cluster
        for (let i = 0; i < coral.segments; i++) {
          const angle = (i / coral.segments) * Math.PI * 2;
          const radius = coral.size * 0.3;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const bladeAngle = angle + (Math.sin(time * 0.00005 + i) * 0.1);
          drawGrassBlade(x, y, bladeAngle, coral.height);
        }
      } else if (coral.type === 'carpet') {
        // Draw carpet plant
        const drawCarpetSection = (x: number, y: number, size: number) => {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.bezierCurveTo(
            x + size * 0.3, y - size * 0.2,
            x + size * 0.7, y - size * 0.2,
            x + size, y
          );
          ctx.bezierCurveTo(
            x + size * 0.7, y + size * 0.2,
            x + size * 0.3, y + size * 0.2,
            x, y
          );
          
          const gradient = ctx.createRadialGradient(x + size/2, y, 0, x + size/2, y, size/2);
          gradient.addColorStop(0, coral.color);
          gradient.addColorStop(1, shadeColor(coral.color, -20));
          ctx.fillStyle = gradient;
          ctx.fill();
        };

        // Draw carpet pattern
        for (let i = 0; i < coral.segments; i++) {
          const x = (i % 3) * coral.size * 0.8 - coral.size;
          const y = Math.floor(i / 3) * coral.size * 0.6 - coral.size * 0.3;
          drawCarpetSection(x, y, coral.size);
        }
      } else if (coral.type === 'lily') {
        // Draw water lily
        const drawLilyPad = (x: number, y: number, size: number) => {
          ctx.save();
          ctx.translate(x, y);
          
          // Lily pad shape
          ctx.beginPath();
          ctx.moveTo(0, 0);
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = size * (0.8 + Math.sin(angle * 2) * 0.1);
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
          gradient.addColorStop(0, coral.color);
          gradient.addColorStop(1, shadeColor(coral.color, -30));
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Lily pad veins
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * size * 0.8, Math.sin(angle) * size * 0.8);
            ctx.strokeStyle = shadeColor(coral.color, -40);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          
          ctx.restore();
        };

        // Draw lily pads
        for (let i = 0; i < coral.segments; i++) {
          const x = (i % 3) * coral.size * 0.8 - coral.size;
          const y = -coral.height * (i / coral.segments);
          drawLilyPad(x, y, coral.size);
        }
      } else if (coral.type === 'reed') {
        // Draw reed
        const drawReed = (x: number, y: number, angle: number, size: number) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          
          // Reed stem
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(
            size * 0.1, -size * 0.3,
            size * 0.05, -size * 0.7,
            0, -size
          );
          ctx.strokeStyle = shadeColor(coral.color, -20);
          ctx.lineWidth = size * 0.05;
          ctx.stroke();
          
          // Reed head
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.bezierCurveTo(
            size * 0.2, -size * 1.1,
            size * 0.1, -size * 1.2,
            0, -size * 1.1
          );
          ctx.bezierCurveTo(
            -size * 0.1, -size * 1.2,
            -size * 0.2, -size * 1.1,
            0, -size
          );
          ctx.fillStyle = coral.color;
          ctx.fill();
          
          ctx.restore();
        };

        // Draw reed cluster
        for (let i = 0; i < coral.segments; i++) {
          const angle = (i / coral.segments) * Math.PI * 2;
          const radius = coral.size * 0.2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const reedAngle = angle + (Math.sin(time * 0.00005 + i) * 0.1);
          drawReed(x, y, reedAngle, coral.height);
        }
      } else if (coral.type === 'bush') {
        // Draw bush
        const drawBushSection = (x: number, y: number, size: number) => {
          ctx.save();
          ctx.translate(x, y);
          
          // Bush shape
          ctx.beginPath();
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const radius = size * (0.7 + Math.sin(time * 0.00005 + i) * 0.1);
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
          gradient.addColorStop(0, coral.color);
          gradient.addColorStop(0.5, shadeColor(coral.color, -20));
          gradient.addColorStop(1, shadeColor(coral.color, -40));
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Add texture
          for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * size * 0.7;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            const dotSize = size * 0.1 + Math.random() * size * 0.1;
            
            ctx.beginPath();
            ctx.arc(px, py, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = shadeColor(coral.color, -10);
            ctx.fill();
          }
          
          ctx.restore();
        };

        // Draw bush sections
        for (let i = 0; i < coral.segments; i++) {
          const y = -coral.height * (i / coral.segments);
          const size = coral.size * (1 - i / coral.segments * 0.3);
          const x = (Math.random() - 0.5) * coral.size * 0.3;
          drawBushSection(x, y, size);
        }
      } else {
        // Draw improved moss
        const drawMossCluster = (x: number, y: number, size: number) => {
          // Base moss shape
          ctx.beginPath();
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const radius = size * (0.8 + Math.sin(time * 0.00005 + i) * 0.1);
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
          gradient.addColorStop(0, coral.color);
          gradient.addColorStop(0.5, shadeColor(coral.color, -20));
          gradient.addColorStop(1, shadeColor(coral.color, -40));
          ctx.fillStyle = gradient;
          ctx.fill();

          // Add texture
          for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * size * 0.8;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            const dotSize = size * 0.05 + Math.random() * size * 0.05;
            
            ctx.beginPath();
            ctx.arc(px, py, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = shadeColor(coral.color, -10);
            ctx.fill();
          }
        };

        // Create moss clusters with better distribution
        for (let i = 0; i < coral.segments; i++) {
          const y = -coral.height * (i / coral.segments);
          const size = coral.size * (1 - i / coral.segments * 0.5);
          const x = (Math.random() - 0.5) * coral.size * 0.3;
          drawMossCluster(x, y, size);
        }
      }

      ctx.restore();
    };

    // Helper function to shade colors
    const shadeColor = (color: string, percent: number) => {
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

    // Draw fish based on type
    const drawFish = (ctx: CanvasRenderingContext2D, fish: Fish) => {
      ctx.save();
      ctx.translate(fish.x, fish.y + Math.sin(fish.verticalOffset) * 5);
      ctx.rotate(fish.direction);
      ctx.scale(fish.scale, fish.scale);

      // Draw fish based on type
      if (fish.type === 'tropical') {
        // Tropical fish (more detailed and colorful)
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
        // Angelfish (more elegant and detailed)
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
        // Regular fish (more detailed)
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
      // Eye
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.arc(fish.size * 0.7, -fish.size * 0.1, fish.size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.arc(fish.size * 0.7, -fish.size * 0.1, fish.size * 0.04, 0, Math.PI * 2);
      ctx.fill();

      // Shine effect
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.ellipse(fish.size * 0.3, -fish.size * 0.15, fish.size * 0.1, fish.size * 0.05, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Draw sand with improved shading and slower movement
    const drawSand = (ctx: CanvasRenderingContext2D) => {
      // Main sand gradient
      const gradient = ctx.createLinearGradient(0, canvas.height - 100, 0, canvas.height);
      gradient.addColorStop(0, '#F4D03F');
      gradient.addColorStop(0.5, '#D4AC0D');
      gradient.addColorStop(1, '#B7950B');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 100);
      ctx.bezierCurveTo(
        canvas.width * 0.25, canvas.height - 80,
        canvas.width * 0.75, canvas.height - 120,
        canvas.width, canvas.height - 100
      );
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Add sand texture with slower movement
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * canvas.width;
        const y = canvas.height - 100 + Math.random() * 100;
        const size = 1 + Math.random() * 2;
        const distanceFromTop = (y - (canvas.height - 100)) / 100;
        const opacity = 0.2 + Math.random() * 0.2 * (1 - distanceFromTop);
        
        ctx.beginPath();
        ctx.fillStyle = `rgba(244, 208, 63, ${opacity})`;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add some larger sand mounds with slower movement
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = canvas.height - 50 + Math.random() * 50;
        const size = 5 + Math.random() * 10;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244, 208, 63, 0.3)';
        ctx.fill();
      }
    };

    // Animation loop
    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return;

      // Calculate delta time
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#60a5fa'); // Surface water
      gradient.addColorStop(0.5, '#3b82f6'); // Middle water
      gradient.addColorStop(1, '#1e3a8a'); // Deep water
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw sand
      drawSand(ctx);

      // Draw corals
      coralsRef.current.forEach(coral => {
        drawCoral(ctx, coral, timestamp);
      });

      // Add some bubbles with varying sizes and slower speeds
      for (let i = 0; i < 6; i++) {
        const x = Math.random() * canvas.width;
        const y = (canvas.height + Math.random() * 100) % canvas.height;
        const size = 2 + Math.random() * 3;
        const opacity = 0.15 + Math.random() * 0.2;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }

      // Update and draw fish with slower movement
      fishesRef.current.forEach((fish) => {
        // Update position with reduced speed
        fish.x += Math.cos(fish.direction) * fish.speed * 0.7;
        fish.y += Math.sin(fish.direction) * fish.speed * 0.7;

        // Update tail wag and vertical movement with reduced speed
        fish.tailWag += fish.tailWagSpeed * 0.7;
        fish.verticalOffset += fish.verticalSpeed * 0.7;

        // Bounce off walls with smoother transitions
        if (fish.x < 0) {
          fish.x = 0;
          fish.direction = Math.PI - fish.direction + (Math.random() - 0.5) * 0.3;
        } else if (fish.x > canvas.width) {
          fish.x = canvas.width;
          fish.direction = Math.PI - fish.direction + (Math.random() - 0.5) * 0.3;
        }
        if (fish.y < 0) {
          fish.y = 0;
          fish.direction = -fish.direction + (Math.random() - 0.5) * 0.3;
        } else if (fish.y > canvas.height - 150) { // Keep fish above the sand
          fish.y = canvas.height - 150;
          fish.direction = -fish.direction + (Math.random() - 0.5) * 0.3;
        }

        // Random direction changes with smoother transitions
        if (Math.random() < 0.01) {
          fish.direction += (Math.random() - 0.5) * 0.3;
        }

        // Draw the fish
        drawFish(ctx, fish);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      console.log('AquariumBackground unmounting');
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full"
        style={{ zIndex: -1 }}
      />
      <button
        onClick={toggleMute}
        className="fixed bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-200"
        style={{ zIndex: 10 }}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    </>
  );
}; 