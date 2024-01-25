import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import env from '../config/env';
import * as schema from './schema';
import { timestamp } from 'drizzle-orm/pg-core';

export const baseTimestamp = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
};

const pool = new Pool({
  connectionString: env.POSTGRES_URL,
});

export const db = drizzle(pool, { schema });
