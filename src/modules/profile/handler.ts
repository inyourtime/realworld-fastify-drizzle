import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ApiRequest } from '../../declarations/api';
import { Err404UserNotFound } from '../../utils/exceptions/user';

type GetProfileApi = ApiRequest<{ Params: { username: string } }>;
export async function getProfile(
  this: FastifyInstance,
  request: FastifyRequest<GetProfileApi>,
  reply: FastifyReply,
) {
  const target = await this.profileService.get(request.params.username);
  if (!target) throw Err404UserNotFound;

  if (request.auth) {
    const loginUser = await this.userService.findById(request.auth.userId);
    if (!loginUser) throw Err404UserNotFound;

    return {
      profile: this.profileService.response(target, loginUser.id),
    };
  }

  return {
    profile: this.profileService.response(target),
  };
}

type FollowUserApi = ApiRequest<{ Params: { username: string } }>;
export async function followUser(
  this: FastifyInstance,
  request: FastifyRequest<FollowUserApi>,
  reply: FastifyReply,
) {
  const [loginUser, targetUser] = await Promise.all([
    this.userService.findById(request.auth!.userId),
    this.profileService.get(request.params.username),
  ]);
  if (!loginUser || !targetUser) throw Err404UserNotFound;

  let response = {
    profile: this.profileService.response(targetUser, loginUser.id),
  };

  try {
    await this.profileService.follow(loginUser.id, targetUser.id);
    response.profile.following = true;
    return response;
  } catch (err: any) {
    if (err.code === '23505') {
      return response;
    }
    throw err;
  }
}

type UnFollowUserApi = ApiRequest<{ Params: { username: string } }>;
export async function unFollowUser(
  this: FastifyInstance,
  request: FastifyRequest<UnFollowUserApi>,
  reply: FastifyReply,
) {
  const [loginUser, targetUser] = await Promise.all([
    this.userService.findById(request.auth!.userId),
    this.profileService.get(request.params.username),
  ]);
  if (!loginUser || !targetUser) throw Err404UserNotFound;

  let response = {
    profile: this.profileService.response(targetUser, loginUser.id),
  };

  await this.profileService.unFollow(loginUser.id, targetUser.id);

  response.profile.following = false;
  return response;
}
