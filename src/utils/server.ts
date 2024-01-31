import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import zodValidation from './validator';

import { envToLogger } from './logger';
import errorHook from '../hooks/error';
import authenticateHook from '../hooks/authenticate';
import profileRoutes from '../modules/profile';
import articleRoutes from '../modules/article';
import commentRoutes from '../modules/comment';
import bodyparserHook from '../hooks/bodyparser';
import userRoutes from '../modules/user';
import fp from 'fastify-plugin';
import userService from '../modules/user/service';
import profileService from '../modules/profile/service';
import articleService from '../modules/article/service';
import commentService from '../modules/comment/service';
import { slug } from './slug';
import { checkHash, makeHash } from './hash';
import { paginator } from '../plugins/paginator';

const API_PREFIX = 'api';

async function decorateFastifyInstance(fastify: FastifyInstance) {
  // service
  fastify.decorate('makeHash', makeHash);
  fastify.decorate('checkHash', checkHash);
  fastify.decorate('slug', slug);
  fastify.decorate('paginator', paginator);

  fastify.register(userService);
  fastify.register(profileService);
  fastify.register(articleService);
  fastify.register(commentService);
}

async function buildServer() {
  /*
    Declare your fastify instance.
    - you can custom logging for some environment such development.
  */
  const fastify = Fastify({
    logger: envToLogger[process.env.NODE_ENV ?? 'development'] ?? true,
  });

  /*
    Register cors.
  */
  fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE'],
  });

  /*
    Register this plugin for handle request form-data.
    you can add options about limits or attach them to request.body.
  */
  fastify.register(fastifyMultipart, { attachFieldsToBody: true });

  /*  
    Set validation compiler ::
    with zod or you can add other validator (next).
  */
  fastify.setValidatorCompiler(({ schema }) => zodValidation.validate(schema));

  /* 
    Register all your plugins on this.
  */
  fastify.register(authenticateHook);
  fastify.register(errorHook);
  fastify.register(bodyparserHook);
  fastify.register(fp(decorateFastifyInstance));

  /*
    Register all your api routes on this.
    base prefix is /api was declare in API_PREFIX.
  */
  fastify.get('/', { config: { auth: false } }, () => 'hello');

  const _options = { prefix: API_PREFIX };
  fastify
    .register(userRoutes, _options)
    .register(profileRoutes, _options)
    .register(articleRoutes, _options)
    .register(commentRoutes, _options);

  return fastify;
}

export default buildServer;
