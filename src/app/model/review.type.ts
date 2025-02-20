import {User} from "../components/services/auth/user";
import {Game} from "../components/services/game.service";

export type Review = {
  id: number,
  author: User,
  game: Game,
  score: number,
  title?: string,
  body?: string
}
