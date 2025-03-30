import { Playlist } from './playlist.model';
import { Review } from './review.model.js';
import { Tag } from './tag.model.js';


export interface User {
  id: number;
  nick: string;
  email: string;
  profile_img?: string;
  bio_text?: string;
  linked_accounts?: string[];
  playlists: Playlist[];
  likedTags: Tag[];
  reviews: Review[];
}
