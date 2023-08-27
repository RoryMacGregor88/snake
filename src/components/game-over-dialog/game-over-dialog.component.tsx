import { useState } from 'react';
import { HighScoreForm } from '../../components';

interface Props {
  score: number;
  isHighScore: boolean;
  onResetClick: () => void;
  handleSaveHighScore: (name: string) => void;
}

const GameOverDialog = ({
  score,
  isHighScore,
  onResetClick,
  handleSaveHighScore,
}: Props) => {
  const [showHighScoreForm, setShowHighScoreForm] = useState(false);

  const handleSubmit = (name: string) => {
    handleSaveHighScore(name);
    onResetClick();
  };

  const message = isHighScore
    ? `New High Score: ${score}`
    : `Your Score: ${score}`;
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
            handleCancel={() => setShowHighScoreForm(false)}
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
