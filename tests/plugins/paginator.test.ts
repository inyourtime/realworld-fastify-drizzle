import Fastify from 'fastify';
import { paginator } from '../../src/plugins/paginator';

test('Should get correct result of pagination', () => {
  const fastify = Fastify();
  fastify.decorate('paginator', paginator);

  const totalCount = 28;
  const data = Array.from({ length: 5 }, (_, i) => `Item ${i + 1}`);
  const pageSize = 5;

  const result = fastify.paginator(data, totalCount, pageSize, 3);
  console.log(result);
});
