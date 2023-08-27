import { MAX_GRID_SIZE, MIN_GRID_SIZE } from '../constants';
import { Coords } from '../types';

// TODO: make args into options objects

/**
 * Filters out all boxes currently occupied by snake, and
 * returns a random box from those remaining
 */
const getRandomNonSnakeBox = (boxes: Coords[], currentCoords: Coords[]) => {
  const filteredBoxes = boxes.filter(([lat, lon]) => {
    const isInSnake = !!currentCoords.find(
      ([currentLat, currentLon]) => currentLat === lat && currentLon === lon
    );

    return isInSnake ? false : true;
  });

  const randomIndex = Math.floor(Math.random() * filteredBoxes.length);
  return filteredBoxes[randomIndex];
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

export { getRandomNonSnakeBox, createGrid, calculateNextCoords, checkHasLost };
