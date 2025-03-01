import {Review} from "./review.model";
import {Platform} from "./platform.model";
import {Studio} from "./studio.model";
import {Tag} from "./tag.model";

export interface Pictures {
  url: string[];
}

export interface Game {
  id: number;
  title: string;
  synopsis: string;
  releaseDate: string;
  portrait: string;
  banner: string;
  pictures: string[];
  franchise: number;
  tags: Tag[];
  studios: Studio[];
  platforms: Platform[];
  reviews: Review[];
}
