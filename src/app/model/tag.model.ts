import {Game} from "./game.model";

export interface Tag {
  id: number
  name: string
  description: string
  games: [Game["id"]]
}
