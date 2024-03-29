import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import {
  articleCreateSchema,
  articleListQuery,
  articleUpdateSchema,
  baseArticleQuery,
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
    method: 'GET',
    url: `${apiModule}/feed`,
    config: {
      auth: true,
    },
    schema: {
      querystring: baseArticleQuery,
    },
    handler: handler.feedArticles,
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

  fastify.route({
    method: 'DELETE',
    url: `${apiModule}/:slug`,
    config: {
      auth: true,
    },
    handler: handler.deleteArticle,
  });

  fastify.route({
    method: 'POST',
    url: `${apiModule}/:slug/favorite`,
    config: {
      auth: true,
    },
    handler: handler.favoriteArticle,
  });

  fastify.route({
    method: 'DELETE',
    url: `${apiModule}/:slug/favorite`,
    config: {
      auth: true,
    },
    handler: handler.unFavoriteArticle,
  });
}
