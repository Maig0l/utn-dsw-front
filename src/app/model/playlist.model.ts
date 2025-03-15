import { Game } from "./game.model.js";

export interface Playlist {
  id: number;
  name: string;
  description: string;
  isPrivate: boolean;
  owner: number; //TODO: Cambiar por User PD: No se si es necesario
  games: Game[];
}
