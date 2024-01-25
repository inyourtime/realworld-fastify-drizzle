import { cleanEnv, port, str } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const env = cleanEnv(process.env, {
  POSTGRES_URL: str(),
  // MONGO_DB: str(),
  PORT: port(),
  ACCESS_TOKEN_SECRET: str(),
  // S3_ACCOUNT_ID: str(),
  // S3_ACCESS_KEY_ID: str(),
  // S3_SECRET_ACCESS_KEY: str(),
  // S3_BUCKET: str(),
});

export default env;
