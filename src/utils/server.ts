import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import zodValidation from './validator';
import userRoutes from '../modules/users/user.route';
import { envToLogger } from './logger';
import errorHook from '../hooks/error';
import authenticateHook from '../hooks/authenticate';

const API_PREFIX = 'api';

export async function buildServer() {
  /*
    Declare your fastify instance.
    - you can custom logging for some environment such development.
  */
  const app = Fastify({
    logger: envToLogger[process.env.NODE_ENV ?? 'development'] ?? true,
  });

  /*
    Register cors.
  */
  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE'],
  });

  /*
    Register this plugin for handle request form-data.
    you can add options about limits or attach them to request.body.
  */
  app.register(fastifyMultipart);

  /*  
    Set validation compiler ::
    with zod or you can add other validator (next).
  */
  app.setValidatorCompiler(({ schema }) => zodValidation.validate(schema));

  /* 
    Register all your plugins on this.
  */
  app.register(authenticateHook);
  app.register(errorHook);

  /*
    Register all your api routes on this.
    base prefix is /api was declare in API_PREFIX.
  */
  app.get('/', { config: { auth: false } }, (req, res) => 'hello');
  app.register(userRoutes, { prefix: API_PREFIX });

  return app;
}
