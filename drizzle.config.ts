import type { Config } from "drizzle-kit";

export default {
  schema: "./dist/server/src/database/models/index.js",
  out: "./drizzle",
  driver: "d1-http",
  dialect: "sqlite",
} satisfies Config;
