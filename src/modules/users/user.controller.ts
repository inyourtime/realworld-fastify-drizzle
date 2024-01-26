import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiRequest, IAnyObject } from '../../declarations/api';
import {
  TUserCreateSchema,
  TUserLoginSchema,
  TUserUpdateSchema,
} from './user.schema';
import {
  createUser,
  getUser,
  updateUser,
  userByEmail,
  userResponse,
} from './user.service';
import { checkHash, makeHash } from '../../utils/hash';
import {
  Err401LoginFail,
  Err404UserNotFound,
  Err422UserExist,
} from '../../utils/exceptions/user';
import { IUserResponse } from '../../declarations/user';

type UserResponseApi = {
  user: IUserResponse;
};

type CreateUserApi = ApiRequest<{ Body: TUserCreateSchema }>;
export async function register(
  request: FastifyRequest<CreateUserApi>,
  reply: FastifyReply,
): Promise<UserResponseApi> {
  try {
    const hash = await makeHash(request.body.password);
    const user = await createUser({ ...request.body, password: hash });
    return {
      user: userResponse(user, { token: true }),
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
  request: FastifyRequest<LoginUserApi>,
  reply: FastifyReply,
): Promise<UserResponseApi> {
  const { email, password } = request.body;

  const user = await userByEmail(email);
  if (!user) throw Err401LoginFail;

  const match = await checkHash(password, user.password);
  if (!match) throw Err401LoginFail;

  return {
    user: userResponse(user, { token: true }),
  };
}

export async function getCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<UserResponseApi> {
  const { userId } = request.auth!;
  const user = await getUser(userId);
  if (!user) throw Err404UserNotFound;

  return {
    user: userResponse(user),
  };
}

type UpdateUserApi = ApiRequest<{ Body: TUserUpdateSchema }>;
export async function updateCurrentUser(
  request: FastifyRequest<UpdateUserApi>,
  reply: FastifyReply,
): Promise<UserResponseApi> {
  const { userId } = request.auth!;
  const { user, image } = request.body;

  const target = await getUser(userId);
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
    const user = await updateUser(target);
    return {
      user: userResponse(user),
    };
  } catch (err: any) {
    if (err.code === '23505') {
      throw Err422UserExist;
    }
    throw err;
  }
}
