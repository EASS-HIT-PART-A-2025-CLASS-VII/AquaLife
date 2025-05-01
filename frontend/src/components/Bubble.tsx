import React from 'react';
import { cn } from '../lib/utils';

interface BubbleProps {
  size?: 'small' | 'medium' | 'large';
  speed?: 'slow' | 'medium' | 'fast';
  className?: string;
  style?: React.CSSProperties;
}

export const Bubble: React.FC<BubbleProps> = ({ 
  size = 'medium', 
  speed = 'medium',
  className,
  style
}) => {
  // Define size classes
  const getSize = () => {
    switch(size) {
      case 'small':
        return 'h-2 w-2';
      case 'large':
        return 'h-6 w-6';
      case 'medium':
      default:
        return 'h-4 w-4';
    }
  };

  // Define animation speed
  const getSpeed = () => {
    switch(speed) {
      case 'slow':
        return 'animation-duration-[25s]';
      case 'fast':
        return 'animation-duration-[8s]';
      case 'medium':
      default:
        return 'animation-duration-[15s]';
    }
  };

  return (
    <div 
      className={cn(
        "absolute rounded-full bg-white/30 animate-bubble-rise",
        getSize(),
        getSpeed(),
        className
      )}
      style={style}
    />
  );
};