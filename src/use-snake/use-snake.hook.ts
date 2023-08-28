import { useState, useEffect } from 'react';

import { format } from 'date-fns';

import {
  INITIAL_COORDS,
  INITIAL_SPEED,
  MAX_SPEED,
  SPEED_REDUCTION,
  DIRECTION_KEYS,
  OPPOSITE_KEYS,
} from '../constants';

import { Coords, LeaderboardScore, Food } from '../types';

import {
  checkHasLost,
  calculateNextCoords,
  getRandomFood,
} from '../utils/utils';

/** Mocked for now, will be real data soon */
const INITIAL_HIGH_SCORES = [
  'BigRoro',
  'JumboHaggis',
  'BigG',
  'SomeGuy76',
  'Rando88',
].map((name, i) => ({
  name,
  score: i * 3,
  date: '21/07/2023',
}));

interface Props {
  boxes: Coords[];
}

const useSnake = ({ boxes }: Props) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [snakeCoords, setSnakeCoords] = useState<Coords[]>(INITIAL_COORDS);
  const [currentDirection, setCurrentDirection] = useState('');
  const [currentSpeed, setCurrentSpeed] = useState(INITIAL_SPEED);
  const [hasLost, setHasLost] = useState(false);

  const [leaderboardScores, setLeaderboardScores] =
    useState<LeaderboardScore[]>(INITIAL_HIGH_SCORES);

  /**
   * Initialises food and look-ahead food while making sure the
   * look-ahead food is not the same coords as the starting food
   */
  const initialiseFood = () => {
    // TODO: don't like repeating args
    const currentFood = getRandomFood({ boxes, snakeCoords });
    return {
      currentFood,
      nextFood: getRandomFood({ boxes, snakeCoords, currentFood }),
    };
  };

  const [food, setFood] = useState<Food>(initialiseFood);

  useEffect(() => {
    if (!hasStarted || hasLost) return;
    setTimeout(() => moveSnake({ key: currentDirection }), currentSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snakeCoords, hasStarted, hasLost]);

  /**
   * Add window listener for arrow key presses,
   * unmount, remount whenever snake eats
   */
  useEffect(() => {
    window.addEventListener('keydown', updateDirection);

    /** Cleanup, so that listener isn't added over and over */
    return () => window.removeEventListener('keydown', updateDirection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [food, currentDirection]);

  const currentHighScore = leaderboardScores.reduce(
    (acc, { score }) => (score > acc ? score : acc),
    0
  );

  const score = snakeCoords.length - 1,
    isHighScore = score > currentHighScore;

  const handleHasLost = () => {
    setHasLost(true);
    /** Prevent further movement of snake */
    window.removeEventListener('keydown', updateDirection);
  };

  // TODO: extract
  const handleSaveHighScore = (playerData: { name: string; score: number }) => {
    const today = new Date(),
      date = format(today, 'dd/LL/uuuu');

    const newHighScore = { ...playerData, date };
    setLeaderboardScores((prev) => [newHighScore, ...prev]);
  };

  // TODO: extract
  const checkIsEating = ({ nextCoords }: { nextCoords: Coords }) => {
    const [lat, lon] = nextCoords;

    const { currentFood } = food;
    const [foodLat, foodLon] = currentFood;

    const isEating = foodLat === lat && foodLon === lon;

    if (isEating) {
      /** NextFood from last iteration is currentFood next time around */
      setFood(({ nextFood }) => {
        const currentFood = nextFood;
        return {
          currentFood,
          nextFood: getRandomFood({ boxes, snakeCoords, currentFood }),
        };
      });
    }
    return isEating;
  };

  // TODO: extract
  const handleChecks = (prevCoords: Coords[], nextCoords: Coords) => {
    checkHasLost({ prevCoords, nextCoords, handleHasLost });

    const isEating = checkIsEating({ nextCoords });
    return isEating;
  };

  interface GetNextCoordsArgs {
    prevCoords: Coords[];
    key: string;
  }

  // TODO: extract
  const getNextCoords = ({ prevCoords, key }: GetNextCoordsArgs) => {
    const nextCoords = calculateNextCoords({
      head: prevCoords[prevCoords.length - 1],
      arrowKey: key,
    });

    const isEating = handleChecks(prevCoords, nextCoords);

    /** Reduce time between moves each time snake eats */
    if (isEating) {
      if (currentSpeed !== MAX_SPEED) {
        setCurrentSpeed((prev) => prev - SPEED_REDUCTION);
      }

      /** If isEating, add new coords as head (effectively increments tail length) */
      return [...prevCoords, nextCoords];
    }

    /**
     * If not eating, filter first coord, replace head with new coords
     * (effectively retains current tail length)
     */
    const filteredTail = prevCoords.filter((_, i) => i !== 0);
    return [...filteredTail, nextCoords];
  };

  const moveSnake = ({ key }: { key: string }) => {
    if (currentDirection !== key) setCurrentDirection(key);
    setSnakeCoords((prevCoords) => getNextCoords({ prevCoords, key }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const updateDirection = ({ key }: { key: string }) => {
    /** Prevent non-directional keys */
    if (!DIRECTION_KEYS[key]) return;

    /** Prevent 180 degree turn */
    if (key === OPPOSITE_KEYS[currentDirection]) return;

    /** Start game if not already */
    if (!hasStarted) setHasStarted(true);
    setCurrentDirection(key);
  };

  const reset = () => {
    setSnakeCoords(INITIAL_COORDS);
    setCurrentSpeed(INITIAL_SPEED);
    setHasStarted(false);
    setCurrentDirection('');
    initialiseFood();
    if (hasLost) {
      setHasLost(false);
      /**
       * If `hasLost` is true, the keydown listener will have been removed.
       * If not, the game has simply been reset, and listener must not be
       * added twice
       */
      window.addEventListener('keydown', updateDirection);
    }
  };

  const fns = { handleSaveHighScore, reset },
    state = {
      score,
      isHighScore,
      snakeCoords,
      food,
      currentDirection,
      leaderboardScores,
      hasLost,
      hasStarted,
      currentSpeed,
    };

  return { ...fns, ...state };
};

export default useSnake;
