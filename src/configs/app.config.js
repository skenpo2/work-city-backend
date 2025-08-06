import getEnv from '../utils/getEnv.js';

const appConfig = () => ({
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: getEnv('PORT', '5000'),
  BASE_PATH: getEnv('BASE_PATH', '/api'),
  FRONTEND_ORIGIN: getEnv('FRONTEND_ORIGIN', ''),
  ACCESS_TOKEN: getEnv('ACCESS_TOKEN', ''),
  MONGO_URI: getEnv('MONGO_URI', ''),
});

export const config = appConfig();
