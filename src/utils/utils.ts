import { MAX_GRID_SIZE, MIN_GRID_SIZE } from '../constants';
import { Coords, Extras, Food, HandleChecksArgs } from '../types';

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

    return !isInSnake;
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
  isInvincible: boolean;
}

const checkHasLost = ({
  prevCoords,
  nextCoords,
  isInvincible,
}: CheckHasLostProps) => {
  const hasHitTail = !!prevCoords.find(([prevLat, prevLon]) => {
    const [lat, lon] = nextCoords;
    return prevLat === lat && prevLon === lon;
  });

  const hasLost = !isInvincible && hasHitTail;
  return hasLost;
};

interface CheckIsEatingExtraProps {
  nextCoords: Coords;
  extras: Extras;
}

const checkIsEatingExtra = ({
  nextCoords,
  extras,
}: CheckIsEatingExtraProps) => {
  const [lat, lon] = nextCoords;

  const { bonus, boobyTrap } = extras;

  const [bonusLat, bonusLon] = bonus;
  const [boobyTrapLat, boobyTrapLon] = boobyTrap;

  const isEatingBonus = bonusLat === lat && bonusLon === lon,
    isEatingBoobyTrap = boobyTrapLat === lat && boobyTrapLon === lon;

  return { isEatingBonus, isEatingBoobyTrap };
};

interface CheckIsEatingFoodArgs {
  nextCoords: Coords;
  food: Food;
}

const checkIsEatingFood = ({ nextCoords, food }: CheckIsEatingFoodArgs) => {
  const [lat, lon] = nextCoords;

  const { currentFood } = food;
  const [foodLat, foodLon] = currentFood;

  const isEating = foodLat === lat && foodLon === lon;
  return isEating;
};

interface GetNextCoordsArgs {
  prevCoords: Coords[];
  key: string;
  handleChecks: ({ prevCoords, nextCoords }: HandleChecksArgs) => {
    isEatingFood: boolean;
  };
}

const getNextCoords = ({
  prevCoords,
  key,
  handleChecks,
}: GetNextCoordsArgs) => {
  const nextCoords = calculateNextCoords({
    head: prevCoords[prevCoords.length - 1],
    arrowKey: key,
  });

  const { isEatingFood } = handleChecks({ prevCoords, nextCoords });

  /** If isEatingFood, add new coords as head (effectively increments tail length) */
  if (isEatingFood) return [...prevCoords, nextCoords];

  /**
   * If not eating, filter first coord, replace head with new coords
   * (effectively retains current tail length)
   */
  const filteredTail = prevCoords.filter((_, i) => i !== 0);
  return [...filteredTail, nextCoords];
};

export {
  getRandomNonSnakeBox,
  createGrid,
  calculateNextCoords,
  checkHasLost,
  checkIsEatingExtra,
  checkIsEatingFood,
  getNextCoords,
};
