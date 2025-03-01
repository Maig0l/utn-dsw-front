import { Game } from './game.model';

export interface Franchise {
  id: number;
  name: string;
  games: Game[];
}
