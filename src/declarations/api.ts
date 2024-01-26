import { RouteGenericInterface } from 'fastify';

export type ApiRequest<T extends RouteGenericInterface> = {
  [P in keyof T]: T[P];
};

export interface IAnyObject {
  [key: string]: any;
}
