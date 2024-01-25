import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import zodValidation from './validator';
import userRoutes from '../modules/users/user.route';

const API_PREFIX = 'api';

export async function buildServer() {
  const app = Fastify({
    logger: true,
  });

  // cors
  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE'],
  });

  // add form parser
  app.register(fastifyMultipart);

  /*  
    set validation compiler ::
    with zod or you can add other validator (next)
  */
  app.setValidatorCompiler(({ schema }) => zodValidation.validate(schema));

  // register some plugins

  // register route

  app.register(userRoutes, { prefix: API_PREFIX });

  app.get('/', (req, res) => 'hello');

  return app;
}
