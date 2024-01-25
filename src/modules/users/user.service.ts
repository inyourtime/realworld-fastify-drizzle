import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';
import {
  IUserResponse,
  TCreateUser,
  TSelectUser,
  TUserLogin,
} from '../../declarations/user';

export async function createUser(data: TCreateUser) {
  return db
    .insert(users)
    .values({ ...data })
    .returning()
    .then((rs) => rs[0]);
}

export async function loginUser({ email, password }: TUserLogin) {
  return db.query.users
    .findFirst({ where: eq(users.email, email) })
    .then((usr) => {
      if (!usr) throw new Error('user not found');
      return usr;
    });
}

export async function getUser(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id) });
}

export function userResponse(user: TSelectUser, token?: string): IUserResponse {
  return {
    email: user.email,
    username: user.username,
    bio: user.bio,
    image: user.image,
    token,
  };
}
