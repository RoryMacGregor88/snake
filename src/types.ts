export type Coords = [number, number];

export interface Food {
  currentFood: Coords;
  nextFood: Coords;
}
export type ExtraType = 'bonus' | 'boobyTrap';

export type Extras = {
  [key in ExtraType]: Coords;
};

export interface LeaderboardScore {
  name: string;
  score: number;
  date: string;
}

export interface HandleChecksArgs {
  prevCoords: Coords[];
  nextCoords: Coords;
}
