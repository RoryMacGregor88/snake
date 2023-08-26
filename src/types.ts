export type Coords = [number, number];

export interface Food {
  currentFood: Coords;
  prevFood: Coords;
}

export interface LeaderboardScore {
  name: string;
  score: number;
  date: string;
}
