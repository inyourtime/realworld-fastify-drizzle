import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { articleUserFavourites, articles } from '../db/schema';
import { IProfileResponse, IUserWithFollower } from './user';

export type TCreateArticle = InferInsertModel<typeof articles>;
export type TSelectArticle = InferSelectModel<typeof articles>;
export type TFavouritedUser = InferSelectModel<typeof articleUserFavourites>;

export type TCustomSelectArticle = Omit<TSelectArticle, 'authorId'>;
export interface IArticleWithAuthor extends TCustomSelectArticle {
  author: IUserWithFollower;
  favouritedUsers: TFavouritedUser[];
}

export type TBaseArticleResponse = Pick<
  TSelectArticle,
  | 'slug'
  | 'title'
  | 'description'
  | 'body'
  | 'tagList'
  | 'createdAt'
  | 'updatedAt'
>;

export interface IArticleResponse extends TBaseArticleResponse {
  favorited: boolean;
  favoritesCount: number;
  author: IProfileResponse;
}

export interface IArticleUpdate {
  id: string;
  slug?: string;
  title?: string | undefined;
  description?: string | undefined;
  body?: string | undefined;
  tagList?: string[] | undefined;
}

export interface IArticleFilter {
  tag?: string;
  authorId?: string;
  userId?: string;
}

export interface IBaseArticleQuery {
  limit: number;
  page: number;
}

export interface IArticleQuery extends IArticleFilter, IBaseArticleQuery {}
