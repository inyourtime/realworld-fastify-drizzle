import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { db } from '../../db';
import { and, eq } from 'drizzle-orm';
import { userFollower, users } from '../../db/schema';
import {
  IProfileResponse,
  IUserWithFollower,
  TUserFollower,
} from '../../declarations/user';

class ProfileService {
  constructor() {}

  async get(username: string): Promise<IUserWithFollower | undefined> {
    return db.query.users.findFirst({
      where: eq(users.username, username),
      with: { followers: true },
    });
  }

  async follow(userId: string, followingId: string): Promise<void> {
    await db.insert(userFollower).values({ userId, followingId });
  }

  async unFollow(userId: string, followingId: string): Promise<void> {
    await db
      .delete(userFollower)
      .where(
        and(
          eq(userFollower.userId, userId),
          eq(userFollower.followingId, followingId),
        ),
      );
  }

  private isFollowing(followers: TUserFollower[], userId: string): boolean {
    return followers.filter((ele) => ele.userId === userId).length === 0
      ? false
      : true;
  }

  response(target: IUserWithFollower, userId?: string): IProfileResponse {
    return {
      username: target.username,
      bio: target.bio,
      image: target.image,
      following: userId ? this.isFollowing(target.followers, userId) : false,
    };
  }
}

async function profileService(fastify: FastifyInstance) {
  fastify.decorate('profileService', new ProfileService());
}

export default fp(profileService);

declare module 'fastify' {
  export interface FastifyInstance {
    profileService: ProfileService;
  }
}
