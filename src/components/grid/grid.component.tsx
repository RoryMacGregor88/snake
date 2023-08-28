import { DIRECTION_KEYS } from '../../constants';
import { Coords, Food } from '../../types';

interface Props {
  boxes: Coords[];
  snakeCoords: Coords[];
  food: Food;
  currentDirection: string;
}

const Grid = ({ boxes, snakeCoords, food, currentDirection }: Props) => (
  <div className='grid'>
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

      const headClasses = `${isHead ? 'body' : ''}`,
        rotationClasses = `${DIRECTION_KEYS[currentDirection] ?? 'ArrowUp'}`;
      return (
        <div key={`${lat}-${lon}`} className={`box  ${headClasses}`}>
          <div className={`hidden ${isHead ? rotationClasses : ''}`}>
            <img className='image' src='/snake.svg' />
          </div>
          <div className={`hidden ${isCurrentFood ? 'show-current-food' : ''}`}>
            <img className='image' src='/lizard.svg' />
          </div>
          <div className={`hidden ${isNextFood ? 'show-next-food' : ''}`}>
            <div className='next-food flash'>#</div>
          </div>
          <div className={`hidden ${isInSnake && !isHead ? 'body' : ''}`}>
            <div className='body-circle' />
          </div>
        </div>
      );
    })}
  </div>
);

export default Grid;
