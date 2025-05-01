import React from 'react';
import { cn } from '../lib/utils';

interface FishProps {
  type: 'clown' | 'blue' | 'yellow' | 'angelfish';
  className?: string;
  style?: React.CSSProperties;
  direction?: 'left' | 'right';
  speed?: 'slow' | 'medium' | 'fast';
}

export const Fish: React.FC<FishProps> = ({ 
  type, 
  className,
  style,
  direction = 'right',
  speed = 'medium'
}) => {
  // Define fish colors based on type
  const getColor = () => {
    switch(type) {
      case 'clown':
        return 'text-orange-500';
      case 'blue':
        return 'text-blue-500';
      case 'yellow':
        return 'text-yellow-400';
      case 'angelfish':
        return 'text-purple-300';
      default:
        return 'text-blue-500';
    }
  };

  // Define animation based on direction and speed
  const getAnimation = () => {
    const swimAnimation = direction === 'right' ? 'animate-swim-left-right' : 'animate-swim-right-left';
    
    let duration = 'animation-duration-[15s]';
    if (speed === 'slow') duration = 'animation-duration-[25s]';
    if (speed === 'fast') duration = 'animation-duration-[10s]';
    
    return `${swimAnimation} ${duration}`;
  };

  const renderFish = () => {
    switch(type) {
      case 'clown':
        return (
          <svg viewBox="0 0 100 60" className={cn("h-12 w-16", getColor())} fill="currentColor">
            <path d="M30,30 Q50,10 70,30 Q90,45 70,55 Q50,65 30,55 Q10,45 30,30 Z" />
            <circle cx="25" cy="35" r="3" fill="black" />
            <path d="M70,30 Q75,20 80,30" fill="none" stroke="white" strokeWidth="2" />
            <path d="M70,55 Q75,65 80,55" fill="none" stroke="white" strokeWidth="2" />
            <path d="M30,30 L30,55" stroke="white" strokeWidth="2" />
          </svg>
        );
      case 'blue':
        return (
          <svg viewBox="0 0 100 60" className={cn("h-10 w-14", getColor())}>
            <path d="M20,30 Q45,15 70,30 Q85,40 70,50 Q45,65 20,50 Q10,40 20,30 Z" fill="currentColor" />
            <circle cx="25" cy="35" r="3" fill="black" />
            <path d="M70,30 L85,20" fill="none" stroke="currentColor" strokeWidth="3" />
            <path d="M70,50 L85,60" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
        );
      case 'yellow':
        return (
          <svg viewBox="0 0 100 60" className={cn("h-8 w-12", getColor())}>
            <path d="M25,30 Q45,10 65,30 Q80,40 65,50 Q45,70 25,50 Q10,40 25,30 Z" fill="currentColor" />
            <circle cx="30" cy="35" r="3" fill="black" />
            <path d="M65,30 Q75,20 80,25" stroke="orange" strokeWidth="2" fill="none" />
            <path d="M65,50 Q75,60 80,55" stroke="orange" strokeWidth="2" fill="none" />
          </svg>
        );
      case 'angelfish':
        return (
          <svg viewBox="0 0 100 100" className={cn("h-14 w-12", getColor())}>
            <path d="M50,10 L50,90" stroke="currentColor" strokeWidth="2" />
            <path d="M50,50 Q70,35 60,10" fill="currentColor" stroke="currentColor" strokeWidth="1" />
            <path d="M50,50 Q70,65 60,90" fill="currentColor" stroke="currentColor" strokeWidth="1" />
            <path d="M50,50 Q15,50 35,30" fill="currentColor" stroke="currentColor" strokeWidth="1" />
            <path d="M35,30 L50,10" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M50,50 Q15,50 35,70" fill="currentColor" stroke="currentColor" strokeWidth="1" />
            <path d="M35,70 L50,90" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="42" cy="45" r="2" fill="black" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "absolute",
        getAnimation(),
        className
      )} 
      style={style}
    >
      {renderFish()}
    </div>
  );
};