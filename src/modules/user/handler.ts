import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ApiRequest, IAnyObject } from '../../declarations/api';
import { IUserResponse } from '../../declarations/user';
import {
  TUserCreateSchema,
  TUserLoginSchema,
  TUserUpdateSchema,
} from './schema';
import { checkHash, makeHash } from '../../utils/hash';
import {
  Err401LoginFail,
  Err404UserNotFound,
  Err422UserExist,
} from '../../utils/exceptions/user';

type UserResponseApi = {
  user: IUserResponse;
};

type CreateUserApi = ApiRequest<{ Body: TUserCreateSchema }>;
export async function register(
  this: FastifyInstance,
  request: FastifyRequest<CreateUserApi>,
  reply: FastifyReply,
): Promise<UserResponseApi> {
  try {
    const hash = await makeHash(request.body.password);
    const user = await this.userService.create({
      ...request.body,
      password: hash,
    });
    return {
      user: this.userService.response(user, { token: true }),
    };
  } catch (err: any) {
    if (err.code === '23505') {
      throw Err422UserExist;
    }
    throw err;
  }
}

type LoginUserApi = ApiRequest<{ Body: TUserLoginSchema }>;
export async function login(
  this: FastifyInstance,
  request: FastifyRequest<LoginUserApi>,
  reply: FastifyReply,
): Promise<UserResponseApi> {
  const { email, password } = request.body;

  const user = await this.userService.findByEmail(email);
  if (!user) throw Err401LoginFail;

  const match = await checkHash(password, user.password);
  if (!match) throw Err401LoginFail;

  return {
    user: this.userService.response(user, { token: true }),
  };
}

export async function getCurrentUser(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<UserResponseApi> {
  const { userId } = request.auth!;

  const user = await this.userService.findById(userId);
  if (!user) throw Err404UserNotFound;

  return {
    user: this.userService.response(user),
  };
}

type UpdateUserApi = ApiRequest<{ Body: TUserUpdateSchema }>;
export async function updateCurrentUser(
  this: FastifyInstance,
  request: FastifyRequest<UpdateUserApi>,
  reply: FastifyReply,
): Promise<UserResponseApi> {
  const { userId } = request.auth!;
  const { user, image } = request.body;

  const target = await this.userService.findById(userId);
  if (!target) throw Err404UserNotFound;

  for (const [key, value] of Object.entries(user)) {
    switch (key) {
      case 'password':
        target[key] = await makeHash(value);
        break;
      default:
        (<IAnyObject>target)[key] = value;
    }
  }

  if (image) {
    target.image = image.filename;
  }

  try {
    const user = await this.userService.update(target);
    return {
      user: this.userService.response(user),
    };
  } catch (err: any) {
    if (err.code === '23505') {
      throw Err422UserExist;
    }
    throw err;
  }
}
