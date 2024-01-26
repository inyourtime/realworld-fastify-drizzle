import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { IAnyObject } from '../declarations/api';

export const isFormdataFromBodyParser = (data: any): boolean => {
  const fieldSet = new Set([
    'encoding',
    'fieldname' /*, "fieldnameTruncated"*/,
    'fields',
    'mimetype' /*, "value", "valueTruncated"*/,
  ]);
  return Object.keys(data).some((key) => {
    return Array.from(fieldSet).some((field) =>
      Object.prototype.hasOwnProperty.call(data[key], field),
    );
  });
};

export const convertFormdataToObject = (data: any) => {
  return Object.entries(data).reduce(
    (previousValue: IAnyObject, [key, value]) => {
      previousValue[key] = (<any>value).value ?? value;
      return previousValue;
    },
    {},
  );
};

export interface BodyParserPluginOptions {
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<BodyParserPluginOptions>(
  async (fastify, opts) => {
    fastify.addHook(
      'preValidation',
      async (request: FastifyRequest, reply: FastifyReply) => {
        if (isFormdataFromBodyParser(request.body)) {
          request.body = convertFormdataToObject(request.body);
        }
      },
    );
  },
  { name: '@own/bodyparser' },
);

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {}
