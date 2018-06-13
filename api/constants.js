import { cleanEnv, num, str } from 'envalid';
const options = {};

if (process.env.NODE_ENV === 'production') {
  options.dotEnvPath = null;
  options.reporter = ({ errors = {}, env = {} }) => {
    console.log(errors, env);

  };
}
const env = cleanEnv(process.env, {
  PORT: num({ default: process.env.PORT || 3000 }),
  MONGO_DB_URI: str({ default: process.env.MONGO_DB_URI }),
  SECRET: str({ default: process.env.SECRET })
}, options);

export const { PORT, MONGO_DB_URI, SECRET } = env;

export default env;
