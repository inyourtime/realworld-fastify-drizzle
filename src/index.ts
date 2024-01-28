import { migrate } from 'drizzle-orm/node-postgres/migrator';
import buildServer from './utils/server';
import env from './config/env';
import { sql } from 'drizzle-orm';
import { db } from './db';

(async () => {
  const fastify = await buildServer();

  try {
    /*
      Auto database migration for development environment
    */
    if (env.isDevelopment) {
      await migrate(db, { migrationsFolder: './migrations' });
    }

    /*
      Test database connection
    */
    await db.execute(sql`select 1`);
    fastify.log.info('Database connected ^_^');

    /*
      Server start listening
    */
    await fastify.listen({ port: env.PORT, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
