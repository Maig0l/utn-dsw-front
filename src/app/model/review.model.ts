import { User } from './user.model';
import { Game } from './game.model';

export interface Review {
  id: number;
  author: User;
  game: number;
  score: number;
  title?: string;
  body?: string;
}
