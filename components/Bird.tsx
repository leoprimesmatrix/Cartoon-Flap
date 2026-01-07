
import React from 'react';
import { BIRD_WIDTH, BIRD_HEIGHT } from '../constants';

interface BirdProps {
  y: number;
  rotation: number;
  isFlapping: boolean;
}

const Bird: React.FC<BirdProps> = ({ y, rotation, isFlapping }) => {
  return (
    <div
      className={`absolute z-10 transition-transform duration-75 ${isFlapping ? 'animate-plane' : ''}`}
      style={{
        top: y,
        left: '20%',
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        backgroundImage: 'url("./plane.png")',
        backgroundColor: '#facc15', // Fallback yellow if image fails
        backgroundSize: '300%', // Scale up to see the details
        backgroundPosition: '12% 44%', // Target the orange plane '7'
        backgroundRepeat: 'no-repeat',
        borderRadius: '8px',
        willChange: 'top, transform',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
      }}
    />
  );
};

export default Bird;
