interface Props {
  score: number;
  onClick: () => void;
}

const GameOverDialog = ({ score, onClick }: Props) => (
  <div className='lose-container'>
    <div className='lose-popup'>
      <h1>GAME OVER!</h1>
      <h2 className='flash'>Your Score: {score}</h2>
      <button className='eightbit-btn eightbit-btn--reset' onClick={onClick}>
        Try Again
      </button>
    </div>
  </div>
);

export default GameOverDialog;
