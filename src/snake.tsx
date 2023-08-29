import { useMemo } from 'react';

import { GameOverDialog, Grid, LeaderBoard, StatsPanel } from './components';

import useSnake from './use-snake/use-snake.hook';

import { createGrid } from './utils/utils';

import './sass/snake.scss';

function Snake() {
  const boxes = useMemo(() => createGrid(), []);

  const {
    score,
    isHighScore,
    snakeCoords,
    food,
    currentDirection,
    currentSpeed,
    leaderboardScores,
    hasLost,
    hasStarted,
    handleSaveHighScore,
    reset,
  } = useSnake({ boxes });

  return (
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
          currentDirection={currentDirection}
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
          onResetClick={reset}
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
