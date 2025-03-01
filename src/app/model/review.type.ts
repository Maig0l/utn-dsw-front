import {User} from "./user";
import {Game} from "../services/game.service";

export type Review = {
  id: number,
  author: User,
  game: Game,
  score: number,
  title?: string,
  body?: string
}
