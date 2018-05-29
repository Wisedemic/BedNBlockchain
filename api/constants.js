import { cleanEnv, num, str } from 'envalid';

const env = cleanEnv(process.env, {
  PORT: num({ default: process.env.PORT || 3000 }),
  MONGO_DB_URI: str(),
  SECRET: str()
});

export const { PORT, MONGO_DB_URI, SECRET } = env;

export default env;
