import { useState } from 'react';
import { HighScoreForm } from '../../components';

interface Props {
  score: number;
  currentHighScore: number;
  onResetClick: () => void;
}

// TODO: more tests
const GameOverDialog = ({ score, currentHighScore, onResetClick }: Props) => {
  const [showHighScoreForm, setShowHighScoreForm] = useState(false);

  const handleSubmit = (values) => {
    console.log('VALUES: ', values);
  };

  const isHighScore = score > currentHighScore,
    message = isHighScore ? `New High Score: ${score}` : `Your score: ${score}`;
  return (
    <div className='lose-container'>
      <div className='lose-popup'>
        <h1>GAME OVER</h1>
        <h2 className={`${isHighScore ? 'flash' : ''}`}>{message}</h2>

        {isHighScore && !showHighScoreForm ? (
          <button
            className='eightbit-btn'
            onClick={() => setShowHighScoreForm(true)}
          >
            Save High Score
          </button>
        ) : null}

        {showHighScoreForm ? (
          <HighScoreForm
            handleSubmit={handleSubmit}
            cancel={() => setShowHighScoreForm(false)}
          />
        ) : null}

        {!showHighScoreForm ? (
          <button
            className='eightbit-btn eightbit-btn--reset'
            onClick={onResetClick}
          >
            Try Again
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default GameOverDialog;
