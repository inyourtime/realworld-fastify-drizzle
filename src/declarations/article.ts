import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { articles } from '../db/schema';
import { IProfileResponse, IUserWithFollower } from './user';
import { TArticleUpdateSchema } from '../modules/article/schema';

export type TCreateArticle = InferInsertModel<typeof articles>;
export type TSelectArticle = InferSelectModel<typeof articles>;

export type TCustomSelectArticle = Omit<TSelectArticle, 'authorId'>;
export interface IArticleWithAuthor extends TCustomSelectArticle {
  author: IUserWithFollower;
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
