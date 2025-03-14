export interface Playlist {
  id: number;
  name: string;
  description: string;
  isPrivate: boolean;
  owner: number; //TODO: Cambiar por User
  games: number; //TODO: Cambiar por Game
}
