import { useState, useEffect, useMemo } from 'react';

import { GameOverDialog, LeaderBoard, StatsPanel } from './components';

import {
  calculateAvailableFood,
  createGrid,
  calculateNextCoords,
  checkHasLost,
} from './utils/utils';

import {
  DIRECTION_KEYS,
  INITIAL_SPEED,
  MAX_SPEED,
  REDUCTION_SPEED,
  INITIAL_COORDS,
} from './constants';

import { Coords, Food } from './types';

import './sass/snake.scss';

/** Mocked for now, will be real data soon */
const highScores = [
  'Big Roro',
  'JumboHaggis',
  'Big G',
  'BillyBigBaws',
  'Rando88',
].map((username, i) => ({
  username,
  score: i * 6,
  date: '21/07/2023',
}));

function Snake() {
  const [hasStarted, setHasStarted] = useState(false);
  const [snakeCoords, setSnakeCoords] = useState<Coords[]>(INITIAL_COORDS);
  const [currentDirection, setCurrentDirection] = useState('');
  const [currentSpeed, setCurrentSpeed] = useState(INITIAL_SPEED);
  const [hasLost, setHasLost] = useState(false);

  const boxes = useMemo(() => createGrid(), []);
  const getRandomFood = () => calculateAvailableFood(boxes, snakeCoords);

  const [food, setFood] = useState<Food>(() => ({
    currentFood: getRandomFood(),
    prevFood: [0, 0],
  }));

  const currentHighScore = highScores.reduce(
    (acc, { score }) => (score > acc ? score : acc),
    0
  );

  const handleHasLost = () => {
    setHasLost(true);
    /** Prevent further movement of snake */
    window.removeEventListener('keydown', updateDirection);
  };

  const checkIsEating = ({ nextCoords }: { nextCoords: Coords }) => {
    const [lat, lon] = nextCoords;

    const { currentFood } = food;
    const [foodLat, foodLon] = currentFood;

    const isEating = foodLat === lat && foodLon === lon;

    if (isEating) {
      /** CurrentFood from last iteration is prevFood next time around */
      setFood(({ currentFood: prevFood }) => ({
        currentFood: getRandomFood(),
        prevFood,
      }));
    }
    return isEating;
  };

  const handleChecks = (prevCoords: Coords[], nextCoords: Coords) => {
    checkHasLost({ prevCoords, nextCoords, handleHasLost });

    const isEating = checkIsEating({ nextCoords });
    return isEating;
  };

  interface GetNextCoordsArgs {
    prevCoords: Coords[];
    key: string;
  }

  const getNextCoords = ({ prevCoords, key }: GetNextCoordsArgs) => {
    const nextCoords = calculateNextCoords({
      head: prevCoords[prevCoords.length - 1],
      arrowKey: key,
    });

    const isEating = handleChecks(prevCoords, nextCoords);

    /** Reduce speed (ms) each time snake eats */
    if (isEating) {
      if (currentSpeed !== MAX_SPEED) {
        setCurrentSpeed((prev) => {
          console.log('SPEED: ', prev - REDUCTION_SPEED);
          return prev - REDUCTION_SPEED;
        });
      }

      /** If isEating, add new coords as head (effectively increments tail length) */
      return [...prevCoords, nextCoords];
    }

    /**
     * If not eating, filter first coord, replace head with new coords
     * (effectively retains current tail length)
     */
    return [...prevCoords.filter((_, i) => i !== 0), nextCoords];
  };

  const moveSnake = ({ key }: { key: string }) => {
    /** Prevent non-directional keys */
    if (!DIRECTION_KEYS[key]) return;

    if (currentDirection !== key) setCurrentDirection(key);
    setSnakeCoords((prevCoords) => getNextCoords({ prevCoords, key }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const updateDirection = ({ key }: { key: string }) => {
    /** Prevent non-directional keys */
    if (!DIRECTION_KEYS[key]) return;

    /** Start game if not already */
    if (!hasStarted) setHasStarted(true);
    setCurrentDirection(key);
  };

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

  const reset = () => {
    setSnakeCoords(INITIAL_COORDS);
    setCurrentDirection('');
    setCurrentSpeed(INITIAL_SPEED);
    setHasStarted(false);
    setFood({
      currentFood: getRandomFood(),
      prevFood: [0, 0],
    });

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

  useEffect(() => {
    if (!hasStarted || hasLost) return;
    setTimeout(() => moveSnake({ key: currentDirection }), currentSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snakeCoords, hasStarted, hasLost]);

  /** Creates grid */
  const renderBoxes = ([lat, lon]: Coords) => {
    const match = snakeCoords.find(
      ([matchLat, matchLon]) => matchLat === lat && matchLon === lon
    );

    const [headLat, headLon] = snakeCoords[snakeCoords.length - 1];

    const { currentFood, prevFood } = food;

    const [currentFoodLat, currentFoodLon] = currentFood;
    const [prevFoodLat, prevFoodLon] = prevFood;

    const isInSnake = !!match,
      isHead = lat === headLat && lon === headLon,
      isCurrentFood = lat === currentFoodLat && lon === currentFoodLon,
      isPrevFood = lat === prevFoodLat && lon === prevFoodLon;

    const headClasses = `${isHead ? 'body' : ''}`,
      rotationClasses = `${DIRECTION_KEYS[currentDirection] ?? 'ArrowUp'}`;

    return (
      <div key={`${lat}-${lon}`} className={`box  ${headClasses}`}>
        <div className={`hidden ${isHead ? rotationClasses : ''}`}>
          <img className='image' src='/snake.svg' />
        </div>
        <div className={`hidden ${isCurrentFood ? 'show-current-food' : ''}`}>
          <img className='image' src='/lizard.svg' />
        </div>
        <div className={`hidden ${isPrevFood ? 'show-prev-food' : ''}`}>
          <div className='body-circle' style={{ backgroundColor: '#fff' }} />
        </div>
        <div className={`hidden ${isInSnake && !isHead ? 'body' : ''}`}>
          <div className='body-circle' />
        </div>
      </div>
    );
  };

  return (
    <div className='app-container'>
      <div className='header'>
        <h1>Snake!</h1>
        <span>Watch out - he gets faster every time he eats!</span>
      </div>

      <div className='grid-container'>
        <LeaderBoard highScores={highScores} />

        <div className='grid'>{boxes.map(renderBoxes)}</div>

        {hasLost ? (
          <GameOverDialog
            score={100}
            onResetClick={reset}
            currentHighScore={currentHighScore}
          />
        ) : null}

        <StatsPanel
          score={snakeCoords.length - 1}
          currentSpeed={currentSpeed}
          reset={reset}
        />
      </div>

      {!hasStarted ? (
        <div>
          <span className='flash'>Press an arrow key to begin</span>
        </div>
      ) : null}
    </div>
  );
}

export default Snake;
