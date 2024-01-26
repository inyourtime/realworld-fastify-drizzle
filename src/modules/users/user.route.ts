import { FastifyInstance } from 'fastify';
import * as handler from './user.controller';
import {
  userCreateSchema,
  userLoginSchema,
  userUpdateSchema,
} from './user.schema';

export default async function userRoutes(app: FastifyInstance) {
  const apiModuleUsers = '/users';
  const apiModuleUser = '/user';

  app.route({
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

  app.route({
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

  app.route({
    method: 'GET',
    url: `${apiModuleUser}`,
    config: {
      auth: true,
    },
    handler: handler.getCurrentUser,
  });

  app.route({
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
