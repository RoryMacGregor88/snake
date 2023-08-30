import { useMemo } from 'react';

import useSnake from './use-snake/use-snake.hook';

import { GameOverDialog, Grid, LeaderBoard, StatsPanel } from './components';

import { createGrid } from './utils/utils';

import { MIN_SCREEN_SIZE } from './constants';

import './sass/snake.scss';

function Snake() {
  const boxes = useMemo(() => createGrid(), []);

  const {
    score,
    isHighScore,
    hasLost,
    hasStarted,
    isPoisoned,
    isInvincible,
    currentDirection,
    currentSpeed,
    leaderboardScores,
    snakeCoords,
    food,
    extras,
    handleSaveHighScore,
    reset,
  } = useSnake({ boxes });

  return window.innerWidth >= MIN_SCREEN_SIZE ? (
    <div className='app-container'>
      <div className='header'>
        <h1>React Snake!</h1>
        <span>Watch out - he gets faster every time he eats!</span>
      </div>

      <div className='grid-container'>
        <LeaderBoard leaderboardScores={leaderboardScores} />

        <Grid
          boxes={boxes}
          snakeCoords={snakeCoords}
          food={food}
          extras={extras}
          currentDirection={currentDirection}
          isInvincible={isInvincible}
          isPoisoned={isPoisoned}
        />

        {hasLost ? (
          <GameOverDialog
            score={score}
            onResetClick={reset}
            isHighScore={isHighScore}
            handleSaveHighScore={(name) => handleSaveHighScore({ name, score })}
          />
        ) : null}

        <StatsPanel
          score={score}
          currentSpeed={currentSpeed}
          isInvincible={isInvincible}
          isPoisoned={isPoisoned}
          onResetClick={reset}
        />
      </div>

      {!hasStarted ? (
        <div>
          <span className='flash'>Press an arrow key to begin</span>
        </div>
      ) : null}
    </div>
  ) : (
    <div className='screen-too-small'>
      <h1>Unable to load.</h1>
      <h3>
        This app is designed for screen sizes of {MIN_SCREEN_SIZE} pixels width
        or more.
      </h3>
      <h3>Your current device width is {innerWidth} pixels.</h3>
    </div>
  );
}

export default Snake;
