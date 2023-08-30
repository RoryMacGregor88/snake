import { Coords, ExtraType } from './types';

export const MAX_GRID_SIZE = 13;
export const MIN_GRID_SIZE = 1;

export const INITIAL_SNAKE_COORDS: Coords[] = [[7, 7]];
export const INITIAL_EXTRA_COORDS: Coords = [0, 0];

export const EXTRA_TYPES: { [key: string]: ExtraType } = {
  bonus: 'bonus',
  boobyTrap: 'boobyTrap',
};

export const EXTRAS_LIFESPAN = 20;

export const DIRECTION_KEYS: { [key: string]: string } = {
  ArrowLeft: 'ArrowLeft',
  ArrowUp: 'ArrowUp',
  ArrowRight: 'ArrowRight',
  ArrowDown: 'ArrowDown',
};

export const INITIAL_SPEED = 500;
export const SPEED_REDUCTION = 25;
export const MAX_SPEED = 150;

export const LOADING_LEADERBOARD_MESSAGE = 'Loading leaderboard...';

export const OPPOSITE_KEYS: { [key: string]: string } = {
  ArrowLeft: 'ArrowRight',
  ArrowUp: 'ArrowDown',
  ArrowRight: 'ArrowLeft',
  ArrowDown: 'ArrowUp',
};

export const MAX_NAME_LENGTH = 12;

export const MIN_SCREEN_SIZE = 1500;

export const DATE_FORMAT = 'dd/LL/uuuu';
