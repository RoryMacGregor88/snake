import { MAX_GRID_SIZE, MIN_GRID_SIZE } from '../constants';
import { Coords } from '../types';

/**
 * Filters out all boxes currently occupied by snake or current
 * food, and returns a random box from those remaining
 */

interface GetRandomNonSnakeBoxArgs {
  boxes: Coords[];
  filterCoords: Coords[];
}

const getRandomNonSnakeBox = ({
  boxes,
  filterCoords,
}: GetRandomNonSnakeBoxArgs) => {
  const filteredBoxes = boxes.filter(([lat, lon]) => {
    const isInSnake = !!filterCoords.find(
      ([currentLat, currentLon]) => currentLat === lat && currentLon === lon
    );

    return isInSnake ? false : true;
  });

  const randomIndex = Math.floor(Math.random() * filteredBoxes.length);
  return filteredBoxes[randomIndex];
};

interface GetRandomFoodArgs {
  boxes: Coords[];
  snakeCoords: Coords[];
  currentFood?: Coords;
}

const getRandomFood = ({
  boxes,
  snakeCoords,
  currentFood,
}: GetRandomFoodArgs) => {
  const filterCoords = !!currentFood
    ? [currentFood, ...snakeCoords]
    : snakeCoords;
  return getRandomNonSnakeBox({ boxes, filterCoords });
};

const createGrid = (
  numberOfTiles = 168,
  maxGridSize = MAX_GRID_SIZE
): Coords[] =>
  new Array(numberOfTiles).fill(undefined).reduce(
    (acc: Coords[]) => {
      const [prevLat, prevLon] = acc[acc.length - 1];

      const isEndOfRow = prevLon === maxGridSize,
        nextLat = isEndOfRow ? prevLat + 1 : prevLat,
        nextLon = isEndOfRow ? 1 : prevLon + 1;

      return [...acc, [nextLat, nextLon]];
    },
    [[1, 1]]
  );

interface CalculateNextCoordsArgs {
  head: Coords;
  arrowKey: string;
}

const calculateNextCoords = ({
  head,
  arrowKey,
}: CalculateNextCoordsArgs): Coords => {
  const [headLat, headLon] = head;

  /** Allows wrapping upon hitting walls/floor/ceiling */
  if (arrowKey === 'ArrowDown' && headLat === MAX_GRID_SIZE) {
    return [MIN_GRID_SIZE, headLon];
  } else if (arrowKey === 'ArrowUp' && headLat === MIN_GRID_SIZE) {
    return [MAX_GRID_SIZE, headLon];
  } else if (arrowKey === 'ArrowRight' && headLon === MAX_GRID_SIZE) {
    return [headLat, MIN_GRID_SIZE];
  } else if (arrowKey === 'ArrowLeft' && headLon === MIN_GRID_SIZE) {
    return [headLat, MAX_GRID_SIZE];
  }

  /** Immediate positions available left/right/up/down */
  const possibleMoves: { [key: string]: Coords } = {
    ArrowLeft: [headLat, headLon - 1],
    ArrowUp: [headLat - 1, headLon],
    ArrowRight: [headLat, headLon + 1],
    ArrowDown: [headLat + 1, headLon],
  };

  return possibleMoves[arrowKey];
};

interface CheckHasLostProps {
  prevCoords: Coords[];
  nextCoords: Coords;
  handleHasLost: () => void;
}

const checkHasLost = ({
  prevCoords,
  nextCoords,
  handleHasLost,
}: CheckHasLostProps) => {
  const hasLost = !!prevCoords.find(([prevLat, prevLon]) => {
    const [lat, lon] = nextCoords;
    return prevLat === lat && prevLon === lon;
  });

  if (hasLost) handleHasLost();
};

export {
  getRandomNonSnakeBox,
  createGrid,
  calculateNextCoords,
  checkHasLost,
  getRandomFood,
};
