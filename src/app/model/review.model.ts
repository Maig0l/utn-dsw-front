import { User } from './user.model';
import { Game } from './game.model';

export interface Review {
  id: number;
  author: User;
  game: Game;
  score: number;
  title?: string;
  body?: string;
  createdAt: Date;
}
