import { vi, it, describe, expect } from 'vitest';

import {
  getRandomNonSnakeBox,
  createGrid,
  checkHasLost,
  calculateNextCoords,
  checkIsEatingExtra,
  checkIsEatingFood,
  getNextCoords,
} from './utils';

describe('utils', () => {
  describe('getRandomNonSnakeBox', () => {
    const boxes = [
      [1, 1],
      [1, 2],
    ];

    it('should return a new box from only filtered list', () => {
      const currentCoords = [[1, 1]];
      const result = getRandomNonSnakeBox(boxes, currentCoords);
      expect(result).toStrictEqual([1, 2]);
    });
  });

  describe('createGrid', () => {
    it('should created a nested array of coordinated of specified length', () => {
      const result = createGrid(2),
        expected = [
          [1, 1],
          [1, 2],
          [1, 3],
        ];

      expect(result).toStrictEqual(expected);
    });

    it('should start new line after max grid size reached', () => {
      const result = createGrid(4, 4),
        expected = [
          [1, 1],
          [1, 2],
          [1, 3],
          [1, 4],
          [2, 1],
        ];

      expect(result).toStrictEqual(expected);
    });
  });

  describe('checkHasLost', () => {
    it('should call `handleHasLost` callback if lost state is true', () => {
      const handleHasLost = vi.fn(),
        args = {
          prevCoords: [[1, 1]],
          nextCoords: [1, 1],
          handleHasLost,
        };

      checkHasLost(args);
      expect(handleHasLost).toHaveBeenCalled();
    });

    it('should not call `handleHasLost` callback if lost state is false', () => {
      const handleHasLost = vi.fn(),
        args = {
          prevCoords: [[1, 1]],
          nextCoords: [2, 2],
          handleHasLost,
        };

      checkHasLost(args);
      expect(handleHasLost).not.toHaveBeenCalled();
    });
  });

  describe('calculateNextCoords', () => {
    // TODO: for 4 wrapping scenarios
    // it.each();
    // TODO: for 4 immediate direction scenarios
    // it.each();
  });
});
