
export interface PipeData {
  id: number;
  x: number;
  topHeight: number;
  passed: boolean;
}

export interface GameState {
  birdY: number;
  birdVelocity: number;
  birdRotation: number;
  pipes: PipeData[];
  score: number;
  highScore: number;
  status: 'START' | 'PLAYING' | 'GAME_OVER';
  commentary: string;
}
