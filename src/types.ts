export type Coords = [number, number];

export interface Food {
  currentFood: Coords;
  prevFood: Coords;
}

export interface HighScore {
  username: string;
  score: number;
  date: string;
}
