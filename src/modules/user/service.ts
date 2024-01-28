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
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export class UserService {
  constructor() {}

  async create(data: TCreateUser) {
    return db
      .insert(users)
      .values({ ...data })
      .returning()
      .then(([user]) => user);
  }

  async findByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async findById(id: string) {
    return db.query.users.findFirst({ where: eq(users.id, id) });
  }

  async update(data: TSelectUser) {
    return db
      .update(users)
      .set({ ...data })
      .where(eq(users.id, data.id))
      .returning()
      .then(([user]) => user);
  }

  response(
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
}

async function userService(fastify: FastifyInstance) {
  fastify.decorate('userService', new UserService());
}

export default fp(userService);

declare module 'fastify' {
  export interface FastifyInstance {
    userService: UserService;
  }
}
