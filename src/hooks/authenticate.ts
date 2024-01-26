import { FastifyReply, FastifyRequest, RouteShorthandOptions } from 'fastify';
import fp from 'fastify-plugin';
import { verifyToken } from '../utils/token';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { IAnyObject } from '../declarations/api';
import {
  Err401MissingAuth,
  Err403TokenExpired,
  Err403TokenInvalid,
} from '../utils/exceptions/authenticate';

type TAuth = boolean | 'OPTIONAL';

export interface AuthenticatePluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<AuthenticatePluginOptions>(
  async (fastify, opts) => {
    fastify.addHook(
      'onRequest',
      async (request: FastifyRequest, reply: FastifyReply) => {
        if (request.is404) return;

        const routeOptions = request.routeOptions.config;
        if (routeOptions.auth === false) return;

        const authHeader = request.headers.authorization;
        if (!authHeader) {
          if (routeOptions.auth === 'OPTIONAL') {
            return;
          }
          throw Err401MissingAuth;
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
          throw Err401MissingAuth;
        }

        const { error, result } = verifyToken(parts[1]);
        if (error) {
          switch (true) {
            case error instanceof TokenExpiredError:
              throw Err403TokenExpired;
            case error instanceof JsonWebTokenError:
              throw Err403TokenInvalid;
          }
        }

        request.auth = <IAnyObject>result;
      },
    );
  },
  { name: '@own/authenticate' },
);

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyContextConfig {
    auth?: TAuth;
  }

  export interface FastifyRequest {
    auth?: IAnyObject;
  }
}
