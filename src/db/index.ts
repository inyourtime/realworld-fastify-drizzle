import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import env from '../config/env';
import * as schema from './schema';

const pool = new Pool({
  connectionString: env.POSTGRES_URL,
});

export const db = drizzle(pool, { schema });
