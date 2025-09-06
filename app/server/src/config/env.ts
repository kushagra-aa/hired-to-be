import { Context } from "hono";

import { checkNumber } from "@server/utils/helpers.js";

// Define the shape of your environment variables
type Env = {
  NODE_ENV: "development" | "production" | "test";
  PORT?: number;
  SESSION_SECRET: string;
  SESSION_MAX_AGE_DAYS?: number;
  SESSION_MAX_AGE_HOURS?: number;
};

export const DEFAULT_ENV: Pick<
  Required<Env>,
  "PORT" | "SESSION_MAX_AGE_DAYS" | "SESSION_MAX_AGE_HOURS"
> = {
  PORT: 3001,
  SESSION_MAX_AGE_DAYS: 1,
  SESSION_MAX_AGE_HOURS: 0,
};

// Helper to load and validate variables
export function getEnv(c: Context): Required<Env> {
  const source: Record<string, unknown> = c.env;

  const {
    NODE_ENV,
    PORT,
    SESSION_SECRET,
    SESSION_MAX_AGE_DAYS,
    SESSION_MAX_AGE_HOURS,
  } = source;

  if (!NODE_ENV) throw new Error("Missing env var: NODE_ENV");
  if (!SESSION_SECRET) throw new Error("Missing env var: SESSION_SECRET");

  return {
    NODE_ENV: NODE_ENV as Env["NODE_ENV"],
    PORT: Number(PORT) || DEFAULT_ENV.PORT,
    SESSION_SECRET: SESSION_SECRET as string,
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
