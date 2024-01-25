import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { buildServer } from './utils/server';
import { db } from './db';
import env from './config/env';

(async () => {
  const app = await buildServer();

  try {
    await migrate(db, { migrationsFolder: './migrations' });
    await app.listen({ port: env.PORT });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
