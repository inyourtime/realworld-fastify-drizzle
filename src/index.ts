import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { buildServer } from './utils/server';
import { db } from './db';
import env from './config/env';
import { sql } from 'drizzle-orm';

(async () => {
  const app = await buildServer();

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
    app.log.info('Database conected ^_^');

    /*
      Server start listening
    */
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
