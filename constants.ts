
export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 600;
export const GRAVITY = 0.6;
export const JUMP_STRENGTH = -8;
export const PIPE_SPEED = 3.5;
export const PIPE_SPAWN_RATE = 1500; // ms
export const PIPE_WIDTH = 60;
export const PIPE_GAP = 160;
export const BIRD_SIZE = 34;
export const GROUND_HEIGHT = 100;

export enum GameStatus {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}
