import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: <string>process.env.POSTGRES_URL,
  },
  breakpoints: false,
  verbose: true,
  strict: true,
});
