import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiRequest } from '../../declarations/api';
import { TUserCreateSchema, TUserLoginSchema } from './user.schema';
import { createUser, userByEmail, userResponse } from './user.service';
import { checkPassword, hashPassword } from '../../utils/bcrypt';

type CreateUserApi = ApiRequest<{ Body: TUserCreateSchema }>;
export async function register(
  request: FastifyRequest<CreateUserApi>,
  reply: FastifyReply,
) {
  try {
    const hash = await hashPassword(request.body.password);
    const user = await createUser({ ...request.body, password: hash });
    return {
      user: userResponse(user, { token: true }),
    };
  } catch (err) {
    throw err;
  }
}

type LoginUserApi = ApiRequest<{ Body: TUserLoginSchema }>;
export async function login(
  request: FastifyRequest<LoginUserApi>,
  reply: FastifyReply,
) {
  const { email, password } = request.body;

  const user = await userByEmail(email);
  if (!user) throw new Error('Email or password are incorrect');

  const match = await checkPassword(password, user.password);
  if (!match) throw new Error('Email or password are incorrect');

  return {
    user: userResponse(user, { token: true }),
  };
}
