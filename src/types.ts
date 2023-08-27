export type Coords = [number, number];

export interface Food {
  currentFood: Coords;
  nextFood: Coords;
}

export interface LeaderboardScore {
  name: string;
  score: number;
  date: string;
}
