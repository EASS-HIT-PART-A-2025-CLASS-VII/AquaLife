import React from 'react';
import { Fish } from './Fish';
import { Bubble } from './Bubble';

export const AquariumBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden aquarium-gradient">
      {/* Decorations */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-900/70 to-transparent" />
      
      {/* Plants */}
      <div className="absolute bottom-0 left-1/4 w-20 h-32 bg-green-800/80 rounded-t-full" />
      <div className="absolute bottom-0 left-1/4 ml-4 w-12 h-40 bg-green-700/80 rounded-t-full" />
      
      <div className="absolute bottom-0 right-1/4 w-16 h-48 bg-emerald-800/80 rounded-t-full" />
      <div className="absolute bottom-0 right-1/4 mr-6 w-10 h-36 bg-emerald-700/80 rounded-t-full" />
      
      {/* Rocks */}
      <div className="absolute bottom-0 left-10 w-20 h-16 bg-gray-700/80 rounded-t-full" />
      <div className="absolute bottom-0 right-20 w-24 h-12 bg-slate-600/80 rounded-t-full" />
      
      {/* Fish */}
      <Fish 
        type="clown" 
        direction="right" 
        speed="medium" 
        style={{ top: '20%', left: '10%' }}
      />
      
      <Fish 
        type="blue" 
        direction="left" 
        speed="fast" 
        style={{ top: '30%', right: '10%' }}
      />
      
      <Fish 
        type="yellow" 
        direction="right" 
        speed="slow" 
        style={{ top: '50%', left: '20%' }}
      />
      
      <Fish 
        type="angelfish" 
        direction="right" 
        speed="slow" 
        style={{ top: '15%', left: '40%' }}
        className="animate-float-up-down"
      />
      
      <Fish 
        type="blue" 
        direction="left" 
        speed="medium" 
        style={{ top: '60%', right: '15%' }}
      />
      
      <Fish 
        type="clown" 
        direction="left" 
        speed="medium" 
        style={{ top: '40%', right: '25%' }}
        className="animate-float-up-down"
      />
      
      <Fish 
        type="yellow" 
        direction="right" 
        speed="fast" 
        style={{ top: '70%', left: '30%' }}
      />
      
      {/* Bubbles */}
      <Bubble size="small" speed="fast" style={{ bottom: '0%', left: '20%' }} />
      <Bubble size="medium" speed="medium" style={{ bottom: '5%', left: '25%' }} />
      <Bubble size="small" speed="medium" style={{ bottom: '0%', left: '30%' }} />
      <Bubble size="large" speed="slow" style={{ bottom: '0%', left: '40%' }} />
      
      <Bubble size="small" speed="fast" style={{ bottom: '0%', right: '15%' }} />
      <Bubble size="medium" speed="medium" style={{ bottom: '8%', right: '20%' }} />
      <Bubble size="small" speed="slow" style={{ bottom: '0%', right: '25%' }} />
      <Bubble size="large" speed="slow" style={{ bottom: '0%', right: '30%' }} />
      
      {/* Overlay to create water effect */}
      <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[1px]" />
    </div>
  );
};
