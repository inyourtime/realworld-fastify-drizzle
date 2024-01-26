import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';
import {
  IUserResponse,
  IUserResponseOptions,
  TCreateUser,
  TSelectUser,
} from '../../declarations/user';
import { generateAccessToken } from '../../utils/token';

export async function createUser(data: TCreateUser) {
  return db
    .insert(users)
    .values({ ...data })
    .returning()
    .then(([user]) => user);
}

export async function userByEmail(email: string) {
  return db.query.users.findFirst({ where: eq(users.email, email) });
}

export async function getUser(id: string) {
  return db.query.users.findFirst({ where: eq(users.id, id) });
}

export async function updateUser(data: TSelectUser) {
  return db
    .update(users)
    .set({ ...data })
    .where(eq(users.id, data.id))
    .returning()
    .then(([user]) => user);
}

export function userResponse(
  user: TSelectUser,
  options?: IUserResponseOptions | undefined,
): IUserResponse {
  const _options = Object.assign(
    {},
    <IUserResponseOptions>{ token: false },
    options,
  );
  return {
    email: user.email,
    username: user.username,
    bio: user.bio,
    image: user.image,
    token: _options.token
      ? generateAccessToken({ userId: user.id, email: user.email })
      : undefined,
  };
}
