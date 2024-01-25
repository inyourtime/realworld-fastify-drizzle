import { RequestGenericInterface } from 'fastify';

export type TApiRequest<T extends RequestGenericInterface> = {
  [P in keyof T]: T[P];
};
