import { FastifyReply, FastifyRequest } from 'fastify';
import { TApiRequest } from '../../declarations/api';
import { TUserCreateSchema } from './user.schema';
import { createUser, userResponse } from './user.service';

type CreateUserApi = TApiRequest<{ Body: TUserCreateSchema }>;
export async function register(
  request: FastifyRequest<CreateUserApi>,
  reply: FastifyReply,
) {
  try {
    const user = await createUser({ ...request.body });
    return {
      user: userResponse(user),
    };
  } catch (err) {
    throw err;
  }
}
