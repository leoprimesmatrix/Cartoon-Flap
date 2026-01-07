
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Bird from './components/Bird';
import Pipe from './components/Pipe';
import GameOverlay from './components/GameOverlay';
import { 
  GAME_WIDTH, GAME_HEIGHT, GRAVITY, JUMP_STRENGTH, 
  PIPE_SPEED, PIPE_SPAWN_RATE, PIPE_WIDTH, PIPE_GAP, 
  BIRD_SIZE, GROUND_HEIGHT, GameStatus 
} from './constants';
import { PipeData } from './types';
import { getDeathCommentary } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.START);
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [birdRotation, setBirdRotation] = useState(0);
  const [pipes, setPipes] = useState<PipeData[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [commentary, setCommentary] = useState("AI is watching...");
  const [isFlapping, setIsFlapping] = useState(false);

  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const lastPipeTimeRef = useRef<number>(0);
  const gameActiveRef = useRef(false);

  // Sync ref with status for performance in loop
  useEffect(() => {
    gameActiveRef.current = status === GameStatus.PLAYING;
  }, [status]);

  const resetGame = () => {
    setBirdY(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setBirdRotation(0);
    setPipes([]);
    setScore(0);
    setStatus(GameStatus.PLAYING);
    setCommentary("Thinking of a roast...");
    lastTimeRef.current = performance.now();
    lastPipeTimeRef.current = performance.now();
  };

  const jump = useCallback(() => {
    if (status === GameStatus.START) {
      resetGame();
    } else if (status === GameStatus.PLAYING) {
      setBirdVelocity(JUMP_STRENGTH);
      setIsFlapping(true);
      setTimeout(() => setIsFlapping(false), 150);
    }
  }, [status]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  const gameOver = useCallback(async (finalScore: number) => {
    setStatus(GameStatus.GAME_OVER);
    if (finalScore > highScore) setHighScore(finalScore);
    
    // Fetch AI commentary
    const roast = await getDeathCommentary(finalScore);
    setCommentary(roast);
  }, [highScore]);

  const update = useCallback((time: number) => {
    // Initial time setup
    if (!lastTimeRef.current) {
      lastTimeRef.current = time;
    }

    // Calculate Delta Time (normalized to 60fps)
    // 1 unit = 16.67ms
    let deltaTime = (time - lastTimeRef.current) / (1000 / 60);
    
    // Cap deltaTime to prevent huge jumps (e.g., if tab was in background)
    if (deltaTime > 3) deltaTime = 1;
    lastTimeRef.current = time;

    if (!gameActiveRef.current) {
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    // 1. Update Velocity (Gravity)
    setBirdVelocity(v => v + GRAVITY * deltaTime);

    // 2. Update Position
    setBirdY(y => {
      // Move bird based on current velocity and deltaTime
      const nextY = y + birdVelocity * deltaTime;
      
      // Update rotation based on velocity
      setBirdRotation(Math.min(Math.max(birdVelocity * 4, -25), 90));

      // Ground/Ceiling collision detection
      if (nextY > GAME_HEIGHT - GROUND_HEIGHT - BIRD_SIZE / 2 || nextY < 0) {
        gameOver(score);
        return y;
      }
      return nextY;
    });

    // 3. Pipes spawning (Uses absolute time)
    if (time - lastPipeTimeRef.current > PIPE_SPAWN_RATE) {
      const minPipeHeight = 50;
      const maxPipeHeight = GAME_HEIGHT - GROUND_HEIGHT - PIPE_GAP - minPipeHeight;
      const topHeight = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight;
      
      setPipes(prev => [...prev, {
        id: Date.now(),
        x: GAME_WIDTH,
        topHeight,
        passed: false
      }]);
      lastPipeTimeRef.current = time;
    }

    // 4. Pipes movement & collision
    setPipes(prev => {
      const updated = prev
        .map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED * deltaTime }))
        .filter(pipe => pipe.x + PIPE_WIDTH > -100);

      // Collision Check
      for (const pipe of updated) {
        // Narrower collision box for fairness
        const birdLeft = GAME_WIDTH * 0.2 - BIRD_SIZE / 2 + 8;
        const birdRight = GAME_WIDTH * 0.2 + BIRD_SIZE / 2 - 8;
        const birdTop = birdY - BIRD_SIZE / 2 + 8;
        const birdBottom = birdY + BIRD_SIZE / 2 - 8;

        if (
          birdRight > pipe.x &&
          birdLeft < pipe.x + PIPE_WIDTH &&
          (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP)
        ) {
          gameOver(score);
        }

        // Score update logic
        if (!pipe.passed && birdLeft > pipe.x + PIPE_WIDTH) {
          pipe.passed = true;
          setScore(s => s + 1);
        }
      }
      return updated;
    });

    requestRef.current = requestAnimationFrame(update);
  }, [birdVelocity, birdY, gameOver, score]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  return (
    <div 
      className="relative flex items-center justify-center min-h-screen bg-slate-900 overflow-hidden select-none"
      onMouseDown={(e) => {
        // Prevent trigger on UI buttons
        if ((e.target as HTMLElement).closest('button')) return;
        jump();
      }}
      onTouchStart={(e) => {
        if ((e.target as HTMLElement).closest('button')) return;
        jump();
      }}
    >
      {/* Game Container */}
      <div 
        className="relative overflow-hidden bg-sky-300 border-8 border-slate-800 rounded-3xl shadow-2xl"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Parallax Background - Clouds */}
        <div className="absolute inset-0 pointer-events-none opacity-50">
           <div className="absolute top-10 left-0 w-[800px] h-32 parallax-bg flex gap-20">
              <div className="w-24 h-12 bg-white rounded-full" />
              <div className="w-32 h-16 bg-white rounded-full mt-10" />
              <div className="w-20 h-10 bg-white rounded-full" />
              <div className="w-24 h-12 bg-white rounded-full" />
              <div className="w-32 h-16 bg-white rounded-full mt-10" />
              <div className="w-20 h-10 bg-white rounded-full" />
           </div>
           <div className="absolute top-40 left-0 w-[800px] h-32 parallax-fg flex gap-40 opacity-30">
              <div className="w-40 h-20 bg-white rounded-full" />
              <div className="w-24 h-12 bg-white rounded-full mt-5" />
              <div className="w-40 h-20 bg-white rounded-full" />
              <div className="w-24 h-12 bg-white rounded-full mt-5" />
           </div>
        </div>

        {/* Pipes */}
        {pipes.map(pipe => (
          <Pipe key={pipe.id} x={pipe.x} topHeight={pipe.topHeight} />
        ))}

        {/* Bird */}
        <Bird y={birdY} rotation={birdRotation} isFlapping={isFlapping} />

        {/* Ground */}
        <div 
          className="absolute bottom-0 left-0 w-full bg-green-700 border-t-4 border-black z-20"
          style={{ height: GROUND_HEIGHT }}
        >
           <div className="w-full h-full bg-[linear-gradient(45deg,#15803d_25%,transparent_25%,transparent_50%,#15803d_50%,#15803d_75%,transparent_75%,transparent)] bg-[length:20px_20px]" />
        </div>

        {/* HUD */}
        <div className="absolute top-6 left-0 w-full flex justify-center pointer-events-none z-30">
          <span className="text-6xl font-bold text-white drop-shadow-[0_4px_0_rgba(0,0,0,1)]">
            {score}
          </span>
        </div>

        {/* Overlays */}
        <GameOverlay 
          status={status} 
          score={score} 
          highScore={highScore} 
          commentary={commentary}
          onStart={resetGame} 
        />
      </div>
      
      {/* Footer Info */}
      <div className="absolute bottom-4 text-slate-500 font-bold uppercase tracking-widest text-xs">
        Delta-Time Optimized • {status}
      </div>
    </div>
  );
};

export default App;
