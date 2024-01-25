import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { users } from '../db/schema';

export type TCreateUser = InferInsertModel<typeof users>;
export type TSelectUser = InferSelectModel<typeof users>;

export type TUserLogin = Pick<TSelectUser, 'email' | 'password'>;

export type TBaseUserResponse = Pick<
  TSelectUser,
  'email' | 'username' | 'bio' | 'image'
>;

export interface IUserResponse extends TBaseUserResponse {
  token?: string;
}

export interface IUserResponseOptions {
  token: boolean;
}

export interface IUserClaims {
  userId: string;
  email: string;
}
