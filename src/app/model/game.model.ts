import {Tag} from "../services/tag.service";
import {Studio} from "../services/studio.service";
import {IReview} from "../services/review.service";
import {Review} from "./review.model";
import {Platform} from "./platform.model";

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
  reviews: IReview[] | Review[];
}
