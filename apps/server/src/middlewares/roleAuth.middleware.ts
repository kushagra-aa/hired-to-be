import { UserRoleEnum } from "@hiredtobe/shared/entities";
import { Context, Next } from "hono";

import { sendAPIError } from "../lib/response";

export const roleAuthMiddleware = (roles: UserRoleEnum[]) => {
  return async (c: Context, next: Next) => {
    // Assuming session middleware has already populated req.user
    const user = c.get("user");

    if (!user || !user.role) {
      return sendAPIError(c, {
        status: 401,
        message: "User is Unauthorized",
        error: "UnAuthorized",
      });
    }

    const userRole = user.role;

    if (!roles.includes(userRole as UserRoleEnum)) {
      return sendAPIError(c, {
        status: 403,
        message: "Forbidden: Insufficient permissions",
        error: "Forbidden",
      });
    }

    // User is authorized, proceed to the next middleware or route handler
    await next();
  };
};
