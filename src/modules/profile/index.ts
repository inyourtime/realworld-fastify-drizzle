import { FastifyInstance } from 'fastify';
import * as handler from './handler';

export default async function (fastify: FastifyInstance) {
  const apiModule = '/profiles';

  fastify.route({
    method: 'GET',
    url: `${apiModule}/:username`,
    config: {
      auth: 'OPTIONAL',
    },
    handler: handler.getProfile,
  });

  fastify.route({
    method: 'POST',
    url: `${apiModule}/:username/follow`,
    config: {
      auth: true,
    },
    handler: handler.followUser,
  });

  fastify.route({
    method: 'DELETE',
    url: `${apiModule}/:username/follow`,
    config: {
      auth: true,
    },
    handler: handler.unFollowUser,
  });
}
