import { DIRECTION_KEYS } from '../../constants';
import { Coords, Extras, Food } from '../../types';

interface Props {
  boxes: Coords[];
  snakeCoords: Coords[];
  food: Food;
  extras: Extras;
  currentDirection: string;
}

const Grid = ({
  boxes,
  snakeCoords,
  food,
  extras,
  currentDirection,
}: Props) => (
  <div className='grid'>
    {boxes.map(([lat, lon]: Coords) => {
      const isInSnake = !!snakeCoords.find(
        ([matchLat, matchLon]) => matchLat === lat && matchLon === lon
      );

      const [headLat, headLon] = snakeCoords[snakeCoords.length - 1];

      const { currentFood, nextFood } = food;
      const [currentFoodLat, currentFoodLon] = currentFood;
      const [nextFoodLat, nextFoodLon] = nextFood;

      const { bonus, boobyTrap } = extras;
      const [bonusLat, bonusLon] = bonus;
      const [boobyTrapLat, boobyTrapLon] = boobyTrap;

      const isHead = lat === headLat && lon === headLon,
        isCurrentFood = lat === currentFoodLat && lon === currentFoodLon,
        isNextFood = lat === nextFoodLat && lon === nextFoodLon,
        isBonus = lat === bonusLat && lon === bonusLon,
        isBoobyTrap = lat === boobyTrapLat && lon === boobyTrapLon;

      const headClasses = `${isHead ? 'body' : ''}`,
        rotationClasses = `${DIRECTION_KEYS[currentDirection] ?? 'ArrowUp'}`;
      return (
        <div key={`${lat}-${lon}`} className={`box  ${headClasses}`}>
          {/* Snake head */}
          <div className={`hidden ${isHead ? rotationClasses : ''}`}>
            <img className='image' src='/snake.svg' />
          </div>
          {/* Snake body */}
          <div className={`hidden ${isInSnake && !isHead ? 'body' : ''}`}>
            <div className='body-circle' />
          </div>
          {/* Lizard */}
          <div className={`hidden ${isCurrentFood ? 'show-current-food' : ''}`}>
            <img className='image' src='/lizard.svg' />
          </div>
          {/* Look-ahead */}
          <div className={`hidden ${isNextFood ? 'show-next-food' : ''}`}>
            <div className='next-food flash'>#</div>
          </div>
          {/* Bonus */}
          <div className={`hidden ${isBonus ? 'bonus' : ''}`}>
            <img className='image' src='/bonus.svg' />
          </div>
          {/* Booby Trap */}
          <div className={`hidden ${isBoobyTrap ? 'booby-trap' : ''}`}>
            <img className='image' src='/booby-trap.svg' />
          </div>
        </div>
      );
    })}
  </div>
);

export default Grid;
