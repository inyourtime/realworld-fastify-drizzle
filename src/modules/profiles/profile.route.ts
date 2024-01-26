import { FastifyInstance } from 'fastify';

export default async function profileRoutes(app: FastifyInstance) {
  const apiModule = '/profile';

  app.get('/aa', { config: { auth: false } }, () => 'asdadasdasdasdsa');
}
