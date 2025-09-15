import { MiddlewareHandler } from "hono";

import { sendAPIError } from "../lib/response";
import { validateRequestSession } from "../services/session.service";

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
