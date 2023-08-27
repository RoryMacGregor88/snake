import { MAX_SPEED } from '../../constants';

interface Props {
  score: number;
  currentSpeed: number;
  onResetClick: () => void;
}

const StatsPanel = ({ score, currentSpeed, onResetClick }: Props) => {
  const metersPerSecond = 1000 / currentSpeed,
    formattedSpeed = Number.isInteger(metersPerSecond)
      ? metersPerSecond
      : metersPerSecond.toFixed(2);
  return (
    <div className='side-box'>
      <h1>Your Score: {score}</h1>
      {currentSpeed === MAX_SPEED ? (
        <div className='flash maximum-speed'>
          <span>🔥</span>
          <h2>MAXIMUM SPEED</h2>
          <span>🔥</span>
        </div>
      ) : (
        <h2>Speed: {formattedSpeed} m/s</h2>
      )}
      <div className='button-container'>
        <button className='eightbit-btn' onClick={onResetClick}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default StatsPanel;
