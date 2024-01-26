import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiRequest } from '../../declarations/api';
import { TUserCreateSchema, TUserLoginSchema } from './user.schema';
import { createUser, getUser, userByEmail, userResponse } from './user.service';
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

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  // console.log(request.parts())
  console.log(request.body);
  return 'sd';
}
