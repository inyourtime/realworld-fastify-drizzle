import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import Exception from '../utils/exceptions';

export interface ErrorPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<ErrorPluginOptions>(
  async (fastify, opts) => {
    fastify.addHook(
      'onError',
      async (
        request: FastifyRequest,
        reply: FastifyReply,
        error: FastifyError,
      ) => {
        if (error instanceof Exception) return;
        console.log('from error hook');
        fastify.log.error(error);
      },
    );
  },
  { name: '@own/error-hook' },
);

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {}
