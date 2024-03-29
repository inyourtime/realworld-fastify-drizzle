import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { userFollower, users } from '../db/schema';
import { JwtPayload } from 'jsonwebtoken';

export type TCreateUser = InferInsertModel<typeof users>;
export type TSelectUser = InferSelectModel<typeof users>;

export type TUserFollower = InferSelectModel<typeof userFollower>;

export interface IUserWithFollower extends TSelectUser {
  followers: TUserFollower[];
}

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

export interface IUserClaimsDecoded extends IUserClaims, JwtPayload {}

export type TBaseProfileResponse = Pick<
  TSelectUser,
  'username' | 'bio' | 'image'
>;

export interface IProfileResponse extends TBaseProfileResponse {
  following: boolean;
}
