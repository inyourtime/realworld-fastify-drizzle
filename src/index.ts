import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { buildServer } from './utils/server';
import { db } from './db';
import env from './config/env';
import { sql } from 'drizzle-orm';

(async () => {
  const app = await buildServer();

  try {
    // await migrate(db, { migrationsFolder: './migrations' });
    await db.execute(sql`select 1`);
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
