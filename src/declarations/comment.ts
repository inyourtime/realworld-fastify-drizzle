import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { comments } from '../db/schema';
import { IProfileResponse, IUserWithFollower } from './user';

export type TCreateComment = InferInsertModel<typeof comments>;
export type TSelectComment = InferSelectModel<typeof comments>;

export type TCustomSelectComment = Omit<TSelectComment, 'authorId'>;
export interface ICommentWithAuthor extends TCustomSelectComment {
  author: IUserWithFollower;
}

export type TBaseCommentResponse = Pick<
  TSelectComment,
  'id' | 'body' | 'createdAt' | 'updatedAt'
>;

export interface ICommentResponse extends TBaseCommentResponse {
  author: IProfileResponse;
}
