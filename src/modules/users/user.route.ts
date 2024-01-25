import { FastifyInstance } from 'fastify';
import * as handler from './user.controller';
import { userCreateSchema } from './user.schema';

export default async function userRoutes(app: FastifyInstance) {
  const apiModule = '/users';

  app.post(
    `${apiModule}`,
    { schema: { body: userCreateSchema } },
    handler.register,
  );
}
