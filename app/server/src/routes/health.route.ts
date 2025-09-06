import { Context, Hono } from "hono";

import { getEnv } from "@server/config/env.js";
import { sendAPIResponse } from "@server/lib/response.js";

export const healthRoutes = new Hono();

healthRoutes.get("", (c: Context) => {
  return sendAPIResponse(c, {
    data: { isWorking: true },
    message: "Server Running Successfully",
    status: 200,
  });
});

healthRoutes.get("/env", (c: Context) => {
  const env = getEnv(c);
  return sendAPIResponse(c, {
    data: { env: env ? true : false },
    message: "Server Running Successfully",
    status: 200,
  });
});
