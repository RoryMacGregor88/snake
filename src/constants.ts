import { Coords } from './types';

export const MAX_GRID_SIZE = 13;
export const MIN_GRID_SIZE = 1;

export const INITIAL_COORDS: Coords[] = [[7, 7]];

export const DIRECTION_KEYS: { [key: string]: string } = {
  ArrowLeft: 'ArrowLeft',
  ArrowUp: 'ArrowUp',
  ArrowRight: 'ArrowRight',
  ArrowDown: 'ArrowDown',
};

export const INITIAL_SPEED = 500;
export const REDUCTION_SPEED = 10;
export const MAX_SPEED = 150;
