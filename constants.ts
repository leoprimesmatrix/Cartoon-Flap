
export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 600;
export const GRAVITY = 0.5; // Slightly lower gravity for a plane feel
export const JUMP_STRENGTH = -7.5;
export const PIPE_SPEED = 3.5;
export const PIPE_SPAWN_RATE = 1500; // ms
export const PIPE_WIDTH = 60;
export const PIPE_GAP = 170; // Slightly wider gap for the plane
export const BIRD_WIDTH = 60; // Planes are wider
export const BIRD_HEIGHT = 40;
export const BIRD_SIZE = 40; // Base size for collision
export const GROUND_HEIGHT = 100;

export enum GameStatus {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}
