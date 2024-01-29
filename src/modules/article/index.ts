import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import {
  articleCreateSchema,
  articleListQuery,
  articleUpdateSchema,
} from './schema';

export default async function (fastify: FastifyInstance) {
  const apiModule = '/articles';

  fastify.route({
    method: 'GET',
    url: `${apiModule}`,
    config: {
      auth: 'OPTIONAL',
    },
    schema: {
      querystring: articleListQuery,
    },
    handler: handler.listArticles,
  });

  fastify.route({
    method: 'POST',
    url: `${apiModule}`,
    config: {
      auth: true,
    },
    schema: {
      body: articleCreateSchema,
    },
    handler: handler.createArticle,
  });

  fastify.route({
    method: 'GET',
    url: `${apiModule}/:slug`,
    config: {
      auth: false,
    },
    handler: handler.getArticle,
  });

  fastify.route({
    method: 'PUT',
    url: `${apiModule}/:slug`,
    config: {
      auth: true,
    },
    schema: {
      body: articleUpdateSchema,
    },
    handler: handler.updateArticle,
  });
}
