import { Review } from './review.model';
import { Platform } from './platform.model';
import { Studio } from './studio.model';
import { Tag } from './tag.model';
import { Shop } from './shop.model.js';
import { Franchise } from './franchise.model.js';

export interface Game {
  id: number;
  title: string;
  synopsis: string;
  releaseDate: string;
  portrait: string;
  banner: string;
  franchise: Franchise;
  tags: Tag[];
  studios: Studio[];
  platforms: Platform[];
  reviews: Review[];
  shops: Shop[];
  cumulativeRating: number;
  reviewCount: number;
}
