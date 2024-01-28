import { FastifyInstance } from 'fastify';
import { userCreateSchema, userLoginSchema, userUpdateSchema } from './schema';
import * as handler from './handler';

export default async function (fastify: FastifyInstance) {
  const apiModuleUsers = '/users';
  const apiModuleUser = '/user';

  fastify.route({
    method: 'POST',
    url: `${apiModuleUsers}`,
    config: {
      auth: false,
    },
    schema: {
      body: userCreateSchema,
    },
    handler: handler.register,
  });

  fastify.route({
    method: 'POST',
    url: `${apiModuleUsers}/login`,
    config: {
      auth: false,
    },
    schema: {
      body: userLoginSchema,
    },
    handler: handler.login,
  });

  fastify.route({
    method: 'GET',
    url: `${apiModuleUser}`,
    config: {
      auth: true,
    },
    handler: handler.getCurrentUser,
  });

  fastify.route({
    method: 'PUT',
    url: `${apiModuleUser}`,
    config: {
      auth: true,
    },
    schema: {
      body: userUpdateSchema,
    },
    handler: handler.updateCurrentUser,
  });
}
