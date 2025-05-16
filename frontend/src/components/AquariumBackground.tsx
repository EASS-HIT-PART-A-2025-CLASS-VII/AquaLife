import React, { useEffect, useRef, useState } from 'react';
import { AquariumState, Fish, Shark, SmallCreature } from './aquarium/types';
import { createFish, drawFish, updateFish } from './aquarium/Fish';
import { createShark, drawShark, updateShark } from './aquarium/Sharks';
import { createBubble, drawBubble, updateBubble } from './aquarium/Bubbles';
import { createCaustic, drawGlassEffects, updateCaustics } from './aquarium/GlassEffects';
import { createParticle, createLightBeam, drawUnderwaterEffects, updateUnderwaterEffects } from './aquarium/UnderwaterEffects';
import { createSmallCreature, drawSmallCreature, updateSmallCreature } from './aquarium/SmallCreatures';
import { createFoodParticle, createRipple, drawFoodParticle, drawRipple, updateFoodParticle, updateRipple } from './aquarium/InteractiveElements';
import { createGradient } from './aquarium/graphics';

const MAX_FISH = 36; // Maximum number of fish allowed (38 total - 2 sharks)
const MAX_SMALL_CREATURES = 12; // Maximum number of small creatures allowed

export const AquariumBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isDaytime, setIsDaytime] = useState(true);
  const stateRef = useRef<AquariumState>({
    fish: [],
    sharks: [],
    lastTime: 0,
    bubbles: [],
    lightRays: [],
    caustics: [],
    particles: [],
    lightBeams: [],
    smallCreatures: [],
    foodParticles: [],
    ripples: [],
    temperature: 25,
    isDaytime: true,
    dayNightCycle: 0
  });

  useEffect(() => {
    // Add styles to prevent scrolling on the root element
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to viewport size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize audio
    const audio = new Audio('/sounds/aquarium-ambient.mp3.wav');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    audio.addEventListener('canplaythrough', () => {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    });

    audio.addEventListener('error', (error) => {
      console.error('Error loading audio:', error);
    });

    // Initialize aquarium state
    const state = stateRef.current;
    
    // Initialize fish with balanced distribution
    if (state.fish.length < MAX_FISH) {
      const fishTypes: Fish['type'][] = ['tropical', 'angelfish', 'regular', 'cleaner', 'guppy', 'tetra', 'nemo'];
      const fishPerType = Math.floor(MAX_FISH / fishTypes.length);
      const remainingFish = MAX_FISH % fishTypes.length;

      // Create fish of each type with balanced distribution
      fishTypes.forEach((type, index) => {
        const count = fishPerType + (index < remainingFish ? 1 : 0);
        for (let i = 0; i < count; i++) {
          const fish = createFish(canvas, type);
          state.fish.push(fish);
        }
      });
    }

    // Initialize sharks (always 2)
    if (state.sharks.length < 2) {
      const sharksToAdd = 2 - state.sharks.length;
      for (let i = 0; i < sharksToAdd; i++) {
        state.sharks.push(createShark(canvas));
      }
    }

    // Initialize small creatures with balanced distribution
    if (state.smallCreatures.length < MAX_SMALL_CREATURES) {
      const creaturesToAdd = MAX_SMALL_CREATURES - state.smallCreatures.length;
      for (let i = 0; i < creaturesToAdd; i++) {
        state.smallCreatures.push(createSmallCreature(canvas));
      }
    }

    // Initialize bubbles
    for (let i = 0; i < 30; i++) {
      state.bubbles.push(createBubble(canvas));
    }

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      state.particles.push(createParticle(canvas));
    }

    // Initialize light beams
    for (let i = 0; i < 8; i++) {
      state.lightBeams.push(createLightBeam(canvas));
    }

    // Initialize light rays
    for (let i = 0; i < 5; i++) {
      state.lightRays.push({
        x: Math.random() * canvas.width,
        y: 0,
        width: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.1 + 0.05
      });
    }

    // Initialize caustics
    for (let i = 0; i < 8; i++) {
      state.caustics.push(createCaustic(canvas));
    }

    // Handle click events for ripples and food
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Create ripple with improved positioning
      const ripple = createRipple(x, y);
      state.ripples.push(ripple);

      // Create food particle with higher probability
      if (Math.random() < 0.5) { // Increased from 0.3 to 0.5
        state.foodParticles.push(createFoodParticle(canvas, x, y));
      }
    };

    canvas.addEventListener('click', handleClick);

    // Animation loop
    let animationFrameId: number;
    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update day/night cycle based on state
      state.isDaytime = isDaytime;
      state.dayNightCycle = isDaytime ? 0 : Math.PI;

      // Draw background gradient based on time of day
      const bgGradient = createGradient(
        ctx,
        0, 0,
        0, canvas.height,
        isDaytime ? '#1e88e5' : '#0d47a1',
        isDaytime ? '#0d47a1' : '#000033'
      );
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw underwater effects
      drawUnderwaterEffects(ctx, canvas, state.particles, state.lightBeams, timestamp);
      updateUnderwaterEffects(state.particles, state.lightBeams, canvas, timestamp);

      // Draw light rays
      state.lightRays.forEach(ray => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(ray.x, ray.y);
        ctx.lineTo(ray.x + 100, ray.y + 200);
        ctx.strokeStyle = `rgba(255, 255, 255, ${ray.opacity * (isDaytime ? 1 : 0.3)})`;
        ctx.lineWidth = ray.width;
        ctx.stroke();
        ctx.restore();

        ray.y += ray.speed;
        if (ray.y > canvas.height) {
          ray.y = -200;
          ray.x = Math.random() * canvas.width;
        }
      });

      // Update and draw fish
      state.fish.forEach((fish: Fish) => {
        updateFish(fish, canvas, timestamp);
        drawFish(ctx, fish, timestamp);
      });

      // Update and draw sharks
      state.sharks.forEach((shark: Shark) => {
        updateShark(shark, canvas, timestamp);
        drawShark(ctx, shark, timestamp);
      });

      // Update and draw small creatures
      state.smallCreatures.forEach((creature: SmallCreature) => {
        updateSmallCreature(creature, canvas, timestamp);
        drawSmallCreature(ctx, creature, timestamp);
      });

      // Update and draw food particles
      state.foodParticles = state.foodParticles.filter(food => {
        updateFoodParticle(food, canvas, state.fish);
        drawFoodParticle(ctx, food);
        return !food.eaten;
      });

      // Update and draw ripples
      state.ripples = state.ripples.filter(ripple => {
        drawRipple(ctx, ripple);
        return updateRipple(ripple);
      });

      // Update and draw bubbles
      state.bubbles.forEach(bubble => {
        updateBubble(bubble, canvas, timestamp);
        drawBubble(ctx, bubble);
      });

      // Update and draw caustics
      updateCaustics(state.caustics, canvas, timestamp);
      drawGlassEffects(ctx, canvas, state.caustics, timestamp);

      state.lastTime = timestamp;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Reset styles on cleanup
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.height = '';
      document.body.style.width = '';
    };
  }, [isDaytime]); // Keep isDaytime in dependencies to reinitialize on day/night change

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleDayNight = () => {
    setIsDaytime(!isDaytime);
  };

  const createRepelEffect = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = stateRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxDimension = Math.max(canvas.width, canvas.height);

    // Create a massive central ripple that covers the entire screen
    const mainRipple = createRipple(centerX, centerY);
    mainRipple.radius = 0;
    mainRipple.maxRadius = maxDimension * 2;
    mainRipple.speed = 10;
    mainRipple.opacity = 0.9;
    state.ripples.push(mainRipple);

    // Create a ring of ripples that expand outward
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 40 + i * 30;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const ripple = createRipple(x, y);
      ripple.radius = 0;
      ripple.maxRadius = maxDimension * 2.5;
      ripple.speed = 8 + i * 0.3;
      ripple.opacity = 0.7 - (i * 0.04);
      state.ripples.push(ripple);
    }

    // Create additional ripples in a spiral pattern
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 6;
      const distance = 50 + i * 25;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const ripple = createRipple(x, y);
      ripple.radius = 0;
      ripple.maxRadius = maxDimension * 2.2;
      ripple.speed = 9;
      ripple.opacity = 0.5;
      state.ripples.push(ripple);
    }

    // Create corner ripples for full coverage
    const corners = [
      { x: 0, y: 0 },
      { x: canvas.width, y: 0 },
      { x: 0, y: canvas.height },
      { x: canvas.width, y: canvas.height }
    ];

    corners.forEach(corner => {
      const ripple = createRipple(corner.x, corner.y);
      ripple.radius = 0;
      ripple.maxRadius = maxDimension * 2;
      ripple.speed = 7;
      ripple.opacity = 0.6;
      state.ripples.push(ripple);
    });
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      overflow: 'hidden',
      height: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      zIndex: 0
    }}>
      <canvas
        ref={canvasRef}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          display: 'block',
          zIndex: 1
        }}
      />
      <div style={{ 
        position: 'fixed', 
        bottom: '2rem', 
        right: '2rem', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '0.5rem', 
        zIndex: 2,
        pointerEvents: 'auto',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          padding: '0.5rem',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transform: 'translateY(0)',
          transition: 'transform 0.3s ease'
        }}>
          <button
            onClick={createRepelEffect}
            style={{
              padding: '0.5rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '2.5rem',
              minHeight: '2.5rem',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ pointerEvents: 'none' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          <button
            onClick={toggleDayNight}
            style={{
              padding: '0.5rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '2.5rem',
              minHeight: '2.5rem',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isDaytime ? (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ pointerEvents: 'none' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ pointerEvents: 'none' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
          <button
            onClick={toggleMute}
            style={{
              padding: '0.5rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '2.5rem',
              minHeight: '2.5rem',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isMuted ? (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ pointerEvents: 'none' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ pointerEvents: 'none' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AquariumBackground; 