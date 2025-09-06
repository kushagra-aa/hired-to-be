import { MiddlewareHandler } from "hono";

import { sendAPIError } from "@server/lib/response.js";
import { validateRequestSession } from "@server/services/session.service.js";

export const sessionMiddleware: MiddlewareHandler = async (c, next) => {
  const sessionResp = await validateRequestSession(c);
  if (!sessionResp || !sessionResp.session)
    return sendAPIError(c, {
      status: 401,
      message: "User is Unauthorized",
      error: "UnAuthorized",
    });
  c.set("user", { id: sessionResp.session.id, role: sessionResp.session.role });
  await next();
};
