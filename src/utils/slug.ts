import slugify from 'slugify';

export const slug = (title: string) =>
  slugify(title, { lower: true, replacement: '-' });

declare module 'fastify' {
  export interface FastifyInstance {
    slug: typeof slug;
  }
}
