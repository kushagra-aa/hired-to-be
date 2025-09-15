import type { Config } from "drizzle-kit";

export default {
  schema: "./src/database/models/index.ts",
  out: "../../migrations",
  driver: "d1-http",
  dialect: "sqlite",
} satisfies Config;
