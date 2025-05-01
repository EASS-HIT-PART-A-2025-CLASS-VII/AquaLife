import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-10 w-10">
        {/* Fish icon */}
        <svg viewBox="0 0 100 100" className="h-10 w-10 text-marine-light">
          <path 
            d="M30,50 Q50,30 70,50 Q90,65 70,75 Q50,85 30,75 Q10,65 30,50 Z" 
            fill="currentColor"
          />
          <circle cx="25" cy="55" r="3" fill="white" />
          <path d="M70,50 Q75,40 80,50" fill="none" stroke="white" strokeWidth="2" />
          <path d="M70,75 Q75,85 80,75" fill="none" stroke="white" strokeWidth="2" />
        </svg>
        {/* Bubbles */}
        <div className="absolute top-0 right-0 h-3 w-3 rounded-full bg-blue-300/80" />
        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-200/80" />
      </div>
      <h1 className="text-2xl font-bold text-white">AquaLife</h1>
    </div>
  );
};