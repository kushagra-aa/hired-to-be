import { drizzle } from "drizzle-orm/d1";

import * as models from "./models/index.js";

export function getDb(env: { DB: D1Database }) {
  return drizzle(env.DB, { schema: models });
}

export type DbType = ReturnType<typeof getDb>;
