
import React from 'react';
import { PIPE_WIDTH, PIPE_GAP, GAME_HEIGHT, GROUND_HEIGHT } from '../constants';

interface PipeProps {
  x: number;
  topHeight: number;
}

const Pipe: React.FC<PipeProps> = ({ x, topHeight }) => {
  const bottomTop = topHeight + PIPE_GAP;
  const bottomHeight = GAME_HEIGHT - GROUND_HEIGHT - bottomTop;

  return (
    <>
      {/* Top Pipe */}
      <div
        className="absolute bg-green-500 border-x-4 border-b-4 border-black rounded-b-xl shadow-[inset_-4px_0_0_rgba(0,0,0,0.1)] overflow-visible"
        style={{
          left: x,
          top: 0,
          width: PIPE_WIDTH,
          height: topHeight,
        }}
      >
        <div className="absolute -bottom-2 -left-2 w-[calc(100%+16px)] h-8 bg-green-400 border-4 border-black rounded-lg shadow-md" />
      </div>

      {/* Bottom Pipe */}
      <div
        className="absolute bg-green-500 border-x-4 border-t-4 border-black rounded-t-xl shadow-[inset_-4px_0_0_rgba(0,0,0,0.1)] overflow-visible"
        style={{
          left: x,
          top: bottomTop,
          width: PIPE_WIDTH,
          height: bottomHeight,
        }}
      >
        <div className="absolute -top-2 -left-2 w-[calc(100%+16px)] h-8 bg-green-400 border-4 border-black rounded-lg shadow-md" />
      </div>
    </>
  );
};

export default Pipe;
