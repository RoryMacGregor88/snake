import { InvincibleIcon, PoisonIcon } from '../icons';
import './icon-legend.scss';

interface Props {
  isInvincible: boolean;
  isPoisoned: boolean;
}

const IconLegend = ({ isInvincible, isPoisoned }: Props) => {
  const invincibleStyles = `${isInvincible ? 'invincible flash' : ''}`,
    poisonedStyles = `${isPoisoned ? 'poisoned flash' : ''}`;
  return (
    <div>
      <div className='legend-item'>
        <div className='next-lizard'>#</div>
        <p>Next Lizard Spawn</p>
      </div>
      <div className={`legend-item ${invincibleStyles}`}>
        <InvincibleIcon />
        <p>Invincible</p>
      </div>
      <div className={`legend-item ${poisonedStyles}`}>
        <PoisonIcon />
        <p>Petrified</p>
      </div>
    </div>
  );
};

export default IconLegend;
