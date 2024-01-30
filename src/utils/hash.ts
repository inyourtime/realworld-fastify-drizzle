import { compare, genSaltSync, hash } from 'bcrypt';

export const makeHash = (plain: string) => hash(plain, genSaltSync(10));

export const checkHash = (plain: string, hsh: string) => compare(plain, hsh);

declare module 'fastify' {
  export interface FastifyInstance {
    makeHash: typeof makeHash;
    checkHash: typeof checkHash;
  }
}
