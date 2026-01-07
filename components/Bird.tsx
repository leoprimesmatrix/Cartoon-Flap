
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
      className={`absolute z-10 ${isFlapping ? 'animate-plane' : ''}`}
      style={{
        top: y,
        left: '20%',
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT,
        // Centering the transform for the rotation point
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        backgroundImage: 'url("./plane.png")',
        backgroundSize: '280%', // Adjust to zoom in on the specific plane
        backgroundPosition: '15% 44%', // Crops the side-view plane '7'
        backgroundRepeat: 'no-repeat',
        willChange: 'top, transform',
        filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.25))'
      }}
    />
  );
};

export default Bird;
