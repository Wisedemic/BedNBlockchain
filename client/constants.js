/* This is used to pass down env vars from the server into react. */
import { cleanEnv, str } from 'envalid';

const options = {};

if (process.env.NODE_ENV === 'production') {
  options.dotEnvPath = null;
  options.reporter = ({ errors = {}, env = {} }) => {
    console.log(errors, env);
  };
}
console.log(process.env);
const env = cleanEnv(process.env, {
  VERSION: str({ default: '5.0.0' }),
}, options);

export const { VERSION } = env;

export default env;
