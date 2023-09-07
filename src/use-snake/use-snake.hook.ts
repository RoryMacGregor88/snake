import { useState, useEffect } from 'react'

import { format } from 'date-fns'

import {
  INITIAL_SNAKE_COORDS,
  INITIAL_SPEED,
  MAX_SPEED,
  SPEED_REDUCTION,
  DIRECTION_KEYS,
  OPPOSITE_KEYS,
  EXTRA_TYPES,
  EXTRAS_LIFESPAN,
  DATE_FORMAT,
  INITIAL_EXTRA_COORDS,
  INVINCIBILITY_LIFESPAN,
} from '../constants'

import {
  Coords,
  LeaderboardScore,
  Food,
  Extras,
  ExtraType,
  HandleChecksArgs,
} from '../types'

import {
  checkHasLost,
  getRandomNonSnakeBox,
  checkIsEatingExtra,
  checkIsEatingFood,
  getNextCoords,
} from '../utils/utils'

/** Mocked for now, will be real data soon */
const INITIAL_HIGH_SCORES = [
  'BigRoro',
  'JumboHaggis',
  'BigG',
  'SomeGuy76',
  'Rando88',
].map((name, i) => ({
  name,
  score: i * 3,
  date: '21/07/2023',
}))

interface Props {
  boxes: Coords[]
}

const useSnake = ({ boxes }: Props) => {
  const [hasStarted, setHasStarted] = useState(false)
  const [hasLost, setHasLost] = useState(false)

  const [snakeCoords, setSnakeCoords] = useState<Coords[]>(
    INITIAL_SNAKE_COORDS,
  )

  const [currentDirection, setCurrentDirection] = useState('')
  const [currentSpeed, setCurrentSpeed] = useState(INITIAL_SPEED)

  const [isMoving, setIsMoving] = useState(false)

  const [isInvincible, setIsInvincible] = useState(false)
  const [isPoisoned, setIsPoisoned] = useState(false)

  const [leaderboardScores, setLeaderboardScores] = useState<
    LeaderboardScore[]
  >(INITIAL_HIGH_SCORES)

  /** Wrapper to save duplication of boxes/filterCoords args */
  const getRandomFood = ({
    currentFood,
  }: { currentFood?: Coords } = {}) => {
    const filterCoords = !!currentFood
      ? [currentFood, ...snakeCoords]
      : snakeCoords
    return getRandomNonSnakeBox({ boxes, filterCoords })
  }

  /**
   * Initialises food and look-ahead food while making sure the
   * look-ahead food is not the same coords as the starting food
   */
  const initialiseFood = () => {
    const currentFood = getRandomFood()
    return {
      currentFood,
      nextFood: getRandomFood({ currentFood }),
    }
  }

  const [food, setFood] = useState<Food>(initialiseFood)
  const [extras, setExtras] = useState<Extras>({
    bonus: INITIAL_EXTRA_COORDS,
    boobyTrap: INITIAL_EXTRA_COORDS,
  })

  const currentHighScore = leaderboardScores.reduce(
    (acc, { score }) => (score > acc ? score : acc),
    0,
  )

  const score = snakeCoords.length - 1,
    isHighScore = score > currentHighScore

  const generateExtra = (type: ExtraType) => {
    const { currentFood, nextFood } = food
    const { bonus, boobyTrap } = extras

    /** Filter out bonus/boobyTrap if null */
    let filterCoords = [
      currentFood,
      nextFood,
      bonus,
      boobyTrap,
    ].reduce(
      (acc: Coords[], cur) => (!!cur ? [...acc, cur] : acc),
      [],
    )

    setExtras((prev) => ({
      ...prev,
      [type]: getRandomNonSnakeBox({ boxes, filterCoords }),
    }))

    /** Remove extra after timeout expires */
    setTimeout(() => {
      setExtras((prev) => ({ ...prev, [type]: INITIAL_EXTRA_COORDS }))
    }, currentSpeed * EXTRAS_LIFESPAN)
  }

  /**
   * Generate bonuses at random intervals that
   * will disappear quicker as points increase
   */
  useEffect(() => {
    if (!hasStarted || hasLost) return

    /** Invincibility appears rarely, poison frequently */
    if (score % 7 === 0) generateExtra(EXTRA_TYPES.bonus)
    if (score % 4 === 0) generateExtra(EXTRA_TYPES.boobyTrap)
  }, [score])

  /**
   * This is the engine that drives the snake's movement.
   * Initially, isMoving is false, so the if block runs
   * and the snake moves. isMoving is then set to true, which
   * prevents the if block running, and a timer is initiated
   * to set isMoving back to false when it expires, which will
   * allow the if block to run again
   */
  useEffect(() => {
    if (!hasStarted || hasLost) return
    if (!isMoving) {
      moveSnake({ key: currentDirection })
      setIsMoving(true)
      setTimeout(() => setIsMoving(false), currentSpeed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, hasLost, isMoving])

  /**
   * Add window listener for arrow key presses,
   * unmount, remount whenever snake eats
   */
  useEffect(() => {
    window.addEventListener('keydown', updateDirection)

    /** Cleanup, so that listener isn't added over and over */
    return () =>
      window.removeEventListener('keydown', updateDirection)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [food, currentDirection, isPoisoned])

  const handleHasLost = () => {
    setHasLost(true)
    /** Prevent further movement of snake */
    window.removeEventListener('keydown', updateDirection)
  }

  const handleSaveHighScore = (playerData: {
    name: string
    score: number
  }) => {
    const today = new Date(),
      date = format(today, DATE_FORMAT)

    const newHighScore = { ...playerData, date }
    setLeaderboardScores((prev) => [newHighScore, ...prev])
  }

  const handleChecks = ({
    prevCoords,
    nextCoords,
  }: HandleChecksArgs) => {
    const hasLost = checkHasLost({
      prevCoords,
      nextCoords,
      isInvincible,
    })
    const isEatingFood = checkIsEatingFood({ nextCoords, food })
    const { isEatingBonus, isEatingBoobyTrap } = checkIsEatingExtra({
      nextCoords,
      extras,
    })

    if (hasLost) handleHasLost()

    if (isEatingBonus) {
      handleIsInvincible()

      setExtras((prev) => ({
        ...prev,
        bonus: INITIAL_EXTRA_COORDS,
      }))
    }

    if (isEatingBoobyTrap) {
      handleIsPoisoned()

      setExtras((prev) => ({
        ...prev,
        boobyTrap: INITIAL_EXTRA_COORDS,
      }))
    }

    /** Reduce time between moves each time snake eats */
    if (isEatingFood) {
      /** NextFood from last iteration is currentFood next time around */
      setFood(({ nextFood }) => {
        const currentFood = nextFood
        return {
          currentFood,
          nextFood: getRandomFood({ currentFood }),
        }
      })

      if (currentSpeed !== MAX_SPEED) {
        setCurrentSpeed((prev) => prev - SPEED_REDUCTION)
      }
    }

    return { isEatingFood }
  }

  const handleIsPoisoned = () => {
    /** Cannot be poisoned when invincible */
    if (isInvincible) return

    setIsPoisoned(true)
    // TODO: need to calculate based on speed
    setTimeout(() => setIsPoisoned(false), 5000)
  }

  const handleIsInvincible = () => {
    /** Hitting invincibility cures poison */
    if (isPoisoned) setIsPoisoned(false)

    setIsInvincible(true)

    setTimeout(
      () => setIsInvincible(false),
      currentSpeed * INVINCIBILITY_LIFESPAN,
    )
  }

  const moveSnake = async ({ key }: { key: string }) => {
    if (currentDirection !== key) setCurrentDirection(key)

    setSnakeCoords((prevCoords) =>
      getNextCoords({ prevCoords, key, handleChecks }),
    )
  }

  const updateDirection = ({ key }: { key: string }) => {
    /** Prevent non-directional keys */
    if (!DIRECTION_KEYS[key]) return

    /** Disable movement if snake has been poisoned */
    if (isPoisoned) return

    /** Prevent 180 degree turn */
    if (key === OPPOSITE_KEYS[currentDirection]) return

    /** Start game if not already */
    if (!hasStarted) setHasStarted(true)
    setCurrentDirection(key)
  }

  const reset = () => {
    setSnakeCoords(INITIAL_SNAKE_COORDS)
    setCurrentSpeed(INITIAL_SPEED)
    setHasStarted(false)
    setCurrentDirection('')
    setFood(initialiseFood())

    if (hasLost) {
      setHasLost(false)
      /**
       * If `hasLost` is true, the keydown listener will have been removed.
       * If not, the game has simply been reset, and listener must not be
       * added twice
       */
      window.addEventListener('keydown', updateDirection)
    }
  }

  const fns = { handleSaveHighScore, reset },
    bools = {
      isHighScore,
      hasLost,
      hasStarted,
      isPoisoned,
      isInvincible,
    },
    data = {
      score,
      currentDirection,
      currentSpeed,
      leaderboardScores,
      snakeCoords,
      food,
      extras,
    }

  return { ...fns, ...bools, ...data }
}

export default useSnake
