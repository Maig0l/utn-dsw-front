export interface Playlist {
  id: number;
  name: string;
  description: string;
  is_private: boolean;
  owner: number; //TODO: Cambiar por User
  games: number; //TODO: Cambiar por Game
}
