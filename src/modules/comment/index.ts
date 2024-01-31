import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import { commentCreateSchema } from './schema';

export default async function (fastify: FastifyInstance) {
  const apiModule = '/articles';

  fastify.route({
    method: 'POST',
    url: `${apiModule}/:slug/comments`,
    config: {
      auth: true,
    },
    schema: { body: commentCreateSchema },
    handler: handler.addCommentsToArticle,
  });

  fastify.route({
    method: 'GET',
    url: `${apiModule}/:slug/comments`,
    config: {
      auth: 'OPTIONAL',
    },
    handler: handler.getCommentsFromArticle,
  });

  fastify.route({
    method: 'DELETE',
    url: `${apiModule}/:slug/comments/:id`,
    config: {
      auth: true,
    },
    handler: handler.deleteComment,
  });
}
