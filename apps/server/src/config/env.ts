import { Context } from "hono";

import { checkNumber } from "@/server/utils/helpers";

// Define the shape of your environment variables
type PartialEnvType = {
  NODE_ENV: "development" | "production" | "test";
  PORT?: number;
  SESSION_SECRET: string;
  SESSION_MAX_AGE_DAYS?: number;
  SESSION_MAX_AGE_HOURS?: number;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  CLIENT_BASE_URI: string;
  OAUTH_REDIRECT_ENDPOINT: string;
  GOOGLE_ACCOUNTS_URL: string;
  GOOGLE_API_BASE_URL: string;
  GOOGLE_OAUTH_API_BASE_URL: string;
  GOOGLE_OAUTH_SCOPES: string;
  GOOGLE_OAUTH_TOKEN_ENDPOINT: string;
  GOOGLE_API_USER_ENDPOINT: string;
};

export type EnvType = Required<PartialEnvType>;

export const DEFAULT_ENV: Pick<
  EnvType,
  "PORT" | "SESSION_MAX_AGE_DAYS" | "SESSION_MAX_AGE_HOURS"
> = {
  PORT: 3001,
  SESSION_MAX_AGE_DAYS: 1,
  SESSION_MAX_AGE_HOURS: 0,
};

// Helper to load and validate variables
export function getEnv(c: Context): EnvType {
  const source: Record<string, unknown> = c.env;
  const {
    NODE_ENV,
    PORT,
    SESSION_SECRET,
    SESSION_MAX_AGE_DAYS,
    SESSION_MAX_AGE_HOURS,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    CLIENT_BASE_URI,
    OAUTH_REDIRECT_ENDPOINT,
    GOOGLE_ACCOUNTS_URL,
    GOOGLE_API_BASE_URL,
    GOOGLE_OAUTH_API_BASE_URL,
    GOOGLE_OAUTH_SCOPES,
    GOOGLE_OAUTH_TOKEN_ENDPOINT,
    GOOGLE_API_USER_ENDPOINT,
  } = source;

  if (!NODE_ENV) throw new Error("Missing env var: NODE_ENV");
  if (!SESSION_SECRET) throw new Error("Missing env var: SESSION_SECRET");
  if (!GOOGLE_CLIENT_ID) throw new Error("Missing env var: GOOGLE_CLIENT_ID");
  if (!GOOGLE_CLIENT_SECRET)
    throw new Error("Missing env var: GOOGLE_CLIENT_SECRET");
  if (!CLIENT_BASE_URI) throw new Error("Missing env var: CLIENT_BASE_URI");
  if (!OAUTH_REDIRECT_ENDPOINT)
    throw new Error("Missing env var: OAUTH_REDIRECT_ENDPOINT");
  if (!GOOGLE_ACCOUNTS_URL)
    throw new Error("Missing env var: GOOGLE_ACCOUNTS_URL");
  if (!GOOGLE_API_BASE_URL)
    throw new Error("Missing env var: GOOGLE_API_BASE_URL");
  if (!GOOGLE_OAUTH_API_BASE_URL)
    throw new Error("Missing env var: GOOGLE_OAUTH_API_BASE_URL");
  if (!GOOGLE_OAUTH_SCOPES)
    throw new Error("Missing env var: GOOGLE_OAUTH_SCOPES");
  if (!GOOGLE_OAUTH_TOKEN_ENDPOINT)
    throw new Error("Missing env var: GOOGLE_OAUTH_TOKEN_ENDPOINT");
  if (!GOOGLE_API_USER_ENDPOINT)
    throw new Error("Missing env var: GOOGLE_API_USER_ENDPOINT");

  return {
    NODE_ENV: NODE_ENV as PartialEnvType["NODE_ENV"],
    PORT: Number(PORT) || DEFAULT_ENV.PORT,
    SESSION_SECRET: SESSION_SECRET as string,
    GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: GOOGLE_CLIENT_SECRET as string,
    CLIENT_BASE_URI: CLIENT_BASE_URI as string,
    OAUTH_REDIRECT_ENDPOINT: OAUTH_REDIRECT_ENDPOINT as string,
    GOOGLE_ACCOUNTS_URL: GOOGLE_ACCOUNTS_URL as string,
    GOOGLE_API_BASE_URL: GOOGLE_API_BASE_URL as string,
    GOOGLE_OAUTH_API_BASE_URL: GOOGLE_OAUTH_API_BASE_URL as string,
    GOOGLE_OAUTH_SCOPES: GOOGLE_OAUTH_SCOPES as string,
    GOOGLE_OAUTH_TOKEN_ENDPOINT: GOOGLE_OAUTH_TOKEN_ENDPOINT as string,
    GOOGLE_API_USER_ENDPOINT: GOOGLE_API_USER_ENDPOINT as string,
    SESSION_MAX_AGE_DAYS: checkNumber(
      SESSION_MAX_AGE_DAYS,
      DEFAULT_ENV.SESSION_MAX_AGE_DAYS,
    ), // Enable Days to be 0
    SESSION_MAX_AGE_HOURS: checkNumber(
      SESSION_MAX_AGE_HOURS,
      DEFAULT_ENV.SESSION_MAX_AGE_HOURS,
    ),
  };
}
