import { FastifyInstance } from 'fastify';
import * as handler from './user.controller';
import { userCreateSchema, userLoginSchema } from './user.schema';

export default async function userRoutes(app: FastifyInstance) {
  const apiModuleUsers = '/users';
  const apiModuleUser = '/user';

  app.post(
    `${apiModuleUsers}`,
    { config: { auth: false }, schema: { body: userCreateSchema } },
    handler.register,
  );

  app.post(
    `${apiModuleUsers}/login`,
    { config: { auth: false }, schema: { body: userLoginSchema } },
    handler.login,
  );

  app.get(
    `${apiModuleUser}`,
    { config: { auth: true } },
    handler.getCurrentUser,
  );

  app.put(
    `${apiModuleUser}`,
    { config: { auth: true }, schema: { body: userCreateSchema } },
    handler.updateUser,
  );
}
