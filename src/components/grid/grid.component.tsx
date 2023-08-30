import { DIRECTION_KEYS } from '../../constants';
import { Coords, Extras, Food } from '../../types';

interface Props {
  boxes: Coords[];
  snakeCoords: Coords[];
  food: Food;
  extras: Extras;
  currentDirection: string;
  isInvincible: boolean;
  isPoisoned: boolean;
}

const Grid = ({
  boxes,
  snakeCoords,
  food,
  extras,
  currentDirection,
  isInvincible,
  isPoisoned,
}: Props) => (
  <div
    className={`grid ${isInvincible ? 'grid-invincible' : ''} ${
      isPoisoned ? 'grid-poisoned' : ''
    }`}
  >
    {boxes.map(([lat, lon]: Coords) => {
      const isInSnake = !!snakeCoords.find(
        ([matchLat, matchLon]) => matchLat === lat && matchLon === lon
      );

      const [headLat, headLon] = snakeCoords[snakeCoords.length - 1];

      const { currentFood, nextFood } = food;
      const [currentFoodLat, currentFoodLon] = currentFood;
      const [nextFoodLat, nextFoodLon] = nextFood;

      const isHead = lat === headLat && lon === headLon,
        isCurrentFood = lat === currentFoodLat && lon === currentFoodLon,
        isNextFood = lat === nextFoodLat && lon === nextFoodLon;

      const { bonus, boobyTrap } = extras;
      const [bonusLat, bonusLon] = bonus;
      const [boobyTrapLat, boobyTrapLon] = boobyTrap;

      const isBonus = lat === bonusLat && lon === bonusLon,
        isBoobyTrap = lat === boobyTrapLat && lon === boobyTrapLon;

      const rotationClasses = `${
          DIRECTION_KEYS[currentDirection] ?? 'ArrowUp'
        }`,
        bodyClasses = `hidden ${isInSnake && !isHead ? 'body' : ''}`;

      /** For various icons */
      const currentFoodClasses = `hidden ${
          isCurrentFood ? 'show-current-food' : ''
        }`,
        nextFoodClasses = `hidden ${isNextFood ? 'show-next-food' : ''}`,
        bonusClasses = `hidden ${isBonus ? 'bonus' : ''}`,
        boobyTrapClasses = `hidden ${isBoobyTrap ? 'booby-trap' : ''}`;
      return (
        <div key={`${lat}-${lon}`} className='box'>
          {/* Snake head */}
          <div className={`hidden ${isHead ? rotationClasses : ''}`}>
            <img className='image' src='/snake.svg' />
          </div>
          {/* Snake body */}
          <div className={bodyClasses}>
            <div className='body-circle' />
          </div>
          {/* Lizard */}
          <div className={currentFoodClasses}>
            <img className='image' src='/lizard.svg' />
          </div>
          {/* Look-ahead hint */}
          <div className={nextFoodClasses}>
            <div className='next-food flash'>#</div>
          </div>
          {/* Bonus */}
          <div className={bonusClasses}>
            <img className='image' src='/bonus.svg' />
          </div>
          {/* Booby Trap */}
          <div className={boobyTrapClasses}>
            <img className='image' src='/booby-trap.svg' />
          </div>
        </div>
      );
    })}
  </div>
);

export default Grid;
