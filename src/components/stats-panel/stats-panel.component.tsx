import { MAX_SPEED } from '../../constants';
import IconLegend from '../icon-legend/icon-legend.component';

interface Props {
  score: number;
  currentSpeed: number;
  isInvincible: boolean;
  isPoisoned: boolean;
  onResetClick: () => void;
}

const StatsPanel = ({
  score,
  currentSpeed,
  isInvincible,
  isPoisoned,
  onResetClick,
}: Props) => {
  const metersPerSecond = 1000 / currentSpeed,
    formattedSpeed = Number.isInteger(metersPerSecond)
      ? metersPerSecond
      : metersPerSecond.toFixed(2);
  return (
    <div className='side-box'>
      <h1>Score: {score}</h1>
      {currentSpeed === MAX_SPEED ? (
        <div className='flash maximum-speed'>
          <h2>MAXIMUM SPEED</h2>
        </div>
      ) : (
        <h2>Speed: {formattedSpeed} m/s</h2>
      )}

      <IconLegend isInvincible={isInvincible} isPoisoned={isPoisoned} />

      <div className='button-container'>
        <button className='eightbit-btn' onClick={onResetClick}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default StatsPanel;
