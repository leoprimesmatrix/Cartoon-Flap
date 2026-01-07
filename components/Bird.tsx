
import React from 'react';
import { BIRD_SIZE } from '../constants';

interface BirdProps {
  y: number;
  rotation: number;
  isFlapping: boolean;
}

const Bird: React.FC<BirdProps> = ({ y, rotation, isFlapping }) => {
  return (
    <div
      className="absolute z-10"
      style={{
        top: y,
        left: '20%',
        width: BIRD_SIZE,
        height: BIRD_SIZE,
        // Using transform only for rotation and offset adjustment. 
        // Position is handled by 'top' for simplicity in this physics model.
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        willChange: 'top, transform'
      }}
    >
      {/* Cartoon Bird Body */}
      <div className="relative w-full h-full bg-yellow-400 rounded-full border-4 border-black shadow-lg overflow-visible">
        {/* Eye */}
        <div className="absolute top-1 right-2 w-4 h-4 bg-white rounded-full border-2 border-black">
          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-black rounded-full" />
        </div>
        
        {/* Beak */}
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-4 bg-orange-500 rounded-r-full border-2 border-black" />
        
        {/* Wing */}
        <div 
          className={`absolute left-1 top-1/2 -translate-y-1/2 w-5 h-4 bg-yellow-500 rounded-full border-2 border-black origin-right ${isFlapping ? 'animate-flap' : ''}`}
        />
      </div>
    </div>
  );
};

export default Bird;
