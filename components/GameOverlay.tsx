
import React from 'react';
import { GameStatus } from '../constants';

interface GameOverlayProps {
  status: GameStatus;
  score: number;
  highScore: number;
  commentary: string;
  onStart: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({ status, score, highScore, commentary, onStart }) => {
  if (status === GameStatus.PLAYING) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 text-center">
      <div className="bg-white p-8 rounded-3xl border-8 border-yellow-400 shadow-2xl transform scale-110 animate-bounce-subtle">
        {status === GameStatus.START ? (
          <>
            <h1 className="text-5xl font-bold text-blue-600 mb-4 drop-shadow-lg">CARTOON FLAP</h1>
            <p className="text-gray-600 mb-6 font-semibold">TAP OR SPACE TO FLY!</p>
            <button
              onClick={onStart}
              className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 px-10 rounded-full border-b-8 border-green-700 active:translate-y-2 active:border-b-0 transition-all"
            >
              LET'S GO!
            </button>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold text-red-500 mb-2">OOPS!</h2>
            <div className="bg-yellow-100 p-4 rounded-xl mb-4 italic text-lg text-gray-700">
              "{commentary}"
            </div>
            <div className="space-y-1 mb-6">
              <p className="text-2xl font-bold text-gray-800">SCORE: {score}</p>
              <p className="text-lg font-bold text-blue-500">BEST: {highScore}</p>
            </div>
            <button
              onClick={onStart}
              className="bg-orange-500 hover:bg-orange-600 text-white text-2xl font-bold py-4 px-10 rounded-full border-b-8 border-orange-700 active:translate-y-2 active:border-b-0 transition-all"
            >
              RETRY?
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GameOverlay;
