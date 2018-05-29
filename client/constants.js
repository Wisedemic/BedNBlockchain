/* This is used to pass down env vars from the server into react. */
import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
  VERSION: str({ default: '5.0.0' }),
});

export const { VERSION } = env;

export default env;
