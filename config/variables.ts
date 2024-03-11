import dotenv from "dotenv";
import { cleanEnv, str, port, bool } from "envalid";

dotenv.config({
  path: `.env`,
});

const env = cleanEnv(process.env, {
  PORT: port(),
  NODE_ENV: str(),
  SERVICE_NAME: str(),
  JWT_SECRET: str(),
  LOG_FORMAT: str(),
  ORIGIN: str(),
  CREDENTIALS: bool(),

  MONGO_URL: str(),
});

export const PORT = env.PORT;
export const ENV = env.NODE_ENV;
export const SERVICE_NAME = env.SERVICE_NAME;
export const JWT_SECRET = env.JWT_SECRET;
export const LOG_FORMAT = env.LOG_FORMAT;
export const ORIGIN = env.ORIGIN;
export const CREDENTIALS = env.CREDENTIALS;

export const MONGO_URL = env.MONGO_URL;
